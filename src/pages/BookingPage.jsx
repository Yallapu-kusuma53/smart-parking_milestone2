// src/pages/BookingPage.jsx

import React, { useState } from 'react';
import { Car, MapPin, CreditCard, ArrowLeft } from 'lucide-react';

const BookingPage = ({ user, selectedSlot, searchDates, onNavigate, bookingService }) => {
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vehicleType: 'car',
    startDate: searchDates.startDate,
    endDate: searchDates.endDate
  });

  const calculateAmount = () => {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    
    const rates = {
      bike: 50,
      car: 100,
      suv: 150
    };
    
    return days * rates[formData.vehicleType];
  };

  const calculateDays = () => {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  };

  const handleSubmit = () => {
    if (!formData.vehicleNumber) {
      alert('⚠️ Please enter vehicle number');
      return;
    }

    if (formData.vehicleNumber.length < 4) {
      alert('⚠️ Please enter a valid vehicle number');
      return;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      alert('⚠️ End date must be after start date');
      return;
    }
    
    const bookingData = {
      userId: user.id,
      slotId: selectedSlot.id,
      slotName: selectedSlot.name,
      ...formData,
      amount: calculateAmount()
    };

    const result = bookingService.bookSlot(bookingData);
    
    if (result.success) {
      alert(`✅ Booking Confirmed Successfully!

━━━━━━━━━━━━━━━━━━━━━━
📍 Slot: ${selectedSlot.name} (${selectedSlot.zone})
🚗 Vehicle: ${formData.vehicleNumber}
📦 Type: ${formData.vehicleType.toUpperCase()}
📅 Duration: ${calculateDays()} days
💰 Total Amount: ₹${calculateAmount()}
📆 ${formData.startDate} to ${formData.endDate}
━━━━━━━━━━━━━━━━━━━━━━

Thank you for choosing Smart Parking!`);
      onNavigate('dashboard');
    }
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
              <Car className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Complete Booking</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-blue-200">
            <h3 className="font-bold text-lg text-gray-800 mb-3">Selected Parking Slot</h3>
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-full shadow-md">
                <MapPin className="text-blue-600" size={36} />
              </div>
              <div>
                <p className="font-bold text-2xl text-gray-800">{selectedSlot.name}</p>
                <p className="text-gray-600 font-medium">{selectedSlot.zone} • Floor {selectedSlot.floor}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Vehicle Registration Number *</label>
              <input
                type="text"
                className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono text-lg"
                value={formData.vehicleNumber}
                onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value.toUpperCase()})}
                placeholder="KA01AB1234"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Vehicle Type *</label>
              <select
                className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={formData.vehicleType}
                onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
              >
                <option value="bike">🏍️ Bike/Scooter - ₹50 per day</option>
                <option value="car">🚗 Car - ₹100 per day</option>
                <option value="suv">🚙 SUV - ₹150 per day</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Start Date *</label>
                <input
                  type="date"
                  className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">End Date *</label>
                <input
                  type="date"
                  className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  min={formData.startDate}
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Booking Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-300">
                  <span className="text-gray-600 font-medium">Parking Duration:</span>
                  <span className="font-bold text-gray-800">{calculateDays()} {calculateDays() === 1 ? 'Day' : 'Days'}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-gray-300">
                  <span className="text-gray-600 font-medium">Rate per Day:</span>
                  <span className="font-bold text-gray-800">₹{formData.vehicleType === 'bike' ? 50 : formData.vehicleType === 'car' ? 100 : 150}</span>
                </div>
                <div className="flex items-center justify-between pt-3">
                  <span className="text-xl font-bold text-gray-800">Total Amount:</span>
                  <span className="text-3xl font-bold text-blue-600">₹{calculateAmount()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <CreditCard size={24} />
              Confirm Booking & Pay ₹{calculateAmount()}
            </button>
            
            <p className="text-center text-sm text-gray-500">
              By clicking "Confirm Booking", you agree to our terms and conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;