import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { formatCurrency } from '../utils/helpers';
import { api } from '../services/api';


export default function EditReservation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    quantity: 1
  });

  // 🔥 Cargar reserva al montar el componente
  useEffect(() => {
    loadReservation();
  }, [id]);

   /**
   * 🔥 LLAMADO A LA API - Cargar reserva
   */
  const loadReservation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // ✅ Llamada a la API para obtener la reserva
      const data = await api.getReservationById(id);
      
      console.log('Reserva cargada:', data); // Para debug
      
      if (!data) {
        throw new Error('Reserva no encontrada');
      }

      // Verificar que la reserva esté activa
      if (data.status !== 'active') {
        throw new Error('Solo puedes modificar reservas activas');
      }

      // Actualizar estado con los datos de la API
      setReservation(data);
      setFormData({
        quantity: data.quantity || 1
      });
    } catch (error) {
      console.error('Error al cargar reserva:', error);
      setError(error.message || 'No se pudo cargar la reserva');
      alert(error.message);
      
 const data = await api.getReservationById(id);
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Manejar cambios en el formulario
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value, 10)
    }));
  };

  /**
   * 🔥 LLAMADO A LA API - Guardar cambios
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones locales
    if (formData.quantity < 1) {
      alert('La cantidad debe ser al menos 1');
      return;
    }

    if (formData.quantity > 10) {
      alert('El máximo es 10 entradas por reserva');
      return;
    }

    // Calcular diferencia
    const quantityDiff = formData.quantity - reservation.quantity;
    const priceDiff = quantityDiff * reservation.event.price;

   const updatedReservation = await api.updateReservation(id, updateData);
    // Confirmación con detalles
    let confirmMessage = `¿Confirmas los cambios?\n\n`;
    confirmMessage += `Cantidad anterior: ${reservation.quantity} entrada(s)\n`;
    confirmMessage += `Nueva cantidad: ${formData.quantity} entrada(s)\n\n`;
    confirmMessage += `Precio anterior: ${formatCurrency(reservation.quantity * reservation.event.price)}\n`;
    confirmMessage += `Nuevo precio: ${formatCurrency(formData.quantity * reservation.event.price)}`;
    
    if (priceDiff !== 0) {
      confirmMessage += `\n\nDiferencia: ${priceDiff > 0 ? '+' : ''}${formatCurrency(priceDiff)}`;
      if (priceDiff > 0) {
        confirmMessage += '\n(Deberás pagar el adicional)';
      } else {
        confirmMessage += '\n(Se te reembolsará)';
      }
    }

    const confirmModify = window.confirm(confirmMessage);

    if (!confirmModify) return;

    setIsSaving(true);
    setError(null);

    try {
      // ✅ Llamada a la API para actualizar la reserva
      const updateData = {
        quantity: formData.quantity
      };

      const updatedReservation = await api.updateReservation(id, updateData);

      console.log('Reserva actualizada:', updatedReservation); // Para debug

      // Mostrar mensaje de éxito
      alert('¡Reserva modificada exitosamente!');
      
      // Redirigir al dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al modificar:', error);
      setError(error.message || 'No se pudo modificar la reserva');
      
      // Mostrar error específico
      alert(`Error: ${error.message || 'No se pudo modificar la reserva. Intenta nuevamente.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Cancelar edición
   */
  const handleCancel = () => {
    const confirmCancel = window.confirm('¿Descartar los cambios?');
    if (confirmCancel) {
      navigate('/dashboard');
    }
  };

  /**
   * Calcular total actual
   */
  const calculateTotal = () => {
    if (!reservation?.event?.price) return 0;
    return formData.quantity * reservation.event.price;
  };

  /**
   * Calcular diferencia de precio
   */
  const calculateDifference = () => {
    if (!reservation) return 0;
    return calculateTotal() - (reservation.quantity * reservation.event.price);
  };

  // Estados de carga
  if (isLoading) {
    return (
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 text-muted">Cargando reserva...</p>
          </div>
        </div>
      </div>
    );
  }

  // ❌ Estado de error
  if (error) {
    return (
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-danger">
              <h5 className="alert-heading">Error</h5>
              <p>{error}</p>
              <hr />
              <button 
                className="btn btn-danger"
                onClick={() => navigate('/dashboard')}
              >
                Volver al Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No hay reserva
  if (!reservation) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">
          No se encontró la reserva
        </div>
      </div>
    );
  }

  const difference = calculateDifference();

  // Formulario de edición
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Header */}
          <div className="mb-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn btn-link text-decoration-none p-0 mb-3"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                className="me-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver a mis reservas
            </button>
            <h2 className="fw-bold">Modificar Reserva</h2>
            <p className="text-muted">Actualiza la cantidad de entradas</p>
          </div>

          {/* Card del Evento */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 mb-3 mb-md-0">
                  <img
                    src={reservation.event.image}
                    alt={reservation.event.name}
                    className="img-fluid rounded"
                    style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Evento';
                    }}
                  />
                </div>
                <div className="col-md-8">
                  <h5 className="fw-bold mb-3">{reservation.event.name}</h5>
                  <div className="text-muted small">
                    <div className="mb-2">
                      📅 <strong>{new Date(reservation.event.date).toLocaleDateString('es-CO', { 
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</strong> a las {reservation.event.time}
                    </div>
                    <div className="mb-2">
                      📍 {reservation.event.location}
                    </div>
                    <div className="mb-2">
                      🎭 {reservation.event.category}
                    </div>
                    <div>
                      💰 Precio por entrada: {formatCurrency(reservation.event.price)}
                    </div>
                    <div className="mt-2 text-success">
                      ✓ Disponibles: {reservation.event.available} entradas
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h5 className="fw-bold mb-4">Actualizar Cantidad</h5>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Número de entradas
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    required
                  />
                  <div className="form-text">
                    Mínimo 1, máximo 10 entradas por reserva
                  </div>
                </div>

                {/* Resumen */}
                <div className="alert alert-light border">
                  <h6 className="fw-bold mb-3">Resumen de Cambios</h6>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Cantidad anterior:</span>
                    <span>{reservation.quantity} entrada(s)</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Nueva cantidad:</span>
                    <span className="fw-semibold">{formData.quantity} entrada(s)</span>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Precio anterior:</span>
                    <span>{formatCurrency(reservation.quantity * reservation.event.price)}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Nuevo precio:</span>
                    <span className="fw-semibold">{formatCurrency(calculateTotal())}</span>
                  </div>

                  {difference !== 0 && (
                    <>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold">Diferencia:</span>
                        <span className={`fw-bold ${difference > 0 ? 'text-danger' : 'text-success'}`}>
                          {difference > 0 ? '+' : ''}{formatCurrency(difference)}
                        </span>
                      </div>
                      {difference > 0 && (
                        <small className="text-muted d-block mt-2">
                          * Deberás pagar la diferencia adicional
                        </small>
                      )}
                      {difference < 0 && (
                        <small className="text-muted d-block mt-2">
                          * Se te reembolsará la diferencia
                        </small>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="d-flex gap-3">
              <button
                type="submit"
                className="btn btn-warning text-white btn-lg flex-fill"
                disabled={isSaving || formData.quantity === reservation.quantity}
              >
                {isSaving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      className="me-2"
                      style={{ display: 'inline' }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Guardar Cambios
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-outline-secondary btn-lg flex-fill"
                disabled={isSaving}
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="me-2"
                  style={{ display: 'inline' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Cancelar
              </button>
            </div>
          </form>

          {/* Nota informativa */}
          <div className="alert alert-info mt-4">
            <svg
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 20 20"
              className="me-2"
              style={{ display: 'inline' }}
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <strong>Nota:</strong> Solo puedes modificar la cantidad de entradas. Para cambios en la fecha o evento, contacta al organizador.
          </div>
        </div>
      </div>
    </div>
  );
}