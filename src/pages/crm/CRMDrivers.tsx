
import { useEffect, useState, useCallback } from "react";
import { getDrivers, createDriver, updateDriver, deleteDriver } from "@/services/adminService";
import {
  Plus, Search, Pencil, Loader2, X,
  Phone, MapPin, CheckCircle2, XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EMPTY_FORM = { name: "", phone: "", area: "", licence_no: "", notes: "" };

function DriverModal({ driver, onClose, onSave }: any) {
  const isEdit = !!driver?.driver_id;
  const [form,    setForm]    = useState(isEdit ? { ...driver } : EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const setF = (k: string, v: string) => setForm((p: any) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setError("");
    if (!form.name || !form.phone || !form.area) {
      setError("Name, phone, and area are required.");
      return;
    }
    setLoading(true);
    try {
      if (isEdit) await updateDriver(driver.driver_id, form);
      else        await createDriver(form);
      onSave();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1E32]/35">
      <div className="bg-white border border-[#E4EBF1] rounded-2xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E4EBF1]">
          <p className="text-[#1A2433] font-bold">{isEdit ? "Edit driver" : "Add new driver"}</p>
          <button onClick={onClose} className="text-[#94A3B3] hover:text-[#1A2433] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">

          <div className="bg-[#EAF4FD] border border-[#C7E2F8] rounded-lg px-4 py-3">
            <p className="text-[#1D63A0] text-xs leading-relaxed">
              Drivers drive <span className="font-bold">customers' own vehicles</span> —
              no vehicle number needed for the driver record.
            </p>
          </div>

          {[
            { key: "name",       ph: "Full name *"        },
            { key: "phone",      ph: "WhatsApp number *"  },
            { key: "area",       ph: "Base area / zone *" },
            { key: "licence_no", ph: "Licence no. (optional)" },
          ].map(({ key, ph }) => (
            <input key={key}
              value={form[key] || ""}
              onChange={(e) => setF(key, e.target.value)}
              placeholder={ph}
              className="w-full h-11 rounded-lg bg-white border border-[#D3DEE8] text-[#1A2433]
                         text-sm px-3 placeholder:text-[#94A3B3]
                         focus:outline-none focus:ring-1 focus:ring-[#4A9DE0] focus:border-[#4A9DE0]"
            />
          ))}

          <textarea
            value={form.notes || ""}
            onChange={(e) => setF("notes", e.target.value)}
            placeholder="Notes (optional)"
            rows={3}
            className="w-full rounded-lg bg-white border border-[#D3DEE8] text-[#1A2433]
                       text-sm px-3 py-2.5 placeholder:text-[#94A3B3]
                       focus:outline-none focus:ring-1 focus:ring-[#4A9DE0] focus:border-[#4A9DE0] resize-none"
          />

          {isEdit && (
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setF("active", form.active ? "0" : "1")}
                className={cn("w-10 h-6 rounded-full transition-all relative",
                  form.active ? "bg-[#1D63A0]" : "bg-[#D3DEE8]")}
              >
                <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                  form.active ? "left-5" : "left-1")} />
              </div>
              <span className="text-[#5A6B7D] text-sm">Active</span>
            </label>
          )}

          {error && (
            <p className="text-sm text-[#B23A3A] bg-[#FCEAEA] border border-[#F0C9C9] rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button onClick={handleSave} disabled={loading}
            className="w-full h-11 rounded-lg bg-[#1D63A0] text-white font-bold text-sm
                       hover:bg-[#15517F] transition-all disabled:opacity-50
                       flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isEdit ? "Save changes" : "Add driver"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CRMDrivers() {
  const [drivers,     setDrivers]     = useState<any[]>([]);
  const [loading,      setLoading]    = useState(true);
  const [search,       setSearch]     = useState("");
  const [areaFilter,   setAreaFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState<"" | "true" | "false">("");
  const [modal,        setModal]      = useState<any>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { search };
      if (areaFilter)   params.area   = areaFilter;
      if (activeFilter) params.active = activeFilter;
      const res = await getDrivers(params);
      setDrivers(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, areaFilter, activeFilter]);

  useEffect(() => { load(); }, [load]);

  const handleToggle = async (driver: any) => {
    try {
      await updateDriver(driver.driver_id, { active: driver.active ? 0 : 1 });
      load();
    } catch (e) { console.error(e); }
  };

  const areas = Array.from(new Set(drivers.map((d) => d.area).filter(Boolean))).sort();

  const stats = {
    total:  drivers.length,
    active: drivers.filter((d) => d.active).length,
    avgRating: drivers.length
      ? (drivers.reduce((s, d) => s + Number(d.rating || 5), 0) / drivers.length).toFixed(1)
      : "—",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[#1A2433] text-[22px] font-bold tracking-tight">Drivers</h1>
          <p className="text-[#5A6B7D] text-[13.5px] mt-0.5">
            {stats.total} drivers · {stats.active} active · ★ {stats.avgRating} avg rating
          </p>
        </div>
        <button onClick={() => setModal({})}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1D63A0] text-white
                     text-sm font-bold hover:bg-[#15517F] transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Add driver
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B3]" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, ID…"
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-white border border-[#D3DEE8]
                       text-[#1A2433] text-sm placeholder:text-[#94A3B3]
                       focus:outline-none focus:ring-1 focus:ring-[#4A9DE0] focus:border-[#4A9DE0]"
          />
        </div>

        <select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)}
          className="h-10 rounded-lg bg-white border border-[#D3DEE8] text-[#1A2433] text-sm px-3
                     focus:outline-none focus:ring-1 focus:ring-[#4A9DE0] focus:border-[#4A9DE0]">
          <option value="">All areas</option>
          {areas.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>

        <div className="flex gap-1.5">
          {[
            { key: "",      label: "All"      },
            { key: "true",  label: "Active"   },
            { key: "false", label: "Inactive" },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setActiveFilter(key as any)}
              className={cn(
                "px-3.5 py-2 rounded-lg text-xs font-semibold transition-all border",
                activeFilter === key
                  ? "bg-[#1D63A0] text-white border-[#1D63A0]"
                  : "bg-white text-[#5A6B7D] border-[#D3DEE8] hover:bg-[#EFF6FC]"
              )}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-[#1D63A0] animate-spin" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {drivers.map((d) => (
            <div key={d.driver_id}
                 className="bg-white border border-[#E4EBF1] rounded-xl p-5 space-y-3
                            shadow-[0_1px_2px_rgba(16,42,67,0.04),0_1px_8px_rgba(16,42,67,0.04)]">

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#D3E9FB] flex items-center justify-center
                                  text-[#1D63A0] font-bold text-sm flex-shrink-0">
                    {d.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[#1A2433] font-semibold text-sm">{d.name}</p>
                    <p className="text-[#94A3B3] text-[11px]">{d.driver_id}</p>
                  </div>
                </div>
                <div className={cn("flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold",
                  d.active ? "bg-[#E8F5EE] text-[#1E7A4C]" : "bg-[#FCEAEA] text-[#B23A3A]")}>
                  {d.active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {d.active ? "Active" : "Inactive"}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[#5A6B7D] text-xs">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  {d.phone}
                </div>
                <div className="flex items-center gap-2 text-[#5A6B7D] text-xs">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  {d.area}
                </div>
                {d.licence_no && (
                  <div className="flex items-center gap-2 text-[#94A3B3] text-xs">
                    <span className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0 text-[10px]">•</span>
                    Licence: {d.licence_no}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  { label: "Trips",    value: d.total_trips    || 0 },
                  { label: "Bookings", value: d.booking_count  || 0 },
                  { label: "Rating",   value: `${d.rating || 5.0}★` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[#F7FAFC] rounded-lg px-2 py-1.5 text-center">
                    <p className="text-[#1A2433] font-bold text-sm">{value}</p>
                    <p className="text-[#94A3B3] text-[10px]">{label}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <button onClick={() => setModal(d)}
                  className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg
                             bg-[#F7FAFC] text-[#5A6B7D] hover:text-[#1A2433] hover:bg-[#EFF6FC]
                             transition-all text-xs font-medium">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => handleToggle(d)}
                  className={cn("flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg",
                    "transition-all text-xs font-medium",
                    d.active
                      ? "bg-[#FCEAEA] text-[#B23A3A] hover:bg-[#F7D5D5]"
                      : "bg-[#E8F5EE] text-[#1E7A4C] hover:bg-[#D5EEDF]"
                  )}>
                  {d.active ? <><XCircle className="w-3.5 h-3.5" /> Deactivate</>
                            : <><CheckCircle2 className="w-3.5 h-3.5" /> Activate</>}
                </button>
              </div>
            </div>
          ))}

          {!drivers.length && (
            <div className="col-span-3 text-center py-12 text-[#94A3B3] text-sm">
              No drivers found. Add your first driver.
            </div>
          )}
        </div>
      )}

      {modal !== null && (
        <DriverModal
          driver={modal?.driver_id ? modal : null}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); load(); }}
        />
      )}
    </div>
  );
}