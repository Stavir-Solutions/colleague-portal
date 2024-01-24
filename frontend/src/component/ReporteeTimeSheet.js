import React, { useState, useEffect } from 'react';
import './ReporteeTimeSheet.css';
const ReporteeTimeSheet = () => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [fetchedData, setFetchedData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log('stored token', storedToken);
    if (storedToken) {
      setAuthToken(storedToken);
    }
  }, []);

  const handleViewTimeSheet = async () => {
    try {
      console.log('authToken before fetch', authToken);
      if (!authToken) {
        console.error('Authentication token is missing.');
        return;
      }

      const employeeId = localStorage.getItem('employee_id');
      const apiUrl = `http://localhost:3000/api/v1/timesheet/employees/${employeeId}/subordinates/month/${year}-${month}`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched data:', data);
        setFetchedData(data);
        setError(null);
      } else {
        const errorData = await response.json();
        console.error('Error fetching data:', errorData.error || response.statusText);
        setError(errorData.error || 'Error fetching data');
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setError('Error fetching data. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const dateWithoutTime = dateString.split('T')[0];
    return dateWithoutTime;
  };
  
 

  return (
    <div>
      <h3>Reportee Time Sheet</h3>
      <div style={{ marginRight: '300px', display: 'flex', alignItems: 'center' }}>
        <label>Year:</label>
        &nbsp;&nbsp;
        <select value={year} onChange={(e) => setYear(e.target.value)}className="largeFontSize largePadding">
          <option value="">Select Year</option>
          {Array.from({ length: 101 }, (_, index) => 2015 + index).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <label>Month:</label>
        &nbsp;&nbsp;
        <select value={month} onChange={(e) => setMonth(e.target.value)}className="largeFontSize largePadding">
          <option value="">Select Month</option>
          {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <button onClick={handleViewTimeSheet} className="largeFontSize largePadding">View Time Sheet</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {fetchedData && (
        <div>
          <h4>Employee Data:</h4>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
  <tr style={{ border: '1px solid #ddd', background: '#f2f2f2' }}>
    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Employee Name</th>
    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Working Hours</th>
    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Leaves</th>
    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Holiday</th>
  </tr>
</thead>
      <tbody>
  {fetchedData.map((entry, index) => (
    <tr key={index} style={{ border: '1px solid #ddd' }}>
      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{entry.employee_name}</td>
      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formatDate(entry.date)}</td>
      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{entry.working_hours}</td>
      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{entry.leaves}</td>
      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{entry.holiday}</td>

    </tr>
  ))}
</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReporteeTimeSheet;
