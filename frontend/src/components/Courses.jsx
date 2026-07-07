import { ShoppingBag, Plus, Check } from "lucide-react";
import { useState } from "react";
import { COURSES, formatINR } from "@/data/content";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const Courses = () => {
  const { addItem, setIsOpen } = useCart();
  const [added, setAdded] = useState({});

  const handleAdd = (c) => {
    addItem(c);
    setAdded((p) => ({ ...p, [c.id]: true }));
    toast.success(`${c.title} added to cart`, {
      action: {
        label: "View cart",
        onClick: () => setIsOpen(true),
      },
    });
    setTimeout(() => setAdded((p) => ({ ...p, [c.id]: false })), 1600);
  };

  return (
    <section
      id="courses"
      data-testid="courses-section"
      className="relative py-24 md:py-36 bg-[#FDFBF7] text-[#3C2A21] overflow-hidden"
    >
      {/* Course Nebula Accent */}
      <div className="absolute top-1/2 right-0 w-[40%] h-[80%] rounded-full opacity-[0.05] blur-[120px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #B38B36 0%, transparent 70%)' }}
      />
      {/* Decorative texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-[#B38B36]" />
              <span className="text-[11px] tracking-[0.4em] uppercase text-[#B38B36] font-black">
                Our Courses
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] max-w-2xl text-[#3C2A21]">
              Learn the{" "}
              <em className="italic text-[#B38B36] font-light">sacred sciences.</em>
            </h2>
          </div>
          <p className="text-stone-700 max-w-md leading-relaxed font-medium">
            Lifetime access, certificate upon completion, and a private cohort
            of fellow seekers guided personally by Gitika.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {COURSES.map((c) => (
            <article
              key={c.id}
              data-testid={`course-card-${c.id}`}
              className="group relative bg-white border border-[#E5E1D8] rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-20px_rgba(179,139,54,0.15)] hover:border-[#B38B36]/30"
            >
              <div className="relative aspect-square overflow-hidden bg-[#F9F7F2]">
                <img
                  src={c.image}
                  alt={c.title}
                  className="w-full h-full object-cover transform scale-[1.22] transition-transform duration-700 group-hover:scale-[1.32]"
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80" }}
                />
                <div className="absolute top-4 left-4 text-[10px] tracking-[0.25em] uppercase bg-white/80 backdrop-blur px-3 py-1.5 rounded-full text-[#B38B36] border border-[#B38B36]/20 font-bold">
                  {c.category}
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <h3 className="font-serif text-2xl text-[#3C2A21] mb-4 group-hover:text-[#B38B36] transition-colors">{c.title}</h3>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-stone-100">
                  <div>
                    <div className="text-[10px] tracking-[0.25em] uppercase text-stone-600 font-bold mb-1">
                      Tuition
                    </div>
                    <div className="font-serif text-2xl text-[#3C2A21]">
                      {formatINR(c.price)}
                    </div>
                  </div>
                  <button
                    data-testid={`add-to-cart-${c.id}`}
                    onClick={() => handleAdd(c)}
                    className={`inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase px-6 py-3.5 rounded-full transition-all duration-300 font-bold ${
                      added[c.id]
                        ? "bg-[#B38B36] text-white"
                        : "bg-[#3C2A21] text-white hover:bg-[#B38B36]"
                    }`}
                  >
                    {added[c.id] ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Added
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" /> Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 flex items-center justify-center">
          <button
            data-testid="view-cart-bottom"
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center gap-3 border border-[#3C2A21]/20 hover:border-[#B38B36] hover:text-[#B38B36] text-[#3C2A21] text-[10px] tracking-[0.25em] uppercase px-10 py-5 rounded-full transition-all duration-300 font-bold"
          >
            <ShoppingBag className="w-4 h-4" />
            View your cart
          </button>
        </div>
      </div>
    </section>
  );
};

export default Courses;
