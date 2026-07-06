import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CheckCircle2, Clock, User, Mail, Phone } from "lucide-react";
import { getAvailableSlots, formatINR, CONSULTATION_TYPES, VASTU_TYPES } from "@/data/content";

const BookingModal = ({ service, open, onClose }) => {
  const [date, setDate] = useState(null);
  const [slot, setSlot] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [confirmed, setConfirmed] = useState(false);

  const [consultationType, setConsultationType] = useState("normal"); // 'normal' | 'urgent'
  const [vastuType, setVastuType] = useState("domestic"); // 'domestic' | 'industrial'
  const [vastuRangeIndex, setVastuRangeIndex] = useState(0);

  useEffect(() => {
    if (!open) {
      setDate(null);
      setSlot(null);
      setForm({ name: "", email: "", phone: "" });
      setConfirmed(false);
      setConsultationType("normal");
      setVastuType("domestic");
      setVastuRangeIndex(0);
    }
  }, [open]);

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

  const handleConfirm = () => {
    if (!date || !slot) {
      toast.error("Please select a date and time slot.");
      return;
    }
    if (!form.name || !form.email) {
      toast.error("Please enter your name and email.");
      return;
    }
    setConfirmed(true);

    let bookingDetail = `${service.title}`;
    if (isVastu) {
      const rangeObj = VASTU_TYPES[vastuType].ranges[vastuRangeIndex];
      bookingDetail += ` (${VASTU_TYPES[vastuType].label} - ${rangeObj.area})`;
    } else {
      bookingDetail += ` (${CONSULTATION_TYPES[consultationType].label})`;
    }

    toast.success("Appointment confirmed — see you soon!", {
      description: `${bookingDetail} · ${date.toDateString()} · ${slot}`,
    });
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

        {confirmed ? (
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
          <div className="grid md:grid-cols-[1fr_1.1fr] h-full md:max-h-[85vh] overflow-y-auto">
            {/* LEFT - Service summary */}
            <aside className="bg-[#3C2A21] text-white p-6 md:p-10 flex flex-col justify-between md:sticky md:top-0">
              <div>
                <div className="text-[10px] tracking-[0.4em] uppercase text-[#E5C06A] mb-4">
                  Booking
                </div>
                <h2
                  data-testid="booking-service-title"
                  className="font-serif text-3xl md:text-4xl leading-tight mb-5"
                >
                  {service.title}
                </h2>
                <p className="text-white/60 text-sm leading-relaxed mb-8">
                  {serviceDesc}
                </p>

                <div className="space-y-4 border-t border-white/10 pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50 uppercase text-xs tracking-[0.2em]">
                      Duration
                    </span>
                    <span>{service.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50 uppercase text-xs tracking-[0.2em]">
                      Fee
                    </span>
                    <span className="text-[#E5C06A] font-serif text-lg">
                      {formatINR(currentPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50 uppercase text-xs tracking-[0.2em]">
                      Mode
                    </span>
                    <span>Video / In-studio</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-xs text-white/40 border-t border-white/10 pt-5">
                100% confidential · Reschedule up to 24 hours in advance
              </div>
            </aside>

            {/* RIGHT - Form */}
            <div className="p-6 md:p-10 space-y-7 pb-32 md:pb-10">
              {/* Step 1 - Tier Selector */}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    {/* Vastu Type Toggle */}
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

                    {/* Vastu Area Range Selection */}
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

              {/* Step 2 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-6 h-6 rounded-full bg-[#B38B36] text-white text-xs font-medium flex items-center justify-center">
                    2
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

              {/* Step 3 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-6 h-6 rounded-full bg-[#B38B36] text-white text-xs font-medium flex items-center justify-center">
                    3
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

              {/* Step 4 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-6 h-6 rounded-full bg-[#B38B36] text-white text-xs font-medium flex items-center justify-center">
                    4
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
                      placeholder="Phone (optional)"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="pl-10 bg-white border-[#E5E1D8] focus-visible:ring-[#B38B36]"
                    />
                  </div>
                </div>
              </div>

              <button
                data-testid="confirm-booking-button"
                onClick={handleConfirm}
                className="w-full bg-[#3C2A21] hover:bg-[#B38B36] text-white text-xs tracking-[0.25em] uppercase py-4 rounded-full transition-all duration-300 font-medium"
              >
                Confirm Appointment · {formatINR(currentPrice)}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
