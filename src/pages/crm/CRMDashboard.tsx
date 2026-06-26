// // src/pages/crm/CRMDashboard.tsx
// import { useEffect, useState } from "react";
// import { getDashboard } from "@/services/crmService";
// import { Link } from "react-router-dom";
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
// } from "recharts";
// import {
//   BookOpen, Users, CheckCircle2, Clock, XCircle,
//   TrendingUp, IndianRupee, Car, Loader2, AlertCircle,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { format } from "date-fns";

// const STATUS_COLORS: Record<string, string> = {
//   pending:   "#f59e0b",
//   confirmed: "#3b82f6",
//   assigned:  "#8b5cf6",
//   completed: "#10b981",
//   cancelled: "#ef4444",
// };
// const PIE_COLORS = ["#3b82f6","#10b981","#f59e0b","#8b5cf6","#ef4444"];

// function StatCard({ icon: Icon, label, value, sub, color = "accent" }: any) {
//   return (
//     <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 flex items-start gap-4">
//       <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
//         color === "green"  ? "bg-green-500/15 text-green-400"  :
//         color === "yellow" ? "bg-yellow-500/15 text-yellow-400":
//         color === "red"    ? "bg-red-500/15 text-red-400"      :
//         color === "purple" ? "bg-purple-500/15 text-purple-400":
//         "bg-accent/15 text-accent"
//       )}>
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
//     pending:   "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
//     confirmed: "bg-blue-500/15 text-blue-400 border-blue-500/20",
//     assigned:  "bg-purple-500/15 text-purple-400 border-purple-500/20",
//     completed: "bg-green-500/15 text-green-400 border-green-500/20",
//     cancelled: "bg-red-500/15 text-red-400 border-red-500/20",
//   };
//   return (
//     <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-semibold border capitalize",
//       colors[status] || "bg-white/10 text-white/50 border-white/10")}>
//       {status}
//     </span>
//   );
// }

// export default function CRMDashboard() {
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
//       <Loader2 className="w-8 h-8 text-accent animate-spin" />
//     </div>
//   );
//   if (error) return (
//     <div className="flex items-center gap-3 text-red-400 bg-red-500/10 border border-red-400/20
//                     rounded-2xl p-4">
//       <AlertCircle className="w-5 h-5" /> {error}
//     </div>
//   );

//   const s = data.stats;

//   // Fill missing dates in weekly data
//   const weeklyMap: Record<string, any> = {};
//   (data.weekly || []).forEach((d: any) => { weeklyMap[d.date] = d; });
//   const weeklyFilled = Array.from({ length: 7 }, (_, i) => {
//     const d    = new Date();
//     d.setDate(d.getDate() - (6 - i));
//     const key  = d.toISOString().split("T")[0];
//     return { date: format(d, "MMM d"), bookings: weeklyMap[key]?.bookings || 0, paid: weeklyMap[key]?.paid || 0 };
//   });

//   const pieData = (data.byService || []).map((s: any) => ({
//     name: s.service_type, value: Number(s.count)
//   }));

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-white text-xl font-bold">Dashboard</h1>
//         <p className="text-white/40 text-sm">Welcome back — here's your overview</p>
//       </div>

//       {/* Stat cards */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard icon={BookOpen}      label="Total Bookings"  value={s.total_bookings} sub={`${s.today_bookings} today`} />
//         <StatCard icon={Clock}         label="Pending"         value={s.pending}         color="yellow" />
//         <StatCard icon={CheckCircle2}  label="Completed"       value={s.completed}       color="green" />
//         <StatCard icon={IndianRupee}   label="Revenue"         value={`₹${Number(s.total_revenue||0).toLocaleString("en-IN")}`} color="green" />
//         <StatCard icon={Car}           label="Active Drivers"  value={`${s.active_drivers}/${s.total_drivers}`} color="purple" />
//         <StatCard icon={TrendingUp}    label="Confirmed"       value={s.confirmed}       color="accent" />
//         <StatCard icon={XCircle}       label="Cancelled"       value={s.cancelled}       color="red" />
//         <StatCard icon={CheckCircle2}  label="Paid Bookings"   value={s.paid_bookings}   color="green"
//           sub={`${s.today_pending} pending today`} />
//       </div>

