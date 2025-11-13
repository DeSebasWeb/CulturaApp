/**
 * AuthContext - Manejo de estado global de autenticación
 * Proporciona información del usuario autenticado a toda la aplicación
 */

import { createContext, useState, useContext, useEffect } from 'react';


// Crear contexto
const AuthContext = createContext();

/**
 * Provider del contexto de autenticación
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al montar, verificar si hay un usuario guardado en localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Iniciar sesión - guarda el usuario en el estado y localStorage
   * @param {Object} userData - Datos del usuario autenticado
   */
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  /**
   * Cerrar sesión - limpia el usuario del estado y localStorage
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  /**
   * Verificar si el usuario está autenticado
   * @returns {boolean}
   */
  const isAuthenticated = () => {
    return user !== null;
  };

  // Valor que se compartirá con toda la aplicación
  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personalizado para usar el contexto de autenticación
 * @returns {Object} - Contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  
  return context;
};