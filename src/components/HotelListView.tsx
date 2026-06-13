import { useState, useMemo } from 'react';
import { Search, MapPin, Star, SlidersHorizontal, ArrowUpDown, RefreshCw, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import { Hotel } from '../types';
import { HOTELS } from '../data/hotels';

interface HotelListViewProps {
  initialSearch?: {
    destination: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  } | null;
  onSelectHotel: (hotelId: string) => void;
}

export default function HotelListView({ initialSearch, onSelectHotel }: HotelListViewProps) {
  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState(initialSearch?.destination || 'All');
  const [priceRange, setPriceRange] = useState<number>(1000);
  const [starRating, setStarRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('featured');

  // Sync state if initial search is updated
  useMemo(() => {
    if (initialSearch?.destination) {
      setSelectedCity(initialSearch.destination);
    }
  }, [initialSearch]);

  // Unique list of cities
  const cities = ['All', 'Bali', 'Zermatt', 'New York', 'Tokyo', 'Paris'];

  // Filter/Sort logic
  const filteredHotels = useMemo(() => {
    return HOTELS.filter((hotel) => {
      // 1. Text Search match
      const matchesText = 
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. City match
      const matchesCity = selectedCity === 'All' || hotel.city === selectedCity;

      // 3. Price match
      const matchesPrice = hotel.priceMin <= priceRange;

      // 4. Rating match
      const matchesRating = hotel.rating >= starRating;

      return matchesText && matchesCity && matchesPrice && matchesRating;
    }).sort((a, b) => {
      if (sortBy === 'price-low') {
        return a.priceMin - b.priceMin;
      }
      if (sortBy === 'price-high') {
        return b.priceMin - a.priceMin;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      // Featured/default
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [searchTerm, selectedCity, priceRange, starRating, sortBy]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCity('All');
    setPriceRange(1000);
    setStarRating(0);
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 fade-in-up">
      {/* Search Header Banner */}
      <div className="mb-10 text-left">
        <span className="text-xs uppercase tracking-widest font-semibold text-amber-600 block mb-2">
          Sanctuary Finder
        </span>
        <h1 className="font-display font-light text-2xl sm:text-4xl tracking-tight text-neutral-900 leading-tight">
          Find Your Perfect <span className="font-serif italic font-normal text-neutral-600">Peaceful Stay</span>
        </h1>
        {initialSearch?.destination && (
          <p className="text-amber-700 bg-amber-50 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs mt-3.5 font-medium border border-amber-100">
            <span className="animate-pulse inline-block w-2 h-2 rounded-full bg-amber-500 mr-1" />
            Showing hotels in <strong className="font-semibold">{initialSearch.destination}</strong> for {initialSearch.guests} {initialSearch.guests === 1 ? 'guest' : 'guests'}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Panel (Left column) */}
        <aside className="lg:col-span-1 bg-white border border-gray-100 rounded-2xl p-6 h-fit text-left">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
            <h2 className="font-display font-semibold text-sm text-neutral-900 tracking-wide flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-600" />
              Filter Stays
            </h2>
            <button
              onClick={handleClearFilters}
              className="text-neutral-400 hover:text-neutral-900 text-xxs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Reset All
            </button>
          </div>

          <div className="space-y-6">
            {/* Search Term */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-neutral-400 tracking-wider mb-2">
                Search Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Grand Luminary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-neutral-50 hover:bg-neutral-100/50 border border-neutral-200 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder:text-zinc-400"
                />
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute right-3.5 top-3" />
              </div>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-neutral-400 tracking-wider mb-2">
                Destinations
              </label>
              <div className="space-y-1.5">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors flex items-center justify-between ${
                      selectedCity === city
                        ? 'bg-neutral-900 text-white font-semibold'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    }`}
                  >
                    <span>{city === 'All' ? 'Everywhere' : city}</span>
                    {selectedCity === city && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">
                  Max Budget
                </label>
                <span className="text-xs font-semibold text-neutral-900">${priceRange}</span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-1 bg-gray-100 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-xxs text-neutral-400 mt-1 font-mono">
                <span>$100</span>
                <span>$500</span>
                <span>$1000</span>
              </div>
            </div>

            {/* Star range */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-neutral-400 tracking-wider mb-2">
                Rating Threshold
              </label>
              <select
                value={starRating}
                onChange={(e) => setStarRating(Number(e.target.value))}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-3 text-xs font-medium text-neutral-800 focus:outline-none cursor-pointer"
              >
                <option value="0">Any Rating</option>
                <option value="4.5">★ 4.5 & Above</option>
                <option value="4.8">★ 4.8 & Above</option>
                <option value="4.9">★ 4.9 Premium</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Hotels list / Grid (Right column) */}
        <section className="lg:col-span-3 text-left">
          {/* Sorting controls bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 mb-6 border-b border-neutral-100">
            <p className="text-xs text-neutral-500 font-light font-mono">
              Showing <strong className="text-neutral-900 font-semibold">{filteredHotels.length}</strong> matching boutique properties
            </p>

            <div className="flex items-center gap-2.5">
              <span className="text-xxs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1 shrink-0">
                <ArrowUpDown className="w-3.5 h-3.5" />
                Sort By
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-neutral-200 rounded-xl py-1.5 px-3 text-xs font-medium text-neutral-800 focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Reviews: Highest Rating</option>
              </select>
            </div>
          </div>

          {/* Empty State */}
          {filteredHotels.length === 0 && (
            <div className="bg-white rounded-2xl py-16 px-6 text-center border border-gray-100 shadow-xs max-w-xl mx-auto mt-8">
              <div className="bg-red-50 text-red-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-display font-medium text-lg text-neutral-900">No properties fit these filters</h3>
              <p className="text-neutral-500 text-xs mt-2 max-w-md mx-auto leading-relaxed font-light">
                We couldn&apos;t find any properties matching your current criteria. Try lifting your rating threshold or adjusting your maximum rate slider.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-6 inline-flex items-center gap-2 bg-neutral-900 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold px-5 py-2.5 transition-colors cursor-pointer"
              >
                Reset Filters & Search Again
              </button>
            </div>
          )}

          {/* Grid list */}
          <div className="space-y-6">
            {filteredHotels.map((hotel) => (
              <div
                key={hotel.id}
                onClick={() => onSelectHotel(hotel.id)}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col md:flex-row group"
              >
                {/* Visual image container */}
                <div className="relative w-full md:w-80 h-56 md:h-64 shrink-0 bg-neutral-100">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                    referrerPolicy="no-referrer"
                  />
                  {hotel.featured && (
                    <div className="absolute top-4 left-4 bg-amber-600 text-white py-1 px-2.5 rounded-lg text-xxs font-bold uppercase tracking-wider">
                      Featured Stay
                    </div>
                  )}
                  {/* Rating indicator */}
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-neutral-900 flex items-center gap-1 shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{hotel.rating.toFixed(1)}</span>
                    <span className="text-neutral-400 font-normal font-sans text-xxs">({hotel.reviewsCount})</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-display font-medium text-lg sm:text-xl text-neutral-900 leading-snug group-hover:text-amber-600 transition-colors">
                        {hotel.name}
                      </h3>
                    </div>
                    <p className="text-stone-400 text-xxs flex items-center gap-1 mt-1 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      {hotel.location}
                    </p>
                    <p className="text-neutral-500 text-xs mt-3.5 line-clamp-3 leading-relaxed font-light">
                      {hotel.description}
                    </p>

                    {/* Amenities tag list (limited to top 4) */}
                    <div className="flex flex-wrap gap-1.5 mt-5">
                      {hotel.amenities.slice(0, 4).map((amenity, i) => (
                        <span
                          key={i}
                          className="bg-neutral-50 border border-neutral-100 text-neutral-600 py-1 px-2.5 rounded-md text-xxs font-medium"
                        >
                          {amenity}
                        </span>
                      ))}
                      {hotel.amenities.length > 4 && (
                        <span className="text-neutral-400 py-1 px-1 text-xxs">
                          +{hotel.amenities.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pricing footer block inside card */}
                  <div className="pt-6 mt-6 border-t border-gray-50 flex items-end justify-between">
                    <div>
                      <span className="text-neutral-400 text-[10px] font-bold uppercase tracking-wider block">Direct Starting Rate</span>
                      <span className="text-xl font-display font-semibold text-neutral-900">
                        ${hotel.priceMin}
                        <span className="text-xs text-neutral-400 font-light font-sans"> / night</span>
                      </span>
                    </div>
                    <button
                      className="bg-neutral-900 group-hover:bg-amber-600 group-hover:text-white transition-colors py-2.5 px-6 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer text-white"
                      id={`view-rooms-btn-${hotel.id}`}
                    >
                      Browse Suite
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
