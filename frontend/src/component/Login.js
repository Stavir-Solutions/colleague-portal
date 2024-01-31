import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Login.css'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [name, setName] = useState(null);
  const [hasReportees, setHasReportees] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        setEmployeeId(data.employee_id); 
        setName(data.employee_name);
        setHasReportees(data.hasReportees);
        setError(null);

        // Store the token and employee_id in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('employee_id', data.employee_id);

        // Log the token after storing it in local storage
        console.log('Token stored in localStorage:', data.token);

        // Redirect to ManagerView only if hasReportees is true
        if (data.hasReportees) {
          navigate('/managerview');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'not manager');
        console.error('Login failed:', errorData.error || response.statusText);
      }
    } catch (error) {
      setError('Error during login. Please try again.');
      console.error('Error during login:', error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="button" onClick={handleLogin}>
          Submit
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {token && <p className="token-message">Token: {token}</p>}
      {employeeId && <p className="employee-id-message">Employee ID: {employeeId}</p>}
      {name && <p className="name-message">Name: {name}</p>}
      {hasReportees !== null && (
        <p className="has-reportees-message">Has Reportees: {hasReportees.toString()}</p>
      )}
    </div>
  );
};

export default Login;
