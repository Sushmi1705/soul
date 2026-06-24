import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Moon, 
  Star, 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
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
  Activity
} from "lucide-react";

const LOADING_MESSAGES = [
  "Mapping planetary coordinates...",
  "Calculating Nakshatra alignment...",
  "Synthesizing Lagna (Rising Sign) aspects...",
  "Aligning birth chart with today's transits...",
  "Consulting the celestial blueprint..."
];

const HoroscopeFlowModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState("form"); // "form" | "loading" | "report"
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    tob: "",
    pob: ""
  });
  
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [report, setReport] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  
  const [showPaymentGateways, setShowPaymentGateways] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [unlockedReportText, setUnlockedReportText] = useState(null);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8005";

  // Load countries on mount
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // Handle Country Change
  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);
    setSelectedState("");
    setSelectedCity("");
    
    if (countryCode) {
      const countryStates = State.getStatesOfCountry(countryCode);
      setStates(countryStates);
      
      if (countryStates.length === 0) {
        setCities(City.getCitiesOfCountry(countryCode));
      } else {
        setCities([]);
      }
    } else {
      setStates([]);
      setCities([]);
    }
  };

  // Handle State Change
  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    setSelectedState(stateCode);
    setSelectedCity("");
    
    if (stateCode) {
      setCities(City.getCitiesOfState(selectedCountry, stateCode));
    } else {
      setCities([]);
    }
  };

  // Handle City Change
  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
  };

  // Sync country, state, city to formData.pob
  useEffect(() => {
    if (selectedCountry && selectedCity) {
      const countryObj = Country.getCountryByCode(selectedCountry);
      const stateObj = selectedState ? State.getStateByCodeAndCountry(selectedState, selectedCountry) : null;
      
      const parts = [
        selectedCity,
        stateObj ? stateObj.name : "",
        countryObj ? countryObj.name : ""
      ].filter(Boolean);
      
      setFormData((prev) => ({
        ...prev,
        pob: parts.join(", ")
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        pob: ""
      }));
    }
  }, [selectedCountry, selectedState, selectedCity]);

  // Reset state when modal is closed/opened
  useEffect(() => {
    if (!open) {
      setStep("form");
      setFormData({ name: "", dob: "", tob: "", pob: "" });
      setReport(null);
      setIsPaid(false);
      setPdfUrl("");
      setShowPaymentGateways(false);
      setSelectedGateway("");
      setProcessingPayment(false);
      setPaymentSuccess(false);
      setUnlockedReportText(null);
      setSelectedCountry("");
      setSelectedState("");
      setSelectedCity("");
    }
  }, [open]);

  // Cycle loading messages
  useEffect(() => {
    let timer;
    if (step === "loading") {
      timer = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 1500);
    } else {
      setLoadingMessageIndex(0);
    }
    return () => clearInterval(timer);
  }, [step]);

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.dob || !formData.tob || !formData.pob) {
      toast.error("Please fill in Birth Date, Birth Time, and Place of Birth.");
      return;
    }

    setSubmitting(true);
    setStep("loading");

    try {
      const response = await fetch(`${apiUrl}/api/horoscope/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (response.ok) {
        // Artificially wait to show the cosmic loading animations
        setTimeout(() => {
          setReport(data);
          setStep("report");
          toast.success("Cosmic blueprint synthesized successfully!");
        }, 3000);
      } else {
        toast.error(data.detail || "Failed to generate horoscope. Try again.");
        setStep("form");
      }
    } catch (error) {
      console.error("Horoscope error:", error);
      toast.error("Connection failed. Could not reach celestial servers.");
      setStep("form");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnlockClick = () => {
    onClose();
    setTimeout(() => {
      navigate(`/payment?reportId=${report.id}`);
    }, 150);
  };

  const handlePay = async (gateway) => {
    setSelectedGateway(gateway);
    setProcessingPayment(true);

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      setPaymentSuccess(true);
      
      const response = await fetch(`${apiUrl}/api/horoscope/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report_id: report.id,
          payment_method: gateway,
          payment_id: `MOCK_TXN_${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        })
      });

      const data = await response.json();
      if (response.ok) {
        setTimeout(() => {
          setIsPaid(true);
          setPdfUrl(data.pdfUrl || `${apiUrl}${data.pdf_url}`);
          setUnlockedReportText(data.life_report);
          setShowPaymentGateways(false);
          setProcessingPayment(false);
          setPaymentSuccess(false);
          toast.success("Destiny Report Unlocked! Details are fully revealed.");
        }, 1500);
      } else {
        toast.error("Verification failed. Please retry checkout.");
        setProcessingPayment(false);
        setPaymentSuccess(false);
      }
    } catch (error) {
      console.error("Payment unlock error:", error);
      toast.error("Failed to connect for payment validation.");
      setProcessingPayment(false);
      setPaymentSuccess(false);
    }
  };

  const getAstroData = () => {
    if (!report) return {};
    return report.astrology_details;
  };

  const today = report?.today_prediction || {};
  const tomorrow = report?.tomorrow_prediction || {};
  const lifeReport = unlockedReportText || report?.life_report || {};

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-testid="horoscope-modal"
        className="!max-w-6xl p-0 bg-[#FFFDF9] border border-white/80 overflow-hidden rounded-none sm:rounded-2xl w-screen h-[100dvh] sm:h-auto sm:w-full max-h-[100dvh] sm:max-h-[90vh] text-[#3C2A21] font-[Outfit,sans-serif] shadow-[0_25px_60px_rgba(60,42,33,0.18)]"
      >
        <DialogTitle className="sr-only">Cosmic Horoscope Center</DialogTitle>
        <DialogDescription className="sr-only">
          Fill in birth data to align planetary coordinates and reveal your daily cosmic predictions.
        </DialogDescription>

        <div className="h-[100dvh] sm:h-[85vh] flex flex-col overflow-hidden relative">
          
          {/* Layered Animated Cosmic Nebula Background */}
          <div className="absolute inset-0 bg-[#FFFDF9] pointer-events-none z-0" />
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#E8D9FC]/50 blur-[110px] pointer-events-none z-0 nebula-glow-1" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#FDE7BA]/50 blur-[130px] pointer-events-none z-0 nebula-glow-2" />
          <div className="absolute top-[30%] right-[20%] w-[400px] h-[400px] rounded-full bg-[#FCD8E3]/40 blur-[100px] pointer-events-none z-0 nebula-glow-3" />
          
          {/* Subtle celestial refraction overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.7),transparent_80%)] pointer-events-none z-0" />

          {/* Large background zodiac wheel watermark */}
          <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-[0.03] select-none">
            <svg viewBox="0 0 1000 1000" className="w-[120%] h-[120%] text-[#B38B36] fill-none stroke-current stroke-[0.5] animate-[spinSlow_150s_linear_infinite]">
              <circle cx="500" cy="500" r="480" />
              <circle cx="500" cy="500" r="320" strokeDasharray="5 5" />
              {Array.from({ length: 12 }).map((_, i) => (
                <line
                  key={i}
                  x1="500" y1="500"
                  x2={500 + Math.cos((i * Math.PI * 2) / 12) * 480}
                  y2={500 + Math.sin((i * Math.PI * 2) / 12) * 480}
                />
              ))}
            </svg>
          </div>

          {/* Floating Magic Stars */}
          <div className="absolute top-20 left-10 w-2.5 h-2.5 rounded-full bg-[#B38B36]/50 blur-[1px] animate-[floatMagic_6s_infinite] pointer-events-none" />
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-[#BA68C8]/40 blur-[1px] animate-[floatMagic_8s_infinite] pointer-events-none" style={{ animationDelay: '1.5s' }} />
          <div className="absolute bottom-20 left-1/3 w-3 h-3 rounded-full bg-[#E5C06A]/50 blur-[1px] animate-[floatMagic_7s_infinite] pointer-events-none" style={{ animationDelay: '3s' }} />
          <div className="absolute bottom-40 right-1/3 w-2 h-2 rounded-full bg-[#B38B36]/40 blur-[1px] animate-[floatMagic_5s_infinite] pointer-events-none" style={{ animationDelay: '4.5s' }} />
          
          <div className="absolute top-10 right-10 w-2 h-2 rounded-full bg-[#E5C06A]/40 blur-[1px] animate-[floatMagic_9s_infinite] pointer-events-none" style={{ animationDelay: '0.8s' }} />
          <div className="absolute top-60 left-20 w-3.5 h-3.5 rounded-full bg-[#BA68C8]/30 blur-[1px] animate-[floatMagic_11s_infinite] pointer-events-none" style={{ animationDelay: '2.2s' }} />
          <div className="absolute bottom-10 right-10 w-2.5 h-2.5 rounded-full bg-[#B38B36]/50 blur-[1px] animate-[floatMagic_7.5s_infinite] pointer-events-none" style={{ animationDelay: '3.7s' }} />
          <div className="absolute bottom-60 left-10 w-2.5 h-2.5 rounded-full bg-[#E5C06A]/40 blur-[1px] animate-[floatMagic_5.5s_infinite] pointer-events-none" style={{ animationDelay: '5.2s' }} />

          {/* Header */}
          <header className="relative z-10 border-b border-[#B38B36]/15 bg-white/45 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B38B36]/10 border border-[#B38B36]/30 flex items-center justify-center text-[#B38B36] shadow-sm">
                <Moon className="w-4 h-4 text-[#B38B36] animate-spin-slow" />
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-[#3C2A21] font-serif">Astro Power 24</h2>
                <p className="text-[10px] text-[#8E6B23] tracking-widest uppercase font-semibold">Celestial Reading Room</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-[#6E5D53] hover:text-[#3C2A21] border border-white/60 hover:border-[#B38B36]/40 px-3.5 py-2 text-[9px] uppercase tracking-widest font-bold bg-white/70 hover:bg-white transition-all rounded-lg shadow-sm cursor-pointer"
            >
              Close
            </button>
          </header>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto relative z-10 flex flex-col">
            
            {/* STEP 1: FORM */}
            {step === "form" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex-1 grid lg:grid-cols-12 h-full overflow-hidden"
              >
                {/* Left Side: Magical Cosmic Graphic & Info */}
                <div className="lg:col-span-5 hidden lg:flex flex-col justify-center items-center p-8 border-r border-[#B38B36]/15 relative bg-[#FFFDF9]/20 backdrop-blur-sm">
                  {/* Glowing background circles for the graphic */}
                  <div className="absolute w-64 h-64 bg-[#B38B36]/5 rounded-full blur-2xl pointer-events-none" />
                  
                  {/* Detailed Constellation Graphic */}
                  <div className="relative w-72 h-72 mb-8 animate-[spinSlow_60s_linear_infinite]">
                    <svg viewBox="0 0 200 200" className="w-full h-full text-[#B38B36]/25 fill-none">
                      <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="0.5" />
                      <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
                      <circle cx="100" cy="100" r="45" stroke="currentColor" strokeWidth="0.5" />
                      
                      {/* Compass points */}
                      <text x="96" y="15" className="text-[6px] fill-[#B38B36] font-serif uppercase tracking-widest font-bold">N</text>
                      <text x="96" y="193" className="text-[6px] fill-[#B38B36] font-serif uppercase tracking-widest font-bold">S</text>
                      <text x="188" y="102" className="text-[6px] fill-[#B38B36] font-serif uppercase tracking-widest font-bold">E</text>
                      <text x="6" y="102" className="text-[6px] fill-[#B38B36] font-serif uppercase tracking-widest font-bold">W</text>
                      
                      {/* Celestial coordinates */}
                      <path d="M 10 100 L 190 100 M 100 10 L 100 190" stroke="currentColor" strokeWidth="0.25" />
                      <path d="M 36.3 36.3 L 163.7 163.7 M 36.3 163.7 L 163.7 36.3" stroke="currentColor" strokeWidth="0.15" />
                      
                      {/* Constellation line connections */}
                      <polyline points="45,65 75,55 100,45 135,45 160,65" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
                      <polyline points="35,120 70,115 100,125 140,110" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
                      
                      {/* Twinkling Star Coordinates */}
                      <circle cx="45" cy="65" r="1.5" className="fill-[#B38B36] animate-pulse" />
                      <circle cx="75" cy="55" r="1" className="fill-[#B38B36]" />
                      <circle cx="100" cy="45" r="2" className="fill-[#B38B36] animate-pulse" />
                      <circle cx="135" cy="45" r="1" className="fill-[#B38B36]" />
                      <circle cx="160" cy="65" r="1.5" className="fill-[#B38B36]" />
                      <circle cx="35" cy="120" r="2" className="fill-[#B38B36] animate-pulse" />
                      <circle cx="70" cy="115" r="1" className="fill-[#B38B36]" />
                      <circle cx="100" cy="125" r="1.5" className="fill-[#B38B36]" />
                      <circle cx="140" cy="110" r="2" className="fill-[#B38B36] animate-pulse" />
                    </svg>
                    
                    {/* Inner glowing sun symbol */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border border-[#B38B36]/20 bg-white/60 flex items-center justify-center text-[#B38B36] shadow-sm">
                        <Sparkles className="w-5 h-5 animate-pulse" />
                      </div>
                    </div>
                  </div>

                  <div className="text-center max-w-xs relative z-10 px-4">
                    <span className="text-[8px] uppercase tracking-[0.3em] text-[#8E6B23] font-bold block mb-2">Astrological Ephemeris</span>
                    <h4 className="font-serif text-xl text-[#3C2A21] font-semibold mb-2">Map Your Cosmic Chart</h4>
                    <p className="text-xs text-[#6E5D53] leading-relaxed font-light">
                      Align your natal variables with exact planetary positions. Our system maps the cosmos relative to your precise time and place of birth.
                    </p>
                  </div>
                </div>

                {/* Right Side: Clean, High-Contrast Form */}
                <div className="lg:col-span-7 flex flex-col justify-center items-center p-6 md:p-12 overflow-y-auto">
                  <div className="max-w-md w-full bg-gradient-to-b from-[#FFFDF9]/95 to-[#FFF9ED]/90 border border-[#B38B36]/25 rounded-[2rem] p-[4px] shadow-[0_20px_50px_rgba(179,139,54,0.12)] relative backdrop-blur-xl">
                    <div className="border border-[#B38B36]/15 rounded-[1.8rem] p-6 md:p-8 bg-white/70 relative">
                      
                      {/* Corner Star Accents */}
                      <div className="absolute top-3 left-3 text-[#B38B36]/40 select-none pointer-events-none text-[10px] animate-pulse">✦</div>
                      <div className="absolute top-3 right-3 text-[#B38B36]/40 select-none pointer-events-none text-[10px] animate-pulse" style={{ animationDelay: '0.5s' }}>✦</div>
                      <div className="absolute bottom-3 left-3 text-[#B38B36]/40 select-none pointer-events-none text-[10px] animate-pulse" style={{ animationDelay: '1s' }}>✦</div>
                      <div className="absolute bottom-3 right-3 text-[#B38B36]/40 select-none pointer-events-none text-[10px] animate-pulse" style={{ animationDelay: '1.5s' }}>✦</div>

                      <div className="text-center mb-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-[#B38B36]/20 rounded-full bg-[#B38B36]/5 text-[9px] tracking-widest uppercase text-[#8E6B23] font-bold mb-3">
                          ✨ Personal Daily Oracle
                        </span>
                        <h3 className="font-serif text-3xl md:text-4xl text-[#3C2A21] font-medium leading-tight tracking-wide mb-2 shimmer-gold-text">
                          Map Your Birth Chart
                        </h3>
                        <p className="text-xs text-[#6E5D53] font-light leading-relaxed">
                          Align your natal variables with exact planetary coordinates to reveal today's tailored predictions.
                        </p>
                      </div>

                      <form onSubmit={handleFormSubmit} className="space-y-4">
                        {/* Name */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-[0.25em] text-[#8E6B23] font-serif block font-bold mb-1">Full Name</label>
                          <div className="relative">
                            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B38B36]" />
                            <Input
                              name="name"
                              placeholder="Your full name (optional)"
                              value={formData.name}
                              onChange={handleFormChange}
                              className="pl-[44px] h-12 bg-white/85 hover:bg-white border-[#B38B36]/30 hover:border-[#B38B36]/60 focus-visible:ring-1 focus-visible:ring-[#B38B36] focus-visible:border-[#B38B36] text-[#3C2A21] placeholder-stone-400 rounded-xl text-sm shadow-sm transition-all duration-300"
                            />
                          </div>
                        </div>

                        {/* Date and Time */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Date */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-[0.25em] text-[#8E6B23] font-serif block font-bold mb-1">Date of Birth</label>
                            <div className="relative">
                              <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B38B36]" />
                              <Input
                                name="dob"
                                required
                                type="date"
                                value={formData.dob}
                                onChange={handleFormChange}
                                className="pl-[44px] h-12 bg-white/85 hover:bg-white border-[#B38B36]/30 hover:border-[#B38B36]/60 focus-visible:ring-1 focus-visible:ring-[#B38B36] focus-visible:border-[#B38B36] text-[#3C2A21] rounded-xl text-sm shadow-sm cursor-pointer transition-all duration-300"
                              />
                            </div>
                          </div>

                          {/* Time */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-[0.25em] text-[#8E6B23] font-serif block font-bold mb-1">Birth Time</label>
                            <div className="relative">
                              <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B38B36]" />
                              <Input
                                name="tob"
                                required
                                type="time"
                                value={formData.tob}
                                onChange={handleFormChange}
                                className="pl-[44px] h-12 bg-white/85 hover:bg-white border-[#B38B36]/30 hover:border-[#B38B36]/60 focus-visible:ring-1 focus-visible:ring-[#B38B36] focus-visible:border-[#B38B36] text-[#3C2A21] rounded-xl text-sm shadow-sm cursor-pointer transition-all duration-300"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Birth Place (3 Dropdowns) */}
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-[0.25em] text-[#8E6B23] font-serif block font-bold mb-1">Place of Birth</label>
                          <div className="flex flex-col gap-2">
                            {/* Country Selector */}
                            <div className="relative">
                              <select
                                required
                                value={selectedCountry}
                                onChange={handleCountryChange}
                                className="w-full h-12 px-3 bg-white/85 hover:bg-white border-[#B38B36]/30 hover:border-[#B38B36]/60 focus:ring-1 focus:ring-[#B38B36] focus:border-[#B38B36] text-[#3C2A21] rounded-xl text-sm shadow-sm cursor-pointer outline-none transition-all duration-300"
                              >
                                <option value="" className="bg-[#FFFDF9] text-[#3C2A21]">Select Country</option>
                                {countries.map((c) => (
                                  <option key={c.isoCode} value={c.isoCode} className="bg-[#FFFDF9] text-[#3C2A21]">
                                    {c.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* State Selector */}
                            {states.length > 0 && (
                              <div className="relative">
                                <select
                                  required
                                  value={selectedState}
                                  onChange={handleStateChange}
                                  className="w-full h-12 px-3 bg-white/85 hover:bg-white border-[#B38B36]/30 hover:border-[#B38B36]/60 focus:ring-1 focus:ring-[#B38B36] focus:border-[#B38B36] text-[#3C2A21] rounded-xl text-sm shadow-sm cursor-pointer outline-none transition-all duration-300"
                                >
                                  <option value="" className="bg-[#FFFDF9] text-[#3C2A21]">Select State</option>
                                  {states.map((s) => (
                                    <option key={s.isoCode} value={s.isoCode} className="bg-[#FFFDF9] text-[#3C2A21]">
                                      {s.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}

                            {/* City Selector */}
                            <div className="relative">
                              <select
                                required
                                disabled={!selectedCountry || (states.length > 0 && !selectedState)}
                                value={selectedCity}
                                onChange={handleCityChange}
                                className="w-full h-12 px-3 bg-white/85 hover:bg-white border-[#B38B36]/30 hover:border-[#B38B36]/60 focus:ring-1 focus:ring-[#B38B36] focus:border-[#B38B36] text-[#3C2A21] rounded-xl text-sm shadow-sm cursor-pointer outline-none transition-all duration-300 disabled:opacity-50"
                              >
                                <option value="" className="bg-[#FFFDF9] text-[#3C2A21]">Select City</option>
                                {cities.map((city, idx) => (
                                  <option key={idx} value={city.name} className="bg-[#FFFDF9] text-[#3C2A21]">
                                    {city.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full mt-6 py-4 animate-button-shimmer text-stone-950 hover:text-stone-950 font-serif font-bold tracking-[0.25em] uppercase rounded-xl transition-all duration-500 shadow-[0_10px_35px_rgba(179,139,54,0.25)] hover:shadow-[0_12px_40px_rgba(179,139,54,0.5)] flex items-center justify-center gap-2 text-xs cursor-pointer hover:scale-[1.02] border border-[#B38B36]/40"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                              <span>Synthesizing Chart...</span>
                            </>
                          ) : (
                            <>
                              <span>Generate Horoscope</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: COSMIC LOADING SCREEN */}
            {step === "loading" && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center p-8 text-center relative"
              >
                {/* Magical loading nebula aura */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(232,200,126,0.25),rgba(232,186,252,0.15),transparent_70%)] pointer-events-none z-0" />
                
                {/* Rotating Zodiac Wheel Animation */}
                <div className="relative w-48 h-48 mb-8 animate-[spinSlow_25s_linear_infinite] z-10">
                  <div className="absolute inset-0 bg-[#B38B36]/15 blur-3xl rounded-full animate-pulse" />
                  <svg viewBox="0 0 100 100" className="w-full h-full text-[#B38B36]/40 fill-none">
                    <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="0.25" />
                    {Array.from({ length: 12 }).map((_, i) => (
                      <line
                        key={i}
                        x1="50" y1="50"
                        x2={50 + Math.cos((i * Math.PI * 2) / 12) * 48}
                        y2={50 + Math.sin((i * Math.PI * 2) / 12) * 48}
                        stroke="currentColor" strokeWidth="0.25"
                      />
                    ))}
                  </svg>
                  
                  {/* Glowing central orb */}
                  <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-[#B38B36] shadow-[0_0_25px_rgba(179,139,54,0.65)] animate-ping" />
                    <Moon className="w-4 h-4 text-white absolute z-10" />
                  </div>
                </div>

                {/* Cyclic messages */}
                <div className="relative z-10">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={loadingMessageIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="text-[#8E6B23] font-serif text-lg tracking-wide uppercase font-semibold"
                    >
                      {LOADING_MESSAGES[loadingMessageIndex]}
                    </motion.p>
                  </AnimatePresence>
                  <p className="text-[10px] text-[#6E5D53] tracking-[0.3em] uppercase mt-3">Consulting planetary ephemeris</p>
                </div>
              </motion.div>
            )}

            {/* STEP 3: RESULTS PANEL */}
            {step === "report" && report && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 md:p-10 space-y-8 relative z-10"
              >
                
                {/* Introduction banner (frosted glass) */}
                <div className="border border-white/60 bg-white/45 shadow-[0_10px_30px_rgba(179,139,54,0.08)] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md relative overflow-hidden">
                  
                  {/* Tiny background line accents */}
                  <svg viewBox="0 0 100 100" className="absolute right-0 top-0 h-full text-[#B38B36]/5 fill-none pointer-events-none">
                    <circle cx="90" cy="10" r="40" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="90" cy="10" r="30" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                  </svg>

                  <div className="space-y-2 text-center md:text-left relative z-10">
                    <span className="text-[9px] tracking-widest text-[#8E6B23] uppercase font-black">Celestial Synthesis Completed</span>
                    <h3 className="font-serif text-3xl text-[#3C2A21] font-medium">
                      Divine Readings for <em className="italic text-[#8E6B23]">{report.name}</em>
                    </h3>
                    <p className="text-xs text-[#6E5D53] font-light">
                      Born on {new Date(report.dob).toLocaleDateString(undefined, { dateStyle: "long" })} at {report.tob} {report.pob && `in ${report.pob}`}
                    </p>
                  </div>
                  
                  {isPaid ? (
                    <a
                      href={pdfUrl}
                      download
                      className="px-6 py-3 bg-[#B38B36] hover:bg-[#8E6B23] text-white font-bold text-[10px] tracking-widest uppercase rounded-lg transition-all duration-300 flex items-center gap-2 shadow-md cursor-pointer relative z-10"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Full PDF Report</span>
                    </a>
                  ) : (
                    <button
                      onClick={handleUnlockClick}
                      className="px-6 py-3 bg-gradient-to-r from-[#B38B36] to-[#8E6B23] hover:from-[#8E6B23] hover:to-[#3C2A21] text-white font-bold text-[10px] tracking-widest uppercase rounded-lg transition-all duration-500 flex items-center gap-2 shadow-md cursor-pointer relative z-10 hover:scale-[1.02]"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Unlock Premium Report</span>
                    </button>
                  )}
                </div>

                {/* Grid of Astro parameters */}
                <div>
                  <h4 className="font-serif text-xl text-[#3C2A21] mb-4 border-l-2 border-[#B38B36] pl-3 uppercase tracking-wider text-sm font-semibold">
                    Astronomical Configurations
                  </h4>
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
                        className="bg-white/55 border border-white/70 shadow-sm hover:shadow-[0_8px_25px_rgba(179,139,54,0.12)] hover:border-[#B38B36]/40 hover:-translate-y-0.5 transition-all duration-300 rounded-xl p-4 flex flex-col justify-between text-center relative overflow-hidden group"
                      >
                        <span className="text-[8px] uppercase tracking-widest text-[#6E5D53] font-bold">{item.label}</span>
                        <div className="my-2 text-[#8E6B23] font-serif font-bold text-base line-clamp-1">
                          {item.value}
                        </div>
                        <span className="text-[8px] text-[#6E5D53]/70 italic font-light truncate">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Split columns: Daily Predictions vs Full Preview */}
                <div className="grid lg:grid-cols-12 gap-8">
                  
                  {/* LEFT: TODAY'S & TOMORROW'S PREDICTIONS */}
                  <div className="lg:col-span-5 space-y-6">
                    
                    {/* TODAY'S PREDICTION (glass style) */}
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

                    {/* TOMORROW'S PREDICTION (glass style) */}
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

                  </div>

                  {/* RIGHT: DETAILED LIFE REPORT PREVIEW */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    <div className="bg-white/55 border border-white/70 shadow-md rounded-2xl p-6 md:p-8 relative overflow-hidden backdrop-blur-xl">
                      <h4 className="font-serif text-2xl text-[#3C2A21] mb-6 border-b border-[#B38B36]/15 pb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#B38B36]" /> Detailed Destiny Analysis
                      </h4>

                      <div className="space-y-8">
                        {/* 1. Personality Analysis - UNLOCKED */}
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

                        {/* 2. Career Analysis - LOCKED */}
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

                        {/* 3. Relationship Analysis - LOCKED */}
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

                        {/* 4. Financial Analysis - LOCKED */}
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

                        {/* 5. Health Analysis - LOCKED */}
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

                        {/* 6. Spiritual Analysis - LOCKED */}
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
                        <div className="absolute inset-x-0 bottom-0 top-[20%] bg-gradient-to-t from-[#FFFDF9] via-[#FFFDF9]/95 to-transparent flex flex-col justify-end p-6 md:p-8 text-center backdrop-blur-[2px]">
                          <div className="bg-white/90 border border-white rounded-2xl p-6 md:p-8 max-w-md mx-auto shadow-[0_20px_45px_rgba(179,139,54,0.15)] relative z-10 animate-[glowPulse_4s_infinite_alternate]">
                            <div className="w-12 h-12 rounded-full bg-[#B38B36]/10 border border-[#B38B36]/35 flex items-center justify-center mx-auto mb-4 text-[#B38B36]">
                              <Lock className="w-5 h-5 animate-pulse" />
                            </div>
                            <h5 className="font-serif text-lg text-[#3C2A21] mb-2 font-bold">Your Complete Destiny Report Is Ready</h5>
                            <p className="text-[11px] text-[#6E5D53] leading-relaxed mb-6 font-light">
                              Get immediate access to your full personalized life analysis, career roadmap, wealth outlook, marriage details, and monthly forecasts.
                            </p>
                            <button
                              onClick={handleUnlockClick}
                              className="w-full py-3.5 bg-gradient-to-r from-[#B38B36] to-[#8E6B23] hover:from-[#8E6B23] hover:to-[#3C2A21] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-500 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
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

              </motion.div>
            )}

          </div>
        </div>
      </DialogContent>

      {/* NESTED DIALOG: SIMULATED PAYMENT GATEWAY */}
      <Dialog open={showPaymentGateways} onOpenChange={(v) => !v && !processingPayment && setShowPaymentGateways(false)}>
        <DialogContent className="max-w-md p-6 bg-[#FFFDF9] border border-white/90 text-[#3C2A21] font-[Outfit,sans-serif] rounded-2xl shadow-2xl relative overflow-hidden">
          {/* Subtle celestial background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(229,192,106,0.12),rgba(186,104,200,0.06),transparent_70%)] pointer-events-none z-0" />
          
          <div className="relative z-10">
            <DialogTitle className="sr-only">Unlock Premium Report</DialogTitle>
            <DialogDescription className="sr-only">
              Select a payment method to complete checkout and instantly download your PDF and unlock the full analysis.
            </DialogDescription>

            {processingPayment ? (
              <div className="py-12 text-center flex flex-col items-center justify-center space-y-4">
                {paymentSuccess ? (
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-16 h-16 rounded-full bg-green-50 border border-green-200 text-green-600 flex items-center justify-center shadow-sm"
                  >
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>
                ) : (
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#B38B36]/10 blur-xl rounded-full" />
                    <Loader2 className="w-12 h-12 text-[#B38B36] animate-spin relative z-10" />
                  </div>
                )}
                
                <div>
                  <h4 className="text-base font-serif font-bold text-[#3C2A21] uppercase tracking-wider">
                    {paymentSuccess ? "Payment Successful!" : "Connecting Gateway..."}
                  </h4>
                  <p className="text-xs text-[#6E5D53] mt-1.5">
                    {paymentSuccess ? "Updating cosmic database registries..." : `Authorizing secure payment via ${selectedGateway.toUpperCase()}...`}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-[#B38B36]/10 border border-[#B38B36]/35 flex items-center justify-center mx-auto mb-3 text-[#B38B36] shadow-sm">
                    <CreditCard className="w-5 h-5 text-[#B38B36]" />
                  </div>
                  <h3 className="font-serif text-xl text-[#3C2A21] font-medium">Checkout Securely</h3>
                  <p className="text-xs text-[#6E5D53] mt-1.5 leading-relaxed font-light">
                    Select your preferred payment gateway. We support multi-channel gateways for instant fulfillment.
                  </p>
                </div>

                {/* Price Details */}
                <div className="border border-white/80 bg-white/70 shadow-sm rounded-xl p-4 flex items-center justify-between text-sm">
                  <div>
                    <span className="font-serif text-[#3C2A21] font-bold block">Personalized Destiny Report</span>
                    <span className="text-[10px] text-[#6E5D53] uppercase tracking-wider font-light">Complete PDF + Lifetime Dashboard Access</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#8E6B23] font-serif text-xl font-bold">₹499</span>
                  </div>
                </div>

                {/* Gateway Selection */}
                <div className="space-y-2.5">
                  {[
                    { id: "stripe", name: "Stripe Gateway", logo: "💳" },
                    { id: "razorpay", name: "Razorpay Checkout", logo: "🚀" },
                    { id: "paypal", name: "PayPal Wallet", logo: "🅿️" }
                  ].map((gateway) => (
                    <button
                      key={gateway.id}
                      onClick={() => handlePay(gateway.id)}
                      className="w-full p-4 border border-[#B38B36]/15 hover:border-[#B38B36]/40 bg-white/70 hover:bg-[#B38B36]/5 text-left rounded-xl transition-all duration-300 flex items-center justify-between group cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{gateway.logo}</span>
                        <span className="text-xs uppercase tracking-widest text-[#5C4D43] font-bold group-hover:text-[#8E6B23] transition-colors">{gateway.name}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#B38B36] opacity-40 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>

                <div className="text-[10px] text-[#6E5D53]/85 text-center leading-relaxed border-t border-[#B38B36]/15 pt-4 flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-[#B38B36]" />
                  <span>Simulated transactions. No actual money will be charged.</span>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 30s linear infinite;
        }

        /* Magical celestial floating stars */
        @keyframes floatMagic {
          0%, 100% {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 0.35;
          }
          50% {
            transform: translateY(-15px) scale(1.2) rotate(180deg);
            opacity: 0.9;
            filter: drop-shadow(0 0 10px rgba(229,192,106,0.7));
          }
        }

        /* Breathing Nebula Orbs */
        @keyframes floatNebula1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -30px) scale(1.18); }
        }
        @keyframes floatNebula2 {
          0%, 100% { transform: translate(0, 0) scale(1.1); }
          50% { transform: translate(-50px, 45px) scale(0.85); }
        }
        @keyframes floatNebula3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, 40px) scale(1.22); }
        }
        
        .nebula-glow-1 {
          animation: floatNebula1 14s ease-in-out infinite;
        }
        .nebula-glow-2 {
          animation: floatNebula2 18s ease-in-out infinite;
        }
        .nebula-glow-3 {
          animation: floatNebula3 16s ease-in-out infinite;
        }

        /* Glassmorphism Styles */
        .fantasy-glass {
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.7);
          box-shadow: 0 20px 50px rgba(179, 139, 54, 0.08), 
                      inset 0 1px 0 rgba(255, 255, 255, 0.7);
        }
        
        .fantasy-input {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(179, 139, 54, 0.25);
          color: #3C2A21;
          transition: all 0.3s ease;
        }
        
        .fantasy-input:focus {
          border-color: rgba(179, 139, 54, 0.8);
          box-shadow: 0 0 10px rgba(179, 139, 54, 0.15);
          background: rgba(255, 255, 255, 0.95);
        }

        @keyframes glowPulse {
          0% { box-shadow: 0 10px 30px rgba(179, 139, 54, 0.12); }
          100% { box-shadow: 0 15px 45px rgba(179, 139, 54, 0.22), 0 0 15px rgba(229, 192, 106, 0.15); }
        }

        @keyframes buttonShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-button-shimmer {
          background: linear-gradient(
            90deg,
            #B38B36 0%,
            #FFF0C2 25%,
            #E8C87E 50%,
            #FFF0C2 75%,
            #B38B36 100%
          );
          background-size: 200% auto;
          animation: buttonShimmer 3.5s linear infinite;
        }
        .animate-button-shimmer:hover {
          background: linear-gradient(
            90deg,
            #8E6B23 0%,
            #FFE8A3 25%,
            #B38B36 50%,
            #FFE8A3 75%,
            #8E6B23 100%
          );
          background-size: 200% auto;
          animation: buttonShimmer 2s linear infinite;
        }

        @keyframes textShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .shimmer-gold-text {
          background: linear-gradient(
            135deg,
            #3C2A21 0%,
            #B38B36 30%,
            #8E6B23 50%,
            #B38B36 70%,
            #3C2A21 100%
          );
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: textShimmer 4s ease infinite;
          display: inline-block;
        }
      `}</style>
    </Dialog>
  );
};

export default HoroscopeFlowModal;
