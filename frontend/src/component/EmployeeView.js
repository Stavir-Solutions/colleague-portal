import React, { useState } from 'react';
import './EmployeeView.css';
import MyData from './MyData';
import MyTimesheet from './MyTimesheet';
import AbsenceData from './AbsenceData'; 
import BASE_URL from './Constants';

const storedEmployeeId = localStorage.getItem('employee_id');
const storedEmployeeName = localStorage.getItem('employee_name');

const EmployeeView = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${BASE_URL}/logout/clear-token/${storedEmployeeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        localStorage.removeItem('token');
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          window.location.replace('/login');
        }, 2000);
      } else {
        console.error('Logout failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div>
      <div className="logout-btn">
        <div className="welcome-message">
          <h2>{storedEmployeeName}</h2>
        </div>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <br />
      <br />
      <br />
      <div className="employeeview-container">
        <div className="tabs">
          <button
            className={activeTab === 'myTimeSheet' ? 'active' : ''}
            onClick={() => handleTabChange('myTimeSheet')}
          >
            My Time Sheet
          </button>
          <button
            className={activeTab === 'myData' ? 'active' : ''}
            onClick={() => handleTabChange('myData')}
          >
            My Data
          </button>
          <button
            className={activeTab === 'AbsenceData' ? 'active' : ''}
            onClick={() => handleTabChange('AbsenceData')}
          >
            Absence Data
          </button>
        </div>
        <div className="tab-content">
          {activeTab && (
            <>
              {activeTab === 'myData' && <MyData />}
              {activeTab === 'myTimeSheet' && <MyTimesheet />}
              {activeTab === 'AbsenceData' && <AbsenceData />} 
            </>
          )}
        </div>
      </div>
      {showSuccessModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close">&times;</span>
            <p>You have Successfully logged out..Redirecting to login page...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeView;
