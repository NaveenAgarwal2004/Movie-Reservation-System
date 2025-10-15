import React from 'react';
import { Link } from 'react-router-dom';
import { FilmIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <FilmIcon className="h-8 w-8 text-red-600" />
              <span className="ml-2 text-xl font-bold text-white">CineMax</span>
            </div>
            <p className="mt-4 text-gray-400 text-sm">
              Experience the magic of cinema with CineMax. Book your favorite movies, select your
              preferred seats, and enjoy an unforgettable movie experience.
            </p>
            <div className="mt-6 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.553 3.5 13.075 3.5 11.446c0-1.629.698-3.107 1.626-4.245.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928 1.138 1.626 2.616 1.626 4.245 0 1.629-.698 3.107-1.626 4.245-.875.807-2.026 1.297-3.323 1.297z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Movies</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/movies" className="text-base text-gray-300 hover:text-white">
                  Now Playing
                </Link>
              </li>
              <li>
                <Link
                  to="/movies?filter=upcoming"
                  className="text-base text-gray-300 hover:text-white"
                >
                  Coming Soon
                </Link>
              </li>
              <li>
                <Link
                  to="/movies?filter=featured"
                  className="text-base text-gray-300 hover:text-white"
                >
                  Featured
                </Link>
              </li>
              <li>
                <Link to="/theaters" className="text-base text-gray-300 hover:text-white">
                  Theaters
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Support
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/help" className="text-base text-gray-300 hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-base text-gray-300 hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-base text-gray-300 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-base text-gray-300 hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-base text-gray-400">&copy; 2024 CineMax. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/privacy" className="text-gray-400 hover:text-gray-300 text-sm">
              Privacy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-gray-300 text-sm">
              Terms
            </Link>
            <Link to="/accessibility" className="text-gray-400 hover:text-gray-300 text-sm">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
