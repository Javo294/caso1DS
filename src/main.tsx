// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

import App from "./App";                           
import UserPage from "./pages/UserPages";           
import "./styles/index.css";

const domain = 'dev-0gkvzcfrp5szz583.us.auth0.com';
const clientId = '2BU6m75wAB5kX01MZi1HQLygflk0woY3';
const audience = 'https://20minCoachs.app/api';    

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience,
        scope: "openid profile email read:roles"}}
      >
      <BrowserRouter>
        <Routes>
          {/* Pantalla inicial (la actual) */}
          <Route path="/" element={<App />} />

          {/* Nueva página tipo Figma */}
          <Route path="/app" element={<UserPage />} />
        </Routes>
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>
);
