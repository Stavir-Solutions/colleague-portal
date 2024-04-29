// absence.js

import React, { useState, useEffect } from 'react';
import BASE_URL from './Constants';

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
      
      const response = await fetch(`${BASE_URL}/`);
      if (response.ok) {
        const data = await response.json();
        setTotalLeaves(data.totalLeaves);
        setLeavesTaken(data.leavesTaken);
        setLeaveDates(data.leaveDates);
        setOverUsed(data.overUsed);
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
      <div>
        <label htmlFor="totalLeaves">Total Leaves:</label>
        <input type="text" id="totalLeaves" value={totalLeaves} readOnly />
      </div>
      <div>
        <label htmlFor="leavesTaken">Leaves Taken:</label>
        <input type="text" id="leavesTaken" value={leavesTaken} readOnly />
      </div>
      <div>
        <label htmlFor="overUsed">Overused:</label>
        <input type="text" id="overUsed" value={overUsed ? 'Yes' : 'No'} readOnly />
      </div>
    </div>
  );
};

export default AbsenceData;
