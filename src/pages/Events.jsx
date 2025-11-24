// src/pages/Events.jsx
/**
 * Events - Lista de eventos disponibles
 * Usa api.getEvents() para mostrar todos los eventos con sus datos.
 */

import { useEffect, useState } from "react";
import { api } from "../services/api";
import { formatDate, formatCurrency } from "../utils/helpers";
import { useNavigate } from "react-router-dom";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await api.getEvents();
        setEvents(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "No se pudieron cargar los eventos");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-muted mb-0">Cargando eventos culturales...</p>
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

  return (
    <div className="min-vh-100 bg-light">
      <main className="container py-4">
        <button
          className="btn btn-link text-decoration-none mb-3 ps-0"
          onClick={() => navigate(-1)}
        >
          ⬅ Volver
        </button>

        <h1 className="h3 mb-3">Eventos disponibles</h1>
        <p className="text-muted mb-4">
          Explora los eventos culturales y elige cuál deseas reservar.
        </p>

        <div className="row g-4">
          {events.map((event) => (
            <div key={event.id} className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm h-100">
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.name}
                    className="card-img-top"
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{event.name}</h5>
                  <p className="card-text small text-muted mb-2">
                    {formatDate(event.date)} · {event.time}
                    <br />
                    {event.location}
                  </p>
                  <p className="card-text small text-muted mb-2">
                    Precio: <strong>{formatCurrency(event.price)}</strong>
                    <br />
                    Cupos disponibles: <strong>{event.available}</strong>
                  </p>
                  <p className="card-text small text-muted flex-grow-1">
                    {event.description}
                  </p>
                  {/* Podrías aquí navegar a crear reserva directamente */}
                  <button
                    className="btn btn-outline-primary mt-2"
                    onClick={() => navigate("/reservations/new")}
                  >
                    Reservar este evento
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
