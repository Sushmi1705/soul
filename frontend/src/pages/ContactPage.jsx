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
    <div className="pt-24 pb-0 relative z-10 bg-[#F9F7F2] overflow-hidden">
      {/* Banner Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-full h-[300px] md:h-[400px] bg-[#B38B36] flex items-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/40 z-10" />
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&q=80" 
          alt="Contact Us" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 w-full text-center md:text-left md:w-1/2"
        >
          <h1 className="font-serif text-4xl md:text-5xl text-white font-bold tracking-wide mb-4">Contact Us</h1>
          <p className="text-white/90 text-lg md:text-xl font-light">Look to the moon and stars to find the answers that lie within you.</p>
        </motion.div>
      </motion.div>

      {/* Main Content - Connect With Us Form */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Image Card */}
          <motion.div 
            {...fadeRight}
            className="lg:col-span-5 flex justify-center"
          >
             <div className="bg-[#f0ebe1] p-6 max-w-sm relative text-center shadow-lg border border-[#E5E1D8]">
                <img 
                  src="https://gitikasharma.in/wp-content/uploads/2024/02/Gitika-Sharma-Profile.jpg" 
                  alt="Gitika Sharma" 
                  className="w-full h-auto object-cover border-4 border-white shadow-sm mb-6" 
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80" }}
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 3 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6, type: "spring" }}
                  className="absolute -right-8 top-1/2 -translate-y-1/2 bg-white p-6 shadow-xl max-w-[200px] hidden md:block border border-[#E5E1D8]"
                >
                  <p className="font-serif text-[#3C2A21] text-sm leading-relaxed">
                    Learn to appreciate the little things that Make you Happy
                  </p>
                  <p className="mt-4 text-[#B38B36] font-bold text-xs uppercase tracking-widest italic">Start now!</p>
                </motion.div>
                {/* Mobile version of the quote */}
                <div className="bg-white p-4 shadow-sm md:hidden mt-4">
                  <p className="font-serif text-[#3C2A21] text-sm leading-relaxed">
                    Learn to appreciate the little things that Make you Happy
                  </p>
                  <p className="mt-2 text-[#B38B36] font-bold text-xs uppercase tracking-widest italic">Start now!</p>
                </div>
             </div>
          </motion.div>
          
          {/* Right: Form */}
          <motion.div 
            {...fadeLeft}
            className="lg:col-span-7 bg-white p-8 md:p-12 shadow-sm border border-[#E5E1D8]"
          >
            <p className="text-[#e63946] text-xs font-bold uppercase tracking-widest mb-2">Write Us</p>
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
                <button type="button" className="bg-[#F4F1EA] text-[#3C2A21] border border-[#E5E1D8] px-8 py-3 text-xs tracking-widest uppercase font-bold hover:bg-[#e63946] hover:text-white hover:border-[#e63946] transition-all shadow-sm">
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Info Bar */}
      <section className="bg-[#b7625e] py-12 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-50px" }}
            className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 text-sm font-light tracking-wide"
          >
            <motion.div variants={staggerItem} className="flex items-center gap-3">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
               </svg>
               <span>Phone: +91-9818 9595 49</span>
            </motion.div>
            <motion.div variants={staggerItem} className="flex items-center gap-3">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
               </svg>
               <span>Email: connect@gitikasharma.in</span>
            </motion.div>
            <motion.div variants={staggerItem} className="flex items-center gap-3">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
               </svg>
               <span>Support Forum<br/>for over 24h</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default ContactPage;
