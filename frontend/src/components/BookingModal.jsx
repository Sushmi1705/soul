import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  CheckCircle2, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Video, 
  MessageSquare, 
  MapPin, 
  Sparkles, 
  CalendarCheck2, 
  Building, 
  ShieldCheck,
  Loader2
} from "lucide-react";
import { getAvailableSlots, formatINR, CONSULTATION_TYPES, VASTU_TYPES } from "@/data/content";
import { ServiceBookingService } from "@/services/serviceBookingServices";
import { PaymentService } from "@/services/bookingServices";

const BookingModal = ({ service, open, onClose }) => {
  const [date, setDate] = useState(null);
  const [slot, setSlot] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [confirmed, setConfirmed] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState(null);

  const [consultationType, setConsultationType] = useState("normal"); // 'normal' | 'urgent'
  const [vastuType, setVastuType] = useState("domestic"); // 'domestic' | 'industrial'
  const [vastuRangeIndex, setVastuRangeIndex] = useState(0);

  const [selectedMode, setSelectedMode] = useState("video"); // 'video' | 'voice' | 'chat' | 'in-person'
  const [paymentStatus, setPaymentStatus] = useState("idle"); // 'idle' | 'processing' | 'success' | 'failed'

  useEffect(() => {
    if (open) {
      setDate(null);
      setSlot(null);
      setConfirmed(false);
      setConfirmedBookingData(null);
      setConsultationType("normal");
      setVastuType("domestic");
      setVastuRangeIndex(0);
      setSelectedMode("video");
      setPaymentStatus("idle");

      // Auto-fill customer details from search or local storage
      const storedName = localStorage.getItem("seeker_name") || "";
      const storedEmail = localStorage.getItem("seeker_email") || "";
      const storedPhone = localStorage.getItem("seeker_phone") || "";
      setForm({
        name: storedName,
        email: storedEmail,
        phone: storedPhone
      });
    }
  }, [open]);

  useEffect(() => {
    if (paymentStatus === "processing") {
      document.body.style.pointerEvents = "auto";
      document.documentElement.style.pointerEvents = "auto";
      
      const styleEl = document.createElement("style");
      styleEl.id = "razorpay-pointer-events-override";
      styleEl.innerHTML = `
        body, html, [data-radix-focus-guard] {
          pointer-events: auto !important;
        }
      `;
      document.head.appendChild(styleEl);
      
      return () => {
        const el = document.getElementById("razorpay-pointer-events-override");
        if (el) el.remove();
        document.body.style.removeProperty("pointer-events");
        document.documentElement.style.removeProperty("pointer-events");
      };
    }
  }, [paymentStatus]);

  if (!service) return null;

  const isVastu = service.id === "vastu-consultation";

  let currentPrice = service.price;
  let serviceDesc = service.desc;

  if (isVastu) {
    const rangeObj = VASTU_TYPES[vastuType].ranges[vastuRangeIndex];
    currentPrice = rangeObj.price;
    serviceDesc = `${service.desc} (Vastu Type: ${VASTU_TYPES[vastuType].label}, Size: ${rangeObj.area})`;
  } else {
    currentPrice = CONSULTATION_TYPES[consultationType].price;
    serviceDesc = `${service.desc} (${CONSULTATION_TYPES[consultationType].label} - ${CONSULTATION_TYPES[consultationType].wait})`;
  }

  const availableSlots = date ? getAvailableSlots(date) : [];
  const allSlots = ["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "03:30 PM", "05:00 PM", "06:30 PM"];

  // Computed existing booking detection
  const seekerPhone = localStorage.getItem("seeker_phone") || "";
  const activeBookingToShow = ServiceBookingService.getActiveBooking(service.id, form.phone || seekerPhone);

  const handleConfirm = async () => {
    if (!date || !slot) {
      toast.error("Please select a date and time slot.");
      return;
    }
    if (!form.name || !form.email) {
      toast.error("Please enter your name and email.");
      return;
    }
    if (!form.phone || form.phone.length < 10) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    // Secondary duplicate prevention check
    const activeBooking = ServiceBookingService.getActiveBooking(service.id, form.phone);
    if (activeBooking) {
      toast.info("An active booking for this service already exists for this phone number.");
      localStorage.setItem("seeker_phone", form.phone);
      return;
    }

    setPaymentStatus("processing");

    try {
      // 1. Safely load the Razorpay SDK
      await PaymentService.loadRazorpaySDK();

      // 2. Call backend order generation (reusing existing API to get valid order details)
      const orderDetails = await PaymentService.createOrder(
        selectedMode,
        date,
        slot
      );

      // 3. Configure Razorpay checkout
      const options = {
        key: orderDetails.key_id,
        amount: currentPrice * 100, // Correct price for selected service tier in paise
        currency: "INR",
        name: "Astro Power 24",
        description: `Booking for ${service.title} (${selectedMode})`,
        order_id: orderDetails.order_id,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone
        },
        theme: {
          color: "#B38B36"
        },
        handler: async (response) => {
          try {
            const bookingPayload = {
              serviceId: service.id,
              serviceName: service.title,
              name: form.name,
              phone: form.phone,
              email: form.email,
              consultationMode: selectedMode,
              appointmentDate: date.toISOString().split("T")[0],
              timeSlot: slot,
              amount: currentPrice
            };

            const paymentPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            };

            const confirmedBooking = ServiceBookingService.confirmServiceBooking(bookingPayload, paymentPayload);
            setConfirmedBookingData(confirmedBooking);
            setConfirmed(true);
            setPaymentStatus("success");
            toast.success("Service booked successfully!");
          } catch (err) {
            setPaymentStatus("failed");
            toast.error("Payment confirmation failed.");
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentStatus("idle");
            toast.error("Payment was cancelled.");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        setPaymentStatus("failed");
        toast.error("Payment failed. Please retry.");
      });
      rzp.open();

    } catch (err) {
      setPaymentStatus("failed");
      toast.error(err.message || "Failed to initialize payment gateway.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-testid="booking-modal"
        className="max-w-5xl p-0 bg-[#FDFBF7] border border-[#E5E1D8] overflow-hidden rounded-none sm:rounded-2xl w-screen h-[100dvh] sm:h-auto sm:w-full max-h-[100dvh] sm:max-h-[90vh]"
      >
        <DialogTitle className="sr-only">Book {service.title}</DialogTitle>
        <DialogDescription className="sr-only">
          Select a date, time slot and enter your details to confirm the appointment.
        </DialogDescription>

        {activeBookingToShow ? (
          /* Return Customer: Display Active Booking Info */
          <div className="p-8 md:p-16 text-center flex flex-col items-center max-w-xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#B38B36]/10 border border-[#B38B36]/30 flex items-center justify-center">
              <CalendarCheck2 className="w-8 h-8 text-[#B38B36]" />
            </div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#B38B36] font-bold">
              Booking Active
            </div>
            <h3 className="font-serif text-2xl md:text-3xl text-[#3C2A21]">
              Active Booking Detected
            </h3>
            <p className="text-[#3C2A21]/70 text-xs md:text-sm">
              You already have an active reservation for this cosmic service. Duplicate bookings are not allowed.
            </p>

            <div className="w-full bg-[#3C2A21]/5 border border-[#E5E1D8] rounded-2xl p-6 text-left space-y-3">
              <div className="flex justify-between text-xs border-b border-[#E5E1D8]/60 pb-2">
                <span className="text-[#3C2A21]/50 font-bold uppercase tracking-wider">Booking ID</span>
                <span className="font-mono font-bold text-[#3C2A21]">{activeBookingToShow.bookingId}</span>
              </div>
              <div className="flex justify-between text-xs border-b border-[#E5E1D8]/60 pb-2">
                <span className="text-[#3C2A21]/50 font-bold uppercase tracking-wider">Service Name</span>
                <span className="font-bold text-[#3C2A21]">{activeBookingToShow.serviceName}</span>
              </div>
              <div className="flex justify-between text-xs border-b border-[#E5E1D8]/60 pb-2">
                <span className="text-[#3C2A21]/50 font-bold uppercase tracking-wider">Appointment Date</span>
                <span className="font-bold text-[#3C2A21]">{new Date(activeBookingToShow.appointmentDate).toDateString()}</span>
              </div>
              <div className="flex justify-between text-xs border-b border-[#E5E1D8]/60 pb-2">
                <span className="text-[#3C2A21]/50 font-bold uppercase tracking-wider">Time Slot</span>
                <span className="font-bold text-[#3C2A21]">{activeBookingToShow.timeSlot}</span>
              </div>
              <div className="flex justify-between text-xs border-b border-[#E5E1D8]/60 pb-2">
                <span className="text-[#3C2A21]/50 font-bold uppercase tracking-wider">Consultation Mode</span>
                <span className="font-bold text-[#B38B36] uppercase tracking-wider">{activeBookingToShow.consultationMode.replace("-", " ")}</span>
              </div>
              <div className="flex justify-between text-xs border-b border-[#E5E1D8]/60 pb-2">
                <span className="text-[#3C2A21]/50 font-bold uppercase tracking-wider">Payment Status</span>
                <span className="font-bold text-emerald-600 uppercase tracking-wider">{activeBookingToShow.paymentStatus}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#3C2A21]/50 font-bold uppercase tracking-wider">Booking Status</span>
                <span className="font-bold text-emerald-600 uppercase tracking-wider">{activeBookingToShow.bookingStatus}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="bg-[#3C2A21] hover:bg-[#B38B36] text-white text-xs tracking-[0.2em] uppercase px-8 py-3.5 rounded-full transition-all"
            >
              Close
            </button>
          </div>
        ) : confirmed && confirmedBookingData ? (
          /* Booking Success confirmation screen */
          <div
            data-testid="booking-confirmation"
            className="p-12 md:p-16 text-center flex flex-col items-center"
          >
            <div className="w-20 h-20 rounded-full bg-[#B38B36]/10 border border-[#B38B36]/30 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-[#B38B36]" />
            </div>
            <div className="text-[11px] tracking-[0.4em] uppercase text-[#725D46] mb-3">
              Appointment Confirmed
            </div>
            <h3 className="font-serif text-3xl md:text-4xl text-[#3C2A21] mb-5">
              The stars have aligned,{" "}
              <em className="italic text-[#B38B36]">{form.name.split(" ")[0]}.</em>
            </h3>
            <p className="text-[#725D46] max-w-md mb-8">
              Your session for <strong>{service.title}</strong> is booked on{" "}
              <strong>{date.toDateString()}</strong> at <strong>{slot}</strong>.
              A confirmation has been sent to{" "}
              <span className="text-[#B38B36]">{form.email}</span>.
              <br />
              <span className="text-stone-400 text-xs block mt-2">
                Booking ID: {confirmedBookingData.bookingId} · Payment Status: Confirmed
              </span>
            </p>
            <button
              data-testid="booking-close-confirmation"
              onClick={onClose}
              className="bg-[#3C2A21] hover:bg-[#B38B36] text-white text-xs tracking-[0.2em] uppercase px-8 py-3.5 rounded-full transition-all"
            >
              Close
            </button>
          </div>
        ) : (
          /* Standard Multi-step Booking Form */
          <div className="grid md:grid-cols-[1fr_1.1fr] h-full md:max-h-[85vh] overflow-y-auto">
            {/* LEFT - Service details & Address Panel */}
            <aside className="bg-[#3C2A21] text-white p-6 md:p-8 flex flex-col justify-between md:sticky md:top-0 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <div className="text-[10px] tracking-[0.4em] uppercase text-[#E5C06A] mb-2 font-bold">
                    Booking Service
                  </div>
                  <h2
                    data-testid="booking-service-title"
                    className="font-serif text-2xl md:text-3xl leading-tight mb-3 font-semibold"
                  >
                    {service.title}
                  </h2>
                  <p className="text-white/60 text-xs leading-relaxed">
                    {serviceDesc}
                  </p>
                </div>

                <div className="space-y-4 border-t border-white/10 pt-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/40 uppercase tracking-[0.2em] font-semibold">
                      Duration
                    </span>
                    <span className="font-bold">{service.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40 uppercase tracking-[0.2em] font-semibold">
                      Consultation Mode
                    </span>
                    <span className="font-bold text-[#E5C06A] uppercase tracking-wider">
                      {selectedMode.replace("-", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40 uppercase tracking-[0.2em] font-semibold">
                      Total Fee
                    </span>
                    <span className="text-[#E5C06A] font-serif text-lg font-bold">
                      {formatINR(currentPrice)}
                    </span>
                  </div>
                </div>

                {/* Professional Service Details */}
                <div className="border-t border-white/10 pt-5 space-y-4 text-xs text-white/70">
                  <div className="flex items-start gap-2.5">
                    <User className="w-4 h-4 text-[#E5C06A] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Founder & Guide</div>
                      <div className="text-[11px] text-white/50">Gitika Sharma (Cosmic Specialist)</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#E5C06A] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Consultation Address</div>
                      <div className="text-[11px] text-white/60 leading-relaxed">
                        Suite 405, AstroPower Chamber, Cosmic Heights, Sector 62, Noida, UP
                      </div>
                      <div className="text-[10px] text-[#E5C06A]/70 mt-0.5">Landmark: Opposite Cosmic Park</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-[#E5C06A] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Contact & Support</div>
                      <div className="text-[11px] text-white/60">+91 98765 43210 | support@astropower24.com</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-[#E5C06A] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Working Hours</div>
                      <div className="text-[11px] text-white/60">10:00 AM - 07:00 PM (Monday - Saturday)</div>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3 text-[11px] text-white/50 leading-relaxed italic">
                    {["video", "voice", "chat"].includes(selectedMode) ? (
                      <span className="text-[#E5C06A]/90 font-medium not-italic">
                        ✦ Meeting details and secure virtual room links will be shared via Email and WhatsApp after successful payment.
                      </span>
                    ) : (
                      <span className="text-white/60 not-italic">
                        ✦ Please present your Booking ID at the reception counter upon arrival at our chamber.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 text-[10px] text-white/30 border-t border-white/10 pt-4 text-center">
                100% Confidential · Reschedule up to 24 hours in advance
              </div>
            </aside>

            {/* RIGHT - Form steps */}
            <div className="p-6 md:p-10 space-y-7 pb-32 md:pb-10">
              {/* Step 1 - Urgency / Tier Selector */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-6 h-6 rounded-full bg-[#B38B36] text-white text-xs font-medium flex items-center justify-center">
                    1
                  </span>
                  <h4 className="font-serif text-xl text-[#3C2A21]">
                    {isVastu ? "Select Vastu properties" : "Select consultation urgency"}
                  </h4>
                </div>

                {!isVastu ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {Object.entries(CONSULTATION_TYPES).map(([key, item]) => {
                      const isSelected = consultationType === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setConsultationType(key)}
                          className={`flex flex-col text-left p-5 border transition-all duration-300 rounded-xl relative ${
                            isSelected
                              ? "border-[#B38B36] bg-[#B38B36]/5 shadow-sm"
                              : "border-[#E5E1D8] hover:border-[#B38B36]/40 bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="font-serif font-bold text-sm text-[#3C2A21]">
                              {item.label}
                            </span>
                            <span className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-colors ${
                              isSelected ? "border-[#B38B36] bg-[#B38B36]" : "border-[#E5E1D8]"
                            }`}>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </span>
                          </div>
                          <span className="text-[#B38B36] font-serif text-base font-bold mb-1">
                            {formatINR(item.price)}
                          </span>
                          <span className="text-xs text-stone-600 font-normal">
                            {item.wait}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 p-1 bg-[#F3F1EC] rounded-xl border border-[#E5E1D8]">
                      {Object.entries(VASTU_TYPES).map(([key, item]) => {
                        const isSelected = vastuType === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => {
                              setVastuType(key);
                              setVastuRangeIndex(0);
                            }}
                            className={`py-2 text-center rounded-lg text-xs font-medium tracking-wider uppercase transition-all duration-300 ${
                              isSelected
                                ? "bg-[#3C2A21] text-white shadow-sm"
                                : "text-[#725D46] hover:text-[#3C2A21]"
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-[#B38B36] font-bold">
                        Property / Plot Area Size
                      </label>
                      <div className="relative">
                        <select
                          value={vastuRangeIndex}
                          onChange={(e) => setVastuRangeIndex(Number(e.target.value))}
                          className="w-full bg-white border border-[#E5E1D8] text-[#3C2A21] px-4 py-3.5 rounded-xl text-sm focus:outline-none focus:border-[#B38B36] focus:ring-1 focus:ring-[#B38B36] appearance-none cursor-pointer font-sans"
                        >
                          {VASTU_TYPES[vastuType].ranges.map((range, index) => (
                            <option key={index} value={index}>
                              {range.area} — {formatINR(range.price)}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#B38B36]">
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2 - Consultation Mode Selector */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-6 h-6 rounded-full bg-[#B38B36] text-white text-xs font-medium flex items-center justify-center">
                    2
                  </span>
                  <h4 className="font-serif text-xl text-[#3C2A21]">
                    Select consultation mode
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  {[
                    { id: "video", label: "Video Call", icon: Video, desc: "Google Meet link" },
                    { id: "voice", label: "Voice Call", icon: Phone, desc: "Direct phone call" },
                    { id: "chat", label: "Chat Consultation", icon: MessageSquare, desc: "Astro chat support" },
                    { id: "in-person", label: "In-Person Visit", icon: MapPin, desc: "Visit cosmic chamber" }
                  ].map((modeItem) => {
                    const isSelected = selectedMode === modeItem.id;
                    const IconComp = modeItem.icon;
                    return (
                      <button
                        key={modeItem.id}
                        type="button"
                        onClick={() => setSelectedMode(modeItem.id)}
                        className={`flex flex-col text-left p-4 border transition-all duration-300 rounded-xl relative ${
                          isSelected
                            ? "border-[#B38B36] bg-[#B38B36]/5 shadow-sm"
                            : "border-[#E5E1D8] hover:border-[#B38B36]/40 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <div className="flex items-center gap-2">
                            <IconComp className={`w-4 h-4 ${isSelected ? "text-[#B38B36]" : "text-[#3C2A21]/70"}`} />
                            <span className="font-serif font-bold text-sm text-[#3C2A21]">
                              {modeItem.label}
                            </span>
                          </div>
                          <span className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected ? "border-[#B38B36] bg-[#B38B36]" : "border-[#E5E1D8]"
                          }`}>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-500 mt-1">
                          {modeItem.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3 - Pick a Date */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-6 h-6 rounded-full bg-[#B38B36] text-white text-xs font-medium flex items-center justify-center">
                    3
                  </span>
                  <h4 className="font-serif text-xl text-[#3C2A21]">
                    Pick a date
                  </h4>
                </div>
                <div className="rounded-xl border border-[#E5E1D8] bg-white p-3 inline-block">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                      setDate(d);
                      setSlot(null);
                    }}
                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    data-testid="booking-calendar"
                  />
                </div>
              </div>

              {/* Step 4 - Available Slots */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-6 h-6 rounded-full bg-[#B38B36] text-white text-xs font-medium flex items-center justify-center">
                    4
                  </span>
                  <h4 className="font-serif text-xl text-[#3C2A21]">
                    Available time slots
                  </h4>
                </div>
                {!date ? (
                  <p className="text-sm text-[#725D46] italic">
                    Please choose a date to see available slots.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {allSlots.map((t) => {
                      const available = availableSlots.includes(t);
                      const isSelected = slot === t;
                      return (
                        <button
                          key={t}
                          data-testid={`time-slot-${t.replace(/[\s:]/g, "")}`}
                          disabled={!available}
                          onClick={() => setSlot(t)}
                          className={`relative px-3 py-2.5 rounded-lg text-xs border transition-all duration-200 flex items-center justify-center gap-1.5 ${
                            !available
                              ? "border-[#E5E1D8] text-[#B8B2A3] line-through cursor-not-allowed bg-[#F3F1EC]"
                              : isSelected
                              ? "bg-[#3C2A21] text-white border-[#3C2A21]"
                              : "border-[#E5E1D8] text-[#2A2A2A] hover:border-[#B38B36] hover:text-[#B38B36]"
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          {t}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Step 5 - Customer Details */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-6 h-6 rounded-full bg-[#B38B36] text-white text-xs font-medium flex items-center justify-center">
                    5
                  </span>
                  <h4 className="font-serif text-xl text-[#3C2A21]">
                    Your details
                  </h4>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#B38B36]" />
                    <Input
                      data-testid="booking-input-name"
                      placeholder="Full name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="pl-10 bg-white border-[#E5E1D8] focus-visible:ring-[#B38B36]"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#B38B36]" />
                    <Input
                      data-testid="booking-input-email"
                      type="email"
                      placeholder="Email address"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="pl-10 bg-white border-[#E5E1D8] focus-visible:ring-[#B38B36]"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#B38B36]" />
                    <Input
                      data-testid="booking-input-phone"
                      type="tel"
                      placeholder="Phone number"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="pl-10 bg-white border-[#E5E1D8] focus-visible:ring-[#B38B36]"
                    />
                  </div>
                </div>
              </div>

              <button
                data-testid="confirm-booking-button"
                disabled={paymentStatus === "processing"}
                onClick={handleConfirm}
                className="w-full bg-[#3C2A21] hover:bg-[#B38B36] text-white text-xs tracking-[0.25em] uppercase py-4 rounded-full transition-all duration-300 font-medium flex items-center justify-center gap-2"
              >
                {paymentStatus === "processing" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#E5C06A]" />
                    Initializing Payment Gateway...
                  </>
                ) : (
                  `Book Session · ${formatINR(currentPrice)}`
                )}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
