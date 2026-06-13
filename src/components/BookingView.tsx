import { useState, useMemo, FormEvent } from 'react';
import { ArrowLeft, ShieldCheck, Mail, Phone, User, Compass, CreditCard, Lock, Calendar, ClipboardList, CheckCircle2, QrCode, Coins, Network, Info } from 'lucide-react';
import { Hotel, Room, Booking } from '../types';

interface BookingViewProps {
  hotel: Hotel;
  room: Room;
  searchParams?: {
    checkIn: string;
    checkOut: string;
    guests: number;
  } | null;
  onBack: () => void;
  onConfirmBooking: (booking: Booking) => void;
}

type PaymentMethodType = 'credit-card' | 'apple-pay' | 'crypto' | 'corporate';

export default function BookingView({ hotel, room, searchParams, onBack, onConfirmBooking }: BookingViewProps) {
  // Setup dates
  const defaultCheckIn = searchParams?.checkIn || new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const defaultCheckOut = searchParams?.checkOut || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [guests, setGuests] = useState(searchParams?.guests || 2);

  // Guest Details
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Payment Selection Type Tab
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('credit-card');

  // Credit Card Details
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Crypto parameters
  const CRYPTO_WALLETS = {
    BTC: 'bc1qp8luxuryauradesk992026118btc33',
    ETH: '0x098AURAe943Cfe884877F072c44FFfD6607Ea88',
  };
  const [chosenCrypto, setChosenCrypto] = useState<'BTC' | 'ETH'>('BTC');

  // Corporate params
  const [corporateId, setCorporateId] = useState('');
  const [poNumber, setPoNumber] = useState('');

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Nights calc
  const nights = useMemo(() => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    if (isNaN(diff) || diff <= 0) return 1;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [checkIn, checkOut]);

  const pricingSummary = useMemo(() => {
    const subtotal = room.pricePerNight * nights;
    const resortFee = Math.round(subtotal * 0.1); // 10% Resort premium service fee
    const tax = Math.round(subtotal * 0.08); // 8% Regional tourism tax
    const total = subtotal + resortFee + tax;
    return { subtotal, resortFee, tax, total };
  }, [room.pricePerNight, nights]);

  // Mock Date Availability Inventory Matrix
  const MOCK_AVAILABILITY_DAYS = useMemo(() => {
    const list = [];
    const baseDate = new Date();
    for (let i = 0; i < 14; i++) {
      const dt = new Date(baseDate);
      dt.setDate(baseDate.getDate() + i);
      const str = dt.toISOString().split('T')[0];
      const dayName = dt.toLocaleDateString([], { weekday: 'short' });
      const dayNum = dt.getDate();
      
      // Determine if highly booked
      // Let's make weekends slightly filled for realism
      const isWeekend = dt.getDay() === 0 || dt.getDay() === 6;
      const isSelected = str >= checkIn && str <= checkOut;
      const status = isWeekend ? 'few-left' : 'available';

      list.push({ dateStr: str, dayName, dayNum, isSelected, status });
    }
    return list;
  }, [checkIn, checkOut]);

  // Handle detailed form checks
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!guestName.trim() || guestName.trim().length < 3) {
      errors.guestName = 'Full Name is required (minimum 3 characters)';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!guestEmail.trim() || !emailRegex.test(guestEmail)) {
      errors.guestEmail = 'A valid corporate or personal email is required';
    }

    const phoneRegex = /^[+]?[0-9\s\-()]{8,20}$/;
    if (!guestPhone.trim() || !phoneRegex.test(guestPhone)) {
      errors.guestPhone = 'A valid check-in contact mobile number is required';
    }

    // Payment Validation depending on chosen Tab
    if (paymentMethod === 'credit-card') {
      const sanitizedCard = cardNumber.replace(/\s+/g, '');
      if (!sanitizedCard || sanitizedCard.length < 15) {
        errors.cardNumber = 'Credit card number is invalid (must be 15-16 digits)';
      }
      if (!cardHolder.trim() || cardHolder.trim().length < 3) {
        errors.cardHolder = 'Cardholder name is required';
      }
      if (!expDate.trim() || !/^\d{2}\/\d{2}$/.test(expDate)) {
        errors.expDate = 'Expiration date is required (MM/YY format)';
      }
      if (!cvv.trim() || cvv.length < 3) {
        errors.cvv = 'Security Code is invalid';
      }
    } else if (paymentMethod === 'corporate') {
      if (!corporateId.trim()) {
        errors.corporateId = 'Enterprise billing organization key is required';
      }
      if (!poNumber.trim()) {
        errors.poNumber = 'Purchase Order (PO) registration reference is required';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // scroll to first error
      const errorKeys = Object.keys(formErrors);
      if (errorKeys.length > 0) {
        window.scrollTo({ top: 150, behavior: 'smooth' });
      }
      return;
    }

    setIsSubmitting(true);

    // Simulate luxury booking delay transaction
    setTimeout(() => {
      const generatedBooking: Booking = {
        id: 'AURA-' + Math.floor(100000 + Math.random() * 900000),
        hotelId: hotel.id,
        hotelName: hotel.name,
        hotelLocation: hotel.location,
        hotelImage: hotel.image,
        roomId: room.id,
        roomName: room.name,
        roomImage: room.image,
        checkIn,
        checkOut,
        guests,
        guestName,
        guestEmail,
        guestPhone,
        specialRequests,
        totalPrice: pricingSummary.total,
        nights,
        status: 'confirmed',
        bookingDate: new Date().toISOString(),
      };

      setIsSubmitting(false);
      onConfirmBooking(generatedBooking);
    }, 1850);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 text-left fade-in-up dark:bg-zinc-950 transition-colors">
      
      {/* Return button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:text-zinc-400 dark:hover:text-amber-500 transition-colors mb-6 cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to rooms selection
      </button>

      {/* Main Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Inputs & payment setup */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Guest Personal details */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-xs">
            <h2 className="font-display font-light text-lg sm:text-2xl text-neutral-900 dark:text-white mb-6 pb-4 border-b border-gray-100 dark:border-zinc-800">
              Personal Guest <span className="font-serif italic font-normal text-amber-600 dark:text-amber-500">Details</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Dynamic dates selections */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500 mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />
                    Check-In
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs text-neutral-800 dark:text-zinc-200 focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500 mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />
                    Check-Out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs text-neutral-800 dark:text-zinc-200 focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500 mb-1.5 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />
                    Est. Occupants
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-xs text-neutral-800 dark:text-zinc-200 focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 focus:outline-none cursor-pointer"
                  >
                    <option value={1}>1 Occupant</option>
                    <option value={2}>2 Occupants</option>
                    <option value={3}>3 Occupants</option>
                    <option value={4}>4 Occupants</option>
                  </select>
                </div>
              </div>

              {/* Room Availability Interactive Calendar representational highlights */}
              <div className="bg-stone-50 dark:bg-zinc-950 p-4 rounded-2xl border border-stone-150/60 dark:border-zinc-850">
                <div className="flex items-center justify-between mb-3 text-[10px]">
                  <strong className="text-neutral-700 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                    <ClipboardList className="w-3.5 h-3.5 text-emerald-600" />
                    Premium Room Inventory Calendar (14 Days)
                  </strong>
                  <span className="text-emerald-600 font-semibold uppercase">Suite Confirmed Match</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {MOCK_AVAILABILITY_DAYS.map((day, i) => (
                    <div
                      key={day.dateStr}
                      className={`p-2 text-center rounded-lg border flex flex-col items-center justify-center transition-all ${
                        day.isSelected 
                          ? 'bg-amber-600/90 border-transparent text-white scale-103'
                          : 'bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-neutral-800 dark:text-zinc-300'
                      }`}
                    >
                      <span className={`text-[8px] uppercase tracking-wider ${day.isSelected ? 'text-white' : 'text-neutral-400 dark:text-zinc-500'}`}>{day.dayName}</span>
                      <span className="text-xs font-bold leading-none mt-1">{day.dayNum}</span>
                      <span className={`w-1 h-1 rounded-full mt-1.5 ${day.isSelected ? 'bg-white' : (day.status === 'few-left' ? 'bg-amber-400' : 'bg-emerald-500')}`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500 mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />
                    Lead Guest Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Sophya Loren"
                    value={guestName}
                    onChange={(e) => {
                      setGuestName(e.target.value);
                      if (formErrors.guestName) setFormErrors({ ...formErrors, guestName: '' });
                    }}
                    className={`w-full bg-stone-50 dark:bg-zinc-950 border rounded-xl py-2.5 px-3.5 text-xs text-neutral-800 dark:text-zinc-200 focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 focus:outline-none ${
                      formErrors.guestName ? 'border-rose-400 dark:border-rose-800 bg-rose-50/10' : 'border-stone-200 dark:border-zinc-800'
                    }`}
                  />
                  {formErrors.guestName && <p className="text-rose-600 text-[10px] mt-1 font-semibold">{formErrors.guestName}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500 mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />
                    Primary Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="sophia@luxuryestates.org"
                    value={guestEmail}
                    onChange={(e) => {
                      setGuestEmail(e.target.value);
                      if (formErrors.guestEmail) setFormErrors({ ...formErrors, guestEmail: '' });
                    }}
                    className={`w-full bg-stone-50 dark:bg-zinc-950 border rounded-xl py-2.5 px-3.5 text-xs text-neutral-800 dark:text-zinc-200 focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 focus:outline-none ${
                      formErrors.guestEmail ? 'border-rose-400 dark:border-rose-800 bg-rose-50/10' : 'border-stone-200 dark:border-zinc-800'
                    }`}
                  />
                  {formErrors.guestEmail && <p className="text-rose-600 text-[10px] mt-1 font-semibold">{formErrors.guestEmail}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />
                    Check-In Mobile Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 793-2940"
                    value={guestPhone}
                    onChange={(e) => {
                      setGuestPhone(e.target.value);
                      if (formErrors.guestPhone) setFormErrors({ ...formErrors, guestPhone: '' });
                    }}
                    className={`w-full bg-stone-50 dark:bg-zinc-950 border rounded-xl py-2.5 px-3.5 text-xs text-neutral-800 dark:text-zinc-200 focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 focus:outline-none ${
                      formErrors.guestPhone ? 'border-rose-400 dark:border-rose-800 bg-rose-50/10' : 'border-stone-200 dark:border-zinc-800'
                    }`}
                  />
                  {formErrors.guestPhone && <p className="text-rose-600 text-[10px] mt-1 font-semibold">{formErrors.guestPhone}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500 mb-1">
                    Bespoke Pillows, Dining requests, or arrival delays (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Please pre-prepare ultra firm down pillows. Planning check-in split at 8 PM, would love pre-chilled sparkling water."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2.5 px-3.5 text-xs text-neutral-800 dark:text-zinc-200 focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 focus:outline-none resize-none font-light"
                  />
                </div>
              </div>

              {/* Enterprise payment choice mechanism */}
              <div className="pt-6 border-t border-gray-100 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display font-semibold text-neutral-900 dark:text-zinc-100 text-sm tracking-wide">
                      Select Guarantee & Payment Channel
                    </h3>
                    <p className="text-neutral-400 dark:text-zinc-500 text-xxs">
                      Guaranteed booking slots. Choose your elite convenience.
                    </p>
                  </div>
                </div>

                {/* Grid Tabs selection */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                  {[
                    { id: 'credit-card', label: 'Bespoke Card', icon: CreditCard },
                    { id: 'apple-pay', label: 'Biometric Pay', icon: ShieldCheck },
                    { id: 'crypto', label: 'Digital Coin', icon: Coins },
                    { id: 'corporate', label: 'Company PO', icon: ClipboardList },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setPaymentMethod(tab.id as PaymentMethodType)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center cursor-pointer select-none ${
                        paymentMethod === tab.id
                          ? 'border-amber-600 bg-amber-500/5 text-amber-700 dark:text-amber-400'
                          : 'border-stone-200 dark:border-zinc-800 text-neutral-500 dark:text-zinc-400 hover:bg-stone-50 dark:hover:bg-zinc-850'
                      }`}
                    >
                      <tab.icon className="w-4 h-4 shrink-0" />
                      <span className="text-[10px] font-bold tracking-tight uppercase leading-none">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Sub Tab Panel 1: CREDIT CARD & Interactive gorgeous Card layout */}
                {paymentMethod === 'credit-card' && (
                  <div className="space-y-6">
                    {/* Exquisite platinum gold visual front/back credit card */}
                    <div 
                      className="relative w-full max-w-[340px] h-[190px] mx-auto rounded-2xl bg-linear-to-r from-stone-850 via-zinc-900 to-amber-900 text-white p-5 shadow-2xl flex flex-col justify-between overflow-hidden cursor-pointer"
                      onClick={() => setIsCardFlipped(!isCardFlipped)}
                      title="Click to see reverse security code pane"
                    >
                      {/* Interactive golden hologram chip */}
                      <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-amber-500/10 blur-xl block" />
                      
                      {!isCardFlipped ? (
                        <>
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <span className="text-[8px] uppercase tracking-widest text-amber-500 font-mono font-bold">Aura Elite Member Card</span>
                              <h4 className="font-display font-bold tracking-wider text-sm leading-none">PLATINUM SIGNATURE</h4>
                            </div>
                            <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center text-xs font-serif font-bold italic text-amber-400">
                              A
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="font-mono text-sm tracking-widest text-center mt-2 font-bold select-none text-stone-100">
                              {cardNumber || '•••• •••• •••• ••••'}
                            </div>

                            <div className="flex items-end justify-between font-mono">
                              <div className="text-left">
                                <span className="text-[7px] text-stone-400 uppercase tracking-widest block leading-none">Elite Holder</span>
                                <span className="text-[10px] tracking-wide uppercase font-semibold text-stone-150 inline-block mt-0.5 max-w-[170px] truncate">
                                  {cardHolder || 'CARDOWNER NAME'}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-[7px] text-stone-400 uppercase tracking-widest block leading-none">Exp. Limit</span>
                                <span className="text-[10px] font-semibold text-stone-150 inline-block mt-0.5">{expDate || 'MM/YY'}</span>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-full bg-stone-950 h-8 -mx-5 -mt-1 block mb-3 relative z-10" />
                          <div className="space-y-3">
                            <div className="bg-stone-800 text-right p-1.5 rounded-md font-mono text-[10px] tracking-widest inline-block w-3/4">
                              <span className="text-[8px] text-stone-400 uppercase tracking-wider mr-2">CVC SHIELD:</span>
                              <strong className="text-white font-bold">{cvv || '•••'}</strong>
                            </div>
                            <p className="text-[7px] text-stone-400 leading-normal font-light italic">
                              This signature strip certifies electronic and concierge check-in rights. Charged strictly at property.
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Inputs panel */}
                    <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                      <div className="sm:col-span-4">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500 mb-1">
                          16-Digit Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="4111 2222 3333 4444"
                          maxLength={19}
                          value={cardNumber}
                          onFocus={() => setIsCardFlipped(false)}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                            const parts = [];
                            for (let i = 0; i < val.length; i += 4) {
                              parts.push(val.substring(i, i + 4));
                            }
                            setCardNumber(parts.join(' '));
                            if (formErrors.cardNumber) setFormErrors({ ...formErrors, cardNumber: '' });
                          }}
                          className={`w-full bg-stone-50 dark:bg-zinc-950 border rounded-xl py-2 px-3 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
                            formErrors.cardNumber ? 'border-rose-400' : 'border-stone-200 dark:border-zinc-800'
                          }`}
                        />
                        {formErrors.cardNumber && <p className="text-rose-600 text-[10px] mt-1 font-semibold">{formErrors.cardNumber}</p>}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500 mb-1">
                          CVV/Security Code
                        </label>
                        <input
                          type="password"
                          placeholder="***"
                          maxLength={4}
                          value={cvv}
                          onFocus={() => setIsCardFlipped(true)}
                          onBlur={() => setIsCardFlipped(false)}
                          onChange={(e) => {
                            setCvv(e.target.value.replace(/[^0-9]/gi, ''));
                            if (formErrors.cvv) setFormErrors({ ...formErrors, cvv: '' });
                          }}
                          className={`w-full bg-stone-50 dark:bg-zinc-950 border rounded-xl py-2 px-3 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-center tracking-widest ${
                            formErrors.cvv ? 'border-rose-400' : 'border-stone-200 dark:border-zinc-800'
                          }`}
                        />
                        {formErrors.cvv && <p className="text-rose-600 text-[10px] mt-1 font-semibold">{formErrors.cvv}</p>}
                      </div>

                      <div className="sm:col-span-4">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500 mb-1">
                          Full Name on Card
                        </label>
                        <input
                          type="text"
                          placeholder="SOPHIA LOREN"
                          value={cardHolder}
                          onFocus={() => setIsCardFlipped(false)}
                          onChange={(e) => {
                            setCardHolder(e.target.value);
                            if (formErrors.cardHolder) setFormErrors({ ...formErrors, cardHolder: '' });
                          }}
                          className={`w-full bg-stone-50 dark:bg-zinc-950 border rounded-xl py-2 px-3 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 uppercase ${
                            formErrors.cardHolder ? 'border-rose-400' : 'border-stone-200 dark:border-zinc-800'
                          }`}
                        />
                        {formErrors.cardHolder && <p className="text-rose-600 text-[10px] mt-1 font-semibold">{formErrors.cardHolder}</p>}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500 mb-1">
                          Expiration (MM/YY)
                        </label>
                        <input
                          type="text"
                          placeholder="12/28"
                          maxLength={5}
                          value={expDate}
                          onFocus={() => setIsCardFlipped(false)}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/gi, '');
                            if (val.length >= 2) {
                              setExpDate(val.slice(0, 2) + '/' + val.slice(2, 4));
                            } else {
                              setExpDate(val);
                            }
                            if (formErrors.expDate) setFormErrors({ ...formErrors, expDate: '' });
                          }}
                          className={`w-full bg-stone-50 dark:bg-zinc-950 border rounded-xl py-2 px-3 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-center ${
                            formErrors.expDate ? 'border-rose-400' : 'border-stone-200 dark:border-zinc-800'
                          }`}
                        />
                        {formErrors.expDate && <p className="text-rose-600 text-[10px] mt-1 font-semibold">{formErrors.expDate}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub Tab Panel 2: Apple Pay */}
                {paymentMethod === 'apple-pay' && (
                  <div className="bg-neutral-50 dark:bg-zinc-950 rounded-2xl p-6 text-center space-y-4 border border-zinc-150 dark:border-zinc-800">
                    <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center text-white text-lg font-bold mx-auto">
                      
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-neutral-800 dark:text-white text-xs">Aura Biometric Secure Checkout</h4>
                      <p className="text-neutral-400 dark:text-zinc-500 text-xxs leading-normal max-w-sm mx-auto font-light">
                        Skip forms completely. Secure your room using Apple Touch ID / Face ID encrypted payment token. Key details autofill effortlessly upon token validation.
                      </p>
                    </div>

                    <button 
                      type="button"
                      onClick={() => {
                        setCardNumber(' Apple Wallet Secure Token');
                        setCardHolder('Biometric Verified Customer');
                        setExpDate('06/30');
                        setCvv('');
                        alert('Luxury Biometric Token pre-registered! Click Confirm Reservation below to lock your suite.');
                      }}
                      className="bg-neutral-950 hover:bg-neutral-900 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-neutral-900 text-xs font-semibold py-3 px-8 rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>Pay with Pay</span>
                    </button>
                  </div>
                )}

                {/* Sub Tab Panel 3: Crypto */}
                {paymentMethod === 'crypto' && (
                  <div className="bg-stone-50 dark:bg-zinc-950 rounded-2xl p-5 space-y-4 border border-zinc-150 dark:border-zinc-800 text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-200/60 dark:border-zinc-800">
                      <span className="font-semibold text-neutral-800 dark:text-white font-display">Decentralized Web-3 Settlement</span>
                      <div className="flex bg-white dark:bg-zinc-900 rounded-lg p-0.5 border border-stone-200 dark:border-zinc-800">
                        <button
                          type="button" 
                          onClick={() => setChosenCrypto('BTC')}
                          className={`px-3 py-1 rounded-md text-[10px] font-bold cursor-pointer ${chosenCrypto === 'BTC' ? 'bg-amber-500 text-white' : 'text-stone-400'}`}
                        >
                          BTC
                        </button>
                        <button
                          type="button" 
                          onClick={() => setChosenCrypto('ETH')}
                          className={`px-3 py-1 rounded-md text-[10px] font-bold cursor-pointer ${chosenCrypto === 'ETH' ? 'bg-indigo-500 text-white' : 'text-stone-400'}`}
                        >
                          ETH
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-5">
                      <div className="bg-white p-2.5 rounded-lg border border-stone-150 inline-block shrink-0">
                        {/* Mock QR code element */}
                        <div className="w-24 h-24 bg-stone-100 flex items-center justify-center text-center text-stone-400">
                          <QrCode className="w-14 h-14" />
                        </div>
                      </div>
                      <div className="space-y-2 text-left">
                        <span className="text-[9px] uppercase tracking-wider text-neutral-400 block font-mono">Transfer Sanctuary Deposit Wallet</span>
                        <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-2.5 rounded-xl font-mono text-[10px] truncate max-w-xs break-all text-neutral-700 dark:text-zinc-300">
                          {CRYPTO_WALLETS[chosenCrypto]}
                        </div>
                        <p className="text-zinc-400 dark:text-zinc-500 text-[10px] leading-relaxed font-light">
                          Our smart oracle contract locks room inventory upon mempool inclusion detection. Scan, deposit 0.005 {chosenCrypto}, and tap confirm below!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub Tab Panel 4: Corporate Invoice */}
                {paymentMethod === 'corporate' && (
                  <div className="space-y-4 text-xs font-light">
                    <p className="text-zinc-400 dark:text-zinc-500 text-xxs">
                      Eligible strictly for partner business clients. Invoice issued directly onto department accounts at settlement period.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500 mb-1">
                          Corporate Account ID Key
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. CORP-AURA-9923"
                          value={corporateId}
                          onChange={(e) => {
                            setCorporateId(e.target.value);
                            if (formErrors.corporateId) setFormErrors({ ...formErrors, corporateId: '' });
                          }}
                          className={`w-full bg-stone-50 dark:bg-zinc-950 border rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
                            formErrors.corporateId ? 'border-rose-400' : 'border-stone-200 dark:border-zinc-800'
                          }`}
                        />
                        {formErrors.corporateId && <p className="text-rose-600 text-[10px] mt-1 font-semibold">{formErrors.corporateId}</p>}
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500 mb-1">
                          Purchase Order (PO) Pin Ref
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. PO-88391"
                          value={poNumber}
                          onChange={(e) => {
                            setPoNumber(e.target.value);
                            if (formErrors.poNumber) setFormErrors({ ...formErrors, poNumber: '' });
                          }}
                          className={`w-full bg-stone-50 dark:bg-zinc-950 border rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
                            formErrors.poNumber ? 'border-rose-400' : 'border-stone-200 dark:border-zinc-800'
                          }`}
                        />
                        {formErrors.poNumber && <p className="text-rose-600 text-[10px] mt-1 font-semibold">{formErrors.poNumber}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Secured notes check */}
                <div className="mt-6 flex items-start gap-2 pt-4 border-t border-stone-50 dark:border-zinc-850">
                  <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-zinc-400 leading-normal max-w-lg font-light">
                    Every reservation is secured using military-grade SSL standards. To coordinate customized pre-arrival luxury upgrades or helicopter helipad bookings, please contact our physical Concierge line post-registration.
                  </p>
                </div>
              </div>

              {/* Action submission row */}
              <div className="pt-4 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={onBack}
                  className="px-6 py-3.5 border border-stone-200 dark:border-zinc-800 hover:bg-stone-50 dark:hover:bg-zinc-900 text-stone-500 dark:text-zinc-400 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-neutral-950 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 disabled:bg-neutral-400 text-white min-w-[200px] py-3.5 px-8 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md text-center"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin inline-block w-4 h-4 rounded-full border-2 border-white border-t-transparent" />
                      Tokenizing transaction...
                    </span>
                  ) : (
                    <span>Confirm Reservation (${pricingSummary.total})</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Price breakdowns and property card sticky panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-5 shadow-xs sticky top-28">
            <h3 className="font-display font-semibold text-xs tracking-wider text-neutral-400 uppercase mb-4">
              Sanctuary Snapshot
            </h3>

            {/* Photo & Titles */}
            <div className="flex gap-4 pb-5 border-b border-gray-100 dark:border-zinc-800">
              <div className="w-24 h-16 rounded-xl bg-neutral-100 overflow-hidden shrink-0">
                <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <span className="text-[9px] text-amber-600 dark:text-amber-500 block font-mono font-bold uppercase tracking-wider">{hotel.name}</span>
                <h4 className="font-display font-semibold text-sm text-neutral-900 dark:text-white leading-tight mt-0.5">{room.name}</h4>
                <p className="text-zinc-400 dark:text-zinc-500 text-xxs mt-1 font-light italic">{hotel.city}</p>
              </div>
            </div>

            {/* Check timelines highlight */}
            <div className="grid grid-cols-2 gap-4 py-5 border-b border-gray-100 dark:border-zinc-800 text-xs">
              <div>
                <span className="text-xxs uppercase tracking-wider text-neutral-400 dark:text-zinc-500 block font-mono font-bold">Check-In</span>
                <strong className="text-xs font-semibold text-neutral-800 dark:text-zinc-200 block mt-0.5">{checkIn}</strong>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500">After 3:00 PM Reception</span>
              </div>
              <div className="border-l border-gray-100 dark:border-zinc-800 pl-4">
                <span className="text-xxs uppercase tracking-wider text-neutral-400 dark:text-zinc-500 block font-mono font-bold">Check-Out</span>
                <strong className="text-xs font-semibold text-neutral-800 dark:text-zinc-200 block mt-0.5">{checkOut}</strong>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500">Before 11:00 AM Express Lobby</span>
              </div>
            </div>

            {/* Financial math breakdowns */}
            <div className="py-5 space-y-3.5 border-b border-gray-100 dark:border-zinc-800 text-xs font-light text-neutral-500 dark:text-zinc-400">
              <div className="flex justify-between items-center">
                <span>Room Charges ({nights} {nights === 1 ? 'night' : 'nights'})</span>
                <span className="font-semibold text-neutral-800 dark:text-zinc-200">${room.pricePerNight} &times; {nights}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Room Subtotal</span>
                <span className="font-semibold text-neutral-800 dark:text-zinc-200">${pricingSummary.subtotal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Luxury Retreat Service Premium (10%)</span>
                <span className="font-semibold text-neutral-800 dark:text-zinc-200">${pricingSummary.resortFee}</span>
              </div>
              <div className="flex justify-between items-center pb-1">
                <span>Regional Tourism & Green Tax (8%)</span>
                <span className="font-semibold text-neutral-800 dark:text-zinc-200">${pricingSummary.tax}</span>
              </div>
            </div>

            {/* Total values layout */}
            <div className="pt-5 flex justify-between items-center">
              <div className="text-left">
                <span className="text-[10px] text-neutral-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Estimated Total Bill</span>
                <p className="text-xxs text-emerald-600 font-semibold mt-0.5">Best Guaranteed Online Price</p>
              </div>
              <span className="text-2xl font-display font-bold text-neutral-900 dark:text-white">
                ${pricingSummary.total}
              </span>
            </div>

            {/* SSL badges */}
            <div className="mt-6 pt-5 border-t border-gray-50 dark:border-zinc-800 space-y-2.5">
              <div className="flex items-center gap-2.5 text-[10px] text-emerald-600 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero pre-booking deposit. Settle upon departure lobby.</span>
              </div>
              <div className="flex items-center gap-2.5 text-[10px] text-zinc-500 font-light">
                <Compass className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Includes breakfast, champagne on check-in, and ski locker.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
