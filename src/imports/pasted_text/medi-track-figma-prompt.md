🚀 Figma AI Prompt (Role-Based, Fully Functional MediTrack UI)

“Design a fully functional, role-based web application UI for a clinic management system called MediTrack.

The UI must not only be visually appealing but also reflect complete real-world workflows, interactions, and user journeys for each role: Admin, Doctor, and Patient.

Focus on end-to-end usability, interaction states, and logical flows, not just static screens.

🎭 Role-Based System (CRITICAL)

Create separate dashboards and flows for:

👨‍💼 Admin
Full system control
Can:
Add/Edit/Delete Doctors
Add/Edit/Delete Patients
View & manage all appointments
Assign doctors to patients
🩺 Doctor
Can:
View daily/weekly appointments
Add consultation notes
Upload prescriptions
Update appointment status (Completed / Pending)
🧑 Patient
Can:
Register/Login
Book appointments
View appointment history
Download prescriptions
🔄 User Flow & Interaction Requirements

Design each page with complete interaction states, including:

Default state
Hover state
Active state
Disabled state
Loading state (skeleton loaders)
Empty state (no data illustrations)
Error state (validation + alerts)

Include micro-interactions:

Button hover animations
Card elevation effects
Smooth modal transitions
Toast notifications (success/error)
🧩 Pages & Functional UI
1. 🔐 Authentication Flow
Login page with role selector (Admin / Doctor / Patient)
Registration with role-based dynamic fields
Forgot password flow (email input + confirmation state)
2. 🧑‍💼 Admin Dashboard (Fully Functional UI)
Dashboard Overview:
KPI cards (Patients, Doctors, Appointments)
Charts (appointments trend)
Doctor Management:
Card-based + table hybrid UI
Add/Edit Doctor modal form
Delete confirmation dialog
Patient Management:
Search + filter UI
Patient cards with details
Appointment Management:
Calendar + list view toggle
Status badges (color-coded)
Edit appointment modal
3. 🩺 Doctor Dashboard (Interactive Workflow)
“Today’s Appointments” → carousel of cards
Appointment detail view (expandable card or modal)
Actions:
Add consultation notes (modal with textarea)
Upload prescription (drag & drop)
Mark appointment as completed

Include:

Success confirmation UI
Disabled state after completion
4. 🧑 Patient Dashboard (End-to-End UX)
Book Appointment:
Step-based flow:
Select Doctor (carousel cards)
Select Date (calendar picker)
Select Time Slot (interactive chips)
Appointment Tracking:
Card-based history with filters
Status indicators
Prescriptions:
File cards with preview + download button
5. 📅 Smart Appointment System
Prevent double booking (show unavailable slots as disabled)
Highlight available slots
Real-time feedback UI (slot selected, success booked)
6. 📄 Prescription Flow
Upload UI with drag-and-drop
File preview card
Linked to patient record
🎨 Design System
Use card-based layout instead of plain tables
Include carousels for doctors, appointments, and records
Sidebar navigation + top navbar
Consistent spacing, typography, and color system
🎬 Advanced UI Elements
Modal dialogs (forms, confirmations)
Toast notifications (success/error)
Dropdowns, filters, search bars
Pagination or infinite scroll
Tabs and segmented controls
📱 Responsiveness
Desktop + tablet layouts
Collapsible sidebar
🧱 Reusable Components
Buttons (states included)
Cards (doctor, patient, appointment, file)
Forms with validation
Status badges
Modals
📦 Output Requirements
Separate frames for each role
Include interaction states in design (variants)
Use auto-layout
Component-based structure for frontend (React-ready)

The final design should feel like a fully working SaaS healthcare product, not just UI screens.”