import React, { useState, useEffect } from 'react';
import './EditReportee.css';
import { useNavigate, useParams } from 'react-router-dom';
import BASE_URL from './constants'; 

const EditReportee = ()=> {
  const params= useParams();
  const employeeId = params.employee_id;
  console.log('received employeeid' , employeeId);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [editedInfo, setEditedInfo] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchEmployeeInfo = async () => {
      try {
        const response = await fetch(`${BASE_URL}/employees/${employeeId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
          }
        });

        console.log('response', response);
        if (!response.ok) {
          throw new Error('Failed to fetch employee information');
        }

        const data = await response.json();
        setEmployeeInfo(data);
        setEditedInfo(data);
        setError(null);
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
  }, [employeeId]); // Depend on employeeId

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const currentDate = new Date().toISOString().split('T')[0];
      const formattedJoiningDate = new Date(editedInfo.joining_date).toISOString().split('T')[0];

      const response = await fetch(`${BASE_URL}/employees/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          employee_name: editedInfo.employee_name,
          designation: editedInfo.designation,
          phone_number: editedInfo.phone_number,
          email: editedInfo.email,
          joining_date: formattedJoiningDate,
          leaving_date: currentDate,
          reporting_manager_id: employeeInfo.reporting_manager_id,
          address: editedInfo.address,
          password: editedInfo.password
        })
      });

      if (response.ok) {
        console.log('Employee information successfully updated');
        setIsEditable(false);
        setShowSuccessModal(true);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Unable to update employee information');
        console.error('Error updating employee information:', errorData.error || response.statusText);
      }
    } catch (error) {
      setError('Error during updating employee information. Please try again.');
      console.error('Error during updating employee information:', error.message);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/managerview');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = name === 'joining_date' ? value.split('T')[0] : value;

    setEditedInfo(prevState => ({
      ...prevState,
      [name]: formattedValue
    }));
  };

  return (
    <div className="employee-info-container">
      {error && <p className="error-message">{error}</p>}
      {employeeInfo && (
        <form>
          <div className="form-group">
            <label>Employee Name:</label>
            <input type="text" name="employee_name" value={editedInfo.employee_name} readOnly={!isEditable} onChange={handleChange} className={isEditable ? '' : 'non-editable'} />
          </div>
          <div className="form-group">
            <label>Designation:</label>
            <input type="text" name="designation" value={editedInfo.designation} readOnly={!isEditable} onChange={handleChange} className={isEditable ? '' : 'non-editable'} />
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input type="text" name="phone_number" value={editedInfo.phone_number} readOnly={!isEditable} onChange={handleChange} style={{ backgroundColor: isEditable ? 'lightblue' : 'transparent' }} />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={editedInfo.email} readOnly={!isEditable} onChange={handleChange} className={isEditable ? '' : 'non-editable'} />
          </div>
          <div className="form-group">
            <label>Joining Date:</label>
            <input type="text" name="joining_date" value={editedInfo.joining_date ? new Date(editedInfo.joining_date).toISOString().split('T')[0] : ''} readOnly={!isEditable} onChange={handleChange} className={isEditable ? '' : 'non-editable'} />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input type="text" name="address" value={editedInfo.address} readOnly={!isEditable} onChange={handleChange} style={{ backgroundColor: isEditable ? 'lightblue' : 'transparent' }} />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={editedInfo.password || ''}
              readOnly={!isEditable}
              onChange={handleChange}
              style={{ backgroundColor: isEditable ? 'lightblue' : 'transparent' }}
            />
          </div>
          <div className="form-group">
            {isEditable ? (
              <button type="button" className="save-button" onClick={handleSave}>Save</button>
            ) : (
              <button className="edit-button" onClick={handleEdit}>Edit</button>
            )}
          </div>
        </form>
      )}
      {/* Success modal */}
      {showSuccessModal && (
        <div className="success-modal">
          <p>Employee information successfully updated!</p>
          <button onClick={handleCloseModal}>Close</button>
        </div>
      )}
    </div>
  );
};

export default EditReportee;
