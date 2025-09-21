import { useAuthStore } from '../store/useAuthStore';

export const useAuthController = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const login = (username: string, password: string) => {
    // Por ahora, esto es solo una simulación
    if (username === 'admin' && password === '1234') {
      setUser({ username, role: 'PremiumUser' });
      alert('¡Login exitoso!');
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return { login };
};
