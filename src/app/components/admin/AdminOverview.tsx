import React from "react";
import { motion } from "motion/react";
import { Users, Stethoscope, Calendar, TrendingUp, ArrowUpRight, Clock, CheckCircle, XCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";
import { useData } from "../../context/DataContext";
import { CHART_DATA, MONTHLY_TREND } from "../../data/mockData";
import { useAuth } from "../../context/AuthContext";

const STATUS_COLORS = { pending: "#F59E0B", completed: "#10B981", cancelled: "#EF4444" };
const PIE_COLORS = ["#F59E0B", "#10B981", "#EF4444"];

const KPICard = ({ title, value, change, icon: Icon, color, bg }: {
  title: string; value: string | number; change: string; icon: React.ElementType; color: string; bg: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(0,0,0,0.10)" }}
    transition={{ duration: 0.2 }}
    className="bg-white rounded-2xl p-6 border border-[#F1F5F9] shadow-[0_4px_16px_rgba(0,0,0,0.04)] cursor-pointer"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center`} style={{ backgroundColor: bg }}>
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div className="flex items-center gap-1 text-[#10B981] bg-[#F0FFF4] px-2 py-1 rounded-full">
        <ArrowUpRight className="w-3 h-3" />
        <span style={{ fontSize: "12px", fontWeight: 600 }}>{change}</span>
      </div>
    </div>
    <p className="text-[#0F172A]" style={{ fontSize: "28px", fontWeight: 700 }}>{value}</p>
    <p className="text-[#64748B] mt-1" style={{ fontSize: "14px" }}>{title}</p>
  </motion.div>
);

const StatusBadge = ({ status }: { status: "pending" | "completed" | "cancelled" }) => {
  const configs = {
    pending: { bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B", label: "Pending" },
    completed: { bg: "#D1FAE5", text: "#065F46", dot: "#10B981", label: "Completed" },
    cancelled: { bg: "#FEE2E2", text: "#991B1B", dot: "#EF4444", label: "Cancelled" },
  };
  const c = configs[status?.toLowerCase()] || configs.pending;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: c.bg, fontSize: "12px", fontWeight: 600, color: c.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.dot }} />
      {c.label}
    </span>
  );
};

export default function AdminOverview() {
  const { user } = useAuth();
  const { doctors, patients, appointments } = useData();
  const todayApts = appointments.filter(a => a.date === "2026-03-24");
  const completedCount = appointments.filter(a => a.status === "completed").length;
  const pendingCount = appointments.filter(a => a.status === "pending").length;
  const cancelledCount = appointments.filter(a => a.status === "cancelled").length;

  const pieData = [
    { name: "Pending", value: pendingCount },
    { name: "Completed", value: completedCount },
    { name: "Cancelled", value: cancelledCount },
  ];

  const recentAppointments = appointments.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[#0F172A]" style={{ fontSize: "22px", fontWeight: 700 }}>
            Good morning, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-[#64748B] mt-1" style={{ fontSize: "14px" }}>
            Here's what's happening at your clinic today
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-xl px-4 py-2">
          <Calendar className="w-4 h-4 text-[#2F5DFF]" />
          <span className="text-[#334155]" style={{ fontSize: "14px", fontWeight: 500 }}>
            Tuesday, March 24, 2026
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard title="Total Patients" value={patients.length} change="+12%" icon={Users} color="#2F5DFF" bg="#EEF2FF" />
        <KPICard title="Active Doctors" value={doctors.filter(d => d.status === "active").length} change="+3%" icon={Stethoscope} color="#2EC4B6" bg="#E6FBF9" />
        <KPICard title="Today's Appointments" value={todayApts.length} change="+8%" icon={Calendar} color="#FF6B6B" bg="#FFF0F0" />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Area chart - Appointments trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#F1F5F9] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[#0F172A]" style={{ fontWeight: 600 }}>Appointment Trends</h3>
              <p className="text-[#64748B] mt-0.5" style={{ fontSize: "13px" }}>This week vs completed</p>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#2F5DFF]" /><span className="text-[#64748B]" style={{ fontSize: "13px" }}>Scheduled</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#2EC4B6]" /><span className="text-[#64748B]" style={{ fontSize: "13px" }}>Completed</span></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={CHART_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorApts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2F5DFF" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2F5DFF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2EC4B6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2EC4B6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", fontSize: "13px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
                cursor={{ stroke: "#E2E8F0", strokeWidth: 1 }}
              />
              <Area type="monotone" dataKey="appointments" stroke="#2F5DFF" strokeWidth={2.5} fill="url(#colorApts)" name="Scheduled" />
              <Area type="monotone" dataKey="completed" stroke="#2EC4B6" strokeWidth={2.5} fill="url(#colorComp)" name="Completed" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-2xl border border-[#F1F5F9] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="mb-4">
            <h3 className="text-[#0F172A]" style={{ fontWeight: 600 }}>Status Distribution</h3>
            <p className="text-[#64748B] mt-0.5" style={{ fontSize: "13px" }}>All appointments</p>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} stroke="none" />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", fontSize: "13px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieData.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span className="text-[#64748B]" style={{ fontSize: "13px" }}>{item.name}</span>
                </div>
                <span className="text-[#334155]" style={{ fontSize: "13px", fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly trend + Recent Appointments */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Monthly trend bar */}
        <div className="bg-white rounded-2xl border border-[#F1F5F9] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="mb-4">
            <h3 className="text-[#0F172A]" style={{ fontWeight: 600 }}>Monthly Growth</h3>
            <p className="text-[#64748B] mt-0.5" style={{ fontSize: "13px" }}>Last 7 months</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={MONTHLY_TREND} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", fontSize: "13px" }} />
              <Bar dataKey="value" fill="#2F5DFF" radius={[6, 6, 0, 0]} name="Appointments" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent appointments */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#F1F5F9] shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="p-6 border-b border-[#F8FAFC] flex items-center justify-between">
            <h3 className="text-[#0F172A]" style={{ fontWeight: 600 }}>Recent Appointments</h3>
            <button className="text-[#2F5DFF] hover:text-[#1E40AF] transition-colors" style={{ fontSize: "13px", fontWeight: 500 }}>View all</button>
          </div>
          <div className="divide-y divide-[#F8FAFC]">
            {recentAppointments.map((apt) => (
              <motion.div key={apt.id} whileHover={{ backgroundColor: "#FAFBFF" }} className="flex items-center gap-4 px-6 py-4 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#2F5DFF]" style={{ fontSize: "13px", fontWeight: 700 }}>
                    {apt.patientName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#0F172A] truncate" style={{ fontSize: "14px", fontWeight: 500 }}>{apt.patientName}</p>
                  <p className="text-[#94A3B8] truncate" style={{ fontSize: "12px" }}>{apt.doctorName} · {apt.type}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1.5 text-[#64748B] mb-1">
                    <Clock className="w-3 h-3" />
                    <span style={{ fontSize: "12px" }}>{apt.time}</span>
                  </div>
                  <StatusBadge status={apt.status} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending Today", value: todayApts.filter(a => a.status === "pending").length, icon: Clock, color: "#F59E0B", bg: "#FEF3C7" },
          { label: "Completed Today", value: todayApts.filter(a => a.status === "completed").length, icon: CheckCircle, color: "#10B981", bg: "#D1FAE5" },
          { label: "Cancelled Today", value: todayApts.filter(a => a.status === "cancelled").length, icon: XCircle, color: "#EF4444", bg: "#FEE2E2" },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-[#F1F5F9] p-5 flex items-center gap-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: stat.bg }}>
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-[#0F172A]" style={{ fontSize: "22px", fontWeight: 700 }}>{stat.value}</p>
              <p className="text-[#64748B]" style={{ fontSize: "12px" }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
