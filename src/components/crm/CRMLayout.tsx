// // src/components/crm/CRMLayout.tsx
// import { useState, useEffect } from "react";
// import { NavLink, Outlet, useNavigate } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import {
//   LayoutDashboard, BookOpen, Users, CreditCard,
//   LogOut, Car, Menu, X, ChevronRight, Bell, ClipboardList,
//   Navigation,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { getDashboard } from "@/services/adminService";

// export default function CRMLayout() {
//   const { admin, signOut } = useAuth();
//   const navigate           = useNavigate();
//   const [open, setOpen]    = useState(false);
//   const [activeTrips, setActiveTrips] = useState(0);
//   const [pendingApps, setPendingApps] = useState(0);

//   // Poll dashboard every 30s to keep sidebar badges live
//   useEffect(() => {
//     const fetch = () => {
//       getDashboard()
//         .then((res) => {
//           setActiveTrips(Number(res.data?.stats?.active_trips  || 0));
//           setPendingApps(Number(res.data?.stats?.pending_applications || 0));
//         })
//         .catch(() => {});
//     };
//     fetch();
//     const id = setInterval(fetch, 30_000);
//     return () => clearInterval(id);
//   }, []);

//   const handleSignOut = () => {
//     signOut();
//     navigate("/crm/login");
//   };

//   const navItems = [
//     { to: "/crm/dashboard",           icon: LayoutDashboard, label: "Dashboard"    },
//     {
//       to: "/crm/bookings", icon: BookOpen, label: "Bookings",
//       badge: activeTrips > 0 ? activeTrips : null,
//       badgeColor: "bg-cyan-500",
//       badgeTitle: `${activeTrips} active trip${activeTrips !== 1 ? "s" : ""}`,
//     },
//     { to: "/crm/drivers",             icon: Users,           label: "Drivers"      },
//     {
//       to: "/crm/driver-applications", icon: ClipboardList, label: "Applications",
//       badge: pendingApps > 0 ? pendingApps : null,
//       badgeColor: "bg-yellow-500",
//       badgeTitle: `${pendingApps} pending review`,
//     },
//     { to: "/crm/payments",            icon: CreditCard,      label: "Payments"     },
//   ];

//   const Sidebar = () => (
//     <div className="flex flex-col h-full bg-[#060e1e] border-r border-white/[0.07]">

//       {/* Logo */}
//       <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.07]">
//         <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
//           <Car className="w-4 h-4 text-white" />
//         </div>
//         <div>
//           <p className="text-white font-bold text-sm leading-none">PuneDriver</p>
//           <p className="text-white/30 text-[10px] mt-0.5">CRM Dashboard</p>
//         </div>
//       </div>

//       {/* Active trips indicator strip */}
//       {activeTrips > 0 && (
//         <div className="mx-3 mt-3 px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-400/20
//                         flex items-center gap-2">
//           <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
//           <span className="text-cyan-400 text-xs font-semibold">
//             {activeTrips} trip{activeTrips !== 1 ? "s" : ""} in progress
//           </span>
//           <Navigation className="w-3 h-3 text-cyan-400 ml-auto" />
//         </div>
//       )}

//       {/* Nav */}
//       <nav className="flex-1 px-3 py-4 space-y-1">
//         {navItems.map(({ to, icon: Icon, label, badge, badgeColor, badgeTitle }) => (
//           <NavLink key={to} to={to} onClick={() => setOpen(false)}
//             className={({ isActive }) => cn(
//               "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
//               isActive
//                 ? "bg-accent text-white shadow-md"
//                 : "text-white/50 hover:text-white hover:bg-white/5"
//             )}>
//             <Icon className="w-4 h-4 flex-shrink-0" />
//             <span className="flex-1">{label}</span>
//             {badge !== null && badge !== undefined && (
//               <span
//                 title={badgeTitle}
//                 className={cn(
//                   "text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center",
//                   badgeColor || "bg-accent"
//                 )}
//               >
//                 {badge}
//               </span>
//             )}
//             {!badge && (
//               <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
//             )}
//           </NavLink>
//         ))}
//       </nav>

