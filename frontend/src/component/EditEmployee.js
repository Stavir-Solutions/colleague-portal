import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './EditEmployee.css';

const EditEmployee = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    designation: '',
    phoneNumber: '',
    leavingDate: '',
    email: '',
  });

  useEffect(() => {
    console.log('Location state in EditEmployee:', location.state);

    if (location.state && location.state.previousData) {
      const { employee_id, employee_name, address, designation, phone_number, leaving_date, email } = location.state.previousData;

      if (employee_id) {
        setFormData({
          employeeId: employee_id,
          name: employee_name || '',
          address: address || '',
          designation: designation || '',
          phoneNumber: phone_number || '',
          leavingDate: leaving_date || '',
          email: email || '',
        });
      } else {
        console.error('Employee ID is missing in previousData:', location.state.previousData);
      }
    } else {
      console.error('No previousData in location.state:', location.state);
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.employeeId) {
      const authToken = localStorage.getItem('token');
      const apiUrl = `http://localhost:3000/api/v1/employees/${formData.employeeId}`;

      try {
        const response = await fetch(apiUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${authToken}`,
          },
          body: JSON.stringify({
            employee_name: formData.name,
            phone_number: formData.phoneNumber,
            email: formData.email,
            designation: formData.designation,
            address: formData.address,
            leaving_date: formData.leavingDate,
            // Add other fields as needed
          }),
        });

        console.log('API Response:', response);

        if (response.ok) {
          // Redirect to the employee list page or perform any other actions
          navigate('/employee-list');
        } else {
          console.error('Failed to update employee.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.error('Employee ID is missing. Cannot update.');
    }
  };

  return (
    <div className="edit-employee-container">
      <h2>Edit Employee</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />

        <label>
          Phone Number:
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />

        <label>
          Email Address:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />

        <label>
          Designation:
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />

        <label>
          Address:
          <br />
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        <label>
          Leaving Date:
          <input
            type="date"
            name="leavingDate"
            value={formData.leavingDate}
            onChange={handleInputChange}
          />
        </label>
        <br />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditEmployee;
