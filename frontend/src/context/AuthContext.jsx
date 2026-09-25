import { createContext, useContext, useState } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const loginUser = async (username, password) => {
    const loginResponse = await apiClient.post('/auth/login/', { username, password });

    localStorage.setItem('accessToken', loginResponse.data.access);
    localStorage.setItem('refreshToken', loginResponse.data.refresh);

    const currentUserResponse = await apiClient.get('/users/me/');
    localStorage.setItem('currentUser', JSON.stringify(currentUserResponse.data));
    setCurrentUser(currentUserResponse.data);

    return currentUserResponse.data;
  };

  const logoutUser = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);