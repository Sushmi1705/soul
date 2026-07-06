import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { SERVICES_PAGE_DATA } from "@/data/content";
import { motion } from "framer-motion";

const ServicePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const data = SERVICES_PAGE_DATA[slug];

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

  return (
    <div className="pt-24 pb-0 relative z-10 bg-[#FDFBF7]">
      {/* Banner Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-full h-[250px] md:h-[300px] bg-[#3C2A21] flex items-center overflow-hidden border-b border-[#B38B36]/20"
      >
        <div className="absolute inset-0 bg-black/45 z-10" />
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={data.bannerImage} 
          alt={data.title} 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 scale-105"
        />
        {/* Decorative orbits */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full border border-[#B38B36]/20 border-dashed animate-spin pointer-events-none" style={{ animationDuration: '100s' }} />
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full border border-[#B38B36]/10 border-dotted animate-spin pointer-events-none" style={{ animationDuration: '80s', animationDirection: 'reverse' }} />

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
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12 border-b border-[#B38B36]/10 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative group max-w-sm mx-auto lg:ml-0"
          >
             {/* Slowly rotating celestial background rings */}
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
               className="absolute -top-12 -right-12 w-64 h-64 rounded-full border border-[#B38B36]/30 border-dashed z-0"
             />
             <motion.div 
               animate={{ rotate: -360 }}
               transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
               className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full border border-[#B38B36]/20 border-dotted z-0"
             />

             {/* Main Tarot-style Image Card */}
             <motion.div
               animate={{ y: [0, -15, 0] }}
               transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
               className="relative z-10 p-3 bg-white/60 backdrop-blur-xl rounded-t-[12rem] rounded-b-3xl shadow-[0_30px_60px_rgba(60,42,33,0.15)] border border-[#B38B36]/20"
             >
                <div className="overflow-hidden rounded-t-[12rem] rounded-b-2xl relative bg-[#FDFBF7]">
                  <img
                    src={data.mainImage}
                    alt={data.title}
                    className="w-full h-[400px] md:h-[480px] object-cover transform scale-[1.25] group-hover:scale-[1.35] transition-transform duration-1000"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80" }}
                  />
                  
                  {/* Subtle inner gold rim */}
                  <div className="absolute inset-0 border border-[#B38B36]/40 rounded-t-[12rem] rounded-b-2xl pointer-events-none mix-blend-overlay" />
                  
                  {/* Mystical overlay glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#B38B36]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
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
            <div className="space-y-6 text-[#3C2A21] font-medium leading-relaxed text-sm">
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
            <Link to="/contact" className="inline-flex items-center gap-3 bg-[#B38B36] text-white px-8 py-4 rounded-full text-xs tracking-widest uppercase font-bold hover:bg-[#9A752B] transition-all duration-300 mt-4 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform">
              Connect Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Connect With Us Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12 overflow-hidden">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-4 flex justify-center"
          >
             <div className="bg-[#F3F1EC] p-6 max-w-xs relative text-center shadow-xl border border-[#E5E1D8] rounded-t-[10rem] rounded-b-2xl">
                <div className="overflow-hidden rounded-t-[10rem] rounded-b-xl border border-[#B38B36]/20 bg-white mb-4">
                  <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80" alt="Gitika" className="w-full h-auto" />
                </div>
                <p className="font-serif text-[#3C2A21] text-xs italic">"Learn to appreciate the little things that make you happy."</p>
             </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-8 bg-white p-8 md:p-12 shadow-2xl border border-[#E5E1D8] rounded-3xl"
          >
            <h3 className="font-serif text-2xl font-bold text-[#3C2A21] mb-8">Connect With Us</h3>
            <form className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#B38B36] mb-2 font-semibold">Your Name</label>
                <input type="text" className="w-full border-b border-[#E5E1D8] pb-2 focus:outline-none focus:border-[#B38B36] transition-colors bg-transparent text-sm text-[#3C2A21]" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#B38B36] mb-2 font-semibold">Your Email</label>
                <input type="email" className="w-full border-b border-[#E5E1D8] pb-2 focus:outline-none focus:border-[#B38B36] transition-colors bg-transparent text-sm text-[#3C2A21]" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#B38B36] mb-2 font-semibold">Mobile No</label>
                <input type="tel" className="w-full border-b border-[#E5E1D8] pb-2 focus:outline-none focus:border-[#B38B36] transition-colors bg-transparent text-sm text-[#3C2A21]" />
              </div>
              <button type="button" className="bg-[#B38B36] text-white px-8 py-4 text-xs tracking-widest uppercase font-bold hover:bg-[#9A752B] transition-all duration-300 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform mt-4">
                Submit details
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServicePage;
