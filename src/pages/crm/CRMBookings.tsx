// // src/pages/crm/CRMBookings.tsx
// import { useEffect, useState, useCallback } from "react";
// import {
//   getBookings, getDrivers, assignDriver, sendPaymentLink,
//   markPaid, updateBookingStatus, updateTripStatus, deleteBooking,
// } from "@/services/adminService";
// import {
//   Search, RefreshCw, Eye, UserCheck, CreditCard,
//   CheckCircle, Loader2, X, Navigation, Flag,
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// const STATUS_OPTIONS = [
//   "", "pending", "confirmed", "assigned",
//   "trip_started", "trip_ongoing", "completed", "cancelled",
// ];
// const SERVICE_OPTIONS = ["", "hourly", "daily", "outstation", "monthly", "valet"];

// // ── Status badge ──────────────────────────────────────────────────────────────
// function Badge({ status }: { status: string }) {
//   const m: Record<string, string> = {
//     pending:       "bg-yellow-500/15 text-yellow-400 border-yellow-400/20",
//     confirmed:     "bg-blue-500/15 text-blue-400 border-blue-400/20",
//     assigned:      "bg-purple-500/15 text-purple-400 border-purple-400/20",
//     trip_started:  "bg-orange-500/15 text-orange-400 border-orange-400/20",
//     trip_ongoing:  "bg-cyan-500/15 text-cyan-400 border-cyan-400/20",
//     completed:     "bg-green-500/15 text-green-400 border-green-400/20",
//     cancelled:     "bg-red-500/15 text-red-400 border-red-400/20",
//     paid:          "bg-green-500/15 text-green-400 border-green-400/20",
//     link_sent:     "bg-blue-500/15 text-blue-400 border-blue-400/20",
//   };
//   return (
//     <span className={cn(
//       "px-2 py-0.5 rounded-full text-[11px] font-semibold border capitalize whitespace-nowrap",
//       m[status] || "bg-white/10 text-white/50 border-white/10"
//     )}>
//       {status.replace(/_/g, " ")}
//     </span>
//   );
// }

// // ── Booking detail / action modal ─────────────────────────────────────────────
// function BookingModal({ booking, drivers, onClose, onRefresh }: any) {
//   const [tab,       setTab]       = useState<"details" | "assign" | "payment" | "trip">("details");
//   const [selDriver, setSelDriver] = useState(booking.assigned_driver_id || "");
//   const [amount,    setAmount]    = useState("");
//   const [payLink,   setPayLink]   = useState("");
//   const [fare,      setFare]      = useState("");
//   const [loading,   setLoading]   = useState(false);
//   const [msg,       setMsg]       = useState("");

//   const act = async (fn: () => Promise<any>, successMsg: string) => {
//     setLoading(true); setMsg("");
//     try {
//       await fn();
//       setMsg("✅ " + successMsg);
//       onRefresh();
//     } catch (e: any) {
//       setMsg("❌ " + (e.message || "Something went wrong"));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const tabs = ["details", "assign", "payment", "trip"] as const;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
//       <div className="bg-[#0d1b2e] border border-white/10 rounded-3xl w-full max-w-2xl
//                       max-h-[90vh] overflow-y-auto shadow-2xl">

//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
//           <div>
//             <p className="text-white font-bold">
//               Booking #{booking.booking_id.slice(0, 8).toUpperCase()}
//             </p>
//             <p className="text-white/40 text-xs mt-0.5">
//               {booking.full_name} · {booking.phone}
//             </p>
//           </div>
//           <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-1 px-6 pt-4 flex-wrap">
//           {tabs.map((t) => (
//             <button key={t} onClick={() => setTab(t)}
//               className={cn(
//                 "px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all",
//                 tab === t
//                   ? "bg-accent text-white"
//                   : "text-white/40 hover:text-white hover:bg-white/5"
//               )}>
//               {t === "trip" ? "🚗 Trip" : t}
//             </button>
//           ))}
//         </div>

//         <div className="p-6 space-y-4">

//           {/* ── Details tab ────────────────────────────────────────────────── */}
//           {tab === "details" && (
//             <div className="space-y-3">
//               <div className="grid grid-cols-2 gap-3">
//                 {[
//                   ["Customer",       booking.full_name],
//                   ["Phone",          booking.phone],
//                   ["Email",          booking.email],
//                   ["Service",        booking.service_type],
//                   ["Vehicle Type",   booking.vehicle_type?.toUpperCase()],
//                   ["Vehicle Number", booking.vehicle_number || "Not provided"],
//                   ["Date",           booking.pickup_date],
//                   ["Time",           booking.pickup_time],
//                   ["Status",         booking.status?.replace(/_/g, " ")],
//                   ["Trip Status",    booking.trip_status?.replace(/_/g, " ") || "—"],
//                   ["Payment",        booking.payment_status || "pending"],
//                   ["Fare",           booking.fare_amount ? "₹" + booking.fare_amount : "—"],
//                 ].map(([k, v]) => (
//                   <div key={k} className="bg-white/5 rounded-xl px-3 py-2.5">
//                     <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wide">{k}</p>
//                     <p className="text-white text-sm mt-0.5 capitalize">{v}</p>
//                   </div>
//                 ))}
//               </div>

