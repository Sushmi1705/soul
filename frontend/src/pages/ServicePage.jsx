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
            {/* Elegant offset gold frame */}
            <div className="absolute -top-4 -right-4 bottom-8 left-8 border border-[#B38B36]/30 group-hover:border-[#B38B36]/60 transition-colors duration-500 z-0" />
            
            {/* Main Image Container */}
            <div className="relative z-10 bg-white p-2 shadow-[0_20px_50px_rgba(60,42,33,0.1)]">
              <div className="overflow-hidden relative">
                <div className="absolute inset-0 border border-white/20 z-10" />
                <img
                  src={data.mainImage}
                  alt={data.title}
                  className="w-full h-[350px] md:h-[400px] object-cover group-hover:scale-105 transition-transform duration-700 bg-[#F4F1EA]"
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80" }}
                />
              </div>
            </div>
            
            {/* Decorative corners */}
            <div className="absolute top-[-4px] left-[-4px] w-6 h-6 border-t border-l border-[#B38B36] z-20 opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="absolute bottom-[32px] right-[-4px] w-6 h-6 border-b border-r border-[#B38B36] z-20 opacity-0 group-hover:opacity-100 transition-all duration-500" />
          </motion.div>
          <motion.div 
            {...fadeInUp}
            className="space-y-6"
          >
            <h2 className="font-serif text-2xl md:text-3xl text-[#3C2A21] leading-tight font-bold">
              {data.subtitle}
            </h2>
            <div className="space-y-4 text-[#725D46] font-light leading-relaxed text-sm">
              {data.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
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

export default ServicePage;
