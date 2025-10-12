import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // Add useLocation here
import { 
  CreditCardIcon, 
  LockClosedIcon, 
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  TicketIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Checkout = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Now properly imported
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  // Use booking data from navigation state or fallback to mock data
  const booking = location.state?.selectedSeats ? {
    id: bookingId,
    reference: 'BK-2024-001',
    movie: location.state.showtime?.movie || {
      title: 'The Dark Knight',
      poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300',
      duration: '152 min',
      rating: 9.0
    },
    theater: location.state.showtime?.theater || {
      name: 'CineMax Downtown',
      address: '123 Main St, Downtown'
    },
    showtime: location.state.showtime || {
      date: '2024-01-15',
      time: '7:30 PM'
    },
    seats: location.state.selectedSeats || [
      { row: 'H', number: 15, type: 'standard', price: 12.00 },
      { row: 'H', number: 16, type: 'standard', price: 12.00 }
    ],
    subtotal: location.state.selectedSeats ? location.state.selectedSeats.reduce((sum, seat) => sum + seat.price, 0) : 24.00,
    taxes: 2.40,
    fees: 2.10,
    total: location.state.selectedSeats ? location.state.selectedSeats.reduce((sum, seat) => sum + seat.price, 0) + 2.40 + 2.10 : 28.50
  } : {
    id: bookingId,
    reference: 'BK-2024-001',
    movie: {
      title: 'The Dark Knight',
      poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300',
      duration: '152 min',
      rating: 9.0
    },
    theater: {
      name: 'CineMax Downtown',
      address: '123 Main St, Downtown'
    },
    showtime: {
      date: '2024-01-15',
      time: '7:30 PM'
    },
    seats: [
      { row: 'H', number: 15, type: 'standard', price: 12.00 },
      { row: 'H', number: 16, type: 'standard', price: 12.00 }
    ],
    subtotal: 24.00,
    taxes: 2.40,
    fees: 2.10,
    total: 28.50
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      navigate(`/booking-confirmation/${booking.reference}`);
    }, 3000);
  };

  // If booking data is missing seats or showtime, redirect back to seat selection
  useEffect(() => {
    if (!booking.seats || booking.seats.length === 0 || !booking.showtime) {
      navigate(-1);
    }
  }, [booking, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Complete Your Booking</h1>
          <p className="text-gray-400">Review your order and complete payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <motion.div
            className="bg-gray-800 rounded-lg p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-white mb-6">Booking Summary</h2>
            
            <div className="flex items-start space-x-4 mb-6">
              <img
                src={booking.movie.poster}
                alt={booking.movie.title}
                className="w-20 h-28 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {booking.movie.title}
                </h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    <span>{booking.theater.name}</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span>{new Date(booking.showtime.date).toLocaleDateString()} at {booking.showtime.time}</span>
                  </div>
                  <div className="flex items-center">
                    <TicketIcon className="h-4 w-4 mr-2" />
                    <span>
                      Seats: {booking.seats.map(seat => `${seat.row}${seat.number}`).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-gray-700 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal ({booking.seats.length} tickets)</span>
                  <span>${booking.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Taxes & Fees</span>
                  <span>${(booking.taxes + booking.fees).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-700 pt-2 flex justify-between text-white font-semibold text-lg">
                  <span>Total</span>
                  <span>${booking.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            className="bg-gray-800 rounded-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold text-white mb-6">Payment Details</h2>

            {/* Payment Methods */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Payment Method
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-red-600 focus:ring-red-600 border-gray-600 bg-gray-700"
                  />
                  <span className="ml-3 text-white flex items-center">
                    <CreditCardIcon className="h-5 w-5 mr-2" />
                    Credit/Debit Card
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-red-600 focus:ring-red-600 border-gray-600 bg-gray-700"
                  />
                  <span className="ml-3 text-white">PayPal</span>
                </label>
              </div>
            </div>

            {/* Card Details */}
            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="number"
                    value={cardDetails.number}
                    onChange={handleCardChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiry"
                      value={cardDetails.expiry}
                      onChange={handleCardChange}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={cardDetails.cvv}
                      onChange={handleCardChange}
                      placeholder="123"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={cardDetails.name}
                    onChange={handleCardChange}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center text-green-400 text-sm">
                <LockClosedIcon className="h-4 w-4 mr-2" />
                <span>Your payment information is secure and encrypted</span>
              </div>
            </div>

            {/* Complete Payment Button */}
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full mt-6 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Complete Payment - ${booking.total.toFixed(2)}
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center mt-4">
              By completing this purchase, you agree to our Terms of Service and Privacy Policy.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;