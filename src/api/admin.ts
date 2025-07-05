import api from './auth';

export interface DashboardStats {
  totalMovies: number;
  totalTheaters: number;
  totalUsers: number;
  todayBookings: number;
  totalRevenue: number;
}

export const adminAPI = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/api/admin/dashboard/stats');
    return response.data;
  },

  getRecentBookings: async () => {
    const response = await api.get('/api/admin/dashboard/recent-bookings');
    return response.data;
  },

  // Movies management
  getMovies: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get('/api/admin/movies', { params });
    return response.data;
  },

  createMovie: async (movieData: any) => {
    const response = await api.post('/api/admin/movies', movieData);
    return response.data;
  },

  updateMovie: async (id: string, movieData: any) => {
    const response = await api.put(`/api/admin/movies/${id}`, movieData);
    return response.data;
  },

  deleteMovie: async (id: string) => {
    const response = await api.delete(`/api/admin/movies/${id}`);
    return response.data;
  },

  // Theaters management
  getTheaters: async () => {
    const response = await api.get('/api/admin/theaters');
    return response.data;
  },

  createTheater: async (theaterData: any) => {
    const response = await api.post('/api/admin/theaters', theaterData);
    return response.data;
  },

  // Users management
  getUsers: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get('/api/admin/users', { params });
    return response.data;
  },

  // Bookings management
  getBookings: async (params?: { page?: number; limit?: number; status?: string }) => {
    const response = await api.get('/api/admin/bookings', { params });
    return response.data;
  },
};

export default adminAPI;