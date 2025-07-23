// Funciones helper para manejar cookies de autenticación

export const setAuthCookie = (token: string) => {
  // Configurar cookie con opciones de seguridad
  const cookieOptions = [
    `firebase-auth-token=${token}`,
    'path=/',
    'max-age=3600', // 1 hora
    'secure',
    'samesite=strict'
  ].join('; ');
  
  document.cookie = cookieOptions;
};

export const removeAuthCookie = () => {
  document.cookie = 'firebase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

export const getAuthCookie = (): string | null => {
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => 
    cookie.trim().startsWith('firebase-auth-token=')
  );
  
  if (authCookie) {
    return authCookie.split('=')[1];
  }
  
  return null;
}; 