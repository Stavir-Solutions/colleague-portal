// MyTimesheet.js

import React, { useState, useEffect } from 'react';
import BASE_URL from './constants';

const MyTimesheet = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [timeSheetEntries, setTimeSheetEntries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeId = localStorage.getItem('employee_id');
        const formattedMonth = selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth;
        const apiUrl = `${BASE_URL}/timesheet/employees/${employeeId}/month/${selectedYear}-${formattedMonth}`;
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
          console.error('Error fetching time sheet entries');
        }
      } catch (error) {
        console.error('Error in fetchData. Please try again.', error);
      }
    };

    fetchData();
  }, [selectedYear, selectedMonth]);

  return (
    <div className="time-sheet-container">
      <div className="dropdowns">
        <label>Select Year:</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
       
          <option value={2023}>2023</option>
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
          <option value={2026}>2026</option>
          <option value={2027}>2027</option>
          <option value={2028}>2028</option>
          
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
    </div>
  );
};

export default MyTimesheet;
