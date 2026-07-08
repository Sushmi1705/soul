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
  ChevronRight,
  Info,
  AlertTriangle,
  Award,
  BookOpen
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
        <p className="text-sm tracking-wider uppercase font-semibold">Loading editorial details...</p>
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

  // Calculate dynamic reading time
  const wordCount = post.content ? post.content.split(/\s+/).length : 100;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200)) + " min read";

  // Find index for Prev / Next links
  const currentIndex = allBlogs.findIndex((b) => String(b.id) === String(id));
  const prevPost = currentIndex > 0 ? allBlogs[currentIndex - 1] : null;
  const nextPost = currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null;

  // Get related posts
  const relatedPosts = allBlogs
    .filter((b) => String(b.id) !== String(id))
    .sort((a, b) => {
      if (a.category === post.category && b.category !== post.category) return -1;
      if (b.category === post.category && a.category !== post.category) return 1;
      return 0;
    })
    .slice(0, 3);

  const shareUrl = window.location.href;
  const shareTitle = encodeURIComponent(post.title);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Custom Editorial Block Parser
  const parseContent = (content) => {
    if (!content) return [];
    
    const clean = content.replace(/\\n/g, '\n');
    const lines = clean.split('\n');
    const blocks = [];
    let currentList = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {
        if (currentList) {
          blocks.push(currentList);
          currentList = null;
        }
        continue;
      }
      
      // Headings
      if (line.startsWith('###')) {
        if (currentList) { blocks.push(currentList); currentList = null; }
        blocks.push({ type: 'h3', text: line.replace(/^###\s*/, '') });
        continue;
      }
      if (line.startsWith('##')) {
        if (currentList) { blocks.push(currentList); currentList = null; }
        blocks.push({ type: 'h2', text: line.replace(/^##\s*/, '') });
        continue;
      }
      
      // Custom tags
      if (line.startsWith('[HIGHLIGHT:') && line.endsWith(']')) {
        if (currentList) { blocks.push(currentList); currentList = null; }
        blocks.push({ type: 'highlight', text: line.substring(11, line.length - 1) });
        continue;
      }
      if (line.startsWith('[INFO:') && line.endsWith(']')) {
        if (currentList) { blocks.push(currentList); currentList = null; }
        blocks.push({ type: 'info', text: line.substring(6, line.length - 1) });
        continue;
      }
      if (line.startsWith('[DID YOU KNOW?:') && line.endsWith(']')) {
        if (currentList) { blocks.push(currentList); currentList = null; }
        blocks.push({ type: 'did-you-know', text: line.substring(15, line.length - 1) });
        continue;
      }
      if (line.startsWith('[WARNING:') && line.endsWith(']')) {
        if (currentList) { blocks.push(currentList); currentList = null; }
        blocks.push({ type: 'warning', text: line.substring(9, line.length - 1) });
        continue;
      }
      if (line.startsWith('[QUOTE:') && line.endsWith(']')) {
        if (currentList) { blocks.push(currentList); currentList = null; }
        blocks.push({ type: 'quote', text: line.substring(7, line.length - 1) });
        continue;
      }

      // Bullet List items
      if (line.startsWith('*') || line.startsWith('•') || line.startsWith('-')) {
        const itemText = line.replace(/^[*•\-]\s*/, '');
        if (currentList && currentList.type === 'bullet') {
          currentList.items.push(itemText);
        } else {
          if (currentList) { blocks.push(currentList); }
          currentList = { type: 'bullet', items: [itemText] };
        }
        continue;
      }

      // Numbered List items
      if (/^\d+\.\s/.test(line)) {
        const itemText = line.replace(/^\d+\.\s*/, '');
        if (currentList && currentList.type === 'number') {
          currentList.items.push(itemText);
        } else {
          if (currentList) { blocks.push(currentList); }
          currentList = { type: 'number', items: [itemText] };
        }
        continue;
      }
      
      // Default paragraphs
      if (currentList) { blocks.push(currentList); currentList = null; }
      blocks.push({ type: 'paragraph', text: line });
    }
    
    if (currentList) {
      blocks.push(currentList);
    }
    
    return blocks;
  };

  const parsedBlocks = parseContent(post.content);

  return (
    <div className="pt-24 pb-24 bg-[#FDFBF7] min-h-screen relative overflow-hidden">
      
      {/* Background radial overlays */}
      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(229,192,106,0.06),transparent_60%)] pointer-events-none" />
      <div className="absolute top-1/2 left-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(74,14,27,0.03),transparent_60%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-20">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E5E1D8]/60 pb-6 mb-12">
          <nav className="text-[10px] tracking-[0.2em] text-[#725D46] uppercase font-bold flex flex-wrap items-center gap-1.5">
            <Link to="/" className="hover:text-[#B38B36] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-[#B38B36]/50" />
            <Link to="/blog" className="hover:text-[#B38B36] transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3 text-[#B38B36]/50" />
            <span className="text-[#3C2A21] truncate max-w-[200px] inline-block font-extrabold">{post.title}</span>
          </nav>
          
          <button 
            onClick={() => navigate("/blog")}
            className="group inline-flex items-center gap-2 self-start text-[11px] tracking-[0.2em] font-extrabold text-[#3C2A21] hover:text-[#B38B36] uppercase transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
            Back to Journal
          </button>
        </div>

        {/* HERO SECTION */}
        <header className="space-y-6 mb-12 text-left">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B38B36]/10 border border-[#B38B36]/20 text-[#B38B36] text-[10px] tracking-[0.2em] uppercase font-black">
            <Bookmark className="w-3 h-3" />
            {post.category}
          </span>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#3C2A21] leading-[1.1] tracking-tight">
            {post.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-y border-[#E5E1D8]/60 py-6">
            
            {/* Author details */}
            <div className="flex items-center gap-3.5">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80"
                alt="Gitika Sharma"
                className="w-11 h-11 rounded-full object-cover border border-[#B38B36]/20"
              />
              <div className="text-left">
                <div className="text-xs font-bold text-[#3C2A21] uppercase tracking-wider">Gitika Sharma</div>
                <div className="flex items-center gap-3 text-[10px] text-stone-500 font-medium tracking-wide mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {readingTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Share Controls */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] tracking-wider uppercase text-stone-400 font-bold mr-1">Share:</span>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#E5E1D8] flex items-center justify-center text-stone-600 hover:text-white hover:bg-[#3b5998] hover:border-[#3b5998] transition-all"
                title="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a 
                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#E5E1D8] flex items-center justify-center text-stone-600 hover:text-white hover:bg-black hover:border-black transition-all"
                title="X"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a 
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#E5E1D8] flex items-center justify-center text-stone-600 hover:text-white hover:bg-[#0077b5] hover:border-[#0077b5] transition-all"
                title="LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <button 
                onClick={handleCopyLink}
                className="w-9 h-9 rounded-full border border-[#E5E1D8] flex items-center justify-center text-stone-600 hover:text-[#B38B36] hover:border-[#B38B36] transition-all bg-white relative"
                title="Copy Link"
              >
                <Link2 className="w-3.5 h-3.5" />
                {copied && (
                  <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[8px] px-2 py-0.5 rounded shadow uppercase font-bold tracking-wider">
                    Copied
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Large Featured Image */}
        <div className="relative aspect-[21/9] overflow-hidden rounded-[2.5rem] shadow-[0_20px_50px_rgba(179,139,54,0.08)] border border-[#E5E1D8] mb-12">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* CONTENT AREA */}
        <div className="max-w-3xl mx-auto text-left">
          
          {/* Excerpt Lead paragraph */}
          {post.excerpt && (
            <p className="font-serif text-lg md:text-xl text-[#3C2A21] italic leading-relaxed border-l-2 border-[#B38B36] pl-5 mb-10 text-[#4A3C31] font-medium">
              {post.excerpt}
            </p>
          )}

          {/* Main prose */}
          <div className="prose prose-stone max-w-none text-base md:text-lg text-[#3C2A21]/90 leading-[1.8] tracking-normal font-sans space-y-6">
            {parsedBlocks.map((block, idx) => {
              switch (block.type) {
                
                case "paragraph":
                  return <p key={idx} className="mb-6">{block.text}</p>;
                
                case "h2":
                  return (
                    <h2 key={idx} className="font-serif text-2xl md:text-3xl text-[#3C2A21] mt-10 mb-4 font-bold tracking-wide leading-tight">
                      {block.text}
                    </h2>
                  );

                case "h3":
                  return (
                    <h3 key={idx} className="font-serif text-xl md:text-2xl text-[#3C2A21] mt-8 mb-3 font-bold tracking-wide leading-tight">
                      {block.text}
                    </h3>
                  );

                case "highlight":
                  return (
                    <div 
                      key={idx} 
                      className="bg-[#B38B36]/5 border-l-4 border-[#B38B36] p-6 rounded-r-2xl my-8 font-serif text-base md:text-lg text-[#3C2A21] leading-relaxed italic shadow-sm"
                    >
                      {block.text}
                    </div>
                  );

                case "info":
                  return (
                    <div 
                      key={idx} 
                      className="bg-[#4A0E1B]/5 border-l-4 border-[#4A0E1B] p-6 rounded-r-2xl my-8 text-sm text-[#3C2A21]/95 leading-relaxed flex gap-3.5 shadow-sm"
                    >
                      <Info className="w-5 h-5 text-[#4A0E1B] shrink-0 mt-0.5" />
                      <div>{block.text}</div>
                    </div>
                  );

                case "did-you-know":
                  return (
                    <div 
                      key={idx} 
                      className="bg-[#E5C06A]/10 border border-[#E5C06A]/30 p-6 rounded-2xl my-8 text-sm text-[#3C2A21]/95 leading-relaxed flex gap-3.5 shadow-sm"
                    >
                      <Sparkles className="w-5 h-5 text-[#B38B36] shrink-0 mt-0.5 animate-pulse" />
                      <div>
                        <strong className="text-[#B38B36] block mb-1 uppercase font-bold tracking-wider text-[10px]">Did you know?</strong>
                        {block.text}
                      </div>
                    </div>
                  );

                case "warning":
                  return (
                    <div 
                      key={idx} 
                      className="bg-red-50/60 border-l-4 border-red-500/70 p-6 rounded-r-2xl my-8 text-sm text-red-950 leading-relaxed flex gap-3.5 shadow-sm"
                    >
                      <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-red-800 block mb-1 uppercase font-bold tracking-wider text-[10px]">Important Note</strong>
                        {block.text}
                      </div>
                    </div>
                  );

                case "quote":
                  return (
                    <blockquote 
                      key={idx} 
                      className="relative py-8 px-10 border-t border-b border-[#B38B36]/20 my-10 text-center font-serif text-lg md:text-xl text-[#3C2A21] italic leading-relaxed"
                    >
                      <div className="absolute top-1 left-4 text-[#B38B36]/15 font-serif text-8xl select-none leading-none">“</div>
                      <p className="relative z-10">{block.text}</p>
                    </blockquote>
                  );

                case "bullet":
                  return (
                    <ul key={idx} className="list-none pl-1 mb-6 space-y-3 font-medium">
                      {block.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm sm:text-base">
                          <span className="text-[#B38B36] mt-1 text-xs select-none">✦</span>
                          <span className="text-[#3C2A21]/90">{item}</span>
                        </li>
                      ))}
                    </ul>
                  );

                case "number":
                  return (
                    <ol key={idx} className="list-none pl-1 mb-6 space-y-3 font-medium">
                      {block.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3.5 text-sm sm:text-base">
                          <span className="w-5 h-5 rounded-full bg-[#B38B36]/10 text-[#B38B36] border border-[#B38B36]/20 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-[#3C2A21]/90">{item}</span>
                        </li>
                      ))}
                    </ol>
                  );

                default:
                  return null;
              }
            })}
          </div>

          {/* AUTHOR SECTION */}
          <div className="bg-white border border-[#E5E1D8] rounded-[2.5rem] p-8 sm:p-10 my-16 shadow-[0_15px_40px_rgba(179,139,54,0.05)] relative overflow-hidden flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Ambient glows */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#B38B36]/5 rounded-full blur-xl pointer-events-none" />

            <div className="shrink-0 flex flex-col items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80"
                alt="Gitika Sharma"
                className="w-24 h-24 rounded-full object-cover border-2 border-[#B38B36]/20"
              />
              <div className="inline-flex items-center gap-1 bg-[#B38B36]/10 border border-[#B38B36]/20 px-2.5 py-0.5 rounded-full text-[9px] tracking-wider uppercase font-extrabold text-[#B38B36]">
                <Award className="w-3 h-3 text-[#B38B36]" />
                15+ Yrs Exp
              </div>
            </div>

            <div className="space-y-4 flex-1 text-left">
              <div>
                <h4 className="font-serif text-xl font-bold text-[#3C2A21]">Gitika Sharma</h4>
                <p className="text-xs text-[#B38B36] uppercase tracking-wider font-semibold mt-0.5">Vastu Acharya & Vedic Astrologer</p>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed font-light">
                Gitika Sharma is the principal mentor at AstroPower24 Vedic Academy. She integrates astrological matrices, numerology coordinates, and spatial Vastu configurations to enable absolute life alignment and harmony.
              </p>
              
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["Vedic Astrology", "Vastu Shastra", "Numerology", "Karmic Remedies"].map((pill) => (
                  <span key={pill} className="bg-[#FAF9F5] border border-[#E5E1D8]/80 text-[#725D46] px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider">
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CALL TO ACTION */}
          <div className="bg-[#3C2A21] rounded-[2.5rem] p-8 sm:p-12 text-center text-white relative overflow-hidden border border-[#B38B36]/20 shadow-xl mb-16">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/5 opacity-20 pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <span className="text-[10px] tracking-[0.4em] uppercase text-[#E5C06A] font-bold block">One-on-One Session</span>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold max-w-lg mx-auto leading-snug">
                Still Looking for Personalized Guidance?
              </h3>
              <p className="text-stone-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-light">
                Unlock custom cosmic blueprints, Vastu mapping, and career destiny keys in a private online consultation with Gitika Sharma.
              </p>
              <Link
                to="/payment"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#3C2A21] text-xs tracking-widest uppercase font-bold rounded-full hover:shadow-lg transition-all"
              >
                Book Session Now
              </Link>
            </div>
          </div>

          {/* Adjacent Article Links */}
          <div className="border-t border-b border-[#E5E1D8]/60 py-6 mb-16 flex justify-between items-center gap-6 text-xs font-bold uppercase tracking-wider text-stone-500">
            <div>
              {prevPost ? (
                <Link to={`/blog/${prevPost.id}`} className="hover:text-[#B38B36] transition-colors flex items-center gap-1.5">
                  <ArrowLeft className="w-3.5 h-3.5" /> Previous
                </Link>
              ) : (
                <span className="opacity-30 cursor-not-allowed flex items-center gap-1.5">
                  <ArrowLeft className="w-3.5 h-3.5" /> First
                </span>
              )}
            </div>
            <div className="h-4 w-px bg-[#E5E1D8]/60 shrink-0" />
            <div>
              {nextPost ? (
                <Link to={`/blog/${nextPost.id}`} className="hover:text-[#B38B36] transition-colors flex items-center gap-1.5">
                  Next <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <span className="opacity-30 cursor-not-allowed flex items-center gap-1.5">
                  Latest <ArrowRight className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
          </div>

        </div>

        {/* RELATED CONTENT */}
        {relatedPosts.length > 0 && (
          <div className="border-t border-[#E5E1D8]/60 pt-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-10 bg-[#B38B36]" />
              <span className="text-[10px] tracking-[0.4em] uppercase text-[#725D46] font-bold">Related Wisdom</span>
            </div>
            
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3C2A21] mb-12 text-left">
              Continue reading
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((rel) => {
                return (
                  <Link 
                    key={rel.id}
                    to={`/blog/${rel.id}`}
                    className="group bg-white border border-[#E5E1D8] rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(179,139,54,0.06)] hover:border-[#B38B36]/30 transition-all duration-500 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100 border-b border-[#E5E1D8]/60">
                        <img
                          src={rel.image}
                          alt={rel.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[8px] tracking-wider uppercase font-black text-[#B38B36] border border-[#E5E1D8]/40">
                          {rel.category}
                        </div>
                      </div>
                      <div className="p-5 text-left">
                        <h3 className="font-serif text-base text-[#3C2A21] mb-2 leading-snug group-hover:text-[#B38B36] transition-colors line-clamp-2 font-bold">
                          {rel.title}
                        </h3>
                        <p className="text-xs text-stone-500 leading-relaxed line-clamp-3 font-light">
                          {rel.excerpt}
                        </p>
                      </div>
                    </div>
                    <div className="p-5 pt-0 text-left">
                      <div className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.25em] uppercase text-[#B38B36] font-bold">
                        Read story
                        <ArrowRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
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
