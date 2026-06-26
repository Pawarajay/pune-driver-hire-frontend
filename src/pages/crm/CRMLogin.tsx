// // src/pages/crm/CRMLogin.tsx
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import { Car, Lock, Mail, Loader2, Eye, EyeOff } from "lucide-react";

// export default function CRMLogin() {
//   const { signIn }     = useAuth();
//   const navigate       = useNavigate();
//   const [email,    setEmail]    = useState("");
//   const [password, setPassword] = useState("");
//   const [showPwd,  setShowPwd]  = useState(false);
//   const [loading,  setLoading]  = useState(false);
//   const [error,    setError]    = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       await signIn(email, password);
//       navigate("/crm/dashboard");
//     } catch (err: any) {
//       setError(err.message || "Login failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#050d1a] flex items-center justify-center px-4">
//       {/* Background glow */}
//       <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px]
//                       bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

//       <div className="relative w-full max-w-md">
//         {/* Logo */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl
//                           bg-accent shadow-lg mb-4">
//             <Car className="w-7 h-7 text-white" />
//           </div>
//           <h1 className="text-2xl font-bold text-white">PuneDriver CRM</h1>
//           <p className="text-white/40 text-sm mt-1">Admin Dashboard</p>
//         </div>

//         {/* Card */}
//         <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10
//                         rounded-3xl p-8 shadow-2xl">
//           <h2 className="text-white font-semibold text-lg mb-6">Sign In</h2>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Email */}
//             <div className="relative">
//               <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Email address"
//                 required
//                 className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/10 border border-white/10
//                            text-white placeholder:text-white/30 text-sm
//                            focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent/60"
//               />
//             </div>

//             {/* Password */}
//             <div className="relative">
//               <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
//               <input
//                 type={showPwd ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Password"
//                 required
//                 className="w-full h-12 pl-10 pr-10 rounded-xl bg-white/10 border border-white/10
//                            text-white placeholder:text-white/30 text-sm
//                            focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent/60"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPwd(!showPwd)}
//                 className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
//               >
//                 {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//               </button>
//             </div>

//             {error && (
//               <p className="text-sm text-red-400 bg-red-500/10 border border-red-400/20
//                             rounded-xl px-3 py-2">
//                 ⚠️ {error}
//               </p>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full h-12 rounded-xl bg-accent text-white font-bold text-sm
//                          hover:bg-accent/90 transition-all disabled:opacity-60
//                          flex items-center justify-center gap-2 shadow-lg"
//             >
//               {loading
//                 ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
//                 : "Sign In"
//               }
//             </button>
//           </form>

//           <p className="text-center text-white/25 text-xs mt-6">
//             Default: admin@punedriver.com / Admin@123
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


//testing

// src/pages/crm/CRMLogin.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Car, Lock, Mail, Loader2, Eye, EyeOff } from "lucide-react";

export default function CRMLogin() {
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
      navigate("/crm/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050d1a] flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px]
                      bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl
                          bg-accent shadow-lg mb-4">
            <Car className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">PuneDriver CRM</h1>
          <p className="text-white/40 text-sm mt-1">Admin Dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10
                        rounded-3xl p-8 shadow-2xl">
          <h2 className="text-white font-semibold text-lg mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/10 border border-white/10
                           text-white placeholder:text-white/30 text-sm
                           focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent/60"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full h-12 pl-10 pr-10 rounded-xl bg-white/10 border border-white/10
                           text-white placeholder:text-white/30 text-sm
                           focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent/60"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-400/20
                            rounded-xl px-3 py-2">
                ⚠️ {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-accent text-white font-bold text-sm
                         hover:bg-accent/90 transition-all disabled:opacity-60
                         flex items-center justify-center gap-2 shadow-lg"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
                : "Sign In"
              }
            </button>
          </form>

          <p className="text-center text-white/25 text-xs mt-6">
            Default: admin@punedriver.com / Admin@123
          </p>
        </div>
      </div>
    </div>
  );
}
