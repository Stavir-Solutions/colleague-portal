import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployeeView.css';
import MyTimesheet from './MyTimesheet'; 

const EmployeeView = () => {
  const [activeTab, setActiveTab] = useState(null);
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'myData') {
      navigate('/mydata');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setTimeout(() => {
      window.location.replace('/login');
    }, 2000);
  };

  return (
    <div className="employeeview-container">
      <h2>Welcome </h2>
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
        {activeTab === 'myTimeSheet' && <MyTimesheet />}
        {activeTab === 'myData' && <p>My Data Content</p>}
      </div>
    </div>
  );
};

export default EmployeeView;
