import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Moon, 
  Star, 
  Lock, 
  Unlock, 
  FileText, 
  CheckCircle2, 
  CreditCard, 
  Loader2, 
  Download, 
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Heart,
  Briefcase,
  AlertCircle,
  Activity,
  User,
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  Phone,
  Video,
  Mail,
  ShieldCheck,
  BookOpen,
  ShieldAlert,
  Award,
  Zap,
  Flame,
  Compass,
  ChevronDown,
  ChevronUp,
  Search
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import AppointmentBookingModal from "@/components/AppointmentBookingModal";
import { ConsultationStatusService } from "@/services/consultationStatusService";
import { CustomerService } from "@/services/customerService";
import { ReportService } from "@/services/reportService";
import { BookingService, PaymentService } from "@/services/bookingServices";
import { CancellationService, RefundService, NotificationService } from "@/services/cancellationService";
import { HistoryService } from "@/services/historyService";

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get("reportId");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  // Mock payment variables
  const [showMockModal, setShowMockModal] = useState(false);
  const [mockOrderData, setMockOrderData] = useState(null);
  
  // Appointment Booking modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);
  const [seekerPhone, setSeekerPhone] = useState("");
  const [isCancellationOpen, setIsCancellationOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Booking History states
  const [bookingHistory, setBookingHistory] = useState([]);
  const [historyFilter, setHistoryFilter] = useState("All");
  const [historySearch, setHistorySearch] = useState("");
  const [selectedHistoryBooking, setSelectedHistoryBooking] = useState(null);
  const [receiptBooking, setReceiptBooking] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);

  const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8005";

  // Refresh active booking & booking history list
  const refreshBookingsAndHistory = useCallback((phone) => {
    if (!phone) return;
    const allBookings = BookingService.getAllBookingsByPhone(phone);
    
    // Find active booking (Pending, Confirmed, Upcoming, Live)
    const active = allBookings.find(b => {
      const currentStatus = ConsultationStatusService.getCalculatedStatus(b);
      return ["Pending", "Confirmed", "Upcoming", "Live"].includes(currentStatus);
    });
    
    if (active) {
      const currentStatus = ConsultationStatusService.getCalculatedStatus(active);
      setActiveBooking({ ...active, calculatedStatus: currentStatus });
    } else {
      setActiveBooking(null);
    }
    
    setBookingHistory(allBookings);
  }, []);

  // Set page title for SEO & reset body styles to unlock scroll/pointer events
  useEffect(() => {
    document.title = "Astro Power 24 | Unlock Premium Destiny Report";
    
    document.body.style.overflow = "unset";
    document.body.style.pointerEvents = "unset";
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("pointer-events");
    
    document.documentElement.style.overflow = "unset";
    document.documentElement.style.pointerEvents = "unset";
    document.documentElement.style.removeProperty("overflow");
    document.documentElement.style.removeProperty("pointer-events");
    
    document.querySelectorAll("[data-radix-portal]").forEach(el => el.remove());
    document.querySelectorAll(".radix-overlay, [class*='overlay'], [class*='DialogOverlay']").forEach(el => el.remove());
  }, []);

  // Fetch report details
  useEffect(() => {
    if (!reportId) {
      toast.error("Invalid Request: No report ID provided.");
      setLoading(false);
      return;
    }

    const fetchReport = async () => {
      try {
        const data = await ReportService.getReport(reportId);
        setReport(data);
        if (data.phone) {
          localStorage.setItem("seeker_phone", data.phone);
          setSeekerPhone(data.phone);
          refreshBookingsAndHistory(data.phone);
        }
        if (data.email) {
          localStorage.setItem("seeker_email", data.email);
        }
        if (data.name) {
          localStorage.setItem("seeker_name", data.name);
        }
      } catch (err) {
        console.error(err);
        toast.error("Could not connect to servers to load your report.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId, refreshBookingsAndHistory]);

  // Load existing booking on mount
  useEffect(() => {
    const phone = localStorage.getItem("seeker_phone") || "";
    setSeekerPhone(phone);
    if (phone) {
      refreshBookingsAndHistory(phone);
    }
  }, [refreshBookingsAndHistory]);

  const handleCustomerCancellation = async () => {
    if (!activeBooking || !activeBooking.bookingId) return;
    setIsCancelling(true);
    try {
      await CancellationService.cancelBookingByCustomer(activeBooking.bookingId);
      setIsCancellationOpen(false);
      toast.success("Consultation cancelled successfully.");
      if (seekerPhone) {
        refreshBookingsAndHistory(seekerPhone);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to cancel consultation.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleAdminCancellation = async (bookingId) => {
    setIsCancelling(true);
    try {
      await CancellationService.cancelBookingByAdmin(bookingId);
      toast.success("Consultation cancelled by astrologer (Refund Initiated).");
      if (seekerPhone) {
        refreshBookingsAndHistory(seekerPhone);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to cancel consultation by admin.");
    } finally {
      setIsCancelling(false);
    }
  };

  useEffect(() => {
    window.simulateAdminCancellation = (bookingId) => {
      const id = bookingId || (activeBooking ? activeBooking.bookingId : null);
      if (!id) {
        console.error("No booking ID available to cancel.");
        return;
      }
      handleAdminCancellation(id);
    };
    return () => {
      delete window.simulateAdminCancellation;
    };
  }, [activeBooking]);

  // Set up live countdown & status recalculations every 10 seconds
  useEffect(() => {
    if (!seekerPhone) return;
    const timer = setInterval(() => {
      refreshBookingsAndHistory(seekerPhone);
    }, 10000);
    return () => clearInterval(timer);
  }, [seekerPhone, refreshBookingsAndHistory]);

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Trigger Razorpay Order Creation and Checkout
  const handlePayment = async () => {
    if (!reportId) return;
    setProcessingPayment(true);

    try {
      // 1. Create order on backend
      const res = await fetch(`${apiUrl}/api/horoscope/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report_id: reportId })
      });
      
      if (!res.ok) {
        throw new Error("Order creation failed on backend");
      }
      
      const orderData = await res.json();

      // 2. Check if backend returned a mock order
      if (orderData.is_mock) {
        setMockOrderData(orderData);
        setShowMockModal(true);
        setProcessingPayment(false);
        return;
      }

      // 3. For real orders, load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load Razorpay checkout script. Check your internet connection.");
        setProcessingPayment(false);
        return;
      }

      // 4. Configure and launch Razorpay checkout modal
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Astro Power 24",
        description: "Unlock Premium Destiny Report",
        order_id: orderData.order_id,
        handler: async function (paymentRes) {
          await verifyPayment(orderData.order_id, paymentRes.razorpay_payment_id, paymentRes.razorpay_signature);
        },
        prefill: {
          name: report?.name || "",
        },
        theme: {
          color: "#B38B36"
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Payment initiation failed. Please try again.");
      setProcessingPayment(false);
    }
  };

  // Verify payment on the backend
  const verifyPayment = async (orderId, paymentId, signature) => {
    setProcessingPayment(true);
    try {
      const response = await fetch(`${apiUrl}/api/horoscope/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report_id: reportId,
          payment_method: "razorpay",
          payment_id: paymentId,
          razorpay_order_id: orderId,
          razorpay_signature: signature
        })
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Destiny Report Unlocked successfully!");
        setReport(data); // Returns the unlocked report schema
      } else {
        toast.error(data.detail || "Payment validation failed. Please contact support.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to confirm transaction with servers.");
    } finally {
      setProcessingPayment(false);
    }
  };

  // Simulate payment for offline development mode
  const handleMockConfirm = async () => {
    setShowMockModal(false);
    setProcessingPayment(true);
    
    try {
      const response = await fetch(`${apiUrl}/api/horoscope/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report_id: reportId,
          payment_method: "mock_razorpay",
          payment_id: `MOCK_TXN_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          razorpay_order_id: mockOrderData.order_id,
          razorpay_signature: "mock_signature_verified"
        })
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Simulation complete: Premium report unlocked!");
        setReport(data);
      } else {
        toast.error("Failed to unlock report using mock payment.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error communicating with mock servers.");
    } finally {
      setProcessingPayment(false);
    }
  };

  // Helper getters
  const getAstroData = () => report?.astrology_details || {};
  const lifeReport = report?.life_report || {};
  const isPaid = report?.is_paid || false;
  const pdfUrl = report?.pdf_url ? (report.pdf_url.startsWith("http") ? report.pdf_url : `${apiUrl}${report.pdf_url}`) : "";

  const getTabLabel = () => {
    switch (report?.tab) {
      case "pending-karma": return "Pending Karma Analysis";
      case "karmic-connections": return "Karmic Connections Analysis";
      case "soul-purpose": return "Spiritual Path & Soul Purpose";
      case "soul-blueprint": return "Career Roadmap & Wealth Blueprint";
      case "soul-alignment": return "Health & Soul Alignment";
      default: return "Destiny Report";
    }
  };

  const getTabSections = (tab) => {
    switch (tab) {
      case "pending-karma":
        return [
          { title: "Karma Summary", key: "karma_summary" },
          { title: "Past Life Lessons", key: "karmic_lessons" },
          { title: "Present Life Challenges", key: "past_life_influence" },
          { title: "Karmic Debts", key: "current_karma" },
          { title: "Suggested Remedies", key: "remedies" },
          { title: "Key Spiritual Guidance", key: "remedies", isQuote: true }
        ];
      case "karmic-connections":
        return [
          { title: "Relationship Karma", key: "relationship_karma" },
          { title: "Soul Contracts", key: "soul_contract" },
          { title: "Karmic Relationships", key: "karmic_bond" },
          { title: "Twin Flame Indicators", key: "emotional_compatibility", isHighlight: true },
          { title: "Marriage & Partnership Guidance", key: "emotional_compatibility" },
          { title: "Healing Suggestions", key: "lessons_together" }
        ];
      case "soul-purpose":
        return [
          { title: "Core Life Mission", key: "soul_mission" },
          { title: "Natural Talents", key: "natural_gifts" },
          { title: "Career Direction", key: "life_calling" },
          { title: "Dharma Path", key: "growth_path" },
          { title: "Spiritual Growth Areas", key: "purpose_challenges" },
          { title: "Recommended Actions", key: "growth_path" }
        ];
      case "soul-blueprint":
        return [
          { title: "Personality Blueprint", key: "soul_blueprint_overview" },
          { title: "Core Strengths", key: "core_soul_traits" },
          { title: "Hidden Potential", key: "hidden_gifts" },
          { title: "Decision Making Style", key: "life_themes" },
          { title: "Emotional Pattern", key: "core_soul_traits" },
          { title: "Personal Evolution", key: "spiritual_blueprint" }
        ];
      case "soul-alignment":
        return [
          { title: "Current Energy Alignment", key: "current_soul_alignment" },
          { title: "Spiritual Balance", key: "energy_balance" },
          { title: "Chakra/Energy Focus", key: "spiritual_blockages" },
          { title: "Life Alignment Score", key: "alignment_score", isScore: true },
          { title: "Areas Requiring Attention", key: "spiritual_blockages" },
          { title: "Alignment Recommendations", key: "daily_guidance" }
        ];
      default:
        return [];
    }
  };

  const getSectionIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes("summary")) return <FileText className="w-5 h-5 text-[#B38B36]" />;
    if (t.includes("lessons")) return <BookOpen className="w-5 h-5 text-[#B38B36]" />;
    if (t.includes("challenge") || t.includes("attention")) return <ShieldAlert className="w-5 h-5 text-red-500/80" />;
    if (t.includes("debts")) return <AlertCircle className="w-5 h-5 text-[#B38B36]" />;
    if (t.includes("remedies") || t.includes("healing") || t.includes("recommendation")) return <Activity className="w-5 h-5 text-[#B38B36]" />;
    if (t.includes("guidance")) return <Compass className="w-5 h-5 text-[#B38B36]" />;
    if (t.includes("connection") || t.includes("relationship") || t.includes("partnership")) return <Heart className="w-5 h-5 text-rose-400" />;
    if (t.includes("contract")) return <ShieldCheck className="w-5 h-5 text-[#B38B36]" />;
    if (t.includes("mission")) return <Compass className="w-5 h-5 text-[#B38B36]" />;
    if (t.includes("talent") || t.includes("strength") || t.includes("potential")) return <Award className="w-5 h-5 text-[#B38B36]" />;
    if (t.includes("career") || t.includes("direction") || t.includes("action")) return <Briefcase className="w-5 h-5 text-[#B38B36]" />;
    if (t.includes("dharma") || t.includes("evolution") || t.includes("growth")) return <TrendingUp className="w-5 h-5 text-[#B38B36]" />;
    if (t.includes("blueprint") || t.includes("personality")) return <User className="w-5 h-5 text-[#B38B36]" />;
    if (t.includes("energy") || t.includes("alignment")) return <Zap className="w-5 h-5 text-[#B38B36]" />;
    if (t.includes("balance")) return <ShieldCheck className="w-5 h-5 text-[#B38B36]" />;
    if (t.includes("score")) return <Award className="w-5 h-5 text-[#B38B36]" />;
    if (t.includes("twin flame")) return <Flame className="w-5 h-5 text-orange-400" />;
    return <Sparkles className="w-5 h-5 text-[#B38B36]" />;
  };

  const renderFormattedContent = (text) => {
    if (!text) return null;
    if (text.includes("🔒")) {
      return (
        <div className="flex items-center gap-2.5 p-4.5 bg-stone-50 border border-stone-200/60 rounded-2xl text-stone-500 italic text-xs font-light shadow-inner">
          <Lock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span>{text}</span>
        </div>
      );
    }
    const paragraphs = text.split("\n\n").filter(Boolean);
    return (
      <div className="space-y-6">
        {paragraphs.map((p, idx) => {
          if (idx === 0) {
            return (
              <div key={idx} className="space-y-1 animate-fadeIn">
                <span className="text-[9px] uppercase tracking-widest text-[#8E6B23] font-bold">
                  Overview
                </span>
                <p className="text-sm sm:text-base text-[#5C4D43] leading-relaxed font-light">
                  {p}
                </p>
              </div>
            );
          }
          if (idx === 1) {
            const isNegative = p.toLowerCase().includes("challenge") || p.toLowerCase().includes("difficult") || p.toLowerCase().includes("blockage") || p.toLowerCase().includes("struggle") || p.toLowerCase().includes("warns");
            return (
              <div key={idx} className="p-4.5 bg-[#FFFDF9]/60 border border-[#B38B36]/15 rounded-2xl shadow-sm space-y-2 animate-fadeIn">
                <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-black text-[#3C2A21]">
                  <Sparkles className="w-3.5 h-3.5 text-[#B38B36]" />
                  {isNegative ? "Growth Area & Key Challenges" : "Core Strengths & Potential"}
                </span>
                <p className="text-xs sm:text-sm text-[#5C4D43] leading-relaxed font-light">
                  {p}
                </p>
              </div>
            );
          }
          return (
            <div key={idx} className="p-4.5 bg-[#B38B36]/5 border-l-4 border-[#B38B36] rounded-r-2xl shadow-sm space-y-2 animate-fadeIn">
              <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-black text-[#8E6B23]">
                <Activity className="w-3.5 h-3.5 text-[#B38B36]" />
                Practical Guidance & Remedies
              </span>
              <div className="text-xs sm:text-sm text-[#3C2A21] leading-relaxed font-light">
                {p.includes("- ") || p.includes("* ") ? (
                  <ul className="list-disc pl-4 space-y-1.5 mt-1">
                    {p.split(/\n/g).map(item => item.replace(/^[-*\s]+/, "").trim()).filter(Boolean).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{p}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const CONFIG_ITEMS = [
    { label: "Lagna (Rising Sign)", value: getAstroData().lagna?.split(" ")[0], desc: getAstroData().lagna, icon: <TrendingUp className="w-4 h-4 text-[#8E6B23]" /> },
    { label: "Rasi (Moon Sign)", value: getAstroData().rasi?.split(" ")[0], desc: getAstroData().rasi, icon: <Moon className="w-4 h-4 text-[#8E6B23]" /> },
    { label: "Nakshatra", value: getAstroData().nakshatra, desc: "Lunar Mansion", icon: <Sparkles className="w-4 h-4 text-[#8E6B23]" /> }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex flex-col items-center justify-center py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(232,200,126,0.15),transparent_70%)]" />
        <Loader2 className="w-12 h-12 text-[#B38B36] animate-spin relative z-10" />
        <p className="text-sm font-serif text-[#8E6B23] tracking-widest uppercase mt-4 relative z-10 animate-pulse">Loading celestial blueprint...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex flex-col items-center justify-center py-20 px-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500/80 mb-4" />
        <h2 className="font-serif text-2xl text-[#3C2A21] font-semibold mb-2">Report Not Found</h2>
        <p className="text-sm text-stone-500 max-w-md mb-8">We could not load your personalized horoscope chart. It may have expired or been entered incorrectly.</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-[#B38B36] hover:bg-[#8E6B23] text-white text-[10px] tracking-widest uppercase font-bold transition-all shadow-md"
        >
          Return Home
        </button>
      </div>
    );
  }

  const getCountdownDisplay = (booking) => {
    if (!booking) return "";
    const calcStatus = ConsultationStatusService.getCalculatedStatus(booking);
    if (calcStatus === "Cancelled") return "Consultation Cancelled";
    if (calcStatus === "Expired") return "Consultation Expired";
    if (calcStatus === "Completed") return "Completed";
    if (calcStatus === "Live Now") return "Live Now";
    
    const start = ConsultationStatusService.getSlotDateTime(booking.date, booking.slot);
    const now = new Date();
    const isToday = start.toDateString() === now.toDateString();
    
    if (isToday) {
      return `Today at ${booking.slot}`;
    }
    
    const diffMs = start.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      const hoursRem = diffHours % 24;
      return `Starts in ${diffDays} Day${diffDays > 1 ? 's' : ''} ${hoursRem} Hour${hoursRem > 1 ? 's' : ''}`;
    }
    if (diffHours > 0) {
      const minsRem = diffMins % 60;
      return `Starts in ${diffHours} Hour${diffHours > 1 ? 's' : ''} ${minsRem} Min${minsRem > 1 ? 's' : ''}`;
    }
    return `Starts in ${diffMins} Min${diffMins > 1 ? 's' : ''}`;
  };

  const getMeetingActionButton = (booking) => {
    if (!booking) return null;
    const calcStatus = ConsultationStatusService.getCalculatedStatus(booking);
    if (calcStatus === "Cancelled" || calcStatus === "Cancelled by Customer" || calcStatus === "Cancelled by Admin" || calcStatus === "Expired" || calcStatus === "Completed") {
      return null;
    }
    
    const start = ConsultationStatusService.getSlotDateTime(booking.date, booking.slot);
    const now = new Date();
    
    const fifteenMinsBeforeStart = new Date(start.getTime() - 15 * 60 * 1000);
    const durationMins = booking.consultationType === "in-person" ? 60 : 45;
    const end = new Date(start.getTime() + durationMins * 60 * 1000);
    const isCloseToStartOrLive = now >= fifteenMinsBeforeStart && now <= end;
    
    if (booking.consultationType === "video") {
      if (isCloseToStartOrLive) {
        return (
          <a
            href={booking.meetLink || "https://meet.google.com"}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-[10px] tracking-wider uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] border border-white/20 animate-pulse"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Join Google Meet</span>
          </a>
        );
      }
      return (
        <button
          disabled
          className="px-4 py-2 bg-stone-100 border border-stone-200 text-stone-400 font-bold text-[10px] tracking-wider uppercase rounded-xl cursor-not-allowed opacity-65 flex items-center justify-center gap-1.5"
          title="Meeting link will activate 15 minutes before the scheduled time."
        >
          <Video className="w-3.5 h-3.5" />
          <span>Join Google Meet (Locked)</span>
        </button>
      );
    }

    if (booking.consultationType === "voice") {
      if (isCloseToStartOrLive) {
        return (
          <a
            href={booking.meetLink || "https://meet.google.com"}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-[10px] tracking-wider uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] border border-white/20 animate-pulse"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Join Meeting</span>
          </a>
        );
      }
      return (
        <button
          disabled
          className="px-4 py-2 bg-stone-100 border border-stone-200 text-stone-400 font-bold text-[10px] tracking-wider uppercase rounded-xl cursor-not-allowed opacity-65 flex items-center justify-center gap-1.5"
          title="Meeting link will activate 15 minutes before the scheduled time."
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Join Meeting (Locked)</span>
        </button>
      );
    }
    
    if (booking.consultationType === "chat") {
      if (isCloseToStartOrLive) {
        return (
          <a
            href={booking.chatLink || "#"}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-[10px] tracking-wider uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] border border-white/20"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Open Chat</span>
          </a>
        );
      }
      return (
        <button
          disabled
          className="px-4 py-2 bg-stone-100 border border-stone-200 text-stone-400 font-bold text-[10px] tracking-wider uppercase rounded-xl cursor-not-allowed opacity-65 flex items-center justify-center gap-1.5"
          title="Chat session will activate 15 minutes before the scheduled time."
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Open Chat (Locked)</span>
        </button>
      );
    }
    
    if (booking.consultationType === "in-person") {
      return (
        <a
          href="https://maps.google.com"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 bg-[#B38B36] hover:bg-[#8E6B23] text-white font-bold text-[10px] tracking-wider uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02]"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>View Appointment</span>
        </a>
      );
    }
    
    return null;
  };

  const renderConsultationStatusCard = (booking) => {
    if (!booking) return null;
    
    const calcStatus = ConsultationStatusService.getCalculatedStatus(booking);
    const countdown = getCountdownDisplay(booking);
    
    const typeLabel = {
      chat: "Chat Consultation",
      voice: "Voice Call",
      video: "Video Consultation",
      "in-person": "In-Person Consultation"
    }[booking.consultationType] || booking.consultationType;
    
    const statusColors = {
      "Upcoming": "border-blue-200 bg-blue-50/50 text-blue-800",
      "Today's Meeting": "border-amber-200 bg-amber-50/50 text-amber-800",
      "Live Now": "border-green-200 bg-green-50/60 text-green-800 animate-pulse",
      "Completed": "border-stone-200 bg-stone-50/50 text-stone-600",
      "Cancelled": "border-red-200 bg-red-50/50 text-red-700",
      "Cancelled by Customer": "border-red-200 bg-red-50/50 text-red-700",
      "Cancelled by Admin": "border-red-200 bg-red-50/50 text-red-700",
      "Expired": "border-stone-200 bg-stone-50/50 text-stone-500"
    }[calcStatus] || "border-stone-200 bg-stone-50 text-stone-700";

    const isCancelled = calcStatus === "Cancelled by Customer" || calcStatus === "Cancelled by Admin" || calcStatus === "Cancelled";
    const headerTitle = (calcStatus === "Cancelled by Customer" || calcStatus === "Cancelled")
      ? "Booking Cancelled"
      : calcStatus === "Cancelled by Admin"
      ? "Booking Cancelled by Astrologer"
      : "Consultation Confirmed";

    return (
      <div className="border border-[#B38B36]/35 bg-white/95 rounded-2xl p-4 max-w-sm w-full text-xs shadow-md space-y-2.5 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute inset-1.5 border border-[#B38B36]/10 rounded-xl pointer-events-none" />
        
        <div className="flex items-center justify-between border-b border-[#B38B36]/15 pb-2">
          <div className="flex items-center gap-1.5 text-stone-700 font-bold">
            {isCancelled ? (
              <AlertCircle className="w-4 h-4 text-red-600 animate-[fadeIn_0.3s]" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-green-600 animate-[fadeIn_0.3s]" />
            )}
            <span className="font-serif tracking-wide text-xs">{headerTitle}</span>
          </div>
          <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-wider border rounded-md ${statusColors}`}>
            {calcStatus === "Cancelled" ? "Cancelled" : calcStatus}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-[10px] text-stone-600 leading-tight">
          <div>
            <span className="text-stone-400 uppercase tracking-wider text-[7px] block">Consultation Mode</span>
            <span className="font-bold text-[#3C2A21]">{typeLabel}</span>
          </div>
          <div>
            <span className="text-stone-400 uppercase tracking-wider text-[7px] block">Booking ID</span>
            <span className="font-mono font-bold text-[#8E6B23]">{booking.bookingId}</span>
          </div>
          <div>
            <span className="text-stone-400 uppercase tracking-wider text-[7px] block">Appointment Time</span>
            <span className="font-semibold text-stone-700">{new Date(booking.date).toDateString()}</span>
            <span className="block text-[#8E6B23] font-bold mt-0.5">{booking.slot} ({booking.duration || "45 mins"})</span>
          </div>
          <div>
            <span className="text-stone-400 uppercase tracking-wider text-[7px] block">Payment Status</span>
            <span className="inline-flex items-center gap-1 font-bold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-md text-[8px] uppercase mt-0.5 animate-[fadeIn_0.3s]">
              ✓ Successful
            </span>
          </div>
        </div>

        {(calcStatus === "Cancelled by Customer" || calcStatus === "Cancelled") && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-2.5 space-y-1 text-[10px] text-red-800 animate-[fadeIn_0.3s] leading-relaxed">
            <span className="font-bold block mb-0.5 text-[8px] uppercase tracking-wider text-red-700">Cancellation Info</span>
            <p>• Refund: <span className="font-bold">Not Eligible</span></p>
            <p>• Reason: Cancelled by Customer</p>
          </div>
        )}

        {calcStatus === "Cancelled by Admin" && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 space-y-1 text-[10px] text-amber-800 animate-[fadeIn_0.3s] leading-relaxed">
            <span className="font-bold block mb-0.5 text-[8px] uppercase tracking-wider text-amber-700">Cancellation Info</span>
            <p>• Refund Status: <span className="font-bold">Refund Initiated</span></p>
            <p>• Expected Refund: <span className="font-bold">Within 24 Hours</span></p>
          </div>
        )}

        {calcStatus !== "Completed" && !isCancelled && calcStatus !== "Expired" && (
          <div className="bg-[#FCFAF2]/60 border border-[#B38B36]/15 rounded-xl p-2.5 flex items-center justify-between text-[10px] font-semibold text-stone-800 animate-[fadeIn_0.3s]">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#B38B36]" />
              <span className="font-light text-stone-500 uppercase tracking-wider text-[8px]">Schedule countdown</span>
            </div>
            <span className="text-[#8E6B23] font-bold">{countdown}</span>
          </div>
        )}

        {calcStatus === "Completed" && (
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-[10px] font-medium text-stone-500 animate-[fadeIn_0.3s]">
            ✓ Consultation Completed on {new Date(booking.date).toDateString()} @ {booking.slot}
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-1 z-10 relative">
          <button
            type="button"
            onClick={() => {
              toast.info(
                <div className="space-y-2">
                  <div>
                    <p className="font-bold text-xs mb-1">Consultation Details</p>
                    <p className="text-[10px] text-stone-500">Name: {booking.name}</p>
                    <p className="text-[10px] text-stone-500">Phone: {booking.phone}</p>
                    <p className="text-[10px] text-stone-500">Email: {booking.email}</p>
                    {booking.notes && <p className="text-[10px] text-stone-500 italic mt-1">"{booking.notes}"</p>}
                  </div>
                  <div className="pt-2 border-t border-stone-100 text-[8px] text-stone-400 leading-normal">
                    <span className="font-bold text-stone-600 block mb-0.5">Cancellation Policy</span>
                    • Customer Cancellation: No Refund.<br />
                    • Astrologer Cancellation: 100% Refund within 24 Hours.
                  </div>
                  {!isCancelled && calcStatus !== "Completed" && calcStatus !== "Expired" && (
                    <button
                      type="button"
                      onClick={() => handleAdminCancellation(booking.bookingId)}
                      className="mt-2 w-full py-1 text-center bg-amber-500 hover:bg-amber-600 text-white font-bold text-[8px] uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                    >
                      🛠 Simulate Astrologer Cancel
                    </button>
                  )}
                </div>,
                { duration: 12000 }
              );
            }}
            className="px-3 py-2 bg-white border border-[#B38B36]/35 text-[#8E6B23] hover:text-[#3C2A21] hover:bg-[#B38B36]/5 text-[9px] tracking-wider uppercase font-bold rounded-xl transition-all duration-300 cursor-pointer flex-1"
          >
            View Details
          </button>
          
          {getMeetingActionButton(booking)}
        </div>

        {calcStatus !== "Completed" && !isCancelled && calcStatus !== "Expired" ? (
          <div className="flex justify-between border-t border-stone-100 pt-2.5 mt-1 text-[8px] uppercase tracking-wider text-stone-400">
            <button 
              type="button" 
              onClick={() => toast.info("Rescheduling is active up to 24 hours before slot. Please coordinate with support.")}
              className="hover:text-[#8E6B23] transition-colors cursor-pointer"
            >
              Reschedule
            </button>
            <button 
              type="button" 
              onClick={() => setIsCancellationOpen(true)}
              className="hover:text-red-600 transition-colors cursor-pointer"
            >
              Cancel Booking
            </button>
          </div>
        ) : isCancelled ? (
          <div className="flex justify-center border-t border-[#B38B36]/15 pt-2.5 mt-1 text-[8px] uppercase tracking-wider font-extrabold text-red-600">
            Booking Cancelled
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div id="payment-page-root" className="min-h-screen bg-[#FFFDF9] text-[#3C2A21] font-sans relative pb-20 pt-28 md:pt-36 overflow-hidden">
      
      <style>{`
        body, html {
          overflow: auto !important;
          pointer-events: auto !important;
        }
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.85); }
          50% { opacity: 0.8; transform: scale(1.15); }
        }
      `}</style>
      
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#E8D9FC]/30 blur-[120px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#FDE7BA]/30 blur-[130px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '10s' }} />

      {/* Slow Rotating Background Zodiac Wheel Watermarks */}
      <div className="absolute top-[8%] left-[-15%] w-[65vw] h-[65vw] max-w-[650px] text-[#B38B36] opacity-[0.03] animate-[spinSlow_150s_linear_infinite] pointer-events-none select-none z-0">
        <svg viewBox="0 0 1000 1000" className="w-full h-full fill-none stroke-current">
          <circle cx="500" cy="500" r="480" strokeWidth="0.5" />
          <circle cx="500" cy="500" r="300" strokeWidth="0.5" />
          <circle cx="500" cy="500" r="150" strokeWidth="0.5" strokeDasharray="3 3" />
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            return (
              <line
                key={i}
                x1="500" y1="500"
                x2={500 + Math.cos(angle) * 480}
                y2={500 + Math.sin(angle) * 480}
                strokeWidth="0.3"
              />
            );
          })}
        </svg>
      </div>

      <div className="absolute bottom-[10%] right-[-15%] w-[60vw] h-[60vw] max-w-[600px] text-[#B38B36] opacity-[0.03] animate-[spinSlow_120s_linear_infinite_reverse] pointer-events-none select-none z-0">
        <svg viewBox="0 0 1000 1000" className="w-full h-full fill-none stroke-current">
          <circle cx="500" cy="500" r="480" strokeWidth="0.5" />
          <circle cx="500" cy="500" r="300" strokeWidth="0.5" />
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            return (
              <line
                key={i}
                x1="500" y1="500"
                x2={500 + Math.cos(angle) * 480}
                y2={500 + Math.sin(angle) * 480}
                strokeWidth="0.3"
              />
            );
          })}
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10 space-y-6">
        
        {/* Back navigation button */}
        <div className="flex justify-start pt-2">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-1.5 text-[#6E5D53] hover:text-[#B38B36] border border-stone-300/80 hover:border-[#B38B36] bg-white/70 hover:bg-[#B38B36]/5 px-3.5 py-1.5 rounded-full transition-all duration-300 text-[10px] uppercase font-bold tracking-wider cursor-pointer shadow-sm shrink-0"
          >
            <ArrowLeft className="w-3 h-3" /> Back
          </button>
        </div>

        {/* Banner Card */}
        <div className="relative border border-[#B38B36]/20 bg-white/70 shadow-[0_15px_40px_rgba(179,139,54,0.06)] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-stretch justify-between gap-6">
          {/* Subtle gold inner accent frame */}
          <div className="absolute inset-2 border border-[#B38B36]/10 rounded-[1.3rem] pointer-events-none" />
          
          {/* Star backgrounds */}
          <div className="absolute top-3 left-4 text-[#B38B36]/30 text-xs animate-[twinkle_4s_infinite_linear]">✦</div>
          <div className="absolute bottom-3 right-6 text-[#B38B36]/25 text-[10px] animate-[twinkle_3s_infinite_linear]" style={{ animationDelay: "1.5s" }}>✦</div>

          <div className="space-y-2 text-center md:text-left relative z-10 flex flex-col justify-center">
            <span className="inline-flex items-center gap-1 px-3 py-1 border border-[#B38B36]/25 rounded-full bg-[#B38B36]/5 text-[9px] tracking-widest text-[#8E6B23] uppercase font-bold">
              ✨ Cosmic Reading Room
            </span>
            <h1 className="font-serif text-3xl md:text-4xl text-[#3C2A21] font-semibold leading-tight mt-1">
              {getTabLabel()} for <em className="italic text-[#8E6B23]">{report.name || "Seeker"}</em>
            </h1>
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-4 text-xs text-[#6E5D53] mt-2">
              <span className="flex items-center gap-1 font-light"><Calendar className="w-3.5 h-3.5 text-[#B38B36]" /> {new Date(report.dob).toLocaleDateString(undefined, { dateStyle: "long" })}</span>
              <span className="hidden md:inline text-stone-300">•</span>
              <span className="flex items-center gap-1 font-light"><Clock className="w-3.5 h-3.5 text-[#B38B36]" /> {report.tob}</span>
              {report.pob && (
                <>
                  <span className="hidden md:inline text-stone-300">•</span>
                  <span className="flex items-center gap-1 font-light"><MapPin className="w-3.5 h-3.5 text-[#B38B36]" /> {report.pob}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="relative z-10 shrink-0 flex flex-wrap items-center gap-3">
            {isPaid && (
              <a
                href={pdfUrl}
                download
                className="px-6 py-3.5 bg-gradient-to-r from-[#B38B36] to-[#8E6B23] hover:brightness-[1.1] text-white font-bold text-xs tracking-widest uppercase rounded-full transition-all duration-300 flex items-center gap-2 shadow-md hover:scale-[1.02] border border-white/20"
              >
                <Download className="w-3.5 h-3.5 text-white" />
                <span>Download PDF</span>
              </a>
            )}
            
            {activeBooking ? (
              <div className="flex flex-col md:flex-row items-center gap-3">
                {renderConsultationStatusCard(activeBooking)}
                {(activeBooking.calculatedStatus === "Completed" || 
                  activeBooking.calculatedStatus === "Cancelled" || 
                  activeBooking.calculatedStatus === "Cancelled by Customer" ||
                  activeBooking.calculatedStatus === "Cancelled by Admin" ||
                  activeBooking.calculatedStatus === "Expired") && (
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="px-6 py-3.5 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] hover:brightness-[1.12] text-[#1E110A] font-serif font-bold text-xs tracking-[0.2em] uppercase rounded-full transition-all duration-500 flex items-center gap-2 shadow-[0_4px_15px_rgba(179,139,54,0.35)] hover:scale-[1.02] cursor-pointer border border-[#FCF6BA]/40"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#1E110A]" />
                    <span>Book Another Consultation</span>
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowBookingModal(true)}
                className="px-6 py-3.5 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] hover:brightness-[1.12] text-[#1E110A] font-serif font-bold text-xs tracking-[0.2em] uppercase rounded-full transition-all duration-500 flex items-center gap-2 shadow-[0_4px_15px_rgba(179,139,54,0.35)] hover:scale-[1.02] cursor-pointer border border-[#FCF6BA]/40"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#1E110A]" />
                <span>{bookingHistory.length > 0 ? "Book Another Consultation" : "Connect with Gitika Sharma"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Paid Confirmation Screen if just unlocked */}
        {isPaid && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-green-200 bg-green-50/40 rounded-2xl p-6 flex items-center gap-4 text-green-800 shadow-sm"
          >
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-inner">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold">Premium Report Unlocked!</h3>
              <p className="text-xs text-green-700 mt-1 font-light">Your complete astrological roadmap is fully active and revealed below. You can download a high-resolution PDF for offline storage.</p>
            </div>
          </motion.div>
        )}

        {/* Booking History Section */}
        {seekerPhone && bookingHistory.length > 0 && (
          <div className="relative border border-[#B38B36]/25 bg-white/70 shadow-[0_15px_40px_rgba(179,139,54,0.06)] rounded-3xl p-6 backdrop-blur-xl space-y-4">
            <div 
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="flex items-center justify-between cursor-pointer border-b border-[#B38B36]/15 pb-3 select-none"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B38B36]" />
                <h2 className="font-serif text-lg text-[#3C2A21] font-semibold">
                  Booking History
                </h2>
              </div>
              <div className="flex items-center gap-1.5 text-stone-500 hover:text-[#8E6B23] transition-colors">
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  {isHistoryOpen ? "Collapse" : "Expand"}
                </span>
                {isHistoryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>

            <AnimatePresence initial={false}>
              {isHistoryOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden space-y-4 pt-1"
                >
                  {/* Filters and Search Bar */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-1 bg-[#B38B36]/5 p-1 rounded-xl border border-[#B38B36]/10">
                      {["All", "Upcoming", "Completed", "Cancelled", "Refunded"].map((f) => {
                        const isActive = historyFilter === f;
                        return (
                          <button
                            key={f}
                            type="button"
                            onClick={() => setHistoryFilter(f)}
                            className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider text-[9px] transition-all cursor-pointer ${
                              isActive 
                                ? "bg-[#B38B36] text-white shadow-sm" 
                                : "text-[#8E6B23] hover:bg-[#B38B36]/10"
                            }`}
                          >
                            {f}
                          </button>
                        );
                      })}
                    </div>

                    {/* Search Input */}
                    <div className="relative max-w-xs w-full">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        placeholder="Search ID, date, mode..."
                        value={historySearch}
                        onChange={(e) => setHistorySearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white/80 border border-[#B38B36]/20 rounded-xl text-xs text-[#3C2A21] placeholder-stone-400 focus:outline-none focus:border-[#B38B36] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Booking Cards Grid */}
                  {(() => {
                    const filtered = HistoryService.filterAndSearchBookings(bookingHistory, historyFilter, historySearch);
                    if (filtered.length === 0) {
                      return (
                        <div className="text-center py-8 text-stone-400 text-xs italic">
                          No past bookings match the selected filters or search criteria.
                        </div>
                      );
                    }
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filtered.map((b) => {
                          const statusColors = {
                            "Pending": "border-amber-200 bg-amber-50/50 text-amber-700",
                            "Confirmed": "border-green-200 bg-green-50/50 text-green-700",
                            "Upcoming": "border-green-200 bg-green-50/50 text-green-700",
                            "Live": "border-emerald-200 bg-emerald-50/50 text-emerald-700 animate-pulse",
                            "Completed": "border-stone-200 bg-stone-50/50 text-stone-500",
                            "Cancelled by Customer": "border-red-200 bg-red-50/50 text-red-700",
                            "Cancelled by Admin": "border-red-200 bg-red-50/50 text-red-700",
                            "Cancelled": "border-red-200 bg-red-50/50 text-red-700",
                            "Expired": "border-stone-200 bg-stone-50/50 text-stone-500"
                          }[b.status] || "border-stone-200 bg-stone-50 text-stone-700";

                          const isCancelled = ["Cancelled by Customer", "Cancelled by Admin", "Cancelled"].includes(b.status);

                          return (
                            <div 
                              key={b.bookingId} 
                              className="border border-[#B38B36]/15 hover:border-[#B38B36]/35 bg-white/95 rounded-2xl p-4 shadow-sm space-y-2.5 transition-all duration-300 hover:shadow-md relative"
                            >
                              {/* Header */}
                              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                                <span className="font-mono font-bold text-[#8E6B23] text-xs">
                                  {b.bookingId}
                                </span>
                                <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-wider border rounded-md ${statusColors}`}>
                                  {b.status}
                                </span>
                              </div>

                              {/* Details Grid */}
                              <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-[10px] text-stone-600 leading-normal">
                                <div>
                                  <span className="text-stone-400 uppercase tracking-wider text-[7px] block">Consultation Type</span>
                                  <span className="font-semibold text-[#3C2A21] uppercase">{b.consultationType} ({b.consultationType === "in-person" ? "60 mins" : "45 mins"})</span>
                                </div>
                                <div>
                                  <span className="text-stone-400 uppercase tracking-wider text-[7px] block">Booking Date</span>
                                  <span className="font-medium text-stone-700">{new Date(b.created_at || b.date).toDateString()}</span>
                                </div>
                                <div>
                                  <span className="text-stone-400 uppercase tracking-wider text-[7px] block">Meeting Time</span>
                                  <span className="font-medium text-stone-700">{new Date(b.date).toDateString()} @ {b.slot}</span>
                                </div>
                                <div>
                                  <span className="text-stone-400 uppercase tracking-wider text-[7px] block">Payment Status</span>
                                  <span className="font-bold text-green-700 uppercase">✓ Successful</span>
                                </div>
                              </div>

                              {/* Cancellation Details */}
                              {isCancelled && (
                                <div className="bg-red-50 border border-red-200/60 rounded-xl p-2 text-[9px] text-red-800 space-y-0.5">
                                  <p>• <span className="font-bold">Refund:</span> {b.refund?.status || "Not Eligible"}</p>
                                  {b.refund?.expectedRefund && <p>• <span className="font-bold">Timeline:</span> {b.refund.expectedRefund}</p>}
                                  {b.refund?.reason && <p>• <span className="font-bold">Reason:</span> {b.refund.reason}</p>}
                                </div>
                              )}

                              {/* Footer Actions */}
                              <div className="flex gap-2 pt-1.5 border-t border-stone-50">
                                <button
                                  type="button"
                                  onClick={() => setSelectedHistoryBooking(b)}
                                  className="px-2.5 py-1.5 bg-white border border-[#B38B36]/35 text-[#8E6B23] hover:text-[#3C2A21] hover:bg-[#B38B36]/5 text-[8px] tracking-wider uppercase font-extrabold rounded-lg transition-colors cursor-pointer flex-1 text-center"
                                >
                                  View Details
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setReceiptBooking(b)}
                                  className="px-2.5 py-1.5 bg-white border border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-stone-50 text-[8px] tracking-wider uppercase font-extrabold rounded-lg transition-colors cursor-pointer flex-1 text-center flex items-center justify-center gap-1"
                                >
                                  <Download className="w-2.5 h-2.5" />
                                  <span>Receipt</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => toast.info("Invoice generation will be available in future releases.")}
                                  className="px-2.5 py-1.5 bg-white border border-stone-100 text-stone-300 hover:text-stone-500 text-[8px] tracking-wider uppercase font-extrabold rounded-lg transition-colors cursor-pointer flex-1 text-center"
                                >
                                  Invoice
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Astro Parameter Dashboard Grid */}
        <div className="space-y-4">
          <h2 className="font-serif text-[#3C2A21] border-l-2 border-[#B38B36] pl-3 uppercase tracking-widest text-[10px] font-bold">
            Astronomical Configurations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {CONFIG_ITEMS.map((item, idx) => (
              <div 
                key={idx} 
                className="group relative overflow-hidden bg-white/60 backdrop-blur-md border border-white/70 shadow-sm hover:shadow-[0_12px_30px_rgba(179,139,54,0.15)] hover:border-[#B38B36]/50 hover:-translate-y-1 transition-all duration-300 rounded-2xl p-5 flex flex-col items-center justify-between text-center min-h-[145px]"
              >
                {/* Micro glow overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#B38B36]/2 to-[#B38B36]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                {/* Icon wrapper */}
                <div className="w-10 h-10 rounded-full bg-[#B38B36]/10 border border-[#B38B36]/20 flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-[#B38B36]/15 transition-all duration-300 shadow-inner text-[#8E6B23]">
                  {item.icon}
                </div>
                
                <span className="text-[9px] uppercase tracking-widest text-[#6E5D53] font-bold leading-tight line-clamp-1">{item.label}</span>
                <div className="my-1.5 text-[#8E6B23] font-serif font-bold text-base tracking-wide line-clamp-1 group-hover:text-[#3C2A21] transition-colors">
                  {item.value || "—"}
                </div>
                <span className="text-[9px] text-[#6E5D53]/60 italic font-light line-clamp-1">{item.desc || "—"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Planetary Positions Grid */}
        {getAstroData().planetary_positions && Object.keys(getAstroData().planetary_positions).length > 0 && (
          <div className="space-y-4">
            <h2 className="font-serif text-[#3C2A21] border-l-2 border-[#8E6B23] pl-3 uppercase tracking-widest text-[10px] font-bold">
              Planetary Positions (Graha Sthiti)
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-9 gap-3.5">
              {[
                { planet: "Sun", symbol: "☉", sanskrit: "Surya" },
                { planet: "Moon", symbol: "☽", sanskrit: "Chandra" },
                { planet: "Mars", symbol: "♂", sanskrit: "Mangal" },
                { planet: "Mercury", symbol: "☿", sanskrit: "Budh" },
                { planet: "Jupiter", symbol: "♃", sanskrit: "Guru" },
                { planet: "Venus", symbol: "♀", sanskrit: "Shukra" },
                { planet: "Saturn", symbol: "♄", sanskrit: "Shani" },
                { planet: "Rahu", symbol: "☊", sanskrit: "Rahu" },
                { planet: "Ketu", symbol: "☋", sanskrit: "Ketu" }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden bg-white/60 backdrop-blur-md border border-white/70 shadow-sm hover:shadow-[0_12px_30px_rgba(142,107,35,0.15)] hover:border-[#8E6B23]/50 hover:-translate-y-1 transition-all duration-300 rounded-2xl p-4 flex flex-col items-center justify-between text-center min-h-[145px]"
                >
                  {/* Micro glow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#8E6B23]/2 to-[#8E6B23]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  <span className="text-[8px] uppercase tracking-widest text-[#6E5D53] font-bold">{item.planet}</span>
                  
                  {/* Glyphs wrapper */}
                  <div className="w-9 h-9 rounded-full bg-[#8E6B23]/10 border border-[#8E6B23]/20 flex items-center justify-center my-1.5 text-[#8E6B23] text-lg select-none group-hover:scale-110 group-hover:bg-[#8E6B23]/15 transition-all duration-300 shadow-inner">
                    {item.symbol}
                  </div>
                  
                  <div className="text-[#8E6B23] font-serif font-bold text-sm tracking-wide line-clamp-1 group-hover:text-[#3C2A21] transition-colors">
                    {getAstroData().planetary_positions[item.planet] || "—"}
                  </div>
                  <span className="text-[8px] text-[#6E5D53]/70 italic font-light mt-0.5">{item.sanskrit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Premium Analysis Sections */}
        <div className="max-w-4xl mx-auto space-y-8 pt-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#8E6B23] border border-[#B38B36]/25 rounded-full px-3.5 py-1 bg-[#B38B36]/5">
              Personalized Consultation Report
            </span>
            <h3 className="font-serif text-3xl text-[#3C2A21] font-semibold">
              Vedic Astrology Insights
            </h3>
          </div>

          <div className="space-y-6 relative">
            {/* Dynamic sections rendering */}
            {getTabSections(report?.tab).map((section, idx) => {
              const rawContent = lifeReport[section.key] || lifeReport[Object.keys(lifeReport)[idx % Object.keys(lifeReport).length]] || "";
              const isSectionFree = idx === 0;
              const isLocked = !isSectionFree && !isPaid;

              return (
                <div 
                  key={section.title}
                  className="relative overflow-hidden bg-white/70 border border-[#B38B36]/20 shadow-[0_10px_35px_rgba(179,139,54,0.04)] rounded-3xl p-6 md:p-8 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_15px_40px_rgba(179,139,54,0.08)]"
                >
                  {/* Subtle inner gold line */}
                  <div className="absolute inset-2 border border-[#B38B36]/5 rounded-2xl pointer-events-none" />

                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-[#B38B36]/10 pb-4 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#B38B36]/10 border border-[#B38B36]/20 flex items-center justify-center text-[#8E6B23] shadow-inner">
                        {getSectionIcon(section.title)}
                      </div>
                      <h4 className="font-serif text-lg md:text-xl text-[#3C2A21] font-bold">
                        {section.title}
                      </h4>
                    </div>
                    {isSectionFree ? (
                      <span className="text-[8px] uppercase tracking-widest px-2.5 py-1 border border-green-200 text-green-600 bg-green-50/50 rounded-full font-bold">
                        Free Access
                      </span>
                    ) : (
                      isLocked && (
                        <span className="text-[8px] uppercase tracking-widest px-2.5 py-1 border border-[#B38B36]/25 text-[#8E6B23] bg-[#B38B36]/5 rounded-full font-bold flex items-center gap-1">
                          <Lock className="w-2 h-2" /> Premium
                        </span>
                      )
                    )}
                  </div>

                  {/* Card Body */}
                  <div className={`transition-all duration-700 ${isLocked ? 'blur-md select-none pointer-events-none opacity-40' : ''}`}>
                    {section.isScore && !isLocked ? (
                      <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-[#B38B36]/5 border border-[#B38B36]/20 rounded-2xl">
                        <div className="w-20 h-20 rounded-full bg-white border border-[#B38B36]/30 flex flex-col items-center justify-center shadow-md shrink-0">
                          <span className="text-xs text-[#8E6B23] font-bold uppercase tracking-wider">Score</span>
                          <span className="font-serif text-2xl font-black text-[#3C2A21]">
                            {rawContent.match(/\d+%/)?.[0] || "85%"}
                          </span>
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <p className="text-sm sm:text-base text-[#5C4D43] leading-relaxed">
                            {rawContent}
                          </p>
                        </div>
                      </div>
                    ) : section.isQuote && !isLocked ? (
                      <blockquote className="p-5 border-l-4 border-[#8E6B23] bg-[#FDFBF7] italic rounded-r-xl shadow-inner text-[#3C2A21] text-base leading-relaxed">
                        "{rawContent.replace(/^["'\s]+|["'\s]+$/g, "")}"
                      </blockquote>
                    ) : (
                      renderFormattedContent(rawContent)
                    )}
                  </div>
                </div>
              );
            })}

            {/* PREMIUM FADE-OUT OVERLAY */}
            {!isPaid && (
              <div className="absolute inset-x-0 bottom-0 top-[20%] bg-gradient-to-t from-[#FFFDF9] via-[#FFFDF9]/95 to-transparent pointer-events-none z-20" />
            )}

          </div>
        </div>

      </div>

      {/* NESTED DIALOG: DEVELOPMENT MOCK AUTHORIZATION PANEL */}
      <Dialog open={showMockModal} onOpenChange={(v) => !v && setShowMockModal(false)}>
        <DialogContent className="max-w-md p-6 bg-[#FFFDF9] border border-white/90 text-[#3C2A21] font-sans rounded-2xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(229,192,106,0.1),transparent_70%)] pointer-events-none z-0" />
          
          <div className="relative z-10 space-y-6">
            <DialogTitle className="sr-only">Razorpay Sandbox (Mock Mode)</DialogTitle>
            <DialogDescription className="sr-only">
              Simulated Razorpay transaction process for development environments.
            </DialogDescription>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#B38B36]/10 border border-[#B38B36]/35 flex items-center justify-center mx-auto mb-3 text-[#B38B36] shadow-sm">
                <span>🚀</span>
              </div>
              <h3 className="font-serif text-xl font-medium">Razorpay Sandbox (Mock)</h3>
              <p className="text-xs text-[#6E5D53] mt-2 font-light">
                No active Razorpay credentials detected on backend. Simulate a payment transaction response to test the end-to-end integration.
              </p>
            </div>

            <div className="border border-[#B38B36]/15 bg-white/70 rounded-xl p-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#6E5D53]">Order ID:</span>
                <span className="font-mono text-[10px]">{mockOrderData?.order_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E5D53]">Charge Amount:</span>
                <span className="font-bold text-[#8E6B23]">₹499.00</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowMockModal(false)}
                className="py-3 border border-stone-200 hover:border-stone-400 rounded-xl text-xs font-bold uppercase tracking-widest text-[#6E5D53] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleMockConfirm}
                className="py-3 bg-[#B38B36] hover:bg-[#8E6B23] text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-md hover:shadow-lg transition-all"
              >
                Authorize Payment
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AppointmentBookingModal
        open={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onBookingSuccess={(booking) => {
          if (booking && booking.phone) {
            setSeekerPhone(booking.phone);
            refreshBookingsAndHistory(booking.phone);
          } else {
            setActiveBooking(booking);
          }
        }}
      />

      <Dialog open={isCancellationOpen} onOpenChange={(v) => !v && !isCancelling && setIsCancellationOpen(false)}>
        <DialogContent className="max-w-md p-6 bg-[#FDFBF7] border border-[#E5E1D8] text-[#3C2A21] rounded-2xl shadow-2xl overflow-hidden z-50">
          <DialogTitle className="font-serif text-lg font-bold text-[#3C2A21] mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span>Cancel Consultation?</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-stone-500 leading-relaxed mb-4">
            Are you sure you want to cancel your booked consultation? This action cannot be undone.
          </DialogDescription>
          
          <div className="bg-stone-50 border border-[#B38B36]/15 rounded-xl p-3.5 space-y-2 mb-6 text-[10px] text-stone-600 leading-normal">
            <span className="font-bold text-[#8E6B23] block uppercase tracking-wider text-[8px]">Cancellation Policy</span>
            <p>• Customer cancellations are <span className="font-bold text-red-700">non-refundable</span>.</p>
            <p>• If the consultation is cancelled by the astrologer or admin, the full payment will be refunded within 24 hours.</p>
          </div>

          <div className="flex justify-end gap-3 text-xs font-bold uppercase tracking-wider">
            <button
              disabled={isCancelling}
              onClick={() => setIsCancellationOpen(false)}
              className="px-4 py-2.5 border border-stone-200 hover:border-stone-400 rounded-xl text-stone-600 transition-colors cursor-pointer disabled:opacity-50"
            >
              Keep Booking
            </button>
            <button
              disabled={isCancelling}
              onClick={handleCustomerCancellation}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Cancel Booking</span>
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Premium View Details Modal */}
      <Dialog open={!!selectedHistoryBooking} onOpenChange={(v) => !v && setSelectedHistoryBooking(null)}>
        <DialogContent className="max-w-md p-6 bg-[#FDFBF7] border border-[#E5E1D8] text-[#3C2A21] rounded-2xl shadow-2xl overflow-hidden z-50">
          {selectedHistoryBooking && (
            <>
              <DialogTitle className="font-serif text-lg font-bold text-[#3C2A21] mb-1 flex items-center gap-2 border-b border-[#B38B36]/15 pb-2">
                <Sparkles className="w-4 h-4 text-[#B38B36]" />
                <span>Consultation Details</span>
              </DialogTitle>
              <DialogDescription className="sr-only">
                Full profile and tracking coordinates for booking {selectedHistoryBooking.bookingId}
              </DialogDescription>
              
              <div className="space-y-4 my-3 text-xs overflow-y-auto max-h-[60vh] pr-1">
                {/* Customer Info */}
                <div className="bg-stone-50 border border-stone-200/50 rounded-xl p-3 space-y-1">
                  <span className="font-bold text-[#8E6B23] uppercase tracking-wider text-[8px] block">Customer Profile</span>
                  <p><span className="text-stone-400">Name:</span> <span className="font-semibold">{selectedHistoryBooking.name}</span></p>
                  <p><span className="text-stone-400">Phone:</span> {selectedHistoryBooking.phone}</p>
                  <p><span className="text-stone-400">Email:</span> {selectedHistoryBooking.email}</p>
                </div>

                {/* Booking Info */}
                <div className="grid grid-cols-2 gap-2 bg-stone-50 border border-stone-200/50 rounded-xl p-3">
                  <div className="col-span-2">
                    <span className="font-bold text-[#8E6B23] uppercase tracking-wider text-[8px] block mb-1">Booking Coordinates</span>
                  </div>
                  <p><span className="text-stone-400">Booking ID:</span> <span className="font-mono font-bold text-stone-700">{selectedHistoryBooking.bookingId}</span></p>
                  <p><span className="text-stone-400">Type:</span> <span className="uppercase font-semibold">{selectedHistoryBooking.consultationType}</span></p>
                  <p><span className="text-stone-400">Duration:</span> {selectedHistoryBooking.consultationType === "in-person" ? "60 mins" : "45 mins"}</p>
                  <p><span className="text-stone-400">Status:</span> <span className="font-bold">{selectedHistoryBooking.status}</span></p>
                </div>

                {/* Meeting & Payment Info */}
                <div className="bg-stone-50 border border-stone-200/50 rounded-xl p-3 space-y-1.5">
                  <span className="font-bold text-[#8E6B23] uppercase tracking-wider text-[8px] block">Meeting & Financials</span>
                  {selectedHistoryBooking.meetLink && (
                    <p><span className="text-stone-400">Link:</span> <a href={selectedHistoryBooking.meetLink} target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium hover:text-blue-800">{selectedHistoryBooking.meetLink}</a></p>
                  )}
                  <p><span className="text-stone-400">Amount Charged:</span> <span className="font-semibold text-green-700">₹{selectedHistoryBooking.amount || 499.00} (Paid)</span></p>
                  <p><span className="text-stone-400">Payment ID:</span> <span className="font-mono text-stone-500">{selectedHistoryBooking.paymentId || "RP_PAYMENT_SUCCESS"}</span></p>
                </div>

                {/* Cancellation & Refund Info if exists */}
                {selectedHistoryBooking.refund && (
                  <div className="bg-red-50 border border-red-200/60 rounded-xl p-3 space-y-1 text-red-800">
                    <span className="font-bold text-red-700 uppercase tracking-wider text-[8px] block">Cancellation & Refund Logs</span>
                    <p><span className="text-red-600">Refund Status:</span> <span className="font-bold">{selectedHistoryBooking.refund.status}</span></p>
                    {selectedHistoryBooking.refund.expectedRefund && (
                      <p><span className="text-red-600">Expected Timeline:</span> <span className="font-medium">{selectedHistoryBooking.refund.expectedRefund}</span></p>
                    )}
                    {selectedHistoryBooking.refund.reason && (
                      <p><span className="text-red-600">Log Reason:</span> {selectedHistoryBooking.refund.reason}</p>
                    )}
                  </div>
                )}

                {/* Timeline */}
                <div className="bg-stone-50 border border-stone-200/50 rounded-xl p-3">
                  <span className="font-bold text-[#8E6B23] uppercase tracking-wider text-[8px] block mb-3">Consultation Lifecycle Timeline</span>
                  <div className="relative pl-6 space-y-3.5 border-l border-stone-200 ml-1.5">
                    {/* Step 1: Created */}
                    <div className="relative">
                      <div className="absolute left-[-29px] top-0.5 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-[8px]">✓</div>
                      <p className="font-bold text-[#3C2A21] leading-none">Consultation Initiated</p>
                      <p className="text-[8px] text-stone-400 mt-0.5">Booking request registered</p>
                    </div>

                    {/* Step 2: Payment Success */}
                    <div className="relative">
                      <div className="absolute left-[-29px] top-0.5 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-[8px]">✓</div>
                      <p className="font-bold text-[#3C2A21] leading-none">Payment Success</p>
                      <p className="text-[8px] text-stone-400 mt-0.5">Payment verified via Razorpay API</p>
                    </div>

                    {/* Step 3: Booking Confirmed */}
                    <div className="relative">
                      <div className="absolute left-[-29px] top-0.5 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-[8px]">✓</div>
                      <p className="font-bold text-[#3C2A21] leading-none">Booking Confirmed</p>
                      <p className="text-[8px] text-stone-400 mt-0.5">Slot secured and confirmed</p>
                    </div>

                    {/* Step 4: Meeting Scheduled */}
                    <div className="relative">
                      <div className="absolute left-[-29px] top-0.5 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-[8px]">✓</div>
                      <p className="font-bold text-[#3C2A21] leading-none">Meeting Scheduled</p>
                      <p className="text-[8px] text-stone-400 mt-0.5">Video/voice credentials established</p>
                    </div>

                    {/* Step 5: Final State */}
                    <div className="relative">
                      {selectedHistoryBooking.status.includes("Cancelled") ? (
                        <>
                          <div className="absolute left-[-29px] top-0.5 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-[8px]">✗</div>
                          <p className="font-bold text-red-600 leading-none">Booking Cancelled</p>
                          <p className="text-[8px] text-red-400 mt-0.5">Lifecycle terminated via Cancellation API</p>
                        </>
                      ) : selectedHistoryBooking.status === "Completed" ? (
                        <>
                          <div className="absolute left-[-29px] top-0.5 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-[8px]">✓</div>
                          <p className="font-bold text-green-600 leading-none">Consultation Completed</p>
                          <p className="text-[8px] text-stone-400 mt-0.5">Astrologer meeting finished successfully</p>
                        </>
                      ) : (
                        <>
                          <div className="absolute left-[-29px] top-0.5 w-4 h-4 rounded-full bg-[#B38B36] flex items-center justify-center text-white text-[8px] animate-pulse">●</div>
                          <p className="font-bold text-[#8E6B23] leading-none">Upcoming Session</p>
                          <p className="text-[8px] text-stone-400 mt-0.5">Active session awaits schedule start</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-stone-100">
                <button
                  onClick={() => setSelectedHistoryBooking(null)}
                  className="px-4 py-2 bg-[#B38B36] hover:bg-[#8E6B23] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Close details
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Receipt Details Modal */}
      <Dialog open={!!receiptBooking} onOpenChange={(v) => !v && setReceiptBooking(null)}>
        <DialogContent className="max-w-md p-6 bg-[#FDFBF7] border border-[#E5E1D8] text-[#3C2A21] rounded-2xl shadow-2xl z-50">
          {receiptBooking && (() => {
            const receipt = HistoryService.getReceiptDetails(receiptBooking);
            return (
              <div className="space-y-4">
                <div className="text-center border-b border-[#B38B36]/15 pb-4 space-y-1">
                  <h2 className="font-serif text-xl font-bold text-[#3C2A21]">AstroPower 24 Receipt</h2>
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest">Transaction Statement</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-400 font-light">Receipt No:</span>
                    <span className="font-mono font-bold text-stone-700">{receipt.receiptNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400 font-light">Booking Reference:</span>
                    <span className="font-mono font-bold text-stone-700">{receipt.bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400 font-light">Payment Reference:</span>
                    <span className="font-mono font-semibold text-stone-700">{receipt.paymentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400 font-light">Transaction Date:</span>
                    <span className="font-medium text-stone-700">{receipt.date}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 pb-2">
                    <span className="text-stone-400 font-light">Service:</span>
                    <span className="font-medium text-stone-700 uppercase">{receipt.consultationType} Consultation</span>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-[#8E6B23] uppercase tracking-wider text-[8px] block">Customer Details</span>
                    <p><span className="text-stone-400">Name:</span> <span className="font-semibold">{receipt.customerName}</span></p>
                    <p><span className="text-stone-400">Phone:</span> {receipt.customerPhone}</p>
                    <p><span className="text-stone-400">Email:</span> {receipt.customerEmail}</p>
                  </div>

                  <div className="flex justify-between border-t border-stone-200/60 pt-3 text-sm">
                    <span className="font-bold text-[#3C2A21]">Total Paid:</span>
                    <span className="font-serif font-black text-[#8E6B23]">₹{receipt.amountPaid}.00</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-stone-100">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="flex-1 px-4 py-2 border border-stone-200 hover:border-stone-400 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-stone-600 font-bold"
                  >
                    Print Receipt
                  </button>
                  <button
                    onClick={() => setReceiptBooking(null)}
                    className="flex-1 px-4 py-2 bg-[#B38B36] hover:bg-[#8E6B23] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default PaymentPage;
