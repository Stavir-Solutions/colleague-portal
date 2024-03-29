import React, { useState } from 'react';
import './EmployeeView.css'; // Import styling
import MyData from './MyData';
import MyTimesheet from './MyTimesheet';
const storedEmployeeName = localStorage.getItem('employee_name');

const EmployeeView = () => {
  const [activeTab, setActiveTab] = useState(null); // Initialize activeTab to null

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setTimeout(() => {
      window.location.replace('/login');
    }, 2000);
  };

  return (
    <div className="employeeview-container">
      <h2>Welcome {storedEmployeeName}</h2>
      <div className="logout-btn">
        <button onClick={handleLogout}>Logout</button>
      </div>
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
      </div>
      <div className="tab-content">
        {activeTab && (
          <>
            {activeTab === 'myData' && <MyData />}
            {activeTab === 'myTimeSheet' && <MyTimesheet />}
          </>
        )}
      </div>
    </div>
  );
}

export default EmployeeView;
