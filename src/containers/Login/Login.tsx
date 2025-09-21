import React from 'react';

const Login = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Iniciar sesión</h1>
      <input type="text" placeholder="Usuario" style={{ display: 'block', margin: '10px auto' }} />
      <input type="password" placeholder="Contraseña" style={{ display: 'block', margin: '10px auto' }} />
      <button style={{ display: 'block', margin: '20px auto' }}>Ingresar</button>
    </div>
  );
};

export default Login;

