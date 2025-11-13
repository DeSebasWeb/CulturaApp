/**
 * Dashboard Page - Página principal después del login
 * Aquí se mostrarán las reservas del usuario
 */

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
        <div className="container-fluid">
          {/* Logo y título */}
          <div className="d-flex align-items-center">
            <svg 
              width="32" 
              height="32" 
              fill="none" 
              stroke="#6366f1" 
              strokeWidth="2"
              viewBox="0 0 24 24"
              className="me-2"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
              />
            </svg>
            <span className="navbar-brand mb-0 h5 fw-bold">CulturaApp</span>
          </div>

          {/* Usuario y logout */}
          <div className="d-flex align-items-center">
            <div className="text-end me-3">
              <p className="mb-0 fw-medium small">{user?.name}</p>
              <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-danger d-flex align-items-center"
            >
              <svg 
                width="16" 
                height="16" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                viewBox="0 0 24 24"
                className="me-2"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="container py-4">
        {/* Header del Dashboard */}
        <div className="mb-4">
          <h2 className="h3 fw-bold">
            ¡Bienvenido, {user?.name}! 👋
          </h2>
          <p className="text-muted">
            Gestiona tus reservas para eventos culturales
          </p>
        </div>

        {/* Cards de estadísticas */}
        <div className="row g-4 mb-4">
          {/* Card 1 - Reservas Activas */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                    <svg 
                      width="24" 
                      height="24" 
                      fill="none" 
                      stroke="#198754" 
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-muted small mb-1">Reservas Activas</p>
                    <h3 className="h2 mb-0 fw-bold">0</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - Próximos Eventos */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                    <svg 
                      width="24" 
                      height="24" 
                      fill="none" 
                      stroke="#0d6efd" 
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-muted small mb-1">Próximos Eventos</p>
                    <h3 className="h2 mb-0 fw-bold">5</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 - Total Gastado */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="rounded-circle p-3 me-3" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}>
                    <svg 
                      width="24" 
                      height="24" 
                      fill="none" 
                      stroke="#6366f1" 
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-muted small mb-1">Total Gastado</p>
                    <h3 className="h2 mb-0 fw-bold">$0</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje placeholder */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-5 text-center">
            <div style={{ maxWidth: '500px' }} className="mx-auto">
              <div className="rounded-circle mx-auto mb-4 d-inline-flex align-items-center justify-content-center" 
                   style={{ width: '64px', height: '64px', backgroundColor: 'rgba(99, 102, 241, 0.1)' }}>
                <svg 
                  width="32" 
                  height="32" 
                  fill="none" 
                  stroke="#6366f1" 
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                  />
                </svg>
              </div>
              <h3 className="h5 fw-semibold mb-3">
                Dashboard en Desarrollo
              </h3>
              
              <div className="alert alert-info border-0" role="alert">
                <strong>✅ Login funcional completado</strong>
                <br />
                La autenticación y la estructura base del proyecto están listas.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}