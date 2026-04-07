import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, Star, Users, Edit2, Trash2, X, Check, AlertTriangle, Phone, Mail, Briefcase } from "lucide-react";
import { useData } from "../../context/DataContext";
import { Doctor } from "../../data/mockData";
import { toast } from "sonner";

const SPECIALIZATIONS = ["Cardiology", "Neurology", "Orthopedics", "Dermatology", "Pediatrics", "Oncology", "General Medicine", "Psychiatry", "Ophthalmology", "ENT"];

const EMPTY_DOCTOR: Omit<Doctor, "id"> = {
  name: "", specialization: "", email: "", phone: "", rating: 4.5, experience: 0,
  patients: 0, avatar: "", status: "active", availability: ["Mon", "Wed", "Fri"],
};

function DoctorModal({ doctor, onSave, onClose }: { doctor: Partial<Doctor> | null; onSave: (d: Doctor) => void; onClose: () => void }) {
  const [form, setForm] = useState<Partial<Doctor>>(doctor || EMPTY_DOCTOR);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEdit = !!doctor?.id;

  const set = (field: keyof Doctor, value: string | number | string[]) => {
    setForm(p => ({ ...p, [field]: value }));
    setErrors(p => { const n = { ...p }; delete n[field as string]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name?.trim()) e.name = "Name is required";
    if (!form.specialization) e.specialization = "Required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone?.trim()) e.phone = "Phone is required";
    return e;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave({
      ...form,
      id: form.id || `doc-${Date.now()}`,
      rating: form.rating || 4.5,
      experience: Number(form.experience) || 0,
      patients: Number(form.patients) || 0,
      avatar: form.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name || "Doctor")}&background=2F5DFF&color=fff`,
    } as Doctor);
  };

  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.15)] w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-[#F1F5F9] sticky top-0 bg-white z-10">
          <h3 className="text-[#0F172A]" style={{ fontSize: "18px", fontWeight: 700 }}>
            {isEdit ? "Edit Doctor" : "Add New Doctor"}
          </h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#F8FAFC] text-[#94A3B8] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-[#334155] mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Full Name *</label>
            <input value={form.name || ""} onChange={e => set("name", e.target.value)}
              className={`w-full px-4 py-3 bg-[#F8FAFC] border rounded-xl text-[#0F172A] outline-none transition-all ${errors.name ? "border-[#EF4444]" : "border-[#E2E8F0] focus:border-[#2F5DFF]"}`}
              style={{ fontSize: "14px" }} placeholder="Dr. First Last" />
            {errors.name && <p className="text-[#EF4444] mt-1" style={{ fontSize: "12px" }}>{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Specialization */}
            <div>
              <label className="block text-[#334155] mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Specialization *</label>
              <select value={form.specialization || ""} onChange={e => set("specialization", e.target.value)}
                className={`w-full px-4 py-3 bg-[#F8FAFC] border rounded-xl text-[#0F172A] outline-none transition-all ${errors.specialization ? "border-[#EF4444]" : "border-[#E2E8F0] focus:border-[#2F5DFF]"}`}
                style={{ fontSize: "14px" }}>
                <option value="">Select</option>
                {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.specialization && <p className="text-[#EF4444] mt-1" style={{ fontSize: "12px" }}>{errors.specialization}</p>}
            </div>

            {/* Experience */}
            <div>
              <label className="block text-[#334155] mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Experience (yrs)</label>
              <input type="number" value={form.experience || ""} onChange={e => set("experience", e.target.value)}
                className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] outline-none focus:border-[#2F5DFF] transition-all"
                style={{ fontSize: "14px" }} placeholder="e.g. 5" min="0" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[#334155] mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Email *</label>
            <input type="email" value={form.email || ""} onChange={e => set("email", e.target.value)}
              className={`w-full px-4 py-3 bg-[#F8FAFC] border rounded-xl text-[#0F172A] outline-none transition-all ${errors.email ? "border-[#EF4444]" : "border-[#E2E8F0] focus:border-[#2F5DFF]"}`}
              style={{ fontSize: "14px" }} placeholder="doctor@meditrack.com" />
            {errors.email && <p className="text-[#EF4444] mt-1" style={{ fontSize: "12px" }}>{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[#334155] mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Phone *</label>
            <input value={form.phone || ""} onChange={e => set("phone", e.target.value)}
              className={`w-full px-4 py-3 bg-[#F8FAFC] border rounded-xl text-[#0F172A] outline-none transition-all ${errors.phone ? "border-[#EF4444]" : "border-[#E2E8F0] focus:border-[#2F5DFF]"}`}
              style={{ fontSize: "14px" }} placeholder="+1 (555) 000-0000" />
            {errors.phone && <p className="text-[#EF4444] mt-1" style={{ fontSize: "12px" }}>{errors.phone}</p>}
          </div>

          {/* Availability */}
          <div>
            <label className="block text-[#334155] mb-2" style={{ fontSize: "13px", fontWeight: 500 }}>Availability</label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map(day => {
                const active = (form.availability || []).includes(day);
                return (
                  <button key={day} type="button"
                    onClick={() => {
                      const avail = form.availability || [];
                      set("availability", active ? avail.filter(d => d !== day) : [...avail, day]);
                    }}
                    className={`px-3 py-1.5 rounded-lg border transition-all ${active ? "border-[#2F5DFF] bg-[#EEF2FF] text-[#2F5DFF]" : "border-[#E2E8F0] text-[#94A3B8]"}`}
                    style={{ fontSize: "13px", fontWeight: active ? 600 : 400 }}>
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[#334155] mb-2" style={{ fontSize: "13px", fontWeight: 500 }}>Status</label>
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
          <button onClick={onClose} className="flex-1 py-3 border border-[#E2E8F0] rounded-xl text-[#64748B] hover:bg-[#F8FAFC] transition-all" style={{ fontSize: "14px", fontWeight: 500 }}>
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 py-3 bg-[#2F5DFF] text-white rounded-xl hover:bg-[#1E40AF] transition-all flex items-center justify-center gap-2" style={{ fontSize: "14px", fontWeight: 600 }}>
            <Check className="w-4 h-4" /> {isEdit ? "Save Changes" : "Add Doctor"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function DeleteDialog({ name, onConfirm, onClose }: { name: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.15)] w-full max-w-sm p-6"
      >
        <div className="w-12 h-12 bg-[#FEE2E2] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-[#EF4444]" />
        </div>
        <h4 className="text-[#0F172A] text-center mb-2" style={{ fontSize: "18px", fontWeight: 700 }}>Remove Doctor?</h4>
        <p className="text-[#64748B] text-center mb-6" style={{ fontSize: "14px" }}>
          Are you sure you want to remove <strong className="text-[#334155]">{name}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-[#E2E8F0] rounded-xl text-[#64748B] hover:bg-[#F8FAFC] transition-all" style={{ fontSize: "14px", fontWeight: 500 }}>Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-[#EF4444] text-white rounded-xl hover:bg-[#DC2626] transition-all" style={{ fontSize: "14px", fontWeight: 600 }}>Delete</button>
        </div>
      </motion.div>
    </div>
  );
}

export default function DoctorManagement() {
  const { doctors, addDoctor, updateDoctor, deleteDoctor } = useData();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [modal, setModal] = useState<{ open: boolean; doctor: Partial<Doctor> | null }>({ open: false, doctor: null });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; name: string }>({ open: false, id: "", name: "" });

  const filtered = doctors.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || d.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleSave = async (doc: Doctor) => {
    try {
      if (doc.id && doctors.find(d => d.id === doc.id)) {
        await updateDoctor(doc);
        toast.success("Doctor updated successfully");
      } else {
        // Provide a default password for admin-created accounts
        const doctorData = { 
          ...doc, 
          password: "Meditrack123!",
          specialization: doc.specialization || "General"
        };
        await addDoctor(doctorData);
        toast.success("Doctor added successfully");
      }
      setModal({ open: false, doctor: null });
    } catch (e: any) {
      toast.error(e.message || "Failed to save doctor");
    }
  };

  const handleDelete = () => {
    deleteDoctor(deleteDialog.id);
    toast.success("Doctor removed successfully");
    setDeleteDialog({ open: false, id: "", name: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[#0F172A]" style={{ fontSize: "22px", fontWeight: 700 }}>Doctor Management</h1>
          <p className="text-[#64748B] mt-0.5" style={{ fontSize: "14px" }}>{doctors.filter(d => d.status === "active").length} active doctors</p>
        </div>
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setModal({ open: true, doctor: null })}
          className="flex items-center gap-2 px-5 py-3 bg-[#2F5DFF] text-white rounded-xl hover:bg-[#1E40AF] transition-all shadow-[0_4px_16px_rgba(47,93,255,0.3)]"
          style={{ fontSize: "14px", fontWeight: 600 }}
        >
          <Plus className="w-4 h-4" /> Add Doctor
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search by name or specialization..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#2F5DFF] transition-all"
            style={{ fontSize: "14px" }}
          />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "inactive"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl border capitalize transition-all ${filter === f ? "bg-[#2F5DFF] text-white border-[#2F5DFF]" : "bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#2F5DFF]"}`}
              style={{ fontSize: "13px", fontWeight: filter === f ? 600 : 400 }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#F1F5F9] p-16 text-center">
          <div className="w-16 h-16 bg-[#F1F5F9] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7 text-[#94A3B8]" />
          </div>
          <p className="text-[#64748B]" style={{ fontSize: "16px", fontWeight: 500 }}>No doctors found</p>
          <p className="text-[#94A3B8] mt-1" style={{ fontSize: "14px" }}>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc, idx) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.10)" }}
              className="bg-white rounded-2xl border border-[#F1F5F9] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] relative overflow-hidden cursor-pointer"
            >
              {/* Accent top bar */}
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-[#2F5DFF]" />

              <div className="flex items-start justify-between mb-4 pt-1">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#E2E8F0] flex-shrink-0">
                    <img src={doc.avatar} alt={doc.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[#0F172A]" style={{ fontSize: "14px", fontWeight: 600 }}>{doc.name}</p>
                    <p className="text-[#64748B]" style={{ fontSize: "12px" }}>{doc.specialization}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${doc.status === "active" ? "bg-[#D1FAE5] text-[#065F46]" : "bg-[#F1F5F9] text-[#64748B]"}`} style={{ fontWeight: 600 }}>
                  {doc.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-[#F8FAFC] rounded-xl">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-[#F59E0B] mb-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A" }}>{doc.rating}</span>
                  </div>
                  <p className="text-[#94A3B8]" style={{ fontSize: "10px" }}>Rating</p>
                </div>
                <div className="text-center border-x border-[#E2E8F0]">
                  <p className="text-[#0F172A]" style={{ fontSize: "13px", fontWeight: 700 }}>{doc.experience}y</p>
                  <p className="text-[#94A3B8]" style={{ fontSize: "10px" }}>Experience</p>
                </div>
                <div className="text-center">
                  <p className="text-[#0F172A]" style={{ fontSize: "13px", fontWeight: 700 }}>{doc.patients}</p>
                  <p className="text-[#94A3B8]" style={{ fontSize: "10px" }}>Patients</p>
                </div>
              </div>

              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-[#64748B]">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate" style={{ fontSize: "12px" }}>{doc.email}</span>
                </div>
                <div className="flex items-center gap-2 text-[#64748B]">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  <span style={{ fontSize: "12px" }}>{doc.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-[#64748B]">
                  <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
                  <div className="flex flex-wrap gap-1">
                    {doc.availability.slice(0, 4).map(d => (
                      <span key={d} className="text-[10px] px-1.5 py-0.5 bg-[#EEF2FF] text-[#2F5DFF] rounded">{d}</span>
                    ))}
                    {doc.availability.length > 4 && <span className="text-[10px] text-[#94A3B8]">+{doc.availability.length - 4}</span>}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setModal({ open: true, doctor: doc })}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[#E2E8F0] text-[#64748B] hover:bg-[#EEF2FF] hover:text-[#2F5DFF] hover:border-[#2F5DFF] transition-all"
                  style={{ fontSize: "13px", fontWeight: 500 }}
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => setDeleteDialog({ open: true, id: doc.id, name: doc.name })}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-[#E2E8F0] text-[#94A3B8] hover:bg-[#FEE2E2] hover:text-[#EF4444] hover:border-[#EF4444] transition-all"
                  style={{ fontSize: "13px" }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal.open && (
          <DoctorModal
            doctor={modal.doctor}
            onSave={handleSave}
            onClose={() => setModal({ open: false, doctor: null })}
          />
        )}
        {deleteDialog.open && (
          <DeleteDialog
            name={deleteDialog.name}
            onConfirm={handleDelete}
            onClose={() => setDeleteDialog({ open: false, id: "", name: "" })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