//               {/* Pickup / Drop */}
//               <div className="bg-white/5 rounded-xl px-3 py-2.5">
//                 <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wide">Pickup</p>
//                 <p className="text-white text-sm mt-0.5">{booking.pickup_city}</p>
//               </div>
//               {booking.drop_location && (
//                 <div className="bg-white/5 rounded-xl px-3 py-2.5">
//                   <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wide">Drop</p>
//                   <p className="text-white text-sm mt-0.5">{booking.drop_location}</p>
//                 </div>
//               )}

//               {/* Feedback rating */}
//               {booking.feedback_rating && (
//                 <div className="bg-yellow-500/10 border border-yellow-400/20 rounded-xl px-3 py-2.5">
//                   <p className="text-yellow-400 text-[10px] font-semibold uppercase tracking-wide">
//                     Customer Rating
//                   </p>
//                   <p className="text-white text-sm mt-0.5">
//                     {"⭐".repeat(booking.feedback_rating)} {booking.feedback_rating}/5
//                     {booking.feedback_comment && (
//                       <span className="text-white/50 ml-2">— {booking.feedback_comment}</span>
//                     )}
//                   </p>
//                 </div>
//               )}

//               {/* Assigned driver */}
//               {booking.driver_name && (
//                 <div className="bg-purple-500/10 border border-purple-400/20 rounded-xl px-3 py-2.5">
//                   <p className="text-purple-400 text-[10px] font-semibold uppercase tracking-wide">
//                     Assigned Driver
//                   </p>
//                   <p className="text-white text-sm mt-0.5">
//                     {booking.driver_name} · {booking.driver_phone}
//                     {booking.driver_area && (
//                       <span className="text-white/50"> · {booking.driver_area}</span>
//                     )}
//                   </p>
//                 </div>
//               )}

//               {/* Quick status change */}
//               <div className="flex flex-wrap gap-2 pt-2">
//                 {["completed", "cancelled"].map((s) => (
//                   <button key={s}
//                     onClick={() => act(
//                       () => updateBookingStatus(booking.booking_id, s),
//                       `Status → ${s}`
//                     )}
//                     disabled={loading || booking.status === s}
//                     className={cn(
//                       "px-4 py-2 rounded-xl text-xs font-bold border transition-all disabled:opacity-40",
//                       s === "completed"
//                         ? "border-green-400/30 text-green-400 hover:bg-green-500/15"
//                         : "border-red-400/30 text-red-400 hover:bg-red-500/15"
//                     )}>
//                     Mark {s}
//                   </button>
//                 ))}
//                 <button
//                   onClick={() => act(() => deleteBooking(booking.booking_id), "Booking deleted")}
//                   disabled={loading}
//                   className="px-4 py-2 rounded-xl text-xs font-bold border border-red-500/30
//                              text-red-400 hover:bg-red-500/15 transition-all disabled:opacity-40 ml-auto">
//                   Delete
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* ── Assign driver tab ───────────────────────────────────────────── */}
//           {tab === "assign" && (
//             <div className="space-y-3">
//               <p className="text-white/50 text-sm">
//                 Select a driver — WhatsApp alerts go to both driver and customer.
//               </p>
//               <select
//                 value={selDriver}
//                 onChange={(e) => setSelDriver(e.target.value)}
//                 className="w-full h-11 rounded-xl bg-white/10 border border-white/15 text-white
//                            text-sm px-3 focus:outline-none focus:ring-1 focus:ring-accent
//                            [&>option]:bg-[#0d1b2e]"
//               >
//                 <option value="">Select driver…</option>
//                 {drivers.filter((d: any) => d.active).map((d: any) => (
//                   <option key={d.driver_id} value={d.driver_id}>
//                     {d.name} · {d.area} · ⭐{d.rating}
//                   </option>
//                 ))}
//               </select>
//               <button
//                 onClick={() => act(
//                   () => assignDriver(booking.booking_id, selDriver),
//                   "Driver assigned & notified via WhatsApp!"
//                 )}
//                 disabled={loading || !selDriver}
//                 className="w-full h-11 rounded-xl bg-accent text-white font-bold text-sm
//                            hover:bg-accent/90 transition-all disabled:opacity-50
//                            flex items-center justify-center gap-2"
//               >
//                 {loading
//                   ? <Loader2 className="w-4 h-4 animate-spin" />
//                   : <UserCheck className="w-4 h-4" />}
//                 Assign & Notify via WhatsApp
//               </button>
//             </div>
//           )}

