import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface Seat {
  row: string;
  number: number;
  type: 'standard' | 'premium' | 'vip';
  price: number;
  isAvailable: boolean;
  isSelected?: boolean;
  isReserved?: boolean;
}

const SeatSelection = () => {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, joinShowtime, leaveShowtime, selectSeat, deselectSeat } = useSocket();
  
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [showtime, setShowtime] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock showtime data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setShowtime({
        id: showtimeId,
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
        date: '2024-01-15',
        time: '7:30 PM',
        price: {
          standard: 12,
          premium: 15,
          vip: 20
        }
      });
      setLoading(false);
    }, 1000);
  }, [showtimeId]);

  useEffect(() => {
    if (showtimeId && socket) {
      joinShowtime(showtimeId);
      return () => leaveShowtime(showtimeId);
    }
  }, [showtimeId, socket]);

  // Generate seat layout
  const generateSeats = (): Seat[][] => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const seatsPerRow = 12;
    const seatLayout: Seat[][] = [];

    rows.forEach((row, rowIndex) => {
      const rowSeats: Seat[] = [];
      for (let i = 1; i <= seatsPerRow; i++) {
        let seatType: 'standard' | 'premium' | 'vip' = 'standard';
        let price = 12;

        // Premium seats in middle rows
        if (rowIndex >= 3 && rowIndex <= 6) {
          seatType = 'premium';
          price = 15;
        }

        // VIP seats in back rows
        if (rowIndex >= 7) {
          seatType = 'vip';
          price = 20;
        }

        rowSeats.push({
          row,
          number: i,
          type: seatType,
          price,
          isAvailable: Math.random() > 0.3, // 70% available
          isSelected: false,
          isReserved: false
        });
      }
      seatLayout.push(rowSeats);
    });

    return seatLayout;
  };

  const [seatLayout] = useState(generateSeats());

  const handleSeatClick = (seat: Seat) => {
    if (!seat.isAvailable || seat.isReserved) return;

    const seatKey = `${seat.row}${seat.number}`;
    const isCurrentlySelected = selectedSeats.some(s => `${s.row}${s.number}` === seatKey);

    if (isCurrentlySelected) {
      setSelectedSeats(prev => prev.filter(s => `${s.row}${s.number}` !== seatKey));
      if (showtimeId) {
        deselectSeat(showtimeId, seat);
      }
    } else {
      if (selectedSeats.length >= 8) {
        toast.error('You can select maximum 8 seats');
        return;
      }
      setSelectedSeats(prev => [...prev, seat]);
      if (showtimeId) {
        selectSeat(showtimeId, seat);
      }
    }
  };

  const getSeatClass = (seat: Seat) => {
    const seatKey = `${seat.row}${seat.number}`;
    const isSelected = selectedSeats.some(s => `${s.row}${s.number}` === seatKey);

    if (!seat.isAvailable) return 'bg-gray-600 cursor-not-allowed';
    if (seat.isReserved) return 'bg-yellow-500 cursor-not-allowed';
    if (isSelected) return 'bg-red-600 hover:bg-red-700';
    
    switch (seat.type) {
      case 'vip':
        return 'bg-purple-600 hover:bg-purple-700 cursor-pointer';
      case 'premium':
        return 'bg-blue-600 hover:bg-blue-700 cursor-pointer';
      default:
        return 'bg-gray-500 hover:bg-gray-400 cursor-pointer';
    }
  };

  const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    // Pass selected seats and showtime info to checkout page
    navigate('/checkout/mock-booking-id', { state: { selectedSeats, showtime } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Movie Info */}
        <motion.div
          className="bg-gray-800 rounded-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-4">
            <img
              src={showtime?.movie.poster}
              alt={showtime?.movie.title}
              className="w-20 h-28 object-cover rounded-lg"
            />
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{showtime?.movie.title}</h1>
              <p className="text-gray-400 mb-1">{showtime?.theater.name}</p>
              <p className="text-gray-400 mb-1">{showtime?.theater.address}</p>
              <p className="text-white font-semibold">
                {new Date(showtime?.date).toLocaleDateString()} at {showtime?.time}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Seat Map */}
          <div className="lg:col-span-3">
            <motion.div
              className="bg-gray-800 rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-xl font-bold text-white mb-6 text-center">Select Your Seats</h2>
              
              {/* Screen */}
              <div className="mb-8">
                <div className="bg-gradient-to-r from-gray-600 to-gray-700 h-4 rounded-t-full mx-auto w-3/4 mb-2"></div>
                <p className="text-center text-gray-400 text-sm">SCREEN</p>
              </div>

              {/* Seat Layout */}
              <div className="space-y-2 mb-6">
                {seatLayout.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex justify-center items-center space-x-1">
                    <span className="text-gray-400 text-sm w-6 text-center">{row[0].row}</span>
                    <div className="flex space-x-1">
                      {row.slice(0, 6).map((seat, seatIndex) => (
                        <button
                          key={seatIndex}
                          onClick={() => handleSeatClick(seat)}
                          className={`w-8 h-8 rounded-t-lg text-xs font-medium transition-colors ${getSeatClass(seat)}`}
                          disabled={!seat.isAvailable || seat.isReserved}
                        >
                          {seat.number}
                        </button>
                      ))}
                    </div>
                    <div className="w-8"></div> {/* Aisle */}
                    <div className="flex space-x-1">
                      {row.slice(6).map((seat, seatIndex) => (
                        <button
                          key={seatIndex + 6}
                          onClick={() => handleSeatClick(seat)}
                          className={`w-8 h-8 rounded-t-lg text-xs font-medium transition-colors ${getSeatClass(seat)}`}
                          disabled={!seat.isAvailable || seat.isReserved}
                        >
                          {seat.number}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-500 rounded-t"></div>
                  <span className="text-gray-400">Standard ($12)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-600 rounded-t"></div>
                  <span className="text-gray-400">Premium ($15)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-purple-600 rounded-t"></div>
                  <span className="text-gray-400">VIP ($20)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-600 rounded-t"></div>
                  <span className="text-gray-400">Occupied</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-600 rounded-t"></div>
                  <span className="text-gray-400">Selected</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-gray-800 rounded-lg p-6 sticky top-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg font-bold text-white mb-4">Booking Summary</h3>
              
              {selectedSeats.length > 0 ? (
                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Selected Seats:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedSeats.map((seat, index) => (
                        <span
                          key={index}
                          className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                        >
                          {seat.row}{seat.number}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Seats ({selectedSeats.length})</span>
                      <span className="text-white">${totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Convenience Fee</span>
                      <span className="text-white">$2.50</span>
                    </div>
                    <div className="border-t border-gray-700 pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span className="text-white">Total</span>
                        <span className="text-red-500">${(totalAmount + 2.50).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm mb-6">No seats selected</p>
              )}

              <button
                onClick={handleProceedToCheckout}
                disabled={selectedSeats.length === 0}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Proceed to Checkout
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;