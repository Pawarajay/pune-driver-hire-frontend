// // src/pages/admin/AdminDashboard.tsx
// import { useEffect, useState } from "react";
// import { getDashboard } from "@/services/adminService";
// import { Link } from "react-router-dom";
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell, Legend,
// } from "recharts";
// import {
//   BookOpen, Users, CheckCircle2, Clock, XCircle,
//   TrendingUp, IndianRupee, Car, Loader2, AlertCircle,
//   Navigation, Flag, Star,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { format } from "date-fns";

// const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

// function StatCard({ icon: Icon, label, value, sub, color = "blue" }: any) {
//   const colorMap: Record<string, string> = {
//     blue:   "bg-blue-500/15 text-blue-400",
//     green:  "bg-green-500/15 text-green-400",
//     yellow: "bg-yellow-500/15 text-yellow-400",
//     red:    "bg-red-500/15 text-red-400",
//     purple: "bg-purple-500/15 text-purple-400",
//     orange: "bg-orange-500/15 text-orange-400",
//     cyan:   "bg-cyan-500/15 text-cyan-400",
//   };
//   return (
//     <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 flex items-start gap-4">
//       <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
//         colorMap[color] || colorMap.blue)}>
//         <Icon className="w-5 h-5" />
//       </div>
//       <div>
//         <p className="text-white/40 text-xs font-medium mb-0.5">{label}</p>
//         <p className="text-white text-2xl font-bold leading-none">{value ?? "—"}</p>
//         {sub && <p className="text-white/30 text-xs mt-1">{sub}</p>}
//       </div>
//     </div>
//   );
// }

// function StatusBadge({ status }: { status: string }) {
//   const colors: Record<string, string> = {
//     pending:      "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
//     confirmed:    "bg-blue-500/15 text-blue-400 border-blue-500/20",
//     assigned:     "bg-purple-500/15 text-purple-400 border-purple-500/20",
//     trip_started: "bg-orange-500/15 text-orange-400 border-orange-500/20",
//     trip_ongoing: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
//     completed:    "bg-green-500/15 text-green-400 border-green-500/20",
//     cancelled:    "bg-red-500/15 text-red-400 border-red-500/20",
//   };
//   return (
//     <span className={cn(
//       "px-2 py-0.5 rounded-full text-[11px] font-semibold border capitalize whitespace-nowrap",
//       colors[status] || "bg-white/10 text-white/50 border-white/10"
//     )}>
//       {status.replace(/_/g, " ")}
//     </span>
//   );
// }

// export default function AdminDashboard() {
//   const [data,    setData]    = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error,   setError]   = useState("");

//   useEffect(() => {
//     getDashboard()
//       .then((d) => setData(d.data))
//       .catch((e) => setError(e.message))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return (
//     <div className="flex items-center justify-center h-64">
//       <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
//     </div>
//   );

//   if (error) return (
//     <div className="flex items-center gap-3 text-red-400 bg-red-500/10
//                     border border-red-400/20 rounded-2xl p-4">
//       <AlertCircle className="w-5 h-5" /> {error}
//     </div>
//   );

//   const s = data.stats;

//   // Fill missing dates for weekly chart
//   const weeklyMap: Record<string, any> = {};
//   (data.weekly || []).forEach((d: any) => { weeklyMap[d.date] = d; });
//   const weeklyFilled = Array.from({ length: 7 }, (_, i) => {
//     const d = new Date();
//     d.setDate(d.getDate() - (6 - i));
//     const key = d.toISOString().split("T")[0];
//     return {
//       date:     format(d, "MMM d"),
//       bookings: weeklyMap[key]?.bookings || 0,
//       paid:     weeklyMap[key]?.paid     || 0,
//     };
//   });

//   const pieData = (data.byService || []).map((s: any) => ({
//     name: s.service_type, value: Number(s.count),
//   }));

//   return (
//     <div className="space-y-6">

//       <div>
//         <h1 className="text-white text-xl font-bold">Dashboard</h1>
//         <p className="text-white/40 text-sm">Welcome back — here's your live overview</p>
//       </div>

//       {/* ── Primary stat cards ─────────────────────────────────────────────── */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard icon={BookOpen}     label="Total Bookings"
//           value={s.total_bookings}    sub={`${s.today_bookings ?? 0} today`} />
//         <StatCard icon={Clock}        label="Pending"
//           value={s.pending}           sub={`${s.today_pending ?? 0} new today`}  color="yellow" />
//         <StatCard icon={CheckCircle2} label="Completed"
//           value={s.completed}                                                     color="green" />
//         <StatCard icon={IndianRupee}  label="Revenue"
//           value={`₹${Number(s.total_revenue || 0).toLocaleString("en-IN")}`}     color="green" />
//         <StatCard icon={Car}          label="Active Drivers"
//           value={`${s.active_drivers ?? 0}/${s.total_drivers ?? 0}`}             color="purple" />
//         <StatCard icon={Navigation}   label="Active Trips"
//           value={s.active_trips ?? 0} sub="trip_started + trip_ongoing"          color="cyan" />
//         <StatCard icon={XCircle}      label="Cancelled"
//           value={s.cancelled}                                                     color="red" />
//         <StatCard icon={Users}        label="Pending Applications"
//           value={s.pending_applications ?? 0}
//           sub={`${s.total_applications ?? 0} total`}                             color="orange" />
//       </div>

