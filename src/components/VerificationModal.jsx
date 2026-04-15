
// import React, { useState, useEffect } from 'react';
// import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
// import { supabase } from '../supabaseClient';
// import './VerificationModal.css';

// const VerificationModal = ({ onClose, onResult }) => {
//   const [method, setMethod] = useState('camera'); // 'camera' or 'upload'

//   // 1. New Effect to handle Camera Initialization
//   useEffect(() => {
//     let scanner = null;

//     if (method === 'camera') {
//       // Small delay to ensure the #reader div is rendered in the DOM
//       setTimeout(() => {
//         scanner = new Html5QrcodeScanner("reader", {
//           fps: 10,
//           qrbox: { width: 350, height: 350 },
//           aspectRatio: 1.0,
//           // CRITICAL FOR MOBILE: Requests the back camera
//           videoConstraints: {
//             facingMode: "environment"
//           }
//         });

//         scanner.render(
//           (decodedText) => {
//             if (scanner) scanner.clear();
//             verifyWithSupabase(decodedText);
//           },
//           (err) => {
//             // Silence common scanning errors to keep console clean
//           }
//         );
//       }, 100);
//     }

//     // Cleanup: Stop camera when switching tabs or closing modal
//     return () => {
//       if (scanner) {
//         scanner.clear().catch(error => console.error("Failed to clear scanner", error));
//       }
//     };
//   }, [method]); // Re-runs when you switch between 'upload' and 'camera'

//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const html5QrCode = new Html5Qrcode("file-reader");
//     try {
//       const decodedText = await html5QrCode.scanFile(file, true);
//       verifyWithSupabase(decodedText);
//     } catch (err) {
//       alert("No QR code found in this image.");
//     }
//   };

//   const verifyWithSupabase = async (scannedId) => {
//     const cleanId = scannedId.includes('|') 
//       ? scannedId.split('|')[0].replace('ID:', '').trim() 
//       : scannedId.trim();

//     const { data } = await supabase
//       .from('employees')
//       .select('*')
//       .eq('id', cleanId)
//       .single();

//     onResult(data || null);
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content fade-in">
//         <button className="close-x" onClick={onClose}>&times;</button>
//         <h2 className="modal-title">Employee Verification</h2>
//         <p className="modal-subtitle">Scan a QR code or upload an ID card to verify.</p>

//         <div className="tab-switcher">
//           <button className={method === 'camera' ? 'active' : ''} onClick={() => setMethod('camera')}>
//             📷 Use Camera
//           </button>
//           <button className={method === 'upload' ? 'active' : ''} onClick={() => setMethod('upload')}>
//             📤 Upload File
//           </button>
//         </div>

//         <div className="upload-zone">
//           {method === 'upload' ? (
//             <label className="drop-area">
//               <input type="file" accept="image/*" onChange={handleFileUpload} hidden />
//               <div className="upload-icon">↑</div>
//               <p><strong>Drag & drop an ID card image</strong></p>
//               <p className="subtext">or click to browse · PNG, JPG, WEBP</p>
//             </label>
//           ) : (
//             /* Ensure this div is present for the scanner to mount */
//             <div id="reader" style={{ width: '100%' }}></div>
//           )}
//         </div>
//         <div id="file-reader" style={{ display: 'none' }}></div>
//       </div>
//     </div>
//   );
// };

// export default VerificationModal;

import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { supabase } from '../supabaseClient';
import './VerificationModal.css';

