import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
 

  useEffect(() => {
    const checkAuthentication = async () => {
      const refresh_token = await AsyncStorage.getItem("refresh_token");
      const storedToken = await AsyncStorage.getItem("token");
     
      if (refresh_token && storedToken) {
        setLoggedIn(true);
        setToken(storedToken);
      }
    };
    checkAuthentication();
  }, []);

  const login = async ( token, refresh_token) => {
    await AsyncStorage.setItem("refresh_token", refresh_token);
    await AsyncStorage.setItem("token", token); // Save token

    setLoggedIn(true);
    setToken(token); // Update state with the token
  
  };

  const logout = async () => {
    await AsyncStorage.removeItem("refresh_token");
    await AsyncStorage.removeItem("token"); // Remove token on logout
     
    setLoggedIn(false);
    setToken(null); // Clear token
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
