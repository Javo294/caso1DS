import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../containers/Login/Login';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
