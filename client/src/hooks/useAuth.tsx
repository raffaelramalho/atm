// useAuth.js
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
  const [hasToken, setHasToken] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = jwtDecode(token);

      // Verifica se o token está expirado
      if (decodedToken.exp * 1000 < Date.now()) {
        setTokenExpired(true);
        setHasToken(false);
      } else {
        setHasToken(true);
      }
    }
  }, []);

  return { hasToken, tokenExpired };
};

export default useAuth;
