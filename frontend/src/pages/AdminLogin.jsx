import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Lock, User, Eye, EyeOff, Sparkles } from "lucide-react";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please enter both username and password.");
      return;
    }

    setLoading(true);
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8005";

    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUser", data.username);
        toast.success("Welcome back, Divine Oracle!");
        navigate("/admin");
      } else {
        toast.error(data.detail || "Invalid divine coordinates (credentials).");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to connect to the cosmic registry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0905] relative overflow-hidden pt-12 pb-12 px-6">
      {/* Background Cosmic Accents */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#B38B36]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#634a17]/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Glowing Star particles */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0d0905] to-[#050302] opacity-80 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-[#B38B36]/40 p-8 rounded-2xl shadow-[0_0_50px_-12px_rgba(179,139,54,0.3)] relative z-10"
      >
        {/* Header/Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#B38B36]/15 border border-[#B38B36]/30 mb-4 text-[#B38B36] animate-pulse">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-white tracking-wide">
            Divine Portal
          </h2>
          <p className="text-xs tracking-widest uppercase text-[#B38B36] mt-2 font-medium">
            Admin Authentication
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-[#A89E8D] block font-medium">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#B38B36]/70">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin name"
                className="w-full pl-10 pr-4 py-3 bg-[#17120a]/60 border border-[#B38B36]/20 rounded-xl text-white placeholder-[#786c5f] focus:outline-none focus:border-[#B38B36] transition-all text-sm"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-[#A89E8D] block font-medium">
              Secret Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#B38B36]/70">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-3 bg-[#17120a]/60 border border-[#B38B36]/20 rounded-xl text-white placeholder-[#786c5f] focus:outline-none focus:border-[#B38B36] transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#B38B36]/70 hover:text-[#B38B36] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-[#8e6b23] to-[#B38B36] hover:from-[#B38B36] hover:to-[#d0a74b] text-[#1c1206] font-bold tracking-wider uppercase rounded-xl transition-all shadow-[0_4px_20px_rgba(179,139,54,0.25)] flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
          >
            {loading ? (
              <span className="border-2 border-[#1c1206] border-t-transparent w-5 h-5 rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Enter Admin Panel</span>
                <Sparkles className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