//       {/* Admin info */}
//       <div className="px-3 py-4 border-t border-white/[0.07]">
//         <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 mb-2">
//           <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center
//                           text-accent text-xs font-bold flex-shrink-0">
//             {admin?.name?.charAt(0).toUpperCase()}
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-white text-xs font-semibold truncate">{admin?.name}</p>
//             <p className="text-white/30 text-[10px] truncate capitalize">{admin?.role}</p>
//           </div>
//         </div>
//         <button onClick={handleSignOut}
//           className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
//                      text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all w-full">
//           <LogOut className="w-4 h-4" /> Sign Out
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="flex h-screen bg-[#080f1d] overflow-hidden">

//       {/* Desktop sidebar */}
//       <aside className="hidden lg:flex flex-col w-60 flex-shrink-0">
//         <Sidebar />
//       </aside>

//       {/* Mobile drawer */}
//       {open && (
//         <div className="lg:hidden fixed inset-0 z-50 flex">
//           <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
//           <aside className="relative w-64 flex flex-col"><Sidebar /></aside>
//         </div>
//       )}

//       {/* Main */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <header className="flex items-center gap-3 px-4 lg:px-6 py-4
//                             border-b border-white/[0.07] bg-[#060e1e] flex-shrink-0">
//           <button className="lg:hidden text-white/50 hover:text-white" onClick={() => setOpen(true)}>
//             <Menu className="w-5 h-5" />
//           </button>
//           <div className="flex-1" />
//           {/* Active trips chip in header on mobile */}
//           {activeTrips > 0 && (
//             <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-400/20">
//               <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
//               <span className="text-cyan-400 text-[11px] font-bold">{activeTrips} live</span>
//             </div>
//           )}
//           <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center
//                              text-white/40 hover:text-white hover:bg-white/10 transition-all
//                              relative">
//             <Bell className="w-4 h-4" />
//             {pendingApps > 0 && (
//               <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-yellow-500
//                                text-[8px] font-bold text-white flex items-center justify-center">
//                 {pendingApps > 9 ? "9+" : pendingApps}
//               </span>
//             )}
//           </button>
//           <div className="flex items-center gap-2">
//             <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center
//                             text-accent text-xs font-bold">
//               {admin?.name?.charAt(0).toUpperCase()}
//             </div>
//             <span className="hidden sm:block text-white/70 text-sm font-medium">{admin?.name}</span>
//           </div>
//         </header>

//         <main className="flex-1 overflow-y-auto p-4 lg:p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }



//tesing (theme chmg)



// src/components/crm/CRMLayout.tsx
// Sky blue + white theme — design tokens documented in src/styles/crm-theme.css
import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, BookOpen, Users, CreditCard,
  LogOut, Car, Menu, Bell, ClipboardList, Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getDashboard } from "@/services/adminService";

