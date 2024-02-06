import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './component/Login';
import ManagerView from './component/ManagerView';
import EmployeeView from './component/EmployeeView'; 
import AddEmployee from './component/AddEmployee';
import EmployeeList from './component/EmployeeList';
import EditEmployee from './component/EditEmployee';
import AddTimesheet from './component/AddTimesheet'; // Import AddTimesheet component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/managerview" element={<ManagerView />} />
        <Route path="/employeeview" element={<EmployeeView />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/employee-list" element={<EmployeeList />} />
        <Route path="/edit-employee/:employee_id" element={<EditEmployee />} />
        <Route path="/add-timesheet" element={<AddTimesheet />} /> {/* Add route for AddTimesheet */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;



