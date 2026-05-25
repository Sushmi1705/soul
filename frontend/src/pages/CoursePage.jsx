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
    <div className="pt-32 pb-24 relative z-10 bg-white font-sans text-[#333] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Breadcrumb */}
        <motion.nav 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm text-gray-500 mb-12"
        >
          <Link to="/" className="hover:text-brand-burgundy transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="hover:text-brand-burgundy transition-colors cursor-pointer">courses</span>
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
             <motion.div
               animate={{ y: [0, -10, 0] }}
               transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
               className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(60,42,33,0.15)] group"
             >
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg z-10 cursor-pointer text-gray-600 hover:text-[#e63946] hover:scale-110 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <img 
                  src={data.mainImage} 
                  alt={data.title} 
                  className="w-full h-[350px] md:h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-700 bg-gray-100" 
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80" }}
                />
             </motion.div>
          </motion.div>

          {/* Right: Details */}
          <motion.div {...fadeLeft}>
            <h1 className="text-3xl md:text-4xl text-[#3C2A21] font-semibold mb-2">{data.title}</h1>
            <p className="text-2xl font-bold text-[#e63946] mb-6">{formatINR(data.price)}</p>
            
            <div className="text-gray-600 text-sm leading-relaxed mb-8">
              <p>{data.paragraphs[0]}</p>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-gray-300">
                <button 
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                >-</button>
                <input 
                  type="number" 
                  value={qty} 
                  onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 text-center py-2 border-x border-gray-300 focus:outline-none"
                  min="1"
                />
                <button 
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  onClick={() => setQty(qty + 1)}
                >+</button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="bg-[#e63946] text-white px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-[#d62828] transition-colors shadow-md hover:shadow-lg"
              >
                Add to cart
              </button>
            </div>

            <div className="text-sm text-gray-500 border-t border-gray-200 pt-6">
              <p><span className="font-semibold text-gray-700">Category:</span> {data.category}</p>
              
              <div className="flex items-center gap-2 mt-4">
                <span className="font-semibold text-gray-700">Share:</span>
                <div className="flex gap-2 text-gray-400">
                   <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:text-[#e63946] hover:border-[#e63946] cursor-pointer transition-colors">
                     f
                   </div>
                   <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:text-[#e63946] hover:border-[#e63946] cursor-pointer transition-colors">
                     t
                   </div>
                   <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:text-[#e63946] hover:border-[#e63946] cursor-pointer transition-colors">
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
          className="mb-20 border-t border-gray-200"
        >
           <div className="flex justify-center gap-8 border-b border-gray-200 mb-8">
              <button 
                className={`py-4 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'description' ? 'text-[#e63946] border-b-2 border-[#e63946]' : 'text-gray-400 hover:text-gray-700'}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button 
                className={`py-4 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'reviews' ? 'text-[#e63946] border-b-2 border-[#e63946]' : 'text-gray-400 hover:text-gray-700'}`}
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
             className="text-gray-600 text-sm leading-relaxed max-w-4xl mx-auto space-y-4"
           >
              {activeTab === 'description' && (
                <>
                  {data.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </>
              )}
              {activeTab === 'reviews' && (
                <p className="text-center italic text-gray-400">There are no reviews yet.</p>
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
                <Link to={`/courses/${course.id}`} className="block relative overflow-hidden mb-4 border border-gray-100 shadow-sm">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-[250px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Select Options overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-xs uppercase tracking-widest py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    Select Options
                  </div>
                </Link>
                <Link to={`/courses/${course.id}`}>
                  <h4 className="font-bold text-[#3C2A21] mb-2 hover:text-[#e63946] transition-colors">{course.title}</h4>
                </Link>
                <div className="flex justify-center items-center gap-2 text-sm text-[#e63946] font-semibold">
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
