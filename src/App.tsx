import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import ErrorBoundary from './components/Common/ErrorBoundary';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// OMDb-powered pages (works in India without VPN)
import HomeOMDb from './pages/HomeOMDb';
import MoviesOMDb from './pages/MoviesOMDb';
import MovieDetailsOMDb from './pages/MovieDetailsOMDb';

// TMDB-powered pages (backup - requires VPN in India)
import HomeWithTMDB from './pages/HomeWithTMDB';
import Movies from './pages/MoviesWithTMDB';
import MovieDetails from './pages/MovieDetailsWithTMDB';

// Other pages
import InstallPrompt from './components/PWA/InstallPrompt';
import SeatSelection from './pages/SeatSelection';
import Checkout from './pages/Checkout';
import BookingConfirmation from './pages/BookingConfirmation';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Theaters from './pages/Theaters';
import Contact from './pages/Contact';
import Watchlist from './pages/Watchlist';
import LoyaltyProgram from './pages/LoyaltyProgram';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import './App.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  // Check if user prefers TMDB (can be toggled in settings)
  const useTMDB = localStorage.getItem('api-provider') === 'tmdb';

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SocketProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <div className="min-h-screen bg-gray-900 text-white">
                <Navbar />
                <main className="pt-16">
                  <Routes>
                    {/* OMDb Routes (Default - Works in India) */}
                    <Route path="/" element={useTMDB ? <HomeWithTMDB /> : <HomeOMDb />} />
                    <Route path="/movies" element={useTMDB ? <Movies /> : <MoviesOMDb />} />
                    <Route
                      path="/movies/:id"
                      element={useTMDB ? <MovieDetails /> : <MovieDetailsOMDb />}
                    />

                    {/* Alternative routes for explicit API selection */}
                    <Route path="/movies-omdb" element={<MoviesOMDb />} />
                    <Route path="/movies-omdb/:id" element={<MovieDetailsOMDb />} />
                    <Route path="/movies-tmdb" element={<Movies />} />
                    <Route path="/movies-tmdb/:id" element={<MovieDetails />} />

                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Public Routes */}
                    <Route path="/theaters" element={<Theaters />} />
                    <Route path="/contact" element={<Contact />} />

                    {/* Protected Routes */}
                    <Route
                      path="/seat-selection/:showtimeId"
                      element={
                        <ProtectedRoute>
                          <SeatSelection />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/checkout/:bookingId"
                      element={
                        <ProtectedRoute>
                          <Checkout />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/booking-confirmation/:reference"
                      element={
                        <ProtectedRoute>
                          <BookingConfirmation />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/watchlist"
                      element={
                        <ProtectedRoute>
                          <Watchlist />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/loyalty"
                      element={
                        <ProtectedRoute>
                          <LoyaltyProgram />
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin Routes */}
                    <Route
                      path="/admin/*"
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminPanel />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </main>
                <Footer />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#1f2937',
                      color: '#fff',
                    },
                    success: {
                      iconTheme: {
                        primary: '#10B981',
                        secondary: '#fff',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: '#EF4444',
                        secondary: '#fff',
                      },
                    },
                  }}
                />
                <InstallPrompt />
              </div>
            </Router>
          </SocketProvider>
        </AuthProvider>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
