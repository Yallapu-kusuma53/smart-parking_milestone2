// src/services/BookingService.js

class BookingService {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify([]));
    }
    if (!localStorage.getItem('bookings')) {
      localStorage.setItem('bookings', JSON.stringify([]));
    }
    if (!localStorage.getItem('slots')) {
      const slots = [];
      for (let i = 1; i <= 20; i++) {
        slots.push({
          id: i,
          name: `Slot ${i}`,
          zone: i <= 10 ? 'Zone A' : 'Zone B',
          available: true,
          floor: Math.ceil(i / 5)
        });
      }
      localStorage.setItem('slots', JSON.stringify(slots));
    }
  }

  getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }

  getBookings() {
    return JSON.parse(localStorage.getItem('bookings') || '[]');
  }

  getSlots() {
    return JSON.parse(localStorage.getItem('slots') || '[]');
  }

  register(userData) {
    const users = this.getUsers();
    const exists = users.find(u => u.email === userData.email);
    if (exists) {
      return { success: false, message: 'Email already registered' };
    }
    
    const newUser = {
      id: Date.now(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true, message: 'Registration successful', user: newUser };
  }

  login(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, message: 'Invalid credentials' };
  }

  getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  logout() {
    localStorage.removeItem('currentUser');
  }

  getAvailableSlots(startDate, endDate) {
    const slots = this.getSlots();
    const bookings = this.getBookings();
    
    return slots.filter(slot => {
      const hasConflict = bookings.some(booking => 
        booking.slotId === slot.id &&
        !(new Date(endDate) < new Date(booking.startDate) || 
          new Date(startDate) > new Date(booking.endDate))
      );
      return !hasConflict;
    });
  }

  bookSlot(bookingData) {
    const bookings = this.getBookings();
    const booking = {
      id: Date.now(),
      ...bookingData,
      createdAt: new Date().toISOString()
    };
    
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    return { success: true, booking };
  }

  getUserBookings(userId) {
    const bookings = this.getBookings();
    return bookings.filter(b => b.userId === userId);
  }

  cancelBooking(bookingId) {
    const bookings = this.getBookings();
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    
    if (bookingIndex === -1) {
      return { success: false, message: 'Booking not found' };
    }

    bookings[bookingIndex].cancelled = true;
    bookings[bookingIndex].cancelledAt = new Date().toISOString();
    
    localStorage.setItem('bookings', JSON.stringify(bookings));
    return { success: true, message: 'Booking cancelled successfully' };
  }

  getBookingById(bookingId) {
    const bookings = this.getBookings();
    return bookings.find(b => b.id === bookingId);
  }
}

export default BookingService;