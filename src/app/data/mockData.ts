export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  rating: number;
  experience: number;
  patients: number;
  avatar: string;
  status: "active" | "inactive";
  availability: string[];
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: "male" | "female";
  bloodGroup: string;
  assignedDoctorId: string;
  lastVisit: string;
  status: "active" | "inactive";
  initials: string;
  avatarColor: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: "pending" | "completed" | "cancelled";
  notes?: string;
  prescription?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  appointmentId: string;
  date: string;
  fileName: string;
  fileSize: string;
  diagnosis: string;
}

export const DOCTORS: Doctor[] = [
  {
    id: "doc-1",
    name: "Dr. James Wilson",
    specialization: "Cardiology",
    email: "james.wilson@meditrack.com",
    phone: "+1 (555) 101-2020",
    rating: 4.9,
    experience: 12,
    patients: 248,
    avatar: "https://images.unsplash.com/photo-1645066928295-2506defde470?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    status: "active",
    availability: ["Mon", "Tue", "Wed", "Fri"],
  },
  {
    id: "doc-2",
    name: "Dr. Sarah Chen",
    specialization: "Neurology",
    email: "sarah.chen@meditrack.com",
    phone: "+1 (555) 202-3030",
    rating: 4.8,
    experience: 9,
    patients: 189,
    avatar: "https://images.unsplash.com/photo-1772987057599-2f1088c1e993?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    status: "active",
    availability: ["Mon", "Wed", "Thu", "Sat"],
  },
  {
    id: "doc-3",
    name: "Dr. Michael Reid",
    specialization: "Orthopedics",
    email: "michael.reid@meditrack.com",
    phone: "+1 (555) 303-4040",
    rating: 4.7,
    experience: 15,
    patients: 312,
    avatar: "https://images.unsplash.com/photo-1659353885824-1199aeeebfc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    status: "active",
    availability: ["Tue", "Thu", "Fri"],
  },
  {
    id: "doc-4",
    name: "Dr. Emily Parker",
    specialization: "Dermatology",
    email: "emily.parker@meditrack.com",
    phone: "+1 (555) 404-5050",
    rating: 4.9,
    experience: 8,
    patients: 156,
    avatar: "https://images.unsplash.com/photo-1706565029539-d09af5896340?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    status: "active",
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  },
  {
    id: "doc-5",
    name: "Dr. David Kim",
    specialization: "Pediatrics",
    email: "david.kim@meditrack.com",
    phone: "+1 (555) 505-6060",
    rating: 4.8,
    experience: 11,
    patients: 274,
    avatar: "https://images.unsplash.com/photo-1678940805950-73f2127f9d4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    status: "active",
    availability: ["Mon", "Wed", "Fri"],
  },
  {
    id: "doc-6",
    name: "Dr. Lisa Johnson",
    specialization: "Oncology",
    email: "lisa.johnson@meditrack.com",
    phone: "+1 (555) 606-7070",
    rating: 4.6,
    experience: 18,
    patients: 98,
    avatar: "https://images.unsplash.com/photo-1676155081561-865fab11da37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    status: "inactive",
    availability: ["Tue", "Thu"],
  },
];

export const PATIENTS: Patient[] = [
  { id: "pat-1", name: "Sarah Thompson", email: "sarah@email.com", phone: "+1 (555) 111-2222", age: 34, gender: "female", bloodGroup: "A+", assignedDoctorId: "doc-1", lastVisit: "2026-03-15", status: "active", initials: "ST", avatarColor: "#6366F1" },
  { id: "pat-2", name: "Robert Garcia", email: "robert@email.com", phone: "+1 (555) 222-3333", age: 45, gender: "male", bloodGroup: "O-", assignedDoctorId: "doc-2", lastVisit: "2026-03-18", status: "active", initials: "RG", avatarColor: "#0EA5E9" },
  { id: "pat-3", name: "Jennifer Lee", email: "jennifer@email.com", phone: "+1 (555) 333-4444", age: 28, gender: "female", bloodGroup: "B+", assignedDoctorId: "doc-3", lastVisit: "2026-03-10", status: "active", initials: "JL", avatarColor: "#10B981" },
  { id: "pat-4", name: "Michael Brown", email: "michael@email.com", phone: "+1 (555) 444-5555", age: 52, gender: "male", bloodGroup: "AB+", assignedDoctorId: "doc-1", lastVisit: "2026-03-20", status: "active", initials: "MB", avatarColor: "#F59E0B" },
  { id: "pat-5", name: "Amanda White", email: "amanda@email.com", phone: "+1 (555) 555-6666", age: 39, gender: "female", bloodGroup: "O+", assignedDoctorId: "doc-4", lastVisit: "2026-03-12", status: "active", initials: "AW", avatarColor: "#EC4899" },
  { id: "pat-6", name: "David Martinez", email: "david@email.com", phone: "+1 (555) 666-7777", age: 61, gender: "male", bloodGroup: "A-", assignedDoctorId: "doc-2", lastVisit: "2026-03-05", status: "inactive", initials: "DM", avatarColor: "#8B5CF6" },
  { id: "pat-7", name: "Emily Davis", email: "emily@email.com", phone: "+1 (555) 777-8888", age: 24, gender: "female", bloodGroup: "B-", assignedDoctorId: "doc-5", lastVisit: "2026-03-22", status: "active", initials: "ED", avatarColor: "#EF4444" },
  { id: "pat-8", name: "James Wilson", email: "jwilson@email.com", phone: "+1 (555) 888-9999", age: 47, gender: "male", bloodGroup: "O+", assignedDoctorId: "doc-3", lastVisit: "2026-03-19", status: "active", initials: "JW", avatarColor: "#2EC4B6" },
];

