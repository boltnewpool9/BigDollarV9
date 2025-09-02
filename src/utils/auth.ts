const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'InternationalMessaging@20'
};

export const login = (username: string, password: string): boolean => {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    localStorage.setItem('isAuthenticated', 'true');
    return true;
  }
  return false;
};

export const logout = (): void => {
  localStorage.removeItem('isAuthenticated');
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
};