//           {/* ── Payment tab ─────────────────────────────────────────────────── */}
//           {tab === "payment" && (
//             <div className="space-y-3">
//               <p className="text-white/50 text-sm">
//                 Enter amount and payment link — sent to customer via WhatsApp.
//               </p>
//               <input
//                 type="number"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 placeholder="Amount (₹)"
//                 className="w-full h-11 rounded-xl bg-white/10 border border-white/15 text-white
//                            text-sm px-3 placeholder:text-white/30
//                            focus:outline-none focus:ring-1 focus:ring-accent"
//               />
//               <input
//                 type="url"
//                 value={payLink}
//                 onChange={(e) => setPayLink(e.target.value)}
//                 placeholder="Payment link (https://razorpay.com/…)"
//                 className="w-full h-11 rounded-xl bg-white/10 border border-white/15 text-white
//                            text-sm px-3 placeholder:text-white/30
//                            focus:outline-none focus:ring-1 focus:ring-accent"
//               />
//               <button
//                 onClick={() => act(
//                   () => sendPaymentLink(booking.booking_id, Number(amount), payLink),
//                   "Payment link sent to customer!"
//                 )}
//                 disabled={loading || !amount || !payLink}
//                 className="w-full h-11 rounded-xl bg-blue-600 text-white font-bold text-sm
//                            hover:bg-blue-500 transition-all disabled:opacity-50
//                            flex items-center justify-center gap-2"
//               >
//                 {loading
//                   ? <Loader2 className="w-4 h-4 animate-spin" />
//                   : <CreditCard className="w-4 h-4" />}
//                 Send Payment Link via WhatsApp
//               </button>

//               {booking.assigned_driver_id && (
//                 <button
//                   onClick={() => act(
//                     () => markPaid(booking.booking_id),
//                     "Marked paid! Driver & customer notified!"
//                   )}
//                   disabled={loading}
//                   className="w-full h-11 rounded-xl bg-green-600 text-white font-bold text-sm
//                              hover:bg-green-500 transition-all disabled:opacity-50
//                              flex items-center justify-center gap-2"
//                 >
//                   {loading
//                     ? <Loader2 className="w-4 h-4 animate-spin" />
//                     : <CheckCircle className="w-4 h-4" />}
//                   Mark Paid & Share Driver Details
//                 </button>
//               )}
//             </div>
//           )}

//           {/* ── Trip status tab ─────────────────────────────────────────────── */}
//           {tab === "trip" && (
//             <div className="space-y-3">
//               <p className="text-white/50 text-sm">
//                 Manually update trip progress. Normally drivers update this via WhatsApp buttons.
//               </p>

//               {/* Current status */}
//               <div className="bg-white/5 rounded-xl px-4 py-3 flex items-center justify-between">
//                 <span className="text-white/50 text-xs font-semibold uppercase tracking-wide">
//                   Current Status
//                 </span>
//                 <Badge status={booking.trip_status || booking.status} />
//               </div>

//               {/* Trip stage buttons */}
//               <div className="space-y-2">
//                 {[
//                   {
//                     stage: "trip_started" as const,
//                     label: "🚦 Mark Trip Started",
//                     desc: "Driver has left for pickup",
//                     color: "bg-orange-600 hover:bg-orange-500",
//                   },
//                   {
//                     stage: "trip_ongoing" as const,
//                     label: "🛣️ Mark Trip Ongoing",
//                     desc: "Customer has boarded, en route to drop",
//                     color: "bg-cyan-600 hover:bg-cyan-500",
//                   },
//                   {
//                     stage: "trip_completed" as const,
//                     label: "🏁 Mark Trip Completed",
//                     desc: "Customer dropped, trip done",
//                     color: "bg-green-600 hover:bg-green-500",
//                   },
//                 ].map(({ stage, label, desc, color }) => (
//                   <div key={stage} className="space-y-1">
//                     {stage === "trip_completed" && (
//                       <input
//                         type="number"
//                         value={fare}
//                         onChange={(e) => setFare(e.target.value)}
//                         placeholder="Final fare amount ₹ (optional)"
//                         className="w-full h-10 rounded-xl bg-white/10 border border-white/15 text-white
//                                    text-sm px-3 placeholder:text-white/30
//                                    focus:outline-none focus:ring-1 focus:ring-accent"
//                       />
//                     )}
//                     <button
//                       onClick={() => act(
//                         () => updateTripStatus(
//                           booking.booking_id,
//                           stage,
//                           stage === "trip_completed" && fare ? Number(fare) : undefined
//                         ),
//                         label + " — customer notified!"
//                       )}
//                       disabled={loading}
//                       className={cn(
//                         "w-full h-11 rounded-xl text-white font-bold text-sm transition-all",
//                         "disabled:opacity-50 flex items-center justify-center gap-2",
//                         color
//                       )}
//                     >
//                       {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
//                       {label}
//                     </button>
//                     <p className="text-white/30 text-xs pl-1">{desc}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Message */}
//           {msg && (
//             <p className={cn(
//               "text-sm px-3 py-2 rounded-xl",
//               msg.startsWith("✅")
//                 ? "bg-green-500/10 text-green-400 border border-green-400/20"
//                 : "bg-red-500/10 text-red-400 border border-red-400/20"
//             )}>
//               {msg}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Main bookings page ────────────────────────────────────────────────────────
// export default function CRMBookings() {
//   const [bookings, setBookings] = useState<any[]>([]);
//   const [drivers,  setDrivers]  = useState<any[]>([]);
//   const [total,    setTotal]    = useState(0);
//   const [page,     setPage]     = useState(1);
//   const [loading,  setLoading]  = useState(true);
//   const [selected, setSelected] = useState<any>(null);

