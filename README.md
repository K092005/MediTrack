# 🏥 MediTrack: Healthcare Management Simplified

![MediTrack Banner](https://img.shields.io/badge/MediTrack-v1.0.0-blue?style=for-the-badge&logo=medit)
![Status](https://img.shields.io/badge/Status-Phase_3_Complete-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

MediTrack is a comprehensive, role-based clinic management system designed to digitize healthcare workflows. It bridges the gap between Patients, Doctors, and Admin staff, ensuring seamless appointment scheduling, digital prescription management, and real-time medical insights.

---

## 🚀 Key Features

### 👑 Admin Dashboard (Overwatch)
- **Clinic Analytics**: Visual real-time reports on patient growth and appointment distributions.
- **Staff Management**: Full CRUD operations for managing the doctor directory.
- **Appointment Tracking**: Audit logs for all clinic activities.

### 🩺 Doctor Dashboard (Consultation)
- **Patient History**: Access past medical records and consultation notes with one click.
- **Digital Prescriptions**: Upload, manage, and link prescriptions (PDF/Images) directly to patient files.
- **Schedule Management**: View daily agendas and mark appointments as completed or cancelled.

### 👤 Patient Dashboard (Self-Service)
- **Conflict-Free Booking**: Interactive appointment scheduling with real-time slot validation.
- **Health Library**: Access and download all digital prescriptions securely.
- **Profile Management**: Update personal health details, blood group, and emergency contacts.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js (Vite), TailwindCSS, Framer Motion, Recharts, Lucide Icons |
| **Backend** | Node.js, Express.js, Multer (File Handling) |
| **Database** | MySQL (Relational Mapping) |
| **Security** | JWT (Stateless Auth), Bcrypt (Password Hashing) |

---

## ⚡ Performance Audit (Lighthouse)

MediTrack is optimized for accessibility and speed. Here are the core metrics from our Phase 3 audit:

- **Best Practices**: 🟢 100/100
- **Accessibility**: 🟡 86/100 (Optimization ongoing)
- **SEO**: 🟡 82/100
- **Performance**: 🔴 31/100 *(Note: Result from dev-server audit. Production builds achieve 90+)*

---

## 📸 System Showcase

> [!TIP]
> *Replace these placeholders with your actual screenshots for the final viva.*

- ![Dashboard](https://via.placeholder.com/800x400?text=Admin+Overview+Dashboard)
- ![Booking](https://via.placeholder.com/800x400?text=Patient+Appointment+Booking+Flow)
- ![Prescription](https://via.placeholder.com/800x400?text=Doctor+Prescription+Library)

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- Node.js (v18+)
- MySQL Server

### 2. Database Setup
1. Create a database named `healthcare_db`.
2. Import the `migrate.sql` file located in the `/healthcare_backend` folder.

### 3. Backend Configuration
```bash
cd healthcare_backend
npm install
# Create a .env file and add your credentials
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=healthcare_db
JWT_SECRET=your_super_secret_key
```

### 4. Frontend Configuration
```bash
cd ..
npm install
npm run dev
```

---

## 📁 Project Structure

```text
├── src/
│   ├── app/
│   │   ├── components/       # UI Components (Admin, Doctor, Patient)
│   │   ├── context/          # Global State (Auth, Data)
│   │   └── api.ts            # Axios Config
├── healthcare_backend/
│   ├── routes/               # Express API Endpoints
│   ├── controllers/          # Business Logic
│   ├── middleware/           # JWT & File Upload Logic
│   └── uploads/              # Storage for Digital Prescriptions
└── migrate.sql               # Database Schema
```

---

## 🔮 Future Roadmap
- [ ] **Telemedicine**: Real-time video consultations.
- [ ] **AI-Diagnosis**: Basic symptom-based doctor suggestions.
- [ ] **SMS Integration**: Automated appointment reminders.
- [ ] **PWA Support**: Installable mobile application.

---

### 📄 License
Balanced under the **MIT License**. Created by the MediTrack Team.