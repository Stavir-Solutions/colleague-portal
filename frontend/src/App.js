// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './component/Login';
import ManagerView from './component/ManagerView';
import EmployeeView from './component/EmployeeView';
import AddEmployee from './component/AddEmployee';
import EmployeeList from './component/EmployeeList';
import EditEmployee from './component/EditEmployee';
import AddTimesheet from './component/AddTimesheet';
import MyData from './component/MyData';
import ReporteeData from './component/ReporteeData';
import EditReportee from './component/EditReportee'; 
import AbsenceData from './component/AbsenceData';
import ReporteeAbsence from './component/ReporteeAbsence';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/managerview/*" element={<ManagerView />} />
        <Route path="/employeeview" element={<EmployeeView />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/employee-list" element={<EmployeeList />} />
        <Route path="/edit-employee/:employee_id" element={<EditEmployee />} />
        <Route path="/add-timesheet" element={<AddTimesheet />} />
        <Route path="/mydata" element={<MyData />} />
        <Route path="/reportee-data" element={<ReporteeData />} />
        <Route path="/AbsenceData" element={<AbsenceData />} />
        <Route path="/ReporteeAbsence" element={<ReporteeAbsence />} />
        <Route path="/editreportee/:employee_id" element={<EditReportee />} />

        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
