import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useWatchlist = () => {
  return useQuery({
    queryKey: ['watchlist'],
    queryFn: async () => {
      const response = await api.get('/api/watchlist');
      return response.data;
    },
  });
};

export const useCheckWatchlist = (movieId: string) => {
  return useQuery({
    queryKey: ['watchlist', 'check', movieId],
    queryFn: async () => {
      const response = await api.get(`/api/watchlist/check/${movieId}`);
      return response.data;
    },
    enabled: !!movieId,
  });
};

export const useAddToWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (movieId: string) => {
      const response = await api.post(`/api/watchlist/${movieId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      toast.success('Added to watchlist!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add to watchlist');
    },
  });
};

export const useRemoveFromWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (movieId: string) => {
      const response = await api.delete(`/api/watchlist/${movieId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      toast.success('Removed from watchlist');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to remove from watchlist');
    },
  });
};
