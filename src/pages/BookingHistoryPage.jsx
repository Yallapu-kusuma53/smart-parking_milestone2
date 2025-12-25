// src/pages/BookingHistoryPage.jsx

import React, { useState, useEffect } from 'react';
import { Car, Calendar, MapPin, Clock, CreditCard, XCircle, CheckCircle, ArrowLeft, Filter, Search } from 'lucide-react';

const BookingHistoryPage = ({ user, onNavigate, bookingService }) => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, completed, cancelled
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, filterStatus, searchTerm]);

  const loadBookings = () => {
    const userBookings = bookingService.getUserBookings(user.id);
    setBookings(userBookings);
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Filter by status
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filterStatus === 'active') {
      filtered = filtered.filter(b => 
        !b.cancelled && new Date(b.endDate) >= today
      );
    } else if (filterStatus === 'completed') {
      filtered = filtered.filter(b => 
        !b.cancelled && new Date(b.endDate) < today
      );
    } else if (filterStatus === 'cancelled') {
      filtered = filtered.filter(b => b.cancelled);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(b =>
        b.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.slotName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredBookings(filtered);
  };

  const getBookingStatus = (booking) => {
    if (booking.cancelled) return 'cancelled';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);

    if (endDate < today) return 'completed';
    if (startDate <= today && endDate >= today) return 'ongoing';
    return 'upcoming';
  };

  const handleCancelBooking = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    const status = getBookingStatus(booking);

    if (status === 'completed' || status === 'cancelled') {
      alert('⚠️ Cannot cancel this booking');
      return;
    }

    if (confirm('Are you sure you want to cancel this booking?')) {
      const result = bookingService.cancelBooking(bookingId);
      if (result.success) {
        alert('✅ Booking cancelled successfully!');
        loadBookings();
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      upcoming: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Upcoming' },
      ongoing: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
      completed: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Completed' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' }
    };

    const badge = badges[status];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days;
  };

  const stats = {
    total: bookings.length,
    active: bookings.filter(b => getBookingStatus(b) === 'upcoming' || getBookingStatus(b) === 'ongoing').length,
    completed: bookings.filter(b => getBookingStatus(b) === 'completed').length,
    cancelled: bookings.filter(b => b.cancelled).length,
    totalSpent: bookings.filter(b => !b.cancelled).reduce((sum, b) => sum + b.amount, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
              <Calendar className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border border-green-200">
            <p className="text-sm text-gray-600 mb-1">Active</p>
            <p className="text-3xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Completed</p>
            <p className="text-3xl font-bold text-gray-600">{stats.completed}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border border-red-200">
            <p className="text-sm text-gray-600 mb-1">Cancelled</p>
            <p className="text-3xl font-bold text-red-600">{stats.cancelled}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-blue-600">₹{stats.totalSpent}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search by vehicle number or slot..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                  filterStatus === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                  filterStatus === 'active'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                  filterStatus === 'completed'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilterStatus('cancelled')}
                className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                  filterStatus === 'cancelled'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancelled
              </button>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const status = getBookingStatus(booking);
              const duration = calculateDuration(booking.startDate, booking.endDate);

              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-xl transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <MapPin className="text-blue-600" size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{booking.slotName}</h3>
                          <p className="text-sm text-gray-600">Booking ID: #{booking.id}</p>
                        </div>
                        {getStatusBadge(status)}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <Car className="text-gray-400" size={18} />
                          <div>
                            <p className="text-xs text-gray-500">Vehicle</p>
                            <p className="font-semibold text-gray-800">{booking.vehicleNumber}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="text-gray-400" size={18} />
                          <div>
                            <p className="text-xs text-gray-500">Duration</p>
                            <p className="font-semibold text-gray-800">{duration} {duration === 1 ? 'Day' : 'Days'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="text-gray-400" size={18} />
                          <div>
                            <p className="text-xs text-gray-500">Dates</p>
                            <p className="font-semibold text-gray-800 text-sm">{booking.startDate}</p>
                            <p className="font-semibold text-gray-800 text-sm">to {booking.endDate}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <CreditCard className="text-gray-400" size={18} />
                          <div>
                            <p className="text-xs text-gray-500">Amount</p>
                            <p className="font-bold text-blue-600 text-lg">₹{booking.amount}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          Booked on: {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2">
                      {(status === 'upcoming' || status === 'ongoing') && !booking.cancelled && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center gap-2"
                        >
                          <XCircle size={18} />
                          Cancel
                        </button>
                      )}
                      
                      {status === 'completed' && (
                        <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold flex items-center gap-2">
                          <CheckCircle size={18} />
                          Completed
                        </div>
                      )}

                      {booking.cancelled && (
                        <div className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold flex items-center gap-2">
                          <XCircle size={18} />
                          Cancelled
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-lg">
            <Calendar className="mx-auto text-gray-300 mb-4" size={72} />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No Bookings Found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your filters or search term'
                : 'You haven\'t made any bookings yet'}
            </p>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Browse Available Slots
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistoryPage;