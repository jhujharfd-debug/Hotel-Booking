import { useState, useEffect, useRef } from 'react';
import { Booking, Hotel, Room, SearchQuery } from './types';
import { HOTELS } from './data/hotels';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import HotelListView from './components/HotelListView';
import RoomDetailsView from './components/RoomDetailsView';
import BookingView from './components/BookingView';
import ConfirmationView from './components/ConfirmationView';
import { MessageSquare, Sparkles, Send, X, Bot, Hotel as HotelIcon, Compass, Coffee, ShieldAlert, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export default function App() {
  // Navigation / Views Routing State
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [searchQuery, setSearchQuery] = useState<SearchQuery | null>(null);

  // Dark and Light Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem('aura_theme');
      return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    } catch {
      return false;
    }
  });

  // Floating Chat Assistant State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Good day! I am your Aura Virtual Butler & Travel Assistant. I am trained on our bespoke portfolio of beachfront sanctuaries in Bali, alpine retreats in Zermatt, Manhattan skyline suites, traditional Tokyo Ryokans, and Parisian boutiques. How may I customize your stay today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isChatTyping, setIsChatTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Loaded from LocalStorage on mount
  const [allBookings, setAllBookings] = useState<Booking[]>([]);

  // Apply visual theme dark classes on mount and updates
  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('aura_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('aura_theme', 'light');
      }
    } catch (err) {
      console.error('Error applying theme:', err);
    }
  }, [isDarkMode]);

  // Boot up: Load pre-stored reservations if there are any
  useEffect(() => {
    try {
      const stored = localStorage.getItem('aura_bookings');
      if (stored) {
        setAllBookings(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Error reviving local stored bookings:', err);
    }
  }, []);

  // Sync to database simulated client local storage
  const saveBookingsList = (updated: Booking[]) => {
    setAllBookings(updated);
    try {
      localStorage.setItem('aura_bookings', JSON.stringify(updated));
    } catch (err) {
      console.error('Error saving bookings to storage:', err);
    }
  };

  // Scroll chat to bottom
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isChatTyping, isChatOpen]);

  // Nav actions
  const handleSearch = (destination: string, checkIn: string, checkOut: string, guests: number) => {
    setSearchQuery({ destination, checkIn, checkOut, guests });
    setCurrentView('hotels');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectHotel = (hotelId: string) => {
    const matched = HOTELS.find((h) => h.id === hotelId);
    if (matched) {
      setSelectedHotel(matched);
      setCurrentView('room-details');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToHotels = () => {
    setCurrentView('hotels');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRoom = (hotel: Hotel, room: Room) => {
    setSelectedHotel(hotel);
    setSelectedRoom(room);
    setCurrentView('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmBooking = (booking: Booking) => {
    const updated = [booking, ...allBookings];
    saveBookingsList(updated);
    setActiveBooking(booking);
    setCurrentView('bookings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelBooking = (bookingId: string) => {
    const updated = allBookings.map((b) => {
      if (b.id === bookingId) {
        return { ...b, status: 'cancelled' as const };
      }
      return b;
    });
    saveBookingsList(updated);
    
    // update current viewing booking status if active too
    if (activeBooking && activeBooking.id === bookingId) {
      setActiveBooking({ ...activeBooking, status: 'cancelled' });
    }
  };

  const handleNavigateView = (viewId: string) => {
    if (viewId === 'home') {
      setSelectedHotel(null);
      setSelectedRoom(null);
      setActiveBooking(null);
    } else if (viewId === 'bookings') {
      setActiveBooking(null); // Just view historical stays / dashboard
    } else if (viewId === 'hotels') {
      setSelectedHotel(null);
      setSelectedRoom(null);
    }
    setCurrentView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Conversational AI messaging submission
  const handleSendChatMessage = async (customText?: string) => {
    const query = (customText || chatInput).trim();
    if (!query) return;

    if (!customText) {
      setChatInput('');
    }

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setIsChatTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: chatHistory.slice(-8), // Send last 8 turns of context
        }),
      });

      if (!response.ok) {
        throw new Error('AI Assist returned error');
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'assistant',
        text: data.text || 'I am sorry, my connection was temporarily interrupted. How else can I elevate your stay?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatHistory((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat AI failure:', err);
      const errorMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'assistant',
        text: 'Apologies, our billing is offline or there is a local communication delay. Please let me know how I can help you select our premier destinations!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatHistory((prev) => [...prev, errorMsg]);
    } finally {
      setIsChatTyping(false);
    }
  };

  // Quick Chat Suggestion Chips
  const CHAT_CHIPS = [
    'Recommend romantic rooms in Bali',
    'Do you have ski cabins in Zermatt?',
    'What features does Grand Chalet Sky Penthouse offer?',
    'Explain Member perks',
  ];

  // Count active reservations
  const activeBookingsCount = allBookings.filter((b) => b.status === 'confirmed').length;

  return (
    <div className={`min-h-screen flex flex-col bg-[#fbfbfb] dark:bg-zinc-950 text-neutral-900 dark:text-zinc-100 transition-colors duration-300`} id="aura-app-root">
      
      {/* Universal navigation header */}
      <Header 
        currentView={currentView} 
        onNavigate={handleNavigateView} 
        bookingCount={activeBookingsCount}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Main active layout */}
      <main className="flex-1 pb-16">
        {currentView === 'home' && (
          <HomeView 
            onSearch={handleSearch} 
            onSelectHotel={handleSelectHotel} 
            onNavigateToHotels={() => handleNavigateView('hotels')}
          />
        )}

        {currentView === 'hotels' && (
          <HotelListView 
            initialSearch={searchQuery} 
            onSelectHotel={handleSelectHotel} 
          />
        )}

        {currentView === 'room-details' && selectedHotel && (
          <RoomDetailsView 
            hotel={selectedHotel} 
            searchParams={searchQuery}
            onBack={handleBackToHotels} 
            onSelectRoom={handleSelectRoom}
          />
        )}

        {currentView === 'booking' && selectedHotel && selectedRoom && (
          <BookingView 
            hotel={selectedHotel} 
            room={selectedRoom} 
            searchParams={searchQuery}
            onBack={() => handleSelectHotel(selectedHotel.id)} 
            onConfirmBooking={handleConfirmBooking}
          />
        )}

        {currentView === 'bookings' && (
          <ConfirmationView 
            currentBooking={activeBooking} 
            allBookings={allBookings} 
            onNavigateHome={() => handleNavigateView('home')} 
            onCancelBooking={handleCancelBooking}
          />
        )}
      </main>

      {/* Persistent Floating AI Travel Assistant */}
      <div className="fixed bottom-6 right-6 z-50 print:hidden font-sans">
        {/* Toggle Floating bubble */}
        <button
          onClick={() => setIsChatOpen((prev) => !prev)}
          className="bg-amber-600 hover:bg-amber-500 dark:bg-amber-600 dark:hover:bg-amber-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer relative group-hover:rotate-12"
          aria-label="Open Butler Assistant"
          id="assistant-chat-bubble"
        >
          {isChatOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6 animate-pulse" />}
          
          {/* Notification Badge indicator */}
          {!isChatOpen && (
            <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-emerald-500 text-[9px] font-bold text-white items-center justify-center">AI</span>
            </span>
          )}
        </button>

        {/* Floating Chat Panel with Glassmorphism */}
        {isChatOpen && (
          <div 
            className="absolute bottom-16 right-0 w-[360px] sm:w-[420px] max-h-[580px] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-lg border border-neutral-100 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300"
            id="assistant-dialog-panel"
          >
            {/* Header branding */}
            <div className="bg-neutral-900 dark:bg-zinc-950 p-4 flex items-center justify-between text-white border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="bg-amber-500 text-neutral-900 p-2 rounded-xl">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-xs tracking-wider text-amber-400">AURA ASSISTANT</h4>
                  <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
                    Verified Luxury Butler &bull; Online
                  </span>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-zinc-400 hover:text-white cursor-pointer p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversational Stream area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[350px] bg-stone-50/50 dark:bg-zinc-900/30">
              {chatHistory.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-neutral-900 text-white rounded-tr-none dark:bg-amber-600'
                      : 'bg-white text-neutral-800 dark:bg-zinc-800 dark:text-zinc-100 border border-neutral-50 dark:border-zinc-700/50 rounded-tl-none font-light'
                  }`}>
                    {msg.sender === 'assistant' && (
                      <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold tracking-wider uppercase text-[9px] mb-1 font-mono">
                        <Bot className="w-3 h-3" />
                        Concierge Butler
                      </div>
                    )}
                    <span className="whitespace-pre-line">{msg.text}</span>
                    <span className="block text-[9px] text-right text-zinc-400 mt-1.5 font-light">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isChatTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[70%] bg-white dark:bg-zinc-800 rounded-2xl rounded-tl-none p-3.5 border border-neutral-50 dark:border-zinc-700/50">
                    <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                      <span className="animate-bounce">●</span>
                      <span className="animate-bounce delay-100">●</span>
                      <span className="animate-bounce delay-200">●</span>
                      <span className="ml-1 italic text-xxs">Butler is planning stay...</span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="p-3 bg-white dark:bg-zinc-950 border-t border-neutral-100 dark:border-zinc-800">
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block mb-2 px-1 text-left">
                Suggested butler requests
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto">
                {CHAT_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleSendChatMessage(chip)}
                    disabled={isChatTyping}
                    className="text-left py-1.5 px-3 bg-neutral-50 hover:bg-neutral-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 border border-neutral-150 dark:border-zinc-800 rounded-xl text-[10px] font-medium text-neutral-700 dark:text-zinc-300 cursor-pointer select-none transition-colors duration-200"
                  >
                    🚀 {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive input tray */}
            <div className="p-3 bg-neutral-50 dark:bg-zinc-900/50 border-t border-neutral-100 dark:border-zinc-800 flex gap-2">
              <input
                type="text"
                placeholder="Ask your Aura Luxury butler anything..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                disabled={isChatTyping}
                className="flex-1 bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs text-neutral-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:focus:border-amber-500 transition-all font-light"
              />
              <button
                onClick={() => handleSendChatMessage()}
                disabled={isChatTyping || !chatInput.trim()}
                className="bg-neutral-900 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 disabled:bg-neutral-300 text-white w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Universal branding footer */}
      <Footer />
    </div>
  );
}