//       {/* ── Active trips live table ─────────────────────────────────────────── */}
//       {(data.activeTrips || []).length > 0 && (
//         <div className="bg-cyan-500/5 border border-cyan-400/20 rounded-2xl overflow-hidden">
//           <div className="flex items-center justify-between px-5 py-4 border-b border-cyan-400/10">
//             <div className="flex items-center gap-2">
//               <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
//               <p className="text-cyan-400 font-semibold text-sm">
//                 Live Trips ({data.activeTrips.length})
//               </p>
//             </div>
//             <Link to="/admin/bookings?status=trip_started"
//               className="text-cyan-400 text-xs font-medium hover:underline">
//               View all →
//             </Link>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-white/[0.05]">
//                   {["ID", "Customer", "Pickup → Drop", "Vehicle", "Driver", "Status"].map((h) => (
//                     <th key={h}
//                       className="text-left px-4 py-3 text-white/30 text-xs
//                                  font-semibold uppercase tracking-wide whitespace-nowrap">
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.activeTrips.map((t: any) => (
//                   <tr key={t.booking_id}
//                     className="border-b border-white/[0.04] hover:bg-white/[0.03]">
//                     <td className="px-4 py-3 text-white/50 text-xs font-mono">
//                       {t.booking_id.slice(0, 8).toUpperCase()}
//                     </td>
//                     <td className="px-4 py-3">
//                       <p className="text-white text-xs font-medium">{t.full_name}</p>
//                       <p className="text-white/40 text-[11px]">{t.phone}</p>
//                     </td>
//                     <td className="px-4 py-3 max-w-[180px]">
//                       <p className="text-white/70 text-xs truncate">{t.pickup_city}</p>
//                       {t.drop_location && (
//                         <p className="text-white/30 text-[11px] truncate">→ {t.drop_location}</p>
//                       )}
//                     </td>
//                     <td className="px-4 py-3">
//                       <p className="text-white/70 text-xs uppercase font-semibold">{t.vehicle_type}</p>
//                       {t.vehicle_number && (
//                         <p className="text-white/40 text-[11px] font-mono">{t.vehicle_number}</p>
//                       )}
//                     </td>
//                     <td className="px-4 py-3 text-xs text-purple-400">
//                       {t.driver_name || <span className="text-white/20">—</span>}
//                     </td>
//                     <td className="px-4 py-3">
//                       <StatusBadge status={t.trip_status || t.status} />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* ── Charts row ──────────────────────────────────────────────────────── */}
//       <div className="grid lg:grid-cols-3 gap-4">

//         {/* Weekly bookings bar chart */}
//         <div className="lg:col-span-2 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
//           <p className="text-white font-semibold mb-4 text-sm">Bookings — Last 7 Days</p>
//           <ResponsiveContainer width="100%" height={200}>
//             <BarChart data={weeklyFilled} barGap={4}>
//               <XAxis dataKey="date"
//                 tick={{ fill: "#ffffff50", fontSize: 11 }} axisLine={false} tickLine={false} />
//               <YAxis
//                 tick={{ fill: "#ffffff50", fontSize: 11 }} axisLine={false} tickLine={false}
//                 allowDecimals={false} />
//               <Tooltip
//                 contentStyle={{ background: "#0d1b2e", border: "1px solid #ffffff15", borderRadius: 12 }}
//                 labelStyle={{ color: "#fff" }}
//                 itemStyle={{ color: "#ffffff80" }}
//               />
//               <Bar dataKey="bookings" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Bookings" />
//               <Bar dataKey="paid"     fill="#10b981" radius={[6, 6, 0, 0]} name="Paid" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Service type pie chart */}
//         <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
//           <p className="text-white font-semibold mb-4 text-sm">By Service Type</p>
//           {pieData.length > 0 ? (
//             <ResponsiveContainer width="100%" height={200}>
//               <PieChart>
//                 <Pie data={pieData} cx="50%" cy="45%" outerRadius={70}
//                   dataKey="value" nameKey="name" label={false}>
//                   {pieData.map((_: any, i: number) => (
//                     <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Legend iconType="circle" iconSize={8}
//                   formatter={(v) => (
//                     <span style={{ color: "#ffffff80", fontSize: 11 }}>{v}</span>
//                   )} />
//                 <Tooltip
//                   contentStyle={{ background: "#0d1b2e", border: "1px solid #ffffff15", borderRadius: 12 }}
//                   itemStyle={{ color: "#ffffff80" }}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="h-[200px] flex items-center justify-center text-white/30 text-sm">
//               No data yet
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── Bottom row: Top Drivers + Recent Bookings ────────────────────────── */}
//       <div className="grid lg:grid-cols-3 gap-4">

//         {/* Top 5 drivers */}
//         <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden">
//           <div className="px-5 py-4 border-b border-white/[0.07] flex items-center justify-between">
//             <p className="text-white font-semibold text-sm">Top Drivers</p>
//             <Link to="/admin/drivers"
//               className="text-blue-400 text-xs font-medium hover:underline">
//               View all →
//             </Link>
//           </div>
//           <div className="p-4 space-y-3">
//             {(data.topDrivers || []).length === 0 && (
//               <p className="text-white/30 text-sm text-center py-4">No drivers yet</p>
//             )}
//             {(data.topDrivers || []).map((d: any, i: number) => (
//               <div key={d.driver_id}
//                 className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03]
//                            hover:bg-white/[0.06] transition-colors">
//                 <span className="text-white/20 text-xs font-bold w-4 text-center">
//                   {i + 1}
//                 </span>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-white text-xs font-semibold truncate">{d.name}</p>
//                   <p className="text-white/40 text-[11px]">{d.area}</p>
//                 </div>
//                 <div className="text-right flex-shrink-0">
//                   <p className="text-white/70 text-xs font-bold">{d.total_trips} trips</p>
//                   <p className="text-yellow-400 text-[11px]">⭐ {d.rating}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Recent bookings */}
//         <div className="lg:col-span-2 bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden">
//           <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
//             <p className="text-white font-semibold text-sm">Recent Bookings</p>
//             <Link to="/admin/bookings"
//               className="text-blue-400 text-xs font-medium hover:underline">
//               View all →
//             </Link>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-white/[0.05]">
//                   {["ID", "Customer", "Pickup", "Vehicle", "Driver", "Status"].map((h) => (
//                     <th key={h}
//                       className="text-left px-4 py-3 text-white/30 text-xs
//                                  font-semibold uppercase tracking-wide whitespace-nowrap">
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {(data.recentBookings || []).map((b: any) => (
//                   <tr key={b.booking_id}
//                     className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors">
//                     <td className="px-4 py-3 text-white/50 text-xs font-mono">
//                       {b.booking_id.slice(0, 8).toUpperCase()}
//                     </td>
//                     <td className="px-4 py-3">
//                       <p className="text-white font-medium text-xs">{b.full_name}</p>
//                       <p className="text-white/40 text-[11px]">{b.phone}</p>
//                     </td>
//                     <td className="px-4 py-3 text-white/60 text-xs max-w-[130px] truncate">
//                       {b.pickup_city}
//                     </td>
//                     <td className="px-4 py-3">
//                       <p className="text-white/70 text-xs uppercase font-semibold">
//                         {b.vehicle_type}
//                       </p>
//                       {b.vehicle_number && (
//                         <p className="text-white/40 text-[11px] font-mono">{b.vehicle_number}</p>
//                       )}
//                     </td>
//                     <td className="px-4 py-3 text-white/60 text-xs">
//                       {b.driver_name || <span className="text-white/20">Unassigned</span>}
//                     </td>
//                     <td className="px-4 py-3">
//                       <StatusBadge status={b.trip_status || b.status} />
//                     </td>
//                   </tr>
//                 ))}
//                 {!data.recentBookings?.length && (
//                   <tr>
//                     <td colSpan={6} className="text-center py-8 text-white/30 text-sm">
//                       No bookings yet
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



//testing



// // src/pages/admin/AdminDashboard.tsx
// // Sky blue + white theme
// import { useEffect, useState } from "react";
// import { getDashboard } from "@/services/adminService";
// import { Link } from "react-router-dom";
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell, Legend,
// } from "recharts";
// import {
//   BookOpen, Users, CheckCircle2, Clock, XCircle,
//   Navigation, IndianRupee, Car, Loader2, AlertCircle,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { format } from "date-fns";

// const PIE_COLORS = ["#4A9DE0", "#4CAF7D", "#E8A23B", "#8B6FE0", "#D9534F"];

// function StatCard({ icon: Icon, label, value, sub, accent = "border-t-[#4A9DE0]", iconBg = "bg-[#EAF4FD]", iconColor = "text-[#1D63A0]" }: any) {
//   return (
//     <div className={cn("bg-white border border-[#E4EBF1] rounded-xl p-[18px] shadow-[0_1px_2px_rgba(16,42,67,0.04),0_1px_8px_rgba(16,42,67,0.04)] border-t-[3px]", accent)}>
//       <div className="flex items-center gap-2 mb-2">
//         <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0", iconBg, iconColor)}>
//           <Icon className="w-3.5 h-3.5" />
//         </div>
//         <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#94A3B3]">{label}</p>
//       </div>
//       <p className="text-[26px] font-extrabold text-[#1A2433] leading-none tracking-tight">{value ?? "—"}</p>
//       {sub && <p className="text-xs text-[#5A6B7D] mt-1.5">{sub}</p>}
//     </div>
//   );
// }

// function StatusBadge({ status }: { status: string }) {
//   const m: Record<string, { bg: string; text: string; dot: string }> = {
//     pending:      { bg: "bg-[#FDF3E2]", text: "text-[#92650F]", dot: "bg-[#E8A23B]" },
//     confirmed:    { bg: "bg-[#EAF4FD]", text: "text-[#1D63A0]", dot: "bg-[#4A9DE0]" },
//     assigned:     { bg: "bg-[#F1EDFB]", text: "text-[#6B4FBF]", dot: "bg-[#8B6FE0]" },
//     trip_started: { bg: "bg-[#E5F7FA]", text: "text-[#1A7E91]", dot: "bg-[#2BB7C9]" },
//     trip_ongoing: { bg: "bg-[#E5F7FA]", text: "text-[#1A7E91]", dot: "bg-[#2BB7C9]" },
//     completed:    { bg: "bg-[#E8F5EE]", text: "text-[#1E7A4C]", dot: "bg-[#4CAF7D]" },
//     cancelled:    { bg: "bg-[#FCEAEA]", text: "text-[#B23A3A]", dot: "bg-[#D9534F]" },
//   };
//   const cfg = m[status] || { bg: "bg-[#F1F4F7]", text: "text-[#5A6B7D]", dot: "bg-[#94A3B3]" };
//   return (
//     <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize whitespace-nowrap", cfg.bg, cfg.text)}>
//       <span className={cn("w-[5px] h-[5px] rounded-full flex-shrink-0", cfg.dot)} />
//       {status.replace(/_/g, " ")}
//     </span>
//   );
// }

// export default function AdminDashboard() {
//   const [data,    setData]    = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error,   setError]   = useState("");

//   useEffect(() => {
//     getDashboard()
//       .then((d) => setData(d.data))
//       .catch((e) => setError(e.message))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return (
//     <div className="flex items-center justify-center h-64">
//       <Loader2 className="w-8 h-8 text-[#1D63A0] animate-spin" />
//     </div>
//   );

//   if (error) return (
//     <div className="flex items-center gap-3 text-[#B23A3A] bg-[#FCEAEA] border border-[#F0C9C9] rounded-xl p-4">
//       <AlertCircle className="w-5 h-5" /> {error}
//     </div>
//   );

//   const s = data.stats;

//   const weeklyMap: Record<string, any> = {};
//   (data.weekly || []).forEach((d: any) => { weeklyMap[d.date] = d; });
//   const weeklyFilled = Array.from({ length: 7 }, (_, i) => {
//     const d = new Date();
//     d.setDate(d.getDate() - (6 - i));
//     const key = d.toISOString().split("T")[0];
//     return {
//       date:     format(d, "MMM d"),
//       bookings: weeklyMap[key]?.bookings || 0,
//       paid:     weeklyMap[key]?.paid     || 0,
//     };
//   });

//   const pieData = (data.byService || []).map((s: any) => ({
//     name: s.service_type, value: Number(s.count),
//   }));

//   return (
//     <div className="space-y-6">

//       <div>
//         <h1 className="text-[#1A2433] text-[22px] font-bold tracking-tight">Dashboard</h1>
//         <p className="text-[#5A6B7D] text-[13.5px] mt-0.5">Welcome back — here's your live overview</p>
//       </div>

//       {/* Stat cards */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard icon={BookOpen} label="Total bookings"
//           value={s.total_bookings} sub={`${s.today_bookings ?? 0} today`}
//           accent="border-t-[#4A9DE0]" iconBg="bg-[#EAF4FD]" iconColor="text-[#1D63A0]" />
//         <StatCard icon={Clock} label="Pending"
//           value={s.pending} sub={`${s.today_pending ?? 0} new today`}
//           accent="border-t-[#E8A23B]" iconBg="bg-[#FDF3E2]" iconColor="text-[#92650F]" />
//         <StatCard icon={CheckCircle2} label="Completed"
//           value={s.completed}
//           accent="border-t-[#4CAF7D]" iconBg="bg-[#E8F5EE]" iconColor="text-[#1E7A4C]" />
//         <StatCard icon={IndianRupee} label="Revenue"
//           value={`₹${Number(s.total_revenue || 0).toLocaleString("en-IN")}`}
//           accent="border-t-[#4CAF7D]" iconBg="bg-[#E8F5EE]" iconColor="text-[#1E7A4C]" />
//         <StatCard icon={Car} label="Active drivers"
//           value={`${s.active_drivers ?? 0}/${s.total_drivers ?? 0}`}
//           accent="border-t-[#8B6FE0]" iconBg="bg-[#F1EDFB]" iconColor="text-[#6B4FBF]" />
//         <StatCard icon={Navigation} label="Active trips"
//           value={s.active_trips ?? 0} sub="trip_started + trip_ongoing"
//           accent="border-t-[#2BB7C9]" iconBg="bg-[#E5F7FA]" iconColor="text-[#1A7E91]" />
//         <StatCard icon={XCircle} label="Cancelled"
//           value={s.cancelled}
//           accent="border-t-[#D9534F]" iconBg="bg-[#FCEAEA]" iconColor="text-[#B23A3A]" />
//         <StatCard icon={Users} label="Pending applications"
//           value={s.pending_applications ?? 0} sub={`${s.total_applications ?? 0} total`}
//           accent="border-t-[#E8A23B]" iconBg="bg-[#FDF3E2]" iconColor="text-[#92650F]" />
//       </div>

//       {/* Live trips banner */}
//       {(data.activeTrips || []).length > 0 && (
//         <div className="bg-[#E5F7FA] border border-[#BFE6EC] rounded-xl overflow-hidden">
//           <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#BFE6EC]">
//             <div className="flex items-center gap-2">
//               <span className="w-2 h-2 rounded-full bg-[#2BB7C9] animate-pulse" />
//               <p className="text-[#1A7E91] font-semibold text-[13.5px]">
//                 Live trips ({data.activeTrips.length})
//               </p>
//             </div>
//             <Link to="/admin/bookings?status=trip_started"
//               className="text-[#1D63A0] text-xs font-semibold hover:underline">
//               View all →
//             </Link>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-[#BFE6EC]/60">
//                   {["ID", "Customer", "Pickup → Drop", "Vehicle", "Driver", "Status"].map((h) => (
//                     <th key={h} className="text-left px-4 py-2.5 text-[#5A8B94] text-[10.5px] font-bold uppercase tracking-wide whitespace-nowrap">
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.activeTrips.map((t: any) => (
//                   <tr key={t.booking_id} className="border-b border-[#BFE6EC]/40 hover:bg-white/40">
//                     <td className="px-4 py-2.5 text-[#1A7E91] text-xs font-mono">
//                       {t.booking_id.slice(0, 8).toUpperCase()}
//                     </td>
//                     <td className="px-4 py-2.5">
//                       <p className="text-[#1A2433] text-xs font-semibold">{t.full_name}</p>
//                       <p className="text-[#5A6B7D] text-[11px]">{t.phone}</p>
//                     </td>
//                     <td className="px-4 py-2.5 max-w-[180px]">
//                       <p className="text-[#1A2433] text-xs truncate">{t.pickup_city}</p>
//                       {t.drop_location && <p className="text-[#5A6B7D] text-[11px] truncate">→ {t.drop_location}</p>}
//                     </td>
//                     <td className="px-4 py-2.5">
//                       <p className="text-[#1A2433] text-xs uppercase font-semibold">{t.vehicle_type}</p>
//                       {t.vehicle_number && <p className="text-[#1D63A0] text-[11px] font-mono font-semibold">{t.vehicle_number}</p>}
//                     </td>
//                     <td className="px-4 py-2.5 text-xs text-[#6B4FBF] font-semibold">
//                       {t.driver_name || <span className="text-[#94A3B3]">—</span>}
//                     </td>
//                     <td className="px-4 py-2.5"><StatusBadge status={t.trip_status || t.status} /></td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Charts */}
//       <div className="grid lg:grid-cols-3 gap-4">

//         <div className="lg:col-span-2 bg-white border border-[#E4EBF1] rounded-xl p-5 shadow-[0_1px_2px_rgba(16,42,67,0.04),0_1px_8px_rgba(16,42,67,0.04)]">
//           <p className="text-[#1A2433] font-bold mb-4 text-sm">Bookings — last 7 days</p>
//           <ResponsiveContainer width="100%" height={200}>
//             <BarChart data={weeklyFilled} barGap={4}>
//               <XAxis dataKey="date" tick={{ fill: "#94A3B3", fontSize: 11 }} axisLine={false} tickLine={false} />
//               <YAxis tick={{ fill: "#94A3B3", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
//               <Tooltip
//                 contentStyle={{ background: "#fff", border: "1px solid #E4EBF1", borderRadius: 10 }}
//                 labelStyle={{ color: "#1A2433" }}
//                 itemStyle={{ color: "#5A6B7D" }}
//               />
//               <Bar dataKey="bookings" fill="#4A9DE0" radius={[6, 6, 0, 0]} name="Bookings" />
//               <Bar dataKey="paid"     fill="#4CAF7D" radius={[6, 6, 0, 0]} name="Paid" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="bg-white border border-[#E4EBF1] rounded-xl p-5 shadow-[0_1px_2px_rgba(16,42,67,0.04),0_1px_8px_rgba(16,42,67,0.04)]">
//           <p className="text-[#1A2433] font-bold mb-4 text-sm">By service type</p>
//           {pieData.length > 0 ? (
//             <ResponsiveContainer width="100%" height={200}>
//               <PieChart>
//                 <Pie data={pieData} cx="50%" cy="45%" outerRadius={70}
//                   dataKey="value" nameKey="name" label={false}>
//                   {pieData.map((_: any, i: number) => (
//                     <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Legend iconType="circle" iconSize={8}
//                   formatter={(v) => <span style={{ color: "#5A6B7D", fontSize: 11 }}>{v}</span>} />
//                 <Tooltip
//                   contentStyle={{ background: "#fff", border: "1px solid #E4EBF1", borderRadius: 10 }}
//                   itemStyle={{ color: "#5A6B7D" }}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="h-[200px] flex items-center justify-center text-[#94A3B3] text-sm">
//               No data yet
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Top drivers + recent bookings */}
//       <div className="grid lg:grid-cols-3 gap-4">

//         <div className="bg-white border border-[#E4EBF1] rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(16,42,67,0.04),0_1px_8px_rgba(16,42,67,0.04)]">
//           <div className="px-5 py-4 border-b border-[#E4EBF1] flex items-center justify-between">
//             <p className="text-[#1A2433] font-bold text-sm">Top drivers</p>
//             <Link to="/admin/drivers" className="text-[#1D63A0] text-xs font-semibold hover:underline">
//               View all →
//             </Link>
//           </div>
//           <div className="p-2">
//             {(data.topDrivers || []).length === 0 && (
//               <p className="text-[#94A3B3] text-sm text-center py-6">No drivers yet</p>
//             )}
//             {(data.topDrivers || []).map((d: any, i: number) => (
//               <div key={d.driver_id}
//                 className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-[#EFF6FC] transition-colors">
//                 <span className="text-[#94A3B3] text-[11px] font-bold w-4 text-center">{i + 1}</span>
//                 <div className="w-8 h-8 rounded-lg bg-[#D3E9FB] text-[#1D63A0] flex items-center justify-center font-bold text-xs flex-shrink-0">
//                   {d.name?.charAt(0).toUpperCase()}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-[#1A2433] text-xs font-semibold truncate">{d.name}</p>
//                   <p className="text-[#94A3B3] text-[11px]">{d.area}</p>
//                 </div>
//                 <div className="text-right flex-shrink-0">
//                   <p className="text-[#1A2433] text-xs font-bold">{d.total_trips} trips</p>
//                   <p className="text-[#E8A23B] text-[11px] font-semibold">★ {d.rating}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="lg:col-span-2 bg-white border border-[#E4EBF1] rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(16,42,67,0.04),0_1px_8px_rgba(16,42,67,0.04)]">
//           <div className="flex items-center justify-between px-5 py-4 border-b border-[#E4EBF1]">
//             <p className="text-[#1A2433] font-bold text-sm">Recent bookings</p>
//             <Link to="/admin/bookings" className="text-[#1D63A0] text-xs font-semibold hover:underline">
//               View all →
//             </Link>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-[#E4EBF1] bg-[#F7FAFC]">
//                   {["ID", "Customer", "Pickup", "Vehicle", "Driver", "Status"].map((h) => (
//                     <th key={h} className="text-left px-4 py-2.5 text-[#94A3B3] text-[10.5px] font-bold uppercase tracking-wide whitespace-nowrap">
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {(data.recentBookings || []).map((b: any) => (
//                   <tr key={b.booking_id} className="border-b border-[#E4EBF1] hover:bg-[#EFF6FC] transition-colors">
//                     <td className="px-4 py-3 text-[#1D63A0] text-xs font-mono bg-[#EAF4FD]/40">
//                       {b.booking_id.slice(0, 8).toUpperCase()}
//                     </td>
//                     <td className="px-4 py-3">
//                       <p className="text-[#1A2433] font-semibold text-xs">{b.full_name}</p>
//                       <p className="text-[#94A3B3] text-[11px]">{b.phone}</p>
//                     </td>
//                     <td className="px-4 py-3 text-[#1A2433] text-xs max-w-[130px] truncate">{b.pickup_city}</td>
//                     <td className="px-4 py-3">
//                       <p className="text-[#1A2433] text-xs uppercase font-semibold">{b.vehicle_type}</p>
//                       {b.vehicle_number && <p className="text-[#1D63A0] text-[11px] font-mono font-semibold">{b.vehicle_number}</p>}
//                     </td>
//                     <td className="px-4 py-3 text-[#5A6B7D] text-xs">
//                       {b.driver_name || <span className="text-[#94A3B3]">Unassigned</span>}
//                     </td>
//                     <td className="px-4 py-3"><StatusBadge status={b.trip_status || b.status} /></td>
//                   </tr>
//                 ))}
//                 {!data.recentBookings?.length && (
//                   <tr>
//                     <td colSpan={6} className="text-center py-8 text-[#94A3B3] text-sm">
//                       No bookings yet
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



//testing 2 (ui improvemnet + add new points)


// src/pages/admin/AdminDashboard.tsx
// v2 — CEO-level operational dashboard. Sky blue + white theme.
import { useEffect, useState } from "react";
import { getDashboard } from "@/services/adminService";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  BookOpen, Users, CheckCircle2, Clock, XCircle,
  Navigation, IndianRupee, Car, Loader2, AlertCircle,
  TrendingUp, TrendingDown, AlertTriangle, Repeat, Timer,
  MapPinOff, UserMinus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const PIE_COLORS = ["#4A9DE0", "#4CAF7D", "#E8A23B", "#8B6FE0", "#D9534F"];

function StatCard({ icon: Icon, label, value, sub, accent = "border-t-[#4A9DE0]", iconBg = "bg-[#EAF4FD]", iconColor = "text-[#1D63A0]" }: any) {
  return (
    <div className={cn("bg-white border border-[#E4EBF1] rounded-xl p-[18px] shadow-[0_1px_2px_rgba(16,42,67,0.04),0_1px_8px_rgba(16,42,67,0.04)] border-t-[3px]", accent)}>
      <div className="flex items-center gap-2 mb-2">
        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0", iconBg, iconColor)}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#94A3B3]">{label}</p>
      </div>
      <p className="text-[26px] font-extrabold text-[#1A2433] leading-none tracking-tight">{value ?? "—"}</p>
      {sub && <p className="text-xs text-[#5A6B7D] mt-1.5">{sub}</p>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const m: Record<string, { bg: string; text: string; dot: string }> = {
    pending:      { bg: "bg-[#FDF3E2]", text: "text-[#92650F]", dot: "bg-[#E8A23B]" },
    confirmed:    { bg: "bg-[#EAF4FD]", text: "text-[#1D63A0]", dot: "bg-[#4A9DE0]" },
    assigned:     { bg: "bg-[#F1EDFB]", text: "text-[#6B4FBF]", dot: "bg-[#8B6FE0]" },
    trip_started: { bg: "bg-[#E5F7FA]", text: "text-[#1A7E91]", dot: "bg-[#2BB7C9]" },
    trip_ongoing: { bg: "bg-[#E5F7FA]", text: "text-[#1A7E91]", dot: "bg-[#2BB7C9]" },
    completed:    { bg: "bg-[#E8F5EE]", text: "text-[#1E7A4C]", dot: "bg-[#4CAF7D]" },
    cancelled:    { bg: "bg-[#FCEAEA]", text: "text-[#B23A3A]", dot: "bg-[#D9534F]" },
  };
  const cfg = m[status] || { bg: "bg-[#F1F4F7]", text: "text-[#5A6B7D]", dot: "bg-[#94A3B3]" };
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize whitespace-nowrap", cfg.bg, cfg.text)}>
      <span className={cn("w-[5px] h-[5px] rounded-full flex-shrink-0", cfg.dot)} />
      {status.replace(/_/g, " ")}
    </span>
  );
}

function FunnelStage({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[12.5px] font-medium text-[#5A6B7D]">{label}</span>
        <span className="text-[12.5px] font-bold text-[#1A2433]">{count} <span className="text-[#94A3B3] font-normal">({pct}%)</span></span>
      </div>
      <div className="h-2 rounded-full bg-[#F1F4F7] overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [data,    setData]    = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    getDashboard()
      .then((d) => setData(d.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 text-[#1D63A0] animate-spin" />
    </div>
  );

  if (error) return (
    <div className="flex items-center gap-3 text-[#B23A3A] bg-[#FCEAEA] border border-[#F0C9C9] rounded-xl p-4">
      <AlertCircle className="w-5 h-5" /> {error}
    </div>
  );

  const s        = data.stats;
  const rev      = data.revenueTrend || {};
  const retn     = data.retention || {};
  const funnel   = data.funnel || {};
  const resp     = data.driverResponse || {};
  const gaps     = data.coverageGaps || [];
  const cooling  = data.coolingDrivers || [];

  const weeklyMap: Record<string, any> = {};
  (data.weekly || []).forEach((d: any) => { weeklyMap[d.date] = d; });
  const weeklyFilled = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split("T")[0];
    return {
      date:     format(d, "MMM d"),
      bookings: weeklyMap[key]?.bookings || 0,
      revenue:  weeklyMap[key]?.revenue  || 0,
    };
  });

  const pieData = (data.byService || []).map((s: any) => ({
    name: s.service_type, value: Number(s.revenue) || Number(s.count),
  }));

  const hasAlerts = (s.active_drivers === 0) || gaps.length > 0 || cooling.length > 0 || (resp.no_response_pct > 30);

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-[#1A2433] text-[22px] font-bold tracking-tight">Dashboard</h1>
        <p className="text-[#5A6B7D] text-[13.5px] mt-0.5">Welcome back — here's your business health overview</p>
      </div>

      {hasAlerts && (
        <div className="space-y-2">
          {s.active_drivers === 0 && (
            <div className="flex items-start gap-3 bg-[#FCEAEA] border border-[#F0C9C9] rounded-xl px-4 py-3">
              <AlertTriangle className="w-[18px] h-[18px] text-[#B23A3A] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[#B23A3A] text-sm font-bold">No active drivers</p>
                <p className="text-[#B23A3A] text-xs mt-0.5 opacity-80">
                  Any new booking right now has nobody to serve it. Activate or onboard drivers immediately.
                </p>
              </div>
            </div>
          )}

          {gaps.slice(0, 2).map((g: any) => (
            <div key={g.area} className="flex items-start gap-3 bg-[#FDF3E2] border border-[#F5DDB0] rounded-xl px-4 py-3">
              <MapPinOff className="w-[18px] h-[18px] text-[#92650F] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[#92650F] text-sm font-bold">No driver coverage in {g.area}</p>
                <p className="text-[#92650F] text-xs mt-0.5 opacity-80">
                  {g.booking_count} booking{g.booking_count !== 1 ? "s" : ""} from this area in the last 14 days, but zero active drivers cover it.
                </p>
              </div>
            </div>
          ))}

          {resp.no_response_pct > 30 && (
            <div className="flex items-start gap-3 bg-[#FDF3E2] border border-[#F5DDB0] rounded-xl px-4 py-3">
              <Timer className="w-[18px] h-[18px] text-[#92650F] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[#92650F] text-sm font-bold">{resp.no_response_pct}% of bookings got no driver response</p>
                <p className="text-[#92650F] text-xs mt-0.5 opacity-80">
                  In the last 30 days. These customers likely left without a driver — review WhatsApp delivery and driver coverage.
                </p>
              </div>
            </div>
          )}

          {cooling.length > 0 && (
            <div className="flex items-start gap-3 bg-[#FDF3E2] border border-[#F5DDB0] rounded-xl px-4 py-3">
              <UserMinus className="w-[18px] h-[18px] text-[#92650F] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[#92650F] text-sm font-bold">
                  {cooling.length} active driver{cooling.length !== 1 ? "s" : ""} haven't taken a trip in 14+ days
                </p>
                <p className="text-[#92650F] text-xs mt-0.5 opacity-80">
                  {cooling.slice(0, 3).map((d: any) => d.name).join(", ")}
                  {cooling.length > 3 ? ` +${cooling.length - 3} more` : ""} — check if they're still available.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E4EBF1] rounded-xl p-5 shadow-[0_1px_2px_rgba(16,42,67,0.04),0_1px_8px_rgba(16,42,67,0.04)]">
          <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#94A3B3] mb-2">Today's revenue</p>
          <div className="flex items-baseline gap-2">
            <p className="text-[28px] font-extrabold text-[#1A2433] tracking-tight">
              ₹{Number(rev.today_revenue || 0).toLocaleString("en-IN")}
            </p>
            {rev.change_pct !== 0 && (
              <span className={cn(
                "flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-md",
                rev.change_pct > 0 ? "text-[#1E7A4C] bg-[#E8F5EE]" : "text-[#B23A3A] bg-[#FCEAEA]"
              )}>
                {rev.change_pct > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(rev.change_pct)}%
              </span>
            )}
          </div>
          <p className="text-xs text-[#5A6B7D] mt-1.5">vs ₹{Number(rev.yesterday_revenue || 0).toLocaleString("en-IN")} yesterday</p>
        </div>

        <div className="bg-white border border-[#E4EBF1] rounded-xl p-5 shadow-[0_1px_2px_rgba(16,42,67,0.04),0_1px_8px_rgba(16,42,67,0.04)]">
          <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#94A3B3] mb-2">Pending payments</p>
          <p className="text-[28px] font-extrabold text-[#E8A23B] tracking-tight">
            ₹{Number(s.pending_payment_value || 0).toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-[#5A6B7D] mt-1.5">owed across unpaid bookings right now</p>
        </div>

        <div className="bg-white border border-[#E4EBF1] rounded-xl p-5 shadow-[0_1px_2px_rgba(16,42,67,0.04),0_1px_8px_rgba(16,42,67,0.04)]">
          <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#94A3B3] mb-2">Average fare</p>
          <p className="text-[28px] font-extrabold text-[#1A2433] tracking-tight">
            ₹{Math.round(Number(s.avg_fare || 0)).toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-[#5A6B7D] mt-1.5">per completed, paid booking</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="Total bookings"
          value={s.total_bookings} sub={`${s.today_bookings ?? 0} today`}
          accent="border-t-[#4A9DE0]" iconBg="bg-[#EAF4FD]" iconColor="text-[#1D63A0]" />
        <StatCard icon={Clock} label="Pending"
          value={s.pending} sub={`${s.today_pending ?? 0} new today`}
          accent="border-t-[#E8A23B]" iconBg="bg-[#FDF3E2]" iconColor="text-[#92650F]" />
        <StatCard icon={CheckCircle2} label="Completed"
          value={s.completed}
          accent="border-t-[#4CAF7D]" iconBg="bg-[#E8F5EE]" iconColor="text-[#1E7A4C]" />
        <StatCard icon={IndianRupee} label="Total revenue"
          value={`₹${Number(s.total_revenue || 0).toLocaleString("en-IN")}`}
          accent="border-t-[#4CAF7D]" iconBg="bg-[#E8F5EE]" iconColor="text-[#1E7A4C]" />
        <StatCard icon={Car} label="Active drivers"
          value={`${s.active_drivers ?? 0}/${s.total_drivers ?? 0}`}
          accent={s.active_drivers === 0 ? "border-t-[#D9534F]" : "border-t-[#8B6FE0]"}
          iconBg={s.active_drivers === 0 ? "bg-[#FCEAEA]" : "bg-[#F1EDFB]"}
          iconColor={s.active_drivers === 0 ? "text-[#B23A3A]" : "text-[#6B4FBF]"} />
        <StatCard icon={Navigation} label="Active trips"
          value={s.active_trips ?? 0} sub="trip_started + trip_ongoing"
          accent="border-t-[#2BB7C9]" iconBg="bg-[#E5F7FA]" iconColor="text-[#1A7E91]" />
        <StatCard icon={XCircle} label="Cancelled"
          value={s.cancelled}
          accent="border-t-[#D9534F]" iconBg="bg-[#FCEAEA]" iconColor="text-[#B23A3A]" />
        <StatCard icon={Repeat} label="Repeat customers"
          value={`${retn.repeat_rate_pct ?? 0}%`} sub={`${retn.unique_customers ?? 0} unique, last 30 days`}
          accent="border-t-[#4A9DE0]" iconBg="bg-[#EAF4FD]" iconColor="text-[#1D63A0]" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">

        <div className="bg-white border border-[#E4EBF1] rounded-xl p-5 shadow-[0_1px_2px_rgba(16,42,67,0.04),0_1px_8px_rgba(16,42,67,0.04)]">
          <p className="text-[#1A2433] font-bold mb-1 text-sm">Booking funnel — last 30 days</p>
          <p className="text-[#94A3B3] text-xs mb-4">Where bookings drop off before completion</p>
          <div className="space-y-3">
            <FunnelStage label="Bookings created"   count={funnel.created || 0}          total={funnel.created || 1} color="bg-[#4A9DE0]" />
            <FunnelStage label="Driver assigned"     count={funnel.driver_assigned || 0}  total={funnel.created || 1} color="bg-[#8B6FE0]" />
            <FunnelStage label="Payment link sent"   count={funnel.payment_link_sent || 0} total={funnel.created || 1} color="bg-[#2BB7C9]" />
            <FunnelStage label="Payment received"    count={funnel.payment_received || 0}  total={funnel.created || 1} color="bg-[#E8A23B]" />
            <FunnelStage label="Trip completed"      count={funnel.trip_completed || 0}    total={funnel.created || 1} color="bg-[#4CAF7D]" />
          </div>
          {funnel.dropoff_pct > 0 && (
            <p className="text-[#B23A3A] text-xs font-semibold mt-4 bg-[#FCEAEA] rounded-lg px-3 py-2">
              {funnel.dropoff_pct}% of bookings never got a driver assigned
            </p>
          )}
        </div>

        <div className="bg-white border border-[#E4EBF1] rounded-xl p-5 shadow-[0_1px_2px_rgba(16,42,67,0.04),0_1px_8px_rgba(16,42,67,0.04)]">
          <p className="text-[#1A2433] font-bold mb-1 text-sm">Driver responsiveness — last 30 days</p>
          <p className="text-[#94A3B3] text-xs mb-4">How fast drivers respond to WhatsApp alerts</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F7FAFC] rounded-lg p-4">
              <p className="text-[#94A3B3] text-[10.5px] font-semibold uppercase tracking-wide mb-1">Avg. accept time</p>
              <p className="text-[#1A2433] text-2xl font-extrabold">
                {resp.avg_accept_minutes != null ? `${resp.avg_accept_minutes}m` : "—"}
              </p>
            </div>
            <div className="bg-[#F7FAFC] rounded-lg p-4">
              <p className="text-[#94A3B3] text-[10.5px] font-semibold uppercase tracking-wide mb-1">No response</p>
              <p className={cn("text-2xl font-extrabold", resp.no_response_pct > 30 ? "text-[#B23A3A]" : "text-[#1A2433]")}>
                {resp.no_response_pct ?? 0}%
              </p>
            </div>
          </div>
          <p className="text-[#5A6B7D] text-xs mt-3">
            {resp.no_driver_response ?? 0} of {resp.total_recent ?? 0} bookings had no driver reply at all.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">

        <div className="lg:col-span-2 bg-white border border-[#E4EBF1] rounded-xl p-5 shadow-[0_1px_2px_rgba(16,42,67,0.04),0_1px_8px_rgba(16,42,67,0.04)]">
          <p className="text-[#1A2433] font-bold mb-4 text-sm">Revenue — last 7 days</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyFilled} barGap={4}>
              <XAxis dataKey="date" tick={{ fill: "#94A3B3", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94A3B3", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #E4EBF1", borderRadius: 10 }}
                labelStyle={{ color: "#1A2433" }}
                itemStyle={{ color: "#5A6B7D" }}
                formatter={(v: any) => `₹${Number(v).toLocaleString("en-IN")}`}
              />
              <Bar dataKey="revenue" fill="#4CAF7D" radius={[6, 6, 0, 0]} name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-[#E4EBF1] rounded-xl p-5 shadow-[0_1px_2px_rgba(16,42,67,0.04),0_1px_8px_rgba(16,42,67,0.04)]">
          <p className="text-[#1A2433] font-bold mb-4 text-sm">Revenue by service type</p>
          {pieData.length > 0 && pieData.some((d: any) => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="45%" outerRadius={70}
                  dataKey="value" nameKey="name" label={false}>
                  {pieData.map((_: any, i: number) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend iconType="circle" iconSize={8}
                  formatter={(v) => <span style={{ color: "#5A6B7D", fontSize: 11 }}>{v}</span>} />
                <Tooltip
                  contentStyle={{ background: "#fff", border: "1px solid #E4EBF1", borderRadius: 10 }}
                  itemStyle={{ color: "#5A6B7D" }}
                  formatter={(v: any) => `₹${Number(v).toLocaleString("en-IN")}`}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-[#94A3B3] text-sm">
              No revenue yet
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">

        <div className="bg-white border border-[#E4EBF1] rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(16,42,67,0.04),0_1px_8px_rgba(16,42,67,0.04)]">
          <div className="px-5 py-4 border-b border-[#E4EBF1] flex items-center justify-between">
            <p className="text-[#1A2433] font-bold text-sm">Top drivers</p>
            <Link to="/admin/drivers" className="text-[#1D63A0] text-xs font-semibold hover:underline">
              View all →
            </Link>
          </div>
          <div className="p-2">
            {(data.topDrivers || []).length === 0 && (
              <p className="text-[#94A3B3] text-sm text-center py-6">No drivers yet</p>
            )}
            {(data.topDrivers || []).map((d: any, i: number) => (
              <div key={d.driver_id}
                className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-[#EFF6FC] transition-colors">
                <span className="text-[#94A3B3] text-[11px] font-bold w-4 text-center">{i + 1}</span>
                <div className="w-8 h-8 rounded-lg bg-[#D3E9FB] text-[#1D63A0] flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {d.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#1A2433] text-xs font-semibold truncate">{d.name}</p>
                  <p className="text-[#94A3B3] text-[11px]">{d.area}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[#1A2433] text-xs font-bold">{d.total_trips} trips</p>
                  <p className="text-[#E8A23B] text-[11px] font-semibold">★ {d.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-[#E4EBF1] rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(16,42,67,0.04),0_1px_8px_rgba(16,42,67,0.04)]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E4EBF1]">
            <p className="text-[#1A2433] font-bold text-sm">Recent bookings</p>
            <Link to="/admin/bookings" className="text-[#1D63A0] text-xs font-semibold hover:underline">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E4EBF1] bg-[#F7FAFC]">
                  {["ID", "Customer", "Pickup", "Vehicle", "Driver", "Status"].map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 text-[#94A3B3] text-[10.5px] font-bold uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data.recentBookings || []).map((b: any) => (
                  <tr key={b.booking_id} className="border-b border-[#E4EBF1] hover:bg-[#EFF6FC] transition-colors">
                    <td className="px-4 py-3 text-[#1D63A0] text-xs font-mono">
                      {b.booking_id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[#1A2433] font-semibold text-xs">{b.full_name}</p>
                      <p className="text-[#94A3B3] text-[11px]">{b.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-[#1A2433] text-xs max-w-[130px] truncate">{b.pickup_city}</td>
                    <td className="px-4 py-3">
                      <p className="text-[#1A2433] text-xs uppercase font-semibold">{b.vehicle_type}</p>
                      {b.vehicle_number && <p className="text-[#1D63A0] text-[11px] font-mono font-semibold">{b.vehicle_number}</p>}
                    </td>
                    <td className="px-4 py-3 text-[#5A6B7D] text-xs">
                      {b.driver_name || <span className="text-[#94A3B3]">Unassigned</span>}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={b.trip_status || b.status} /></td>
                  </tr>
                ))}
                {!data.recentBookings?.length && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-[#94A3B3] text-sm">
                      No bookings yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}