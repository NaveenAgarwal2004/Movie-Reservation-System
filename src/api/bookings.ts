import api from './auth';

export interface Booking {
  id: string;
  user: string;
  showtime: string | any;
  seats: Array<{
    row: string;
    number: number;
    type: string;
    price: number;
  }>;
  totalAmount: number;
  bookingReference: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'paypal' | 'cash' | 'wallet';
  paymentDetails?: {
    transactionId?: string;
    paymentDate?: string;
    refundId?: string;
    refundDate?: string;
  };
  discount?: {
    type: string;
    value: number;
    code: string;
    amount: number;
  };
  additionalServices?: Array<{
    type: string;
    description: string;
    price: number;
  }>;
  qrCode?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingData {
  showtimeId: string;
  seats: Array<{
    row: string;
    number: number;
    type: string;
  }>;
  paymentMethod: string;
  discountCode?: string;
}

export const bookingsAPI = {
  getUserBookings: async (params?: { page?: number; limit?: number; status?: string }) => {
    const response = await api.get('/api/bookings/my-bookings', { params });
    return response.data;
  },

  getBookingByReference: async (reference: string) => {
    const response = await api.get(`/api/bookings/${reference}`);
    return response.data;
  },

  createBooking: async (bookingData: CreateBookingData) => {
    const response = await api.post('/api/bookings', bookingData);
    return response.data;
  },

  confirmBooking: async (bookingId: string, transactionId: string) => {
    const response = await api.post(`/api/bookings/${bookingId}/confirm`, {
      transactionId,
    });
    return response.data;
  },

  cancelBooking: async (bookingId: string) => {
    const response = await api.post(`/api/bookings/${bookingId}/cancel`);
    return response.data;
  },
};

export default bookingsAPI;
