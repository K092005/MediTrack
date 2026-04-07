import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, Edit2, Trash2, X, Check, AlertTriangle, Phone, Mail, Calendar, Droplets } from "lucide-react";
import { useData } from "../../context/DataContext";
import { Patient } from "../../data/mockData";
import { toast } from "sonner";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const AVATAR_COLORS = ["#6366F1", "#0EA5E9", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6", "#EF4444", "#2EC4B6"];

function PatientModal({ patient, doctors, onSave, onClose }: { patient: Partial<Patient> | null; doctors: any[]; onSave: (p: Patient) => void; onClose: () => void }) {
  const [form, setForm] = useState<Partial<Patient>>(patient || {
    name: "", email: "", phone: "", age: 0, gender: "male", bloodGroup: "O+",
    assignedDoctorId: "", lastVisit: "", status: "active", initials: "", avatarColor: AVATAR_COLORS[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEdit = !!patient?.id;

  const set = (field: keyof Patient, value: any) => {
    setForm(p => {
      const updated = { ...p, [field]: value };
      if (field === "name") {
        updated.initials = value.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
      }
      return updated;
    });
    setErrors(p => { const n = { ...p }; delete n[field as string]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name?.trim()) e.name = "Name required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone?.trim()) e.phone = "Phone required";
    if (!form.age || form.age < 1) e.age = "Valid age required";
    return e;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave({
      ...form,
      id: form.id || `pat-${Date.now()}`,
      age: Number(form.age),
      initials: (form.name || "").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase(),
      avatarColor: form.avatarColor || AVATAR_COLORS[0],
    } as Patient);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        className="bg-white rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.15)] w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-[#F1F5F9] sticky top-0 bg-white">
          <h3 className="text-[#0F172A]" style={{ fontSize: "18px", fontWeight: 700 }}>{isEdit ? "Edit Patient" : "Add New Patient"}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#F8FAFC] text-[#94A3B8] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[#334155] mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Full Name *</label>
            <input value={form.name || ""} onChange={e => set("name", e.target.value)}
              className={`w-full px-4 py-3 bg-[#F8FAFC] border rounded-xl text-[#0F172A] outline-none transition-all ${errors.name ? "border-[#EF4444]" : "border-[#E2E8F0] focus:border-[#FF6B6B]"}`}
              style={{ fontSize: "14px" }} placeholder="Full name" />
            {errors.name && <p className="text-[#EF4444] mt-1" style={{ fontSize: "12px" }}>{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#334155] mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Email *</label>
              <input type="email" value={form.email || ""} onChange={e => set("email", e.target.value)}
                className={`w-full px-4 py-3 bg-[#F8FAFC] border rounded-xl text-[#0F172A] outline-none transition-all ${errors.email ? "border-[#EF4444]" : "border-[#E2E8F0] focus:border-[#FF6B6B]"}`}
                style={{ fontSize: "14px" }} placeholder="email@example.com" />
              {errors.email && <p className="text-[#EF4444] mt-1" style={{ fontSize: "12px" }}>{errors.email}</p>}
            </div>
            <div>
              <label className="block text-[#334155] mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Phone *</label>
              <input value={form.phone || ""} onChange={e => set("phone", e.target.value)}
                className={`w-full px-4 py-3 bg-[#F8FAFC] border rounded-xl text-[#0F172A] outline-none transition-all ${errors.phone ? "border-[#EF4444]" : "border-[#E2E8F0] focus:border-[#FF6B6B]"}`}
                style={{ fontSize: "14px" }} placeholder="+1 (555) 000-0000" />
              {errors.phone && <p className="text-[#EF4444] mt-1" style={{ fontSize: "12px" }}>{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#334155] mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Age *</label>
              <input type="number" value={form.age || ""} onChange={e => set("age", e.target.value)} min="1" max="120"
                className={`w-full px-4 py-3 bg-[#F8FAFC] border rounded-xl text-[#0F172A] outline-none transition-all ${errors.age ? "border-[#EF4444]" : "border-[#E2E8F0] focus:border-[#FF6B6B]"}`}
                style={{ fontSize: "14px" }} placeholder="e.g. 35" />
              {errors.age && <p className="text-[#EF4444] mt-1" style={{ fontSize: "12px" }}>{errors.age}</p>}
            </div>
            <div>
              <label className="block text-[#334155] mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Gender</label>
              <div className="flex gap-2">
                {["male", "female"].map(g => (
                  <button key={g} type="button" onClick={() => set("gender", g)}
                    className={`flex-1 py-3 rounded-xl border-2 capitalize transition-all ${form.gender === g ? "border-[#FF6B6B] bg-[#FFF0F0] text-[#FF6B6B]" : "border-[#E2E8F0] text-[#64748B]"}`}
                    style={{ fontSize: "13px", fontWeight: form.gender === g ? 600 : 400 }}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[#334155] mb-2" style={{ fontSize: "13px", fontWeight: 500 }}>Blood Group</label>
            <div className="flex flex-wrap gap-2">
              {BLOOD_GROUPS.map(bg => (
                <button key={bg} type="button" onClick={() => set("bloodGroup", bg)}
                  className={`px-3 py-1.5 rounded-lg border-2 transition-all ${form.bloodGroup === bg ? "border-[#FF6B6B] bg-[#FFF0F0] text-[#FF6B6B]" : "border-[#E2E8F0] text-[#64748B]"}`}
                  style={{ fontSize: "13px", fontWeight: form.bloodGroup === bg ? 600 : 400 }}>
                  {bg}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[#334155] mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Assigned Doctor</label>
            <select value={form.assignedDoctorId || ""} onChange={e => set("assignedDoctorId", e.target.value)}
              className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] outline-none focus:border-[#FF6B6B] transition-all"
              style={{ fontSize: "14px" }}>
              <option value="">Select doctor</option>
              {doctors.filter(d => d.status === "active").map(d => (
                <option key={d.id} value={d.id}>{d.name} - {d.specialization}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[#334155] mb-2" style={{ fontSize: "13px", fontWeight: 500 }}>Avatar Color</label>
            <div className="flex gap-2 flex-wrap">
              {AVATAR_COLORS.map(c => (
                <button key={c} type="button" onClick={() => set("avatarColor", c)}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${form.avatarColor === c ? "border-[#0F172A] scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[#334155] mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Status</label>
            <div className="flex gap-3">
              {["active", "inactive"].map(s => (
                <button key={s} type="button" onClick={() => set("status", s)}
                  className={`px-4 py-2 rounded-xl border-2 capitalize transition-all ${form.status === s
                    ? s === "active" ? "border-[#10B981] bg-[#D1FAE5] text-[#065F46]" : "border-[#EF4444] bg-[#FEE2E2] text-[#991B1B]"
                    : "border-[#E2E8F0] text-[#64748B]"}`}
                  style={{ fontSize: "13px", fontWeight: form.status === s ? 600 : 400 }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 p-6 border-t border-[#F1F5F9]">
          <button onClick={onClose} className="flex-1 py-3 border border-[#E2E8F0] rounded-xl text-[#64748B] hover:bg-[#F8FAFC] transition-all" style={{ fontSize: "14px", fontWeight: 500 }}>Cancel</button>
          <button onClick={handleSave} className="flex-1 py-3 bg-[#FF6B6B] text-white rounded-xl hover:bg-[#EF4444] transition-all flex items-center justify-center gap-2" style={{ fontSize: "14px", fontWeight: 600 }}>
            <Check className="w-4 h-4" /> {isEdit ? "Save Changes" : "Add Patient"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function PatientManagement() {
  const { patients, doctors, addPatient, updatePatient, deletePatient } = useData();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [modal, setModal] = useState<{ open: boolean; patient: Partial<Patient> | null }>({ open: false, patient: null });
  const [deleteId, setDeleteId] = useState<{ open: boolean; id: string; name: string }>({ open: false, id: "", name: "" });

  const filtered = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const handleSave = async (pat: Patient) => {
    try {
      if (pat.id && patients.find(p => p.id === pat.id)) {
        await updatePatient(pat);
        toast.success("Patient updated successfully");
      } else {
        // Provide a default password for admin-created accounts
        const patientData = { ...pat, password: "Meditrack123!" };
        await addPatient(patientData);
        toast.success("Patient added successfully");
      }
      setModal({ open: false, patient: null });
    } catch (e: any) {
      toast.error(e.message || "Failed to save patient");
    }
  };

  const handleDelete = () => {
    deletePatient(deleteId.id);
    toast.success("Patient removed successfully");
    setDeleteId({ open: false, id: "", name: "" });
  };

  const getAssignedDoctor = (doctorId: string) => doctors.find(d => d.id === doctorId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[#0F172A]" style={{ fontSize: "22px", fontWeight: 700 }}>Patient Management</h1>
          <p className="text-[#64748B] mt-0.5" style={{ fontSize: "14px" }}>{patients.filter(p => p.status === "active").length} active patients</p>
        </div>
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setModal({ open: true, patient: null })}
          className="flex items-center gap-2 px-5 py-3 bg-[#FF6B6B] text-white rounded-xl hover:bg-[#EF4444] transition-all shadow-[0_4px_16px_rgba(255,107,107,0.3)]"
          style={{ fontSize: "14px", fontWeight: 600 }}
        >
          <Plus className="w-4 h-4" /> Add Patient
        </motion.button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#FF6B6B] transition-all"
            style={{ fontSize: "14px" }} />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "inactive"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl border capitalize transition-all ${filter === f ? "bg-[#FF6B6B] text-white border-[#FF6B6B]" : "bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#FF6B6B]"}`}
              style={{ fontSize: "13px", fontWeight: filter === f ? 600 : 400 }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#F1F5F9] p-16 text-center">
          <div className="w-16 h-16 bg-[#F1F5F9] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7 text-[#94A3B8]" />
          </div>
          <p className="text-[#64748B]" style={{ fontSize: "16px", fontWeight: 500 }}>No patients found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((pat, idx) => {
            const assignedDoc = getAssignedDoctor(pat.assignedDoctorId);
            return (
              <motion.div
                key={pat.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                whileHover={{ y: -3, boxShadow: "0 10px 28px rgba(0,0,0,0.09)" }}
                className="bg-white rounded-2xl border border-[#F1F5F9] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
              >
                {/* Avatar & Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${pat.avatarColor}20` }}>
                    <span style={{ fontSize: "16px", fontWeight: 700, color: pat.avatarColor }}>{pat.initials}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${pat.status === "active" ? "bg-[#D1FAE5] text-[#065F46]" : "bg-[#F1F5F9] text-[#64748B]"}`} style={{ fontWeight: 600 }}>
                    {pat.status}
                  </span>
                </div>

                <p className="text-[#0F172A] mb-0.5" style={{ fontSize: "15px", fontWeight: 600 }}>{pat.name}</p>
                <p className="text-[#94A3B8] mb-4" style={{ fontSize: "12px" }}>{pat.age} yrs · {pat.gender}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#94A3B8] flex-shrink-0" />
                    <span className="text-[#64748B] truncate" style={{ fontSize: "12px" }}>{pat.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#94A3B8] flex-shrink-0" />
                    <span className="text-[#64748B]" style={{ fontSize: "12px" }}>{pat.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="w-3.5 h-3.5 text-[#EF4444] flex-shrink-0" />
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#EF4444" }}>{pat.bloodGroup}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#94A3B8] flex-shrink-0" />
                    <span className="text-[#64748B]" style={{ fontSize: "12px" }}>Last: {pat.lastVisit}</span>
                  </div>
                </div>

                {assignedDoc && (
                  <div className="flex items-center gap-2 p-2.5 bg-[#F8FAFC] rounded-xl mb-4">
                    <img src={assignedDoc.avatar} alt={assignedDoc.name} className="w-6 h-6 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <p className="text-[#334155] truncate" style={{ fontSize: "11px", fontWeight: 600 }}>{assignedDoc.name}</p>
                      <p className="text-[#94A3B8]" style={{ fontSize: "10px" }}>{assignedDoc.specialization}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button onClick={() => setModal({ open: true, patient: pat as any })}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[#E2E8F0] text-[#64748B] hover:bg-[#FFF0F0] hover:text-[#FF6B6B] hover:border-[#FF6B6B] transition-all"
                    style={{ fontSize: "12px", fontWeight: 500 }}>
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => setDeleteId({ open: true, id: pat.id, name: pat.name })}
                    className="flex items-center justify-center px-3 py-2 rounded-xl border border-[#E2E8F0] text-[#94A3B8] hover:bg-[#FEE2E2] hover:text-[#EF4444] hover:border-[#EF4444] transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {modal.open && (
          <PatientModal
            patient={modal.patient}
            doctors={doctors}
            onSave={handleSave}
            onClose={() => setModal({ open: false, patient: null })}
          />
        )}
        {deleteId.open && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="bg-white rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.15)] w-full max-w-sm p-6">
              <div className="w-12 h-12 bg-[#FEE2E2] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-[#EF4444]" />
              </div>
              <h4 className="text-[#0F172A] text-center mb-2" style={{ fontSize: "18px", fontWeight: 700 }}>Remove Patient?</h4>
              <p className="text-[#64748B] text-center mb-6" style={{ fontSize: "14px" }}>
                Remove <strong className="text-[#334155]">{deleteId.name}</strong>? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId({ open: false, id: "", name: "" })} className="flex-1 py-3 border border-[#E2E8F0] rounded-xl text-[#64748B]" style={{ fontSize: "14px" }}>Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-3 bg-[#EF4444] text-white rounded-xl" style={{ fontSize: "14px", fontWeight: 600 }}>Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
