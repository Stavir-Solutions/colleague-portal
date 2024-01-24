import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './component/Login';
import ManagerView from './component/ManagerView';
import AddEmployee from './component/AddEmployee';
import EmployeeList from './component/EmployeeList';
import EditEmployee from './component/EditEmployee';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/ManagerView" element={<ManagerView />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/employee-list" element={<EmployeeList />} />
        <Route path="/edit-employee/:employee_id" element={<EditEmployee />} />
        {/* Wrap Navigate inside Routes */}
        <Route path="/" element={<Navigate to="/Login" />} />
      </Routes>
    </Router>
  );
};

export default App;



