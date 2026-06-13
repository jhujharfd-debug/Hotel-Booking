import { useState, FormEvent } from 'react';
import { Search, MapPin, Calendar, Users, Star, ArrowRight, ShieldCheck, Compass, Gift, Milestone, Sparkles, Bot, ThumbsUp } from 'lucide-react';
import { Hotel } from '../types';
import { HOTELS } from '../data/hotels';

interface HomeViewProps {
  onSearch: (destination: string, checkIn: string, checkOut: string, guests: number) => void;
  onSelectHotel: (hotelId: string) => void;
  onNavigateToHotels: () => void;
}

export default function HomeView({ onSearch, onSelectHotel, onNavigateToHotels }: HomeViewProps) {
  const getFutureDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  };

  const [destination, setDestination] = useState('Bali');
  const [checkIn, setCheckIn] = useState(getFutureDate(1));
  const [checkOut, setCheckOut] = useState(getFutureDate(4));
  const [guests, setGuests] = useState(2);
  const [errorMsg, setErrorMsg] = useState('');

  // AI Recommendation Engine states
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any | null>(null);
  const [aiError, setAiError] = useState('');

  const featuredHotels = HOTELS.filter(h => h.featured);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      setErrorMsg('Please select or write a destination');
      return;
    }
    setErrorMsg('');
    onSearch(destination, checkIn, checkOut, guests);
  };

  const handleQuickDestination = (city: string) => {
    setDestination(city);
    onSearch(city, checkIn, checkOut, guests);
  };

  // Triggers the genuine server-side AI Recommendation endpoint
  const handleAiRecommend = async (e: FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) {
      setAiError('Please type what you are looking for (e.g., romantic alpine getaway)');
      return;
    }
    setAiError('');
    setIsAiLoading(true);
    setAiResult(null);

    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: aiPrompt,
          preferences: {
            preferredGuests: guests,
          },
        }),
      });

      if (!res.ok) {
        throw new Error('AI recommendation failed');
      }

      const recommendation = await res.json();
      setAiResult(recommendation);
    } catch (err) {
      console.error('AI Recommendation Error:', err);
      setAiError('Our travel algorithm is temporarily offline. How about checking out The Grand Luminary in Bali?');
    } finally {
      setIsAiLoading(false);
    }
  };

  const reasons = [
    {
      icon: Compass,
      title: 'Curated Destinations',
      desc: 'Each hotel in our portfolio is selected and inspected against 200 luxury guidelines.'
    },
    {
      icon: ShieldCheck,
      title: 'Premium Protections',
      desc: 'Change your booking, extend, or request refund support instantly.'
    },
    {
      icon: Gift,
      title: 'Aura Member Privileges',
      desc: 'Free high-speed premium Wi-Fi, organic breakfast pastries, and champagne check-ins.'
    },
    {
      icon: Milestone,
      title: 'Authentic Experiences',
      desc: 'Connect with local expert guides and secure private viewings of national monuments.'
    }
  ];

  return (
    <div className="fade-in-up bg-stone-50/50 dark:bg-zinc-950 transition-colors duration-300">
      
      {/* Hero Banner Section */}
      <section className="relative h-[650px] flex items-center justify-center bg-neutral-950 text-white overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=80" 
            alt="Luxury Resort Horizon Pool" 
            className="w-full h-full object-cover opacity-50 dark:opacity-30 filter brightness-95 scale-102"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950/95 via-neutral-950/40 to-neutral-900/60 dark:from-zinc-950" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
          <span className="font-sans text-xs tracking-[0.4em] text-amber-500 font-bold uppercase mb-4 block">
            The Art of Exquisite Stays
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-light tracking-tight text-white mb-6 leading-tight max-w-4xl mx-auto">
            Find Your Next <span className="italic font-normal font-serif text-amber-300">Boutique Sanctuary</span>
          </h1>
          <p className="font-sans text-neutral-300 dark:text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Skip the ordinary. Stay in handpicked contemporary estates, luxury cabins, traditional ryokans, or oceanside villas verified for ultimate comfort.
          </p>

          {/* Booking Panel with Glassmorphism */}
          <div className="bg-white/95 dark:bg-zinc-900/80 backdrop-blur-xl text-neutral-900 dark:text-white rounded-3xl p-5 sm:p-7 shadow-2xl max-w-4xl mx-auto border border-white/20 dark:border-zinc-800">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* Destination */}
              <div className="md:col-span-4 text-left">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-400 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-600 dark:text-amber-500" />
                  Where to go?
                </label>
                <div className="relative">
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-3 px-3.5 text-xs font-medium text-neutral-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors cursor-pointer"
                    id="search-destination"
                  >
                    <option value="">Choose Destination...</option>
                    <option value="Bali">Nusa Dua, Bali</option>
                    <option value="Zermatt">Zermatt, Swiss Alps</option>
                    <option value="New York">New York City, USA</option>
                    <option value="Tokyo">Tokyo, Japan</option>
                    <option value="Paris">Paris, France</option>
                  </select>
                </div>
              </div>

              {/* Check In */}
              <div className="md:col-span-3 text-left">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-400 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-600 dark:text-amber-500" />
                  Check In
                </label>
                <input
                  type="date"
                  value={checkIn}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2.5 px-3.5 text-xs font-medium text-neutral-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors"
                  id="search-check-in"
                />
              </div>

              {/* Check Out */}
              <div className="md:col-span-3 text-left">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-400 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-600 dark:text-amber-500" />
                  Check Out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2.5 px-3.5 text-xs font-medium text-neutral-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors"
                  id="search-check-out"
                />
              </div>

              {/* Guests */}
              <div className="md:col-span-2 text-left">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-400 mb-1.5 flex items-center gap-1">
                  <Users className="w-3 h-3 text-amber-600 dark:text-amber-500" />
                  Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-3 px-3 text-xs font-medium text-neutral-800 dark:text-zinc-100 focus:outline-none cursor-pointer focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors"
                  id="search-guests"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="6">6 Guests</option>
                </select>
              </div>

              {/* Search button */}
              <div className="md:col-span-12 mt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {errorMsg && (
                  <p className="text-rose-600 text-xs font-medium text-left">{errorMsg}</p>
                )}
                {!errorMsg && (
                  <span className="text-neutral-400 dark:text-zinc-500 text-xs hidden sm:inline-flex items-center gap-1.5 font-light">
                    🔒 Direct direct bookings are protected by our Best Rate Guarantee
                  </span>
                )}
                <button
                  type="submit"
                  className="bg-neutral-900 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 text-white py-3.5 px-8 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xl ml-auto w-full sm:w-auto"
                  id="search-submit"
                >
                  <Search className="w-4 h-4 text-amber-400 dark:text-white" />
                  Search Hotels
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Popular Anchors Destinations */}
      <section className="py-12 bg-white dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] font-bold tracking-[0.2em] text-neutral-400 dark:text-zinc-500 uppercase mb-5">
            Quick escape inspirations
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {[
              { label: 'Tropical Bali', city: 'Bali', bg: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40' },
              { label: 'Swiss Alps Zermatt', city: 'Zermatt', bg: 'bg-sky-50 text-sky-800 dark:bg-sky-950/30 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/40' },
              { label: 'Sleek New York', city: 'New York', bg: 'bg-neutral-100 text-neutral-800 dark:bg-zinc-900 dark:text-zinc-300 hover:bg-neutral-200 dark:hover:bg-zinc-800' },
              { label: 'Spiritual Tokyo', city: 'Tokyo', bg: 'bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40' },
              { label: 'Charming Paris', city: 'Paris', bg: 'bg-purple-50 text-purple-800 dark:bg-purple-950/30 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40' }
            ].map((tag) => (
              <button
                key={tag.city}
                onClick={() => handleQuickDestination(tag.city)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${tag.bg} hover:scale-103`}
              >
                #{tag.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced AI Sanctuary Finder (Exquisite Interactive Recommendation Widget) */}
      <section className="py-16 bg-[#fafafa] dark:bg-zinc-900/50 border-b border-gray-100 dark:border-zinc-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white/80 dark:bg-zinc-900 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/40 dark:border-zinc-800 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Bot className="w-48 h-48 text-amber-500" />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-amber-500/10 dark:bg-amber-600/10 text-amber-700 dark:text-amber-400 py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">
                  <Bot className="w-3.5 h-3.5" />
                  Generative AI Travel Consultant
                </div>
                <h3 className="font-display font-light text-2xl sm:text-3xl text-neutral-900 dark:text-white leading-tight">
                  Discover Your Absolute <span className="font-serif italic font-normal text-amber-600 dark:text-amber-400">Match</span>
                </h3>
                <p className="text-xs text-neutral-400 dark:text-zinc-500 mt-2 font-light">
                  Describe what your heart desires (activities, mood, food) and our neural assistant will scour our resort inventory to calculate a private itinerary.
                </p>
              </div>
            </div>

            <form onSubmit={handleAiRecommend} className="space-y-4 relative z-10">
              <div>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. I want to plan a romantic celebration next to a snowy ski peak, with log fires, private thermal spas, and traditional pine cabin elements."
                  rows={2}
                  className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl py-3 px-4 text-xs text-neutral-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-light"
                />
              </div>

              {aiError && (
                <p className="text-rose-600 text-[11px] font-semibold">{aiError}</p>
              )}

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isAiLoading}
                  className="bg-neutral-950 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs font-semibold tracking-wider uppercase py-3 px-6 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                >
                  {isAiLoading ? (
                    <>
                      <span className="animate-spin inline-block w-4 h-4 rounded-full border-2 border-white border-t-transparent" />
                      Deconstruct profile...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-400 dark:text-white" />
                      Evaluate My Profile Match
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* AI Result Cards with glass effect */}
            {aiResult && (
              <div className="mt-8 pt-8 border-t border-gray-100 dark:border-zinc-800 animate-in fade-in slide-in-from-bottom-2 duration-300 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-amber-500/5 dark:bg-zinc-950 rounded-2xl p-5 border border-amber-600/15">
                  <div className="md:col-span-8 space-y-4 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="bg-amber-600 text-white rounded-md py-1 px-2 text-[10px] font-bold tracking-widest font-mono">
                        FIT SCORE: {aiResult.fitScore || "98%"}
                      </span>
                      <strong className="text-neutral-800 dark:text-zinc-200 text-sm">Sanctuary Match Found!</strong>
                    </div>

                    <div className="space-y-2">
                      <p className="text-neutral-600 dark:text-zinc-400 font-light italic leading-relaxed">
                        &ldquo;{aiResult.reason}&rdquo;
                      </p>
                      <div className="bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-800 rounded-xl p-3">
                        <strong className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider block mb-1">
                          ✨ Custom Signature Experience
                        </strong>
                        <p className="text-neutral-500 dark:text-zinc-400 text-xxs leading-relaxed font-light">
                          {aiResult.itinerary}
                        </p>
                      </div>
                    </div>

                    {aiResult.travelTip && (
                      <p className="text-[10px] text-zinc-400 font-light leading-relaxed">
                        💡 <strong className="font-semibold text-neutral-800 dark:text-zinc-300">Concierge Advice:</strong> {aiResult.travelTip}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-4 flex flex-col justify-between items-stretch gap-4 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-amber-600/10 md:pl-6 text-center">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-wider text-neutral-400 block font-mono">Recommended Spot</span>
                      <h4 className="font-display font-bold text-neutral-900 dark:text-white text-md">
                        {HOTELS.find(h => h.id === aiResult.hotelId)?.name || 'An Aura Sanctuary'}
                      </h4>
                      <span className="text-xxs text-amber-600 font-medium">Starting from ${HOTELS.find(h => h.id === aiResult.hotelId)?.priceMin || '220'} / Night</span>
                    </div>

                    <button
                      onClick={() => aiResult.hotelId && onSelectHotel(aiResult.hotelId)}
                      className="bg-neutral-950 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-xl py-3 px-4 font-semibold text-xxs uppercase tracking-wider tracking-wide cursor-pointer transition-colors text-center w-full"
                    >
                      View This Sanctuary Room
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Luxury Hotels Section */}
      <section className="py-20 bg-stone-50/20 dark:bg-zinc-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header text */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="max-w-2xl text-left">
              <span className="text-xs uppercase tracking-widest font-semibold text-amber-600 dark:text-amber-500 block mb-2.5">
                Handpicked Wonders
              </span>
              <h2 className="font-display font-light text-2xl sm:text-4xl tracking-tight text-neutral-900 dark:text-white leading-tight">
                Our Signature <span className="italic font-serif font-normal text-neutral-600 dark:text-zinc-400">Sanctuary Portfolio</span>
              </h2>
              <p className="text-neutral-500 dark:text-zinc-500 text-xs sm:text-sm mt-3 leading-relaxed font-light">
                Explore architectural masterpieces designed to immerse you in local custom, spectacular surroundings, and ultimate luxury.
              </p>
            </div>
            <button
              onClick={onNavigateToHotels}
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors group cursor-pointer"
              id="view-all-hotels-link"
            >
              Explore all hotels
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredHotels.map((hotel) => (
              <div 
                key={hotel.id}
                onClick={() => onSelectHotel(hotel.id)}
                className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-gray-150/40 dark:border-zinc-800 group hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col"
                id={`featured-card-${hotel.id}`}
              >
                {/* Photo space */}
                <div className="relative aspect-3/2 overflow-hidden bg-neutral-100 dark:bg-zinc-950 shrink-0">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Offer badge tag */}
                  <div className="absolute top-4 left-4 bg-amber-600/90 backdrop-blur-md py-1 px-3 rounded-full flex items-center gap-1 shadow-xs">
                    <span className="text-[9px] font-bold tracking-wider uppercase text-white">Enterprise Special &bull; Saves 15%</span>
                  </div>
                  {/* Rating Tag */}
                  <div className="absolute top-4 right-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md py-1 px-2.5 rounded-lg flex items-center gap-1 shadow-xs">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span className="text-xs font-semibold text-neutral-900 dark:text-white">{hotel.rating.toFixed(1)}</span>
                  </div>
                  {/* City Label */}
                  <div className="absolute bottom-4 left-4 bg-neutral-900/80 dark:bg-zinc-900/95 backdrop-blur-md px-3 py-1 rounded-md text-white text-xxs font-semibold tracking-wider uppercase">
                    {hotel.city}
                  </div>
                </div>

                {/* Content body */}
                <div className="p-6 text-left flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-medium text-lg leading-tight text-neutral-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {hotel.name}
                    </h3>
                    <p className="text-zinc-400 dark:text-zinc-500 text-xxs flex items-center gap-1 mt-1 font-medium">
                      <MapPin className="w-3 h-3 text-amber-600 dark:text-amber-500 shrink-0" />
                      {hotel.location}
                    </p>
                    <p className="text-neutral-500 dark:text-zinc-400 text-xs mt-3 line-clamp-2 leading-relaxed font-light">
                      {hotel.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-gray-50 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="text-zinc-400 dark:text-zinc-500 text-xxs block font-semibold uppercase tracking-wider">Starting rate</span>
                      <span className="text-md font-display font-semibold text-neutral-900 dark:text-zinc-100">
                        ${hotel.priceMin}
                        <span className="text-xs text-neutral-400 dark:text-zinc-500 font-light font-sans"> / night</span>
                      </span>
                    </div>
                    <span className="text-xxs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest group-hover:underline flex items-center gap-1 shrink-0">
                      View Rooms
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refined Hospitality Promo Reasons */}
      <section className="py-24 bg-white dark:bg-zinc-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest font-semibold text-amber-600 dark:text-amber-500 block mb-2.5">
              Refined Hospitality
            </span>
            <h2 className="font-display font-light text-2xl sm:text-4xl tracking-tight text-neutral-900 dark:text-white">
              Why Discerning Travelers Choose <span className="font-serif italic font-normal text-neutral-700 dark:text-zinc-400">Aura</span>
            </h2>
            <div className="w-12 h-1 bg-amber-600 dark:bg-amber-500 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {reasons.map((r, i) => (
              <div key={i} className="text-left group">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-zinc-900 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-6 group-hover:bg-amber-600 dark:group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                  <r.icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-medium text-neutral-900 dark:text-white text-sm tracking-tight mb-2">
                  {r.title}
                </h3>
                <p className="text-neutral-500 dark:text-zinc-400 text-xs leading-relaxed font-light">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inspirational Quotes / Hero Banner Break */}
      <section className="py-20 bg-neutral-950 text-white relative">
        <div className="absolute inset-0 z-0 opacity-15">
          <img 
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80" 
            alt="Interior" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <p className="font-serif italic text-lg sm:text-2xl text-amber-200 leading-relaxed font-light mb-6">
            &ldquo;Travel brings power and love back into your life. With Aura, we didn&apos;t just book a bedroom. We checked into our own private oasis, staffed with the kindest souls who designed every sunset around our preferences.&rdquo;
          </p>
          <p className="font-sans text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-zinc-500">
            — HECTOR & CLARA, RESIDENT MEMBERS SINCE 2024
          </p>
        </div>
      </section>
    </div>
  );
}
