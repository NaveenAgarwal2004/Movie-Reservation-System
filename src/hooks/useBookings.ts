import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsAPI, CreateBookingData } from '../api/bookings';
import toast from 'react-hot-toast';

export const useUserBookings = (params?: any) => {
  return useQuery({
    queryKey: ['bookings', 'user', params],
    queryFn: () => bookingsAPI.getUserBookings(params),
  });
};

export const useBookingByReference = (reference: string) => {
  return useQuery({
    queryKey: ['booking', reference],
    queryFn: () => bookingsAPI.getBookingByReference(reference),
    enabled: !!reference,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingData: CreateBookingData) => bookingsAPI.createBooking(bookingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    },
  });
};

export const useConfirmBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, transactionId }: { bookingId: string; transactionId: string }) =>
      bookingsAPI.confirmBooking(bookingId, transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking confirmed successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to confirm booking');
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => bookingsAPI.cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking cancelled successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    },
  });
};
