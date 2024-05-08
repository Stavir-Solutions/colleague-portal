import React, { useState, useEffect, useCallback } from 'react';
import BASE_URL from './Constants';

const ReporteeAbsence = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(""); 

  const fetchData = useCallback(async (year) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/employees`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const loggedInEmployeeId = localStorage.getItem('employee_id');
        const filteredData = data.filter(employee => employee.employee_id !== loggedInEmployeeId 
          && employee.leaving_date == null);
        setEmployeeData(filteredData);
        await fetchAbsenceDataForEmployees(filteredData, year, token); 
      } else {
        console.error('Error fetching employee data:', response.statusText);
        setError('Error fetching employee data');
      }
    } catch (error) {
      console.error('Error in fetchData:', error.message);
      setError('Error in fetchData. Please try again.');
    }
  }, []);

  useEffect(() => {
    const currentYear = calculateYearToFetch();
    setSelectedYear(currentYear); 
    fetchData(currentYear); 
  }, [fetchData]);

  const fetchAbsenceDataForEmployees = async (employees, year, token) => {
    try {
      const promises = employees.map(async (employee) => {
        const response = await fetch(`${BASE_URL}/absences/employees/${employee.employee_id}/leaves/${year}`, {
          headers: {
            Authorization: token,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          return { ...employee, ...data };
        } else {
          console.error(`Error fetching absence data for ${employee.employee_id}:`, response.statusText);
          return employee;
        }
      });

      const updatedEmployees = await Promise.all(promises);
      setEmployeeData(updatedEmployees);
    } catch (error) {
      console.error('Error fetching absence data:', error);
    }
  };

  const calculateYearToFetch = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    let currentFinancialYear = currentYear;
    
    if (currentMonth >= 4 && currentMonth <= 12) {
      currentFinancialYear = currentYear + 1;
    }

    return currentFinancialYear;
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value); 
    fetchData(event.target.value); 
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label htmlFor="yearToFetch">Select Year:</label>
        <select id="yearToFetch" value={selectedYear} onChange={handleYearChange}>
          <option value={calculateYearToFetch()}>{calculateYearToFetch()}</option>
          <option value={calculateYearToFetch() - 1}>{calculateYearToFetch() - 1}</option>
        </select>
      </div>
      
      
      <div style={{ marginBottom: '20px' }}></div>
      
      <table>
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Total Leaves (hrs)</th>
            <th>Leaves Taken (hrs)</th>
            <th>Leaves Eligible as of Today (hrs)</th>
            <th>Overused</th>
            <th>Leave Dates</th>
          </tr>
        </thead>
        <tbody>
          {employeeData.map((employee, index) => (
            <tr key={index}>
              <td>{employee.employee_name}</td>
              <td>{employee.leaves_eligible_this_year}</td>
              <td>{employee.leaves_taken_this_year} </td>
              <td>{employee.prorated_leaves} </td>
              <td>
                <span style={{ color: employee.overused_as_of_today ? 'orange' : 'green' }}>
                  {employee.overused_as_of_today ? 'Yes' : 'No'}
                </span>
              </td>
              {employee.leaves_and_dates ? (
                <td>
                  <ol>
                    {employee.leaves_and_dates.map((item, idx) => (
                      <li key={idx}>{item.date} - {item.leaves} hours</li>
                    ))}
                  </ol>
                </td>
              ) : (
                <td>No leave dates available</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReporteeAbsence;
