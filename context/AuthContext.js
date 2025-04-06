import { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";  // ✅ IMPORTA ESTO
import { API_BASE_URL } from '@env';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = async (username, password) => {
    try {
      console.log(API_BASE_URL)
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Credenciales incorrectas");
      }

      const data = await response.json();
      const jwtToken = data.token;

      // Decodificar el token para obtener roles
      const decodedToken = JSON.parse(atob(jwtToken.split(".")[1]));
      const roles = [decodedToken.role];

      if (!roles.includes("ROLE_ADMINISTRADOR")) {
        throw new Error("Acceso denegado: No eres administrador");
      }

      // ✅ Guardar usuario y token en estado
      setUser({ role: "admin", username });
      setToken(jwtToken);

      // ✅ Guardar el token en AsyncStorage para que esté disponible después
      await AsyncStorage.setItem("token", jwtToken);
      console.log("✅ Token guardado en AsyncStorage:", jwtToken);

    } catch (error) {
      console.error(error.message);
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("token");  // ✅ Borrar token al cerrar sesión
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
