import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ASTRO_SOLUTIONS_DATA } from "@/data/content";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const AstroSolutionPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const data = ASTRO_SOLUTIONS_DATA[slug];

  useEffect(() => {
    if (!data) {
      navigate("/");
    }
  }, [data, navigate]);

  if (!data) return null;

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.7, ease: "easeOut" }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-100px" },
    transition: { staggerChildren: 0.2 }
  };

  const staggerItem = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" }
  };

  return (
    <div className="pt-24 pb-0 relative z-10 bg-[#F9F7F2]">
      {/* Banner Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-full h-[250px] md:h-[300px] bg-[#B38B36] flex items-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/40 z-10" />
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={data.bannerImage} 
          alt={data.title} 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 w-full text-center"
        >
          <h1 className="font-serif text-4xl md:text-5xl text-white font-bold tracking-wide">{data.title}</h1>
        </motion.div>
      </motion.div>

      {/* Main Content Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12 border-b border-brand-dark/5 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative group max-w-sm mx-auto lg:ml-0"
          >
             {/* Slowly rotating celestial background rings */}
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
               className="absolute -top-12 -right-12 w-64 h-64 rounded-full border border-[#D4AF37]/40 border-dashed z-0"
             />
             <motion.div 
               animate={{ rotate: -360 }}
               transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
               className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full border border-[#D4AF37]/30 border-dotted z-0"
             />

             {/* Main Tarot-style Image Card */}
             <motion.div
               animate={{ y: [0, -15, 0] }}
               transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
               className="relative z-10 p-3 bg-white/60 backdrop-blur-xl rounded-t-[12rem] rounded-b-3xl shadow-[0_30px_60px_rgba(74,14,27,0.15)] border border-white/80"
             >
                <div className="overflow-hidden rounded-t-[12rem] rounded-b-2xl relative bg-[#F9F7F2]">
                  <img
                    src={data.mainImage}
                    alt={data.title}
                    className="w-full h-[400px] md:h-[480px] object-cover transform scale-[1.25] group-hover:scale-[1.35] transition-transform duration-1000"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80" }}
                  />
                  
                  {/* Subtle inner gold rim */}
                  <div className="absolute inset-0 border border-[#D4AF37]/40 rounded-t-[12rem] rounded-b-2xl pointer-events-none mix-blend-overlay" />
                  
                  {/* Mystical overlay glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>
             </motion.div>
          </motion.div>
          <motion.div 
            {...fadeInUp}
            className="space-y-6"
          >
            <h2 className="font-serif text-2xl md:text-3xl text-[#3C2A21] leading-tight font-bold">
              {data.subtitle}
            </h2>
            <div className="space-y-6 text-[#725D46] font-light leading-relaxed text-sm">
              {data.paragraphs.map((p, i) => (
                <div key={i} className="space-y-2">
                  {typeof p === 'string' ? (
                    <p>{p}</p>
                  ) : (
                    <>
                      {p.heading && <h3 className="font-serif font-bold text-lg text-[#3C2A21]">{p.heading}</h3>}
                      <p>{p.text}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
            <Link to="/contact" className="inline-flex items-center gap-3 bg-[#e63946] text-white px-6 py-3 text-xs tracking-widest uppercase font-bold hover:bg-[#d62828] transition-all mt-4">
              Connect Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12 border-b border-brand-dark/5 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex justify-center gap-6 relative"
          >
            <div className="w-48 h-64 bg-white shadow-2xl rounded-t-[5rem] rounded-b-[5rem] overflow-hidden mt-12 p-4">
              <img src="https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&q=80" alt="Stones" className="w-full h-full object-cover rounded-t-[4rem] rounded-b-[4rem]" />
            </div>
            <div className="w-48 h-64 bg-white shadow-2xl rounded-t-[5rem] rounded-b-[5rem] overflow-hidden p-4">
              <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80" alt="Gitika Sharma" className="w-full h-full object-cover rounded-t-[4rem] rounded-b-[4rem]" />
            </div>
          </motion.div>
          <motion.div 
            {...fadeInUp}
            className="space-y-6"
          >
            <h2 className="font-serif text-3xl text-[#3C2A21] font-bold">
              Why Choose Soul Karma By Gitika Sharma?
            </h2>
            <motion.ul 
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-4 text-[#725D46] font-light text-sm"
            >
              <motion.li variants={staggerItem} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#e63946] shrink-0 mt-0.5" />
                <span><strong className="text-[#3C2A21]">Expert Astrological Insights:</strong> Our team of experienced astrologers combines ancient wisdom with modern insights to offer unparalleled guidance for your journey.</span>
              </motion.li>
              <motion.li variants={staggerItem} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#e63946] shrink-0 mt-0.5" />
                <span><strong className="text-[#3C2A21]">Holistic Approach:</strong> We believe in addressing the spiritual, emotional, and practical dimensions of challenges, providing a comprehensive solution that nurtures harmony.</span>
              </motion.li>
              <motion.li variants={staggerItem} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#e63946] shrink-0 mt-0.5" />
                <span><strong className="text-[#3C2A21]">Proven Results:</strong> Countless individuals have experienced transformative growth and empowerment through our astrological services.</span>
              </motion.li>
            </motion.ul>
            <Link to="/contact" className="inline-flex items-center gap-3 bg-[#e63946] text-white px-6 py-3 text-xs tracking-widest uppercase font-bold hover:bg-[#d62828] transition-all mt-4">
              Connect Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Connect With Us Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12 overflow-hidden">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-4 flex justify-center"
          >
             <div className="bg-[#E5D5B5] p-6 max-w-xs relative text-center shadow-lg">
                <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80" alt="Gitika" className="w-full h-auto mb-4" />
                <p className="font-serif text-[#3C2A21] text-sm italic">Never to appreciate the little things that make you happy</p>
             </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-8 bg-white p-8 md:p-12 shadow-xl border border-brand-dark/5"
          >
            <h3 className="font-serif text-2xl font-bold text-[#3C2A21] mb-8">Connect With Us</h3>
            <form className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#B38B36] mb-2">Your Name</label>
                <input type="text" className="w-full border-b border-[#E5E1D8] pb-2 focus:outline-none focus:border-[#B38B36] transition-colors bg-transparent text-sm" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#B38B36] mb-2">Your Email</label>
                <input type="email" className="w-full border-b border-[#E5E1D8] pb-2 focus:outline-none focus:border-[#B38B36] transition-colors bg-transparent text-sm" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#B38B36] mb-2">Mobile No</label>
                <input type="tel" className="w-full border-b border-[#E5E1D8] pb-2 focus:outline-none focus:border-[#B38B36] transition-colors bg-transparent text-sm" />
              </div>
              <button type="button" className="bg-[#e63946] text-white px-8 py-3 text-xs tracking-widest uppercase font-bold hover:bg-[#d62828] transition-all">
                Submit
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AstroSolutionPage;
