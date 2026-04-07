import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, Calendar as CalIcon, Filter, Clock, X, CheckSquare, Settings2, Download, AlertCircle, RefreshCw, CheckCircle } from "lucide-react";
import { useData, Appointment } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { apiUpdateAppointmentStatus, apiGetMedicalHistory } from "../../api";
import { toast } from "sonner";
import { Link } from "react-router";

// Utility functions
function mapStatus(status: string) {
  if (status === "pending") return "Scheduled";
  if (status === "completed") return "Completed";
  return "Cancelled";
}

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

const parseDateOrString = (ds: string) => {
  const t = Date.parse(ds);
  return isNaN(t) ? new Date(0) : new Date(t);
};

export default function DoctorDashboard() {
  const { user } = useAuth();
  const { appointments, patients, refreshAppointments } = useData();

  const [dateFilter, setDateFilter] = useState("today");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [patientHistory, setPatientHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Filter for logged-in doctor
  const myApts = appointments.filter(a => a.doctorId === user?.id);

  const today = new Date();
  today.setHours(0,0,0,0);
  const todayStr = today.toISOString().split("T")[0];

  const filteredApts = myApts.filter(a => {
    let matchDate = true;
    if (dateFilter === "today") matchDate = a.date === todayStr;
    if (dateFilter === "upcoming") {
      const ad = parseDateOrString(a.date);
      matchDate = ad >= today;
    }

    let matchStatus = true;
    if (statusFilter !== "all") matchStatus = a.status === statusFilter;

    return matchDate && matchStatus;
  });

  filteredApts.sort((a,b) => {
    const da = parseDateOrString(a.date).getTime();
    const db = parseDateOrString(b.date).getTime();
    return da - db;
  });

  const nextApts = filteredApts.filter(a => a.status === "pending").slice(0,1);
  const myPatientsNum = new Set(myApts.map(a => a.patientId)).size;
  const todayAptsNum  = myApts.filter(a => a.date === todayStr).length;

  const handleStatusUpdate = async (aptId: string, status: "completed" | "cancelled") => {
    setIsUpdating(true);
    try {
      await apiUpdateAppointmentStatus(aptId, status);
      await refreshAppointments();
      toast.success(`Appointment marked as ${status}`);
      setSelectedApt(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleViewPatient = async (apt: Appointment) => {
    setSelectedApt(apt);
    setLoadingHistory(true);
    try {
      const hist = await apiGetMedicalHistory(apt.patientId);
      setPatientHistory(hist as any[]);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load patient history");
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Stats inline */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3 bg-gradient-to-br from-[#2EC4B6] to-[#209F93] rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-between shadow-[0_8px_32px_rgba(46,196,182,0.2)]">
          <div className="absolute right-0 top-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <h1 className="text-white mb-2" style={{ fontSize: "24px", fontWeight: 700 }}>
              Good morning,<br/>Dr. {user?.name?.split(" ")[0]}
            </h1>
            <p className="text-white/80" style={{ fontSize: "14px" }}>
              You have {todayAptsNum} appointments scheduled for today.
            </p>
          </div>
          <div className="relative z-10 mt-6 pt-6 border-t border-white/20 flex items-center justify-between">
            <div>
              <p className="text-white/70" style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Patients</p>
              <p className="text-white mt-0.5" style={{ fontSize: "28px", fontWeight: 700 }}>{myPatientsNum}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Next Appointment Card */}
        <div className="lg:w-2/3 bg-white rounded-2xl border border-[#F1F5F9] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-[#FFF0F0] flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#FF6B6B]" />
            </div>
            <h2 className="text-[#0F172A]" style={{ fontSize: "16px", fontWeight: 600 }}>Up Next</h2>
          </div>

          {nextApts.length > 0 ? (
            <div className="flex items-center gap-6 bg-[#F8FAFC] rounded-2xl p-5 border border-[#E2E8F0]">
              <div className="w-16 h-16 rounded-full bg-[#E6FBF9] text-[#2EC4B6] flex items-center justify-center border-2 border-white shadow-sm flex-shrink-0">
                <span className="text-xl font-bold">{getInitials(nextApts[0].patientName)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[#0F172A] truncate" style={{ fontSize: "18px", fontWeight: 700 }}>{nextApts[0].patientName}</h3>
                <p className="text-[#64748B] mt-1" style={{ fontSize: "14px" }}>{nextApts[0].type}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="inline-flex items-center gap-1.5 text-[#334155] bg-white px-3 py-1.5 rounded-lg border border-[#E2E8F0]" style={{ fontSize: "13px", fontWeight: 500 }}>
                    <CalIcon className="w-3.5 h-3.5 text-[#94A3B8]" /> {nextApts[0].date}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[#334155] bg-white px-3 py-1.5 rounded-lg border border-[#E2E8F0]" style={{ fontSize: "13px", fontWeight: 500 }}>
                    <Clock className="w-3.5 h-3.5 text-[#94A3B8]" /> {nextApts[0].time}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleViewPatient(nextApts[0])}
                className="hidden sm:flex items-center justify-center bg-[#2EC4B6] text-white px-6 py-3 rounded-xl hover:bg-[#209F93] transition-colors shadow-[0_4px_12px_rgba(46,196,182,0.25)] flex-shrink-0"
                style={{ fontSize: "14px", fontWeight: 600 }}>
                Start Session
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 bg-[#F1F5F9] rounded-full flex items-center justify-center mb-4">
                <CheckSquare className="w-8 h-8 text-[#94A3B8]" />
              </div>
              <p className="text-[#334155]" style={{ fontSize: "16px", fontWeight: 500 }}>All caught up!</p>
              <p className="text-[#64748B]" style={{ fontSize: "14px" }}>No upcoming appointments left for today.</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Schedule */}
      <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-5 border-b border-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F8FAFC]/50">
          <h2 className="text-[#0F172A] flex items-center gap-2" style={{ fontSize: "18px", fontWeight: 700 }}>
            <CalIcon className="w-5 h-5 text-[#2EC4B6]" /> Patient Schedule
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-[#F1F5F9] p-1 rounded-xl">
              {[{ id: "all", label: "All" }, { id: "today", label: "Today" }, { id: "upcoming", label: "Upcoming" }].map(t => (
                <button key={t.id} onClick={() => setDateFilter(t.id)}
                  className={`px-4 py-1.5 rounded-lg transition-all ${dateFilter === t.id ? "bg-white text-[#0F172A] shadow-sm" : "text-[#64748B]"}`}
                  style={{ fontSize: "13px", fontWeight: dateFilter === t.id ? 600 : 500 }}>
                  {t.label}
                </button>
              ))}
            </div>
            <div className="h-6 w-px bg-[#E2E8F0] mx-1 hidden sm:block" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-[#E2E8F0] text-[#334155] rounded-xl px-3 py-1.5 outline-none focus:border-[#2EC4B6]"
              style={{ fontSize: "13px", fontWeight: 500 }}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC]/50 text-[#64748B]" style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                <th className="font-semibold py-4 px-6" style={{ width: "30%" }}>Patient</th>
                <th className="font-semibold py-4 px-6" style={{ width: "20%" }}>Date & Time</th>
                <th className="font-semibold py-4 px-6" style={{ width: "20%" }}>Type</th>
                <th className="font-semibold py-4 px-6" style={{ width: "15%" }}>Status</th>
                <th className="font-semibold py-4 px-6 text-right" style={{ width: "15%" }}>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredApts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#64748B]">
                    <AlertCircle className="w-8 h-8 mx-auto mb-3 text-[#E2E8F0]" />
                    <span style={{ fontSize: "14px" }}>No appointments match your filters.</span>
                  </td>
                </tr>
              ) : (
                filteredApts.map((apt) => {
                  const pat = patients.find(p => p.id === apt.patientId);
                  return (
                    <motion.tr key={apt.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-[#F8FAFC] transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#E6FBF9] text-[#2EC4B6] flex items-center justify-center font-bold flex-shrink-0" style={{ fontSize: "13px" }}>
                            {getInitials(apt.patientName)}
                          </div>
                          <div>
                            <p className="text-[#0F172A]" style={{ fontSize: "14px", fontWeight: 600 }}>{apt.patientName}</p>
                            <p className="text-[#64748B]" style={{ fontSize: "12px" }}>{pat?.gender || "Unknown"} • {pat?.age ? `${pat.age}y` : "N/A"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-[#334155]" style={{ fontSize: "14px", fontWeight: 500 }}>{apt.date}</p>
                        <p className="text-[#64748B]" style={{ fontSize: "12px" }}>{apt.time}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-[#334155]" style={{ fontSize: "13px" }}>{apt.type}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          apt.status === "pending"   ? "bg-[#FEF3C7] text-[#92400E]" :
                          apt.status === "completed" ? "bg-[#D1FAE5] text-[#065F46]" :
                                                       "bg-[#FEE2E2] text-[#991B1B]"
                        }`}>
                          {mapStatus(apt.status)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button onClick={() => handleViewPatient(apt)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-[#E2E8F0] shadow-sm text-[#334155] px-3 py-1.5 rounded-lg hover:border-[#2EC4B6] hover:text-[#2EC4B6]"
                          style={{ fontSize: "12px", fontWeight: 600 }}>
                          Manage
                        </button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appointment Modal */}
      <AnimatePresence>
        {selectedApt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E6FBF9] text-[#2EC4B6] flex items-center justify-center font-bold" style={{ fontSize: "14px" }}>
                    {getInitials(selectedApt.patientName)}
                  </div>
                  <div>
                    <h3 className="text-[#0F172A]" style={{ fontSize: "18px", fontWeight: 700 }}>{selectedApt.patientName}</h3>
                    <p className="text-[#64748B]" style={{ fontSize: "13px" }}>{selectedApt.date} • {selectedApt.time}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedApt(null)} className="p-2 text-[#94A3B8] hover:bg-white rounded-full hover:text-[#0F172A] transition-all bg-transparent">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4">
                    <p className="text-[#64748B] mb-1" style={{ fontSize: "12px", textTransform: "uppercase" }}>Type</p>
                    <p className="text-[#0F172A]" style={{ fontSize: "14px", fontWeight: 600 }}>{selectedApt.type}</p>
                  </div>
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4">
                    <p className="text-[#64748B] mb-1" style={{ fontSize: "12px", textTransform: "uppercase" }}>Status</p>
                    <p className="text-[#0F172A]" style={{ fontSize: "14px", fontWeight: 600 }}>{mapStatus(selectedApt.status)}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-[#0F172A] mb-3 flex items-center gap-2" style={{ fontSize: "15px", fontWeight: 600 }}>
                    <Settings2 className="w-4 h-4 text-[#94A3B8]" /> Patient Medical History
                  </h4>
                  <div className="border border-[#E2E8F0] rounded-2xl p-2 bg-[#F8FAFC]">
                    {loadingHistory ? (
                      <div className="py-6 text-center text-[#94A3B8]"><RefreshCw className="w-5 h-5 animate-spin mx-auto" /></div>
                    ) : patientHistory.length === 0 ? (
                      <div className="py-6 text-center text-[#94A3B8]" style={{ fontSize: "13px" }}>No history records uploaded yet.</div>
                    ) : (
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {patientHistory.map(hist => (
                          <div key={hist.record_id} className="flex items-center justify-between bg-white border border-[#E2E8F0] p-3 rounded-xl">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] text-[#6366F1] flex items-center justify-center flex-shrink-0">
                                <Download className="w-4 h-4" />
                              </div>
                              <div className="truncate">
                                <p className="text-[#0F172A] truncate" style={{ fontSize: "13px", fontWeight: 500 }}>{hist.file_name}</p>
                                <p className="text-[#94A3B8]" style={{ fontSize: "11px" }}>{new Date(hist.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <a href={`http://localhost:5000/uploads/${hist.file_path}`} target="_blank" rel="noreferrer"
                              className="text-[#6366F1] hover:text-[#4F46E5] bg-[#EEF2FF] px-3 py-1.5 rounded-lg flex-shrink-0 transition-colors"
                              style={{ fontSize: "12px", fontWeight: 600 }}>View</a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {selectedApt.status === "pending" && (
                  <div className="bg-[#E6FBF9] border border-[#2EC4B6]/20 rounded-2xl p-5 mb-2">
                    <h4 className="text-[#0F172A] mb-2" style={{ fontSize: "15px", fontWeight: 600 }}>Consultation Actions</h4>
                    <p className="text-[#334155] mb-4" style={{ fontSize: "13px" }}>To prescribe medicine, please visit the Prescriptions tab after marking this appointment as completed.</p>
                    <div className="flex gap-3">
                      <button onClick={() => handleStatusUpdate(selectedApt.id, "completed")} disabled={isUpdating}
                        className="flex-1 bg-[#2EC4B6] hover:bg-[#209F93] text-white py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                        style={{ fontSize: "14px", fontWeight: 600 }}>
                        {isUpdating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckSquare className="w-4 h-4" />} Mark Completed
                      </button>
                      <button onClick={() => handleStatusUpdate(selectedApt.id, "cancelled")} disabled={isUpdating}
                        className="flex-1 bg-white border border-[#E2E8F0] hover:bg-[#FEE2E2] hover:text-[#EF4444] hover:border-[#FCA5A5] text-[#64748B] py-2.5 rounded-xl transition-all disabled:opacity-50"
                        style={{ fontSize: "14px", fontWeight: 600 }}>
                        Cancel Appointment
                      </button>
                    </div>
                  </div>
                )}

                {selectedApt.status === "completed" && (
                  <div className="bg-[#F0FFF4] border border-[#86EFAC] rounded-2xl p-5 mb-2 mt-4 flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-[#16A34A] mt-0.5" />
                    <div>
                      <h4 className="text-[#15803D]" style={{ fontSize: "15px", fontWeight: 600 }}>Consultation Completed</h4>
                      <p className="text-[#16A34A]/80 mt-1 mb-3" style={{ fontSize: "13px" }}>You have marked this session as complete.</p>
                      <Link to="/doctor/prescriptions" className="inline-block bg-[#16A34A] text-white px-4 py-2 rounded-xl" style={{ fontSize: "13px", fontWeight: 600 }}>
                        Write Prescription &rarr;
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}