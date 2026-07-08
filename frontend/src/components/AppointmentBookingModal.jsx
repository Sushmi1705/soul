import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  MessageSquare, 
  Phone, 
  Video, 
  MapPin, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Mail, 
  Globe, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Loader2, 
  Sparkles, 
  CreditCard,
  Download,
  AlertTriangle
} from "lucide-react";
import { BookingService, AvailabilityService, PaymentService } from "@/services/bookingServices";
import { ConsultationStatusService } from "@/services/consultationStatusService";

const STEPS = [
  { label: "Details", desc: "Customer Info" },
  { label: "Schedule", desc: "Date & Time" },
  { label: "Consultation", desc: "Mode & Pricing" },
  { label: "Payment", desc: "Checkout" },
  { label: "Success", desc: "Confirmed" }
];

const CONSULTATION_MODES = [
  {
    id: "chat",
    icon: MessageSquare,
    title: "Chat Consultation",
    duration: "30 Minutes",
    price: 999,
    desc: "Real-time query resolution and transit insights over secure chat."
  },
  {
    id: "voice",
    icon: Phone,
    title: "Voice Call",
    duration: "30 Minutes",
    price: 1499,
    desc: "Direct telephonic conversation with Gitika Sharma for birth chart overview."
  },
  {
    id: "video",
    icon: Video,
    title: "Video Consultation",
    duration: "45 Minutes",
    price: 1999,
    desc: "High-focus video session on Google Meet including screen share of charts.",
    badge: "Google Meet Included"
  },
  {
    id: "in-person",
    icon: MapPin,
    title: "In-Person Consultation",
    duration: "60 Minutes",
    price: 3999,
    desc: "Face-to-face consultation at our luxury cosmic healing chamber.",
    badge: "Premium Vastu chamber"
  }
];

