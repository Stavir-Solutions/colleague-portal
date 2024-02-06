import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './EmployeeView.css'; // styling

const EmployeeView = () => {
  const [activeTab, setActiveTab] = useState(null); // Initialize activeTab with null
  const [employeeData, setEmployeeData] = useState([]);
  const [authToken, setAuthToken] = useState('');
  const [error, setError] = useState(null);
  const [logoutPopup, setLogoutPopup] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [timeSheetEntries, setTimeSheetEntries] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchData = async () => {
      setError(null);

      try {
        if (activeTab === 'myTimeSheet') {
          const employeeId = localStorage.getItem('employee_id');
          const formattedMonth = selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth;
          const apiUrl = `http://localhost:3000/api/v1/timesheet/employees/${employeeId}/month/${selectedYear}-${formattedMonth}`;

          const token = localStorage.getItem('token');
          const headers = {
            'Authorization': `${token}`,
            'Content-Type': 'application/json'
          };

          const response = await fetch(apiUrl, {
            method: 'GET',
            headers: headers
          });

          if (response.ok) {
            const data = await response.json();
            setTimeSheetEntries(data);
          } else {
            setError('Error fetching time sheet entries');
          }
        } else if (activeTab === 'myData') {
          // Fetch data related to employee's personal data
        }
      } catch (error) {
        setError('Error in fetchData. Please try again.');
      }
    };

    fetchData();
  }, [activeTab, selectedYear, selectedMonth]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleEdit = (employeeId) => {
    console.log(`Edit button clicked for employee ID: ${employeeId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthToken('');
    setLogoutPopup(true);

    setTimeout(() => {
      setLogoutPopup(false);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        window.location.replace('/login');
      }, 2000);
    }, 1000);
  };

  const handleAddTimeSheet = () => {
    navigate('/add-timesheet'); // Redirect to the AddTimesheet route
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
        {activeTab === 'myTimeSheet' && (
          <div className="time-sheet-container">
            <div className="dropdowns">
              <label>Select Year:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >

                <option value={2022}>2022</option>
                <option value={2023}>2023</option>
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
                <option value={2028}>2028</option>
                <option value={2029}>2029</option>
                <option value={2030}>2030</option>
              </select>
              <label>Select Month:</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              >

                <option value={1}>January</option>
                <option value={2}>February</option>
                <option value={3}>March</option>
                <option value={4}>April</option>
                <option value={5}>May</option>
                <option value={6}>June</option>
                <option value={7}>July</option>
                <option value={8}>August</option>
                <option value={9}>September</option>
                <option value={10}>October</option>
                <option value={11}>November</option>
                <option value={12}>December</option>

              </select>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Hours Worked</th>
                    <th>Leave</th>
                    <th>Holiday</th>
                  </tr>
                </thead>
                <tbody>
                  {timeSheetEntries.map((entry, index) => (
                    <tr key={index}>
                      <td>{new Date(entry.date).toLocaleDateString()}</td>
                      <td>{entry.working_hours}</td>
                      <td>{entry.leaves}</td>
                      <td>{entry.holiday}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <br />
            <button onClick={handleAddTimeSheet}>Add Time Sheet</button>
          </div>
        )}
        {activeTab === 'myData' && <p>My Data Content</p>}
      </div>

      {showSuccessModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowSuccessModal(false)}>
              &times;
            </span>
            <p>You have Successfully logged out..Redirecting to login page...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeView;
