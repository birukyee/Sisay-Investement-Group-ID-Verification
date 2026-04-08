import React from 'react';
import './EmployeeCard.css';

const EmployeeCard = ({ employee, onReset }) => {
  return (
    <div className="employee-card-container fade-in">
      <div className="verification-badge">
        <span className="check-icon">✓</span>
        VERIFIED MEMBER
      </div>
      
      <div className="profile-section">
        <div className="id-tag">{employee.id}</div>
        <h2 className="employee-name">{employee.name}</h2>
        <div className="divider-gold"></div>
      </div>

      <div className="info-grid">
        <div className="info-item">
          <label>POSITION</label>
          <p>{employee.position}</p>
        </div>
        <div className="info-item">
          <label>DEPARTMENT</label>
          <p>{employee.department}</p>
        </div>
      </div>

      <div className="security-footer">
        <p>Sisay Investment Group Internal Record</p>
        <button className="done-btn" onClick={onReset}>
          Confirm & Close
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;