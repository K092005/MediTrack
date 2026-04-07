import React, { useState } from "react";
import { motion } from "motion/react";
import { Calendar, Clock, Search } from "lucide-react";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";

const StatusBadge = ({ status }: { status: "pending" | "completed" | "cancelled" }) => {
  const configs: Record<string, any> = {
    pending:   { bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B", label: "Pending" },
    completed: { bg: "#D1FAE5", text: "#065F46", dot: "#10B981", label: "Completed" },
    cancelled: { bg: "#FEE2E2", text: "#991B1B", dot: "#EF4444", label: "Cancelled" },
  };
  const cfg = configs[status?.toLowerCase()] || configs.pending;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
      style={{ backgroundColor: cfg.bg, fontSize: "12px", fontWeight: 600, color: cfg.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.dot }} />
      {cfg.label}
    </span>
  );
};

export default function AppointmentHistory() {
  const { user } = useAuth();
  const { appointments, doctors } = useData();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "cancelled">("all");

  // Filter by logged-in patient's user_id
  const patientApts = appointments.filter(a => a.patientId === user?.id);

  const filtered = patientApts.filter(a => {
    const matchSearch = a.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || a.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all:       patientApts.length,
    pending:   patientApts.filter(a => a.status === "pending").length,
    completed: patientApts.filter(a => a.status === "completed").length,
    cancelled: patientApts.filter(a => a.status === "cancelled").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[#0F172A]" style={{ fontSize: "22px", fontWeight: 700 }}>Appointment History</h1>
        <p className="text-[#64748B] mt-0.5" style={{ fontSize: "14px" }}>{patientApts.length} total appointments</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "completed", "cancelled"] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2.5 rounded-xl border capitalize transition-all flex items-center gap-2 ${
              filter === s
                ? "bg-[#FF6B6B] text-white border-[#FF6B6B]"
                : "bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#FF6B6B]"
            }`}
            style={{ fontSize: "13px", fontWeight: filter === s ? 600 : 400 }}>
            {s}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === s ? "bg-white/20 text-white" : "bg-[#F1F5F9] text-[#64748B]"}`} style={{ fontWeight: 600 }}>
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search appointments..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#FF6B6B] transition-all"
          style={{ fontSize: "14px" }} />
      </div>

      {/* Appointment cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#F1F5F9] p-16 text-center">
          <Calendar className="w-12 h-12 text-[#E2E8F0] mx-auto mb-3" />
          <p className="text-[#64748B]" style={{ fontSize: "16px", fontWeight: 500 }}>No appointments found</p>
          <p className="text-[#94A3B8] mt-1" style={{ fontSize: "14px" }}>Try a different filter or search term</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((apt, idx) => {
            const doc = doctors.find(d => d.id === apt.doctorId);
            return (
              <motion.div key={apt.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
                className="bg-white rounded-2xl border border-[#F1F5F9] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all">
                <div className="flex items-center gap-4">
                  {doc ? (
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#E2E8F0] flex-shrink-0 bg-[#E6FBF9] flex items-center justify-center">
                      {doc.avatar
                        ? <img src={doc.avatar} alt={doc.name} className="w-full h-full object-cover" />
                        : <span className="text-[#2EC4B6] font-bold">{doc.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</span>}
                    </div>
                  ) : (
                    <div className="w-14 h-14 bg-[#EEF2FF] rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-[#2F5DFF]" style={{ fontSize: "16px", fontWeight: 700 }}>
                        {apt.doctorName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className="text-[#0F172A]" style={{ fontSize: "15px", fontWeight: 600 }}>{apt.doctorName}</p>
                        {doc && <p className="text-[#64748B]" style={{ fontSize: "12px" }}>{doc.specialization}</p>}
                        <p className="text-[#94A3B8] mt-1" style={{ fontSize: "13px" }}>{apt.type}</p>
                      </div>
                      <StatusBadge status={apt.status} />
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5 text-[#64748B]">
                        <Calendar className="w-3.5 h-3.5" />
                        <span style={{ fontSize: "13px" }}>{apt.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#64748B]">
                        <Clock className="w-3.5 h-3.5" />
                        <span style={{ fontSize: "13px" }}>{apt.time}</span>
                      </div>
                    </div>
                    {apt.notes && (
                      <div className="mt-3 p-3 bg-[#F8FAFC] rounded-xl">
                        <p className="text-[#64748B]" style={{ fontSize: "12px" }}>
                          <span style={{ fontWeight: 600, color: "#334155" }}>Notes: </span>
                          {apt.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
