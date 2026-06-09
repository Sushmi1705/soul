import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { COURSES_PAGE_DATA, COURSES, formatINR } from "@/data/content";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

const CoursePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const data = COURSES_PAGE_DATA[slug];
  const { addItem, setIsOpen } = useCart();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    if (!data) {
      navigate("/");
    }
  }, [data, navigate]);

  if (!data) return null;

  const handleAddToCart = () => {
    addItem({
      id: slug,
      title: data.title,
      price: data.price,
      image: data.mainImage
    });
    for(let i=1; i<qty; i++) {
        addItem({id: slug});
    }
    setIsOpen(true);
  };

  const relatedProducts = COURSES.filter(c => c.id !== slug).slice(0, 3);

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-100px" },
    transition: { staggerChildren: 0.15 }
  };

  const staggerItem = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const fadeRight = {
    initial: { opacity: 0, x: -30 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.7, ease: "easeOut" }
  };

  const fadeLeft = {
    initial: { opacity: 0, x: 30 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.7, delay: 0.2, ease: "easeOut" }
  };

  return (
    <div className="pt-32 pb-24 relative z-10 bg-[#FDFBF7] font-sans text-[#333] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Breadcrumb */}
        <motion.nav 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm text-gray-500 mb-12"
        >
          <Link to="/" className="hover:text-[#B38B36] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="hover:text-[#B38B36] transition-colors cursor-pointer">courses</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{data.title}</span>
        </motion.nav>

        {/* Product Top Section */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 mb-20 items-start">
          
          {/* Left: Image */}
          <motion.div 
            {...fadeRight}
            className="relative"
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
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-full shadow-lg z-20 cursor-pointer text-[#3C2A21] hover:text-[#B38B36] hover:scale-110 transition-all duration-300 border border-[#B38B36]/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </div>
                  <img
                    src={data.mainImage}
                    alt={data.title}
                    className="w-full h-[350px] md:h-[480px] object-cover transform scale-[1.25] group-hover:scale-[1.35] transition-transform duration-1000"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80" }}
                  />
                  
                  {/* Subtle inner gold rim */}
                  <div className="absolute inset-0 border border-[#B38B36]/40 rounded-t-[12rem] rounded-b-2xl pointer-events-none mix-blend-overlay" />
                  
                  {/* Mystical overlay glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#B38B36]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>
             </motion.div>
          </motion.div>

          {/* Right: Details */}
          <motion.div {...fadeLeft}>
            <h1 className="text-3xl md:text-4xl text-[#3C2A21] font-semibold mb-2 font-serif">{data.title}</h1>
            <p className="text-2xl font-bold text-[#B38B36] mb-4">{formatINR(data.price)}</p>
            
            {data.subtitle && (
              <p className="text-[#B38B36] italic font-medium mb-6">{data.subtitle}</p>
            )}
            
            <div className="text-stone-500 text-sm leading-relaxed mb-8 space-y-4 font-light">
              {data.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-[#E5E1D8] rounded-xl overflow-hidden bg-white shadow-sm">
                <button 
                  className="px-4 py-3 text-gray-600 hover:bg-stone-50 transition-colors font-semibold"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                >-</button>
                <input 
                  type="number" 
                  value={qty} 
                  onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 text-center py-3 border-x border-[#E5E1D8] focus:outline-none font-medium text-stone-800 bg-transparent"
                  min="1"
                />
                <button 
                  className="px-4 py-3 text-gray-600 hover:bg-stone-50 transition-colors font-semibold"
                  onClick={() => setQty(qty + 1)}
                >+</button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="bg-[#B38B36] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#9A752B] transition-all duration-300 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
              >
                Add to cart
              </button>
            </div>

            <div className="text-sm text-stone-400 border-t border-[#E5E1D8] pt-6 space-y-2">
              <p><span className="font-semibold text-stone-700">Category:</span> {data.category}</p>
              
              <div className="flex items-center gap-2 mt-4">
                <span className="font-semibold text-stone-700">Share:</span>
                <div className="flex gap-2">
                   <div className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:text-[#B38B36] hover:border-[#B38B36] cursor-pointer transition-colors text-xs font-semibold">
                     f
                   </div>
                   <div className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:text-[#B38B36] hover:border-[#B38B36] cursor-pointer transition-colors text-xs font-semibold">
                     t
                   </div>
                   <div className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:text-[#B38B36] hover:border-[#B38B36] cursor-pointer transition-colors text-xs font-semibold">
                     in
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Description Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-20 border-t border-[#E5E1D8]"
        >
           <div className="flex justify-center gap-8 border-b border-[#E5E1D8] mb-8">
              <button 
                className={`py-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'description' ? 'text-[#B38B36] border-b-2 border-[#B38B36]' : 'text-stone-400 hover:text-stone-700'}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button 
                className={`py-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'reviews' ? 'text-[#B38B36] border-b-2 border-[#B38B36]' : 'text-stone-400 hover:text-stone-700'}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews (0)
              </button>
           </div>
           
           <motion.div 
             key={activeTab}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.4 }}
             className="text-stone-500 text-sm leading-relaxed max-w-4xl mx-auto space-y-4 font-light text-center"
           >
              {activeTab === 'description' && (
                <>
                  {data.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </>
              )}
              {activeTab === 'reviews' && (
                <p className="italic text-stone-400">There are no reviews yet.</p>
              )}
           </motion.div>
        </motion.div>

        {/* Related Products */}
        <div>
          <motion.h3 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-2xl font-serif text-[#3C2A21] mb-8 text-center uppercase tracking-widest"
          >
            Related Products
          </motion.h3>
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {relatedProducts.map(course => (
              <motion.div variants={staggerItem} key={course.id} className="group text-center">
                <Link to={`/courses/${course.id}`} className="block relative overflow-hidden mb-4 border border-[#E5E1D8] shadow-sm rounded-t-[5rem] rounded-b-2xl p-2 bg-white">
                  <div className="overflow-hidden rounded-t-[5rem] rounded-b-xl relative">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-[250px] object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Select Options overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm text-white text-[10px] uppercase tracking-widest py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 font-semibold cursor-pointer">
                      Select Options
                    </div>
                  </div>
                </Link>
                <Link to={`/courses/${course.id}`}>
                  <h4 className="font-bold font-serif text-[#3C2A21] mb-2 hover:text-[#B38B36] transition-colors">{course.title}</h4>
                </Link>
                <div className="flex justify-center items-center gap-2 text-sm text-[#B38B36] font-semibold">
                   {formatINR(course.price)}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default CoursePage;
