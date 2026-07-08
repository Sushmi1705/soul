import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  Video, 
  PhoneCall, 
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Lock,
  Loader2,
  HelpCircle,
  Sparkles,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { toast } from "sonner";
import { PaymentService } from "@/services/bookingServices";
import { CalculatorBookingService } from "@/services/calculatorBookingServices";

const TIME_SLOTS = [
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
  "05:00 PM - 06:00 PM"
];

const CalculatorBookingModal = ({ open, onClose, calculatorId, calculatorName, resultId }) => {
  const [step, setStep] = useState(1); // 1: Customer Details | 2: Consultation Details | 3: Summary | 4: Success | 'existing': Active Booking detected
  const [loading, setLoading] = useState(false);
  
  // Stored form data
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    date: "",
    slot: "",
    mode: "Video Call", // Video Call | Phone Call | WhatsApp
    notes: ""
  });

  // Keep track of active booking if one is found
  const [activeBooking, setActiveBooking] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Load profile defaults from localStorage
  useEffect(() => {
    if (open) {
      const storedPhone = localStorage.getItem("seeker_phone") || "";
      const storedName = localStorage.getItem("seeker_name") || "";
      const storedEmail = localStorage.getItem("seeker_email") || "";

      setForm((prev) => ({
        ...prev,
        name: storedName,
        email: storedEmail,
        mobile: storedPhone,
        date: "",
        slot: "",
        mode: "Video Call",
        notes: ""
      }));
      
      setConfirmedBooking(null);

      if (storedPhone) {
        const existing = CalculatorBookingService.getActiveBooking(storedPhone, calculatorId);
        if (existing) {
          setActiveBooking(existing);
          setStep("existing");
          return;
        }
      }

      setStep(1);
      setActiveBooking(null);
    }
  }, [open, calculatorId]);

  if (!open) return null;

  // Handle step 1: Customer info validation
  const handleStep1Continue = () => {
    if (!form.name || !form.email || !form.mobile) {
      toast.error("Please fill in all customer detail fields.");
      return;
    }
    // Basic validations
    if (form.mobile.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!form.email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Check duplicate booking prevention
    const existing = CalculatorBookingService.getActiveBooking(form.mobile, calculatorId);
    if (existing) {
      setActiveBooking(existing);
      setStep("existing");
      toast.info("Active consultation found for this calculator.");
    } else {
      setStep(2);
    }
  };

  // Get available slots for the selected date
  const getAvailableSlots = () => {
    if (!form.date) return [];
    const booked = CalculatorBookingService.getBookedSlotsForDate(form.date);
    return TIME_SLOTS.filter((s) => !booked.includes(s));
  };

  // Handle step 2 validation
  const handleStep2Continue = () => {
    if (!form.date || !form.slot || !form.mode) {
      toast.error("Please select a date, available slot, and consultation mode.");
      return;
    }
    setStep(3);
  };

  // Place order & load Razorpay Checkout
  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Load Razorpay SDK
      await PaymentService.loadRazorpaySDK();

      // 2. Generate Razorpay Order wrapper on backend
      const orderDetails = await PaymentService.createOrder(
        "video", // consultation fallback type
        new Date(form.date),
        form.slot.split(" - ")[0]
      );

      // 3. Launch Checkout window
      const options = {
        key: orderDetails.key_id,
        amount: 110000, // ₹1,100 in paise
        currency: "INR",
        name: "Astro Power 24",
        description: `1-on-1 Consultation: ${calculatorName}`,
        order_id: orderDetails.order_id,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.mobile
        },
        theme: {
          color: "#B38B36"
        },
        handler: async (response) => {
          try {
            const bookingData = {
              customerName: form.name,
              email: form.email,
              mobile: form.mobile,
              calculatorId,
              calculatorName,
              calculatorType: "Free Astrological Calculator",
              calculatorResultId: resultId || "CALC-RES-108",
              consultationDate: form.date,
              timeSlot: form.slot,
              consultationMode: form.mode,
              amount: 1100
            };

            const paymentData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            };

            // Double check availability one final time before database write
            const booked = CalculatorBookingService.getBookedSlotsForDate(form.date);
            if (booked.includes(form.slot)) {
              toast.error("This slot was booked by another client during your checkout. Redirecting you to pick another slot...");
              setStep(2);
              return;
            }

            const confirmed = CalculatorBookingService.confirmBooking(bookingData, paymentData);
            setConfirmedBooking(confirmed);
            setStep(4);
            toast.success("Payment successful! Consultation booked.");
          } catch (err) {
            toast.error("Failed to finalize booking transaction.");
          }
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment was cancelled.");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (resp) {
        toast.error("Transaction failed. Please retry.");
      });
      rzp.open();

    } catch (err) {
      toast.error(err.message || "Failed to launch payment portal.");
    } finally {
      setLoading(false);
    }
  };

  // Safe Exit verification dialog
  const handleRequestClose = () => {
    if ([4, "existing"].includes(step)) {
      onClose();
      return;
    }
    const confirmClose = window.confirm("Are you sure you want to exit? Unsaved booking information will be lost.");
    if (confirmClose) onClose();
  };

  // Cancel Booking handler
  const handleCancelBooking = (bookingId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this consultation? (Note: No refunds will be provided for client cancellations).");
    if (!confirmCancel) return;

    const res = CalculatorBookingService.cancelBooking(bookingId);
    if (res.success) {
      toast.success(res.message);
      onClose();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md">
      
      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-white/95 backdrop-blur-2xl border border-stone-200/80 rounded-[2.5rem] shadow-[0_40px_100px_rgba(60,42,33,0.25)] flex flex-col max-h-[90vh] overflow-hidden"
      >
        
        {/* Header */}
        <header className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#3C2A21]">
              {step === "existing" ? "Active Consultation Found" : "Book Expert Consultation"}
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              {step === 4 ? "Booking confirmed" : `Personalized remedies for ${calculatorName}`}
            </p>
          </div>
          <button
            onClick={handleRequestClose}
            className="p-1.5 rounded-full hover:bg-stone-100 transition-colors text-stone-400 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Progress Indicator */}
        {typeof step === "number" && step < 4 && (
          <div className="bg-stone-50 px-6 py-3 border-b border-stone-100 flex items-center gap-3">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                  step === s 
                    ? "bg-[#3C2A21] border-[#3C2A21] text-white" 
                    : step > s 
                      ? "bg-[#B38B36] border-[#B38B36] text-white" 
                      : "bg-white border-stone-200 text-stone-400"
                }`}>
                  {step > s ? <CheckCircle2 className="w-3.5 h-3.5" /> : s}
                </div>
                <span className={`text-[10px] uppercase font-bold tracking-wider hidden sm:inline ${
                  step === s ? "text-[#3C2A21]" : "text-stone-400"
                }`}>
                  {s === 1 && "Customer"}
                  {s === 2 && "Schedule"}
                  {s === 3 && "Payment"}
                </span>
                {s < 3 && <ChevronRight className="w-3 h-3 text-stone-300 hidden sm:inline" />}
              </div>
            ))}
          </div>
        )}

        {/* Content Box */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-left">
          
          {/* STEP 1: CUSTOMER DETAILS */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] tracking-wider uppercase font-bold text-stone-500 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#B38B36]"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-wider uppercase font-bold text-stone-500 mb-1.5">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#B38B36]"
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-wider uppercase font-bold text-stone-500 mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#B38B36]"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex gap-3">
                <button
                  onClick={handleRequestClose}
                  className="flex-1 py-3 text-xs tracking-wider font-bold uppercase border border-stone-200 rounded-full text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStep1Continue}
                  className="flex-1 py-3 text-xs tracking-wider font-bold uppercase bg-[#3C2A21] text-white rounded-full hover:bg-[#B38B36] transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CONSULTATION DETAILS */}
          {step === 2 && (
            <div className="space-y-4">
              
              {/* Uneditable metadata fields */}
              <div className="grid grid-cols-2 gap-3 bg-stone-50 rounded-xl p-3 border border-stone-200/50 text-[10px] text-stone-500 uppercase tracking-wider font-bold">
                <div>
                  <span className="block text-stone-400 text-[9px] mb-0.5">Calculator:</span>
                  <span className="text-[#3C2A21] truncate block">{calculatorName}</span>
                </div>
                <div>
                  <span className="block text-stone-400 text-[9px] mb-0.5">Type / Ref:</span>
                  <span className="text-[#3C2A21] truncate block">{calculatorId}</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-wider uppercase font-bold text-stone-500 mb-1.5">
                  Consultation Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value, slot: "" })}
                    className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#B38B36]"
                  />
                </div>
              </div>

              {form.date && (
                <div>
                  <label className="block text-[10px] tracking-wider uppercase font-bold text-stone-500 mb-1.5">
                    Available Time Slots *
                  </label>
                  {getAvailableSlots().length === 0 ? (
                    <div className="p-3 text-center border border-red-200 bg-red-50 text-red-700 text-xs rounded-xl flex items-center justify-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      All slots booked on this day. Please select another date.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {getAvailableSlots().map((s) => (
                        <button
                          key={s}
                          onClick={() => setForm({ ...form, slot: s })}
                          className={`p-2.5 border rounded-xl text-xs font-semibold text-center transition-all ${
                            form.slot === s
                              ? "bg-[#B38B36]/10 border-[#B38B36] text-[#B38B36]"
                              : "bg-white border-stone-200 text-stone-600 hover:border-stone-400"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-[10px] tracking-wider uppercase font-bold text-stone-500 mb-1.5">
                  Consultation Mode *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "Video Call", icon: Video },
                    { id: "Phone Call", icon: PhoneCall },
                    { id: "WhatsApp", icon: MessageSquare }
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setForm({ ...form, mode: m.id })}
                        className={`p-3 border rounded-xl flex flex-col items-center gap-1.5 text-xs font-semibold transition-all ${
                          form.mode === m.id
                            ? "bg-[#3C2A21] border-[#3C2A21] text-white"
                            : "bg-white border-stone-200 text-stone-600 hover:border-stone-400"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {m.id}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-wider uppercase font-bold text-stone-500 mb-1.5">
                  Optional notes / questions
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#B38B36] resize-none"
                  placeholder="Ask a question about your chart..."
                />
              </div>

              <div className="pt-4 border-t border-stone-100 flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 text-xs tracking-wider font-bold uppercase border border-stone-200 rounded-full text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleStep2Continue}
                  className="flex-1 py-3 text-xs tracking-wider font-bold uppercase bg-[#3C2A21] text-white rounded-full hover:bg-[#B38B36] transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: BOOKING SUMMARY & PAYMENT */}
          {step === 3 && (
            <div className="space-y-4">
              
              {/* Summary box */}
              <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-5 space-y-3.5 text-xs">
                <div className="flex justify-between border-b border-stone-200/40 pb-2">
                  <span className="text-stone-400 font-bold uppercase">Seeker</span>
                  <span className="font-bold text-[#3C2A21]">{form.name}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200/40 pb-2">
                  <span className="text-stone-400 font-bold uppercase">Contact</span>
                  <span className="font-semibold text-[#3C2A21]">{form.mobile} ({form.email})</span>
                </div>
                <div className="flex justify-between border-b border-stone-200/40 pb-2">
                  <span className="text-stone-400 font-bold uppercase">Calculator</span>
                  <span className="font-bold text-[#B38B36]">{calculatorName}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200/40 pb-2">
                  <span className="text-stone-400 font-bold uppercase">Schedule</span>
                  <span className="font-semibold text-[#3C2A21]">{form.date} @ {form.slot}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200/40 pb-2">
                  <span className="text-stone-400 font-bold uppercase">Mode</span>
                  <span className="font-bold text-[#3C2A21]">{form.mode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400 font-bold uppercase">Consultation Fee</span>
                  <span className="font-bold text-[#3C2A21] text-base font-serif">₹1,100</span>
                </div>
              </div>

              {/* T&C Policies */}
              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/50 text-[10px] leading-relaxed text-stone-400/90 space-y-2">
                <div>
                  <strong className="text-[#3C2A21]/70 block font-bold uppercase tracking-wider mb-0.5">Cancellation Policy</strong>
                  Cancellations are allowed up to 24 hours prior to the session. No refunds will be provided for cancellations made within 24 hours or for no-shows.
                </div>
                <div>
                  <strong className="text-[#3C2A21]/70 block font-bold uppercase tracking-wider mb-0.5">Terms & Conditions</strong>
                  By completing payment, you agree to connect at the designated slot. Remedies provided are for spiritual alignment.
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 text-xs tracking-wider font-bold uppercase border border-stone-200 rounded-full text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex-1 py-3 text-xs tracking-wider font-bold uppercase bg-[#3C2A21] text-white rounded-full hover:bg-[#B38B36] transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#FCF6BA]" />
                      Processing...
                    </>
                  ) : (
                    "Proceed to Payment"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === 4 && confirmedBooking && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>

              <div className="space-y-1">
                <div className="text-[10px] tracking-[0.2em] uppercase text-emerald-600 font-extrabold">Payment Successful</div>
                <h4 className="font-serif text-xl font-bold text-[#3C2A21]">Consultation Confirmed!</h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed mt-1">
                  Your slot has been reserved. Gitika Sharma's coordinator will send connection invites shortly.
                </p>
              </div>

              {/* Receipt details */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 text-left text-xs space-y-3.5">
                <div className="flex justify-between border-b border-stone-200/40 pb-2">
                  <span className="text-stone-400 font-bold uppercase">Booking ID</span>
                  <span className="font-mono font-bold text-[#3C2A21]">{confirmedBooking.bookingId}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200/40 pb-2">
                  <span className="text-stone-400 font-bold uppercase">Seeker</span>
                  <span className="font-bold text-[#3C2A21]">{confirmedBooking.customerName}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200/40 pb-2">
                  <span className="text-stone-400 font-bold uppercase">Calculator</span>
                  <span className="font-bold text-[#B38B36]">{confirmedBooking.calculatorName}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200/40 pb-2">
                  <span className="text-stone-400 font-bold uppercase">Schedule</span>
                  <span className="font-semibold text-[#3C2A21]">{confirmedBooking.consultationDate} @ {confirmedBooking.timeSlot}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200/40 pb-2">
                  <span className="text-stone-400 font-bold uppercase">Mode</span>
                  <span className="font-bold text-[#3C2A21]">{confirmedBooking.consultationMode}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200/40 pb-2">
                  <span className="text-stone-400 font-bold uppercase">Transaction ID</span>
                  <span className="font-mono text-stone-500">{confirmedBooking.paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400 font-bold uppercase">Payment Status</span>
                  <span className="text-emerald-600 font-bold">SUCCESSFUL (PAID)</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3.5 bg-[#3C2A21] text-white rounded-full text-xs tracking-widest font-bold uppercase hover:bg-[#B38B36] transition-all"
              >
                Close & View Results
              </button>
            </div>
          )}

          {/* STEP EXISTING: ACTIVE BOOKING FOUND DETECTED */}
          {step === "existing" && activeBooking && (
            <div className="space-y-6 py-2">
              <div className="bg-[#B38B36]/10 border border-[#B38B36]/20 rounded-2xl p-4 flex gap-3 text-xs text-[#3C2A21]/90 leading-relaxed">
                <AlertCircle className="w-5 h-5 text-[#B38B36] shrink-0 mt-0.5" />
                <p>
                  <strong>You have already booked a consultation for this calculator.</strong>
                  <br />To prevent duplicate transactions, we only permit one active consultation slot per calculator report.
                </p>
              </div>

              {/* Active booking ticket */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-3.5 text-xs">
                <div className="flex justify-between border-b border-stone-200/40 pb-2">
                  <span className="text-stone-400 font-bold uppercase">Booking ID</span>
                  <span className="font-mono font-bold text-[#3C2A21]">{activeBooking.bookingId}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200/40 pb-2">
                  <span className="text-stone-400 font-bold uppercase">Calculator</span>
                  <span className="font-bold text-[#B38B36]">{activeBooking.calculatorName}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200/40 pb-2">
                  <span className="text-stone-400 font-bold uppercase">Schedule</span>
                  <span className="font-semibold text-[#3C2A21]">{activeBooking.consultationDate} @ {activeBooking.timeSlot}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200/40 pb-2">
                  <span className="text-stone-400 font-bold uppercase">Mode</span>
                  <span className="font-bold text-[#3C2A21]">{activeBooking.consultationMode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400 font-bold uppercase">Booking Status</span>
                  <span className="text-[#B38B36] font-bold uppercase tracking-wider">{activeBooking.bookingStatus}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    // Navigate to account order/bookings page
                    onClose();
                    window.location.href = `/my-orders`;
                  }}
                  className="w-full py-3.5 bg-[#3C2A21] text-white rounded-full text-xs tracking-widest font-bold uppercase hover:bg-[#B38B36] transition-all"
                >
                  View My Bookings
                </button>
                <button
                  onClick={() => handleCancelBooking(activeBooking.bookingId)}
                  className="w-full py-3.5 border border-red-200 text-red-600 rounded-full text-xs tracking-widest font-bold uppercase hover:bg-red-50 transition-all"
                >
                  Cancel Booking (Release Slot)
                </button>
              </div>
            </div>
          )}

        </div>

      </motion.div>

    </div>
  );
};

export default CalculatorBookingModal;
