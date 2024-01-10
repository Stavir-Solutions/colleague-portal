import React, { useState, useEffect } from 'react';

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
  
  const formatHeader = (header) => {
    // Split the header at underscores, capitalize each part, and join them back
    return header.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  

  return (
    <div>
      <h3>Reportee Time Sheet</h3>
      <div style={{ marginRight: '500px', display: 'flex', alignItems: 'center' }}>
        <label>Year:</label>
        &nbsp;&nbsp;
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Select Year</option>
          {Array.from({ length: 101 }, (_, index) => 2015 + index).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <label>Month:</label>
        &nbsp;&nbsp;
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="">Select Month</option>
          {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <button onClick={handleViewTimeSheet}>View Time Sheet</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {fetchedData && (
        <div>
          <h4>Employee Data:</h4>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
  <tr style={{ border: '1px solid #ddd', background: '#f2f2f2' }}>
    {Object.keys(fetchedData[0]).map((key) => {
      // Exclude 'timesheet_id' from the headers
      if (key !== 'timesheet_id') {
        return (
          <th key={key} style={{ border: '1px solid #ddd', padding: '8px' }}>
            {formatHeader(key)}
          </th>
        );
      }
      return null;
    })}
  </tr>
</thead>
      <tbody>
  {fetchedData.map((entry, index) => (
    <tr key={index} style={{ border: '1px solid #ddd' }}>
      {Object.entries(entry).map(([key, value]) => {
        // Exclude 'timesheet_id' from the entries
        if (key !== 'timesheet_id') {
          return (
            <td key={key} style={{ border: '1px solid #ddd', padding: '8px' }}>
              {key === 'date' ? formatDate(value) : String(value).replace(/"/g, '')}
            </td>
          );
        }
        return null;
      })}
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