//       {/* Charts row */}
//       <div className="grid lg:grid-cols-3 gap-4">
//         {/* Weekly bookings bar chart */}
//         <div className="lg:col-span-2 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
//           <p className="text-white font-semibold mb-4 text-sm">Bookings — Last 7 Days</p>
//           <ResponsiveContainer width="100%" height={200}>
//             <BarChart data={weeklyFilled} barGap={4}>
//               <XAxis dataKey="date" tick={{ fill: "#ffffff50", fontSize: 11 }} axisLine={false} tickLine={false} />
//               <YAxis tick={{ fill: "#ffffff50", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
//               <Tooltip
//                 contentStyle={{ background: "#0d1b2e", border: "1px solid #ffffff15", borderRadius: 12 }}
//                 labelStyle={{ color: "#fff" }}
//                 itemStyle={{ color: "#ffffff80" }}
//               />
//               <Bar dataKey="bookings" fill="#3b82f6" radius={[6,6,0,0]} name="Bookings" />
//               <Bar dataKey="paid"     fill="#10b981" radius={[6,6,0,0]} name="Paid" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Service type pie */}
//         <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
//           <p className="text-white font-semibold mb-4 text-sm">By Service Type</p>
//           {pieData.length > 0 ? (
//             <ResponsiveContainer width="100%" height={200}>
//               <PieChart>
//                 <Pie data={pieData} cx="50%" cy="45%" outerRadius={70}
//                      dataKey="value" nameKey="name" label={false}>
//                   {pieData.map((_: any, i: number) => (
//                     <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Legend iconType="circle" iconSize={8}
//                   formatter={(v) => <span style={{ color: "#ffffff80", fontSize: 11 }}>{v}</span>} />
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

//       {/* Recent bookings */}
//       <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden">
//         <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
//           <p className="text-white font-semibold text-sm">Recent Bookings</p>
//           <Link to="/crm/bookings"
//             className="text-accent text-xs font-medium hover:underline">
//             View all →
//           </Link>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-b border-white/[0.05]">
//                 {["ID","Customer","Pickup","Date","Service","Driver","Status"].map(h => (
//                   <th key={h} className="text-left px-4 py-3 text-white/30 text-xs font-semibold uppercase tracking-wide">
//                     {h}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {(data.recentBookings || []).map((b: any) => (
//                 <tr key={b.booking_id}
//                     className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors">
//                   <td className="px-4 py-3 text-white/50 text-xs font-mono">
//                     {b.booking_id.slice(0,8).toUpperCase()}
//                   </td>
//                   <td className="px-4 py-3 text-white font-medium">{b.full_name}</td>
//                   <td className="px-4 py-3 text-white/60 text-xs max-w-[150px] truncate">
//                     {b.pickup_city}
//                   </td>
//                   <td className="px-4 py-3 text-white/60 text-xs whitespace-nowrap">
//                     {b.pickup_date}
//                   </td>
//                   <td className="px-4 py-3 text-white/60 text-xs capitalize">{b.service_type}</td>
//                   <td className="px-4 py-3 text-white/60 text-xs">
//                     {b.driver_name || <span className="text-white/20">Unassigned</span>}
//                   </td>
//                   <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
//                 </tr>
//               ))}
//               {!data.recentBookings?.length && (
//                 <tr>
//                   <td colSpan={7} className="text-center py-8 text-white/30 text-sm">
//                     No bookings yet
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }


//testing



// src/pages/crm/CRMDashboard.tsx
import { useEffect, useState } from "react";
import { getDashboard } from "@/services/crmService";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  BookOpen, Users, CheckCircle2, Clock, XCircle,
  TrendingUp, IndianRupee, Car, Loader2, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const STATUS_COLORS: Record<string, string> = {
  pending:   "#f59e0b",
  confirmed: "#3b82f6",
  assigned:  "#8b5cf6",
  completed: "#10b981",
  cancelled: "#ef4444",
};
const PIE_COLORS = ["#3b82f6","#10b981","#f59e0b","#8b5cf6","#ef4444"];

function StatCard({ icon: Icon, label, value, sub, color = "accent" }: any) {
  return (
    <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 flex items-start gap-4">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
        color === "green"  ? "bg-green-500/15 text-green-400"  :
        color === "yellow" ? "bg-yellow-500/15 text-yellow-400":
        color === "red"    ? "bg-red-500/15 text-red-400"      :
        color === "purple" ? "bg-purple-500/15 text-purple-400":
        "bg-accent/15 text-accent"
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-white/40 text-xs font-medium mb-0.5">{label}</p>
        <p className="text-white text-2xl font-bold leading-none">{value ?? "—"}</p>
        {sub && <p className="text-white/30 text-xs mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending:   "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    confirmed: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    assigned:  "bg-purple-500/15 text-purple-400 border-purple-500/20",
    completed: "bg-green-500/15 text-green-400 border-green-500/20",
    cancelled: "bg-red-500/15 text-red-400 border-red-500/20",
  };
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-semibold border capitalize",
      colors[status] || "bg-white/10 text-white/50 border-white/10")}>
      {status}
    </span>
  );
}

