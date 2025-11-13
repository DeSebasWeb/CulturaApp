/**
 * API Simulada - CulturaApp
 * Simula un backend real usando localStorage y promesas asíncronas
 */

// Función auxiliar para simular delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Inicializa los datos en localStorage si no existen
 */
const initializeData = () => {
  // Usuarios de prueba
  if (!localStorage.getItem('users')) {
    const users = [
      { 
        id: 1, 
        username: 'admin', 
        password: '1234', 
        name: 'Juan Pérez',
        email: 'juan@example.com' 
      },
      { 
        id: 2, 
        username: 'maria', 
        password: '1234', 
        name: 'María García',
        email: 'maria@example.com' 
      }
    ];
    localStorage.setItem('users', JSON.stringify(users));
  }
  
  // Eventos culturales disponibles
  if (!localStorage.getItem('events')) {
    const events = [
      { 
        id: 1, 
        name: 'Concierto de Jazz en el Parque', 
        date: '2025-11-20',
        time: '19:00',
        location: 'Parque Central',
        description: 'Noche de jazz con las mejores bandas locales',
        category: 'Música',
        price: 25000,
        capacity: 100, 
        available: 95,
        image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400'
      },
      { 
        id: 2, 
        name: 'Exposición de Arte Contemporáneo', 
        date: '2025-11-22',
        time: '10:00',
        location: 'Museo de Arte Moderno',
        description: 'Obras de artistas emergentes colombianos',
        category: 'Arte',
        price: 15000,
        capacity: 50, 
        available: 45,
        image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400'
      },
      { 
        id: 3, 
        name: 'Taller de Fotografía', 
        date: '2025-11-25',
        time: '14:00',
        location: 'Casa de la Cultura',
        description: 'Aprende técnicas básicas de fotografía digital',
        category: 'Taller',
        price: 30000,
        capacity: 20, 
        available: 12,
        image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400'
      },
      { 
        id: 4, 
        name: 'Obra de Teatro: "El Quijote"', 
        date: '2025-11-28',
        time: '20:00',
        location: 'Teatro Municipal',
        description: 'Adaptación moderna del clásico de Cervantes',
        category: 'Teatro',
        price: 40000,
        capacity: 150, 
        available: 130,
        image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=400'
      },
      { 
        id: 5, 
        name: 'Festival de Cine Independiente', 
        date: '2025-12-01',
        time: '16:00',
        location: 'Cine Colombia',
        description: 'Proyección de cortometrajes latinoamericanos',
        category: 'Cine',
        price: 20000,
        capacity: 80, 
        available: 65,
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400'
      }
    ];
    localStorage.setItem('events', JSON.stringify(events));
  }
  
  // Reservas (inicialmente vacío o con datos de ejemplo)
  if (!localStorage.getItem('reservations')) {
    localStorage.setItem('reservations', JSON.stringify([]));
  }
};

// Ejecutar inicialización
initializeData();

/**
 * API objeto con todos los métodos disponibles
 */
