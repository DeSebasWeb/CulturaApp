/**
 * Helpers - Funciones auxiliares reutilizables
 */

/**
 * Formatea una fecha a formato legible en español
 * @param {string} dateString - Fecha en formato ISO o YYYY-MM-DD
 * @returns {string} - Fecha formateada
 */
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('es-CO', options);
  };
  
  /**
   * Formatea un precio a pesos colombianos
   * @param {number} amount - Monto a formatear
   * @returns {string} - Precio formateado
   */
  export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  /**
   * Verifica si una fecha es futura
   * @param {string} dateString - Fecha a verificar
   * @returns {boolean}
   */
  export const isFutureDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };
  
  /**
   * Obtiene el estado visual de una reserva
   * @param {Object} reservation - Objeto de reserva
   * @returns {Object} - { color, text, icon }
   */
  export const getReservationStatus = (reservation) => {
    if (reservation.status === 'cancelled') {
      return {
        color: 'red',
        text: 'Cancelada',
        bgClass: 'bg-red-100 text-red-800',
        icon: '❌'
      };
    }
    
    if (reservation.event && isFutureDate(reservation.event.date)) {
      return {
        color: 'green',
        text: 'Activa',
        bgClass: 'bg-green-100 text-green-800',
        icon: '✅'
      };
    }
    
    return {
      color: 'gray',
      text: 'Finalizada',
      bgClass: 'bg-gray-100 text-gray-800',
      icon: '📅'
    };
  };
  
  /**
   * Calcula días restantes hasta un evento
   * @param {string} dateString - Fecha del evento
   * @returns {number} - Días restantes
   */
  export const getDaysUntilEvent = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  /**
   * Trunca un texto a una longitud específica
   * @param {string} text - Texto a truncar
   * @param {number} maxLength - Longitud máxima
   * @returns {string}
   */
  export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  /**
   * Valida un email
   * @param {string} email
   * @returns {boolean}
   */
  export const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  /**
   * Genera un ID único simple (para uso local)
   * @returns {string}
   */
  export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };
  
  /**
   * Categorías de eventos con sus colores
   */
  export const EVENT_CATEGORIES = {
    'Música': { color: 'purple', icon: '🎵' },
    'Arte': { color: 'pink', icon: '🎨' },
    'Teatro': { color: 'blue', icon: '🎭' },
    'Cine': { color: 'indigo', icon: '🎬' },
    'Taller': { color: 'green', icon: '📚' },
    'Conferencia': { color: 'yellow', icon: '🎤' },
    'Exposición': { color: 'orange', icon: '🖼️' },
    'Festival': { color: 'red', icon: '🎉' }
  };
  
  /**
   * Obtiene el color para una categoría
   * @param {string} category
   * @returns {Object}
   */
  export const getCategoryStyle = (category) => {
    const cat = EVENT_CATEGORIES[category];
    if (!cat) return EVENT_CATEGORIES['Arte'];
    return cat;
  };