
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Car, Lock, Mail, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const { signIn }     = useAuth();
  const navigate       = useNavigate();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Soft background accents — flat low-opacity circles, no blur per design system */}
      <div className="absolute top-[-120px] right-[-100px] w-[360px] h-[360px] rounded-full
                      bg-[#EAF4FD] opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-140px] left-[-120px] w-[420px] h-[420px] rounded-full
                      bg-[#E5F7FA] opacity-50 pointer-events-none" />

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl
                          bg-[#1D63A0] shadow-sm mb-4">
            <Car className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1A2433]">PuneDriver Admin</h1>
          <p className="text-[#5A6B7D] text-sm mt-1">Sign in to access the admin panel</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E4EBF1] rounded-3xl p-8
                        shadow-[0_1px_2px_rgba(16,42,67,0.04),0_4px_20px_rgba(16,42,67,0.06)]">

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="text-[#5A6B7D] text-xs font-semibold uppercase tracking-widest block mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B3]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@punedriver.com"
                  required
                  className="w-full h-12 pl-10 pr-4 rounded-xl bg-[#F7FAFC] border border-[#D3DEE8]
                             text-[#1A2433] placeholder:text-[#94A3B3] text-sm
                             focus:outline-none focus:ring-1 focus:ring-[#4A9DE0]
                             focus:border-[#4A9DE0] focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[#5A6B7D] text-xs font-semibold uppercase tracking-widest block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B3]" />
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-12 pl-10 pr-10 rounded-xl bg-[#F7FAFC] border border-[#D3DEE8]
                             text-[#1A2433] placeholder:text-[#94A3B3] text-sm
                             focus:outline-none focus:ring-1 focus:ring-[#4A9DE0]
                             focus:border-[#4A9DE0] focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B3] hover:text-[#5A6B7D] transition-colors"
                  tabIndex={-1}
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 text-sm text-[#B23A3A] bg-[#FCEAEA]
                              border border-[#F0C9C9] rounded-xl px-3 py-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#1D63A0] text-white font-bold text-sm
                         hover:bg-[#15517F] transition-all disabled:opacity-60
                         flex items-center justify-center gap-2 mt-2"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
                : "Sign In"
              }
            </button>
          </form>

          <p className="text-center text-[#94A3B3] text-xs mt-6">
            Default: admin@punedriver.com / Admin@123
          </p>
        </div>

        {/* Back to website */}
        <p className="text-center mt-6">
          <a href="/" className="text-[#94A3B3] hover:text-[#1A2433] text-sm transition-colors">
            ← Back to website
          </a>
        </p>
      </div>
    </div>
  );
}