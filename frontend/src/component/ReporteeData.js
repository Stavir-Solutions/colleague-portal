import React, { useState, useEffect } from 'react';

const ReporteeData = ({ authToken }) => {
  const [employeeData, setEmployeeData] = useState([]);
  const [error, setError] = useState(null);
  const [timeSheetSummaries, setTimeSheetSummaries] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        const response = await fetch('http://localhost:3000/api/v1/employees', {
          headers: {
            Authorization: `${authToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setEmployeeData(data);

          const currentYear = new Date().getFullYear();
          const currentMonth = new Date().getMonth() + 1;

          const summaries = {};
          for (const employee of data) {
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
      } catch (error) {
        console.error('Error in fetchData:', error.message);
        setError('Error in fetchData. Please try again.');
      }
    };

    fetchData();
  }, [authToken]);

  const handleEdit = (employeeId) => {
    console.log(`Edit button clicked for employee ID: ${employeeId}`);
    // Add your edit functionality here
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Total Working Hours</th>
            <th>Total Leaves</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employeeData.map(employee => (
            <tr key={employee.employee_id}>
              <td>{employee.employee_name}</td>
              <td>{employee.phone_number}</td>
              <td>{employee.email}</td>
              <td>
                {/* Render Total Working Hours */}
                {timeSheetSummaries[employee.employee_id] &&
                  timeSheetSummaries[employee.employee_id]['Total Working Hours']}
              </td>
              <td>
                {/* Render Total Leaves */}
                {timeSheetSummaries[employee.employee_id] &&
                  timeSheetSummaries[employee.employee_id]['Total Leaves']}
              </td>
              <td>
                {/* Edit Button */}
                <button onClick={() => handleEdit(employee.employee_id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReporteeData;
