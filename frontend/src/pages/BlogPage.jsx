import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Calendar, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { JOURNAL } from "@/data/content";

const BlogPage = () => {
  const [dynamicBlogs, setDynamicBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  // Get unique categories for filtering
  const categories = ["All", ...new Set(allBlogs.map((b) => b.category))];

  // Filtered blogs
  const filteredBlogs = selectedCategory === "All"
    ? allBlogs
    : allBlogs.filter((b) => b.category === selectedCategory);

  // Split into Featured (1st post) and Grid (rest of the posts)
  const featuredPost = filteredBlogs[0];
  const gridPosts = filteredBlogs.slice(1);

  // Helper to calculate reading time
  const getReadingTime = (content) => {
    if (!content) return "5 min read";
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200)) + " min read";
  };

  return (
    <div className="pt-24 pb-24 bg-[#FDFBF7] min-h-screen text-[#3C2A21] relative z-10">
      
      {/* Background celestial design highlights */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(212,175,55,0.05),transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(74,14,27,0.03),transparent_60%)] pointer-events-none" />

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-8 text-left">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-10 bg-[#B38B36]" />
          <span className="text-[10px] tracking-[0.4em] uppercase text-[#B38B36] font-black">Cosmic Knowledge</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
          Astro Academy Journal
        </h1>
        <p className="text-sm md:text-base text-[#725D46] leading-relaxed max-w-xl font-light">
          Deep Vedic insights, celestial transits, and Vastu guidelines curated to align your career, spatial harmony, and destiny pathways.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-12">
        <div className="flex flex-wrap gap-2.5 pb-4 border-b border-[#E5E1D8]/60">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                selectedCategory === cat
                  ? "bg-[#3C2A21] text-white border-[#3C2A21] shadow-sm"
                  : "bg-white text-[#725D46] border-[#E5E1D8] hover:border-[#B38B36] hover:text-[#B38B36]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-[#725D46]">
            <div className="border-4 border-[#B38B36] border-t-transparent w-10 h-10 rounded-full animate-spin mb-4"></div>
            <p className="text-sm tracking-wider uppercase font-semibold">Loading editorial vault...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-20 border border-[#E5E1D8] border-dashed rounded-3xl">
            <Sparkles className="w-10 h-10 text-[#B38B36] mx-auto mb-4 animate-pulse" />
            <h3 className="font-serif text-xl font-bold">No Articles Found</h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto mt-2">
              No cosmic insights match this specific category filter at the moment. Check back soon.
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* FEATURED ARTICLE (LATEST POST) */}
            {featuredPost && selectedCategory === "All" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="group relative bg-white border border-[#E5E1D8] rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(179,139,54,0.06)] hover:shadow-[0_30px_70px_rgba(179,139,54,0.12)] hover:border-[#B38B36]/25 transition-all duration-500 grid lg:grid-cols-12 gap-0"
              >
                {/* Featured Image */}
                <div className="lg:col-span-7 relative overflow-hidden aspect-[16/10] lg:aspect-auto min-h-[350px]">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-1000 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] tracking-wider uppercase font-extrabold text-[#B38B36] shadow-sm border border-[#E5E1D8]/40">
                    Featured Article
                  </div>
                </div>

                {/* Featured Details */}
                <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between items-start text-left bg-white">
                  <div className="space-y-4">
                    <span className="text-[10px] tracking-[0.25em] uppercase text-[#B38B36] font-bold block">
                      {featuredPost.category}
                    </span>
                    <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold leading-tight group-hover:text-[#B38B36] transition-colors duration-300">
                      <Link to={`/blog/${featuredPost.id}`}>{featuredPost.title}</Link>
                    </h2>
                    <p className="text-stone-500 text-xs md:text-sm leading-relaxed font-light line-clamp-4">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="w-full pt-8 border-t border-[#E5E1D8]/60 mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-[11px] text-stone-500 font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#B38B36]" />
                        {featuredPost.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#B38B36]" />
                        {getReadingTime(featuredPost.content)}
                      </span>
                    </div>

                    {/* Button */}
                    <Link
                      to={`/blog/${featuredPost.id}`}
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B38B36] hover:text-[#3C2A21] transition-colors group/btn"
                    >
                      Read Story
                      <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* BLOGS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="wait">
                {(selectedCategory === "All" ? gridPosts : filteredBlogs).map((post, idx) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="group bg-white border border-[#E5E1D8] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgba(179,139,54,0.08)] hover:border-[#B38B36]/25 transition-all duration-500 flex flex-col justify-between h-[480px]"
                  >
                    <div>
                      {/* Image Container */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100 flex-shrink-0 border-b border-[#E5E1D8]/60">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-1000 ease-out"
                          loading="lazy"
                        />
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3.5 py-1 rounded-full text-[9px] tracking-wider uppercase font-black text-[#B38B36] shadow-sm border border-[#E5E1D8]/40">
                          {post.category}
                        </div>
                      </div>

                      {/* Card Info */}
                      <div className="p-6 text-left space-y-3">
                        <h3 className="font-serif text-lg md:text-xl text-[#3C2A21] font-bold leading-snug group-hover:text-[#B38B36] transition-colors duration-300 line-clamp-2">
                          <Link to={`/blog/${post.id}`}>{post.title}</Link>
                        </h3>
                        <p className="text-xs text-[#725D46]/80 leading-relaxed font-light line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-6 pt-0 border-t border-[#E5E1D8]/50 mt-4 flex items-center justify-between">
                      {/* Metadata */}
                      <div className="flex items-center gap-3 text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#B38B36]" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#B38B36]" />
                          {getReadingTime(post.content)}
                        </span>
                      </div>

                      {/* Button Link */}
                      <Link
                        to={`/blog/${post.id}`}
                        className="w-8 h-8 rounded-full border border-[#E5E1D8] group-hover:border-[#B38B36] group-hover:bg-[#B38B36] group-hover:text-white flex items-center justify-center text-stone-500 transition-all duration-300"
                        title="Read Full Story"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>

          </div>
        )}
      </div>

    </div>
  );
};

export default BlogPage;
