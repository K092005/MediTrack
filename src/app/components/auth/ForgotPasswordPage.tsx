import React, { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Mail, ArrowLeft, CheckCircle, Stethoscope, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setSent(true);
    toast.success("Reset link sent to your email");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#2F5DFF] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[#64748B]" style={{ fontSize: "15px" }}>MediTrack</span>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[#F1F5F9] p-8">
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mb-6">
                  <h2 className="text-[#0F172A]" style={{ fontSize: "22px", fontWeight: 700 }}>Reset your password</h2>
                  <p className="text-[#64748B] mt-1" style={{ fontSize: "14px" }}>
                    Enter your email and we'll send you a reset link
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[#334155] mb-1.5" style={{ fontSize: "14px", fontWeight: 500 }}>Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setError(""); }}
                        placeholder="you@example.com"
                        className={`w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border rounded-xl text-[#0F172A] placeholder-[#CBD5E1] outline-none transition-all ${error ? "border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20" : "border-[#E2E8F0] focus:border-[#2F5DFF] focus:ring-2 focus:ring-[#2F5DFF]/10"}`}
                        style={{ fontSize: "14px" }}
                      />
                    </div>
                    <AnimatePresence>
                      {error && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[#EF4444] mt-1" style={{ fontSize: "12px" }}>
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 bg-[#2F5DFF] text-white rounded-xl hover:bg-[#1E40AF] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    style={{ fontSize: "15px", fontWeight: 600 }}
                  >
                    {loading ? (
                      <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                    ) : (
                      <>Send Reset Link <ArrowRight className="w-4 h-4" /></>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-16 h-16 bg-[#F0FFF4] rounded-2xl flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="w-8 h-8 text-[#10B981]" />
                </motion.div>
                <h3 className="text-[#0F172A] mb-2" style={{ fontSize: "20px", fontWeight: 700 }}>Check your inbox</h3>
                <p className="text-[#64748B] mb-6" style={{ fontSize: "14px" }}>
                  We've sent a password reset link to<br />
                  <strong className="text-[#334155]">{email}</strong>
                </p>
                <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] mb-6 text-left">
                  <p className="text-[#64748B]" style={{ fontSize: "13px" }}>
                    Didn't receive the email? Check your spam folder or{" "}
                    <button onClick={() => setSent(false)} className="text-[#2F5DFF] hover:text-[#1E40AF]" style={{ fontWeight: 500 }}>
                      try again
                    </button>
                    .
                  </p>
                </div>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-[#64748B] hover:text-[#334155] transition-colors"
                  style={{ fontSize: "14px" }}
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Sign In
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!sent && (
          <p className="mt-4 text-center">
            <Link to="/" className="inline-flex items-center gap-1.5 text-[#64748B] hover:text-[#334155] transition-colors" style={{ fontSize: "14px" }}>
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
}
