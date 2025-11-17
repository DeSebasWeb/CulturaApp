/**
 * Test Data - Datos de prueba para desarrollo
 * Funciones para agregar reservas de prueba al localStorage
 */

/**
 * Agrega reservas de prueba para un usuario
 * Útil para testing y desarrollo
 */
export const addTestReservations = (userId = 1) => {
  const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');

  // Verificar si ya existen reservas para este usuario
  const existingReservations = reservations.filter(r => r.userId === userId);

  if (existingReservations.length > 0) {
    console.log('El usuario ya tiene reservas. No se agregaron datos de prueba.');
    return;
  }

  // Crear reservas de prueba
  const testReservations = [
    {
      id: Date.now() + 1,
      userId: userId,
      eventId: 1, // Concierto de Jazz
      quantity: 2,
      status: 'active',
      createdAt: new Date('2025-11-15').toISOString(),
      updatedAt: new Date('2025-11-15').toISOString()
    },
    {
      id: Date.now() + 2,
      userId: userId,
      eventId: 3, // Taller de Fotografía
      quantity: 1,
      status: 'active',
      createdAt: new Date('2025-11-16').toISOString(),
      updatedAt: new Date('2025-11-16').toISOString()
    },
    {
      id: Date.now() + 3,
      userId: userId,
      eventId: 4, // Obra de Teatro
      quantity: 1,
      status: 'cancelled',
      createdAt: new Date('2025-11-10').toISOString(),
      updatedAt: new Date('2025-11-14').toISOString(),
      cancelledAt: new Date('2025-11-14').toISOString()
    }
  ];

  // Agregar las nuevas reservas
  const updatedReservations = [...reservations, ...testReservations];
  localStorage.setItem('reservations', JSON.stringify(updatedReservations));

  console.log(`Se agregaron ${testReservations.length} reservas de prueba para el usuario ${userId}`);
  console.log('Recarga la página para ver los cambios');
};

/**
 * Limpia todas las reservas del localStorage
 */
export const clearAllReservations = () => {
  localStorage.setItem('reservations', JSON.stringify([]));
  console.log('Todas las reservas han sido eliminadas');
  console.log('Recarga la página para ver los cambios');
};

/**
 * Muestra todas las reservas actuales
 */
export const showReservations = () => {
  const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
  console.log('Reservas actuales:', reservations);
  return reservations;
};

// Hacer las funciones disponibles en window para fácil acceso desde la consola
if (typeof window !== 'undefined') {
  window.addTestReservations = addTestReservations;
  window.clearAllReservations = clearAllReservations;
  window.showReservations = showReservations;
}
