import { useState, useMemo } from 'react';
import { ArrowLeft, Star, MapPin, Tv, Wifi, Coffee, Sparkles, AlertCircle, Shield, MoveRight } from 'lucide-react';
import { Hotel, Room } from '../types';
import { ROOMS } from '../data/hotels';

interface RoomDetailsViewProps {
  hotel: Hotel;
  searchParams?: {
    checkIn: string;
    checkOut: string;
    guests: number;
  } | null;
  onBack: () => void;
  onSelectRoom: (hotel: Hotel, room: Room) => void;
}

export default function RoomDetailsView({ hotel, searchParams, onBack, onSelectRoom }: RoomDetailsViewProps) {
  const [activeImage, setActiveImage] = useState(hotel.images[0] || hotel.image);

  // Filter available rooms matching this hotel
  const availableRooms = useMemo(() => {
    return ROOMS.filter(r => r.hotelId === hotel.id);
  }, [hotel.id]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 text-left fade-in-up">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 transition-colors mb-8 cursor-pointer group"
        id="room-details-back"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Return to properties
      </button>

      {/* Main Info Header Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Gallery Image Panel */}
        <div className="space-y-4">
          <div className="aspect-16/10 rounded-2xl overflow-hidden bg-neutral-100 border border-gray-100 shadow-xs relative">
            <img
              src={activeImage}
              alt={hotel.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Thumbnails */}
          <div className="grid grid-cols-3 gap-4">
            {hotel.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`aspect-3/2 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                  activeImage === img ? 'border-amber-600 scale-102 shadow-xs' : 'border-transparent opacity-80 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Text descriptions */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="bg-amber-50 text-amber-800 border border-amber-200/50 rounded-md py-0.5 px-2.5 text-xxs font-bold uppercase tracking-wider">
                Aura Collection
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-neutral-900">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{hotel.rating.toFixed(1)}</span>
                <span className="text-neutral-400 font-normal">({hotel.reviewsCount} reviews)</span>
              </div>
            </div>

            <h1 className="font-display font-light text-2xl sm:text-4xl tracking-tight text-neutral-900 mb-2 leading-tight">
              {hotel.name}
            </h1>

            <p className="text-zinc-500 text-xs flex items-center gap-1 mb-6 font-mono font-medium">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              {hotel.location}
            </p>

            <div className="w-12 h-1 bg-amber-600 rounded-full mb-6" />

            <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed mb-8 font-light">
              {hotel.description}
            </p>

            {/* Hotel Level Amenities */}
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-3.5">
              Property Sanctuaries & Conveniences
            </h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-6">
              {hotel.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-neutral-700">
                  <div className="bg-emerald-50 text-emerald-800 p-1 rounded-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Secure Trust Stamp */}
          <div className="mt-8 p-4 bg-neutral-50 rounded-xl border border-neutral-100 flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-neutral-900">Booking Protection Premium</h4>
              <p className="text-neutral-500 text-xxs mt-0.5 leading-normal">
                Direct booking grants access to 100% refund up to 48 hours prior to check-in, priority early arrival request status, and dedicated 24/7 concierge support.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lists of suites section */}
      <section className="pt-8 border-t border-gray-100">
        <div className="mb-8">
          <h2 className="font-display font-light text-xl sm:text-3xl text-neutral-900">
            Available Suites & Private <span className="font-serif italic font-normal text-neutral-600">Quarters</span>
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm mt-1.5 leading-relaxed font-light">
            All quarters include private climate setups, gourmet coffee systems, luxury robes, twice-daily housekeeping, and natural bath therapeutics.
          </p>
        </div>

        {/* Suite list */}
        <div className="space-y-8">
          {availableRooms.map((room) => {
            const isUrgent = room.availableCount < 3;
            return (
              <div
                key={room.id}
                className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row gap-6 hover:shadow-lg transition-all duration-300"
                id={`room-card-${room.id}`}
              >
                {/* Image */}
                <div className="w-full md:w-72 h-48 md:h-52 rounded-xl overflow-hidden shrink-0 bg-neutral-100 relative">
                  <img src={room.image} alt={room.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  {isUrgent && (
                    <div className="absolute top-3 left-3 bg-rose-50 border border-rose-200 text-rose-700 py-1 px-2.5 rounded-lg text-xxs font-bold uppercase tracking-wider flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      Only {room.availableCount} Left!
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between text-left">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-display font-semibold text-neutral-950 text-md sm:text-lg leading-snug">
                          {room.name}
                        </h3>
                        <p className="text-stone-400 text-xxs font-mono mt-0.5">
                          {room.size} &bull; {room.bedType} &bull; Up to {room.capacity} {room.capacity === 1 ? 'person' : 'guests'}
                        </p>
                      </div>
                    </div>

                    <p className="text-neutral-500 text-xs leading-relaxed mt-3.5 font-light">
                      {room.description}
                    </p>

                    {/* Room Level Amenities list icons */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {room.amenities.map((item, id) => (
                        <span key={id} className="bg-stone-50 text-stone-600 border border-stone-100/70 py-1 px-2 rounded-md text-xxs font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Booking Section */}
                  <div className="pt-6 mt-6 border-t border-gray-50 flex items-center justify-between">
                    <div>
                      <span className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider block">Nightly rate</span>
                      <span className="text-xl font-display font-bold text-neutral-900">
                        ${room.pricePerNight}
                        <span className="text-xs text-neutral-400 font-light font-sans"> / night</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => onSelectRoom(hotel, room)}
                        className="bg-neutral-900 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold px-6 py-3 transition-colors cursor-pointer flex items-center gap-2 uppercase tracking-wider shadow-sm"
                        id={`book-room-btn-${room.id}`}
                      >
                        Reserve Suite
                        <MoveRight className="w-4 h-4 text-amber-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
