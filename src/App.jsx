
import React, { useState } from 'react';
import LandingView from './components/LandingView';
import VerificationModal from './components/VerificationModal';
import EmployeeCard from './components/EmployeeCard';
import './App.css';

/**
 * Main Controller for the SIG Identity Verification System.
 * Manages the transition between the landing page, the scanning modal, 
 * and the final verification results.
 */
function App() {
  // State management for navigation and data
  const [showModal, setShowModal] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle', 'verified', 'denied'

  /**
   * Processes the result from the VerificationModal.
   * data will be the employee object from Supabase or null if not found.
   */
  const handleVerificationResult = (data) => {
    setShowModal(false);
    
    if (data) {
      setEmployee(data);
      setStatus('verified');
    } else {
      setEmployee(null);
      setStatus('denied');
    }
  };

  /**
   * Resets the application to the initial state for the next scan.
   */
  const resetApp = () => {
    setEmployee(null);
    setStatus('idle');
    setShowModal(false);
  };

  return (
    <div className="app-shell">
      {/* 1. Initial Entry Screen */}
      {status === 'idle' && !showModal && (
        <LandingView onVerifyClick={() => setShowModal(true)} />
      )}

      {/* 2. Verification Logic (Camera/Upload) */}
      {showModal && (
        <VerificationModal 
          onClose={() => setShowModal(false)} 
          onResult={handleVerificationResult} 
        />
      )}

      {/* 3. Success State: Gold & Charcoal Employee Card */}
      {status === 'verified' && employee && (
        <EmployeeCard 
          employee={employee} 
          onReset={resetApp} 
        />
      )}

    

      {/* 4. Failure State: Access Denied */}
{status === 'denied' && (
  <div className="fade-in" style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px'
  }}>
    <div style={{
      background: 'linear-gradient(145deg, #1a1111, #0f0f0f)',
      border: '1px solid #ff4d4d',
      borderRadius: '24px',
      padding: '40px 30px',
      textAlign: 'center',
      maxWidth: '360px',
      boxShadow: '0 15px 35px rgba(255, 77, 77, 0.15), inset 0 0 15px rgba(255, 77, 77, 0.05)'
    }}>
      <div style={{
        width: '60px',
        height: '60px',
        background: 'rgba(255, 77, 77, 0.1)',
        border: '1px solid rgba(255, 77, 77, 0.3)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
        color: '#ff4d4d',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>✕</div>
      
      <h2 style={{
        color: '#ff4d4d',
        fontSize: '1.5rem',
        fontWeight: '800',
        margin: '0 0 10px 0',
        letterSpacing: '1px',
        textTransform: 'uppercase'
      }}>Unauthorized</h2>
      
      <p style={{
        color: '#888',
        fontSize: '0.95rem',
        lineheight: '1.5',
        marginBottom: '30px'
      }}>
        ID not found in <span style={{ color: '#bbb' }}>SIG internal records</span>. 
        Please verify the credential and try again.
      </p>
      
      <button 
        onClick={resetApp}
        style={{
          background: '#ff4d4d',
          color: '#fff',
          border: 'none',
          padding: '12px 30px',
          borderRadius: '12px',
          fontWeight: '700',
          cursor: 'pointer',
          width: '100%',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 15px rgba(255, 77, 77, 0.3)'
        }}
        onMouseOver={(e) => e.target.style.opacity = '0.9'}
        onMouseOut={(e) => e.target.style.opacity = '1'}
      >
        Try Again
      </button>
    </div>
  </div>
)}
    </div>
  );
}

export default App;