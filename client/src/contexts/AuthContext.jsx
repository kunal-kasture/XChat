import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    withCredentials: true,
  });

  const storedToken = localStorage.getItem("accessToken");
  if (storedToken) {
    api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
  }

  const checkAuth = async () => {
    try {
      const response = await api.get("/users/me");
      if (response.data && response.data.success) {
        setUser(response.data.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/users/login", { email, password });
    if (response.data && response.data.success) {
      const userData = response.data.data.user;
      const token = response.data.data.accessToken;

      if (token) {
        localStorage.setItem("accessToken", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      setUser(userData);
      return response.data;
    }
    throw new Error(response.data?.message || "Login failed");
  };

  const register = async (userData) => {
    const response = await api.post("/users/register", userData);
    return response.data;
  };

  const logout = async () => {
    try {
      await api.get("/users/logout");
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem("accessToken");
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        checkAuth,
        api,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
