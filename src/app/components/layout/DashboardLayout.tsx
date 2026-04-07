import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, Users, Stethoscope, Calendar, FileText,
  ChevronLeft, ChevronRight, Bell, Search, LogOut, Menu,
  ClipboardList, BookOpen, History, Pill, Settings, ChevronDown,
} from "lucide-react";
import { useAuth, UserRole } from "../../context/AuthContext";
import { toast } from "sonner";

const NAV_ITEMS: Record<UserRole, Array<{ label: string; icon: React.ElementType; to: string }>> = {
  admin: [
    { label: "Overview", icon: LayoutDashboard, to: "/admin" },
    { label: "Doctors", icon: Stethoscope, to: "/admin/doctors" },
    { label: "Patients", icon: Users, to: "/admin/patients" },
    { label: "Appointments", icon: Calendar, to: "/admin/appointments" },
  ],
  doctor: [
    { label: "Dashboard", icon: LayoutDashboard, to: "/doctor" },
    { label: "My Appointments", icon: ClipboardList, to: "/doctor/appointments" },
    { label: "Prescriptions", icon: FileText, to: "/doctor/prescriptions" },
  ],
  patient: [
    { label: "Dashboard", icon: LayoutDashboard, to: "/patient" },
    { label: "Book Appointment", icon: BookOpen, to: "/patient/book" },
    { label: "My History", icon: History, to: "/patient/history" },
    { label: "Prescriptions", icon: Pill, to: "/patient/prescriptions" },
  ],
};

const ROLE_COLORS: Record<UserRole, { bg: string; text: string; badge: string }> = {
  admin: { bg: "bg-[#2F5DFF]", text: "text-[#2F5DFF]", badge: "bg-[#EEF2FF] text-[#2F5DFF]" },
  doctor: { bg: "bg-[#2EC4B6]", text: "text-[#2EC4B6]", badge: "bg-[#E6FBF9] text-[#2EC4B6]" },
  patient: { bg: "bg-[#FF6B6B]", text: "text-[#FF6B6B]", badge: "bg-[#FFF0F0] text-[#FF6B6B]" },
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  if (!user) return null;

  const navItems = NAV_ITEMS[user.role];
  const colors = ROLE_COLORS[user.role];

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out successfully");
  };

  const notifications = [
    { id: 1, message: "New appointment booked by Sarah T.", time: "2m ago", unread: true },
    { id: 2, message: "Dr. Wilson marked appointment completed", time: "15m ago", unread: true },
    { id: 3, message: "Prescription uploaded for Robert G.", time: "1h ago", unread: false },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className={`
          fixed left-0 top-0 h-full bg-white z-50
          shadow-[4px_0_24px_rgba(0,0,0,0.06)]
          flex flex-col
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          transition-transform lg:transition-none
        `}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 px-4 border-b border-[#F1F5F9] ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <div className={`w-8 h-8 rounded-xl ${colors.bg} flex items-center justify-center`}>
                <Stethoscope className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-[#0F172A]" style={{ fontWeight: 700, fontSize: "18px" }}>MediTrack</span>
            </motion.div>
          )}
          {collapsed && (
            <div className={`w-9 h-9 rounded-xl ${colors.bg} flex items-center justify-center`}>
              <Stethoscope className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="mx-auto mt-3 p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Role badge */}
        {!collapsed && (
          <div className="px-4 mt-4">
            <span className={`text-xs px-2.5 py-1 rounded-full ${colors.badge}`} style={{ fontWeight: 600, textTransform: "capitalize" }}>
              {user.role}
            </span>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 px-3 mt-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin" || item.to === "/doctor" || item.to === "/patient"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative
                ${isActive
                  ? `${colors.bg} text-white shadow-[0_4px_12px_rgba(47,93,255,0.25)]`
                  : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : "text-[#94A3B8] group-hover:text-[#64748B]"}`} />
                  {!collapsed && (
                    <span style={{ fontSize: "14px", fontWeight: 500 }}>{item.label}</span>
                  )}
                  {collapsed && (
                    <div className="absolute left-14 bg-[#0F172A] text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg transition-opacity">
                      {item.label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User profile at bottom */}
        <div className="p-3 border-t border-[#F1F5F9]">
          {!collapsed ? (
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer">
              <div className={`w-9 h-9 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                <span className="text-white" style={{ fontSize: "13px", fontWeight: 700 }}>
                  {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#0F172A] truncate" style={{ fontSize: "13px", fontWeight: 600 }}>{user.name}</p>
                <p className="text-[#94A3B8] truncate" style={{ fontSize: "11px" }}>{user.email}</p>
              </div>
              <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-[#FEE2E2] text-[#94A3B8] hover:text-[#EF4444] transition-colors" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex justify-center p-2 rounded-xl hover:bg-[#FEE2E2] text-[#94A3B8] hover:text-[#EF4444] transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.aside>

      {/* Main content area */}
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-250"
        style={{ marginLeft: collapsed ? 72 : 260 }}
      >
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-[#F1F5F9] flex items-center px-6 gap-4 sticky top-0 z-30 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          {/* Mobile menu */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] transition-colors"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search patients, doctors, appointments..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#2F5DFF] focus:ring-2 focus:ring-[#2F5DFF]/10 transition-all"
              style={{ fontSize: "14px" }}
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="relative p-2.5 rounded-xl hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6B6B] rounded-full"></span>
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-[#F1F5F9] overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-[#F1F5F9] flex items-center justify-between">
                      <h4 className="text-[#0F172A]" style={{ fontWeight: 600, fontSize: "14px" }}>Notifications</h4>
                      <span className="bg-[#FF6B6B] text-white text-xs px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>2 new</span>
                    </div>
                    <div className="divide-y divide-[#F8FAFC]">
                      {notifications.map(n => (
                        <div key={n.id} className={`p-4 hover:bg-[#F8FAFC] transition-colors cursor-pointer ${n.unread ? "bg-[#EEF2FF]/30" : ""}`}>
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? "bg-[#2F5DFF]" : "bg-[#E2E8F0]"}`} />
                            <div>
                              <p className="text-[#334155]" style={{ fontSize: "13px" }}>{n.message}</p>
                              <p className="text-[#94A3B8] mt-1" style={{ fontSize: "12px" }}>{n.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-[#F1F5F9] text-center">
                      <button className="text-[#2F5DFF] transition-colors hover:text-[#1E40AF]" style={{ fontSize: "13px", fontWeight: 500 }}>
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-xl hover:bg-[#F8FAFC] border border-[#E2E8F0] transition-colors"
              >
                <div className={`w-7 h-7 rounded-lg ${colors.bg} flex items-center justify-center`}>
                  <span className="text-white" style={{ fontSize: "11px", fontWeight: 700 }}>
                    {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <span className="text-[#334155] hidden sm:block" style={{ fontSize: "14px", fontWeight: 500 }}>
                  {user.name.split(" ")[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] hidden sm:block" />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-[#F1F5F9] overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-[#F1F5F9]">
                      <p className="text-[#0F172A]" style={{ fontWeight: 600, fontSize: "14px" }}>{user.name}</p>
                      <p className="text-[#94A3B8]" style={{ fontSize: "12px" }}>{user.email}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${colors.badge}`} style={{ fontWeight: 600, textTransform: "capitalize" }}>
                        {user.role}
                      </span>
                    </div>
                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#F8FAFC] text-[#64748B] transition-colors" style={{ fontSize: "13px" }}>
                        <Settings className="w-4 h-4" /> Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#FEE2E2] text-[#EF4444] transition-colors"
                        style={{ fontSize: "13px" }}
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
