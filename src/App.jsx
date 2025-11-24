/**
 * App.jsx - Componente principal de la aplicación
 * Configura las rutas y el contexto global
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import NewReservation from "./pages/NewReservation";
import ReservationDetail from "./pages/ReservationDetail";
import Events from "./pages/Events";

// Páginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública - Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Rutas protegidas */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route
  path="/events"
  element={
    <PrivateRoute>
      <Events />
    </PrivateRoute>
  }
/>

         {/* Crear nueva reserva (tu flujo de creación) */}
<Route
  path="/reservations/new"
  element={
    <PrivateRoute>
      <NewReservation />
    </PrivateRoute>
  }
/>

{/* Detalle de reserva */}
<Route
  path="/reservations/:id"
  element={
    <PrivateRoute>
      <ReservationDetail />
    </PrivateRoute>
  }
/>
{/* Redirección por defecto */}
<Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Ruta 404 */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                  <p className="text-xl text-gray-600 mb-8">Página no encontrada</p>
                  <a 
                    href="/dashboard" 
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    Volver al Dashboard
                  </a>
                </div>
              </div>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
