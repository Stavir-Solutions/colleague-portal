import React, { useState } from 'react';
import './ManagerView.css'; // styling 
import ReporteeTimeSheet from './ReporteeTimeSheet'; 

const ManagerView = () => {
  const [activeTab, setActiveTab] = useState('myTimeSheet');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="managerview-container">
      <h2>Welcome Manager </h2>
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
      <div className="tab-content">
        {activeTab === 'myTimeSheet' && <p>My Time Sheet Content</p>}
        {activeTab === 'myData' && <p>My Data Content</p>}
        {activeTab === 'reporteeData' && <p>Reportee Data Content</p>}
        {activeTab === 'reportingTimeSheet' && <ReporteeTimeSheet />}
      </div>
    </div>
  );
};

export default ManagerView;
