// src/app/api.ts
// Central API service — all backend calls go through here.

const BASE_URL = "http://localhost:5000/api";

function getToken(): string | null {
  return localStorage.getItem("meditrack_token");
}

/** Wraps fetch: auto-attaches JWT, handles JSON vs FormData */
async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Only set Content-Type for JSON bodies (not FormData)
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  
  const contentType = res.headers.get("content-type");
  let data: any = null;
  if (contentType && contentType.includes("application/json")) {
    data = await res.json();
  } else {
    const text = await res.text();
    throw new Error(`Server returned non-JSON response (${res.status}): ${text.slice(0, 100)}...`);
  }

  if (!res.ok) {
    throw new Error(data?.message ?? `Request failed with status ${res.status}`);
  }

  return data as T;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const apiLogin = (email: string, password: string) =>
  apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const apiRegister = (data: Record<string, string>) =>
  apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const apiAddDoctor = (data: any) =>
  apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ ...data, role: "doctor" }),
  });

export const apiAddPatient = (data: any) =>
  apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ ...data, role: "patient" }),
  });

// ── Data ──────────────────────────────────────────────────────────────────────
export const apiGetDoctors = () => apiFetch("/doctors");
export const apiUpdateDoctor = (userId: string, data: any) =>
  apiFetch(`/doctors/${userId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const apiGetPatients = () => apiFetch("/patients");
export const apiUpdatePatient = (userId: string, data: any) =>
  apiFetch(`/patients/${userId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const apiGetAppointments = (params?: { user_id?: string; role?: string }) => {
  const qs = params
    ? "?" + new URLSearchParams(params as Record<string, string>).toString()
    : "";
  return apiFetch(`/appointments${qs}`);
};

// ── Appointments ──────────────────────────────────────────────────────────────
export const apiBookAppointment = (data: {
  patient_user_id: string;
  doctor_user_id: string;
  date: string;
  time_slot: string;
  type?: string;
}) =>
  apiFetch("/appointments/book", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const apiUpdateAppointmentStatus = (id: string, status: string) =>
  apiFetch(`/appointments/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

export const apiUpdateAppointmentNotes = (id: string, notes: string) =>
  apiFetch(`/appointments/${id}/notes`, {
    method: "PATCH",
    body: JSON.stringify({ notes }),
  });

// ── Files ─────────────────────────────────────────────────────────────────────
export const apiUploadMedicalHistory = (formData: FormData) =>
  apiFetch("/files/upload-medical-history", {
    method: "POST",
    body: formData,
  });

export const apiUploadPrescription = (formData: FormData) =>
  apiFetch("/files/upload-prescription", {
    method: "POST",
    body: formData,
  });

export const apiGetMedicalHistory = (userID: string) =>
  apiFetch(`/files/medical-history/${userID}`);

export const apiGetPrescriptions = (params?: {
  patient_user_id?: string;
  doctor_user_id?: string;
}) => {
  const qs = params
    ? "?" + new URLSearchParams(params as Record<string, string>).toString()
    : "";
  return apiFetch(`/files/prescriptions${qs}`);
};

/** Returns a direct URL to download/view a stored file */
export const getFileDownloadUrl = (filePath: string) =>
  `http://localhost:5000/uploads/${filePath}`;
