import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BASE_URL from './Constants';

const ReporteeData = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [error, setError] = useState(null);
  const [timeSheetSummaries, setTimeSheetSummaries] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found in local storage');
        }

        const response = await fetch(`${BASE_URL}/employees`, {
          headers: {
            Authorization: `${token}`,
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
                `${BASE_URL}/tmsummary/summary?employee-id=${employee.employee_id}&year=${currentYear}&month=${currentMonth}`,
                {
                  headers: {
                    Authorization: `${token}`,
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
  }, []);

  const handleEdit = (employeeId) => {
    console.log("navigating to editreportee employeeId", employeeId)
    navigate(`/editreportee/${employeeId}`); 
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
          {employeeData.map((employee, index) => (
            <tr key={index}>
              <td>{employee.employee_name}</td>
              <td>{employee.phone_number}</td>
              <td>{employee.email}</td>
              <td>
                {timeSheetSummaries[employee.employee_id] &&
                  timeSheetSummaries[employee.employee_id]['Total Working Hours']}
              </td>
              <td>
                {timeSheetSummaries[employee.employee_id] &&
                  timeSheetSummaries[employee.employee_id]['Total Leaves']}
              </td>
              <td>
                <button onClick={() => handleEdit(employee.employee_id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div style={{ marginTop: '20px' }}> 
        <button onClick={() => navigate('/add-employee')}>Add</button> 
      </div>
    </div>
  );
};

export default ReporteeData;
