import { useState, useMemo } from 'react';
import { CheckCircle2, Copy, Calendar, CalendarDays, Users, Mail, Phone, CalendarCheck2, XCircle, ArrowRight, ShieldCheck, Printer, BarChart3, Award, Leaf, Coins, Check, Receipt, Tag, ShieldAlert } from 'lucide-react';
import { Booking } from '../types';

interface ConfirmationViewProps {
  currentBooking: Booking | null;
  allBookings: Booking[];
  onNavigateHome: () => void;
  onCancelBooking: (bookingId: string) => void;
}

export default function ConfirmationView({ currentBooking, allBookings, onNavigateHome, onCancelBooking }: ConfirmationViewProps) {
  const [copiedId, setCopiedId] = useState(false);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);

  // Active print preview invoice state
  const [activeInvoiceBooking, setActiveInvoiceBooking] = useState<Booking | null>(null);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Enterprise Stats Calculations
  const statsSummary = useMemo(() => {
    const activeStays = allBookings.filter(b => b.status === 'confirmed');
    const totalNights = activeStays.reduce((acc, b) => acc + (b.nights || 2), 0);
    const totalSpent = activeStays.reduce((acc, b) => acc + (b.totalPrice || 0), 0);
    const loyaltyPoints = totalSpent * 12; // 12 points per dollar spent
    const carbonOffsetKgs = totalNights * 4.5; // 4.5 kgs offset carbon per night rested

    // Define membership tier
    let tier = 'Silver Select Guest';
    let nextTierNights = 10 - totalNights;
    if (totalNights >= 10) {
      tier = 'Platinum Elite Class';
      nextTierNights = 25 - totalNights;
    }
    if (totalNights >= 25) {
      tier = 'Aura Diamond Sovereign';
      nextTierNights = 0;
    }

    return { totalNights, totalSpent, loyaltyPoints, carbonOffsetKgs, tier, nextTierNights };
  }, [allBookings]);

  // Handle local print command in browser window safeties
  const handlePrintAction = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left fade-in-up dark:bg-zinc-950 transition-colors">
      
      {/* If there's an active booking that was just completed, show Success Banner as popup or upper banner */}
      {currentBooking && (
        <div className="space-y-6 mb-12">
          {/* Success Banner */}
          <div className="bg-emerald-500/10 dark:bg-emerald-600/10 border border-emerald-500/20 dark:border-emerald-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest block font-mono">
                Booking Guaranteed & Secured
              </span>
              <h1 className="font-display font-light text-xl sm:text-3xl text-neutral-900 dark:text-white">
                Your Sanctuary has been <span className="font-serif italic font-normal text-emerald-800 dark:text-emerald-400">Confirmed</span>
              </h1>
            </div>
            <p className="text-neutral-500 dark:text-zinc-400 text-xs max-w-xl mx-auto font-light leading-relaxed">
              We have pre-registered your suite at our reception desk. A comprehensive digital copy of your check-in card and guide has been dispatched to <strong className="text-neutral-800 dark:text-zinc-200 font-semibold">{currentBooking.guestEmail}</strong>.
            </p>

            {/* Reference Copy bar */}
            <div className="inline-flex items-center gap-3 bg-white dark:bg-zinc-900 px-4 py-2 rounded-xl border border-emerald-500/20 shadow-xs max-w-xs mx-auto">
              <div className="text-left">
                <span className="text-[8px] uppercase tracking-wider text-neutral-400 dark:text-zinc-500 block font-mono">Reservation Ref ID</span>
                <span className="font-mono text-xs font-bold text-neutral-800 dark:text-zinc-200">{currentBooking.id}</span>
              </div>
              <button
                onClick={() => handleCopyId(currentBooking.id)}
                className="text-neutral-400 dark:text-zinc-500 hover:text-neutral-900 dark:hover:text-amber-500 p-1.5 hover:bg-neutral-50 dark:hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors shrink-0"
                title="Copy reference key"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              {copiedId && (
                <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-medium">Copied!</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enterprise Professional Member Dashboard & Analytics Grid */}
      <section className="bg-white dark:bg-zinc-900 border border-gray-150/40 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl mb-12 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Award className="w-56 h-56 text-amber-500" />
        </div>

        {/* Dashboard Title row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-100 dark:border-zinc-800 relative z-10">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5" />
              Verified Elite Profile
            </span>
            <h2 className="font-display font-light text-2xl sm:text-3xl text-neutral-900 dark:text-white leading-tight">
              Aura Corporate <span className="font-serif italic font-normal text-stone-600 dark:text-zinc-400">Rest Dashboard</span>
            </h2>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[9px] uppercase tracking-wider text-neutral-400 block font-mono">Membership Tier</span>
            <span className="text-sm font-semibold font-display text-amber-600 dark:text-amber-500 tracking-wide">{statsSummary.tier}</span>
          </div>
        </div>

        {/* Stats bento layout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          
          {/* Nights Rested */}
          <div className="bg-stone-50 dark:bg-zinc-950 p-4 rounded-2xl border border-stone-200/50 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-neutral-400 dark:text-zinc-500 mb-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span className="text-[9px] uppercase tracking-wider font-semibold font-mono">Rest Nights</span>
            </div>
            <strong className="text-2xl font-display font-semibold text-neutral-900 dark:text-white">{statsSummary.totalNights}</strong>
            <span className="text-[9px] text-zinc-400 block mt-1">Stays across active catalog</span>
          </div>

          {/* Loyalty Points */}
          <div className="bg-stone-50 dark:bg-zinc-950 p-4 rounded-2xl border border-stone-200/50 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-neutral-400 dark:text-zinc-500 mb-2">
              <Coins className="w-4 h-4 text-amber-600" />
              <span className="text-[9px] uppercase tracking-wider font-semibold font-mono">Loyalty Points</span>
            </div>
            <strong className="text-2xl font-display font-semibold text-neutral-900 dark:text-white">
              {statsSummary.loyaltyPoints.toLocaleString()}
            </strong>
            <span className="text-[9px] text-zinc-400 block mt-1">Exchangeable for suite upgrades</span>
          </div>

          {/* Carbon Offset */}
          <div className="bg-stone-50 dark:bg-zinc-950 p-4 rounded-2xl border border-stone-200/50 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-neutral-400 dark:text-zinc-500 mb-2">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span className="text-[9px] uppercase tracking-wider font-semibold font-mono">CO₂ Offset</span>
            </div>
            <strong className="text-2xl font-display font-semibold text-neutral-900 dark:text-white">
              {statsSummary.carbonOffsetKgs.toFixed(1)} <span className="text-xs text-neutral-400">KG</span>
            </strong>
            <span className="text-[9px] text-zinc-400 block mt-1">Absorbed via Aura Forestry Trust</span>
          </div>

          {/* Net worth or stats spent */}
          <div className="bg-stone-50 dark:bg-zinc-950 p-4 rounded-2xl border border-stone-200/50 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-neutral-400 dark:text-zinc-500 mb-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span className="text-[9px] uppercase tracking-wider font-semibold font-mono">Elite Benefits</span>
            </div>
            <strong className="text-2xl font-display font-semibold text-neutral-900 dark:text-white">Active</strong>
            <span className="text-[9px] text-zinc-400 block mt-1">Includes late 2 PM lobby checkout</span>
          </div>
        </div>

        {/* Visual Nights representation column (custom bar chart styled with HTML elements) */}
        {allBookings.length > 0 && (
          <div className="bg-stone-50 dark:bg-zinc-950 p-5 rounded-2xl border border-stone-200/50 dark:border-zinc-800 relative z-10 text-xs">
            <h4 className="font-semibold text-neutral-800 dark:text-zinc-200 uppercase tracking-widest text-[9px] mb-4 flex items-center gap-1.5 font-mono">
              <BarChart3 className="w-4 h-4 text-amber-600" />
              Monthly Rest Distribution Metrics
            </h4>
            
            <div className="space-y-3.5">
              {[
                { month: 'Europe Retreats (Zermatt, Paris)', percentage: '70%', kgs: '18.4 Kg CO₂', stays: '7 Nights' },
                { month: 'Tropical Havens (Bali)', percentage: '45%', kgs: '9.2 Kg CO₂', stays: '4 Nights' },
                { month: 'Metropolitan Inbound (Tokyo, NYC)', percentage: '20%', kgs: '4.5 Kg CO₂', stays: '2 Nights' },
              ].map((bar, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] text-neutral-600 dark:text-zinc-400">
                    <span className="font-medium">{bar.month}</span>
                    <span className="font-mono">{bar.stays} rested &bull; {bar.kgs} Offset Contribution</span>
                  </div>
                  {/* Slider bar container */}
                  <div className="w-full bg-stone-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-linear-to-r from-amber-600 to-amber-500 h-2 rounded-full" 
                      style={{ width: bar.percentage }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Main Booking History List Monitor ("My Bookings") */}
      <section className="space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800">
          <div>
            <h2 className="font-display font-light text-xl sm:text-2xl text-neutral-900 dark:text-white">
              Manage Active <span className="font-serif italic font-normal text-stone-600 dark:text-zinc-400">Reservations</span>
            </h2>
            <p className="text-neutral-400 dark:text-zinc-500 text-xs mt-0.5">Chronological summary of active stay orders on this profile.</p>
          </div>
          <button
            onClick={onNavigateHome}
            className="text-xs font-semibold tracking-wider text-amber-600 dark:text-amber-500 hover:text-amber-700 flex items-center gap-1.5 cursor-pointer"
            id="book-another-btn"
          >
            Explore Sanctuary Portfolio
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {allBookings.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl py-12 px-6 text-center shadow-xs">
            <div className="w-12 h-12 rounded-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 flex items-center justify-center mx-auto mb-4 text-stone-400">
              <Calendar className="w-5 h-5 animate-pulse" />
            </div>
            <h3 className="font-display font-semibold text-sm text-neutral-800 dark:text-zinc-200">No active bookings detected</h3>
            <p className="text-neutral-400 dark:text-zinc-500 text-xs mt-1 max-w-sm mx-auto font-light leading-relaxed">
              You do not have any saved room reservations under this local device profile. Tap discover hotels to launch an orbital search!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {allBookings.map((b) => {
              const isCurrent = currentBooking?.id === b.id;
              return (
                <div
                  key={b.id}
                  className={`bg-white dark:bg-zinc-900 border rounded-3xl p-4 sm:p-5 transition-all flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between ${
                    isCurrent ? 'border-amber-600/60 ring-2 ring-amber-500/10' : 'border-gray-100 dark:border-zinc-800 hover:border-gray-200 dark:hover:border-zinc-700'
                  }`}
                  id={`history-${b.id}`}
                >
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-12 rounded-xl bg-neutral-100 overflow-hidden shrink-0 hidden sm:block border border-gray-50 dark:border-transparent">
                      <img src={b.roomImage} alt={b.roomName} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xxs text-neutral-400 dark:text-zinc-500 font-semibold uppercase">{b.id}</span>
                        {b.status === 'cancelled' ? (
                          <span className="bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 py-0.5 px-2 rounded-full text-[9px] font-bold uppercase tracking-wider">
                            Cancelled stay
                          </span>
                        ) : (
                          <span className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 py-0.5 px-2 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5">
                            <CalendarCheck2 className="w-3 h-3" />
                            Confirmed Booking
                          </span>
                        )}
                        {isCurrent && (
                          <span className="bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 py-0.5 px-2 rounded-full text-[9px] font-semibold uppercase">
                            Just Created
                          </span>
                        )}
                      </div>
                      <h4 className="font-display font-medium text-sm text-neutral-900 dark:text-zinc-100 mt-1">
                        {b.hotelName} &bull; <span className="font-normal text-neutral-500 italic text-xs">{b.roomName}</span>
                      </h4>
                      <p className="text-zinc-500 dark:text-zinc-400 text-xxs font-light mt-0.5">
                        📆 {b.checkIn} to {b.checkOut} ({b.nights} {b.nights === 1 ? 'night' : 'nights'}) &bull; {b.guests} Guests Registered
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-50 dark:border-zinc-800">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-zinc-400 block font-light">Est. charges billed</span>
                      <strong className="text-sm font-semibold text-neutral-900 dark:text-zinc-200">${b.totalPrice}</strong>
                    </div>

                    <div className="flex gap-2">
                      {/* View & Print Invoice Portal trigger */}
                      {b.status !== 'cancelled' && (
                        <button
                          onClick={() => setActiveInvoiceBooking(b)}
                          className="bg-stone-50 hover:bg-stone-100 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-stone-600 dark:text-zinc-300 p-2 border border-stone-200/65 dark:border-zinc-700 rounded-xl cursor-pointer transition-colors"
                          title="Generate enterprise invoice"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {b.status !== 'cancelled' && (
                        <button
                          onClick={() => setCancelTargetId(b.id)}
                          className="text-rose-600 hover:text-white px-3 py-1.5 hover:bg-rose-600 border border-rose-200/50 dark:border-rose-900/40 hover:border-transparent rounded-xl text-xxs font-bold uppercase tracking-wider cursor-pointer transition-all shrink-0"
                        >
                          Cancel Stay
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Confirmation modal for Cancellation */}
      {cancelTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/70 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative border border-gray-100 dark:border-zinc-850">
            <button
              onClick={() => setCancelTargetId(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-neutral-900 dark:hover:text-white text-xs font-semibold uppercase font-mono cursor-pointer"
            >
              Close
            </button>
            <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-medium text-md text-neutral-900 dark:text-white">Are you absolutely sure?</h3>
              <p className="text-neutral-400 dark:text-zinc-500 text-xxs mt-1 max-w-xs mx-auto leading-normal">
                This will void your active reservation credentials instantly. Room inventory counts will be restored back to global catalog immediately.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCancelTargetId(null)}
                className="w-full py-2.5 border border-stone-200 dark:border-zinc-800 hover:bg-stone-50 dark:hover:bg-zinc-850 text-stone-500 dark:text-zinc-400 rounded-xl text-xxs font-bold uppercase tracking-wider cursor-pointer text-center"
              >
                Keep Stay
              </button>
              <button
                onClick={() => {
                  onCancelBooking(cancelTargetId);
                  setCancelTargetId(null);
                }}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xxs font-bold uppercase tracking-wider cursor-pointer"
              >
                Void Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enterprise printable Invoice Modal Overlay */}
      {activeInvoiceBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 p-4 overflow-y-auto print:p-0 print:bg-white print:relative print:z-0">
          <div className="bg-white text-neutral-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-gray-200 space-y-6 print:shadow-none print:border-none print:rounded-none">
            
            {/* Control buttons inside screen */}
            <div className="flex justify-between items-center pb-4 border-b border-stone-100 print:hidden">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 font-sans flex items-center gap-1.5ClassName">
                <Receipt className="w-4 h-4" />
                Aura Invoice System Center
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handlePrintAction}
                  className="bg-neutral-900 hover:bg-amber-600 text-white text-xxs font-bold uppercase tracking-wider py-2 px-4 rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print/Save PDF Receipt
                </button>
                <button
                  onClick={() => setActiveInvoiceBooking(null)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-600 text-xxs font-bold uppercase tracking-widest py-2 px-3 rounded-xl cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Letterhead and logo */}
            <div className="space-y-6 text-left">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-display font-bold text-lg tracking-wider text-neutral-950 block">AURA</span>
                  <span className="font-display text-[9px] tracking-[0.25em] text-amber-600 block -mt-1 font-semibold">HOTELS & RESORTS</span>
                </div>
                <div className="text-right text-xxs leading-normal font-light">
                  <span className="block font-semibold">AURA HOSPITALITY GROUP</span>
                  <span className="text-neutral-400 block">5th Avenue Skyscraper Studio, NY</span>
                  <span className="text-neutral-400 block">concierge@aurahotels.reserve</span>
                </div>
              </div>

              {/* Title & bill parameters */}
              <div className="pt-4 border-t border-stone-100 flex justify-between items-start text-xs leading-normal">
                <div>
                  <span className="text-neutral-400 block font-mono text-[9px]">ISSUED TO REGISTRANT</span>
                  <strong className="text-neutral-950 text-xs block mt-0.5">{activeInvoiceBooking.guestName}</strong>
                  <span className="text-neutral-500 block text-xxs mt-0.5">{activeInvoiceBooking.guestEmail}</span>
                  <span className="text-neutral-500 block text-xxs">{activeInvoiceBooking.guestPhone}</span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-400 block font-mono text-[9px]">INVOICE PARAMETERS</span>
                  <strong className="text-neutral-950 text-xs block mt-0.5">REF: {activeInvoiceBooking.id}</strong>
                  <span className="text-neutral-500 block text-xxs mt-0.5">Booking Date: {new Date(activeInvoiceBooking.bookingDate || '').toLocaleDateString()}</span>
                  <span className="text-emerald-600 font-bold text-xxs font-mono">STATUS: CORPORATE GUARANTEED</span>
                </div>
              </div>

              {/* Grid with hotel stay specs */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs leading-relaxed">
                <span className="text-[9px] uppercase tracking-wider font-bold text-neutral-400 font-mono block mb-1">Stay parameters & suite allocation</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[9px] font-mono">SANCTUARY</span>
                    <strong className="text-stone-800">{activeInvoiceBooking.hotelName}</strong>
                    <span className="text-stone-500 block text-xxs">{activeInvoiceBooking.hotelLocation}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[9px] font-mono">SUITE UNIT</span>
                    <strong className="text-stone-800">{activeInvoiceBooking.roomName}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[9px] font-mono">TIMELINE</span>
                    <span className="text-stone-800 block font-semibold">{activeInvoiceBooking.checkIn}</span>
                    <span className="text-stone-500 block text-xxs">Check-out: {activeInvoiceBooking.checkOut}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[9px] font-mono">REST INTERVAL</span>
                    <strong className="text-stone-800 block">{activeInvoiceBooking.nights} Nights</strong>
                    <span className="text-stone-500 block text-xxs">Capacity: {activeInvoiceBooking.guests} Guests</span>
                  </div>
                </div>
              </div>

              {/* Line items pricing details table */}
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-stone-200 font-bold text-neutral-400 font-mono text-[9px] uppercase">
                    <th className="py-2.5">Item Description</th>
                    <th className="py-2.5 text-center">Qty / Nights</th>
                    <th className="py-2.5 text-right font-semibold">Unit Cost</th>
                    <th className="py-2.5 text-right font-bold text-stone-900">Calculated Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-600 leading-normal">
                  <tr>
                    <td className="py-3">
                      <span className="font-semibold text-stone-950 block">{activeInvoiceBooking.roomName} Suite Rental Charge</span>
                      <span className="text-neutral-400 text-xxs font-light block">Bespoke check-in, dynamic internet access, pools & concierge package included</span>
                    </td>
                    <td className="py-3 text-center">{activeInvoiceBooking.nights}</td>
                    <td className="py-3 text-right">${Math.round((activeInvoiceBooking.totalPrice || 0) * 0.8 / (activeInvoiceBooking.nights || 2))}</td>
                    <td className="py-3 text-right font-semibold text-stone-950">${Math.round((activeInvoiceBooking.totalPrice || 0) * 0.8)}</td>
                  </tr>
                  <tr>
                    <td className="py-3">
                      <span className="font-semibold text-stone-950 block">Aura Luxury Services Premium (10%)</span>
                      <span className="text-neutral-400 text-xxs font-light block">Bespoke luggage porterages & champagne desk welcomes</span>
                    </td>
                    <td className="py-3 text-center">1</td>
                    <td className="py-3 text-right">${Math.round((activeInvoiceBooking.totalPrice || 0) * 0.11)}</td>
                    <td className="py-3 text-right font-semibold text-stone-950">${Math.round((activeInvoiceBooking.totalPrice || 0) * 0.11)}</td>
                  </tr>
                  <tr>
                    <td className="py-3">
                      <span className="font-semibold text-stone-950 block">Tourism Tax & Green Forestry Contribution (8%)</span>
                      <span className="text-neutral-400 text-xxs font-light block">Regional local council tourism fees & carbon absorption offsets</span>
                    </td>
                    <td className="py-3 text-center">1</td>
                    <td className="py-3 text-right">${Math.round((activeInvoiceBooking.totalPrice || 0) * 0.09)}</td>
                    <td className="py-3 text-right font-semibold text-stone-950">${Math.round((activeInvoiceBooking.totalPrice || 0) * 0.09)}</td>
                  </tr>
                </tbody>
              </table>

              {/* Total sum calculations */}
              <div className="pt-4 border-t border-stone-200 flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-neutral-400 block font-mono">Billed settling channel</span>
                  <span className="text-zinc-500 block text-xxs flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Billed locally at check-out desk lobby
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Est. Billable Settled</span>
                  <strong className="text-xl font-display font-bold text-neural-950">${activeInvoiceBooking.totalPrice}</strong>
                </div>
              </div>

              {/* Dummy digital barcode */}
              <div className="pt-6 text-center space-y-1">
                <div className="inline-flex items-center gap-0.5 bg-neutral-900 px-8 py-3 rounded-md text-white border select-none">
                  {[...Array(30)].map((_, i) => (
                    <div 
                      key={i} 
                      className="bg-neutral-950 h-6 block" 
                      style={{ width: `${(i % 3 === 0 ? 3 : (i % 2 === 0 ? 1 : 2))}px` }} 
                    />
                  ))}
                </div>
                <span className="block text-[8px] tracking-[0.3em] font-mono text-zinc-400 font-bold">*{activeInvoiceBooking.id}*</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent extra notes */}
      <div className="mt-14 p-5 bg-stone-50 dark:bg-zinc-900 rounded-3xl border border-stone-150/60 dark:border-zinc-800 flex items-start gap-4">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs text-neutral-600 dark:text-zinc-400">
          <h4 className="font-semibold text-neutral-900 dark:text-zinc-200">Need immediate booking edits or butler assistance?</h4>
          <p className="font-light text-xxs mt-0.5 leading-relaxed text-neutral-400 sm:max-w-xl">
            For modifications to bed layouts, early check-in hours, or adding local chauffeur packages, please dial our central desk at <strong className="text-neutral-800 dark:text-zinc-300 font-semibold">+1 (800) 450-AURA</strong> from anywhere in the world.
          </p>
        </div>
      </div>
    </div>
  );
}
