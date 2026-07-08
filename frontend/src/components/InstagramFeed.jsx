import { useState, useEffect } from "react";
import { Heart, MessageCircle, Instagram, Play, ArrowRight } from "lucide-react";

const InstagramFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchFeed = async () => {
      const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8005";
      try {
        const response = await fetch(`${apiUrl}/api/instagram-feed`);
        if (!response.ok) throw new Error("Failed to fetch Instagram feed");
        const data = await response.json();
        // Sort chronologically (newest first)
        const sortedData = [...data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setPosts(sortedData);
      } catch (err) {
        console.error("Error loading Instagram feed:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return "";
    }
  };

  return (
    <section className="py-20 bg-[#FAF9F6] relative overflow-hidden" id="instagram-feed">
      {/* Decorative background vectors */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4A0E1B]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#B38B36]/10 border border-[#B38B36]/20 text-[#B38B36] text-[10px] tracking-[0.2em] uppercase font-bold mb-4">
            <Instagram className="w-3.5 h-3.5" />
            Social Connection
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#4A0E1B] mb-4 tracking-wide">
            Instagram Feed
          </h2>
          <p className="text-sm sm:text-base text-[#725D46] leading-relaxed font-light">
            Follow our latest astrology insights, updates, and spiritual guidance.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="bg-white border border-[#E5E1D8] rounded-2xl overflow-hidden shadow-sm flex flex-col h-[460px] animate-pulse"
              >
                {/* Image placeholder */}
                <div className="aspect-square bg-[#F5F2EB]"></div>
                {/* Content placeholder */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-4 bg-[#F5F2EB] rounded w-3/4"></div>
                    <div className="h-4 bg-[#F5F2EB] rounded w-5/6"></div>
                    <div className="h-4 bg-[#F5F2EB] rounded w-1/2"></div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-[#F5F2EB]">
                    <div className="h-3 bg-[#F5F2EB] rounded w-20"></div>
                    <div className="flex gap-4">
                      <div className="h-4 bg-[#F5F2EB] rounded w-8"></div>
                      <div className="h-4 bg-[#F5F2EB] rounded w-8"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error / Empty State */}
        {!loading && (error || posts.length === 0) && (
          <div className="text-center py-12 px-6 bg-white border border-[#E5E1D8] rounded-2xl max-w-xl mx-auto shadow-sm">
            <Instagram className="w-12 h-12 text-[#B38B36]/50 mx-auto mb-4" />
            <h3 className="text-lg font-serif text-[#4A0E1B] mb-2">
              No Instagram posts available right now.
            </h3>
            <p className="text-xs text-[#725D46]/80 mb-6">
              Connect with us directly on Instagram to check our latest cosmic updates and Vedic wisdom.
            </p>
            <a
              href="https://www.instagram.com/soulkarmabygitikasharma/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4A0E1B] to-[#6A1E2F] text-[#D4AF37] border border-[#D4AF37]/50 text-xs tracking-wider uppercase font-bold hover:shadow-lg transition-all duration-300"
            >
              Visit our Instagram
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Feed Grid */}
        {!loading && !error && posts.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.slice(0, 6).map((post) => (
                <a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white border border-[#E5E1D8] rounded-2xl overflow-hidden shadow-sm flex flex-col h-[465px] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(179,139,54,0.1)] hover:border-[#B38B36]/30"
                >
                  {/* Media Display Container */}
                  <div className="relative aspect-square overflow-hidden bg-[#FAF9F6]">
                    <img
                      src={post.media_url}
                      alt={post.caption ? post.caption.substring(0, 40) : "Instagram post"}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    
                    {/* Video play icon indicator */}
                    {post.media_type === "VIDEO" && (
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-2 rounded-full border border-white/20 text-white shadow">
                        <Play className="w-4 h-4 fill-white" />
                      </div>
                    )}

                    {/* Desktop Hover Overlay */}
                    <div className="absolute inset-0 bg-[#4A0E1B]/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-md">
                        <Instagram className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Card content text details */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      {/* Caption text */}
                      <p className="text-xs text-[#3C2A21]/90 leading-relaxed font-light line-clamp-3">
                        {post.caption || "View updates and insights."}
                      </p>
                      {/* Read More dynamic indicator */}
                      {post.caption && post.caption.length > 100 && (
                        <span className="text-[10px] tracking-wider font-bold text-[#B38B36] uppercase group-hover:underline">
                          Read More
                        </span>
                      )}
                    </div>

                    {/* Stats & Metadata footer */}
                    <div className="flex justify-between items-center pt-4 border-t border-[#E5E1D8]/60 mt-4 text-[10px] tracking-wider text-[#725D46]/80 font-bold uppercase">
                      <span>{formatDate(post.timestamp)}</span>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 hover:text-[#4A0E1B] transition-colors">
                          <Heart className="w-3.5 h-3.5" />
                          <span>{post.like_count}</span>
                        </div>
                        <div className="flex items-center gap-1.5 hover:text-[#4A0E1B] transition-colors">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{post.comments_count}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-14">
              <a
                href="https://www.instagram.com/soulkarmabygitikasharma/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-[#4A0E1B] hover:bg-[#6A1E2F] text-[#D4AF37] border border-[#D4AF37]/40 text-xs tracking-[0.15em] uppercase font-bold hover:shadow-[0_10px_25px_rgba(74,14,27,0.2)] hover:border-[#D4AF37] transition-all duration-300 group"
              >
                View All on Instagram
                <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </>
        )}

      </div>
    </section>
  );
};

export default InstagramFeed;
