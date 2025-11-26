/**
 * ReservationCard - Tarjeta individual de reserva
 * Muestra información de una reserva con opciones de ver detalle y cancelar
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatCurrency, getCategoryStyle } from '../utils/helpers';

export default function ReservationCard({ reservation, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Verificar si la reserva tiene evento asociado
  if (!reservation.event) {
    return null;
  }

  const { event, status, quantity = 1 } = reservation;

  /**
   * Determina el estilo visual según el estado de la reserva
   */
  const getStatusStyle = () => {
    switch (status) {
      case 'active':
        return {
          bgClass: 'bg-success',
          textClass: 'text-success',
          badgeClass: 'badge bg-success',
          text: 'Activa',
          icon: '✓'
        };
      case 'pending':
        return {
          bgClass: 'bg-warning',
          textClass: 'text-warning',
          badgeClass: 'badge bg-warning',
          text: 'Pendiente',
          icon: '⏳'
        };
      case 'cancelled':
        return {
          bgClass: 'bg-danger',
          textClass: 'text-danger',
          badgeClass: 'badge bg-danger',
          text: 'Cancelada',
          icon: '✕'
        };
      default:
        return {
          bgClass: 'bg-secondary',
          textClass: 'text-secondary',
          badgeClass: 'badge bg-secondary',
          text: 'Desconocido',
          icon: '?'
        };
    }
  };

  const statusStyle = getStatusStyle();
  const categoryStyle = getCategoryStyle(event.category);
  const totalPrice = event.price * quantity;

  /**
   * Maneja la cancelación de una reserva
   */
  const handleCancel = async () => {
    if (status === 'cancelled') {
      return;
    }

    const confirmCancel = window.confirm(
      '¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer.'
    );

    if (!confirmCancel) return;

    setIsLoading(true);
    try {
      await onCancel(reservation.id);
    } catch (error) {
      console.error('Error al cancelar:', error);
      alert('No se pudo cancelar la reserva. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Navega al detalle de la reserva
   */
  const handleViewDetail = () => {
    navigate(`/reservations/${reservation.id}`);
  };

    const handleModify = () => {
    navigate(`/reservations/${reservation.id}/edit`);
  };

 

  return (
    <div className="card border-0 shadow-sm hover-shadow transition mb-3">
      <div className="card-body">
        <div className="row align-items-center">
          {/* Imagen del evento */}
          <div className="col-md-3 mb-3 mb-md-0">
            <img
              src={event.image || 'https://via.placeholder.com/300x200?text=Evento'}
              alt={event.name}
              className="img-fluid rounded"
              style={{
                width: '100%',
                height: '150px',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200?text=Evento';
              }}
            />
          </div>

          {/* Información del evento */}
          <div className="col-md-6 mb-3 mb-md-0">
            <div className="d-flex align-items-center mb-2">
              <span className={statusStyle.badgeClass}>
                {statusStyle.icon} {statusStyle.text}
              </span>
              <span className="badge bg-light text-dark ms-2">
                {categoryStyle.icon} {event.category}
              </span>
            </div>

            <h5 className="card-title fw-bold mb-2">{event.name}</h5>

            <div className="text-muted small">
              {/* Fecha y hora */}
              <div className="mb-1 d-flex align-items-center">
                <svg
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  className="me-2"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  <strong>{formatDate(event.date)}</strong> a las {event.time}
                </span>
              </div>

              {/* Ubicación */}
              <div className="mb-1 d-flex align-items-center">
                <svg
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  className="me-2"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{event.location}</span>
              </div>

              {/* Cantidad y precio */}
              <div className="d-flex align-items-center">
                <svg
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  className="me-2"
                >
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
                <span>
                  {quantity} {quantity === 1 ? 'entrada' : 'entradas'} · {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="col-md-3 text-md-end">
            <div className="d-grid gap-2">
              {/* Botón Ver Detalle */}
              <button
                onClick={handleViewDetail}
                className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center"
                disabled={isLoading}
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Ver Detalle
              </button>

               {/* Botón Modificar Reserva (solo si está activa) */}
              {status === 'active' && (
                <button
                  onClick={handleModify}
                  className="btn btn-warning text-white btn-sm d-flex align-items-center justify-content-center"
                  disabled={isLoading}
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Modificar Reserva
                </button>
              )}

              {/* Botón Cancelar (solo si está activa) */}
              {status === 'active' && (
                <button
                  onClick={handleCancel}
                  className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Cancelando...
                    </>
                  ) : (
                    <>
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Cancelar Reserva
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Fecha de creación */}
            <div className="text-muted small mt-2">
              Reservado el {new Date(reservation.createdAt).toLocaleDateString('es-CO')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
