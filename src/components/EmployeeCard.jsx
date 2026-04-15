// import React from 'react';
// import './EmployeeCard.css';

// const EmployeeCard = ({ employee, onReset , onVerifyClick }) => {
//   return (
//     <div className="employee-card-container fade-in">
//       <div className="verification-badge">
//         <span className="check-icon">✓</span>
//         VERIFIED MEMBER
//       </div>
      
//       <div className="profile-section">
//         <div className="id-tag">{employee.id}</div>
//         <h2 className="employee-name">{employee.name}</h2>
//         <div className="divider-gold"></div>
//       </div>

//       <div className="info-grid">
//         <div className="info-item">
//           <label>POSITION</label>
//           <p>{employee.position}</p>
//         </div>
//         <div className="info-item">
//           <label>DEPARTMENT</label>
//           <p>{employee.department}</p>
//         </div>
//       </div>

//       <div className="security-footer">
//         <p>Sisay Investment Group Internal Record</p>
//         <button className="done-btn" onClick={onReset}>
//           Confirm & Close
//         </button>
//       </div>
//        <div className="security-footer">
//         <p>Sisay Investment Group Internal Record</p>
//         <button className="done-btn" onClick={onVerifyClick}>
//          Return to verification
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EmployeeCard;
import React from 'react';
import './EmployeeCard.css';

const EmployeeCard = ({ employee, onReset, onVerifyClick }) => {
  return (
    <div className="employee-card-container fade-in">
      {/* 1. Added Profile Image */}
      <div className="profile-image-wrapper">
        <img 
          src={employee.image_url || 'https://via.placeholder.com/150'} 
          alt={employee.name} 
          className="employee-photo"
        />
        <div className="verification-badge-overlay">✓</div>
      </div>

      <div className="verification-badge">
        VERIFIED MEMBER
      </div>
      
      <div className="profile-section">
        <div className="id-tag">ID: {employee.id}</div>
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
        {/* 2. Added Branch Info */}
        <div className="info-item full-width">
          <label>OFFICE BRANCH</label>
          <p>{employee.branch || 'N/A'}</p>
        </div>
      </div>

      <div className="security-footer">
        <p>Sisay Investment Group Internal Record</p>
        <div className="card-actions">
          <button className="done-btn primary" onClick={onReset}>
            Confirm & Close
          </button>
          <button className="done-btn secondary" onClick={onVerifyClick}>
            Back to Scanner
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;