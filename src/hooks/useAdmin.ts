import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../api/admin';
import toast from 'react-hot-toast';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: adminAPI.getDashboardStats,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useRecentBookings = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'recent-bookings'],
    queryFn: adminAPI.getRecentBookings,
    refetchInterval: 30000,
  });
};

export const useAdminMovies = (params?: any) => {
  return useQuery({
    queryKey: ['admin', 'movies', params],
    queryFn: () => adminAPI.getMovies(params),
  });
};

export const useCreateMovie = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: adminAPI.createMovie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'movies'] });
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      toast.success('Movie created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create movie');
    },
  });
};

export const useUpdateMovie = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminAPI.updateMovie(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'movies'] });
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      toast.success('Movie updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update movie');
    },
  });
};

export const useDeleteMovie = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: adminAPI.deleteMovie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'movies'] });
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      toast.success('Movie deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete movie');
    },
  });
};

export const useAdminTheaters = () => {
  return useQuery({
    queryKey: ['admin', 'theaters'],
    queryFn: adminAPI.getTheaters,
  });
};

export const useAdminUsers = (params?: any) => {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => adminAPI.getUsers(params),
  });
};

export const useAdminBookings = (params?: any) => {
  return useQuery({
    queryKey: ['admin', 'bookings', params],
    queryFn: () => adminAPI.getBookings(params),
  });
};