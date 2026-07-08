import { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { JOURNAL } from "@/data/content";

const Journal = () => {
  const [dynamicBlogs, setDynamicBlogs] = useState([]);

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
            <Link
              key={b.id}
              to={`/blog/${b.id}`}
              data-testid={`journal-card-${b.id}`}
              className="group bg-white border border-[#E5E1D8] rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(179,139,54,0.25)] hover:border-[#B38B36]/30 transition-all duration-500 cursor-pointer flex flex-col justify-between"
            >
              <div>
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
                  <p className="text-sm text-[#725D46] leading-relaxed line-clamp-3 font-light">
                    {b.excerpt}
                  </p>
                </div>
              </div>
              <div className="p-7 pt-0 text-left">
                <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-[#B38B36] font-bold">
                  Read article
                  <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Journal;
