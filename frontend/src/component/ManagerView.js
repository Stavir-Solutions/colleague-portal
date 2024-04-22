import React, { useState, useEffect } from 'react';
import './ManagerView.css'; 
import ReporteeTimeSheet from './ReporteeTimeSheet';
import MyData from './MyData';
import MyTimesheet from './MyTimesheet';
import ReporteeData from './ReporteeData'; 
/*import BASE_URL from './Constants';*/

const ManagerView = () => {
  const [activeTab, setActiveTab] = useState(null); 
  const [authToken, setAuthToken] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false); 

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setAuthToken(storedToken);
    }
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      setAuthToken('');
      setShowSuccessModal(true); 
      setTimeout(() => {
        setShowSuccessModal(false); 
        window.location.replace('/login');
      }, 2000);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
  
  return (
    <div className="managerview-container">
      <div className="logout-btn">
        <button onClick={handleLogout}>Logout</button>
      </div>
      <br></br>
      <br></br>
      <div className="tabs-container">
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
            className={activeTab === 'reporteeData' ? 'active' : ''}
            onClick={() => handleTabChange('reporteeData')}
          >
            Reportee Data
          </button>
          <button
            className={activeTab === 'reportingTimeSheet' ? 'active' : ''}
            onClick={() => handleTabChange('reportingTimeSheet')}
          >
            Reportee Time Sheet
          </button>
        </div>
      </div>
      <h2>Welcome {localStorage.getItem('employee_name')}</h2>
      <div className="tab-content">
        {activeTab && (
          <>
            {activeTab === 'myData' && <MyData />}
            {activeTab === 'reporteeData' && <ReporteeData authToken={authToken} />}
            {activeTab === 'reportingTimeSheet' && <ReporteeTimeSheet />}
            {activeTab === 'myTimeSheet' && <MyTimesheet />}
          </>
        )}
      </div>
      {showSuccessModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowSuccessModal(false)}>&times;</span>
            <p>You have Successfully logged out..Redirecting to login page...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagerView;
