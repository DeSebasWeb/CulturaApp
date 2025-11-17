/**
 * ReservationList - Listado de reservas del usuario
 * Renderiza múltiples ReservationCard y maneja estados de carga/error
 */

import ReservationCard from './ReservationCard';

export default function ReservationList({
  reservations = [],
  loading = false,
  error = null,
  onCancelReservation
}) {
  /**
   * Estado de carga - Muestra skeletons
   */
  if (loading) {
    return (
      <div className="container">
        <h2 className="h4 fw-bold mb-4">Mis Reservas</h2>

        {/* Skeleton loaders */}
        {[1, 2, 3].map((item) => (
          <div key={item} className="card border-0 shadow-sm mb-3">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-3 mb-3 mb-md-0">
                  <div
                    className="bg-secondary bg-opacity-25 rounded"
                    style={{ width: '100%', height: '150px' }}
                  >
                    <div className="d-flex align-items-center justify-content-center h-100">
                      <span className="spinner-border text-secondary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3 mb-md-0">
                  <div className="placeholder-glow">
                    <span className="placeholder col-4 mb-2"></span>
                    <span className="placeholder col-7 d-block mb-3"></span>
                    <span className="placeholder col-5 d-block mb-2"></span>
                    <span className="placeholder col-6 d-block"></span>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="placeholder-glow d-grid gap-2">
                    <span className="placeholder btn btn-outline-primary"></span>
                    <span className="placeholder btn btn-outline-danger"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  /**
   * Estado de error
   */
  if (error) {
    return (
      <div className="container">
        <div className="card border-0 shadow-sm">
          <div className="card-body p-5 text-center">
            <div className="rounded-circle mx-auto mb-4 d-inline-flex align-items-center justify-content-center bg-danger bg-opacity-10"
                 style={{ width: '80px', height: '80px' }}>
              <svg
                width="40"
                height="40"
                fill="none"
                stroke="#dc3545"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="h5 fw-bold mb-3 text-danger">Error al Cargar Reservas</h3>
            <p className="text-muted mb-4">{error}</p>
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Sin reservas
   */
  if (reservations.length === 0) {
    return (
      <div className="container">
        <h2 className="h4 fw-bold mb-4">Mis Reservas</h2>

        <div className="card border-0 shadow-sm">
          <div className="card-body p-5 text-center">
            <div className="rounded-circle mx-auto mb-4 d-inline-flex align-items-center justify-content-center"
                 style={{ width: '80px', height: '80px', backgroundColor: 'rgba(99, 102, 241, 0.1)' }}>
              <svg
                width="40"
                height="40"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="h5 fw-bold mb-3">No Tienes Reservas</h3>
            <p className="text-muted mb-4">
              Aún no has realizado ninguna reserva para eventos culturales.
              <br />
              ¡Explora los eventos disponibles y reserva tu lugar!
            </p>
            <a
              href="/events"
              className="btn btn-primary d-inline-flex align-items-center"
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Explorar Eventos
            </a>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Filtrar y categorizar reservas
   */
  const activeReservations = reservations.filter(r => r.status === 'active');
  const pastReservations = reservations.filter(r => r.status === 'cancelled' || r.status === 'completed');

  return (
    <div className="container">
      {/* Header con estadísticas */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h4 fw-bold mb-1">Mis Reservas</h2>
          <p className="text-muted mb-0">
            {activeReservations.length} {activeReservations.length === 1 ? 'reserva activa' : 'reservas activas'}
          </p>
        </div>

        {/* Botón para nueva reserva */}
        <a
          href="/events"
          className="btn btn-primary d-inline-flex align-items-center"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nueva Reserva
        </a>
      </div>

      {/* Reservas Activas */}
      {activeReservations.length > 0 && (
        <div className="mb-5">
          <h3 className="h6 fw-bold text-muted mb-3">
            RESERVAS ACTIVAS ({activeReservations.length})
          </h3>
          {activeReservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onCancel={onCancelReservation}
            />
          ))}
        </div>
      )}

      {/* Reservas Pasadas/Canceladas */}
      {pastReservations.length > 0 && (
        <div className="mb-4">
          <h3 className="h6 fw-bold text-muted mb-3">
            HISTORIAL ({pastReservations.length})
          </h3>
          {pastReservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onCancel={onCancelReservation}
            />
          ))}
        </div>
      )}
    </div>
  );
}
