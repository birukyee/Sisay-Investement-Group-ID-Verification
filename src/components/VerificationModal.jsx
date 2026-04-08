
import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { supabase } from '../supabaseClient';
import './VerificationModal.css';

const VerificationModal = ({ onClose, onResult }) => {
  const [method, setMethod] = useState('upload'); // 'camera' or 'upload'

  // 1. New Effect to handle Camera Initialization
  useEffect(() => {
    let scanner = null;

    if (method === 'camera') {
      // Small delay to ensure the #reader div is rendered in the DOM
      setTimeout(() => {
        scanner = new Html5QrcodeScanner("reader", {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          // CRITICAL FOR MOBILE: Requests the back camera
          videoConstraints: {
            facingMode: "environment"
          }
        });

        scanner.render(
          (decodedText) => {
            if (scanner) scanner.clear();
            verifyWithSupabase(decodedText);
          },
          (err) => {
            // Silence common scanning errors to keep console clean
          }
        );
      }, 100);
    }

    // Cleanup: Stop camera when switching tabs or closing modal
    return () => {
      if (scanner) {
        scanner.clear().catch(error => console.error("Failed to clear scanner", error));
      }
    };
  }, [method]); // Re-runs when you switch between 'upload' and 'camera'

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const html5QrCode = new Html5Qrcode("file-reader");
    try {
      const decodedText = await html5QrCode.scanFile(file, true);
      verifyWithSupabase(decodedText);
    } catch (err) {
      alert("No QR code found in this image.");
    }
  };

  const verifyWithSupabase = async (scannedId) => {
    const cleanId = scannedId.includes('|') 
      ? scannedId.split('|')[0].replace('ID:', '').trim() 
      : scannedId.trim();

    const { data } = await supabase
      .from('employees')
      .select('*')
      .eq('id', cleanId)
      .single();

    onResult(data || null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content fade-in">
        <button className="close-x" onClick={onClose}>&times;</button>
        <h2 className="modal-title">Employee Verification</h2>
        <p className="modal-subtitle">Scan a QR code or upload an ID card to verify.</p>

        <div className="tab-switcher">
          <button className={method === 'camera' ? 'active' : ''} onClick={() => setMethod('camera')}>
            📷 Use Camera
          </button>
          <button className={method === 'upload' ? 'active' : ''} onClick={() => setMethod('upload')}>
            📤 Upload File
          </button>
        </div>

        <div className="upload-zone">
          {method === 'upload' ? (
            <label className="drop-area">
              <input type="file" accept="image/*" onChange={handleFileUpload} hidden />
              <div className="upload-icon">↑</div>
              <p><strong>Drag & drop an ID card image</strong></p>
              <p className="subtext">or click to browse · PNG, JPG, WEBP</p>
            </label>
          ) : (
            /* Ensure this div is present for the scanner to mount */
            <div id="reader" style={{ width: '100%' }}></div>
          )}
        </div>
        <div id="file-reader" style={{ display: 'none' }}></div>
      </div>
    </div>
  );
};

export default VerificationModal;