const VerificationModal = ({ onClose, onResult }) => {
  // 1. Set 'camera' as the default state
  const [method, setMethod] = useState('camera'); 
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(null);
  //   let scanner = null;

  //   if (method === 'camera' && !isVerifying) {
  //     const delayTimeout = setTimeout(() => {
  //       scanner = new Html5QrcodeScanner("reader", {
  //         fps: 10,
  //         qrbox: { width: 250, height: 250 },
  //         aspectRatio: 1.0,
  //         videoConstraints: { facingMode: "environment" }
  //       });

  //       scanner.render(
  //         (decodedText) => {
  //           // Stop scanning immediately once a code is found
  //           if (scanner) {
  //             scanner.clear().then(() => {
  //               verifyWithSupabase(decodedText);
  //             }).catch(err => console.error("Scanner clear failed", err));
  //           }
  //         },
  //         (err) => { /* quiet scan errors */ }
  //       );
  //     }, 100);

  //     return () => {
  //       clearTimeout(delayTimeout);
  //       if (scanner) {
  //         scanner.clear().catch(e => console.log("Cleanup error", e));
  //       }
  //     };
  //   }
  // }, [method, isVerifying]);

  useEffect(() => {
  let html5QrCode = null;

  if (method === 'camera' && !isVerifying) {
    const delayTimeout = setTimeout(async () => {
      try {
        // 1. Initialize the engine without the built-in UI
        html5QrCode = new Html5Qrcode("reader");

        // 2. Start the camera immediately
        await html5QrCode.start(
          { facingMode: "environment" }, 
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            // Success! Stop camera and verify
            html5QrCode.stop().then(() => {
              verifyWithSupabase(decodedText);
            });
          },
          (errorMessage) => {
            // Ignore constant "No QR code detected" logs
          }
        );
      } catch (err) {
        console.error("Unable to start camera", err);
        setError("Camera access denied or not available.");
      }
    }, 100);

    return () => {
      clearTimeout(delayTimeout);
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(e => console.log("Cleanup error", e));
      }
    };
  }
}, [method, isVerifying]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);
    const html5QrCode = new Html5Qrcode("file-reader");
    
    try {
      setIsVerifying(true);
      const decodedText = await html5QrCode.scanFile(file, true);
      await verifyWithSupabase(decodedText);
    } catch (err) {
      setIsVerifying(false);
      setError("No QR code found in this image. Please try again.");
    }
  };

  const verifyWithSupabase = async (scannedId) => {
    setIsVerifying(true);
    setError(null);

    try {
      // Clean the ID (handles "ID: 123" or "123|Name" formats)
      const cleanId = scannedId.includes('|') 
        ? scannedId.split('|')[0].replace('ID:', '').trim() 
        : scannedId.replace('ID:', '').trim();

      const { data, error: dbError } = await supabase
        .from('employees')
       .select('id, name, position, department, branch, image_url')
        .eq('id', cleanId)
        .single();

      if (dbError) throw dbError;

      // Send result back to parent component
      onResult(data); 
    } catch (err) {
      console.error("Verification error:", err);
      setError("Employee not found in database.");
      setIsVerifying(false); // Let them try scanning again
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content fade-in">
        <button className="close-x" onClick={onClose} disabled={isVerifying}>&times;</button>
        
        <h2 className="modal-title">Employee Verification</h2>
        <p className="modal-subtitle">
          {isVerifying ? "Verifying with database..." : "Scan a QR code or upload an ID card."}
        </p>

        <div className="tab-switcher">
          <button 
            className={method === 'camera' ? 'active' : ''} 
            onClick={() => setMethod('camera')}
            disabled={isVerifying}
          >
            📷 Use Camera
          </button>
          <button 
            className={method === 'upload' ? 'active' : ''} 
            onClick={() => setMethod('upload')}
            disabled={isVerifying}
          >
            📤 Upload File
          </button>
        </div>

        <div className="upload-zone">
          {isVerifying ? (
            <div className="loading-spinner-container">
              <div className="spinner"></div>
              <p>Checking Credentials...</p>
            </div>
          ) : (
            <>
              {method === 'upload' ? (
                <label className="drop-area">
                  <input type="file" accept="image/*" onChange={handleFileUpload} hidden />
                  <div className="upload-icon">↑</div>
                  <p><strong>Drag & drop an ID card image</strong></p>
                  <p className="subtext">or click to browse</p>
                </label>
              ) : (
                <div id="reader" style={{ width: '100%' }}></div>
              )}
            </>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}
        
        <div id="file-reader" style={{ display: 'none' }}></div>
      </div>
    </div>
  );
};

export default VerificationModal;