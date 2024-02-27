import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EditEmployee.css';

const EditEmployee = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const authToken = localStorage.getItem('token');
    const apiUrl = `https://apps.stavir.com/colleague-api/v1/employees/04f232de-33b3-45fb-a02c-d28226a22748`;

    // Hardcoded values
    const employeeId = '04f232de-33b3-45fb-a02c-d28226a22748';
    const joiningDate = '2023-08-15';
    const reportingManagerId = 'b47d663d-f4ab-491c-a5cf-eda28e4ccbb8';

    // Create FormData object and set values
    const formData = new FormData();
    formData.set('employee_id', employeeId);
    formData.set('employee_name', e.target.employee_name.value);
    formData.set('designation', e.target.designation.value);
    formData.set('phone_number', e.target.phone_number.value);
    formData.set('email', e.target.email.value);
    formData.set('joining_date', joiningDate);
    formData.set('leaving_date', e.target.leaving_date.value);
    formData.set('reporting_manager_id', reportingManagerId);
    formData.set('address', e.target.address.value);

    console.log('FormData:', formData);

    try {
      console.log('Sending PUT request to:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          Authorization: `${authToken}`,
        },
        body: formData,
      });

      console.log('API Response:', response);

      if (response.ok) {
        console.log('Employee updated successfully!');
        navigate('/employee-list');
      } else {
        console.error('Failed to update employee. Server response:', response);
      }
    } catch (error) {
      console.error('Error during API call:', error);
    }
  };

  return (
    <div className="edit-employee-container">
      <h2>Edit Employee</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="employee_name" required />
        </label>
        <br />

        <label>
          Phone Number:
          <input type="tel" name="phone_number" required />
        </label>
        <br />

        <label>
          Email Address:
          <input type="email" name="email" required />
        </label>
        <br />

        <label>
          Designation:
          <input type="text" name="designation" required />
        </label>
        <br />

        <label>
          Address:
          <br />
          <textarea name="address" required />
        </label>
        <br />

        <label>
          Leaving Date:
          <input type="date" name="leaving_date" />
        </label>
        <br />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditEmployee;