export const APPOINTMENTS: Appointment[] = [
  { id: "apt-1", patientId: "pat-1", patientName: "Sarah Thompson", doctorId: "doc-1", doctorName: "Dr. James Wilson", date: "2026-03-24", time: "09:00 AM", type: "Cardiology Checkup", status: "pending", notes: "" },
  { id: "apt-2", patientId: "pat-2", patientName: "Robert Garcia", doctorId: "doc-2", doctorName: "Dr. Sarah Chen", date: "2026-03-24", time: "10:30 AM", type: "Neurology Consultation", status: "completed", notes: "Patient shows improvement." },
  { id: "apt-3", patientId: "pat-3", patientName: "Jennifer Lee", doctorId: "doc-3", doctorName: "Dr. Michael Reid", date: "2026-03-24", time: "11:00 AM", type: "Follow-up", status: "pending" },
  { id: "apt-4", patientId: "pat-4", patientName: "Michael Brown", doctorId: "doc-1", doctorName: "Dr. James Wilson", date: "2026-03-24", time: "02:00 PM", type: "ECG & Review", status: "pending" },
  { id: "apt-5", patientId: "pat-5", patientName: "Amanda White", doctorId: "doc-4", doctorName: "Dr. Emily Parker", date: "2026-03-25", time: "09:30 AM", type: "Skin Consultation", status: "pending" },
  { id: "apt-6", patientId: "pat-7", patientName: "Emily Davis", doctorId: "doc-5", doctorName: "Dr. David Kim", date: "2026-03-25", time: "03:00 PM", type: "General Checkup", status: "cancelled" },
  { id: "apt-7", patientId: "pat-1", patientName: "Sarah Thompson", doctorId: "doc-2", doctorName: "Dr. Sarah Chen", date: "2026-03-18", time: "10:00 AM", type: "Brain MRI Review", status: "completed", notes: "Results are normal." },
  { id: "apt-8", patientId: "pat-2", patientName: "Robert Garcia", doctorId: "doc-1", doctorName: "Dr. James Wilson", date: "2026-03-15", time: "11:30 AM", type: "Heart Checkup", status: "completed" },
  { id: "apt-9", patientId: "pat-8", patientName: "James Wilson", doctorId: "doc-3", doctorName: "Dr. Michael Reid", date: "2026-03-26", time: "01:00 PM", type: "Joint Examination", status: "pending" },
];

export const PRESCRIPTIONS: Prescription[] = [
  { id: "rx-1", patientId: "pat-1", doctorId: "doc-2", doctorName: "Dr. Sarah Chen", appointmentId: "apt-7", date: "2026-03-18", fileName: "prescription_MRI_review.pdf", fileSize: "248 KB", diagnosis: "Brain MRI Analysis" },
  { id: "rx-2", patientId: "pat-1", doctorId: "doc-1", doctorName: "Dr. James Wilson", appointmentId: "apt-1", date: "2026-03-10", fileName: "cardiology_prescription.pdf", fileSize: "185 KB", diagnosis: "Cardiology Checkup" },
  { id: "rx-3", patientId: "pat-2", doctorId: "doc-1", doctorName: "Dr. James Wilson", appointmentId: "apt-8", date: "2026-03-15", fileName: "heart_checkup_rx.pdf", fileSize: "312 KB", diagnosis: "Cardiac Assessment" },
];

export const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM",
];

export const BOOKED_SLOTS: Record<string, string[]> = {
  "doc-1": ["09:00 AM", "10:30 AM", "02:00 PM"],
  "doc-2": ["10:30 AM", "11:00 AM"],
  "doc-3": ["09:30 AM", "02:30 PM"],
  "doc-4": ["09:00 AM", "11:30 AM"],
  "doc-5": ["10:00 AM", "03:00 PM"],
};

export const CHART_DATA = [
  { day: "Mon", appointments: 14, completed: 12 },
  { day: "Tue", appointments: 18, completed: 15 },
  { day: "Wed", appointments: 22, completed: 19 },
  { day: "Thu", appointments: 16, completed: 14 },
  { day: "Fri", appointments: 25, completed: 21 },
  { day: "Sat", appointments: 11, completed: 10 },
  { day: "Sun", appointments: 8, completed: 7 },
];

export const MONTHLY_TREND = [
  { month: "Sep", value: 142 },
  { month: "Oct", value: 168 },
  { month: "Nov", value: 154 },
  { month: "Dec", value: 189 },
  { month: "Jan", value: 201 },
  { month: "Feb", value: 215 },
  { month: "Mar", value: 238 },
];
