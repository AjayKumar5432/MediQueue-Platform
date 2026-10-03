import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  Chip,
  FormControlLabel,
  Checkbox
} from "@mui/material";

import { Visibility, VisibilityOff, Email, Lock, AdminPanelSettings } from "@mui/icons-material";
import { toast } from "react-toastify";

import Navbar from "../../components/Navbar/Navbar";
import { login } from "../../api/authApi";
import { saveSession } from "../../utils/session";
import ForgotPasswordModal from "../../components/ForgotPasswordModal";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      toast.warning("Please enter your admin email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await login({ email, password });

      const { role } = res.data;

      // STRICT ROLE CHECK: Admin Portal permits ONLY SUPER_ADMIN, HOSPITAL_ADMIN, or STAFF roles
      if (role === "CUSTOMER") {
        toast.error("Access Denied: Patient accounts cannot log in through the Admin Portal. Please use the Patient Portal.");
        setLoading(false);
        return;
      }

      // Save user session for Admin/Staff
      saveSession(res.data);

      // Smart redirection based on exact Role
      if (role === "SUPER_ADMIN") {
        toast.success("Welcome Back, Super Admin!");
        navigate("/super-admin/dashboard");
      } else if (role === "HOSPITAL_ADMIN") {
        toast.success("Welcome Back, Hospital Admin!");
        navigate("/hospital-admin/dashboard");
      } else if (role === "STAFF") {
        toast.success("Welcome Back, Staff Member!");
        navigate("/staff/dashboard");
      }

    } catch (error) {
      console.error("Admin Login Error:", error);
      let errMsg = "Invalid email or password.";
      if (error.response?.data?.message) {
        errMsg = error.response.data.message;
      }
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <Navbar />

      <Container maxWidth="xs" sx={{ pt: 8, pb: 8 }}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 4,
            background: "#FFFFFF",
            boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
            textAlign: "center"
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "16px",
              background: "linear-gradient(135deg, #0F172A 0%, #334155 100%)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              mb: 1.5,
              boxShadow: "0 8px 16px rgba(15, 23, 42, 0.25)"
            }}
          >
            <AdminPanelSettings fontSize="large" />
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A" }}>
            Admin & Staff Portal
          </Typography>
          
          <Chip
            label="SECURE MANAGEMENT ACCESS"
            size="small"
            sx={{
              mt: 1,
              mb: 3,
              fontWeight: 800,
              fontSize: "0.68rem",
              bgcolor: "#F1F5F9",
              color: "#475569"
            }}
          />

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Admin / Staff Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              placeholder="e.g. admin@hospital.com"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              placeholder="Enter account password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "#0D9488" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: "#0D9488" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />


            {/* Show Password Checkbox & Forgot Password Link */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 0.5, mb: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    color="primary"
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#475569" }}>
                    Show Password
                  </Typography>
                }
              />
              <Button
                variant="text"
                size="small"
                onClick={() => setForgotOpen(true)}
                sx={{ textTransform: "none", fontWeight: 700, color: "#0D9488" }}
              >
                Forgot Password?
              </Button>
            </Box>


            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                mt: 2.5,
                mb: 2,
                py: 1.5,
                fontWeight: 800,
                fontSize: "1rem",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                "&:hover": { background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)" }
              }}
            >
              {loading ? "Authenticating..." : "Sign In to Admin Portal"}
            </Button>
          </form>

          <ForgotPasswordModal
            open={forgotOpen}
            handleClose={() => setForgotOpen(false)}
            initialEmail={formData.email}
          />


          <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #F1F5F9" }}>
            <Typography variant="caption" color="text.secondary">
              Are you a Patient?{" "}
              <Typography
                component={Link}
                to="/login"
                variant="caption"
                sx={{ color: "#0D9488", fontWeight: 700, textDecoration: "none" }}
              >
                Sign In to Patient Portal
              </Typography>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default AdminLogin;
