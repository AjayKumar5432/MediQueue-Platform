# MediQueue — Multi-Hospital Queue & Appointment Management Platform

A modern, full-stack healthcare platform designed for multi-hospital queue administration, OPD token management, live WebSocket consultation counter sync, and patient booking.

---

## 🌟 Key Features

- **Multi-Hospital & Multi-Tenant Support**: Isolated dashboards for hospital admins (Apollo, AIG, etc.) and doctors/staff.
- **Super Admin Panel**: 1-click hospital status toggle (Active/Inactive), pending admin review workflow, and platform audit logs.
- **Doctor Workstation & Live Queue Console**: Real-time patient queue calling, consultation completing, and token priority triage (Regular, Senior Citizen, Emergency).
- **Patient OPD Registration**: Walk-in token issuance & online appointment booking.
- **Real-Time WebSocket Sync**: STOMP over SockJS for instant counter updates without page reloads.

---

## 🏗️ Technology Stack

- **Frontend**: React 18, Vite, Material UI (MUI), SockJS & StompJS.
- **Backend**: Java 17, Spring Boot 3, Spring Security (JWT), Spring Data JPA.
- **Database**: MySQL 8.
- **Communication**: STOMP WebSockets, SMTP Email notifications.

---

## 🚀 Getting Started

### Backend Setup (`MediQueue/MediQueue`)
1. Ensure MySQL server is running and database `mediqueue` exists.
2. Copy `application.properties.example` to `application.properties` (or set environment variables):
   - `DB_USERNAME`: MySQL username (default: `root`)
   - `DB_PASSWORD`: MySQL password
   - `JWT_SECRET`: JWT secret signing key
3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Setup (`MediQueue`)
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Vite dev server:
   ```bash
   npm run dev
   ```
3. Open browser at `http://localhost:5173`.

---

## 🔒 Security & Environment Variables

Sensitive credentials (such as DB passwords and Gmail App keys) are loaded from system environment variables or local ignored config files to ensure source code pushed to GitHub remains 100% secure.
