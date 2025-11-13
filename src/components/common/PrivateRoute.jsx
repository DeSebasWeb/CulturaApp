/**
 * PrivateRoute - Componente para proteger rutas que requieren autenticación
 * Redirige al login si el usuario no está autenticado
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Mientras carga, mostrar un loader
  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary" style={{ width: '4rem', height: '4rem' }} role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, mostrar el componente hijo
  return children;
};

export default PrivateRoute;