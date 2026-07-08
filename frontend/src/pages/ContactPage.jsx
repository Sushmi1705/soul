import React from "react";
import { motion } from "framer-motion";

const ContactPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.7, ease: "easeOut" }
  };

  const fadeRight = {
    initial: { opacity: 0, x: -30 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const fadeLeft = {
    initial: { opacity: 0, x: 30 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, delay: 0.2, ease: "easeOut" }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-50px" },
    transition: { staggerChildren: 0.2 }
  };

  const staggerItem = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" }
  };

  return (
    <div className="pt-24 pb-0 relative z-10 bg-[#FDFBF7] overflow-hidden">
      {/* Banner Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-full h-[180px] md:h-[220px] bg-[#3C2A21] flex items-center overflow-hidden border-b border-[#B38B36]/20"
      >
        <div className="absolute inset-0 bg-black/45 z-10" />
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&q=80" 
          alt="Contact Us" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 scale-105"
        />
        {/* Decorative background orbits */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full border border-[#B38B36]/20 border-dashed animate-spin pointer-events-none" style={{ animationDuration: '100s' }} />
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full border border-[#B38B36]/10 border-dotted animate-spin pointer-events-none" style={{ animationDuration: '80s', animationDirection: 'reverse' }} />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 w-full text-center md:text-left md:w-1/2"
        >
          <h1 className="font-serif text-4xl md:text-5xl text-white font-bold tracking-wide mb-4">Contact Us</h1>
          <p className="text-[#B38B36] text-sm font-bold uppercase tracking-[0.4em] mb-2">Astro Power 24 by Gitika Sharma</p>
          <p className="text-white/80 text-base font-light italic leading-relaxed">Look to the moon and stars to find the answers that lie within you.</p>
        </motion.div>
      </motion.div>

      {/* Main Content - Connect With Us Form */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* Left: Image Card */}
          <motion.div 
            {...fadeRight}
            className="lg:col-span-5 flex justify-center"
          >
             <div className="bg-[#F3F1EC] p-6 max-w-sm relative text-center shadow-xl border border-[#E5E1D8] rounded-t-[10rem] rounded-b-2xl">
                <div className="overflow-hidden rounded-t-[10rem] rounded-b-xl relative bg-white border border-[#B38B36]/20">
                  <img 
                    src="https://gitikasharma.in/wp-content/uploads/2024/02/Gitika-Sharma-Profile.jpg" 
                    alt="Gitika Sharma" 
                    className="w-full h-auto object-cover transform scale-100 hover:scale-105 transition-transform duration-1000" 
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80" }}
                  />
                  <div className="absolute inset-0 bg-[#B38B36]/5 mix-blend-overlay" />
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 3 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6, type: "spring" }}
                  className="absolute -right-8 top-1/2 -translate-y-1/2 bg-white p-6 shadow-xl max-w-[200px] hidden md:block border border-[#B38B36]/20 rounded-xl"
                >
                  <p className="font-serif text-[#3C2A21] text-xs leading-relaxed italic">
                    "Learn to appreciate the little things that make you happy."
                  </p>
                  <p className="mt-4 text-[#B38B36] font-bold text-[10px] uppercase tracking-widest">Start now!</p>
                </motion.div>
                {/* Mobile version of the quote */}
                <div className="bg-white p-4 shadow-sm md:hidden mt-4 rounded-xl border border-[#E5E1D8]">
                  <p className="font-serif text-[#3C2A21] text-xs leading-relaxed italic">
                    "Learn to appreciate the little things that make you happy."
                  </p>
                  <p className="mt-2 text-[#B38B36] font-bold text-[10px] uppercase tracking-widest">Start now!</p>
                </div>
             </div>
          </motion.div>
          
          {/* Right: Form */}
          <motion.div 
            {...fadeLeft}
            className="lg:col-span-7 bg-white p-8 md:p-12 shadow-2xl border border-[#E5E1D8] rounded-3xl relative overflow-hidden"
          >
            {/* Corner Decorative Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#B38B36]/5 rounded-full blur-2xl pointer-events-none" />
            
            <p className="text-[#B38B36] text-xs font-bold uppercase tracking-widest mb-2">Write Us</p>
            <h3 className="font-serif text-3xl font-bold text-[#3C2A21] mb-8">Connect With Us</h3>
            
            <form className="space-y-8">
              <div>
                <input 
                  type="text" 
                  placeholder="Your Name"
                  className="w-full border-b border-[#E5E1D8] pb-4 focus:outline-none focus:border-[#B38B36] transition-colors bg-transparent text-sm text-[#3C2A21] placeholder:text-gray-400" 
                />
              </div>
              <div>
                <input 
                  type="email" 
                  placeholder="Your Email"
                  className="w-full border-b border-[#E5E1D8] pb-4 focus:outline-none focus:border-[#B38B36] transition-colors bg-transparent text-sm text-[#3C2A21] placeholder:text-gray-400" 
                />
              </div>
              <div>
                <input 
                  type="tel" 
                  placeholder="Mobile No"
                  className="w-full border-b border-[#E5E1D8] pb-4 focus:outline-none focus:border-[#B38B36] transition-colors bg-transparent text-sm text-[#3C2A21] placeholder:text-gray-400" 
                />
              </div>
              <div className="pt-4">
                <button type="button" className="bg-[#B38B36] text-white border border-[#B38B36] px-8 py-4 text-xs tracking-widest uppercase font-bold hover:bg-[#9A752B] hover:border-[#9A752B] transition-all duration-300 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform">
                  Submit Details
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Info Bar */}
      <section className="bg-gradient-to-r from-[#3C2A21] via-[#725D46] to-[#3C2A21] py-16 text-white border-t border-[#B38B36]/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-50px" }}
            className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 text-sm font-light tracking-wide text-center"
          >
            <motion.div variants={staggerItem} className="flex flex-col items-center gap-3">
               <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-[#B38B36]/30 mb-2">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#B38B36]">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                 </svg>
               </div>
               <span className="font-semibold text-white/90">Phone</span>
               <span className="text-white/60">+91-9818 9595 49</span>
            </motion.div>
            <motion.div variants={staggerItem} className="flex flex-col items-center gap-3">
               <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-[#B38B36]/30 mb-2">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#B38B36]">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                 </svg>
               </div>
               <span className="font-semibold text-white/90">Email</span>
               <span className="text-white/60">connect@gitikasharma.in</span>
            </motion.div>
            <motion.div variants={staggerItem} className="flex flex-col items-center gap-3">
               <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-[#B38B36]/30 mb-2">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#B38B36]">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                 </svg>
               </div>
               <span className="font-semibold text-white/90">Support Forum</span>
               <span className="text-white/60">Available 24/7 online</span>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;

