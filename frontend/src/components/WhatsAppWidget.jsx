import { useState } from "react";

const WhatsAppWidget = () => {
  const whatsappNumber = "918005552787";
  const preFilledMessage = encodeURIComponent(
    "Hello,\nI would like to know more about your astrology services."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${preFilledMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] rounded-full text-white shadow-[0_4px_16px_rgba(37,211,102,0.3)] hover:shadow-[0_8px_24px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-110 cursor-pointer whatsapp-pulse bottom-[92px] right-4 lg:bottom-6 lg:right-6 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-[#FAF9F6]"
    >
      {/* Official WhatsApp SVG Icon */}
      <svg
        viewBox="0 0 24 24"
        className="w-7 h-7 fill-white transform group-hover:rotate-12 transition-transform duration-300"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.392 9.806-9.799.002-2.618-1.015-5.08-2.868-6.936C16.36 2.014 13.9 1 11.99 1c-5.41 0-9.813 4.398-9.816 9.806-.002 1.802.488 3.56 1.419 5.093l-.97 3.543 3.634-.948zm12.308-3.093c-.234-.117-1.383-.682-1.597-.76-.214-.078-.37-.117-.526.117-.156.233-.604.76-.74.915-.137.156-.273.175-.508.059-.234-.118-.99-.365-1.885-1.161-.696-.621-1.167-1.388-1.303-1.622-.137-.234-.015-.361.103-.478.106-.105.234-.273.35-.41.117-.137.156-.234.234-.39.078-.156.039-.293-.02-.41-.058-.117-.526-1.267-.72-1.731-.188-.454-.379-.393-.526-.4h-.45c-.156 0-.41.059-.624.293-.214.234-.819.8-.819 1.954 0 1.153.839 2.268.956 2.423.117.156 1.65 2.52 3.998 3.53.559.24 1.002.39 1.343.498.563.179 1.077.154 1.484.093.453-.068 1.383-.566 1.578-1.113.195-.547.195-1.016.137-1.113-.058-.097-.214-.156-.448-.273z" />
      </svg>

      {/* Elegant Tooltip */}
      <span className="hidden lg:block absolute right-18 top-1/2 -translate-y-1/2 bg-[#3C2A21] text-[#E5C06A] text-[11px] tracking-wider uppercase font-bold py-2.5 px-4 rounded-xl shadow-2xl border border-[#D4AF37]/30 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-2 group-hover:translate-x-0">
        Chat with us on WhatsApp
      </span>
    </a>
  );
};

export default WhatsAppWidget;