export default function CRMDashboard() {
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
      <Loader2 className="w-8 h-8 text-accent animate-spin" />
    </div>
  );
  if (error) return (
    <div className="flex items-center gap-3 text-red-400 bg-red-500/10 border border-red-400/20
                    rounded-2xl p-4">
      <AlertCircle className="w-5 h-5" /> {error}
    </div>
  );

  const s = data.stats;

  // Fill missing dates in weekly data
  const weeklyMap: Record<string, any> = {};
  (data.weekly || []).forEach((d: any) => { weeklyMap[d.date] = d; });
  const weeklyFilled = Array.from({ length: 7 }, (_, i) => {
    const d    = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key  = d.toISOString().split("T")[0];
    return { date: format(d, "MMM d"), bookings: weeklyMap[key]?.bookings || 0, paid: weeklyMap[key]?.paid || 0 };
  });

  const pieData = (data.byService || []).map((s: any) => ({
    name: s.service_type, value: Number(s.count)
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white text-xl font-bold">Dashboard</h1>
        <p className="text-white/40 text-sm">Welcome back — here's your overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen}      label="Total Bookings"  value={s.total_bookings} sub={`${s.today_bookings} today`} />
        <StatCard icon={Clock}         label="Pending"         value={s.pending}         color="yellow" />
        <StatCard icon={CheckCircle2}  label="Completed"       value={s.completed}       color="green" />
        <StatCard icon={IndianRupee}   label="Revenue"         value={`₹${Number(s.total_revenue||0).toLocaleString("en-IN")}`} color="green" />
        <StatCard icon={Car}           label="Active Drivers"  value={`${s.active_drivers}/${s.total_drivers}`} color="purple" />
        <StatCard icon={TrendingUp}    label="Confirmed"       value={s.confirmed}       color="accent" />
        <StatCard icon={XCircle}       label="Cancelled"       value={s.cancelled}       color="red" />
        <StatCard icon={CheckCircle2}  label="Paid Bookings"   value={s.paid_bookings}   color="green"
          sub={`${s.today_pending} pending today`} />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Weekly bookings bar chart */}
        <div className="lg:col-span-2 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white font-semibold mb-4 text-sm">Bookings — Last 7 Days</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyFilled} barGap={4}>
              <XAxis dataKey="date" tick={{ fill: "#ffffff50", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#ffffff50", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "#0d1b2e", border: "1px solid #ffffff15", borderRadius: 12 }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#ffffff80" }}
              />
              <Bar dataKey="bookings" fill="#3b82f6" radius={[6,6,0,0]} name="Bookings" />
              <Bar dataKey="paid"     fill="#10b981" radius={[6,6,0,0]} name="Paid" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Service type pie */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white font-semibold mb-4 text-sm">By Service Type</p>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="45%" outerRadius={70}
                     dataKey="value" nameKey="name" label={false}>
                  {pieData.map((_: any, i: number) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend iconType="circle" iconSize={8}
                  formatter={(v) => <span style={{ color: "#ffffff80", fontSize: 11 }}>{v}</span>} />
                <Tooltip
                  contentStyle={{ background: "#0d1b2e", border: "1px solid #ffffff15", borderRadius: 12 }}
                  itemStyle={{ color: "#ffffff80" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-white/30 text-sm">
              No data yet
            </div>
          )}
        </div>
      </div>

      {/* Recent bookings */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
          <p className="text-white font-semibold text-sm">Recent Bookings</p>
          <Link to="/crm/bookings"
            className="text-accent text-xs font-medium hover:underline">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.05]">
                {["ID","Customer","Pickup","Date","Service","Driver","Status"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-white/30 text-xs font-semibold uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data.recentBookings || []).map((b: any) => (
                <tr key={b.booking_id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-3 text-white/50 text-xs font-mono">
                    {b.booking_id.slice(0,8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3 text-white font-medium">{b.full_name}</td>
                  <td className="px-4 py-3 text-white/60 text-xs max-w-[150px] truncate">
                    {b.pickup_city}
                  </td>
                  <td className="px-4 py-3 text-white/60 text-xs whitespace-nowrap">
                    {b.pickup_date}
                  </td>
                  <td className="px-4 py-3 text-white/60 text-xs capitalize">{b.service_type}</td>
                  <td className="px-4 py-3 text-white/60 text-xs">
                    {b.driver_name || <span className="text-white/20">Unassigned</span>}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                </tr>
              ))}
              {!data.recentBookings?.length && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-white/30 text-sm">
                    No bookings yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
