import React from 'react';
import './EmployeeList.css'; // 

const EmployeeList = ({ employeeData, timeSheetSummaries, handleEdit }) => {
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
                  timeSheetSummaries[employee.employee_id]["Total Working Hours"]
                ) : (
                  'N/A'
                )}
              </td>
              <td>
                {timeSheetSummaries[employee.employee_id] ? (
                  timeSheetSummaries[employee.employee_id]["Total Leaves"]
                ) : (
                  'N/A'
                )}
              </td>
              <td>
                <button onClick={() => handleEdit(employee.employee_id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button>Add Employee</button>
    </div>
  );
};

export default EmployeeList;
