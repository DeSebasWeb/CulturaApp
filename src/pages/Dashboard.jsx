/**
 * Dashboard Page - Página principal después del login
 * Muestra las reservas del usuario con estadísticas y listado completo
 */

import { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { api } from '../services/api';
import { formatCurrency } from '../utils/helpers';
import ReservationList from '../components/ReservationList';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Estados para las reservas
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para estadísticas calculadas
  const [stats, setStats] = useState({
    activeReservations: 0,
    totalEvents: 0,
    totalSpent: 0
  });

  /**
   * Cargar reservas del usuario al montar el componente
   */
  useEffect(() => {
    loadReservations();
  }, [user]);

  /**
   * Función para cargar reservas desde la API
   */
  const loadReservations = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const userReservations = await api.getReservations(user.id);
      setReservations(userReservations);

      // Calcular estadísticas
      calculateStats(userReservations);
    } catch (err) {
      console.error('Error al cargar reservas:', err);
      setError(err.message || 'No se pudieron cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calcula las estadísticas del dashboard
   */
  const calculateStats = (reservationsList) => {
    const active = reservationsList.filter(r => r.status === 'active').length;

    // Calcular total gastado (solo reservas activas)
    const total = reservationsList
      .filter(r => r.status === 'active')
      .reduce((sum, r) => {
        const quantity = r.quantity || 1;
        const price = r.event?.price || 0;
        return sum + (price * quantity);
      }, 0);

    setStats({
      activeReservations: active,
      totalEvents: reservationsList.length,
      totalSpent: total
    });
  };

  /**
   * Maneja la cancelación de una reserva
   */
  const handleCancelReservation = async (reservationId) => {
    try {
      await api.cancelReservation(reservationId);

      // Recargar reservas después de cancelar
      await loadReservations();

      alert('Reserva cancelada exitosamente');
    } catch (err) {
      console.error('Error al cancelar reserva:', err);
      throw err; // Re-lanzar para que el componente hijo lo maneje
    }
  };

  /**
   * Maneja el cierre de sesión
   */
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
                    {loading ? (
                      <div className="spinner-border spinner-border-sm text-success" role="status">
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                    ) : (
                      <h3 className="h2 mb-0 fw-bold">{stats.activeReservations}</h3>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - Total Reservas */}
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
                    <p className="text-muted small mb-1">Total Reservas</p>
                    {loading ? (
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                    ) : (
                      <h3 className="h2 mb-0 fw-bold">{stats.totalEvents}</h3>
                    )}
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
                    {loading ? (
                      <div className="spinner-border spinner-border-sm" style={{ color: '#6366f1' }} role="status">
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                    ) : (
                      <h3 className="h2 mb-0 fw-bold">{formatCurrency(stats.totalSpent)}</h3>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Listado de Reservas */}
        <ReservationList
          reservations={reservations}
          loading={loading}
          error={error}
          onCancelReservation={handleCancelReservation}
        />
      </main>
    </div>
  );
}