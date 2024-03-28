import React, { useState } from 'react';
import './AddEmployee.css';
import { useNavigate } from 'react-router-dom';
import BASE_URL from './constants';

const AddEmployee = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [employeeData, setEmployeeData] = useState({
    employee_name: '',
    designation: null,
    phone_number: '',
    email: '',
    joining_date: null,
    leaving_date: null,
    reporting_manager_id: localStorage.getItem('employee_id') || '',
    address: null,
    username: '',
    password: '',
  });

  const [successModal, setSuccessModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value || null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify(employeeData),
      });

      if (response.ok) {
        setSuccessModal(true);
        // You may add a delay or use a state to control when to navigate back
        setTimeout(() => {
          setSuccessModal(false);
          navigate('/ManagerView');
        }, 25000);
      } else {
        const errorData = await response.json();
        console.error('Failed to add employee:', errorData.error || response.statusText);
        // Handle errors as needed
      }
    } catch (error) {
      console.error('Error during employee addition:', error.message);
      // Handle errors as needed
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Enter Employee Details</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="label">
            Name <sup>*</sup>:
          </label>
          <input type="text" name="employee_name" value={employeeData.employee_name} onChange={handleInputChange} className="input" required />
        </div>
        <div className="form-group">
          <label className="label">
            Designation:
          </label>
          <input type="text" name="designation" value={employeeData.designation || ''} onChange={handleInputChange} className="input" />
        </div>

        <div className="form-group">
          <label className="label">
            Phone Number <sup>*</sup>:
          </label>
          <input type="tel" name="phone_number" value={employeeData.phone_number} onChange={handleInputChange} className="input" required />
        </div>

        <div className="form-group">
          <label className="label">
            Email <sup>*</sup>:
          </label>
          <input type="email" name="email" value={employeeData.email} onChange={handleInputChange} className="input" required />
        </div>

        <div className="form-group">
          <label className="label">
            Joining Date:
          </label>
          <input type="date" name="joining_date" value={employeeData.joining_date || ''} onChange={handleInputChange} className="input" />
        </div>

        <div className="form-group">
          <label className="label">
            Leaving Date:
          </label>
          <input type="date" name="leaving_date" value={employeeData.leaving_date || ''} onChange={handleInputChange} className="input" />
        </div>


        <div className="form-group">
          <label className="label">
            Address:
          </label>
          <textarea
            name="address"
            value={employeeData.address || ''}
            onChange={handleInputChange}
            className="textarea"
          />
        </div>
        <div className="form-group">
          <label className="label">
            Username:
          </label>
          <input
            type="text"
            name="username"
            value={employeeData.username}
            onChange={handleInputChange}
            className="input"
          />
        </div>

        <div className="form-group">
          <label className="label">
            Password:
          </label>
          <input
            type="password"
            name="password"
            value={employeeData.password}
            onChange={handleInputChange}
            className="input"
          />
        </div>

        <button type="submit" className="button">Save Employee</button>
      </form>

      {successModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Employee successfully added!</p>
            <button onClick={() => navigate('/ManagerView')}>Back</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEmployee;
