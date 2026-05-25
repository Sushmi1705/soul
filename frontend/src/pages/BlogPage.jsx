import { JOURNAL } from "@/data/content";
import { motion } from "framer-motion";

const BlogPage = () => {
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
          src="https://images.unsplash.com/photo-1455390582262-044cdead27d8?auto=format&fit=crop&q=80" 
          alt="Blog" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 w-full text-center"
        >
          <h1 className="font-serif text-4xl md:text-5xl text-white font-bold tracking-wide">Blog</h1>
        </motion.div>
      </motion.div>

      {/* Main Content Section - 3 Column Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {JOURNAL.map((post) => {
            const dateObj = new Date(post.date);
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = dateObj.toLocaleString('default', { month: 'short' });

            return (
              <motion.article 
                variants={staggerItem}
                key={post.id} 
                className="bg-white group cursor-pointer border border-[#E5E1D8] shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative overflow-hidden h-64">
                  {/* Date Box */}
                  <div className="absolute top-4 left-4 bg-white z-10 px-3 py-2 text-center shadow-md">
                    <span className="block text-xl font-bold text-[#3C2A21] leading-none">{day}</span>
                    <span className="block text-xs uppercase tracking-wider text-[#725D46] mt-1">{month}</span>
                  </div>
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-8 text-center flex flex-col items-center">
                  <h3 className="font-serif text-xl text-[#3C2A21] mb-4 group-hover:text-[#e63946] transition-colors leading-snug font-bold">
                    {post.title}
                  </h3>
                  
                  {/* Separator Line */}
                  <div className="w-12 h-0.5 bg-[#e63946] mb-4"></div>
                  
                  <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <button className="text-xs font-bold text-[#e63946] tracking-widest uppercase hover:text-[#d62828] transition-colors">
                    Continue reading
                  </button>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
};

export default BlogPage;
