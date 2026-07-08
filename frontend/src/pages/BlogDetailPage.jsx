import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Link2,
  ArrowRight,
  Sparkles,
  Bookmark,
  ChevronRight
} from "lucide-react";
import { JOURNAL } from "@/data/content";

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8005";
      try {
        const response = await fetch(`${apiUrl}/api/blogs`);
        let dynamicData = [];
        if (response.ok) {
          dynamicData = await response.json();
        }
        setAllBlogs([...dynamicData, ...JOURNAL]);
      } catch (error) {
        console.error("Failed to load blog posts:", error);
        setAllBlogs(JOURNAL);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Find current post
  const post = allBlogs.find((b) => String(b.id) === String(id));

  // Dynamic document title update (SEO)
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Astro Power 24 By Gitika Sharma`;
    }
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] pt-32 pb-20 flex flex-col items-center justify-center text-[#725D46]">
        <div className="border-4 border-[#B38B36] border-t-transparent w-10 h-10 rounded-full animate-spin mb-4"></div>
        <p className="text-sm tracking-wider uppercase font-semibold">Loading cosmic details...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <Sparkles className="w-12 h-12 text-[#B38B36] mb-6 animate-pulse" />
        <h1 className="font-serif text-3xl md:text-4xl text-[#3C2A21] font-bold mb-4">Article Not Found</h1>
        <p className="text-sm text-[#725D46] max-w-md mb-8 leading-relaxed font-light">
          The celestial alignment of this page seems to have shifted, or the article you are looking for has been archived.
        </p>
        <Link 
          to="/blog"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#3C2A21] hover:bg-[#B38B36] text-white rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blogs
        </Link>
      </div>
    );
  }

  // Calculate dynamic reading time (200 words per minute average)
  const wordCount = post.content ? post.content.split(/\s+/).length : 100;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200)) + " min read";

  // Find index for Prev / Next links
  const currentIndex = allBlogs.findIndex((b) => String(b.id) === String(id));
  const prevPost = currentIndex > 0 ? allBlogs[currentIndex - 1] : null;
  const nextPost = currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null;

  // Get related posts (up to 3, matching category or just other latest)
  const relatedPosts = allBlogs
    .filter((b) => String(b.id) !== String(id))
    .sort((a, b) => {
      if (a.category === post.category && b.category !== post.category) return -1;
      if (b.category === post.category && a.category !== post.category) return 1;
      return 0;
    })
    .slice(0, 3);

  // Social sharing handlers
  const shareUrl = window.location.href;
  const shareTitle = encodeURIComponent(post.title);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-28 pb-24 bg-[#FAF9F5] min-h-screen relative overflow-hidden">
      
      {/* Background celestial design highlights */}
      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(229,192,106,0.1),transparent_60%)] pointer-events-none" />
      <div className="absolute top-1/2 left-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(179,139,54,0.06),transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-0 right-[-5%] w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(229,192,106,0.08),transparent_60%)] pointer-events-none" />

      {/* Decorative Orbits */}
      <div className="absolute top-10 right-10 w-[450px] h-[450px] rounded-full border border-[#B38B36]/10 border-dashed animate-[spinSlow_120s_linear_infinite] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[350px] h-[350px] rounded-full border border-[#B38B36]/8 border-dotted animate-[spinSlowReverse_90s_linear_infinite] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-20">
        
        {/* Navigation Breadcrumbs & Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E5E1D8]/60 pb-6 mb-12">
          {/* Breadcrumbs */}
          <nav className="text-[10px] tracking-[0.15em] text-[#725D46] uppercase font-bold flex items-center gap-1.5">
            <Link to="/" className="hover:text-[#B38B36] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-[#B38B36]/50" />
            <Link to="/blog" className="hover:text-[#B38B36] transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3 text-[#B38B36]/50" />
            <span className="text-[#3C2A21] truncate max-w-[220px] inline-block">{post.title}</span>
          </nav>
          
          {/* Minimalist Back Button */}
          <button 
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 self-start text-[11px] tracking-[0.2em] font-extrabold text-[#3C2A21] hover:text-[#B38B36] uppercase transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1.5 transition-transform duration-300" />
            Back to Articles
          </button>
        </div>

        {/* Hero Area: Premium Editorial Split */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center mb-16">
          {/* Left: Featured Image Banner */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-[#B38B36]/20 shadow-[0_30px_70px_rgba(179,139,54,0.15)] bg-white group">
              <div className="absolute inset-0 bg-[#B38B36]/5 mix-blend-overlay z-10" />
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-103"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right: Premium Article Header Details */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B38B36]/10 border border-[#B38B36]/20 text-[#B38B36] text-[10px] tracking-[0.2em] uppercase font-black shadow-sm">
              <Bookmark className="w-3 h-3 text-[#B38B36]" />
              {post.category}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#3C2A21] font-bold leading-tight tracking-wide">
              {post.title}
            </h1>

            {/* Metadata Section */}
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-[#725D46] border-y border-[#E5E1D8]/60 py-5 font-normal tracking-wide">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#B38B36]" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#B38B36]" />
                <span>{readingTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#B38B36]" />
                <span className="font-semibold text-[#3C2A21]">Gitika Sharma</span>
              </div>
            </div>

            {/* Social Share Controls */}
            <div className="space-y-3 text-left pt-2">
              <span className="text-[10px] tracking-widest uppercase font-bold text-[#725D46]/70 block">Share Cosmic Insight</span>
              <div className="flex items-center gap-3">
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[#E5E1D8] flex items-center justify-center text-stone-600 hover:text-white hover:bg-[#3b5998] hover:border-[#3b5998] transition-all duration-300 hover:scale-105 shadow-sm"
                  title="Share on Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a 
                  href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[#E5E1D8] flex items-center justify-center text-stone-600 hover:text-white hover:bg-black hover:border-black transition-all duration-300 hover:scale-105 shadow-sm"
                  title="Share on X"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a 
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[#E5E1D8] flex items-center justify-center text-stone-600 hover:text-white hover:bg-[#0077b5] hover:border-[#0077b5] transition-all duration-300 hover:scale-105 shadow-sm"
                  title="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a 
                  href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[#E5E1D8] flex items-center justify-center text-stone-600 hover:text-white hover:bg-[#25D366] hover:border-[#25D366] transition-all duration-300 hover:scale-105 shadow-sm"
                  title="Share on WhatsApp"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.022-.08-.124-.12-.228-.168-.104-.047-.61-.3-1.05-.515-.436-.217-.61-.2-.828.028-.217.228-.756.985-.928 1.15-.17.169-.344.185-.572.08-.228-.1-.963-.354-1.836-1.134-.68-.607-1.138-1.355-1.27-1.583-.133-.228-.014-.351.1-.464.1-.1.228-.268.344-.4.116-.134.156-.228.228-.38.076-.153.036-.285-.02-.4-.055-.117-.507-1.22-.693-1.67-.184-.447-.367-.387-.507-.394-.13-.005-.28-.007-.43-.007-.15 0-.394.056-.6.282-.207.228-.79.774-.79 1.888s.81 2.2 1.925 2.35c.115.015 2.186 3.34 5.295 4.68.74.32 1.317.51 1.768.653.744.238 1.42.203 1.954.122.597-.09 1.837-.75 2.095-1.438.258-.687.258-1.275.18-1.385zM12.016 2.006c-5.503 0-10 4.496-10 10 0 1.758.46 3.47 1.333 4.98L2 22l5.23-1.37c1.47.8 3.11 1.22 4.786 1.22 5.5 0 10-4.496 10-10 0-5.504-4.5-10-10-10z"/>
                  </svg>
                </a>
                <button 
                  onClick={handleCopyLink}
                  className="w-10 h-10 rounded-full border border-[#E5E1D8] flex items-center justify-center text-stone-600 hover:text-[#B38B36] hover:border-[#B38B36] transition-all duration-300 hover:scale-105 bg-white relative shadow-sm"
                  title="Copy Article Link"
                >
                  <Link2 className="w-4 h-4" />
                  {copied && (
                    <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[9px] px-2.5 py-1 rounded shadow-md uppercase tracking-wider font-extrabold">
                      Copied
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Luxury Article Content Card Container */}
        <div className="max-w-4xl mx-auto bg-white border border-[#E5E1D8]/60 shadow-[0_20px_50px_rgba(179,139,54,0.06)] rounded-[2.5rem] p-8 md:p-14 mb-16 relative z-10 text-left">
          
          {/* Excerpt Lead Block */}
          {post.excerpt && (
            <div className="border-l-4 border-[#B38B36] pl-6 italic text-[#4A3B32] mb-10 text-lg md:text-xl leading-[1.7] font-medium text-left">
              {post.excerpt}
            </div>
          )}

          {/* Main Body Prose parsed paragraphs */}
          <div className="prose prose-stone max-w-none text-[16px] md:text-[18px] text-[#3C2A21] leading-[1.85] font-normal tracking-wide space-y-6">
            {(() => {
              const cleanContent = post.content.replace(/\\n/g, '\n');
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
                    <ul key={idx} className="list-disc pl-6 mb-6 space-y-2.5 text-[#3C2A21] font-medium">
                      {items.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  );
                }

                // Numbered list item
                if (/^\d+\.\s/.test(pStr)) {
                  const items = pStr.split(/\n+/).map(item => item.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
                  return (
                    <ol key={idx} className="list-decimal pl-6 mb-6 space-y-2.5 text-[#3C2A21] font-medium">
                      {items.map((item, i) => <li key={i}>{item}</li>)}
                    </ol>
                  );
                }

                // Blockquote / Quote detection
                if (pStr.startsWith('\"') && pStr.endsWith('\"')) {
                  return (
                    <blockquote key={idx} className="bg-[#FAF9F5] border-l-4 border-[#B38B36] p-6 rounded-r-xl italic my-8 text-stone-600 pl-8 leading-[1.8] font-light shadow-sm">
                      {pStr}
                    </blockquote>
                  );
                }

                // Heading detection
                const isHeading = pStr.length < 90 && !pStr.endsWith('.') && !/^[•\-]\s*/.test(pStr) && !/^\d+\.\s/.test(pStr);
                if (isHeading) {
                  return (
                    <h4 key={idx} className="font-serif text-2xl md:text-3xl text-[#3C2A21] mt-12 mb-6 font-bold tracking-wide leading-snug border-b border-[#E5E1D8]/40 pb-2">
                      {pStr}
                    </h4>
                  );
                }

                // Normal paragraph
                return (
                  <p key={idx} className="text-[#3C2A21]/95 mb-6 leading-relaxed">
                    {pStr}
                  </p>
                );
              });
            })()}
          </div>
        </div>

        {/* Adjacent Navigation (Prev / Next Article) */}
        <div className="max-w-4xl mx-auto border-t border-b border-[#E5E1D8]/60 py-8 mb-20 flex justify-between items-center gap-6">
          <div>
            {prevPost ? (
              <Link 
                to={`/blog/${prevPost.id}`}
                className="group flex flex-col gap-1.5 text-left"
              >
                <span className="text-[10px] tracking-widest uppercase text-[#725D46]/70 font-extrabold flex items-center gap-1.5 group-hover:text-[#B38B36] transition-colors duration-300">
                  <ArrowLeft className="w-3 h-3 transform group-hover:-translate-x-0.5 transition-transform" /> Previous Article
                </span>
                <span className="font-serif text-sm md:text-base text-[#3C2A21] font-bold group-hover:text-[#B38B36] transition-colors duration-300 line-clamp-1 max-w-[250px] md:max-w-[320px]">
                  {prevPost.title}
                </span>
              </Link>
            ) : (
              <div className="opacity-30 flex flex-col gap-1.5 text-left select-none">
                <span className="text-[10px] tracking-widest uppercase text-[#725D46]/70 font-bold flex items-center gap-1.5">
                  <ArrowLeft className="w-3 h-3" /> First Article
                </span>
                <span className="font-serif text-sm md:text-base text-[#3C2A21] font-bold line-clamp-1">
                  Beginner's Threshold
                </span>
              </div>
            )}
          </div>

          <div className="h-10 w-px bg-[#E5E1D8]/60 shrink-0" />

          <div>
            {nextPost ? (
              <Link 
                to={`/blog/${nextPost.id}`}
                className="group flex flex-col gap-1.5 text-right items-end"
              >
                <span className="text-[10px] tracking-widest uppercase text-[#725D46]/70 font-extrabold flex items-center gap-1.5 group-hover:text-[#B38B36] transition-colors duration-300">
                  Next Article <ArrowRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
                </span>
                <span className="font-serif text-sm md:text-base text-[#3C2A21] font-bold group-hover:text-[#B38B36] transition-colors duration-300 line-clamp-1 max-w-[250px] md:max-w-[320px]">
                  {nextPost.title}
                </span>
              </Link>
            ) : (
              <div className="opacity-30 flex flex-col gap-1.5 text-right items-end select-none">
                <span className="text-[10px] tracking-widest uppercase text-[#725D46]/70 font-bold flex items-center gap-1.5">
                  Latest Article <ArrowRight className="w-3 h-3" />
                </span>
                <span className="font-serif text-sm md:text-base text-[#3C2A21] font-bold line-clamp-1">
                  Reached the Zenith
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Premium Related Blogs Section */}
        {relatedPosts.length > 0 && (
          <div className="border-t border-[#E5E1D8]/60 pt-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-10 bg-[#B38B36]" />
              <span className="text-[11px] tracking-[0.4em] uppercase text-[#725D46] font-bold">
                Related Wisdom
              </span>
            </div>
            
            <h2 className="font-serif text-3xl text-[#3C2A21] font-bold mb-12 text-left">
              Writings of similar alignment
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((rel) => {
                const dateObj = new Date(rel.date);
                const day = isNaN(dateObj.getTime()) ? "08" : String(dateObj.getDate()).padStart(2, '0');
                const month = isNaN(dateObj.getTime()) ? "Jun" : dateObj.toLocaleString('default', { month: 'short' });

                return (
                  <Link 
                    key={rel.id}
                    to={`/blog/${rel.id}`}
                    className="group bg-white border border-[#E5E1D8] rounded-2xl overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-20px_rgba(179,139,54,0.15)] hover:border-[#B38B36]/30 transition-all duration-500 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative overflow-hidden h-52">
                        {/* Date Box */}
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm z-10 px-3 py-1.5 text-center shadow-md border border-[#E5E1D8]/50">
                          <span className="block text-lg font-bold text-[#3C2A21] leading-none">{day}</span>
                          <span className="block text-[10px] uppercase tracking-wider text-[#725D46] mt-0.5">{month}</span>
                        </div>
                        <img
                          src={rel.image}
                          alt={rel.title}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-103"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-6 text-left">
                        <span className="text-[9px] uppercase tracking-widest text-[#B38B36] font-extrabold block mb-2">{rel.category}</span>
                        <h3 className="font-serif text-lg text-[#3C2A21] mb-3 leading-snug group-hover:text-[#B38B36] transition-colors line-clamp-2 font-bold">
                          {rel.title}
                        </h3>
                        <p className="text-xs text-[#725D46] leading-relaxed line-clamp-3 font-light">
                          {rel.excerpt}
                        </p>
                      </div>
                    </div>
                    <div className="p-6 pt-0 text-left">
                      <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[#B38B36] font-bold">
                        Read article
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogDetailPage;
