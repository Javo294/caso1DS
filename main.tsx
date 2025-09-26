import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

const domain = 'dev-0gkvzcfrp5szz583.us.auth0.com';
const clientId = '2BU6m75wAB5kX01MZi1HQLygflk0woY3';
const audience = 'https://20minCoachs.app/api';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience,
        scope: "openid profile email read:roles"
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);