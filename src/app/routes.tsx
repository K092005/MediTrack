import React from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { useAuth } from "./context/AuthContext";
import DashboardLayout from "./components/layout/DashboardLayout";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import ForgotPasswordPage from "./components/auth/ForgotPasswordPage";
import AdminOverview from "./components/admin/AdminOverview";
import DoctorManagement from "./components/admin/DoctorManagement";
import PatientManagement from "./components/admin/PatientManagement";
import AppointmentManagement from "./components/admin/AppointmentManagement";
import DoctorDashboard from "./components/doctor/DoctorDashboard";
import DoctorPrescriptions from "./components/doctor/DoctorPrescriptions";
import PatientDashboard from "./components/patient/PatientDashboard";
import BookAppointment from "./components/patient/BookAppointment";
import AppointmentHistory from "./components/patient/AppointmentHistory";
import Prescriptions from "./components/patient/Prescriptions";

// Auth guard wrapper
function RequireAuth({ children, role }: { children: React.ReactNode; role?: string }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (role && user?.role !== role) return <Navigate to={`/${user?.role}`} replace />;
  return <>{children}</>;
}

export const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  {
    path: "/admin",
    element: <RequireAuth role="admin"><DashboardLayout /></RequireAuth>,
    children: [
      { index: true, element: <AdminOverview /> },
      { path: "doctors", element: <DoctorManagement /> },
      { path: "patients", element: <PatientManagement /> },
      { path: "appointments", element: <AppointmentManagement /> },
    ],
  },
  {
    path: "/doctor",
    element: <RequireAuth role="doctor"><DashboardLayout /></RequireAuth>,
    children: [
      { index: true, element: <DoctorDashboard /> },
      { path: "appointments", element: <DoctorDashboard /> },
      { path: "prescriptions", element: <DoctorPrescriptions /> },
    ],
  },
  {
    path: "/patient",
    element: <RequireAuth role="patient"><DashboardLayout /></RequireAuth>,
    children: [
      { index: true, element: <PatientDashboard /> },
      { path: "book", element: <BookAppointment /> },
      { path: "history", element: <AppointmentHistory /> },
      { path: "prescriptions", element: <Prescriptions /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
