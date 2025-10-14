import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  joinShowtime: (showtimeId: string) => void;
  leaveShowtime: (showtimeId: string) => void;
  selectSeat: (showtimeId: string, seat: unknown) => void;
  deselectSeat: (showtimeId: string, seat: unknown) => void;
  selectedSeats: { [key: string]: unknown };
  reservedSeats: { [key: string]: unknown };
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<{ [key: string]: unknown }>({});
  const [reservedSeats] = useState<{ [key: string]: unknown }>({});
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && token) {
      // Use Vite environment variable instead of process.env
      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000';
      const newSocket = io(apiUrl, {
        auth: {
          token,
        },
      });

      newSocket.on('connect', () => {
        setConnected(true);
        console.log('Socket connected');
      });

      newSocket.on('disconnect', () => {
        setConnected(false);
        console.log('Socket disconnected');
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        toast.error('Connection failed');
      });

      // Seat selection events
      newSocket.on('seat-selected', (data) => {
        const seatKey = `${data.seat.row}-${data.seat.number}`;
        setSelectedSeats((prev) => ({
          ...prev,
          [seatKey]: {
            ...data.seat,
            userId: data.userId,
            expiresAt: data.expiresAt,
          },
        }));
      });

      newSocket.on('seat-deselected', (data) => {
        const seatKey = `${data.seat.row}-${data.seat.number}`;
        setSelectedSeats((prev) => {
          const newSeats = { ...prev };
          delete newSeats[seatKey];
          return newSeats;
        });
      });

      newSocket.on('seat-released', (data) => {
        const seatKey = `${data.seat.row}-${data.seat.number}`;
        setSelectedSeats((prev) => {
          const newSeats = { ...prev };
          delete newSeats[seatKey];
          return newSeats;
        });
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
        setConnected(false);
      }
    }
  }, [isAuthenticated, token, socket]);

  const joinShowtime = (showtimeId: string) => {
    if (socket) {
      socket.emit('join-showtime', showtimeId);
    }
  };

  const leaveShowtime = (showtimeId: string) => {
    if (socket) {
      socket.emit('leave-showtime', showtimeId);
    }
  };

  const selectSeat = (showtimeId: string, seat: unknown) => {
    if (socket) {
      socket.emit('select-seat', { showtimeId, seat });
    }
  };

  const deselectSeat = (showtimeId: string, seat: unknown) => {
    if (socket) {
      socket.emit('deselect-seat', { showtimeId, seat });
    }
  };

  const value = {
    socket,
    connected,
    joinShowtime,
    leaveShowtime,
    selectSeat,
    deselectSeat,
    selectedSeats,
    reservedSeats,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

// Export useSocket hook separately to avoid fast refresh issues
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
