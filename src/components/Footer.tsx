import { Hotel, Mail, Phone, MapPin, Shield, Star } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 pt-16 pb-8 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="bg-amber-600 text-white p-2 rounded-lg">
                <Hotel className="w-5 h-5" />
              </div>
              <div>
                <span className="font-display font-semibold text-white text-md tracking-wider">
                  AURA
                </span>
                <span className="font-display text-xxs tracking-widest text-amber-500 block -mt-1 font-semibold">
                  HOTELS & RESORTS
                </span>
              </div>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed mb-6">
              Curating high-class stays, boutique retreats, and authentic architectural marvels across the globe. Live with tranquility, luxury, and peace.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-amber-500 font-medium">
              <Star className="w-4 h-4 fill-amber-500" />
              <span>Recommended Hotel Partner 2026</span>
            </div>
          </div>

          {/* Column 2: Destinatinos */}
          <div>
            <h3 className="font-display font-medium text-white text-xs tracking-wider uppercase mb-5">
              Featured Cities
            </h3>
            <ul className="space-y-3 text-xs">
              <li><button className="hover:text-white transition-colors cursor-pointer text-left">Nusa Dua, Bali</button></li>
              <li><button className="hover:text-white transition-colors cursor-pointer text-left">Zermatt, Swiss Alps</button></li>
              <li><button className="hover:text-white transition-colors cursor-pointer text-left">Fifth Avenue, New York</button></li>
              <li><button className="hover:text-white transition-colors cursor-pointer text-left">Chiyoda, Tokyo</button></li>
              <li><button className="hover:text-white transition-colors cursor-pointer text-left">Opera Quarter, Paris</button></li>
            </ul>
          </div>

          {/* Column 3: Essentials */}
          <div>
            <h3 className="font-display font-medium text-white text-xs tracking-wider uppercase mb-5">
              Aura Hospitality
            </h3>
            <ul className="space-y-3 text-xs">
              <li><button className="hover:text-white transition-colors cursor-pointer text-left">Health & Wellness Spas</button></li>
              <li><button className="hover:text-white transition-colors cursor-pointer text-left">Michelin Dining Rooms</button></li>
              <li><button className="hover:text-white transition-colors cursor-pointer text-left">Private Butler Service</button></li>
              <li><button className="hover:text-white transition-colors cursor-pointer text-left">Flexible Booking Policy</button></li>
              <li><button className="hover:text-white transition-colors cursor-pointer text-left">Privacy Guarantee & Terms</button></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-display font-medium text-white text-xs tracking-wider uppercase mb-5">
              Reservations Desk
            </h3>
            <ul className="space-y-3.5 text-xs">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>120 Suite Avenue, Central District, New York, US</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>+1 (800) 450-AURA (2872)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>concierge@aurahotels.reserve</span>
              </li>
              <li className="flex items-center gap-2 pt-2 text-stone-300">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span className="text-xxs uppercase tracking-wider font-semibold">SSL Secured Checkout Encryption</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xxs">
          <p>© 2026 Aura Hotels & Resorts. Designed for exquisite modern elegance. All rights reserved.</p>
          <div className="flex gap-6">
            <button className="hover:text-white transition-colors cursor-pointer">Privacy Policy</button>
            <button className="hover:text-white transition-colors cursor-pointer">Terms of Service</button>
            <button className="hover:text-white transition-colors cursor-pointer">Sitemap</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
