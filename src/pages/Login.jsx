/**
 * Login Page - Página de inicio de sesión
 */

import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { api } from '../services/api';

export default function Login() {
  const [credentials, setCredentials] = useState({ 
    username: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Si ya está autenticado, redirigir al dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  /**
   * Manejar cambios en los inputs
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error al escribir
    if (error) setError('');
  };

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!credentials.username || !credentials.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await api.login(credentials.username, credentials.password);
      login(result.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            {/* Card de Login */}
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="d-inline-block p-3 bg-primary bg-opacity-10 rounded-circle mb-3">
                    <svg 
                      width="48" 
                      height="48" 
                      fill="none" 
                      stroke="#6366f1" 
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                      />
                    </svg>
                  </div>
                  <h1 className="h2 fw-bold mb-2">CulturaApp</h1>
                  <p className="text-muted">Accede a tu cuenta</p>
                </div>

                {/* Mensaje de error */}
                {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <svg 
                      width="20" 
                      height="20" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                      className="me-2"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    <div>{error}</div>
                  </div>
                )}

                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                  {/* Campo Usuario */}
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label fw-medium">
                      Usuario
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      value={credentials.username}
                      onChange={handleChange}
                      className="form-control form-control-lg"
                      placeholder="Ingresa tu usuario"
                      disabled={loading}
                      required
                    />
                  </div>

                  {/* Campo Contraseña */}
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-medium">
                      Contraseña
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      value={credentials.password}
                      onChange={handleChange}
                      className="form-control form-control-lg"
                      placeholder="Ingresa tu contraseña"
                      disabled={loading}
                      required
                    />
                  </div>

                  {/* Botón Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-lg w-100"
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Iniciando sesión...
                      </>
                    ) : (
                      'Iniciar Sesión'
                    )}
                  </button>
                </form>

                {/* Información de prueba */}
                <div className="mt-4 p-3 bg-light rounded">
                  <p className="text-center text-muted mb-2 fw-medium small">
                    Credenciales de prueba:
                  </p>
                  <div className="small text-muted">
                    <p className="mb-1"><strong>Usuario:</strong> admin <strong>Contraseña:</strong> 1234</p>
                    <p className="mb-0"><strong>Usuario:</strong> maria <strong>Contraseña:</strong> 1234</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-white small mt-4">
              © 2025 CulturaApp - Plataforma de Reservas Culturales
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}