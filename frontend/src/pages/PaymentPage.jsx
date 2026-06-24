import { useEffect, useState } from "react";
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
  TrendingUp,
  Heart,
  Briefcase,
  AlertCircle,
  Activity,
  User,
  Calendar,
  Clock,
  MapPin
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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

  const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8005";

  // Set page title for SEO & reset body styles to unlock scroll/pointer events
  useEffect(() => {
    document.title = "Astro Power 24 | Unlock Premium Destiny Report";
    
    // Reset any locked body and html styles left by Radix modal dialogs
    document.body.style.overflow = "unset";
    document.body.style.pointerEvents = "unset";
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("pointer-events");
    
    document.documentElement.style.overflow = "unset";
    document.documentElement.style.pointerEvents = "unset";
    document.documentElement.style.removeProperty("overflow");
    document.documentElement.style.removeProperty("pointer-events");
    
    // Remove stale Radix portal elements and Dialog overlays from the DOM
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
        const response = await fetch(`${apiUrl}/api/horoscope/reports/${reportId}`);
        const data = await response.json();
        if (response.ok) {
          setReport(data);
        } else {
          toast.error(data.detail || "Failed to find the specified horoscope report.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Could not connect to servers to load your report.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId, apiUrl]);

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
  const today = report?.today_prediction || {};
  const tomorrow = report?.tomorrow_prediction || {};
  const weekly = report?.weekly_forecast || {};
  const monthly = report?.monthly_forecast || {};
  const lifeReport = report?.life_report || {};
  const isPaid = report?.is_paid || false;
  const pdfUrl = report?.pdf_url ? (report.pdf_url.startsWith("http") ? report.pdf_url : `${apiUrl}${report.pdf_url}`) : "";

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

  return (
    <div id="payment-page-root" className="min-h-screen bg-[#FFFDF9] text-[#3C2A21] font-[Outfit,sans-serif] relative pb-20 pt-28 md:pt-36">
      
      <style>{`
        body, html {
          overflow: auto !important;
          pointer-events: auto !important;
        }
      `}</style>
      
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#E8D9FC]/40 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#FDE7BA]/40 blur-[130px] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 space-y-8">
        
        {/* Banner Card */}
        <div className="border border-white/60 bg-white/45 shadow-sm rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[9px] tracking-widest text-[#8E6B23] uppercase font-bold block">Cosmic Reading Room</span>
            <h1 className="font-serif text-3xl md:text-4xl text-[#3C2A21] font-semibold">
              Destiny Report for <em className="italic text-[#8E6B23]">{report.name}</em>
            </h1>
            <p className="text-xs text-[#6E5D53] font-light">
              Birth details: {new Date(report.dob).toLocaleDateString(undefined, { dateStyle: "long" })} at {report.tob} {report.pob && `in ${report.pob}`}
            </p>
          </div>
          
          {isPaid ? (
            <a
              href={pdfUrl}
              download
              className="px-8 py-4 bg-[#B38B36] hover:bg-[#8E6B23] text-white font-bold text-xs tracking-widest uppercase rounded-lg transition-all duration-300 flex items-center gap-2.5 shadow-md hover:scale-[1.02]"
            >
              <Download className="w-4 h-4" />
              <span>Download Premium PDF</span>
            </a>
          ) : (
            <button
              onClick={handlePayment}
              disabled={processingPayment}
              className="px-8 py-4 bg-gradient-to-r from-[#B38B36] to-[#8E6B23] hover:from-[#8E6B23] hover:to-[#3C2A21] text-white font-bold text-xs tracking-widest uppercase rounded-lg transition-all duration-500 flex items-center gap-2.5 shadow-md hover:scale-[1.02] cursor-pointer"
            >
              {processingPayment ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 text-white" />
                  <span>Unlock Full Report - ₹499</span>
                </>
              )}
            </button>
          )}
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

        {/* Astro Parameter Dashboard Grid */}
        <div>
          <h2 className="font-serif text-lg text-[#3C2A21] mb-4 border-l-2 border-[#B38B36] pl-3 uppercase tracking-wider text-xs font-semibold">
            Astronomical Configurations
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
            {[
              { label: "Rasi (Moon Sign)", value: getAstroData().rasi?.split(" ")[0], desc: getAstroData().rasi },
              { label: "Nakshatra", value: getAstroData().nakshatra, desc: "Lunar Mansion" },
              { label: "Lagna (Rising)", value: getAstroData().lagna?.split(" ")[0], desc: "Ascendant sign" },
              { label: "Zodiac (Sun)", value: getAstroData().zodiac, desc: "Solar Sign" },
              { label: "Moon Sign", value: getAstroData().moon_sign, desc: "Emotional core" },
              { label: "Birth Star", value: getAstroData().birth_star, desc: "Constellation" },
              { label: "Lucky Number", value: getAstroData().lucky_number, desc: "Cosmic vibration" },
              { label: "Lucky Color", value: getAstroData().lucky_color, desc: "Auric energy" },
              { label: "Lucky Day", value: getAstroData().lucky_day, desc: "Weekly alignment" }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white/55 border border-white/70 shadow-sm hover:shadow-[0_8px_25px_rgba(179,139,54,0.12)] hover:border-[#B38B36]/40 transition-all duration-300 rounded-xl p-4 flex flex-col justify-between text-center"
              >
                <span className="text-[8px] uppercase tracking-widest text-[#6E5D53] font-bold">{item.label}</span>
                <div className="my-2 text-[#8E6B23] font-serif font-bold text-base truncate">
                  {item.value}
                </div>
                <span className="text-[8px] text-[#6E5D53]/70 italic font-light truncate">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Planetary Positions Grid */}
        {getAstroData().planetary_positions && Object.keys(getAstroData().planetary_positions).length > 0 && (
          <div>
            <h2 className="font-serif text-lg text-[#3C2A21] mb-4 border-l-2 border-[#8E6B23] pl-3 uppercase tracking-wider text-xs font-semibold">
              Planetary Positions (Graha Sthiti)
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-9 gap-3">
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
                  className="bg-white/55 border border-white/70 shadow-sm hover:shadow-[0_8px_25px_rgba(142,107,35,0.12)] hover:border-[#8E6B23]/40 transition-all duration-300 rounded-xl p-4 flex flex-col justify-between text-center"
                >
                  <span className="text-[8px] uppercase tracking-widest text-[#6E5D53] font-bold">{item.planet}</span>
                  <div className="my-1 text-xl select-none">{item.symbol}</div>
                  <div className="text-[#8E6B23] font-serif font-bold text-sm truncate">
                    {getAstroData().planetary_positions[item.planet] || "—"}
                  </div>
                  <span className="text-[8px] text-[#6E5D53]/70 italic font-light mt-0.5">{item.sanskrit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Columns: Predictions vs Detailed Life Report */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT: Predictions, Summaries, and checkout Card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* BILLING CARD if report is not paid */}
            {!isPaid && (
              <div className="bg-gradient-to-b from-[#FFFDF9]/95 to-[#FFF9ED]/95 border border-[#B38B36]/30 shadow-[0_20px_50px_rgba(179,139,54,0.12)] rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#B38B36]/10 border border-[#B38B36]/35 flex items-center justify-center mx-auto mb-3 text-[#B38B36] shadow-sm">
                    <CreditCard className="w-5 h-5 text-[#B38B36]" />
                  </div>
                  <h2 className="font-serif text-2xl font-medium">Unlock Premium Access</h2>
                  <p className="text-xs text-[#6E5D53] mt-2 font-light">Complete the authorization via Razorpay to instantly decrypt all destiny sections.</p>
                </div>

                {/* Price block */}
                <div className="border border-[#B38B36]/15 bg-white/70 shadow-inner rounded-xl p-4 flex items-center justify-between text-sm mb-6">
                  <div>
                    <span className="font-serif font-bold block">Personalized Destiny Report</span>
                    <span className="text-[9px] text-[#6E5D53] uppercase tracking-wider font-light">Complete PDF + Lifetime Dashboard</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#8E6B23] font-serif text-2xl font-bold">₹499</span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={processingPayment}
                  className="w-full py-4 bg-gradient-to-r from-[#B38B36] to-[#8E6B23] hover:from-[#8E6B23] hover:to-[#3C2A21] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-500 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  {processingPayment ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Unlock className="w-4 h-4 text-white" />
                  )}
                  <span>Pay Securely with Razorpay</span>
                </button>

                <div className="text-[10px] text-[#6E5D53]/85 text-center leading-relaxed mt-4 flex items-center justify-center gap-1.5 border-t border-[#B38B36]/10 pt-4">
                  <AlertCircle className="w-3.5 h-3.5 text-[#B38B36] shrink-0" />
                  <span>Secured by Razorpay. High-grade signature authorization.</span>
                </div>
              </div>
            )}

            {/* TODAY'S PREDICTION */}
            <div className="bg-white/50 border border-white/60 shadow-sm rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
              <div className="flex items-center justify-between mb-4 border-b border-[#B38B36]/15 pb-3">
                <h4 className="font-serif text-lg text-[#3C2A21] font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#B38B36]" /> Today's Horoscope
                </h4>
                <span className="text-[9px] uppercase tracking-widest font-black text-[#8E6B23]">Aligned</span>
              </div>
              <div className="space-y-4 text-xs leading-relaxed">
                <div className="p-3 bg-white/70 border border-white/80 rounded-lg border-l-2 border-[#B38B36] shadow-sm">
                  <strong className="text-[#8E6B23] uppercase text-[9px] tracking-widest block mb-1">Overall Guidance</strong>
                  <p className="text-[#3C2A21] italic">"{today.overall}"</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white/30 border border-white/50 rounded-lg">
                    <span className="text-[#8E6B23] uppercase text-[9px] tracking-widest font-bold flex items-center gap-1.5 mb-1">
                      <Briefcase className="w-3 h-3 text-[#B38B36]" /> Career
                    </span>
                    <p className="text-[#5C4D43] font-light">{today.career}</p>
                  </div>
                  <div className="p-3 bg-white/30 border border-white/50 rounded-lg">
                    <span className="text-[#8E6B23] uppercase text-[9px] tracking-widest font-bold flex items-center gap-1.5 mb-1">
                      <TrendingUp className="w-3 h-3 text-[#B38B36]" /> Wealth
                    </span>
                    <p className="text-[#5C4D43] font-light">{today.finance}</p>
                  </div>
                  <div className="p-3 bg-white/30 border border-white/50 rounded-lg">
                    <span className="text-[#8E6B23] uppercase text-[9px] tracking-widest font-bold flex items-center gap-1.5 mb-1">
                      <Heart className="w-3 h-3 text-[#B38B36]" /> Relations
                    </span>
                    <p className="text-[#5C4D43] font-light">{today.relationship}</p>
                  </div>
                  <div className="p-3 bg-white/30 border border-white/50 rounded-lg">
                    <span className="text-[#8E6B23] uppercase text-[9px] tracking-widest font-bold flex items-center gap-1.5 mb-1">
                      <Activity className="w-3 h-3 text-[#B38B36]" /> Health
                    </span>
                    <p className="text-[#5C4D43] font-light">{today.health}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* TOMORROW'S PREDICTION */}
            <div className="bg-white/50 border border-white/60 shadow-sm rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
              <div className="flex items-center justify-between mb-4 border-b border-[#B38B36]/15 pb-3">
                <h4 className="font-serif text-lg text-[#3C2A21] font-medium flex items-center gap-2">
                  <Moon className="w-4 h-4 text-[#B38B36]" /> Tomorrow's Forecast
                </h4>
                <span className="text-[8px] uppercase tracking-widest font-bold text-[#6E5D53]">Preview</span>
              </div>
              <div className="space-y-4 text-xs leading-relaxed">
                <div className="p-3 bg-white/70 border border-white/80 rounded-lg border-l-2 border-[#8E6B23] shadow-sm">
                  <strong className="text-[#8E6B23] uppercase text-[9px] tracking-widest block mb-1">Tomorrow's Energy</strong>
                  <p className="text-[#3C2A21] italic">"{tomorrow.energy}"</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white/30 border border-white/50 rounded-lg">
                    <span className="text-[#8E6B23] uppercase text-[9px] tracking-widest font-bold flex items-center gap-1.5 mb-1">
                      <Briefcase className="w-3 h-3 text-[#B38B36]" /> Work
                    </span>
                    <p className="text-[#5C4D43] font-light">{tomorrow.career}</p>
                  </div>
                  <div className="p-3 bg-white/30 border border-white/50 rounded-lg">
                    <span className="text-[#8E6B23] uppercase text-[9px] tracking-widest font-bold flex items-center gap-1.5 mb-1">
                      <TrendingUp className="w-3 h-3 text-[#B38B36]" /> Finance
                    </span>
                    <p className="text-[#5C4D43] font-light">{tomorrow.finance}</p>
                  </div>
                  <div className="p-3 bg-white/30 border border-white/50 rounded-lg">
                    <span className="text-[#8E6B23] uppercase text-[9px] tracking-widest font-bold flex items-center gap-1.5 mb-1">
                      <Heart className="w-3 h-3 text-[#B38B36]" /> Love
                    </span>
                    <p className="text-[#5C4D43] font-light">{tomorrow.relationship}</p>
                  </div>
                  <div className="p-3 bg-white/30 border border-white/50 rounded-lg">
                    <span className="text-[#8E6B23] uppercase text-[9px] tracking-widest font-bold flex items-center gap-1.5 mb-1">
                      <Activity className="w-3 h-3 text-[#B38B36]" /> Wellness
                    </span>
                    <p className="text-[#5C4D43] font-light">{tomorrow.health}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* WEEKLY FORECAST (Premium) */}
            <div className="bg-white/50 border border-white/60 shadow-sm rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
              <div className="flex items-center justify-between mb-4 border-b border-[#B38B36]/15 pb-3">
                <h4 className="font-serif text-lg text-[#3C2A21] font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#B38B36]" /> Weekly Forecast
                </h4>
                {!isPaid ? (
                  <span className="text-[8px] uppercase tracking-widest font-bold text-[#8E6B23] flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5 text-[#B38B36]" /> Premium
                  </span>
                ) : (
                  <span className="text-[8px] uppercase tracking-widest font-bold text-green-600">Unlocked</span>
                )}
              </div>
              
              <div className="relative">
                <div className={`space-y-4 text-xs leading-relaxed transition-all duration-700 ${!isPaid ? 'blur-sm select-none pointer-events-none' : ''}`}>
                  <div className="p-3 bg-white/70 border border-white/80 rounded-lg border-l-2 border-[#B38B36] shadow-sm">
                    <strong className="text-[#8E6B23] uppercase text-[9px] tracking-widest block mb-1">Weekly Focus</strong>
                    <p className="text-[#3C2A21] italic">"{weekly.overall}"</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/30 border border-white/50 rounded-lg">
                      <span className="text-[#8E6B23] uppercase text-[9px] tracking-widest font-bold flex items-center gap-1.5 mb-1">
                        <Briefcase className="w-3 h-3 text-[#B38B36]" /> Career
                      </span>
                      <p className="text-[#5C4D43] font-light">{weekly.career}</p>
                    </div>
                    <div className="p-3 bg-white/30 border border-white/50 rounded-lg">
                      <span className="text-[#8E6B23] uppercase text-[9px] tracking-widest font-bold flex items-center gap-1.5 mb-1">
                        <TrendingUp className="w-3 h-3 text-[#B38B36]" /> Wealth
                      </span>
                      <p className="text-[#5C4D43] font-light">{weekly.finance}</p>
                    </div>
                    <div className="p-3 bg-white/30 border border-white/50 rounded-lg">
                      <span className="text-[#8E6B23] uppercase text-[9px] tracking-widest font-bold flex items-center gap-1.5 mb-1">
                        <Heart className="w-3 h-3 text-[#B38B36]" /> Relations
                      </span>
                      <p className="text-[#5C4D43] font-light">{weekly.relationship}</p>
                    </div>
                    <div className="p-3 bg-white/30 border border-white/50 rounded-lg">
                      <span className="text-[#8E6B23] uppercase text-[9px] tracking-widest font-bold flex items-center gap-1.5 mb-1">
                        <Activity className="w-3 h-3 text-[#B38B36]" /> Health
                      </span>
                      <p className="text-[#5C4D43] font-light">{weekly.health}</p>
                    </div>
                  </div>
                </div>

                {!isPaid && (
                  <div className="absolute inset-0 bg-transparent flex flex-col items-center justify-center text-center cursor-pointer p-4" onClick={handlePayment}>
                    <Lock className="w-6 h-6 text-[#B38B36] mb-1 animate-pulse" />
                    <span className="text-[10px] text-[#8E6B23] uppercase tracking-wider font-bold">Unlock Weekly Forecast</span>
                  </div>
                )}
              </div>
            </div>

            {/* MONTHLY FORECAST (Premium) */}
            <div className="bg-white/50 border border-white/60 shadow-sm rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
              <div className="flex items-center justify-between mb-4 border-b border-[#B38B36]/15 pb-3">
                <h4 className="font-serif text-lg text-[#3C2A21] font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#B38B36]" /> Monthly Forecast
                </h4>
                {!isPaid ? (
                  <span className="text-[8px] uppercase tracking-widest font-bold text-[#8E6B23] flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5 text-[#B38B36]" /> Premium
                  </span>
                ) : (
                  <span className="text-[8px] uppercase tracking-widest font-bold text-green-600">Unlocked</span>
                )}
              </div>
              
              <div className="relative">
                <div className={`space-y-4 text-xs leading-relaxed transition-all duration-700 ${!isPaid ? 'blur-sm select-none pointer-events-none' : ''}`}>
                  <div className="p-3 bg-white/70 border border-white/80 rounded-lg border-l-2 border-[#B38B36] shadow-sm">
                    <strong className="text-[#8E6B23] uppercase text-[9px] tracking-widest block mb-1">Monthly Focus</strong>
                    <p className="text-[#3C2A21] italic">"{monthly.overall}"</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/30 border border-white/50 rounded-lg">
                      <span className="text-[#8E6B23] uppercase text-[9px] tracking-widest font-bold flex items-center gap-1.5 mb-1">
                        <Briefcase className="w-3 h-3 text-[#B38B36]" /> Career
                      </span>
                      <p className="text-[#5C4D43] font-light">{monthly.career}</p>
                    </div>
                    <div className="p-3 bg-white/30 border border-white/50 rounded-lg">
                      <span className="text-[#8E6B23] uppercase text-[9px] tracking-widest font-bold flex items-center gap-1.5 mb-1">
                        <TrendingUp className="w-3 h-3 text-[#B38B36]" /> Wealth
                      </span>
                      <p className="text-[#5C4D43] font-light">{monthly.finance}</p>
                    </div>
                    <div className="p-3 bg-white/30 border border-white/50 rounded-lg">
                      <span className="text-[#8E6B23] uppercase text-[9px] tracking-widest font-bold flex items-center gap-1.5 mb-1">
                        <Heart className="w-3 h-3 text-[#B38B36]" /> Relations
                      </span>
                      <p className="text-[#5C4D43] font-light">{monthly.relationship}</p>
                    </div>
                    <div className="p-3 bg-white/30 border border-white/50 rounded-lg">
                      <span className="text-[#8E6B23] uppercase text-[9px] tracking-widest font-bold flex items-center gap-1.5 mb-1">
                        <Activity className="w-3 h-3 text-[#B38B36]" /> Health
                      </span>
                      <p className="text-[#5C4D43] font-light">{monthly.health}</p>
                    </div>
                  </div>
                </div>

                {!isPaid && (
                  <div className="absolute inset-0 bg-transparent flex flex-col items-center justify-center text-center cursor-pointer p-4" onClick={handlePayment}>
                    <Lock className="w-6 h-6 text-[#B38B36] mb-1 animate-pulse" />
                    <span className="text-[10px] text-[#8E6B23] uppercase tracking-wider font-bold">Unlock Monthly Forecast</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT: Detailed Life Report Panels */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white/55 border border-white/70 shadow-md rounded-2xl p-6 md:p-8 relative overflow-hidden backdrop-blur-xl">
              <h4 className="font-serif text-2xl text-[#3C2A21] mb-6 border-b border-[#B38B36]/15 pb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#B38B36]" /> Detailed Destiny Analysis
              </h4>

              <div className="space-y-8">
                {/* 1. Personality Analysis */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-serif font-bold text-[#3C2A21] uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span>Personality Analysis</span>
                    <span className="text-[8px] uppercase px-1.5 py-0.5 border border-green-200 text-green-600 bg-green-50/50 rounded tracking-widest font-semibold ml-2">Free Reveal</span>
                  </div>
                  <div className="text-xs text-[#3C2A21] space-y-3 pl-4 border-l border-[#B38B36]/20 leading-relaxed font-light">
                    <p><strong>Core Strengths:</strong> {lifeReport.personality?.strengths}</p>
                    <p><strong>Undercurrent Weaknesses:</strong> {lifeReport.personality?.weaknesses}</p>
                    <p><strong>Latent Talents:</strong> {lifeReport.personality?.hidden_talents}</p>
                    <p><strong>Emotional Chemistry:</strong> {lifeReport.personality?.emotional_nature}</p>
                  </div>
                </div>

                {/* 2. Career Analysis */}
                <div className="space-y-3 relative">
                  <div className="flex items-center justify-between text-sm font-serif font-bold text-[#3C2A21] uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isPaid ? 'bg-green-500' : 'bg-[#B38B36]/60'}`} />
                      <span>Career Forecast</span>
                    </div>
                    {!isPaid && <Lock className="w-3.5 h-3.5 text-[#B38B36]" />}
                  </div>
                  <div className={`text-xs text-[#5C4D43] space-y-3 pl-4 border-l border-[#B38B36]/20 leading-relaxed font-light transition-all duration-700 ${!isPaid ? 'blur-sm select-none pointer-events-none' : ''}`}>
                    <p><strong>Growth Timeline:</strong> {lifeReport.career?.growth}</p>
                    <p><strong>Business Potential:</strong> {lifeReport.career?.business}</p>
                    <p><strong>Leadership Styles:</strong> {lifeReport.career?.leadership}</p>
                  </div>
                </div>

                {/* 3. Relationship Analysis */}
                <div className="space-y-3 relative">
                  <div className="flex items-center justify-between text-sm font-serif font-bold text-[#3C2A21] uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isPaid ? 'bg-green-500' : 'bg-[#B38B36]/60'}`} />
                      <span>Marriage & Compatibility</span>
                    </div>
                    {!isPaid && <Lock className="w-3.5 h-3.5 text-[#B38B36]" />}
                  </div>
                  <div className={`text-xs text-[#5C4D43] space-y-3 pl-4 border-l border-[#B38B36]/20 leading-relaxed font-light transition-all duration-700 ${!isPaid ? 'blur-sm select-none pointer-events-none' : ''}`}>
                    <p><strong>Marriage Outlook:</strong> {lifeReport.relationship?.marriage}</p>
                    <p><strong>Vedic Compatibility:</strong> {lifeReport.relationship?.compatibility}</p>
                    <p><strong>Domestic Alignment:</strong> {lifeReport.relationship?.family}</p>
                  </div>
                </div>

                {/* 4. Financial Analysis */}
                <div className="space-y-3 relative">
                  <div className="flex items-center justify-between text-sm font-serif font-bold text-[#3C2A21] uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isPaid ? 'bg-green-500' : 'bg-[#B38B36]/60'}`} />
                      <span>Wealth & Resource Forecast</span>
                    </div>
                    {!isPaid && <Lock className="w-3.5 h-3.5 text-[#B38B36]" />}
                  </div>
                  <div className={`text-xs text-[#5C4D43] space-y-3 pl-4 border-l border-[#B38B36]/20 leading-relaxed font-light transition-all duration-700 ${!isPaid ? 'blur-sm select-none pointer-events-none' : ''}`}>
                    <p><strong>Wealth Potential:</strong> {lifeReport.financial?.wealth}</p>
                    <p><strong>Habits & Security:</strong> {lifeReport.financial?.habits}</p>
                    <p><strong>Abundance Windows:</strong> {lifeReport.financial?.opportunities}</p>
                  </div>
                </div>

                {/* 5. Health Analysis */}
                <div className="space-y-3 relative">
                  <div className="flex items-center justify-between text-sm font-serif font-bold text-[#3C2A21] uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isPaid ? 'bg-green-500' : 'bg-[#B38B36]/60'}`} />
                      <span>Health & Vitality Guide</span>
                    </div>
                    {!isPaid && <Lock className="w-3.5 h-3.5 text-[#B38B36]" />}
                  </div>
                  <div className={`text-xs text-[#5C4D43] space-y-3 pl-4 border-l border-[#B38B36]/20 leading-relaxed font-light transition-all duration-700 ${!isPaid ? 'blur-sm select-none pointer-events-none' : ''}`}>
                    <p><strong>Physical Constitution:</strong> {lifeReport.health?.physical}</p>
                    <p><strong>Mental Harmony:</strong> {lifeReport.health?.mental}</p>
                    <p><strong>Lifestyle Roadmap:</strong> {lifeReport.health?.lifestyle}</p>
                  </div>
                </div>

                {/* 6. Spiritual Analysis */}
                <div className="space-y-3 relative">
                  <div className="flex items-center justify-between text-sm font-serif font-bold text-[#3C2A21] uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isPaid ? 'bg-green-500' : 'bg-[#B38B36]/60'}`} />
                      <span>Karma & Soul Purpose</span>
                    </div>
                    {!isPaid && <Lock className="w-3.5 h-3.5 text-[#B38B36]" />}
                  </div>
                  <div className={`text-xs text-[#5C4D43] space-y-3 pl-4 border-l border-[#B38B36]/20 leading-relaxed font-light transition-all duration-700 ${!isPaid ? 'blur-sm select-none pointer-events-none' : ''}`}>
                    <p><strong>Karmic Debt (Saturn):</strong> {lifeReport.spiritual?.karma}</p>
                    <p><strong>Soul Lessons:</strong> {lifeReport.spiritual?.lessons}</p>
                    <p><strong>Divine Mission:</strong> {lifeReport.spiritual?.purpose}</p>
                  </div>
                </div>
              </div>

              {/* PREMIUM LOCK CONVERSION COVER */}
              {!isPaid && (
                <div className="absolute inset-x-0 bottom-0 top-[22%] bg-gradient-to-t from-[#FFFDF9] via-[#FFFDF9]/95 to-transparent flex flex-col justify-end p-6 md:p-8 text-center backdrop-blur-[2px]">
                  <div className="bg-white/90 border border-white rounded-2xl p-6 md:p-8 max-w-md mx-auto shadow-[0_20px_45px_rgba(179,139,54,0.15)] relative z-10">
                    <div className="w-12 h-12 rounded-full bg-[#B38B36]/10 border border-[#B38B36]/35 flex items-center justify-center mx-auto mb-4 text-[#B38B36]">
                      <Lock className="w-5 h-5 animate-pulse" />
                    </div>
                    <h5 className="font-serif text-lg text-[#3C2A21] mb-2 font-bold">Your Complete Destiny Report Is Ready</h5>
                    <p className="text-[11px] text-[#6E5D53] leading-relaxed mb-6 font-light">
                      Get immediate access to your full personalized life analysis, career roadmap, wealth outlook, marriage details, and monthly forecasts.
                    </p>
                    <button
                      onClick={handlePayment}
                      disabled={processingPayment}
                      className="w-full py-3.5 bg-gradient-to-r from-[#B38B36] to-[#8E6B23] hover:from-[#8E6B23] hover:to-[#3C2A21] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-500 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Unlock className="w-3.5 h-3.5 text-white" />
                      <span>Unlock Premium Report</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* NESTED DIALOG: DEVELOPMENT MOCK AUTHORIZATION PANEL */}
      <Dialog open={showMockModal} onOpenChange={(v) => !v && setShowMockModal(false)}>
        <DialogContent className="max-w-md p-6 bg-[#FFFDF9] border border-white/90 text-[#3C2A21] font-[Outfit,sans-serif] rounded-2xl shadow-2xl relative overflow-hidden">
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

    </div>
  );
};

export default PaymentPage;
