import React, { useState, useEffect } from 'react';
import BASE_URL from './Constants';
import './AbsenceData.css';

const AbsenceData = () => {
  const [totalLeaves, setTotalLeaves] = useState(0);
  const [leavesTaken, setLeavesTaken] = useState(0);
  const [leaveDates, setLeaveDates] = useState([]);
  const [overUsed, setOverUsed] = useState(false);
  
  useEffect(() => {
    fetchAbsenceData();
  }, []);

  const fetchAbsenceData = async () => {
    try {
      const token = localStorage.getItem('token');
      const employeeId = localStorage.getItem('employee_id');
      const response = await fetch(`${BASE_URL}/absencemngmnt/employees/${employeeId}/leaves/2025`, {
        headers: {
          Authorization: token
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        setTotalLeaves(data.leaves_eligible_this_year);
        setLeavesTaken(data.leaves_taken_this_year);
        setLeaveDates(data.leaves_and_dates);
        setOverUsed(data.overused_as_of_today);
      } else {
        console.error('Failed to fetch absence data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching absence data:', error);
    }
  };

  return (
    <div className="absence-data">
      <h2>Absence Data</h2>
      <div className="data-row">
        <label htmlFor="totalLeaves">Total Leaves:</label>
        <input type="text" id="totalLeaves" value={totalLeaves} readOnly />
      </div>
      <div className="data-row">
        <label htmlFor="leavesTaken">Leaves Taken:</label>
        <input type="text" id="leavesTaken" value={leavesTaken} readOnly />
      </div>
      <div className="data-row">
        <label htmlFor="leaveDates">Leave Dates:</label>
        <ul id="leaveDates">
          {leaveDates.map((item, index) => (
            <li key={index}>{item.date} - {item.leaves} hours </li>
          ))}
        </ul>
      </div>
      <div className="data-row">
        <label htmlFor="overUsed">Overused:</label>
        <input type="text" id="overUsed" value={overUsed ? 'Yes' : 'No'} readOnly style={{ color: overUsed ? 'orange' : 'green' }} />
      </div>
    </div>
  );
};

export default AbsenceData;
