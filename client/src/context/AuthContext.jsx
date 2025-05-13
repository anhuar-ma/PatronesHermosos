import { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on page load
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Verify token validity
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // If token is expired, logout
        if (decoded.exp < currentTime) {
          handleLogout();
        } else {
          // Set user from token
          setUser({
            id: decoded.id,
            correo: decoded.correo,
            rol: decoded.rol,
            id_sede: decoded.id_sede,
          });
          // Set authorization header for all future requests
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
      } catch (error) {
        handleLogout();
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post("/api/auth/login", {
        correo: email,
        contraseña: password,
      });

      const { token, user } = response.data;
      console.log("Login response:", response.data);

      // Save token to localStorage
      localStorage.setItem("token", token);

      // Set authorization header for all future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Decode the token to ensure we get all user data
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);

      // Update user state with consistent structure
      setUser({
        id: decoded.id,
        correo: decoded.correo,
        rol: decoded.rol,
        id_sede: decoded.id_sede,
        ...user, 
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al iniciar sesión",
      };
    }
  };

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");

    // Remove authorization header
    delete axios.defaults.headers.common["Authorization"];

    // Clear user state
    setUser(null);
  };

  // Check if user has a specific role
  const hasRole = (requiredRoles) => {
    if (!user) return false;
    console.log(requiredRoles);
    console.log(user.rol);
    return requiredRoles.includes(user.rol);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: handleLogin,
        logout: handleLogout,
        isAuthenticated: !!user,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