export default function CRMLayout() {
  const { admin, signOut } = useAuth();
  const navigate           = useNavigate();
  const [open, setOpen]    = useState(false);
  const [activeTrips, setActiveTrips] = useState(0);
  const [pendingApps, setPendingApps] = useState(0);

  useEffect(() => {
    const fetchCounts = () => {
      getDashboard()
        .then((res) => {
          setActiveTrips(Number(res.data?.stats?.active_trips || 0));
          setPendingApps(Number(res.data?.stats?.pending_applications || 0));
        })
        .catch(() => {});
    };
    fetchCounts();
    const id = setInterval(fetchCounts, 30_000);
    return () => clearInterval(id);
  }, []);

  const handleSignOut = () => {
    signOut();
    navigate("/crm/login");
  };

  const navItems = [
    { to: "/crm/dashboard", icon: LayoutDashboard, label: "Dashboard", badge: null, badgeColor: "" },
    {
      to: "/crm/bookings", icon: BookOpen, label: "Bookings",
      badge: activeTrips > 0 ? activeTrips : null,
      badgeColor: "bg-[#2BB7C9]",
    },
    { to: "/crm/drivers", icon: Users, label: "Drivers", badge: null, badgeColor: "" },
    {
      to: "/crm/driver-applications", icon: ClipboardList, label: "Applications",
      badge: pendingApps > 0 ? pendingApps : null,
      badgeColor: "bg-[#E8A23B]",
    },
    { to: "/crm/payments", icon: CreditCard, label: "Payments", badge: null, badgeColor: "" },
  ];

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-white border-r border-[#E4EBF1]">

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[#E4EBF1]">
        <div className="w-[34px] h-[34px] rounded-[10px] bg-[#1D63A0] flex items-center justify-center flex-shrink-0 text-white font-bold text-[15px]">
          P
        </div>
        <div>
          <p className="font-bold text-[14.5px] leading-tight text-[#1A2433]">PuneDriver</p>
          <p className="text-[11px] mt-0.5 text-[#94A3B3]">CRM Dashboard</p>
        </div>
      </div>

      {/* Live status pill */}
      {activeTrips > 0 && (
        <div className="mx-4 mt-3.5 mb-1 px-3 py-2.5 rounded-lg bg-[#E5F7FA] flex items-center gap-2">
          <span className="w-[7px] h-[7px] rounded-full bg-[#2BB7C9] flex-shrink-0 animate-pulse" />
          <span className="text-xs font-semibold text-[#1A7E91]">
            {activeTrips} trip{activeTrips !== 1 ? "s" : ""} in progress
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, badge, badgeColor }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all",
                isActive
                  ? "bg-[#1D63A0] text-white"
                  : "text-[#5A6B7D] hover:bg-[#EFF6FC] hover:text-[#1A2433]"
              )
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0 opacity-80" />
            <span className="flex-1">{label}</span>
            {badge !== null && (
              <span className={cn(
                "text-[10.5px] font-bold text-white min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1.5",
                badgeColor
              )}>
                {badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Admin footer */}
      <div className="px-4 py-4 border-t border-[#E4EBF1]">
        <div className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg bg-[#EFF6FC] mb-1.5">
          <div className="w-[30px] h-[30px] rounded-lg bg-[#D3E9FB] text-[#1D63A0] flex items-center justify-center font-bold text-[12.5px] flex-shrink-0">
            {admin?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12.5px] font-semibold truncate text-[#1A2433]">{admin?.name}</p>
            <p className="text-[10.5px] truncate capitalize text-[#94A3B3]">{admin?.role}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12.5px] w-full
                     text-[#94A3B3] hover:bg-[#FCEAEA] hover:text-[#B23A3A] transition-all"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7FAFC]">

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[248px] flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-[#0F1E32]/35"
            onClick={() => setOpen(false)}
          />
          <aside className="relative w-64 flex flex-col shadow-[2px_0_16px_rgba(0,0,0,0.08)]">
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center gap-4 px-5 lg:px-7 h-16 flex-shrink-0 bg-white border-b border-[#E4EBF1]">

          <button
            className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-[#5A6B7D] hover:bg-[#EFF6FC] transition-colors"
            onClick={() => setOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="relative max-w-[360px] flex-1 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B3]" />
            <input
              type="text"
              placeholder="Search bookings, drivers, IDs..."
              className="w-full h-9 rounded-lg pl-9 pr-3 text-[13px] outline-none
                         bg-[#F7FAFC] border border-[#D3DEE8] text-[#1A2433]
                         placeholder:text-[#94A3B3]
                         focus:bg-white focus:border-[#4A9DE0] transition-colors"
            />
          </div>

          <div className="flex-1" />

          {activeTrips > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E5F7FA]">
              <span className="w-[7px] h-[7px] rounded-full bg-[#2BB7C9] animate-pulse" />
              <span className="text-[11px] font-bold text-[#1A7E91]">{activeTrips} live</span>
            </div>
          )}

          <button className="w-9 h-9 rounded-lg flex items-center justify-center relative
                              text-[#5A6B7D] hover:bg-[#EFF6FC] transition-colors">
            <Bell className="w-[18px] h-[18px]" />
            {pendingApps > 0 && (
              <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full
                               bg-[#E8A23B] text-[8px] font-bold text-white
                               flex items-center justify-center border-[1.5px] border-white">
                {pendingApps > 9 ? "9+" : pendingApps}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#D3E9FB] text-[#1D63A0]
                            flex items-center justify-center text-xs font-bold">
              {admin?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block text-sm font-medium text-[#1A2433]">
              {admin?.name}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 lg:p-7 bg-[#F7FAFC]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}