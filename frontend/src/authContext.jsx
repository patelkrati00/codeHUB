import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

// Custom hook
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currUser, setCurrUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setCurrUser(userId);
    }
  }, []);

  // You can choose object or array; using object here
  const value = { currUser, setCurrUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
