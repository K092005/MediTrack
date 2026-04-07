import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Stethoscope } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [errors,       setErrors]       = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: { email?: string; password?: string } = {};
    if (!email.trim())                       e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))   e.email    = "Invalid email address";
    if (!password)                           e.password = "Password is required";
    else if (password.length < 6)           e.password = "Password must be at least 6 characters";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      await login(email, password);
      // login() stores the user; read role from localStorage to redirect
      const stored = localStorage.getItem("meditrack_user");
      if (stored) {
        const user = JSON.parse(stored);
        toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
        navigate(`/${user.role}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Left panel */}
      <div
        className="hidden lg:flex w-1/2 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #2F5DFF 0%, #1E40AF 50%, #0F2D6B 100%)" }}
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1767449441925-737379bc2c4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
            alt="Medical technology"
            className="w-full h-full object-cover opacity-20"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, rgba(47,93,255,0.92) 0%, rgba(30,64,175,0.88) 50%, rgba(15,45,107,0.95) 100%)" }}
          />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Stethoscope className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: "22px", fontWeight: 700 }}>MediTrack</span>
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-white mb-4" style={{ fontSize: "40px", fontWeight: 700, lineHeight: 1.2 }}>
                Modern Healthcare<br />Management Platform
              </h1>
              <p className="text-white/70" style={{ fontSize: "16px", lineHeight: 1.7 }}>
                Streamline your clinic operations with our comprehensive, role-based management system. Built for healthcare professionals.
              </p>
            </div>

            <div className="grid gap-4">
              {[
                { label: "Role-Based Access Control",  desc: "Admin, Doctor & Patient portals" },
                { label: "Smart Appointment System",   desc: "No double-booking, real-time slots" },
                { label: "Digital Prescriptions",      desc: "Upload, manage & share instantly" },
              ].map((feat) => (
                <div key={feat.label} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-[#2EC4B6]" />
                  </div>
                  <div>
                    <p className="text-white" style={{ fontSize: "14px", fontWeight: 600 }}>{feat.label}</p>
                    <p className="text-white/60" style={{ fontSize: "13px" }}>{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-white/20">
              {[{ num: "2,400+", label: "Patients" }, { num: "120+", label: "Doctors" }, { num: "98%", label: "Satisfaction" }].map(stat => (
                <div key={stat.label}>
                  <p className="text-white" style={{ fontSize: "22px", fontWeight: 700 }}>{stat.num}</p>
                  <p className="text-white/60" style={{ fontSize: "13px" }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/40" style={{ fontSize: "12px" }}>© 2026 MediTrack. All rights reserved.</p>
        </div>
      </div>

      {/* Right panel — Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Logo for mobile */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-[#2F5DFF] rounded-xl flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: "20px", fontWeight: 700, color: "#0F172A" }}>MediTrack</span>
          </div>

          <div className="mb-8">
            <h2 className="text-[#0F172A]" style={{ fontSize: "28px", fontWeight: 700 }}>Welcome back</h2>
            <p className="text-[#64748B] mt-1" style={{ fontSize: "15px" }}>Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[#334155] mb-1.5" style={{ fontSize: "14px", fontWeight: 500 }}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
                  className={`w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border rounded-xl text-[#0F172A] placeholder-[#CBD5E1] outline-none transition-all ${
                    errors.email
                      ? "border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20"
                      : "border-[#E2E8F0] focus:border-[#2F5DFF] focus:ring-2 focus:ring-[#2F5DFF]/10"
                  }`}
                  style={{ fontSize: "14px" }}
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p 
                    id="email-error"
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-[#EF4444] mt-1" style={{ fontSize: "12px" }}
                    role="alert"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-[#334155]" style={{ fontSize: "14px", fontWeight: 500 }}>Password</label>
                <Link to="/forgot-password" title="Recover your password" className="text-[#2F5DFF] hover:text-[#1E40AF] transition-colors" style={{ fontSize: "13px" }}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                  className={`w-full pl-11 pr-12 py-3 bg-[#F8FAFC] border rounded-xl text-[#0F172A] placeholder-[#CBD5E1] outline-none transition-all ${
                    errors.password
                      ? "border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20"
                      : "border-[#E2E8F0] focus:border-[#2F5DFF] focus:ring-2 focus:ring-[#2F5DFF]/10"
                  }`}
                  style={{ fontSize: "14px" }}
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p 
                    id="password-error"
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-[#EF4444] mt-1" style={{ fontSize: "12px" }}
                    role="alert"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ y: -1, boxShadow: "0 8px 24px rgba(47,93,255,0.35)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-xl text-white transition-all duration-200 flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
              style={{ background: "linear-gradient(135deg, #2F5DFF, #2F5DFFCC)", fontSize: "15px", fontWeight: 600 }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-[#64748B]" style={{ fontSize: "14px" }}>
            Don't have an account?{" "}
            <Link to="/register" className="text-[#2F5DFF] hover:text-[#1E40AF] transition-colors" style={{ fontWeight: 600 }}>
              Create account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