const AppointmentBookingModal = ({ open, onClose, onBookingSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: Customer details
  const [details, setDetails] = useState({
    name: "",
    phone: "",
    email: "",
    country: "",
    notes: ""
  });
  
  // Step 2: Date & Time selection
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  
  // Step 3: Consultation Mode selection
  const [selectedMode, setSelectedMode] = useState("video");
  
  // Step 4: Checkout & Payment states
  const [paymentGateway, setPaymentGateway] = useState("razorpay"); // 'razorpay' | 'stripe' | 'phonepe'
  const [paymentStatus, setPaymentStatus] = useState("idle"); // 'idle' | 'processing' | 'success' | 'failed' | 'cancelled'
  const [errorMsg, setErrorMsg] = useState("");
  
  // Step 5: Booking Result
  const [bookingResult, setBookingResult] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Auto-fill client details from localStorage or parent context if available
  useEffect(() => {
    if (open) {
      setCurrentStep(1);
      setPaymentStatus("idle");
      setErrorMsg("");
      setBookingResult(null);
      
      // Attempt to load from localStorage or session
      try {
        const storedName = localStorage.getItem("seeker_name") || localStorage.getItem("astro_seeker_name") || "";
        const storedEmail = localStorage.getItem("seeker_email") || localStorage.getItem("astro_seeker_email") || "";
        const storedPhone = localStorage.getItem("seeker_phone") || "";
        setDetails({
          name: storedName,
          email: storedEmail,
          phone: storedPhone,
          country: "",
          notes: ""
        });
      } catch (e) {
        console.warn("Storage access not supported.");
      }
    }
  }, [open]);

  useEffect(() => {
    if (paymentStatus === "processing") {
      document.body.style.pointerEvents = "auto";
      document.documentElement.style.pointerEvents = "auto";
      
      const styleEl = document.createElement("style");
      styleEl.id = "razorpay-pointer-events-override-appointment";
      styleEl.innerHTML = `
        body, html, [data-radix-focus-guard] {
          pointer-events: auto !important;
        }
      `;
      document.head.appendChild(styleEl);
      
      return () => {
        const el = document.getElementById("razorpay-pointer-events-override-appointment");
        if (el) el.remove();
        document.body.style.removeProperty("pointer-events");
        document.documentElement.style.removeProperty("pointer-events");
      };
    }
  }, [paymentStatus]);

  // Refresh available time slots when date changes
  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([]);
      return;
    }
    
    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const slots = await AvailabilityService.getAvailableSlotsForDate(selectedDate);
        setAvailableSlots(slots);
        // Reset selected slot if it's no longer available
        if (selectedSlot && !slots.find(s => s.time === selectedSlot && s.isAvailable)) {
          setSelectedSlot(null);
        }
      } catch (err) {
        toast.error("Failed to load available time slots.");
      } finally {
        setLoadingSlots(false);
      }
    };
    
    fetchSlots();
  }, [selectedDate]);

  // Phone Validation helper
  const isPhoneValid = (phone) => {
    return /^\+?[1-9]\d{1,14}$/.test(phone.replace(/[\s\-()]/g, "")) && phone.replace(/[\s\-()]/g, "").length >= 10;
  };

  // Email Validation helper
  const isEmailValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isStep1Valid = details.name.trim() !== "" && isPhoneValid(details.phone) && isEmailValid(details.email);

  const getTax = (price) => Math.round(price * 0.18);
  const getTotal = (price) => price + getTax(price);

  const activeModeDetails = CONSULTATION_MODES.find(m => m.id === selectedMode);
  const basePrice = activeModeDetails ? activeModeDetails.price : 0;
  const totalAmount = getTotal(basePrice);

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!isStep1Valid) {
        toast.error("Please fill in all mandatory customer details accurately.");
        return;
      }
      const existingBooking = ConsultationStatusService.getBookingByPhone(details.phone);
      if (existingBooking && (
        existingBooking.calculatedStatus === "Upcoming" ||
        existingBooking.calculatedStatus === "Today's Meeting" ||
        existingBooking.calculatedStatus === "Live Now"
      )) {
        toast.info("Active booking detected for this phone number.");
        localStorage.setItem("seeker_phone", details.phone);
        localStorage.setItem("active_booking", JSON.stringify(existingBooking));
        if (onBookingSuccess) {
          onBookingSuccess(existingBooking);
        }
        onClose();
        return;
      }
    }
    if (currentStep === 2 && (!selectedDate || !selectedSlot)) {
      toast.error("Please choose a date and select an available time slot.");
      return;
    }
    if (currentStep === 3 && !selectedMode) {
      toast.error("Please select a consultation type.");
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    if (paymentStatus === "processing") return; // Block going back during active pay simulation
    setCurrentStep(prev => prev - 1);
    // Reset payment states if backing out of step 4
    if (currentStep === 4) {
      setPaymentStatus("idle");
    }
  };

  const handlePayment = async () => {
    setPaymentStatus("processing");
    setErrorMsg("");
    
    try {
      // 1. Safely load the Razorpay SDK
      await PaymentService.loadRazorpaySDK();
      
      // 2. Contact backend to create a real Razorpay Order
      const orderDetails = await PaymentService.createOrder(
        selectedMode,
        selectedDate,
        selectedSlot
      );
      
      // 3. Configure the official Razorpay Checkout Options
      const options = {
        key: orderDetails.key_id,
        amount: orderDetails.amount,
        currency: orderDetails.currency,
        name: "Astro Power 24",
        description: `Consultation with Gitika Sharma (${selectedMode})`,
        order_id: orderDetails.order_id,
        prefill: {
          name: details.name,
          email: details.email,
          contact: details.phone
        },
        theme: {
          color: "#B38B36"
        },
        handler: async (response) => {
          // Triggered on successful payment authorization by Razorpay popup
          setBookingLoading(true);
          try {
            const bookingPayload = {
              name: details.name,
              phone: details.phone,
              email: details.email,
              country: details.country || "IN",
              notes: details.notes || "",
              date: selectedDate.toISOString().split("T")[0],
              slot: selectedSlot,
              consultationType: selectedMode,
              amount: totalAmount,
              price: basePrice,
              tax: getTax(basePrice),
              transactionId: response.razorpay_payment_id,
              total: totalAmount
            };
            const paymentPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            };
            
            // Call the backend confirm endpoint to verify signature & write database record
            const result = await PaymentService.confirmBooking(bookingPayload, paymentPayload);
            setBookingResult(result);
            setPaymentStatus("success");
            setCurrentStep(5);
            toast.success("Consultation booked successfully!");
            
            // Persist confirmed booking state locally for reactive status card updates
            localStorage.setItem("seeker_phone", bookingPayload.phone);
            localStorage.setItem("active_booking", JSON.stringify(result));
            if (onBookingSuccess) {
              onBookingSuccess(result);
            }
          } catch (err) {
            setPaymentStatus("failed");
            setErrorMsg(err.message || "Payment verification failed. Please contact support.");
            toast.error("Payment verification failed.");
          } finally {
            setBookingLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            // Triggered when user cancels payment by closing the checkout window
            setPaymentStatus("cancelled");
            setErrorMsg("Payment was cancelled. Your appointment has not been booked.");
            toast.error("Payment was cancelled.");
          }
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        // Triggered on actual authorization failure (e.g. invalid OTP, insufficient funds)
        setPaymentStatus("failed");
        setErrorMsg(resp.error.description || "The checkout call timed out or failed. Please retry.");
        toast.error("Payment failed. Please retry.");
      });
      rzp.open();
      
    } catch (err) {
      setPaymentStatus("failed");
      setErrorMsg(err.message || "Failed to initialize secure payment session. Please check your network.");
      toast.error(err.message || "Failed to initialize payment.");
    }
  };

  // Download receipt as text file attachment
  const handleDownloadReceipt = () => {
    if (!bookingResult) return;
    
    const receiptContent = `
=============================================
           ASTROPOWER24 CONSULTATION RECEIPT
=============================================
Booking ID:        ${bookingResult.bookingId}
Transaction ID:    ${bookingResult.transactionId}
Client Name:       ${bookingResult.name}
Email Address:     ${bookingResult.email}
Phone Number:      ${bookingResult.phone}
Country:           ${bookingResult.country || "Not provided"}

--- APPOINTMENT DETAILS ---
Consultation Mode: ${activeModeDetails.title}
Date:              ${new Date(bookingResult.date).toDateString()}
Time Slot:         ${bookingResult.slot}
Duration:          ${activeModeDetails.duration}
Meet Link:         ${bookingResult.meetLink || "Sent via Email/WhatsApp"}

--- INVOICE CHARGES ---
Base Price:        ₹${bookingResult.price}
Taxes (GST 18%):   ₹${bookingResult.tax}
Total Amount Paid: ₹${bookingResult.total}

Thank you for choosing AstroPower24.
Professional Vedic Astrology consultation by Gitika Sharma.
=============================================
`;
    
    const blob = new Blob([receiptContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Receipt_${bookingResult.bookingId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-4xl p-0 bg-[#FDFBF7] border border-[#E5E1D8] text-[#3C2A21] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[95dvh] md:h-[680px]">
        <DialogTitle className="sr-only">Gitika Sharma Appointment Booking Flow</DialogTitle>
        <DialogDescription className="sr-only">
          Multi-step interactive client booking dialog for scheduling voice, video, or in-person sessions.
        </DialogDescription>
        
        {/* Left Side: Step Guide / Branding */}
        <aside className="w-full md:w-[280px] bg-[#1C120C] text-white p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#B38B36]/15 shrink-0">
          <div>
            <div className="flex items-center gap-1 text-[9px] tracking-[0.3em] uppercase text-[#E5C06A] font-black mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vedic Advisory</span>
            </div>
            
            <div className="space-y-1 mb-8">
              <h3 className="font-serif text-xl tracking-wide leading-tight">Gitika Sharma</h3>
              <p className="text-[10px] text-stone-400 tracking-wider">Evolutionary Astrologer & Advisor</p>
            </div>

            {/* Stepper Progress bar */}
            <div className="space-y-5">
              {STEPS.map((step, idx) => {
                const stepNum = idx + 1;
                const isActive = currentStep === stepNum;
                const isCompleted = currentStep > stepNum;
                
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-300 ${
                      isCompleted 
                        ? "bg-[#B38B36] border-[#B38B36] text-white"
                        : isActive
                        ? "border-[#E5C06A] text-[#E5C06A] shadow-[0_0_10px_rgba(229,192,106,0.2)]"
                        : "border-stone-700 text-stone-500"
                    }`}>
                      {isCompleted ? "✓" : stepNum}
                    </div>
                    <div className="text-left">
                      <p className={`text-[10px] uppercase tracking-widest font-black leading-tight ${isActive ? "text-[#E5C06A]" : isCompleted ? "text-stone-300" : "text-stone-500"}`}>
                        {step.label}
                      </p>
                      <p className="text-[8px] text-stone-500 font-light mt-0.5 leading-none">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-[9px] text-stone-500 tracking-wide border-t border-stone-800/60 pt-4 mt-6">
            Confidential Session • Reschedule window up to 24 hrs prior
          </div>
        </aside>

        {/* Right Side: Step Content Area */}
        <div className="flex-1 flex flex-col justify-between overflow-hidden bg-[#FFFDF9] relative">
          
          {/* Close trigger absolute */}
          <button 
            type="button"
            onClick={onClose} 
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 transition-colors z-20 cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Golden glow watermark overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(229,192,106,0.06),transparent_60%)] pointer-events-none z-0" />
          
          <div className="flex-1 overflow-y-auto p-6 md:p-8 z-10">
            {/* STEP 1: Customer Details */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
                <div className="space-y-1.5 mb-2">
                  <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-[#8E6B23]">Information Gathering</span>
                  <h4 className="font-serif text-2xl text-[#3C2A21] font-bold">Personal Consultation Request</h4>
                  <p className="text-[11px] text-stone-600 font-light leading-relaxed">Enter your contact details. This ensures calendar invitations, confirmation receipts, and video consultation coordinates sync successfully.</p>
                </div>

                <div className="space-y-4 pt-2">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase tracking-[0.2em] font-extrabold text-[#8E6B23] font-sans">Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#B38B36]" />
                      <Input
                        required
                        placeholder="John Doe"
                        value={details.name}
                        onChange={(e) => setDetails({ ...details, name: e.target.value })}
                        className="pl-9 h-11 bg-[#FCFAF2]/30 border-[#B38B36]/25 focus-visible:ring-[#E5C06A] focus-visible:border-[#E5C06A] text-xs rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Contact Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-[0.2em] font-extrabold text-[#8E6B23] font-sans">Phone Number *</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#B38B36]" />
                        <Input
                          required
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={details.phone}
                          onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                          className={`pl-9 h-11 bg-[#FCFAF2]/30 border-[#B38B36]/25 focus-visible:ring-[#E5C06A] focus-visible:border-[#E5C06A] text-xs rounded-xl ${
                            details.phone && !isPhoneValid(details.phone) ? "border-red-400" : ""
                          }`}
                        />
                      </div>
                      {details.phone && !isPhoneValid(details.phone) && (
                        <p className="text-[9px] text-red-500 font-light mt-0.5">Please specify a numeric string (8-15 digits).</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-[0.2em] font-extrabold text-[#8E6B23] font-sans">Email Address *</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#B38B36]" />
                        <Input
                          required
                          type="email"
                          placeholder="johndoe@email.com"
                          value={details.email}
                          onChange={(e) => setDetails({ ...details, email: e.target.value })}
                          className={`pl-9 h-11 bg-[#FCFAF2]/30 border-[#B38B36]/25 focus-visible:ring-[#E5C06A] focus-visible:border-[#E5C06A] text-xs rounded-xl ${
                            details.email && !isEmailValid(details.email) ? "border-red-400" : ""
                          }`}
                        />
                      </div>
                      {details.email && !isEmailValid(details.email) && (
                        <p className="text-[9px] text-red-500 font-light mt-0.5">Please input a valid email address structure.</p>
                      )}
                    </div>
                  </div>

                  {/* Country Optional */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase tracking-[0.2em] font-extrabold text-[#8E6B23] font-sans">Country (Optional)</label>
                    <div className="relative">
                      <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#B38B36]" />
                      <Input
                        placeholder="India"
                        value={details.country}
                        onChange={(e) => setDetails({ ...details, country: e.target.value })}
                        className="pl-9 h-11 bg-[#FCFAF2]/30 border-[#B38B36]/25 focus-visible:ring-[#E5C06A] focus-visible:border-[#E5C06A] text-xs rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Notes Optional */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase tracking-[0.2em] font-extrabold text-[#8E6B23] font-sans">Special Notes / Questions (Optional)</label>
                    <div className="relative">
                      <FileText className="w-4 h-4 absolute left-3 top-3 text-[#B38B36]" />
                      <textarea
                        rows="2"
                        placeholder="Mention any critical areas you'd like Gitika to focus on during your session..."
                        value={details.notes}
                        onChange={(e) => setDetails({ ...details, notes: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 bg-[#FCFAF2]/30 border border-[#B38B36]/25 focus:ring-1 focus:ring-[#E5C06A] focus:border-[#E5C06A] outline-none text-xs rounded-xl min-h-[50px] font-sans"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Choose Date & Time */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                <div className="space-y-1 mb-2">
                  <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-[#8E6B23]">Temporal Window</span>
                  <h4 className="font-serif text-2xl text-[#3C2A21] font-bold">Select Date & Time</h4>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1 items-start">
                  {/* Calendar Widget */}
                  <div className="lg:col-span-7 flex flex-col items-center">
                    <div className="rounded-2xl border border-[#B38B36]/20 bg-white p-3 shadow-sm inline-block scale-95 origin-top">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                      />
                    </div>
                  </div>

                  {/* Slots List */}
                  <div className="lg:col-span-5 space-y-3">
                    <span className="text-[9px] uppercase tracking-[0.25em] font-extrabold text-[#8E6B23] block">Available Slots</span>
                    
                    {!selectedDate ? (
                      <div className="p-8 border border-dashed border-[#B38B36]/20 rounded-2xl text-center bg-[#FCFAF2]/20">
                        <CalendarIcon className="w-5 h-5 text-[#B38B36]/60 mx-auto mb-2" />
                        <p className="text-[10px] text-stone-500 italic font-light">Please select a date on the calendar first.</p>
                      </div>
                    ) : loadingSlots ? (
                      <div className="py-12 flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-[#B38B36]" />
                        <span className="text-[9px] uppercase tracking-widest text-[#B38B36] font-bold">Scanning availability...</span>
                      </div>
                    ) : availableSlots.length === 0 ? (
                      <div className="p-8 border border-dashed border-[#B38B36]/20 rounded-2xl text-center bg-red-50/20">
                        <AlertCircle className="w-5 h-5 text-red-400 mx-auto mb-2" />
                        <p className="text-[10px] text-red-700 italic font-light">No consultation slots available for this day. Gitika is fully booked or closed.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1 custom-scroll">
                        {availableSlots.map((slot, idx) => (
                          <button
                            key={idx}
                            type="button"
                            disabled={!slot.isAvailable}
                            onClick={() => setSelectedSlot(slot.time)}
                            className={`px-3 py-2.5 rounded-xl text-[10px] border transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                              !slot.isAvailable
                                ? "border-[#E5E1D8] text-stone-400 line-through bg-[#F3F1EC] cursor-not-allowed opacity-65"
                                : selectedSlot === slot.time
                                ? "bg-gradient-to-b from-[#B38B36] to-[#8E6B23] text-white border-white shadow-md font-bold scale-102"
                                : "border-[#B38B36]/20 text-[#3C2A21] bg-white hover:border-[#B38B36] hover:text-[#8E6B23] hover:scale-102"
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            <span>{slot.time}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Choose Consultation Mode */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                <div className="space-y-1 mb-2">
                  <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-[#8E6B23]">Exchange Parameters</span>
                  <h4 className="font-serif text-2xl text-[#3C2A21] font-bold">Consultation Medium</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1 custom-scroll">
                  {CONSULTATION_MODES.map((mode) => {
                    const ModeIcon = mode.icon;
                    const isSelected = selectedMode === mode.id;
                    
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setSelectedMode(mode.id)}
                        className={`p-4 border text-left rounded-xl transition-all duration-300 flex flex-col justify-between relative cursor-pointer group ${
                          isSelected
                            ? "border-[#B38B36] bg-[#B38B36]/5 shadow-[0_4px_15px_rgba(179,139,54,0.1)] scale-101"
                            : "border-[#E5E1D8] hover:border-[#B38B36]/40 bg-white"
                        }`}
                      >
                        {mode.badge && (
                          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full border border-[#B38B36]/30 bg-[#B38B36]/5 text-[7px] font-black uppercase tracking-wider text-[#8E6B23]">
                            {mode.badge}
                          </span>
                        )}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
                              isSelected ? "bg-[#B38B36] border-white text-white" : "bg-[#FDFBF7] border-[#B38B36]/25 text-[#B38B36] group-hover:bg-[#B38B36]/10"
                            }`}>
                              <ModeIcon className="w-4 h-4 shrink-0" />
                            </div>
                            <span className="font-serif font-bold text-sm text-[#3C2A21]">{mode.title}</span>
                          </div>
                          <p className="text-[9px] text-stone-500 font-light leading-normal pr-12">{mode.desc}</p>
                        </div>
                        <div className="flex items-baseline justify-between mt-4 border-t border-[#B38B36]/10 pt-3 w-full">
                          <span className="text-[8px] uppercase tracking-widest text-[#8E6B23] font-bold">{mode.duration}</span>
                          <span className="font-serif text-sm font-bold text-[#8E6B23]">₹{mode.price}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Pricing Calculation bar */}
                <div className="bg-[#FCFAF2]/60 border border-[#B38B36]/15 rounded-xl p-3.5 flex items-center justify-between text-xs font-semibold">
                  <span className="text-stone-700">GST Registration (18% inclusive)</span>
                  <span className="text-[#8E6B23] font-bold">Total consultation amount: ₹{totalAmount}</span>
                </div>
              </div>
            )}

            {/* STEP 4: Summary & Payment */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                <div className="space-y-1 mb-2">
                  <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-[#8E6B23]">Financial Transaction</span>
                  <h4 className="font-serif text-2xl text-[#3C2A21] font-bold">Booking Summary</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-1 items-start">
                  {/* Summary Card */}
                  <div className="md:col-span-6 bg-white border border-[#B38B36]/20 rounded-2xl p-4 space-y-3.5 shadow-sm text-xs relative">
                    <span className="text-[8px] uppercase tracking-widest text-[#B38B36] font-bold border-b border-[#B38B36]/15 pb-1.5 block">Review Details</span>
                    
                    <div className="grid grid-cols-2 gap-y-3 text-[10px] leading-relaxed">
                      <div>
                        <span className="text-stone-400 uppercase tracking-wider text-[8px] block">Seeker Name</span>
                        <span className="font-bold text-[#3C2A21]">{details.name}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 uppercase tracking-wider text-[8px] block">Contact Phone</span>
                        <span className="font-bold text-[#3C2A21]">{details.phone}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 uppercase tracking-wider text-[8px] block">Date</span>
                        <span className="font-bold text-[#8E6B23]">{selectedDate?.toDateString()}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 uppercase tracking-wider text-[8px] block">Time Slot</span>
                        <span className="font-bold text-[#8E6B23]">{selectedSlot}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-stone-400 uppercase tracking-wider text-[8px] block">Consultation Type</span>
                        <span className="font-bold text-[#3C2A21]">{activeModeDetails?.title} ({activeModeDetails?.duration})</span>
                      </div>
                    </div>

                    <div className="border-t border-[#B38B36]/15 pt-2.5 space-y-1.5 text-[10px] font-medium text-stone-700">
                      <div className="flex justify-between">
                        <span>Base Rate:</span>
                        <span>₹{basePrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GST (18%):</span>
                        <span>₹{getTax(basePrice)}</span>
                      </div>
                      <div className="flex justify-between border-t border-[#B38B36]/10 pt-1.5 text-xs font-bold text-[#8E6B23]">
                        <span>Grand Total:</span>
                        <span>₹{totalAmount}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3.5 p-3 bg-stone-50 border border-stone-200/60 rounded-xl text-[9px] text-stone-500 leading-normal">
                      <span className="font-bold text-stone-600 block mb-1">Cancellation Policy</span>
                      <p className="mb-1">• <span className="font-medium text-stone-700">Customer Cancellation:</span> No refund is eligible.</p>
                      <p>• <span className="font-medium text-stone-700">Astrologer Cancellation:</span> 100% full refund processed within 24 hours.</p>
                    </div>
                  </div>
                        {/* Payment Gateway Option Selector */}
                  <div className="md:col-span-6 space-y-4">
                    {paymentStatus === "idle" || paymentStatus === "failed" || paymentStatus === "cancelled" ? (
                      <>
                        <span className="text-[9px] uppercase tracking-widest text-[#B38B36] font-bold block">Payment Method</span>
                        
                        <div className="p-4 border border-[#B38B36]/30 bg-[#B38B36]/5 rounded-xl flex items-center justify-between shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#B38B36]" />
                            <span className="text-xs font-bold text-[#3C2A21] uppercase tracking-wider">Razorpay Secure Checkout</span>
                          </div>
                          <span className="text-[10px] font-black uppercase text-[#8E6B23] tracking-widest bg-white border border-[#B38B36]/25 px-2 py-0.5 rounded-md">✓ Selected</span>
                        </div>

                        {paymentStatus === "failed" && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-[10px] flex gap-2 items-start animate-fadeIn">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                            <div>
                              <p className="font-bold">Transaction Failed</p>
                              <p className="font-light text-red-700 mt-0.5">{errorMsg || "The checkout call timed out or failed. Please retry."}</p>
                            </div>
                          </div>
                        )}

                        {paymentStatus === "cancelled" && (
                          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[10px] flex gap-2 items-start animate-fadeIn">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                            <div>
                              <p className="font-bold">Transaction Cancelled</p>
                              <p className="font-light text-amber-700 mt-0.5">{errorMsg || "Payment was cancelled. Your appointment has not been booked."}</p>
                            </div>
                          </div>
                        )}

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={handlePayment}
                            disabled={paymentStatus === "processing"}
                            className="w-full py-4 bg-gradient-to-r from-[#B38B36] to-[#8E6B23] hover:from-[#8E6B23] hover:to-[#725D46] text-white text-[10px] font-bold tracking-widest uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border border-[#B38B36]/35 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <CreditCard className="w-4 h-4" />
                            <span>Proceed to Secure Payment</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
                        <Loader2 className="w-10 h-10 animate-spin text-[#B38B36]" />
                        <div className="space-y-1">
                          <p className="text-xs font-bold uppercase tracking-wider text-[#8E6B23]">Processing Checkout</p>
                          <p className="text-[10px] text-stone-500 font-light">Opening secure payment gateway. Please complete the transaction in the popup window.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Booking Success */}
            {currentStep === 5 && bookingResult && (
              <div className="space-y-5 py-2 animate-[fadeIn_0.4s_ease-out] text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#B38B36]/10 border border-[#B38B36]/30 flex items-center justify-center mb-1.5 text-[#B38B36] relative shadow-inner">
                  <div className="w-16 h-16 rounded-full bg-[#B38B36]/5 absolute animate-ping" />
                  <CheckCircle2 className="w-8 h-8 text-[#B38B36] relative z-10" />
                </div>
                
                <div className="space-y-1">
                  <span className="text-[9px] tracking-[0.35em] uppercase font-bold text-[#8E6B23]">Destiny Aligned</span>
                  <h4 className="font-serif text-3xl text-[#3C2A21] font-bold">Booking Confirmed!</h4>
                  <p className="text-xs text-stone-600 font-light max-w-md mx-auto leading-relaxed">
                    Your appointment has been registered successfully. Simulated confirmations have been sent via WhatsApp and Email. Google Calendar slots are synced.
                  </p>
                </div>

                <div className="bg-white border border-[#B38B36]/25 rounded-2xl p-4 w-full max-w-md space-y-3.5 shadow-sm text-left text-xs leading-normal mt-2.5 relative">
                  <div className="absolute inset-1.5 border border-[#B38B36]/10 rounded-xl pointer-events-none" />
                  
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[10px]">
                    <div>
                      <span className="text-stone-400 uppercase tracking-wider text-[8px] block">Booking ID</span>
                      <span className="font-bold text-[#8E6B23] tracking-wide">{bookingResult.bookingId}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 uppercase tracking-wider text-[8px] block">Customer Name</span>
                      <span className="font-bold text-stone-700">{bookingResult.name}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 uppercase tracking-wider text-[8px] block">Consultation Type</span>
                      <span className="font-bold text-stone-700">{activeModeDetails?.title}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 uppercase tracking-wider text-[8px] block">Date</span>
                      <span className="font-bold text-stone-700">{new Date(bookingResult.date).toDateString()}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 uppercase tracking-wider text-[8px] block">Time</span>
                      <span className="font-bold text-[#8E6B23]">{bookingResult.slot}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 uppercase tracking-wider text-[8px] block">Amount Paid</span>
                      <span className="font-bold text-[#8E6B23]">₹{bookingResult.amount}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-stone-400 uppercase tracking-wider text-[8px] block">Razorpay Payment ID</span>
                      <span className="font-mono text-[9px] font-bold text-stone-700">{bookingResult.payment_info?.razorpay_payment_id || bookingResult.transactionId}</span>
                    </div>
                    {bookingResult.meetLink && (
                      <div className="col-span-2">
                        <span className="text-stone-400 uppercase tracking-wider text-[8px] block">Google Meet Invitation</span>
                        <a 
                          href={bookingResult.meetLink} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="font-bold text-[#8E6B23] underline break-all hover:text-[#B38B36] transition-colors"
                        >
                          {bookingResult.meetLink}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3.5 w-full max-w-xs pt-3 z-10 relative">
                  <button
                    type="button"
                    onClick={handleDownloadReceipt}
                    className="flex-1 py-3 px-4 bg-white border border-[#B38B36]/35 text-[#8E6B23] hover:text-[#3C2A21] hover:border-[#B38B36] hover:bg-[#B38B36]/5 text-[10px] tracking-widest uppercase font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Receipt</span>
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-[#B38B36] to-[#8E6B23] hover:from-[#8E6B23] hover:to-[#725D46] text-white text-[10px] tracking-widest uppercase font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer border border-[#B38B36]/25"
                  >
                    <span>Back to Report</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Stepper Buttons Footer */}
          {currentStep < 5 && (
            <footer className="border-t border-[#E5E1D8] bg-[#FCFAF2]/30 p-4 px-6 md:px-8 flex justify-between items-center z-10 shrink-0">
              <button
                type="button"
                disabled={currentStep === 1 || paymentStatus === "processing"}
                onClick={handlePrevStep}
                className="py-2.5 px-4 border border-stone-300 hover:border-stone-500 text-stone-600 hover:text-stone-800 text-[10px] font-bold tracking-wider uppercase rounded-xl transition-all duration-300 flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  disabled={currentStep === 1 ? !isStep1Valid : currentStep === 2 ? (!selectedDate || !selectedSlot) : false}
                  onClick={handleNextStep}
                  className="py-2.5 px-5 bg-gradient-to-r from-[#B38B36] to-[#8E6B23] hover:from-[#8E6B23] hover:to-[#725D46] text-white text-[10px] font-bold tracking-widest uppercase rounded-xl transition-all duration-300 flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-[#B38B36]/20"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="text-[10px] uppercase tracking-widest font-black text-[#8E6B23]">Checkout Phase</span>
              )}
            </footer>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentBookingModal;
