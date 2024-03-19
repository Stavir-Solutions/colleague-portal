import React from 'react';
import { Link } from 'react-router-dom';
import './EmployeeList.css';

const EmployeeList = ({ employeeData, timeSheetSummaries }) => {
  // const handleEditButtonClick = (employee) => {
  // console.log('Edit button clicked for employee:', employee);
  // };

  return (
    <div>
      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Total Working Hours</th>
            <th>Total Leaves</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employeeData.map((employee) => (
            <tr key={employee.employee_id}>
              <td>{employee.employee_name}</td>
              <td>{employee.email}</td>
              <td>{employee.phone_number}</td>
              <td>
                {timeSheetSummaries[employee.employee_id] ? (
                  timeSheetSummaries[employee.employee_id]['Total Working Hours']
                ) : (
                  'N/A'
                )}
              </td>
              <td>
                {timeSheetSummaries[employee.employee_id] ? (
                  timeSheetSummaries[employee.employee_id]['Total Leaves']
                ) : (
                  'N/A'
                )}
              </td>
              <td>
                <Link
                  to={{
                    pathname: `/edit-employee/${employee.employee_id}`,
                    state: { previousData: employee },
                  }}
                >
                  <button>Edit</button>
                </Link>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to="/add-employee">
        <button>Add Employee</button>
      </Link>
    </div>
  );
};

export default EmployeeList;
