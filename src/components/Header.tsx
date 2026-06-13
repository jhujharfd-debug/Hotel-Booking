import { Menu, X, Hotel, CalendarRange, Sparkles, BookCheck, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  bookingCount: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Header({ currentView, onNavigate, bookingCount, isDarkMode, onToggleDarkMode }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'hotels', label: 'Discover Hotels' },
    { id: 'bookings', label: 'Member Dashboard' },
  ];

  const handleNav = (viewId: string) => {
    onNavigate(viewId);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <div 
            onClick={() => handleNav('home')} 
            className="flex items-center gap-2.5 cursor-pointer group"
            id="header-logo"
          >
            <div className="bg-neutral-900 dark:bg-amber-600 text-white p-2.5 rounded-xl transition-all duration-300 group-hover:bg-amber-600 dark:group-hover:bg-amber-500">
              <Hotel className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-semibold text-lg tracking-wider text-neutral-900 dark:text-neutral-100">
                AURA
              </span>
              <span className="font-display text-xs tracking-[0.2em] text-amber-600 dark:text-amber-500 block -mt-1 font-medium">
                HOTELS & RESORTS
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNav(item.id)}
                className={`font-sans text-sm font-medium transition-colors relative py-1 cursor-pointer ${
                  currentView === item.id || (item.id === 'hotels' && currentView === 'room-details')
                    ? 'text-neutral-900 dark:text-amber-500 border-b-2 border-amber-600'
                    : 'text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-amber-500'
                }`}
              >
                {item.label}
                {item.id === 'bookings' && bookingCount > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xxs font-semibold leading-none text-white bg-amber-600 rounded-full animate-pulse">
                    {bookingCount}
                  </span>
                )}
              </button>
            ))}

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2.5 rounded-xl text-neutral-500 hover:text-neutral-900 dark:text-zinc-400 dark:hover:text-amber-500 hover:bg-neutral-100 dark:hover:bg-zinc-850 cursor-pointer transition-colors duration-200"
              aria-label="Toggle theme"
              id="theme-toggle"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => handleNav('hotels')}
              className="bg-neutral-900 hover:bg-neutral-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-xs"
              id="header-cta"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Book Sanctuary
            </button>
          </nav>

          {/* Mobile menu button & mode toggle */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={onToggleDarkMode}
              className="p-2 text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-amber-500 cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {bookingCount > 0 && (
              <button 
                onClick={() => handleNav('bookings')}
                className="relative p-2 text-neutral-600 dark:text-zinc-100 hover:text-neutral-900"
              >
                <BookCheck className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                <span className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-xxs font-bold text-white bg-amber-600 rounded-full">
                  {bookingCount}
                </span>
              </button>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-neutral-600 dark:text-zinc-100 hover:text-neutral-900 p-2 rounded-lg cursor-pointer"
              aria-label="Toggle menu"
              id="mobile-menu-toggle"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-800 py-4 px-4 space-y-3 absolute top-16 left-0 w-full shadow-lg">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer ${
                currentView === item.id || (item.id === 'hotels' && currentView === 'room-details')
                  ? 'bg-neutral-50 dark:bg-zinc-900 text-neutral-900 dark:text-amber-500 font-semibold'
                  : 'text-neutral-600 dark:text-zinc-400 hover:bg-neutral-50 dark:hover:bg-zinc-900 hover:text-neutral-900 dark:hover:text-zinc-100'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{item.label}</span>
                {item.id === 'bookings' && bookingCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xxs font-semibold text-white bg-amber-600 rounded-full">
                    {bookingCount}
                  </span>
                )}
              </div>
            </button>
          ))}
          <div className="pt-2 px-4 col-span-2">
            <button
              onClick={() => handleNav('hotels')}
              className="w-full bg-neutral-950 dark:bg-amber-600 text-white text-center py-3 rounded-lg text-xs font-semibold tracking-wide block cursor-pointer"
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
