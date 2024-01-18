import React, { useState, useEffect } from 'react';
import './ManagerView.css'; // styling
import ReporteeTimeSheet from './ReporteeTimeSheet';
import EmployeeList from './EmployeeList';

const ManagerView = () => {
  const [activeTab, setActiveTab] = useState('myTimeSheet');
  const [employeeData, setEmployeeData] = useState([]);
  const [authToken, setAuthToken] = useState('');
  const [error, setError] = useState(null);
  const [timeSheetSummaries, setTimeSheetSummaries] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setError(null);

      try {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
          console.error('Authentication token is missing.');
          return;
        }

        setAuthToken(storedToken);  

        if (activeTab === 'reporteeData') {
          const response = await fetch('http://localhost:3000/api/v1/employees', {
            headers: {
              Authorization: `${authToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setEmployeeData(data);
            console.log('Employee Data:', data);

            
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1; 

            const summaries = {};
            for (const employee of data) {
              console.log('Employee:', employee);

            
              if (employee.employee_id) {
                const timeSheetResponse = await fetch(
                  `http://localhost:3000/api/v1/tmsummary/summary?employee-id=${employee.employee_id}&year=${currentYear}&month=${currentMonth}`,
                  {
                    headers: {
                      Authorization: `${authToken}`,
                    },
                  }
                );

                if (timeSheetResponse.ok) {
                  try {
                    const timeSheetData = await timeSheetResponse.json();
                    console.log('Time Sheet Data:', timeSheetData);
                    summaries[employee.employee_id] = timeSheetData;
                  } catch (error) {
                    console.error('Error parsing time sheet data:', error);
                    setError(`Error parsing time sheet data for ${employee.employee_id}`);
                  }
                } else {
                  console.error(`Error fetching time sheet summary for ${employee.employee_id}:`, timeSheetResponse.statusText);
                  setError(`Error fetching time sheet summary for ${employee.employee_id}`);
                }
              } else {
                console.warn('Employee ID is undefined for:', employee);
              }
            }
            setTimeSheetSummaries(summaries);
          } else {
            console.error('Error fetching employee data:', response.statusText);
            setError('Error fetching employee data');
          }
        }
      } catch (error) {
        console.error('Error in fetchData:', error.message);
        setError('Error in fetchData. Please try again.');
      }
    };

    fetchData();
  }, [activeTab, authToken]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };


  const handleEdit = (employeeId) => {
    
    console.log(`Edit button clicked for employee ID: ${employeeId}`);
  };

  return (
    <div className="managerview-container">
      <h2>Welcome Manager</h2>
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
        {activeTab === 'reporteeData' && (
          <>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {employeeData.length > 0 && (
              <EmployeeList employeeData={employeeData} timeSheetSummaries={timeSheetSummaries} handleEdit={handleEdit} />
            )}
          </>
        )}
        {activeTab === 'reportingTimeSheet' && <ReporteeTimeSheet />}
      </div>
    </div>
  );
};

export default ManagerView;
