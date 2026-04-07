import React from "react";
import { motion } from "motion/react";
import { Calendar, Clock, FileText, CheckCircle, Plus, ArrowRight, Pill } from "lucide-react";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router";

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

export default function PatientDashboard() {
  const { user } = useAuth();
  const { appointments, prescriptions, doctors } = useData();

  // Filter by the logged-in patient's user_id
  const patientApts   = appointments.filter(a => a.patientId === user?.id);
  const upcomingApts  = patientApts.filter(a => a.status === "pending");
  const completedApts = patientApts.filter(a => a.status === "completed");
  const patientRx     = prescriptions.filter(p => p.patientId === user?.id);

  const nextApt    = upcomingApts[0];
  const nextDoctor = nextApt ? doctors.find(d => d.id === nextApt.doctorId) : null;

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-[#FF6B6B] to-[#E64F4F] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/10" />
        <div className="absolute -right-4 bottom-0 w-24 h-24 rounded-full bg-white/10" />
        <div className="relative z-10">
          <h1 className="text-white mb-1" style={{ fontSize: "22px", fontWeight: 700 }}>
            Hello, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-white/80" style={{ fontSize: "14px" }}>Your health is our priority. Stay on top of your appointments.</p>
          <Link
            to="/patient/book"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-white text-[#FF6B6B] rounded-xl hover:bg-white/90 transition-all"
            style={{ fontSize: "13px", fontWeight: 700 }}
          >
            <Plus className="w-4 h-4" /> Book Appointment
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Upcoming",      value: upcomingApts.length,  icon: Calendar,     color: "#FF6B6B", bg: "#FFF0F0" },
          { label: "Completed",     value: completedApts.length, icon: CheckCircle,  color: "#10B981", bg: "#D1FAE5" },
          { label: "Prescriptions", value: patientRx.length,     icon: Pill,         color: "#8B5CF6", bg: "#F3F0FF" },
        ].map(stat => (
          <motion.div key={stat.label} whileHover={{ y: -2 }}
            className="bg-white rounded-2xl border border-[#F1F5F9] p-5 flex items-center gap-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: stat.bg }}>
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-[#0F172A]" style={{ fontSize: "22px", fontWeight: 700 }}>{stat.value}</p>
              <p className="text-[#64748B]" style={{ fontSize: "12px" }}>{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Next appointment highlight */}
      {nextApt && nextDoctor && (
        <div className="bg-white rounded-2xl border border-[#F1F5F9] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#0F172A]" style={{ fontWeight: 600 }}>Next Appointment</h3>
            <span className="bg-[#FFF0F0] text-[#FF6B6B] px-3 py-1 rounded-full" style={{ fontSize: "12px", fontWeight: 600 }}>Coming up</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#E2E8F0] flex-shrink-0 bg-[#E6FBF9] flex items-center justify-center">
              {nextDoctor.avatar
                ? <img src={nextDoctor.avatar} alt={nextDoctor.name} className="w-full h-full object-cover" />
                : <span className="text-[#2EC4B6] font-bold">{nextDoctor.name.split(" ").map(n => n[0]).join("").slice(0,2)}</span>}
            </div>
            <div className="flex-1">
              <p className="text-[#0F172A]" style={{ fontSize: "16px", fontWeight: 600 }}>{nextDoctor.name}</p>
              <p className="text-[#64748B]" style={{ fontSize: "13px" }}>{nextDoctor.specialization}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-[#64748B]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span style={{ fontSize: "13px" }}>{nextApt.date}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#64748B]">
                  <Clock className="w-3.5 h-3.5" />
                  <span style={{ fontSize: "13px" }}>{nextApt.time}</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <span className="bg-[#FEF3C7] text-[#92400E] px-2.5 py-1.5 rounded-xl" style={{ fontSize: "12px", fontWeight: 600 }}>
                {nextApt.type}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Two column: appointments + prescriptions */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Appointments */}
        <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="p-5 border-b border-[#F8FAFC] flex items-center justify-between">
            <h3 className="text-[#0F172A]" style={{ fontWeight: 600 }}>My Appointments</h3>
            <Link to="/patient/history" className="flex items-center gap-1 text-[#FF6B6B]" style={{ fontSize: "13px", fontWeight: 500 }}>
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-[#F8FAFC]">
            {patientApts.length === 0 ? (
              <div className="p-8 text-center">
                <Calendar className="w-10 h-10 text-[#E2E8F0] mx-auto mb-2" />
                <p className="text-[#94A3B8]" style={{ fontSize: "14px" }}>No appointments yet</p>
                <Link to="/patient/book" className="text-[#FF6B6B] mt-1 inline-block" style={{ fontSize: "13px", fontWeight: 500 }}>Book your first appointment →</Link>
              </div>
            ) : (
              patientApts.slice(0, 4).map(apt => {
                const doc = doctors.find(d => d.id === apt.doctorId);
                return (
                  <motion.div key={apt.id} whileHover={{ backgroundColor: "#FFF8F8" }} className="flex items-center gap-3 px-5 py-3.5 transition-colors">
                    <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#E2E8F0] flex-shrink-0 bg-[#E6FBF9] flex items-center justify-center">
                      {doc?.avatar
                        ? <img src={doc.avatar} alt={doc.name} className="w-full h-full object-cover" />
                        : <span className="text-[#2EC4B6] text-xs font-bold">{apt.doctorName.split(" ").map(n=>n[0]).join("").slice(0,2)}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#0F172A] truncate" style={{ fontSize: "13px", fontWeight: 500 }}>{apt.doctorName}</p>
                      <p className="text-[#94A3B8]" style={{ fontSize: "11px" }}>{apt.date} · {apt.time}</p>
                    </div>
                    <StatusBadge status={apt.status} />
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Prescriptions */}
        <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="p-5 border-b border-[#F8FAFC] flex items-center justify-between">
            <h3 className="text-[#0F172A]" style={{ fontWeight: 600 }}>Recent Prescriptions</h3>
            <Link to="/patient/prescriptions" className="flex items-center gap-1 text-[#8B5CF6]" style={{ fontSize: "13px", fontWeight: 500 }}>
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-[#F8FAFC]">
            {patientRx.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="w-10 h-10 text-[#E2E8F0] mx-auto mb-2" />
                <p className="text-[#94A3B8]" style={{ fontSize: "14px" }}>No prescriptions yet</p>
              </div>
            ) : (
              patientRx.slice(0, 4).map(rx => (
                <motion.div key={rx.id} whileHover={{ backgroundColor: "#FAF8FF" }} className="flex items-center gap-3 px-5 py-3.5 transition-colors">
                  <div className="w-9 h-9 bg-[#F3F0FF] rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-[#8B5CF6]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#0F172A] truncate" style={{ fontSize: "13px", fontWeight: 500 }}>{rx.diagnosis}</p>
                    <p className="text-[#94A3B8]" style={{ fontSize: "11px" }}>{rx.doctorName} · {rx.date}</p>
                  </div>
                  <a
                    href={`http://localhost:5000/uploads/${rx.fileName}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#8B5CF6] hover:text-[#7C3AED] transition-colors"
                    style={{ fontSize: "12px", fontWeight: 500 }}
                  >
                    Download
                  </a>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Book Appointment", to: "/patient/book",          icon: Plus,      color: "#FF6B6B", bg: "#FFF0F0" },
          { label: "View History",     to: "/patient/history",       icon: Calendar,  color: "#2F5DFF", bg: "#EEF2FF" },
          { label: "Prescriptions",    to: "/patient/prescriptions", icon: Pill,      color: "#8B5CF6", bg: "#F3F0FF" },
          { label: "Find Doctors",     to: "/patient/book",          icon: FileText,  color: "#2EC4B6", bg: "#E6FBF9" },
        ].map(action => (
          <Link key={action.label} to={action.to} title={action.label}>
            <motion.div whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.09)" }}
              className="bg-white rounded-2xl border border-[#F1F5F9] p-4 flex flex-col items-center gap-2 text-center cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all"
              role="presentation">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: action.bg }}>
                <action.icon className="w-5 h-5" style={{ color: action.color }} aria-hidden="true" />
              </div>
              <p className="text-[#334155]" style={{ fontSize: "13px", fontWeight: 500 }}>{action.label}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
