import { useState, useEffect } from "react";
import { Heart, MessageCircle, Instagram, Play, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const YOUTUBE_VIDEOS = [
  {
    id: "g5lDq0Z0YQ4",
    title: "Auspicious Entrance Vastu: Attract Wealth & Positivity",
    desc: "Unlock the cosmic directions for your home's main entrance. Simple yet highly effective Vastu tips to enhance energy alignment and manifest financial abundance.",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80",
    publishedAt: "July 02, 2026",
    views: "1.8K views",
    duration: "12:45"
  },
  {
    id: "nN51H-iT5K8",
    title: "Understanding Sade Sati Remedies & Saturn Transit Guidance",
    desc: "Is Saturn transit affecting your career or health? Gitika Sharma details the profound impact of Sade Sati and provides simple Vedic remedies to mitigate cosmic blocks.",
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80",
    publishedAt: "June 27, 2026",
    views: "3.2K views",
    duration: "18:12"
  },
  {
    id: "Y4iWvO63_s0",
    title: "Bedroom Vastu: Directional Energies for Health & Harmony",
    desc: "Discover the best sleeping directions and bed alignments in your home. Learn how bedroom energy layouts directly impact sleep quality and relationship harmony.",
    thumbnail: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80",
    publishedAt: "June 21, 2026",
    views: "2.1K views",
    duration: "10:30"
  }
];

const InstagramFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState("instagram"); // 'instagram' | 'youtube'
  const [activeVideoId, setActiveVideoId] = useState(null); // string or null

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
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#B38B36]/10 border border-[#B38B36]/20 text-[#B38B36] text-[10px] tracking-[0.2em] uppercase font-bold mb-4">
            <Instagram className="w-3.5 h-3.5" />
            Social Spotlight
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#4A0E1B] mb-4 tracking-wide">
            Cosmic Connection
          </h2>
          <p className="text-sm sm:text-base text-[#725D46] leading-relaxed font-light">
            Stay aligned with our latest Vedic wisdom, planetary transits, and Vastu advice.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-[#3C2A21]/5 p-1 rounded-2xl border border-[#E5E1D8] gap-1">
            <button
              onClick={() => setActiveTab("instagram")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                activeTab === "instagram"
                  ? "bg-[#3C2A21] text-white shadow-sm"
                  : "text-[#3C2A21]/60 hover:text-[#3C2A21]"
              }`}
            >
              <Instagram className="w-4 h-4" />
              Instagram Feed
            </button>
            <button
              onClick={() => setActiveTab("youtube")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                activeTab === "youtube"
                  ? "bg-[#3C2A21] text-white shadow-sm"
                  : "text-[#3C2A21]/60 hover:text-[#3C2A21]"
              }`}
            >
              <svg 
                className={`w-4 h-4 ${activeTab === "youtube" ? "fill-white" : "fill-[#3C2A21]/60"}`} 
                viewBox="0 0 24 24"
              >
                <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              YouTube Videos
            </button>
          </div>
        </div>

        {/* INSTAGRAM TAB CONTENT */}
        {activeTab === "instagram" && (
          <>
            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i} 
                    className="bg-white border border-[#E5E1D8] rounded-2xl overflow-hidden shadow-sm flex flex-col h-[460px] animate-pulse"
                  >
                    <div className="aspect-square bg-[#F5F2EB]"></div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="h-4 bg-[#F5F2EB] rounded w-3/4"></div>
                        <div className="h-4 bg-[#F5F2EB] rounded w-5/6"></div>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-[#F5F2EB]">
                        <div className="h-3 bg-[#F5F2EB] rounded w-20"></div>
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
                <h3 className="text-lg font-serif text-[#4A0E1B] mb-2 font-bold">
                  No Instagram posts available right now.
                </h3>
                <p className="text-xs text-[#725D46]/80 mb-6">
                  Connect with us directly on Instagram to check our latest cosmic updates and Vedic wisdom.
                </p>
                <a
                  href="https://www.instagram.com/soulkarmabygitikasharma/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A0E1B] text-[#D4AF37] border border-[#D4AF37]/50 text-xs tracking-wider uppercase font-bold hover:shadow-lg transition-all"
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
                      <div className="relative aspect-square overflow-hidden bg-[#FAF9F6]">
                        <img
                          src={post.media_url}
                          alt={post.caption ? post.caption.substring(0, 40) : "Instagram post"}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />
                        {post.media_type === "VIDEO" && (
                          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-2 rounded-full border border-white/20 text-white shadow">
                            <Play className="w-4 h-4 fill-white" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-[#4A0E1B]/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-md">
                            <Instagram className="w-6 h-6" />
                          </div>
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div className="space-y-2.5">
                          <p className="text-xs text-[#3C2A21]/90 leading-relaxed font-light line-clamp-3">
                            {post.caption || "View updates and insights."}
                          </p>
                          {post.caption && post.caption.length > 100 && (
                            <span className="text-[10px] tracking-wider font-bold text-[#B38B36] uppercase group-hover:underline">
                              Read More
                            </span>
                          )}
                        </div>

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
          </>
        )}

        {/* YOUTUBE TAB CONTENT */}
        {activeTab === "youtube" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {YOUTUBE_VIDEOS.map((video) => (
                <div
                  key={video.id}
                  onClick={() => setActiveVideoId(video.id)}
                  className="group cursor-pointer bg-white border border-[#E5E1D8] rounded-2xl overflow-hidden shadow-sm flex flex-col h-[465px] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(179,139,54,0.1)] hover:border-[#B38B36]/30"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#FAF9F6] flex-shrink-0">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-bold z-10">
                      {video.duration}
                    </div>
                    <div className="absolute inset-0 bg-[#4A0E1B]/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-red-600 border border-red-500 flex items-center justify-center text-white transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-lg ring-4 ring-red-500/20">
                        <Play className="w-6 h-6 fill-white text-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h4 className="font-serif text-base text-[#3C2A21] font-bold group-hover:text-[#B38B36] transition-colors line-clamp-2 leading-tight">
                        {video.title}
                      </h4>
                      <p className="text-xs text-[#3C2A21]/70 leading-relaxed font-light line-clamp-3">
                        {video.desc}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-[#E5E1D8]/60 mt-4 text-[10px] tracking-wider text-[#725D46]/80 font-bold uppercase">
                      <span>{video.publishedAt}</span>
                      <span className="text-[#B38B36] font-bold">{video.views}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-14">
              <a
                href="https://youtube.com/@soulkarmabygitikasharma?si=C64wWc7B6Imj0Ql-"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white border border-red-500 text-xs tracking-[0.15em] uppercase font-bold hover:shadow-[0_10px_25px_rgba(220,38,38,0.2)] transition-all duration-300 group"
              >
                View All on YouTube
                <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </>
        )}

      </div>

      {/* YouTube Video Player Modal Popup */}
      <Dialog open={!!activeVideoId} onOpenChange={(open) => !open && setActiveVideoId(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black border-none overflow-hidden aspect-video rounded-xl shadow-2xl">
          <DialogTitle className="sr-only">Play YouTube Video</DialogTitle>
          <DialogDescription className="sr-only">
            Watch astrology and Vastu tips by Gitika Sharma.
          </DialogDescription>
          {activeVideoId && (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default InstagramFeed;
