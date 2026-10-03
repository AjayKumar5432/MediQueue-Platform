import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Login from "../pages/Login/Login";
import StaffLogin from "../pages/Login/StaffLogin";
import HospitalAdminLogin from "../pages/Login/HospitalAdminLogin";
import SuperAdminLogin from "../pages/Login/SuperAdminLogin";
import Register from "../pages/Register/Register";
import HospitalAdminRegister from "../pages/Register/HospitalAdminRegister";

import CustomerDashboard from "../pages/Customer/CustomerDashboard";
import StaffDashboard from "../pages/Staff/StaffDashboard";
import HospitalAdminDashboard from "../pages/HospitalAdmin/HospitalAdminDashboard";
import SuperAdminDashboard from "../pages/SuperAdmin/SuperAdminDashboard";
import QueueManagement from "../pages/Staff/QueueManagement";
import HospitalManagement from "../pages/SuperAdmin/HospitalManagement";
import DepartmentManagement from "../pages/SuperAdmin/DepartmentManagement";
import HospitalDepartmentManagement from "../pages/SuperAdmin/HospitalDepartmentManagement";
import HospitalAdminManagement from "../pages/SuperAdmin/HospitalAdminManagement";
import AuditTrailManagement from "../pages/SuperAdmin/AuditTrailManagement";
import StaffManagement from "../pages/HospitalAdmin/StaffManagement";
import ProtectedRoute from "../components/ProtectedRoute";
import BookToken from "../pages/Customer/BookToken";
import MyTokens from "../pages/Customer/MyTokens";
import UserProfile from "../pages/Profile/UserProfile";
import AdminLogin from "../pages/Login/AdminLogin";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC & PORTAL LOGIN ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/hospital-admin/login" element={<HospitalAdminLogin />} />
        <Route path="/super-admin/login" element={<SuperAdminLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-hospital" element={<HospitalAdminRegister />} />

        {/* Profile & Settings (All Logged-in Roles) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER", "STAFF", "HOSPITAL_ADMIN", "SUPER_ADMIN"]}>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER", "STAFF", "HOSPITAL_ADMIN", "SUPER_ADMIN"]}>
              <UserProfile />
            </ProtectedRoute>
          }
        />




        {/* ================= CUSTOMER ================= */}
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/book-token"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <BookToken />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/my-tokens"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <MyTokens />
            </ProtectedRoute>
          }
        />

        {/* ================= STAFF & QUEUE CONSOLE ================= */}
        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute allowedRoles={["STAFF"]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/queue"
          element={
            <ProtectedRoute allowedRoles={["STAFF", "HOSPITAL_ADMIN", "SUPER_ADMIN"]}>
              <QueueManagement />
            </ProtectedRoute>
          }
        />


        {/* ================= HOSPITAL ADMIN ================= */}
        <Route
          path="/hospital-admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["HOSPITAL_ADMIN"]}>
              <HospitalAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospital-admin/staff"
          element={
            <ProtectedRoute allowedRoles={["HOSPITAL_ADMIN"]}>
              <StaffManagement />
            </ProtectedRoute>
          }
        />



        {/* ================= SUPER ADMIN ================= */}
        <Route
          path="/super-admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin/hospitals"
          element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
              <HospitalManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin/departments"
          element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
              <DepartmentManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin/hospital-departments"
          element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
              <HospitalDepartmentManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin/hospital-admins"
          element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
              <HospitalAdminManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin/audit-logs"
          element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
              <AuditTrailManagement />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;