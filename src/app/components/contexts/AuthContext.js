import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { TOKEN_LOCAL } from "../../../../pages/core/axios.interceptor";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const verifyUserState = () => {
    const token = localStorage.getItem(TOKEN_LOCAL);
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp > currentTime) {
        setUser({ role: decodedToken.role });
      } else {
        setUser(null);
      }
    }
  };

  useEffect(() => {
    verifyUserState();
  }, []);

  const login = (token) => {
    localStorage.setItem(TOKEN_LOCAL, token);
    verifyUserState();
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_LOCAL);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, verifyUserState }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
