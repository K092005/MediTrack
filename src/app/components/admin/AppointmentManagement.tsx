import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Calendar, Clock, Edit2, Trash2, X, Check, AlertTriangle, Filter, List, LayoutGrid } from "lucide-react";
import { useData } from "../../context/DataContext";
import { Appointment } from "../../data/mockData";
import { toast } from "sonner";

const StatusBadge = ({ status }: { status: Appointment["status"] }) => {
  const configs: Record<string, any> = {
    pending: { bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B", label: "Pending" },
    completed: { bg: "#D1FAE5", text: "#065F46", dot: "#10B981", label: "Completed" },
    cancelled: { bg: "#FEE2E2", text: "#991B1B", dot: "#EF4444", label: "Cancelled" },
  };
  const cfg = configs[status?.toLowerCase()] || configs.pending;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: cfg.bg, fontSize: "12px", fontWeight: 600, color: cfg.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.dot }} />
      {cfg.label}
    </span>
  );
};

function EditModal({ appointment, doctors, patients, onSave, onClose }: {
  appointment: Appointment; doctors: any[]; patients: any[]; onSave: (a: Appointment) => void; onClose: () => void;
}) {
  const [form, setForm] = useState<Appointment>(appointment);

  const set = (field: keyof Appointment, value: string) => setForm(p => ({ ...p, [field]: value }));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        className="bg-white rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.15)] w-full max-w-md"
      >
        <div className="flex items-center justify-between p-6 border-b border-[#F1F5F9]">
          <h3 className="text-[#0F172A]" style={{ fontSize: "18px", fontWeight: 700 }}>Edit Appointment</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#F8FAFC] text-[#94A3B8] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[#334155] mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Patient</label>
            <select value={form.patientId} onChange={e => {
              const p = patients.find((p: any) => p.id === e.target.value);
              if (p) setForm(prev => ({ ...prev, patientId: p.id, patientName: p.name }));
            }}
              className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] outline-none focus:border-[#2F5DFF] transition-all"
              style={{ fontSize: "14px" }}>
              {patients.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[#334155] mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Doctor</label>
            <select value={form.doctorId} onChange={e => {
              const d = doctors.find((d: any) => d.id === e.target.value);
              if (d) setForm(prev => ({ ...prev, doctorId: d.id, doctorName: d.name }));
            }}
              className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] outline-none focus:border-[#2F5DFF] transition-all"
              style={{ fontSize: "14px" }}>
              {doctors.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#334155] mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Date</label>
              <input type="date" value={form.date} onChange={e => set("date", e.target.value)}
                className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] outline-none focus:border-[#2F5DFF] transition-all"
                style={{ fontSize: "14px" }} />
            </div>
            <div>
              <label className="block text-[#334155] mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Time</label>
              <input value={form.time} onChange={e => set("time", e.target.value)}
                className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] outline-none focus:border-[#2F5DFF] transition-all"
                style={{ fontSize: "14px" }} placeholder="09:00 AM" />
            </div>
          </div>
          <div>
            <label className="block text-[#334155] mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Appointment Type</label>
            <input value={form.type} onChange={e => set("type", e.target.value)}
              className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] outline-none focus:border-[#2F5DFF] transition-all"
              style={{ fontSize: "14px" }} placeholder="e.g. General Checkup" />
          </div>
          <div>
            <label className="block text-[#334155] mb-2" style={{ fontSize: "13px", fontWeight: 500 }}>Status</label>
            <div className="flex gap-2">
              {(["pending", "completed", "cancelled"] as const).map(s => (
                <button key={s} type="button" onClick={() => set("status", s)}
                  className={`flex-1 py-2.5 rounded-xl border-2 capitalize transition-all ${form.status === s
                    ? s === "completed" ? "border-[#10B981] bg-[#D1FAE5] text-[#065F46]"
                      : s === "cancelled" ? "border-[#EF4444] bg-[#FEE2E2] text-[#991B1B]"
                        : "border-[#F59E0B] bg-[#FEF3C7] text-[#92400E]"
                    : "border-[#E2E8F0] text-[#64748B]"}`}
                  style={{ fontSize: "12px", fontWeight: form.status === s ? 600 : 400 }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[#334155] mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Notes</label>
            <textarea value={form.notes || ""} onChange={e => set("notes", e.target.value)} rows={3}
              className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] outline-none focus:border-[#2F5DFF] transition-all resize-none"
              style={{ fontSize: "14px" }} placeholder="Consultation notes..." />
          </div>
        </div>
        <div className="flex gap-3 p-6 border-t border-[#F1F5F9]">
          <button onClick={onClose} className="flex-1 py-3 border border-[#E2E8F0] rounded-xl text-[#64748B] hover:bg-[#F8FAFC] transition-all" style={{ fontSize: "14px", fontWeight: 500 }}>Cancel</button>
          <button onClick={() => onSave(form)} className="flex-1 py-3 bg-[#2F5DFF] text-white rounded-xl hover:bg-[#1E40AF] transition-all flex items-center justify-center gap-2" style={{ fontSize: "14px", fontWeight: 600 }}>
            <Check className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AppointmentManagement() {
  const { appointments, doctors, patients, updateAppointment, deleteAppointment } = useData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Appointment["status"]>("all");
  const [editModal, setEditModal] = useState<{ open: boolean; apt: Appointment | null }>({ open: false, apt: null });
  const [deleteId, setDeleteId] = useState<{ open: boolean; id: string }>({ open: false, id: "" });
  const [view, setView] = useState<"list" | "grid">("list");

  const filtered = appointments.filter(a => {
    const matchSearch = a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSave = (apt: Appointment) => {
    updateAppointment(apt);
    toast.success("Appointment updated");
    setEditModal({ open: false, apt: null });
  };

  const handleDelete = () => {
    deleteAppointment(deleteId.id);
    toast.success("Appointment removed");
    setDeleteId({ open: false, id: "" });
  };

  const counts = {
    all: appointments.length,
    pending: appointments.filter(a => a.status === "pending").length,
    completed: appointments.filter(a => a.status === "completed").length,
    cancelled: appointments.filter(a => a.status === "cancelled").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[#0F172A]" style={{ fontSize: "22px", fontWeight: 700 }}>Appointment Management</h1>
        <p className="text-[#64748B] mt-0.5" style={{ fontSize: "14px" }}>{appointments.length} total appointments</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "completed", "cancelled"] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2.5 rounded-xl border capitalize transition-all flex items-center gap-2 ${statusFilter === s
              ? "bg-[#2F5DFF] text-white border-[#2F5DFF]"
              : "bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#2F5DFF]"}`}
            style={{ fontSize: "13px", fontWeight: statusFilter === s ? 600 : 400 }}>
            {s}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusFilter === s ? "bg-white/20 text-white" : "bg-[#F1F5F9] text-[#64748B]"}`}
              style={{ fontWeight: 600 }}>
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      {/* Search & view toggle */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by patient, doctor or type..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#2F5DFF] transition-all"
            style={{ fontSize: "14px" }} />
        </div>
        <div className="flex gap-1 bg-white border border-[#E2E8F0] p-1 rounded-xl">
          <button onClick={() => setView("list")} className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-[#2F5DFF] text-white" : "text-[#94A3B8] hover:text-[#64748B]"}`}>
            <List className="w-4 h-4" />
          </button>
          <button onClick={() => setView("grid")} className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-[#2F5DFF] text-white" : "text-[#94A3B8] hover:text-[#64748B]"}`}>
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#F1F5F9] p-16 text-center">
          <div className="w-16 h-16 bg-[#F1F5F9] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-7 h-7 text-[#94A3B8]" />
          </div>
          <p className="text-[#64748B]" style={{ fontSize: "16px", fontWeight: 500 }}>No appointments found</p>
        </div>
      ) : view === "list" ? (
        <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-[0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="divide-y divide-[#F8FAFC]">
            {filtered.map((apt, idx) => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                whileHover={{ backgroundColor: "#FAFBFF" }}
                className="flex items-center gap-4 px-6 py-4 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#2F5DFF]" style={{ fontSize: "12px", fontWeight: 700 }}>
                    {apt.patientName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <div className="flex-1 min-w-0 grid grid-cols-2 lg:grid-cols-4 gap-2 items-center">
                  <div className="min-w-0">
                    <p className="text-[#0F172A] truncate" style={{ fontSize: "14px", fontWeight: 500 }}>{apt.patientName}</p>
                    <p className="text-[#94A3B8]" style={{ fontSize: "12px" }}>{apt.type}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[#334155] truncate" style={{ fontSize: "13px" }}>{apt.doctorName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-[#64748B]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span style={{ fontSize: "12px" }}>{apt.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#64748B]">
                      <Clock className="w-3.5 h-3.5" />
                      <span style={{ fontSize: "12px" }}>{apt.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <StatusBadge status={apt.status} />
                  </div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => setEditModal({ open: true, apt })}
                    className="p-2 rounded-xl hover:bg-[#EEF2FF] text-[#94A3B8] hover:text-[#2F5DFF] transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteId({ open: true, id: apt.id })}
                    className="p-2 rounded-xl hover:bg-[#FEE2E2] text-[#94A3B8] hover:text-[#EF4444] transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((apt, idx) => (
            <motion.div key={apt.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              whileHover={{ y: -3, boxShadow: "0 10px 28px rgba(0,0,0,0.09)" }}
              className="bg-white rounded-2xl border border-[#F1F5F9] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
                  <span className="text-[#2F5DFF]" style={{ fontSize: "12px", fontWeight: 700 }}>
                    {apt.patientName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <StatusBadge status={apt.status} />
              </div>
              <p className="text-[#0F172A]" style={{ fontSize: "15px", fontWeight: 600 }}>{apt.patientName}</p>
              <p className="text-[#64748B] mb-3" style={{ fontSize: "12px" }}>{apt.type}</p>
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-[#64748B]"><Calendar className="w-3.5 h-3.5" /><span style={{ fontSize: "12px" }}>{apt.date} · {apt.time}</span></div>
                <div className="flex items-center gap-2 text-[#64748B]"><Clock className="w-3.5 h-3.5" /><span style={{ fontSize: "12px" }}>{apt.doctorName}</span></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditModal({ open: true, apt })}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[#E2E8F0] text-[#64748B] hover:bg-[#EEF2FF] hover:text-[#2F5DFF] transition-all"
                  style={{ fontSize: "12px" }}>
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
                <button onClick={() => setDeleteId({ open: true, id: apt.id })}
                  className="p-2 rounded-xl border border-[#E2E8F0] text-[#94A3B8] hover:bg-[#FEE2E2] hover:text-[#EF4444] transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {editModal.open && editModal.apt && (
          <EditModal appointment={editModal.apt} doctors={doctors} patients={patients} onSave={handleSave} onClose={() => setEditModal({ open: false, apt: null })} />
        )}
        {deleteId.open && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="bg-white rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.15)] w-full max-w-sm p-6">
              <div className="w-12 h-12 bg-[#FEE2E2] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-[#EF4444]" />
              </div>
              <h4 className="text-[#0F172A] text-center mb-2" style={{ fontSize: "18px", fontWeight: 700 }}>Remove Appointment?</h4>
              <p className="text-[#64748B] text-center mb-6" style={{ fontSize: "14px" }}>This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId({ open: false, id: "" })} className="flex-1 py-3 border border-[#E2E8F0] rounded-xl text-[#64748B]" style={{ fontSize: "14px" }}>Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-3 bg-[#EF4444] text-white rounded-xl" style={{ fontSize: "14px", fontWeight: 600 }}>Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