//   const [filters, setFilters] = useState({
//     search: "", status: "", service: "", date: "", payment: "",
//   });

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await getBookings({ ...filters, page, limit: 20 });
//       setBookings(res.data);
//       setTotal(res.total);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   }, [filters, page]);

//   useEffect(() => { load(); }, [load]);
//   useEffect(() => {
//     getDrivers({ active: true }).then((d) => setDrivers(d.data)).catch(() => {});
//   }, []);

//   const setF = (k: string, v: string) => {
//     setFilters((p) => ({ ...p, [k]: v }));
//     setPage(1);
//   };

//   const totalPages = Math.ceil(total / 20);

//   return (
//     <div className="space-y-4">

//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-white text-xl font-bold">Bookings</h1>
//           <p className="text-white/40 text-sm">{total} total bookings</p>
//         </div>
//         <button onClick={load}
//           className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5
//                      text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm">
//           <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
//           Refresh
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
//           <div className="relative lg:col-span-2">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
//             <input
//               value={filters.search}
//               onChange={(e) => setF("search", e.target.value)}
//               placeholder="Search name, phone, ID, vehicle no…"
//               className="w-full h-10 pl-9 pr-3 rounded-xl bg-white/10 border border-white/10
//                          text-white text-sm placeholder:text-white/30
//                          focus:outline-none focus:ring-1 focus:ring-accent"
//             />
//           </div>
//           {[
//             { key: "status",  opts: STATUS_OPTIONS,  ph: "All Status"   },
//             { key: "service", opts: SERVICE_OPTIONS, ph: "All Services" },
//           ].map(({ key, opts, ph }) => (
//             <select key={key} value={(filters as any)[key]}
//               onChange={(e) => setF(key, e.target.value)}
//               className="h-10 rounded-xl bg-white/10 border border-white/10 text-white text-sm px-3
//                          focus:outline-none focus:ring-1 focus:ring-accent [&>option]:bg-[#0d1b2e]"
//             >
//               <option value="">{ph}</option>
//               {opts.filter(Boolean).map((o) => (
//                 <option key={o} value={o} className="capitalize">
//                   {o.replace(/_/g, " ")}
//                 </option>
//               ))}
//             </select>
//           ))}
//           <input
//             type="date"
//             value={filters.date}
//             onChange={(e) => setF("date", e.target.value)}
//             className="h-10 rounded-xl bg-white/10 border border-white/10 text-white text-sm px-3
//                        focus:outline-none focus:ring-1 focus:ring-accent [color-scheme:dark]"
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden">
//         {loading ? (
//           <div className="flex items-center justify-center py-16">
//             <Loader2 className="w-6 h-6 text-accent animate-spin" />
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-white/[0.06]">
//                   {[
//                     "Booking ID", "Customer", "Pickup → Drop", "Date/Time",
//                     "Vehicle", "Service", "Driver", "Status", "Payment", "Actions",
//                   ].map((h) => (
//                     <th key={h}
//                       className="text-left px-4 py-3 text-white/30 text-xs font-semibold
//                                  uppercase tracking-wide whitespace-nowrap">
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {bookings.map((b) => (
//                   <tr key={b.booking_id}
//                     className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors">
//                     <td className="px-4 py-3 text-white/50 font-mono text-xs">
//                       {b.booking_id.slice(0, 8).toUpperCase()}
//                     </td>
//                     <td className="px-4 py-3">
//                       <p className="text-white font-medium text-xs">{b.full_name}</p>
//                       <p className="text-white/40 text-[11px]">{b.phone}</p>
//                     </td>
//                     <td className="px-4 py-3 max-w-[160px]">
//                       <p className="text-white/70 text-xs truncate">{b.pickup_city}</p>
//                       {b.drop_location && (
//                         <p className="text-white/30 text-[11px] truncate">→ {b.drop_location}</p>
//                       )}
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <p className="text-white/70 text-xs">{b.pickup_date}</p>
//                       <p className="text-white/40 text-[11px]">{b.pickup_time}</p>
//                     </td>
//                     <td className="px-4 py-3">
//                       <p className="text-white/70 text-xs uppercase font-semibold">{b.vehicle_type}</p>
//                       {b.vehicle_number && (
//                         <p className="text-white/40 text-[11px] font-mono">{b.vehicle_number}</p>
//                       )}
//                     </td>
//                     <td className="px-4 py-3 text-white/60 text-xs capitalize">
//                       {b.service_type}
//                     </td>
//                     <td className="px-4 py-3 text-xs">
//                       {b.driver_name
//                         ? <span className="text-purple-400">{b.driver_name}</span>
//                         : <span className="text-white/20">Unassigned</span>
//                       }
//                     </td>
//                     <td className="px-4 py-3">
//                       <Badge status={b.trip_status || b.status} />
//                     </td>
//                     <td className="px-4 py-3">
//                       <Badge status={b.payment_status || "pending"} />
//                     </td>
//                     <td className="px-4 py-3">
//                       <button
//                         onClick={() => setSelected(b)}
//                         className="p-1.5 rounded-lg bg-accent/10 text-accent
//                                    hover:bg-accent hover:text-white transition-all"
//                         title="View / Manage"
//                       >
//                         <Eye className="w-3.5 h-3.5" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//                 {!bookings.length && (
//                   <tr>
//                     <td colSpan={10} className="text-center py-12 text-white/30 text-sm">
//                       No bookings found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06]">
//             <p className="text-white/30 text-xs">Page {page} of {totalPages}</p>
//             <div className="flex gap-2">
//               <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
//                 className="px-3 py-1.5 rounded-lg bg-white/5 text-white/50 text-xs
//                            hover:bg-white/10 disabled:opacity-30 transition-all">
//                 ← Prev
//               </button>
//               <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                 disabled={page === totalPages}
//                 className="px-3 py-1.5 rounded-lg bg-white/5 text-white/50 text-xs
//                            hover:bg-white/10 disabled:opacity-30 transition-all">
//                 Next →
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {selected && (
//         <BookingModal
//           booking={selected}
//           drivers={drivers}
//           onClose={() => setSelected(null)}
//           onRefresh={() => { load(); setSelected(null); }}
//         />
//       )}
//     </div>
//   );
// }



//testing theme change




// src/pages/crm/CRMBookings.tsx
// Sky blue + white theme
import { useEffect, useState, useCallback } from "react";
import {
  getBookings, getDrivers, assignDriver, sendPaymentLink,
  markPaid, updateBookingStatus, updateTripStatus, deleteBooking,
} from "@/services/adminService";
import {
  Search, RefreshCw, Eye, UserCheck, CreditCard,
  CheckCircle, Loader2, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  "", "pending", "confirmed", "assigned",
  "trip_started", "trip_ongoing", "completed", "cancelled",
];
const SERVICE_OPTIONS = ["", "hourly", "daily", "outstation", "monthly", "valet"];

function Badge({ status }: { status: string }) {
  const m: Record<string, { bg: string; text: string; dot: string }> = {
    pending:      { bg: "bg-[#FDF3E2]", text: "text-[#92650F]", dot: "bg-[#E8A23B]" },
    confirmed:    { bg: "bg-[#EAF4FD]", text: "text-[#1D63A0]", dot: "bg-[#4A9DE0]" },
    assigned:     { bg: "bg-[#F1EDFB]", text: "text-[#6B4FBF]", dot: "bg-[#8B6FE0]" },
    trip_started: { bg: "bg-[#E5F7FA]", text: "text-[#1A7E91]", dot: "bg-[#2BB7C9]" },
    trip_ongoing: { bg: "bg-[#E5F7FA]", text: "text-[#1A7E91]", dot: "bg-[#2BB7C9]" },
    completed:    { bg: "bg-[#E8F5EE]", text: "text-[#1E7A4C]", dot: "bg-[#4CAF7D]" },
    cancelled:    { bg: "bg-[#FCEAEA]", text: "text-[#B23A3A]", dot: "bg-[#D9534F]" },
    paid:         { bg: "bg-[#E8F5EE]", text: "text-[#1E7A4C]", dot: "bg-[#4CAF7D]" },
    link_sent:    { bg: "bg-[#EAF4FD]", text: "text-[#1D63A0]", dot: "bg-[#4A9DE0]" },
  };
  const cfg = m[status] || { bg: "bg-[#F1F4F7]", text: "text-[#5A6B7D]", dot: "bg-[#94A3B3]" };
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize whitespace-nowrap", cfg.bg, cfg.text)}>
      <span className={cn("w-[5px] h-[5px] rounded-full flex-shrink-0", cfg.dot)} />
      {status.replace(/_/g, " ")}
    </span>
  );
}

function BookingModal({ booking, drivers, onClose, onRefresh }: any) {
  const [tab,       setTab]       = useState<"details" | "assign" | "payment" | "trip">("details");
  const [selDriver, setSelDriver] = useState(booking.assigned_driver_id || "");
  const [amount,    setAmount]    = useState("");
  const [payLink,   setPayLink]   = useState("");
  const [fare,      setFare]      = useState("");
  const [loading,   setLoading]   = useState(false);
  const [msg,       setMsg]       = useState("");

  const act = async (fn: () => Promise<any>, successMsg: string) => {
    setLoading(true); setMsg("");
    try {
      await fn();
      setMsg("✓ " + successMsg);
      onRefresh();
    } catch (e: any) {
      setMsg("✕ " + (e.message || "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  const tabs = ["details", "assign", "payment", "trip"] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1E32]/35">
      <div className="bg-white border border-[#E4EBF1] rounded-2xl w-full max-w-2xl
                      max-h-[90vh] overflow-y-auto shadow-xl">

        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E4EBF1]">
          <div>
            <p className="text-[#1A2433] font-bold">
              Booking #{booking.booking_id.slice(0, 8).toUpperCase()}
            </p>
            <p className="text-[#5A6B7D] text-xs mt-0.5">
              {booking.full_name} · {booking.phone}
            </p>
          </div>
          <button onClick={onClose} className="text-[#94A3B3] hover:text-[#1A2433] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-1 px-6 pt-4 flex-wrap">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all",
                tab === t
                  ? "bg-[#1D63A0] text-white"
                  : "text-[#5A6B7D] hover:bg-[#EFF6FC] hover:text-[#1A2433]"
              )}>
              {t === "trip" ? "Trip" : t}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-4">

          {tab === "details" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Customer",       booking.full_name],
                  ["Phone",          booking.phone],
                  ["Email",          booking.email],
                  ["Service",        booking.service_type],
                  ["Vehicle type",   booking.vehicle_type?.toUpperCase()],
                  ["Vehicle number", booking.vehicle_number || "Not provided"],
                  ["Date",           booking.pickup_date],
                  ["Time",           booking.pickup_time],
                  ["Status",         booking.status?.replace(/_/g, " ")],
                  ["Trip status",    booking.trip_status?.replace(/_/g, " ") || "—"],
                  ["Payment",        booking.payment_status || "pending"],
                  ["Fare",           booking.fare_amount ? "₹" + booking.fare_amount : "—"],
                ].map(([k, v]) => (
                  <div key={k} className="bg-[#F7FAFC] border border-[#E4EBF1] rounded-lg px-3 py-2.5">
                    <p className="text-[#94A3B3] text-[10px] font-semibold uppercase tracking-wide">{k}</p>
                    <p className="text-[#1A2433] text-sm mt-0.5 capitalize">{v}</p>
                  </div>
                ))}
              </div>

              <div className="bg-[#F7FAFC] border border-[#E4EBF1] rounded-lg px-3 py-2.5">
                <p className="text-[#94A3B3] text-[10px] font-semibold uppercase tracking-wide">Pickup</p>
                <p className="text-[#1A2433] text-sm mt-0.5">{booking.pickup_city}</p>
              </div>
              {booking.drop_location && (
                <div className="bg-[#F7FAFC] border border-[#E4EBF1] rounded-lg px-3 py-2.5">
                  <p className="text-[#94A3B3] text-[10px] font-semibold uppercase tracking-wide">Drop</p>
                  <p className="text-[#1A2433] text-sm mt-0.5">{booking.drop_location}</p>
                </div>
              )}

              {booking.feedback_rating && (
                <div className="bg-[#FDF3E2] border border-[#F5DDB0] rounded-lg px-3 py-2.5">
                  <p className="text-[#92650F] text-[10px] font-semibold uppercase tracking-wide">
                    Customer rating
                  </p>
                  <p className="text-[#1A2433] text-sm mt-0.5">
                    {"★".repeat(booking.feedback_rating)} {booking.feedback_rating}/5
                    {booking.feedback_comment && (
                      <span className="text-[#5A6B7D] ml-2">— {booking.feedback_comment}</span>
                    )}
                  </p>
                </div>
              )}

              {booking.driver_name && (
                <div className="bg-[#F1EDFB] border border-[#DCD3F5] rounded-lg px-3 py-2.5">
                  <p className="text-[#6B4FBF] text-[10px] font-semibold uppercase tracking-wide">
                    Assigned driver
                  </p>
                  <p className="text-[#1A2433] text-sm mt-0.5">
                    {booking.driver_name} · {booking.driver_phone}
                    {booking.driver_area && <span className="text-[#5A6B7D]"> · {booking.driver_area}</span>}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                {["completed", "cancelled"].map((s) => (
                  <button key={s}
                    onClick={() => act(() => updateBookingStatus(booking.booking_id, s), `Status → ${s}`)}
                    disabled={loading || booking.status === s}
                    className={cn(
                      "px-4 py-2 rounded-lg text-xs font-bold border transition-all disabled:opacity-40",
                      s === "completed"
                        ? "border-[#B9E0C9] text-[#1E7A4C] hover:bg-[#E8F5EE]"
                        : "border-[#F0C9C9] text-[#B23A3A] hover:bg-[#FCEAEA]"
                    )}>
                    Mark {s}
                  </button>
                ))}
                <button onClick={() => act(() => deleteBooking(booking.booking_id), "Booking deleted")}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg text-xs font-bold border border-[#F0C9C9]
                             text-[#B23A3A] hover:bg-[#FCEAEA] transition-all disabled:opacity-40 ml-auto">
                  Delete
                </button>
              </div>
            </div>
          )}

          {tab === "assign" && (
            <div className="space-y-3">
              <p className="text-[#5A6B7D] text-sm">
                Select a driver — WhatsApp alerts go to both driver and customer.
              </p>
              <select
                value={selDriver}
                onChange={(e) => setSelDriver(e.target.value)}
                className="w-full h-11 rounded-lg bg-white border border-[#D3DEE8] text-[#1A2433]
                           text-sm px-3 focus:outline-none focus:ring-1 focus:ring-[#4A9DE0] focus:border-[#4A9DE0]"
              >
                <option value="">Select driver…</option>
                {drivers.filter((d: any) => d.active).map((d: any) => (
                  <option key={d.driver_id} value={d.driver_id}>
                    {d.name} · {d.area} · ⭐{d.rating}
                  </option>
                ))}
              </select>
              <button
                onClick={() => act(
                  () => assignDriver(booking.booking_id, selDriver),
                  "Driver assigned & notified via WhatsApp!"
                )}
                disabled={loading || !selDriver}
                className="w-full h-11 rounded-lg bg-[#1D63A0] text-white font-bold text-sm
                           hover:bg-[#15517F] transition-all disabled:opacity-50
                           flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                Assign & notify via WhatsApp
              </button>
            </div>
          )}

          {tab === "payment" && (
            <div className="space-y-3">
              <p className="text-[#5A6B7D] text-sm">
                Enter amount and payment link — sent to customer via WhatsApp.
              </p>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount (₹)"
                className="w-full h-11 rounded-lg bg-white border border-[#D3DEE8] text-[#1A2433]
                           text-sm px-3 placeholder:text-[#94A3B3]
                           focus:outline-none focus:ring-1 focus:ring-[#4A9DE0] focus:border-[#4A9DE0]"
              />
              <input
                type="url"
                value={payLink}
                onChange={(e) => setPayLink(e.target.value)}
                placeholder="Payment link (https://razorpay.com/…)"
                className="w-full h-11 rounded-lg bg-white border border-[#D3DEE8] text-[#1A2433]
                           text-sm px-3 placeholder:text-[#94A3B3]
                           focus:outline-none focus:ring-1 focus:ring-[#4A9DE0] focus:border-[#4A9DE0]"
              />
              <button
                onClick={() => act(
                  () => sendPaymentLink(booking.booking_id, Number(amount), payLink),
                  "Payment link sent to customer!"
                )}
                disabled={loading || !amount || !payLink}
                className="w-full h-11 rounded-lg bg-[#4A9DE0] text-white font-bold text-sm
                           hover:bg-[#2B7FC4] transition-all disabled:opacity-50
                           flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                Send payment link via WhatsApp
              </button>

              {booking.assigned_driver_id && (
                <button
                  onClick={() => act(
                    () => markPaid(booking.booking_id),
                    "Marked paid! Driver & customer notified!"
                  )}
                  disabled={loading}
                  className="w-full h-11 rounded-lg bg-[#1E7A4C] text-white font-bold text-sm
                             hover:bg-[#176B40] transition-all disabled:opacity-50
                             flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Mark paid & share driver details
                </button>
              )}
            </div>
          )}

          {tab === "trip" && (
            <div className="space-y-3">
              <p className="text-[#5A6B7D] text-sm">
                Manually update trip progress. Normally drivers update this via WhatsApp buttons.
              </p>

              <div className="bg-[#F7FAFC] border border-[#E4EBF1] rounded-lg px-4 py-3 flex items-center justify-between">
                <span className="text-[#94A3B3] text-xs font-semibold uppercase tracking-wide">
                  Current status
                </span>
                <Badge status={booking.trip_status || booking.status} />
              </div>

              <div className="space-y-2">
                {[
                  { stage: "trip_started" as const, label: "Mark trip started", desc: "Driver has left for pickup",
                    color: "bg-[#2B7FC4] hover:bg-[#1D63A0]" },
                  { stage: "trip_ongoing" as const, label: "Mark trip ongoing", desc: "Customer has boarded, en route to drop",
                    color: "bg-[#1A7E91] hover:bg-[#15677A]" },
                  { stage: "trip_completed" as const, label: "Mark trip completed", desc: "Customer dropped, trip done",
                    color: "bg-[#1E7A4C] hover:bg-[#176B40]" },
                ].map(({ stage, label, desc, color }) => (
                  <div key={stage} className="space-y-1">
                    {stage === "trip_completed" && (
                      <input
                        type="number"
                        value={fare}
                        onChange={(e) => setFare(e.target.value)}
                        placeholder="Final fare amount ₹ (optional)"
                        className="w-full h-10 rounded-lg bg-white border border-[#D3DEE8] text-[#1A2433]
                                   text-sm px-3 placeholder:text-[#94A3B3]
                                   focus:outline-none focus:ring-1 focus:ring-[#4A9DE0] focus:border-[#4A9DE0]"
                      />
                    )}
                    <button
                      onClick={() => act(
                        () => updateTripStatus(
                          booking.booking_id, stage,
                          stage === "trip_completed" && fare ? Number(fare) : undefined
                        ),
                        label + " — customer notified!"
                      )}
                      disabled={loading}
                      className={cn(
                        "w-full h-11 rounded-lg text-white font-bold text-sm transition-all",
                        "disabled:opacity-50 flex items-center justify-center gap-2",
                        color
                      )}
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      {label}
                    </button>
                    <p className="text-[#94A3B3] text-xs pl-1">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {msg && (
            <p className={cn(
              "text-sm px-3 py-2 rounded-lg",
              msg.startsWith("✓")
                ? "bg-[#E8F5EE] text-[#1E7A4C] border border-[#B9E0C9]"
                : "bg-[#FCEAEA] text-[#B23A3A] border border-[#F0C9C9]"
            )}>
              {msg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CRMBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [drivers,  setDrivers]  = useState<any[]>([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState<any>(null);

  const [filters, setFilters] = useState({
    search: "", status: "", service: "", date: "", payment: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBookings({ ...filters, page, limit: 20 });
      setBookings(res.data);
      setTotal(res.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    getDrivers({ active: true }).then((d) => setDrivers(d.data)).catch(() => {});
  }, []);

  const setF = (k: string, v: string) => {
    setFilters((p) => ({ ...p, [k]: v }));
    setPage(1);
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#1A2433] text-[22px] font-bold tracking-tight">Bookings</h1>
          <p className="text-[#5A6B7D] text-[13.5px] mt-0.5">{total} total bookings</p>
        </div>
        <button onClick={load}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#D3DEE8]
                     text-[#5A6B7D] hover:text-[#1A2433] hover:bg-[#EFF6FC] transition-all text-sm">
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          Refresh
        </button>
      </div>

      <div className="bg-white border border-[#E4EBF1] rounded-xl p-4 shadow-[0_1px_2px_rgba(16,42,67,0.04),0_1px_8px_rgba(16,42,67,0.04)]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B3]" />
            <input
              value={filters.search}
              onChange={(e) => setF("search", e.target.value)}
              placeholder="Search name, phone, ID, vehicle no…"
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#F7FAFC] border border-[#D3DEE8]
                         text-[#1A2433] text-sm placeholder:text-[#94A3B3]
                         focus:outline-none focus:ring-1 focus:ring-[#4A9DE0] focus:border-[#4A9DE0] focus:bg-white"
            />
          </div>
          {[
            { key: "status",  opts: STATUS_OPTIONS,  ph: "All status"   },
            { key: "service", opts: SERVICE_OPTIONS, ph: "All services" },
          ].map(({ key, opts, ph }) => (
            <select key={key} value={(filters as any)[key]}
              onChange={(e) => setF(key, e.target.value)}
              className="h-10 rounded-lg bg-[#F7FAFC] border border-[#D3DEE8] text-[#1A2433] text-sm px-3
                         focus:outline-none focus:ring-1 focus:ring-[#4A9DE0] focus:border-[#4A9DE0]"
            >
              <option value="">{ph}</option>
              {opts.filter(Boolean).map((o) => (
                <option key={o} value={o} className="capitalize">{o.replace(/_/g, " ")}</option>
              ))}
            </select>
          ))}
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setF("date", e.target.value)}
            className="h-10 rounded-lg bg-[#F7FAFC] border border-[#D3DEE8] text-[#1A2433] text-sm px-3
                       focus:outline-none focus:ring-1 focus:ring-[#4A9DE0] focus:border-[#4A9DE0]"
          />
        </div>
      </div>

      <div className="bg-white border border-[#E4EBF1] rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(16,42,67,0.04),0_1px_8px_rgba(16,42,67,0.04)]">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-[#1D63A0] animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E4EBF1] bg-[#F7FAFC]">
                  {[
                    "Booking ID", "Customer", "Pickup → Drop", "Date/Time",
                    "Vehicle", "Service", "Driver", "Status", "Payment", "Actions",
                  ].map((h) => (
                    <th key={h}
                      className="text-left px-4 py-3 text-[#94A3B3] text-[10.5px] font-bold
                                 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.booking_id}
                    className="border-b border-[#E4EBF1] hover:bg-[#EFF6FC] transition-colors">
                    <td className="px-4 py-3 text-[#1D63A0] font-mono text-xs">
                      {b.booking_id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[#1A2433] font-semibold text-xs">{b.full_name}</p>
                      <p className="text-[#94A3B3] text-[11px]">{b.phone}</p>
                    </td>
                    <td className="px-4 py-3 max-w-[160px]">
                      <p className="text-[#1A2433] text-xs truncate">{b.pickup_city}</p>
                      {b.drop_location && (
                        <p className="text-[#94A3B3] text-[11px] truncate">→ {b.drop_location}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-[#1A2433] text-xs">{b.pickup_date}</p>
                      <p className="text-[#94A3B3] text-[11px]">{b.pickup_time}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[#1A2433] text-xs uppercase font-semibold">{b.vehicle_type}</p>
                      {b.vehicle_number && (
                        <p className="text-[#1D63A0] text-[11px] font-mono font-semibold">{b.vehicle_number}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#5A6B7D] text-xs capitalize">
                      {b.service_type}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {b.driver_name
                        ? <span className="text-[#6B4FBF] font-semibold">{b.driver_name}</span>
                        : <span className="text-[#94A3B3]">Unassigned</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={b.trip_status || b.status} />
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={b.payment_status || "pending"} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(b)}
                        className="w-7 h-7 rounded-lg bg-[#EAF4FD] text-[#1D63A0]
                                   hover:bg-[#1D63A0] hover:text-white transition-all
                                   flex items-center justify-center"
                        title="View / manage"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {!bookings.length && (
                  <tr>
                    <td colSpan={10} className="text-center py-12 text-[#94A3B3] text-sm">
                      No bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#E4EBF1]">
            <p className="text-[#94A3B3] text-xs">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#D3DEE8] text-[#5A6B7D] text-xs
                           hover:bg-[#EFF6FC] disabled:opacity-40 transition-all">
                ← Prev
              </button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#D3DEE8] text-[#5A6B7D] text-xs
                           hover:bg-[#EFF6FC] disabled:opacity-40 transition-all">
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <BookingModal
          booking={selected}
          drivers={drivers}
          onClose={() => setSelected(null)}
          onRefresh={() => { load(); setSelected(null); }}
        />
      )}
    </div>
  );
}