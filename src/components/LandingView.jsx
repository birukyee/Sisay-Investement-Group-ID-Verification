import React from 'react';
import './LandingView.css';

const LandingView = ({ onVerifyClick }) => {
  return (
    <div className="landing-ui fade-in">
    <div className="landing-container fade-in">
      <div className="shield-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      </div>
      <h1 className="hero-title">SIG Employee ID <br/><span>Verifier</span></h1>
      <p className="hero-description">
        Fast, secure credential verification. Scan a QR code or upload an ID card to authenticate.
      </p>
      <button className="main-verify-btn" onClick={onVerifyClick}>
        <span className="scan-icon">〔 〕</span> Verify Now
      </button>
      <div className="footer-note">
        <span className="fingerprint">☝️</span> Supports QR code scanning & ID card upload
      </div>
    </div>
     </div>
  );
};

export default LandingView;