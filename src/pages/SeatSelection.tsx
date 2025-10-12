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
  isWheelchair?: boolean;
  isCouple?: boolean;
}

const SeatSelection = () => {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, joinShowtime, leaveShowtime, selectSeat, deselectSeat } = useSocket();
  
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [showtime, setShowtime] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reservationTimer, setReservationTimer] = useState<number | null>(null);
  const [showBestSeats, setShowBestSeats] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'standard' | 'premium' | 'vip' | 'wheelchair' | 'couple'>('all');

  // Mock showtime data
  useEffect(() => {
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

  // Reservation timer
  useEffect(() => {
    if (selectedSeats.length > 0 && !reservationTimer) {
      const timer = 900; // 15 minutes in seconds
      setReservationTimer(timer);

      const interval = setInterval(() => {
        setReservationTimer((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            toast.error('Reservation expired! Please select seats again.');
            setSelectedSeats([]);
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [selectedSeats.length]);

  const generateSeats = (): Seat[][] => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const seatsPerRow = 12;
    const seatLayout: Seat[][] = [];

    rows.forEach((row, rowIndex) => {
      const rowSeats: Seat[] = [];
      for (let i = 1; i <= seatsPerRow; i++) {
        let seatType: 'standard' | 'premium' | 'vip' = 'standard';
        let price = 12;
        let isWheelchair = false;
        let isCouple = false;

        // Wheelchair accessible seats (first row, specific seats)
        if (rowIndex === 0 && (i === 1 || i === 2 || i === 11 || i === 12)) {
          isWheelchair = true;
        }

        // Couple seats (center back rows)
        if (rowIndex >= 7 && i >= 5 && i <= 8 && i % 2 === 1) {
          isCouple = true;
        }

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
          isAvailable: Math.random() > 0.3,
          isSelected: false,
          isReserved: false,
          isWheelchair,
          isCouple
        });
      }
      seatLayout.push(rowSeats);
    });

    return seatLayout;
  };

  const [seatLayout] = useState(generateSeats());

  const getBestSeats = (count: number): Seat[] => {
    // Find best available seats in center of middle rows
    const bestRows = seatLayout.slice(4, 7); // Rows E, F, G
    const centerSeats: Seat[] = [];

    bestRows.forEach(row => {
      const availableInRow = row.filter(seat => seat.isAvailable && !seat.isReserved);
      const center = Math.floor(availableInRow.length / 2);
      const nearCenter = availableInRow.slice(Math.max(0, center - count), center + count);
      centerSeats.push(...nearCenter);
    });

    return centerSeats.slice(0, count);
  };

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
      
      // Check for couple seat pairing
      if (seat.isCouple) {
        const adjacentSeat = seatLayout
          .flat()
          .find(s => s.row === seat.row && s.number === seat.number + 1 && s.isCouple);
        
        if (adjacentSeat && adjacentSeat.isAvailable && !adjacentSeat.isReserved) {
          const confirmPair = window.confirm('This is a couple seat. Would you like to select both seats?');
          if (confirmPair) {
            setSelectedSeats(prev => [...prev, seat, adjacentSeat]);
            if (showtimeId) {
              selectSeat(showtimeId, seat);
              selectSeat(showtimeId, adjacentSeat);
            }
            return;
          }
        }
      }
      
      setSelectedSeats(prev => [...prev, seat]);
      if (showtimeId) {
        selectSeat(showtimeId, seat);
      }
    }
  };

  const handleSelectBestSeats = () => {
    const count = Math.min(2, 8 - selectedSeats.length);
    const bestSeats = getBestSeats(count);
    
    if (bestSeats.length === 0) {
      toast.error('No optimal seats available');
      return;
    }
    
    bestSeats.forEach(seat => handleSeatClick(seat));
    setShowBestSeats(false);
    toast.success(`Selected ${bestSeats.length} best available seats!`);
  };

  const getSeatClass = (seat: Seat) => {
    const seatKey = `${seat.row}${seat.number}`;
    const isSelected = selectedSeats.some(s => `${s.row}${s.number}` === seatKey);
    const isBestSeat = showBestSeats && getBestSeats(2).some(s => `${s.row}${s.number}` === seatKey);

    let baseClass = 'w-8 h-8 rounded-t-lg text-xs font-medium transition-all duration-200 ';

    if (!seat.isAvailable) {
      return baseClass + 'bg-gray-600 cursor-not-allowed opacity-50';
    }
    if (seat.isReserved) {
      return baseClass + 'bg-yellow-500 cursor-not-allowed animate-pulse';
    }
    if (isSelected) {
      return baseClass + 'bg-red-600 hover:bg-red-700 scale-110 shadow-lg';
    }
    if (isBestSeat) {
      return baseClass + 'bg-green-500 hover:bg-green-600 cursor-pointer animate-pulse';
    }
    
    if (seat.isWheelchair) {
      return baseClass + 'bg-blue-600 hover:bg-blue-700 cursor-pointer border-2 border-blue-400';
    }
    if (seat.isCouple) {
      return baseClass + 'bg-pink-600 hover:bg-pink-700 cursor-pointer';
    }
    
    switch (seat.type) {
      case 'vip':
        return baseClass + 'bg-purple-600 hover:bg-purple-700 cursor-pointer';
      case 'premium':
        return baseClass + 'bg-blue-600 hover:bg-blue-700 cursor-pointer';
      default:
        return baseClass + 'bg-gray-500 hover:bg-gray-400 cursor-pointer';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredSeats = seatLayout.map(row => 
    row.filter(seat => {
      if (filterType === 'all') return true;
      if (filterType === 'wheelchair') return seat.isWheelchair;
      if (filterType === 'couple') return seat.isCouple;
      return seat.type === filterType;
    }));

  const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const convenienceFee = 2.50;
  const gst = totalAmount * 0.18; // 18% GST

  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

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
          <div className="flex items-center justify-between">
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

            {reservationTimer !== null && (
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">Time remaining</p>
                <p className={`text-2xl font-bold ${reservationTimer < 60 ? 'text-red-500' : 'text-white'}`}>
                  {formatTime(reservationTimer)}
                </p>
              </div>
            )}
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Select Your Seats</h2>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowBestSeats(!showBestSeats)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                  >
                    {showBestSeats ? 'Hide' : 'Show'} Best Seats
                  </button>
                  
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <option value="all">All Seats</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                    <option value="vip">VIP</option>
                    <option value="wheelchair">Wheelchair</option>
                    <option value="couple">Couple</option>
                  </select>
                </div>
              </div>

              {showBestSeats && (
                <div className="mb-4 p-4 bg-green-600/20 border border-green-600 rounded-lg">
                  <p className="text-green-400 text-sm mb-2">
                    Green highlighted seats are the best available seats
                  </p>
                  <button
                    onClick={handleSelectBestSeats}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Auto-Select Best Seats
                  </button>
                </div>
              )}
              
              {/* Screen */}
              <div className="mb-8">
                <div className="bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 h-4 rounded-t-full mx-auto w-3/4 mb-2 shadow-lg"></div>
                <p className="text-center text-gray-400 text-sm">SCREEN THIS WAY</p>
              </div>

              {/* Seat Layout */}
              <div className="space-y-2 mb-6 overflow-x-auto">
                {seatLayout.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex justify-center items-center space-x-1">
                    <span className="text-gray-400 text-sm w-6 text-center font-medium">{row[0].row}</span>
                    <div className="flex space-x-1">
                      {row.slice(0, 6).map((seat, seatIndex) => (
                        <div key={seatIndex} className="relative group">
                          <button
                            onClick={() => handleSeatClick(seat)}
                            className={getSeatClass(seat)}
                            disabled={!seat.isAvailable || seat.isReserved}
                            title={`${seat.row}${seat.number} - ${seat.type} - $${seat.price}`}
                          >
                            {seat.isWheelchair ? '♿' : seat.isCouple ? '💑' : seat.number}
                          </button>
                          
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {seat.row}{seat.number} - {seat.type} - ${seat.price}
                            {seat.isWheelchair && ' (Wheelchair)'}
                            {seat.isCouple && ' (Couple)'}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="w-8"></div>
                    <div className="flex space-x-1">
                      {row.slice(6).map((seat, seatIndex) => (
                        <div key={seatIndex + 6} className="relative group">
                          <button
                            onClick={() => handleSeatClick(seat)}
                            className={getSeatClass(seat)}
                            disabled={!seat.isAvailable || seat.isReserved}
                            title={`${seat.row}${seat.number} - ${seat.type} - $${seat.price}`}
                          >
                            {seat.isWheelchair ? '♿' : seat.isCouple ? '💑' : seat.number}
                          </button>
                          
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {seat.row}{seat.number} - {seat.type} - ${seat.price}
                            {seat.isWheelchair && ' (Wheelchair)'}
                            {seat.isCouple && ' (Couple)'}
                          </div>
                        </div>
                      ))}
                    </div>
                    <span className="text-gray-400 text-sm w-6 text-center font-medium">{row[0].row}</span>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
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
                  <div className="w-4 h-4 bg-pink-600 rounded-t"></div>
                  <span className="text-gray-400">Couple Seat</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-600 rounded-t border-2 border-blue-400"></div>
                  <span className="text-gray-400">Wheelchair</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-600 rounded-t"></div>
                  <span className="text-gray-400">Occupied</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-t"></div>
                  <span className="text-gray-400">Reserved</span>
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
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Selected Seats:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSeats.map((seat, index) => (
                        <div
                          key={index}
                          className="relative group"
                        >
                          <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium">
                            {seat.row}{seat.number}
                          </span>
                          <button
                            onClick={() => handleSeatClick(seat)}
                            className="absolute -top-1 -right-1 bg-gray-900 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Seats ({selectedSeats.length})</span>
                      <span className="text-white">${totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Convenience Fee</span>
                      <span className="text-white">${convenienceFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">GST (18%)</span>
                      <span className="text-white">${gst.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-700 pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span className="text-white">Total</span>
                        <span className="text-red-500">${(totalAmount + convenienceFee + gst).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-3 text-xs text-gray-300">
                    <p className="mb-1">💡 <strong>Tips:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Center seats offer best view</li>
                      <li>Premium seats have extra legroom</li>
                      <li>VIP seats include recliner</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm mb-4">No seats selected</p>
                  <p className="text-gray-500 text-xs">
                    Click on available seats to select them
                  </p>
                </div>
              )}

              <button
                onClick={handleProceedToCheckout}
                disabled={selectedSeats.length === 0}
                className="w-full mt-6 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Proceed to Checkout
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                By proceeding, you agree to our Terms & Conditions
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;