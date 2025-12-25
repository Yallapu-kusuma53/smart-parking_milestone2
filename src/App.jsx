// src/App.jsx

import React, { useState, useEffect } from 'react';
import BookingService from './services/BookingService';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import BookingPage from './pages/BookingPage';
import BookingHistoryPage from './pages/BookingHistoryPage';

const bookingService = new BookingService();

export default function App() {
  const [currentPage, setCurrentPage] = useState('register');
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [searchDates, setSearchDates] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0]
  });

  useEffect(() => {
    const user = bookingService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      bookingService.logout();
      setCurrentUser(null);
      setCurrentPage('login');
    }
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleSlotSelect = (slot, dates) => {
    setSelectedSlot(slot);
    setSearchDates(dates);
  };

  if (currentPage === 'register') {
    return (
      <RegisterPage 
        onNavigate={handleNavigate} 
        bookingService={bookingService}
      />
    );
  }

  if (currentPage === 'login') {
    return (
      <LoginPage 
        onNavigate={handleNavigate} 
        onLogin={handleLogin}
        bookingService={bookingService}
      />
    );
  }

  if (currentPage === 'dashboard') {
    return (
      <Dashboard
        user={currentUser}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onSlotSelect={handleSlotSelect}
        bookingService={bookingService}
      />
    );
  }

  if (currentPage === 'booking' && selectedSlot) {
    return (
      <BookingPage
        user={currentUser}
        selectedSlot={selectedSlot}
        searchDates={searchDates}
        onNavigate={handleNavigate}
        bookingService={bookingService}
      />
    );
  }

  if (currentPage === 'bookings') {
    return (
      <BookingHistoryPage
        user={currentUser}
        onNavigate={handleNavigate}
        bookingService={bookingService}
      />
    );
  }

  return null;
}