// src/pages/NewReservation.jsx
/**
 * NewReservation - Página para crear una nueva reserva
 * Envuelve el formulario y maneja la navegación después de crearla.
 */

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NewReservationForm from "./NewReservationForm";

export default function NewReservation() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCreated = () => {
    // Después de crear la reserva, lo llevamos al dashboard
    navigate("/dashboard");
  };

  if (!user) return null; // Por seguridad, aunque la ruta está protegida

  return (
    <div className="min-vh-100 bg-light">
      <main className="container py-4">
        {/* Botón volver */}
        <button
          className="btn btn-link text-decoration-none mb-3 ps-0"
          onClick={() => navigate(-1)}
        >
          ⬅ Volver
        </button>

        {/* Encabezado */}
        <div className="mb-3">
          <h1 className="h3 mb-1">Crear nueva reserva</h1>
          <p className="text-muted">
            Completa los datos del evento y la cantidad de entradas para generar
            una nueva reserva en CulturaApp.
          </p>
        </div>

        {/* Formulario reutilizable */}
        <NewReservationForm userId={user.id} onCreated={handleCreated} />
      </main>
    </div>
  );
}
