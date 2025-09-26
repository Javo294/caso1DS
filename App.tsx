import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LoginForm from './src/components/forms/LoginForm';

const namespace = 'https://20minCoachs.app/roles';

function App() {
  const { isAuthenticated, isLoading, getIdTokenClaims } = useAuth0();
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      setRoles([]);
      return;
    }

    let mounted = true;
    (async () => {
      try {
        const claims = await getIdTokenClaims();
        console.log('Token completo:', claims);
        const tokenRoles = claims?.[namespace] || [];
        console.log('Roles desde claims (raw):', tokenRoles);

        const normalized = Array.isArray(tokenRoles)
          ? tokenRoles.map((r: string) =>
              String(r || '').trim().toLowerCase().replace(/\s+/g, '-')
            )
          : [];

        if (mounted) setRoles(normalized);
      } catch (err) {
        console.error('Error al obtener claims:', err);
        if (mounted) setRoles([]);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, getIdTokenClaims]);

  const isPremium = roles.includes('premium-user');
  const isBasic = roles.includes('basic-user');

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
      <h1>Bienvenido a CAS01DS</h1>
      <p>Este sistema adapta su funcionalidad según tu rol de usuario.</p>

      <LoginForm />

      {!isLoading && isAuthenticated && (
        <>
          <hr style={{ margin: '2rem 0' }} />
          <h3>Contenido disponible para ti:</h3>
          {isPremium && <p>🔓 Acceso completo a todas las funciones premium.</p>}
          {isBasic && <p>🔒 Acceso limitado. Algunas funciones están restringidas.</p>}
          {!isPremium && !isBasic && <p>⚠️ No tienes un rol asignado. Contacta al administrador.</p>}
        </>
      )}
    </div>
  );
}

export default App;