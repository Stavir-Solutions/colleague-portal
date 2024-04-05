import React, { useState, useEffect } from 'react';
import './EditReportee.css';
import { useNavigate, useParams } from 'react-router-dom';
import BASE_URL from './Constants'; 

const EditReportee = () => {
  const params = useParams();
  const employeeId = params.employee_id;
  const navigate = useNavigate();

  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [editedInfo, setEditedInfo] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchEmployeeInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/employees/${employeeId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch employee information');
        }

        const data = await response.json();
        setEmployeeInfo(data[0]);
        setEditedInfo(data[0]);
        setError(null);
      } catch (error) {
        setError('Error during fetching employee information. Please try again.');
        console.error('Error during fetching employee information:', error.message);
      }
    };

    if (employeeId) {
      fetchEmployeeInfo();
    } else {
      setError('Employee ID not found');
    }
  }, [employeeId]); 

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/employees/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(editedInfo)
      });

      if (response.ok) {
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
    setEditedInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const goBack = () => {
    navigate('/managerview');
  };

  return (
    <div className="employee-info-container">
    
      <h2>Edit Employee Information</h2>
      {error && <p className="error-message">{error}</p>}
      {employeeInfo && (
        <form>
          <div className="form-group">
            <label>Name:</label>
            <input 
              type="text" 
              name="employee_name" 
              value={editedInfo.employee_name} 
              readOnly={!isEditable} 
              onChange={handleChange} 
              style={{ backgroundColor: isEditable ? 'lightblue' : 'transparent' }} 
            />
          </div>
          <div className="form-group">
            <label>Designation:</label>
            <input 
              type="text" 
              name="designation" 
              value={editedInfo.designation} 
              readOnly={!isEditable} 
              onChange={handleChange} 
              style={{ backgroundColor: isEditable ? 'lightblue' : 'transparent' }} 
            />
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input 
              type="text" 
              name="phone_number" 
              value={editedInfo.phone_number} 
              readOnly={!isEditable} 
              onChange={handleChange} 
              style={{ backgroundColor: isEditable ? 'lightblue' : 'transparent' }} 
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input 
              type="email" 
              name="email" 
              value={editedInfo.email} 
              readOnly={!isEditable} 
              onChange={handleChange} 
              style={{ backgroundColor: isEditable ? 'lightblue' : 'transparent' }} 
            />
          </div>
          <div className="form-group">
            <label>Joining Date:</label>
            <input 
              type="text" 
              name="joining_date" 
              value={editedInfo.joining_date ? new Date(editedInfo.joining_date).toISOString().split('T')[0] : ''} 
              readOnly={!isEditable} 
              onChange={handleChange} 
              style={{ backgroundColor: isEditable ? 'lightblue' : 'transparent' }} 
            />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input 
              type="text" 
              name="address" 
              value={editedInfo.address} 
              readOnly={!isEditable} 
              onChange={handleChange} 
              style={{ backgroundColor: isEditable ? 'lightblue' : 'transparent' }} 
            />
          </div>
          <div className="form-group">
            <label>Login Name:</label>
            <input 
              type="text" 
              name="username" 
              value={editedInfo.username} 
              readOnly={!isEditable} 
              onChange={handleChange} 
              style={{ backgroundColor: isEditable ? 'lightblue' : 'transparent' }} 
            />
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
        </form>
      )}
      <div className="button-container">
        <button className="back-button" onClick={goBack}>Back</button>
        {isEditable ? (
          <button type="button" className="save-button" onClick={handleSave}>Save</button>
        ) : (
          <button className="edit-button" onClick={handleEdit}>Edit</button>
        )}
      </div>
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
