import { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { JOURNAL } from "@/data/content";

const Journal = () => {
  const [dynamicBlogs, setDynamicBlogs] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

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
        console.error("Failed to load homepage blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  const displayedBlogs = [...dynamicBlogs, ...JOURNAL].slice(0, 3);

  return (
    <section
      id="journal"
      data-testid="journal-section"
      className="relative py-24 md:py-36 bg-[#FDFBF7]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-[#B38B36]" />
              <span className="text-[11px] tracking-[0.4em] uppercase text-[#725D46]">
                Journal
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl tracking-tight text-[#3C2A21] leading-[1.05]">
              Notes from the <em className="italic text-[#B38B36] font-light">cosmos.</em>
            </h2>
          </div>
          <Link
            to="/blog"
            data-testid="journal-view-all"
            className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-[#3C2A21] hover:text-[#B38B36] transition-colors"
          >
            View all writings
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {displayedBlogs.map((b) => (
            <article
              key={b.id}
              onClick={() => setSelectedPost(b)}
              data-testid={`journal-card-${b.id}`}
              className="group bg-white border border-[#E5E1D8] rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(179,139,54,0.25)] hover:border-[#B38B36]/30 transition-all duration-500 cursor-pointer"
            >
              <div className="aspect-[16/10] overflow-hidden bg-[#F3F1EC]">
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-7 text-left">
                <div className="flex items-center gap-3 text-[10px] tracking-[0.25em] uppercase text-[#725D46] mb-4">
                  <span>{b.category}</span>
                  <span className="w-1 h-1 rounded-full bg-[#B38B36]" />
                  <span>{b.date}</span>
                </div>
                <h3 className="font-serif text-xl text-[#3C2A21] mb-3 leading-snug group-hover:text-[#B38B36] transition-colors line-clamp-2">
                  {b.title}
                </h3>
                <p className="text-sm text-[#725D46] leading-relaxed line-clamp-3">
                  {b.excerpt}
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-[#B38B36]">
                  Read article
                  <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

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
    </section>
  );
};

export default Journal;
