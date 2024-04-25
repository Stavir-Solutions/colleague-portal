import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddTimesheet.css';
import BASE_URL from './Constants';

const AddTimesheet = () => {
  const [date, setDate] = useState('');
  const [hoursWorked, setHoursWorked] = useState(0);
  const [leave, setLeave] = useState(0);
  const [holiday, setHoliday] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    const payload = {
      date: date,
      working_hours: hoursWorked,
      leaves: leave,
      holiday: holiday,
      employee_id: localStorage.getItem('employee_id')
    };

    try {
      const response = await fetch(`${BASE_URL}/timesheet/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log('Timesheet entry submitted successfully.');
        setSuccessMessage('Timesheet saved successfully.');

        setDate('');
        setHoursWorked(0);
        setLeave(0);
        setHoliday(0);

        // Prompt user to add more timesheets
        if (window.confirm('Timesheet added successfully. Do you want to add more?')) {
          navigate('/add-timesheet');
        } else {
          window.history.back(); 
        }
      } else {
        console.error('Failed to submit timesheet entry:', response.statusText);
      }
    } catch (error) {
      console.error('Error during timesheet submission:', error.message);
    }
  };

  const goBack = () => {
    navigate(-1); // Navigate back to the previous route
};

  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const minDate = firstDayOfMonth.toISOString().split('T')[0];
  const maxDate = lastDayOfMonth.toISOString().split('T')[0];

  return (
    <div className="add-timesheet-container">
      <h2>Add Timesheet Entry</h2>
      <form className="add-timesheet-form" onSubmit={handleSubmit}>
        <label htmlFor="dateInput" className="add-timesheet-label">Select Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="add-timesheet-input"
          required
          min={minDate}
          max={maxDate}
          name="dateInput"
        />
        <label htmlFor="hoursWorked" className="add-timesheet-label">Total Hours Worked:</label>
        <select
          value={hoursWorked}
          onChange={(e) => setHoursWorked(parseInt(e.target.value))}
          className="add-timesheet-input"
          required
          name="hoursWorked"
        >
          {[0,1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((hours) => (
            <option key={hours} value={hours}>
              {hours}
            </option>
          ))}
        </select>
        <label htmlFor="leave" className="add-timesheet-label">Leave:</label>
        <select
          value={leave}
          onChange={(e) => setLeave(parseInt(e.target.value))}
          className="add-timesheet-input"
          required
          name="leave"
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((leaveHours) => (
            <option key={leaveHours} value={leaveHours}>
              {leaveHours}
            </option>
          ))}
        </select>
        <label htmlFor='holiday' className="add-timesheet-label">Holiday:</label>
        <select
          value={holiday}
          onChange={(e) => setHoliday(parseInt(e.target.value))}
          className="add-timesheet-input"
          required
          name='holiday'
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((holidayHours) => (
            <option key={holidayHours} value={holidayHours}>
              {holidayHours}
            </option>
          ))}
        </select>
  
        <div className="button-container">
          <button className="back-button" onClick={goBack}>Back</button>
          <button type="submit" className="add-timesheet-button">Save</button>
        </div>
      </form>
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};

export default AddTimesheet;
