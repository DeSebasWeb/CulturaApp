// src/pages/ReservationDetail.jsx
/**
 * ReservationDetail - Página de detalle de una reserva
 * Carga la reserva desde la API por ID y muestra toda la info.
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { formatCurrency, formatDate } from "../utils/helpers";

export default function ReservationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar la reserva desde la API simulada
  useEffect(() => {
    const loadReservation = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await api.getReservationById(id);
        setReservation(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error al cargar la reserva");
      } finally {
        setLoading(false);
      }
    };

    loadReservation();
  }, [id]);

  // Manejar cancelación
  const handleCancel = async () => {
    if (!confirm("¿Deseas cancelar esta reserva?")) return;

    try {
      await api.cancelReservation(id);
      alert("Reserva cancelada correctamente.");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.message || "No se pudo cancelar la reserva.");
    }
  };

  // Estados de carga / error / no encontrada
  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-muted mb-0">
            Cargando detalle de la reserva...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card shadow-sm border-0 p-4">
          <h3 className="h5 mb-3 text-center">Ha ocurrido un error</h3>
          <p className="text-muted text-center mb-4">{error}</p>
          <button
            className="btn btn-primary w-100"
            onClick={() => navigate("/dashboard")}
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card shadow-sm border-0 p-4">
          <h3 className="h5 mb-3 text-center">Reserva no encontrada</h3>
          <p className="text-muted text-center mb-4">
            No se encontró la reserva que estás intentando ver.
          </p>
          <button
            className="btn btn-primary w-100"
            onClick={() => navigate("/dashboard")}
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { event, quantity, status, createdAt } = reservation;
  const totalPaid = (event?.price || 0) * (quantity || 1);

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container">
        <button
          className="btn btn-link text-decoration-none mb-3 ps-0"
          onClick={() => navigate(-1)}
        >
          ⬅ Volver
        </button>

        <div className="card border-0 shadow-sm overflow-hidden">
          <div className="row g-0">
            {/* Imagen del evento */}
            <div className="col-md-5">
              {event?.image ? (
                <img
                  src={event.image}
                  alt={event.name}
                  className="img-fluid h-100"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div className="p-5 text-center text-muted">
                  Sin imagen disponible
                </div>
              )}
            </div>

            {/* Información del detalle */}
            <div className="col-md-7">
              <div className="card-body p-4">
                <h1 className="h4 mb-1">
                  {event?.name || "Evento no disponible"}
                </h1>

                {/* Estado */}
                <span
                  className={`badge mb-3 ${
                    status === "active"
                      ? "bg-success"
                      : status === "cancelled"
                      ? "bg-danger"
                      : "bg-secondary"
                  }`}
                >
                  {status === "active"
                    ? "Reserva activa"
                    : status === "cancelled"
                    ? "Cancelada"
                    : "Estado desconocido"}
                </span>

                {/* Info básica */}
                {event && (
                  <>
                    <p className="mb-1">
                      <strong>Fecha:</strong> {formatDate(event.date)}
                    </p>
                    <p className="mb-1">
                      <strong>Hora:</strong> {event.time}
                    </p>
                    <p className="mb-1">
                      <strong>Lugar:</strong> {event.location}
                    </p>
                  </>
                )}

                {createdAt && (
                  <div className="text-muted small mb-3">
                    Reserva creada el {formatDate(createdAt)}
                  </div>
                )}

                {/* Compra */}
                <div className="border-top pt-3 mt-3">
                  <p className="mb-1">
                    <strong>Cantidad:</strong> {quantity} entrada(s)
                  </p>
                  {event && (
                    <>
                      <p className="mb-1">
                        <strong>Precio unitario:</strong>{" "}
                        {formatCurrency(event.price)}
                      </p>
                      <p className="fs-5">
                        <strong>Total pagado:</strong>{" "}
                        {formatCurrency(totalPaid)}
                      </p>
                    </>
                  )}
                </div>

                {/* Descripción */}
                {event?.description && (
                  <div className="mt-3">
                    <h2 className="h6">Descripción del evento</h2>
                    <p className="text-muted">{event.description}</p>
                  </div>
                )}

                {/* Botones */}
                <div className="mt-4 d-flex flex-wrap gap-2">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(-1)}
                  >
                    Volver
                  </button>

                  {status === "active" && (
                    <button className="btn btn-danger" onClick={handleCancel}>
                      Cancelar reserva
                    </button>
                  )}

                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/dashboard")}
                  >
                    Ir al Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}
