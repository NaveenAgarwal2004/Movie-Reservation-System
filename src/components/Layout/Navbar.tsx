import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  FilmIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  UserIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Check current API provider
  const [apiProvider, setApiProvider] = useState(localStorage.getItem('api-provider') || 'omdb');

  const toggleApiProvider = () => {
    const newProvider = apiProvider === 'omdb' ? 'tmdb' : 'omdb';
    localStorage.setItem('api-provider', newProvider);
    setApiProvider(newProvider);
    window.location.reload(); // Reload to apply changes
  };

  const navigation = [
    { name: 'Home', href: '/', current: false },
    { name: 'Movies', href: '/movies', current: false },
    { name: 'Theaters', href: '/theaters', current: false },
    { name: 'Contact', href: '/contact', current: false },
  ];

  return (
    <nav className="bg-gray-900 shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <FilmIcon className="h-8 w-8 text-red-600" />
              <span className="ml-2 text-xl font-bold text-white">CineMax</span>
            </Link>

            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* API Provider Toggle */}
            <div className="hidden lg:flex items-center">
              <button
                onClick={toggleApiProvider}
                className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs font-medium text-gray-300 hover:text-white transition-colors border border-gray-700"
                title={`Currently using ${apiProvider.toUpperCase()} API. Click to switch.`}
              >
                <GlobeAltIcon className="h-4 w-4" />
                <span>{apiProvider === 'omdb' ? '🇮🇳 OMDb' : '🌐 TMDB'}</span>
                {apiProvider === 'omdb' && <span className="text-green-400 text-xs">●</span>}
              </button>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="hidden md:block text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  My Bookings
                </Link>

                <Link
                  to="/watchlist"
                  className="hidden md:block text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Watchlist
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="hidden md:block text-yellow-400 hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}

                <Menu as="div" className="relative">
                  <div>
                    <Menu.Button className="flex items-center space-x-2 text-sm rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open user menu</span>
                      {user?.avatar ? (
                        <img className="h-8 w-8 rounded-full" src={user.avatar} alt="" />
                      ) : (
                        <UserCircleIcon className="h-8 w-8" />
                      )}
                      <ChevronDownIcon className="h-4 w-4" />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-4 py-2 text-sm text-gray-900 border-b border-gray-200">
                        <div className="font-medium">
                          {user?.firstName} {user?.lastName}
                        </div>
                        <div className="text-gray-500 text-xs">{user?.email}</div>
                      </div>

                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } flex items-center px-4 py-2 text-sm text-gray-700`}
                          >
                            <UserIcon className="h-4 w-4 mr-3" />
                            Profile
                          </Link>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/dashboard"
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } flex items-center px-4 py-2 text-sm text-gray-700`}
                          >
                            <FilmIcon className="h-4 w-4 mr-3" />
                            My Bookings
                          </Link>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/watchlist"
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } flex items-center px-4 py-2 text-sm text-gray-700`}
                          >
                            <svg className="h-4 w-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                            </svg>
                            Watchlist
                          </Link>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/loyalty"
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } flex items-center px-4 py-2 text-sm text-gray-700`}
                          >
                            <svg className="h-4 w-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Loyalty Program
                          </Link>
                        )}
                      </Menu.Item>

                      <div className="border-t border-gray-200"></div>

                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={toggleApiProvider}
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                          >
                            <GlobeAltIcon className="h-4 w-4 mr-3" />
                            API: {apiProvider === 'omdb' ? '🇮🇳 OMDb' : '🌐 TMDB'}
                          </button>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/settings"
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } flex items-center px-4 py-2 text-sm text-gray-700`}
                          >
                            <CogIcon className="h-4 w-4 mr-3" />
                            Settings
                          </Link>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                          >
                            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden ml-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* API Toggle in Mobile */}
            <button
              onClick={() => {
                toggleApiProvider();
                setMobileMenuOpen(false);
              }}
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              <div className="flex items-center">
                <GlobeAltIcon className="h-5 w-5 mr-2" />
                API: {apiProvider === 'omdb' ? '🇮🇳 OMDb' : '🌐 TMDB'}
              </div>
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Bookings
                </Link>
                <Link
                  to="/watchlist"
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Watchlist
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-yellow-400 hover:text-yellow-300 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-red-600 hover:bg-red-700 text-white block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
