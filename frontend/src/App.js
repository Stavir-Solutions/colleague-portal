import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './component/Login';
import ManagerView from './component/ManagerView';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/ManagerView" element={<ManagerView />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/" element={<Navigate to="/Login" />} />
      </Routes>
    </Router>
  );
};

export default App;