export const api = {
  /**
   * Login - Autentica un usuario
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} - Usuario autenticado
   * @throws {Error} - Si las credenciales son inválidas
   */
  login: async (username, password) => {
    await delay(800); // Simular latencia de red
    
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      // eslint-disable-next-line no-unused-vars
      const { password: _password, ...userWithoutPassword } = user;
      return { 
        success: true, 
        user: userWithoutPassword 
      };
    }
    
    throw new Error('Credenciales inválidas. Verifica tu usuario y contraseña.');
  },

  /**
   * Get Reservations - Obtiene todas las reservas de un usuario
   * @param {number} userId - ID del usuario
   * @returns {Promise<Array>} - Lista de reservas del usuario
   */
  getReservations: async (userId) => {
    await delay(500);
    
    const reservations = JSON.parse(localStorage.getItem('reservations'));
    const events = JSON.parse(localStorage.getItem('events'));
    
    // Filtrar reservas del usuario y agregar información del evento
    const userReservations = reservations
      .filter(r => r.userId === userId)
      .map(reservation => {
        const event = events.find(e => e.id === reservation.eventId);
        return {
          ...reservation,
          event: event || null
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Más recientes primero
    
    return userReservations;
  },

  /**
   * Get Reservation by ID - Obtiene una reserva específica
   * @param {number} id - ID de la reserva
   * @returns {Promise<Object>} - Datos de la reserva
   */
  getReservationById: async (id) => {
    await delay(300);
    
    const reservations = JSON.parse(localStorage.getItem('reservations'));
    const events = JSON.parse(localStorage.getItem('events'));
    
    const reservation = reservations.find(r => r.id === parseInt(id));
    
    if (!reservation) {
      throw new Error('Reserva no encontrada');
    }
    
    const event = events.find(e => e.id === reservation.eventId);
    
    return {
      ...reservation,
      event: event || null
    };
  },

  /**
   * Get Events - Obtiene todos los eventos disponibles
   * @returns {Promise<Array>} - Lista de eventos
   */
  getEvents: async () => {
    await delay(400);
    
    const events = JSON.parse(localStorage.getItem('events'));
    
    // Filtrar solo eventos con disponibilidad
    return events.filter(e => e.available > 0);
  },

  /**
   * Get Event by ID - Obtiene un evento específico
   * @param {number} id - ID del evento
   * @returns {Promise<Object>} - Datos del evento
   */
  getEventById: async (id) => {
    await delay(300);
    
    const events = JSON.parse(localStorage.getItem('events'));
    const event = events.find(e => e.id === parseInt(id));
    
    if (!event) {
      throw new Error('Evento no encontrado');
    }
    
    return event;
  },

  /**
   * Create Reservation - Crea una nueva reserva
   * @param {Object} reservationData - Datos de la reserva
   * @returns {Promise<Object>} - Reserva creada
   */
  createReservation: async (reservationData) => {
    await delay(700);
    
    // Validaciones
    if (!reservationData.userId || !reservationData.eventId) {
      throw new Error('Faltan datos obligatorios para crear la reserva');
    }
    
    const events = JSON.parse(localStorage.getItem('events'));
    const reservations = JSON.parse(localStorage.getItem('reservations'));
    
    // Verificar disponibilidad del evento
    const event = events.find(e => e.id === reservationData.eventId);
    if (!event) {
      throw new Error('El evento no existe');
    }
    
    if (event.available <= 0) {
      throw new Error('No hay cupos disponibles para este evento');
    }
    
    // Verificar si el usuario ya tiene una reserva para este evento
    const existingReservation = reservations.find(
      r => r.userId === reservationData.userId && 
           r.eventId === reservationData.eventId &&
           r.status !== 'cancelled'
    );
    
    if (existingReservation) {
      throw new Error('Ya tienes una reserva activa para este evento');
    }
    
    // Crear nueva reserva
    const newReservation = {
      id: Date.now(),
      ...reservationData,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Actualizar disponibilidad del evento
    event.available -= (reservationData.quantity || 1);
    
    // Guardar cambios
    reservations.push(newReservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));
    localStorage.setItem('events', JSON.stringify(events));
    
    return {
      ...newReservation,
      event
    };
  },

  /**
   * Update Reservation - Modifica una reserva existente
   * @param {number} id - ID de la reserva
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} - Reserva actualizada
   */
  updateReservation: async (id, updateData) => {
    await delay(600);
    
    let reservations = JSON.parse(localStorage.getItem('reservations'));
    const reservationIndex = reservations.findIndex(r => r.id === parseInt(id));
    
    if (reservationIndex === -1) {
      throw new Error('Reserva no encontrada');
    }
    
    const reservation = reservations[reservationIndex];
    
    if (reservation.status === 'cancelled') {
      throw new Error('No puedes modificar una reserva cancelada');
    }
    
    // Actualizar reserva
    reservations[reservationIndex] = {
      ...reservation,
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('reservations', JSON.stringify(reservations));
    
    return reservations[reservationIndex];
  },

  /**
   * Cancel Reservation - Cancela una reserva
   * @param {number} id - ID de la reserva
   * @returns {Promise<Object>} - Confirmación de cancelación
   */
  cancelReservation: async (id) => {
    await delay(600);
    
    let reservations = JSON.parse(localStorage.getItem('reservations'));
    let events = JSON.parse(localStorage.getItem('events'));
    
    const reservationIndex = reservations.findIndex(r => r.id === parseInt(id));
    
    if (reservationIndex === -1) {
      throw new Error('Reserva no encontrada');
    }
    
    const reservation = reservations[reservationIndex];
    
    if (reservation.status === 'cancelled') {
      throw new Error('Esta reserva ya fue cancelada');
    }
    
    // Devolver disponibilidad al evento
    const event = events.find(e => e.id === reservation.eventId);
    if (event) {
      event.available += (reservation.quantity || 1);
    }
    
    // Marcar como cancelada
    reservations[reservationIndex].status = 'cancelled';
    reservations[reservationIndex].cancelledAt = new Date().toISOString();
    
    // Guardar cambios
    localStorage.setItem('reservations', JSON.stringify(reservations));
    localStorage.setItem('events', JSON.stringify(events));
    
    return { 
      success: true, 
      message: 'Reserva cancelada exitosamente',
      reservation: reservations[reservationIndex]
    };
  },

  /**
   * File to Data URL - Convierte un archivo a base64
   * @param {File} file - Archivo a convertir
   * @returns {Promise<string>} - String en formato base64
   */
  fileToDataUrl: (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No se proporcionó ningún archivo'));
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = () => {
        resolve(reader.result);
      };
      
      reader.onerror = () => {
        reject(new Error('Error al leer el archivo'));
      };
      
      reader.readAsDataURL(file);
    });
  }
};

/**
 * Función auxiliar para resetear datos (útil para testing)
 */
export const resetData = () => {
  localStorage.removeItem('users');
  localStorage.removeItem('events');
  localStorage.removeItem('reservations');
  initializeData();
};