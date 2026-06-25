import "@/App.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Header";
import CelestialOracleHero from "@/components/CelestialOracleHero";
import NebulaBackground from "@/components/NebulaBackground";
import Panchang from "@/components/Panchang";
import StatsBar from "@/components/StatsBar";
import ZodiacSigns from "@/components/ZodiacSigns";
import Calculators from "@/components/Calculators";
import About from "@/components/About";
import Services from "@/components/Services";
import Courses from "@/components/Courses";
import Testimonials from "@/components/Testimonials";
import Journal from "@/components/Journal";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import MobileBottomNav from "@/components/MobileBottomNav";
import AboutUs from "@/pages/AboutUs";
import { DesignProvider } from "@/context/DesignContext";
import AstroSolutionPage from "@/pages/AstroSolutionPage";
import ServicePage from "@/pages/ServicePage";
import CoursePage from "@/pages/CoursePage";
import BlogPage from "@/pages/BlogPage";
import ContactPage from "@/pages/ContactPage";
import CalculatorPage from "@/pages/CalculatorPage";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import PaymentPage from "@/pages/PaymentPage";

const Layout = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const removeBadge = () => {
      document.querySelectorAll("#emergent-badge").forEach((el) => el.remove());
    };
    removeBadge();
    const interval = setInterval(removeBadge, 500);
    const observer = new MutationObserver(removeBadge);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <div className="bg-[#0d0905] min-h-screen font-[Outfit,sans-serif] antialiased">
        {children}
      </div>
    );
  }

  return (
    <div className="bg-[#FDFBF7] text-[#3C2A21] min-h-screen font-[Outfit,sans-serif] antialiased pb-24 lg:pb-0">
      <Header />
      <main>
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <MobileBottomNav />
    </div>
  );
};

const Home = () => {
  return (
    <>
      <NebulaBackground />
      <CelestialOracleHero />
      <Calculators />
      <About />
      <Panchang />
      <StatsBar />
      <ZodiacSigns />
      <Services />
      <Courses />
      <Testimonials />
      <Journal />
    </>
  );
};

function App() {
  return (
    <DesignProvider>
      <CartProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/astro-solutions/:slug" element={<AstroSolutionPage />} />
              <Route path="/services/:slug" element={<ServicePage />} />
              <Route path="/courses/:slug" element={<CoursePage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/calculator/:id" element={<CalculatorPage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/payment" element={<PaymentPage />} />
            </Routes>
          </Layout>
        </BrowserRouter>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#FDFBF7",
              color: "#3C2A21",
              border: "1px solid #B38B36",
              fontFamily: "Outfit, sans-serif",
            },
          }}
        />
      </CartProvider>
    </DesignProvider>
  );
}

export default App;
