Figma AI Prompt (Role-Based, Fully Functional MediTrack UI)

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

🧠 What This Fix Actually Does (Important)

Most people mess this up by:
❌ Designing pretty screens
✅ You are now designing behavior + logic + states

This ensures:

Your frontend becomes easy to build
Backend integration becomes clear (you’ll know what APIs you need)
Your project looks hackathon-winning level
⚡ Next Move (Highly Recommended)

After generating this in Figma, do this:

Pick ONE flow:
Login → Dashboard
Then I help you:
Convert it into React + backend step-by-step
Teach APIs while building (since you said you're learning)

If you want, I can next:
👉 Break this into API endpoints (exact backend plan)
👉 Or help you start login system implementation (React + Firebase / Node)

Just tell me 👍

Now A speacia design and theme prompt that must include cards, color contrast, courausals and many more u can add more..It must be proffesional and pantone coloured but too minimal and too maximal..It should be perfectly balanced..So create that prompt for each screen

Alright—now we’re aiming for that sweet spot where a designer says “minimal” and a product manager says “wow.” Balanced, premium, and just enough flair to make investors nod silently 😌

Below are separate Figma AI prompts for each screen, all aligned with a Pantone-inspired, professional, card-heavy, carousel-driven design system.

🎨 🌈 Master Theme (Use this in EVERY prompt)

Before each screen prompt, paste this once:

“Use a balanced minimal-maximal design style for a healthcare SaaS product.
Follow a Pantone-inspired color system:

Primary: Deep Blue (#2F5DFF – Pantone-like trust tone)
Secondary: Soft Teal (#2EC4B6 – healthcare freshness)
Accent: Coral (#FF6B6B – for alerts & CTAs)
Background: Off-white (#F8FAFC)
Cards: Pure white with soft shadows

Design philosophy:

Combine clean minimal layouts with rich UI elements
Use cards instead of flat sections
Add subtle gradients and depth
Include carousels, micro-interactions, and hover effects
Maintain strong contrast and accessibility
Use rounded corners (12–16px), soft shadows, and spacing

Typography: Modern (Inter / Poppins style), clear hierarchy
Layout: Spacious, grid-based, breathable

The UI must feel like a premium SaaS dashboard (Stripe + Notion + modern healthcare app).”

🔐 1. Login Page Prompt

“Design a visually rich and interactive login page for MediTrack.

Layout:

Split screen:
Left: Illustration or gradient panel (healthcare-themed)
Right: Glassmorphism login card

Elements:

Card with soft shadow + slight blur
Fields: Email, Password (with icons inside inputs)
Role selector as pill toggle (Admin / Doctor / Patient)
CTA button with gradient + hover animation
“Forgot Password” link

Enhancements:

Floating labels for inputs
Input focus glow effect
Subtle background gradient animation

Add:

Micro-interactions (button hover, input focus)
Error state (invalid login)
Loading state (spinner in button)

Make it feel premium, welcoming, and modern.”

📝 2. Registration Page Prompt

“Design a multi-step registration page with interactive UI.

Layout:

Centered card with step progress bar

Elements:

Tabs or toggle: Patient / Doctor
Step-based form (multi-step with progress indicator)
Input fields with icons + validation states

UI Enhancements:

Card-based sections for each step
Smooth transitions between steps
Success confirmation screen (checkmark animation)

Add:

Error validation states
Disabled/active button states
Tooltip hints for fields

Keep it clean but engaging with layered cards and depth.”

🧑‍💼 3. Admin Dashboard Prompt

“Design a feature-rich, visually balanced admin dashboard.

Layout:

Sidebar (icons + labels, collapsible)
Topbar (search, notifications, profile avatar)

Sections:

KPI Overview
Card-based stats:
Patients, Doctors, Appointments, Revenue
Each card with icon + subtle gradient
Doctors Section
Horizontal carousel of doctor cards
Each card:
Avatar, name, specialization, rating, action buttons
Patients Section
Card grid (instead of plain table)
Each card with key details + quick actions
Appointments
Card-based timeline or list
Status badges (color-coded)

Enhancements:

Hover elevation on cards
Filter + search UI
Modal popups (Add/Edit/Delete)

Make it data-rich but not cluttered.”

🩺 4. Doctor Dashboard Prompt

“Design an interactive and workflow-focused doctor dashboard.

Sections:

Today’s Appointments
Carousel of appointment cards
Each card:
Patient name, time, status, quick actions
Appointment Details
Expandable card or modal

Actions:

Add Notes (modal with textarea)
Upload Prescription (drag & drop card UI)
Mark as Completed (state change UI)

Enhancements:

Disabled state after completion
Success toast notification
Hover interactions on cards

Make UI feel fast, efficient, and actionable.”

🧑 5. Patient Dashboard Prompt

“Design a modern, engaging patient dashboard with interactive elements.

Sections:

Book Appointment
Card with:
Doctor selection → carousel cards
Date picker (calendar UI)
Time slots → pill buttons
Appointment History
Card-based layout with filters
Status badges
Prescriptions
File cards with preview + download

Enhancements:

Highlight selected doctor/time visually
Empty states with illustration
Smooth transitions

Make it intuitive, friendly, and visually guided.”

📅 6. Appointment Booking UI Prompt

“Design a smart appointment booking interface.

Elements:

Calendar picker (modern UI)
Time slots as selectable chips/cards
Doctor selection via carousel

Enhancements:

Disabled unavailable slots
Selected slot highlight
Confirmation animation

Add:

Step-based booking flow
Real-time feedback UI

Make it feel interactive and seamless.”

📄 7. Prescription Upload UI Prompt

“Design a modern file upload interface for prescriptions.

Elements:

Drag-and-drop upload card
File preview card (PDF/image)
Notes input

Enhancements:

Upload progress bar
Success state animation
Error handling UI

Make it clean, simple, and functional with depth.”