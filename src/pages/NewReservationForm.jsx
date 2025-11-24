// src/pages/NewReservationForm.jsx
/**
 * NewReservationForm - Formulario para crear una reserva
 * - Usa los datos del API de eventos (name, date, time, location, price, available, image)
 * - Valida cantidad y selección de evento
 * - Muestra una vista previa con imagen y total estimado
 */

import { useEffect, useState } from "react";
import { api } from "../services/api";
import { formatDate, formatCurrency } from "../utils/helpers";

export default function NewReservationForm({ userId, onCreated }) {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [loadingEvents, setLoadingEvents] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    eventId: "",
    quantity: "",
  });

  // 1. Cargar eventos del API simulado
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoadingEvents(true);
        setFormError("");

        // Usa la función definida en services/api.js
        const data = await api.getEvents();
        setEvents(data);
      } catch (err) {
        console.error(err);
        setFormError("Error al cargar los eventos.");
      } finally {
        setLoadingEvents(false);
      }
    };

    loadEvents();
  }, []);

  const selectedEvent = events.find(
    (ev) => String(ev.id) === String(selectedEventId)
  );

  // 2. Validaciones del formulario
  const validateForm = () => {
    const errors = { eventId: "", quantity: "" };
    let ok = true;

    if (!selectedEventId) {
      errors.eventId = "Debes seleccionar un evento.";
      ok = false;
    }

    const qty = Number(quantity);

    if (!qty || qty <= 0) {
      errors.quantity = "La cantidad debe ser mayor a 0.";
      ok = false;
    } else if (selectedEvent && qty > selectedEvent.available) {
      errors.quantity = `Solo hay ${selectedEvent.available} cupos disponibles para este evento.`;
      ok = false;
    }

    setFieldErrors(errors);
    return ok;
  };

  // 3. Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!validateForm()) return;
    if (!userId || !selectedEvent) {
      setFormError("No se encontraron los datos del usuario o del evento.");
      return;
    }

    try {
      setSubmitting(true);

      // Usa la función de creación del API (ajusta el nombre si tu api.js usa otro)
      await api.createReservation({
        userId,
        eventId: selectedEvent.id,
        quantity: Number(quantity),
      });

      if (onCreated) onCreated();
    } catch (err) {
  console.error(err);
  setFormError(err.message || "No se pudo crear la reserva.");
} finally {
  setSubmitting(false);
}

  };

  const handleChangeQuantity = (e) => {
    const value = e.target.value;
    if (value === "") {
      setQuantity("");
    } else {
      const num = Number(value);
      if (num >= 0) setQuantity(num);
    }
  };

  return (
    <div className="row g-4">
      {/* Columna del formulario */}
      <div className="col-lg-6">
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <h2 className="h5 mb-3">Crear nueva reserva</h2>
            <p className="text-muted small mb-4">
              Selecciona un evento cultural y la cantidad de entradas que
              deseas reservar.
            </p>

            {formError && (
              <div className="alert alert-danger py-2 small" role="alert">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Evento */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Evento cultural
                </label>
                {loadingEvents ? (
                  <div className="d-flex align-items-center">
                    <div
                      className="spinner-border spinner-border-sm text-primary me-2"
                      role="status"
                    >
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    <span className="text-muted small">
                      Cargando eventos disponibles...
                    </span>
                  </div>
                ) : (
                  <select
                    className={`form-select ${
                      fieldErrors.eventId ? "is-invalid" : ""
                    }`}
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                  >
                    <option value="">Selecciona un evento...</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.name} — {formatDate(event.date)} (
                        {event.location})
                      </option>
                    ))}
                  </select>
                )}
                {fieldErrors.eventId && (
                  <div className="invalid-feedback">
                    {fieldErrors.eventId}
                  </div>
                )}
              </div>

              {/* Cantidad */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Cantidad de entradas
                </label>
                <input
                  type="number"
                  className={`form-control ${
                    fieldErrors.quantity ? "is-invalid" : ""
                  }`}
                  min="1"
                  value={quantity}
                  onChange={handleChangeQuantity}
                  placeholder="Número de entradas"
                />
                {selectedEvent && (
                  <div className="form-text">
                    Cupos disponibles para este evento:{" "}
                    <strong>{selectedEvent.available}</strong>
                  </div>
                )}
                {fieldErrors.quantity && (
                  <div className="invalid-feedback">
                    {fieldErrors.quantity}
                  </div>
                )}
              </div>

              {/* Resumen rápido */}
              {selectedEvent && (
                <div className="mb-3 small text-muted">
                  <p className="mb-1">
                    Precio por entrada:{" "}
                    <strong>{formatCurrency(selectedEvent.price)}</strong>
                  </p>
                  <p className="mb-0">
                    Total estimado:{" "}
                    <strong>
                      {formatCurrency(
                        (selectedEvent.price || 0) * (Number(quantity) || 0)
                      )}
                    </strong>
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-100 mt-2"
                disabled={submitting || loadingEvents}
              >
                {submitting ? "Creando reserva..." : "Crear reserva"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Columna de vista previa */}
      <div className="col-lg-6">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body p-4 d-flex flex-column">
            <h3 className="h6 mb-3">Vista previa del evento</h3>

            {!selectedEvent && (
              <p className="text-muted small mb-0">
                Selecciona un evento en el formulario para ver aquí los
                detalles y la imagen relacionada.
              </p>
            )}

            {selectedEvent && (
              <>
                {/* Imagen */}
                {selectedEvent.image ? (
                  <div className="mb-3">
                    <img
                      src={selectedEvent.image}
                      alt={selectedEvent.name}
                      className="img-fluid rounded"
                      style={{
                        maxHeight: "260px",
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                  </div>
                ) : (
                  <div className="mb-3 text-center text-muted small border rounded py-4">
                    Este evento no tiene imagen configurada en el API.
                  </div>
                )}

                {/* Info del evento */}
                <h4 className="h5 mb-1">{selectedEvent.name}</h4>
                <ul className="list-unstyled small text-muted mb-3">
                  <li>
                    <strong>Fecha:</strong> {formatDate(selectedEvent.date)}
                  </li>
                  <li>
                    <strong>Hora:</strong> {selectedEvent.time}
                  </li>
                  <li>
                    <strong>Lugar:</strong> {selectedEvent.location}
                  </li>
                  <li>
                    <strong>Precio:</strong>{" "}
                    {formatCurrency(selectedEvent.price)}
                  </li>
                  <li>
                    <strong>Cupos disponibles:</strong>{" "}
                    {selectedEvent.available}
                  </li>
                </ul>

                {/* Resumen de lo que va a reservar */}
                {quantity > 0 && (
                  <div className="mt-auto border-top pt-3 small">
                    <p className="mb-1">
                      Estás reservando{" "}
                      <strong>{Number(quantity)}</strong> entrada(s) para este
                      evento.
                    </p>
                    <p className="mb-0">
                      Total estimado:{" "}
                      <strong>
                        {formatCurrency(
                          (selectedEvent.price || 0) *
                            (Number(quantity) || 0)
                        )}
                      </strong>
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
