import { JOURNAL } from "@/data/content";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const BlogPage = () => {
  const [dynamicBlogs, setDynamicBlogs] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8005";
      try {
        const response = await fetch(`${apiUrl}/api/blogs`);
        if (response.ok) {
          const data = await response.json();
          setDynamicBlogs(data);
        }
      } catch (error) {
        console.error("Failed to load blog posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const allBlogs = [...dynamicBlogs, ...JOURNAL];

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
        className="relative w-full h-[250px] md:h-[300px] bg-[#3C2A21] flex items-center overflow-hidden border-b border-[#B38B36]/20"
      >
        <div className="absolute inset-0 bg-black/45 z-10" />
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1455390582262-044cdead27d8?auto=format&fit=crop&q=80" 
          alt="Blog" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 scale-105"
        />
        {/* Decorative background orbits */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full border border-[#B38B36]/20 border-dashed animate-spin pointer-events-none" style={{ animationDuration: '100s' }} />
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full border border-[#B38B36]/10 border-dotted animate-spin pointer-events-none" style={{ animationDuration: '80s', animationDirection: 'reverse' }} />

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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#725D46]">
            <div className="border-4 border-[#B38B36] border-t-transparent w-10 h-10 rounded-full animate-spin mb-4"></div>
            <p className="text-sm tracking-wider uppercase font-semibold">Loading blog articles...</p>
          </div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {allBlogs.map((post) => {
              const dateObj = new Date(post.date);
              const day = isNaN(dateObj.getTime()) ? "08" : String(dateObj.getDate()).padStart(2, '0');
              const month = isNaN(dateObj.getTime()) ? "Jun" : dateObj.toLocaleString('default', { month: 'short' });

              return (
                <motion.article 
                  variants={staggerItem}
                  key={post.id} 
                  onClick={() => setSelectedPost(post)}
                  className="bg-white group cursor-pointer border border-[#E5E1D8] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
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
                      <h3 className="font-serif text-xl text-[#3C2A21] mb-4 group-hover:text-[#B38B36] transition-colors leading-snug font-bold line-clamp-2">
                        {post.title}
                      </h3>
                      
                      {/* Separator Line */}
                      <div className="w-12 h-0.5 bg-[#B38B36] mb-4"></div>
                      
                      <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pb-8 text-center">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedPost(post); }}
                      className="text-xs font-bold text-[#B38B36] tracking-widest uppercase hover:text-[#d0a74b] transition-colors"
                    >
                      Continue reading
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </section>

      {/* Blog Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative z-10 bg-[#FDFBF7] text-[#3C2A21] max-w-3xl w-full max-h-[85vh] overflow-y-auto rounded-2xl border border-[#B38B36]/30 shadow-2xl p-6 md:p-10 scrollbar-thin"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 p-2 rounded-full border border-stone-200 hover:border-stone-400 text-stone-500 hover:text-stone-800 transition-all bg-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Metadata */}
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#B38B36] mb-3 text-left">
                {selectedPost.category} ✦ {selectedPost.date}
              </div>

              {/* Title */}
              <h2 className="font-serif text-3xl md:text-4xl text-[#3C2A21] font-bold mb-6 leading-tight text-left">
                {selectedPost.title}
              </h2>

              {/* Banner Image */}
              <div className="w-full h-64 md:h-96 overflow-hidden rounded-xl mb-8 shadow-md">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Excerpt Banner */}
              <div className="border-l-4 border-[#B38B36] pl-4 italic text-[#725D46] mb-8 text-base md:text-lg leading-relaxed font-light text-left">
                {selectedPost.excerpt}
              </div>

              {/* Main Content parsed */}
              <div className="prose prose-stone max-w-none text-base md:text-lg text-left">
                {(() => {
                  const cleanContent = selectedPost.content.replace(/\\n/g, '\n');
                  const paragraphs = cleanContent.includes('\n\n')
                    ? cleanContent.split(/\n\n+/)
                    : cleanContent.includes('\n')
                      ? cleanContent.split(/\n+/)
                      : [cleanContent];

                  return paragraphs.map((p, idx) => {
                    const pStr = p.trim();
                    if (!pStr) return null;

                    // Bulleted list item
                    if (pStr.startsWith('•') || pStr.startsWith('-')) {
                      const items = pStr.split(/\n+/).map(item => item.replace(/^[•\-]\s*/, '').trim()).filter(Boolean);
                      return (
                        <ul key={idx} className="list-disc pl-6 mb-6 space-y-2 text-[#725D46] font-light">
                          {items.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      );
                    }

                    // Numbered list item
                    if (/^\d+\.\s/.test(pStr)) {
                      const items = pStr.split(/\n+/).map(item => item.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
                      return (
                        <ol key={idx} className="list-decimal pl-6 mb-6 space-y-2 text-[#725D46] font-light">
                          {items.map((item, i) => <li key={i}>{item}</li>)}
                        </ol>
                      );
                    }

                    // Heading detection
                    const isHeading = pStr.length < 80 && !pStr.endsWith('.') && !/^[•\-]\s*/.test(pStr) && !/^\d+\.\s/.test(pStr);
                    if (isHeading) {
                      return (
                        <h4 key={idx} className="font-serif text-xl md:text-2xl text-[#3C2A21] mt-8 mb-4 font-bold">
                          {pStr}
                        </h4>
                      );
                    }

                    // Normal paragraph
                    return (
                      <p key={idx} className="text-[#725D46] font-light leading-relaxed mb-6">
                        {pStr}
                      </p>
                    );
                  });
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogPage;
