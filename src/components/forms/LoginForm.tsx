import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const namespace = 'https://20minCoachs.app/roles';

const LoginForm: React.FC = () => {
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    user,
    isLoading,
  } = useAuth0();
  console.log('LoginForm - isAuthenticated, isLoading, user:', isAuthenticated, isLoading, user);
  const roles: string[] = user?.[namespace] || [];
  console.log('Roles recibidos (LoginForm):', user?.[namespace]);

  if (isLoading) return <p>Cargando...</p>;

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      {!isAuthenticated ? (
        <button
          onClick={() =>
            loginWithRedirect({
            authorizationParams: {
              prompt: 'login'
            }
          })
          }
        >
          Iniciar sesión
        </button>
      ) : (
        <>
          <h2>Bienvenido, {user?.name}</h2>
          <p>Rol: {roles.includes('premium-user') ? 'Premium' : roles.includes('basic-user') ? 'Básico' : 'Sin rol'}</p>
          <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
            Cerrar sesión
          </button>
        </>
      )}
    </div>
  );
};

export default LoginForm;