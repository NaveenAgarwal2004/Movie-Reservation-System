import React from 'react';
import { describe, it, expect } from 'vitest';
import matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MovieCard from '../Movies/MovieCard';

const mockMovie = {
  id: '1',
  title: 'Test Movie',
  poster: 'https://example.com/poster.jpg',
  rating: 8.5,
  duration: 120,
  genre: ['Action', 'Drama'],
  year: 2024,
  description: 'A test movie description',
  isNowPlaying: true,
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('MovieCard', () => {
  it('renders movie information correctly', () => {
    renderWithRouter(<MovieCard movie={mockMovie} />);

    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('Action, Drama')).toBeInTheDocument();
    expect(screen.getByText('120 min • 2024')).toBeInTheDocument();
    expect(screen.getByText('8.5')).toBeInTheDocument();
  });

  it('displays "Now Playing" badge when movie is currently showing', () => {
    renderWithRouter(<MovieCard movie={mockMovie} />);

    expect(screen.getByText('Now Playing')).toBeInTheDocument();
  });

  it('does not display "Now Playing" badge when movie is not currently showing', () => {
    const notPlayingMovie = { ...mockMovie, isNowPlaying: false };
    renderWithRouter(<MovieCard movie={notPlayingMovie} />);

    expect(screen.queryByText('Now Playing')).not.toBeInTheDocument();
  });

  it('renders poster image with correct src and alt', () => {
    renderWithRouter(<MovieCard movie={mockMovie} />);

    const image = screen.getByAltText('Test Movie') as HTMLImageElement;
    expect(image.src).toContain('poster.jpg');
  });

  it('has correct link to movie details page', () => {
    renderWithRouter(<MovieCard movie={mockMovie} />);

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/movies/1');
  });

  it('shows description when showDetails is true', () => {
    renderWithRouter(<MovieCard movie={mockMovie} showDetails={true} />);

    expect(screen.getByText('A test movie description')).toBeInTheDocument();
  });

  it('hides description when showDetails is false', () => {
    renderWithRouter(<MovieCard movie={mockMovie} showDetails={false} />);

    expect(screen.queryByText('A test movie description')).not.toBeInTheDocument();
  });
});
