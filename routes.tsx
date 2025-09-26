import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './src/containers//Login/Login';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Otras rutas aquí */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
