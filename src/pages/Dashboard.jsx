// src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { Calendar, Car, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

const Dashboard = ({ user, onNavigate, onLogout, onSlotSelect, bookingService }) => {
  const [slots, setSlots] = useState([]);
  const [searchDates, setSearchDates] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0]
  });

  useEffect(() => {
    loadSlots();
  }, [searchDates]);

  const loadSlots = () => {
    const available = bookingService.getAvailableSlots(searchDates.startDate, searchDates.endDate);
    setSlots(available);
  };

  const handleSlotClick = (slot) => {
    onSlotSelect(slot, searchDates);
    onNavigate('booking');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
              <Car className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Smart Parking</h1>
              <p className="text-sm text-gray-500">Intelligent Slot Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('bookings')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm flex items-center gap-2"
            >
              <Calendar size={18} />
              My Bookings
            </button>
            <div className="text-right">
              <p className="text-sm text-gray-500">Welcome back,</p>
              <p className="font-bold text-gray-800">{user.fullName}</p>
            </div>
            <button
              onClick={onLogout}
              className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="text-blue-600" />
            Smart Slot Finder
          </h2>
          <p className="text-gray-600 mb-4">Select your parking dates to find available slots</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Check-in Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchDates.startDate}
                onChange={(e) => setSearchDates({...searchDates, startDate: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Check-out Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchDates.endDate}
                onChange={(e) => setSearchDates({...searchDates, endDate: e.target.value})}
                min={searchDates.startDate}
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Available Parking Slots</h2>
          <p className="text-gray-600">
            {slots.length > 0 ? `Found ${slots.length} available slots for your selected dates` : 'No slots available for selected dates'}
          </p>
        </div>

        {slots.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {slots.map(slot => (
              <button
                key={slot.id}
                onClick={() => handleSlotClick(slot)}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-2xl transition-all hover:scale-105 border-2 border-transparent hover:border-blue-500 group"
              >
                <div className="text-center">
                  <div className="mb-3 flex justify-center">
                    <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors">
                      <MapPin className="text-green-600" size={32} />
                    </div>
                  </div>
                  <h3 className="font-bold text-xl text-gray-800 mb-1">{slot.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{slot.zone}</p>
                  <p className="text-xs text-gray-500 mb-3">Floor {slot.floor}</p>
                  <div className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                    AVAILABLE
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-lg">
            <AlertCircle className="mx-auto text-gray-300 mb-4" size={72} />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No Slots Available</h3>
            <p className="text-gray-500">Try selecting different dates to find available parking slots</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;