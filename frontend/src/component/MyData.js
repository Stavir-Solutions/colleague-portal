import React, { useState, useEffect } from 'react';
import './MyData.css';

const MyData = () => {
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const employeeId = localStorage.getItem('employee_id');

    const fetchEmployeeInfo = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/employees/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          const loggedInEmployee = data.find(employee => employee.employee_id === employeeId);
          setEmployeeInfo(loggedInEmployee);
          setError(null);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Unable to fetch employee information');
          console.error('Error fetching employee information:', errorData.error || response.statusText);
        }
      } catch (error) {
        setError('Error during fetching employee information. Please try again.');
        console.error('Error during fetching employee information:', error.message);
      }
    };

    if (token && employeeId) {
      fetchEmployeeInfo();
    } else {
      setError('Token or employee ID not found in local storage');
    }
  }, []);

  // Function to handle editing of address, phone number, and password
  const handleEdit = (field) => {
    // Your logic to handle editing of the field
    console.log(`Editing ${field}`);
  };

  return (
    <div className="employee-info-container">
      {error && <p className="error-message">{error}</p>}
      {employeeInfo && (
        <div>
          <p><strong>Employee Name:</strong> {employeeInfo.employee_name}</p>
          <p><strong>Designation:</strong> {employeeInfo.designation}</p>
          <p><strong>Phone Number:</strong> {employeeInfo.phone_number} <button className="edit-button" onClick={() => handleEdit('phone number')}>Edit</button></p>
          <p><strong>Email:</strong> {employeeInfo.email}</p>
          <p><strong>Joining Date:</strong> {new Date(employeeInfo.joining_date).toLocaleDateString()}</p>
          <p><strong>Address:</strong> {employeeInfo.address} <button className="edit-button" onClick={() => handleEdit('address')}>Edit</button></p>
          <p><strong>Password:</strong> ********* <button className="edit-button" onClick={() => handleEdit('password')}>Edit</button></p>
        </div>
      )}
    </div>
  );
};

export default MyData;
