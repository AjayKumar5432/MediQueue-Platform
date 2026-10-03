import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Chip,
  Divider,
  Container,
  InputAdornment,
  IconButton,
  Alert,
  Stack,
  FormControlLabel,
  Checkbox
} from "@mui/material";

import { LocalHospital, Email, Lock, Visibility, VisibilityOff, PersonAdd, MedicalServices, AdminPanelSettings, Security } from "@mui/icons-material";
import { toast } from "react-toastify";

import { login } from "../../api/authApi";
import { saveSession } from "../../utils/session";
import Navbar from "../../components/Navbar/Navbar";
import ForgotPasswordModal from "../../components/ForgotPasswordModal";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [redirecting, setRedirecting] = useState(false);


  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    setFormError("");

    if (!email || !password) {
      setFormError("Please enter both email address and password.");
      return;
    }

    setLoading(true);

    try {
      const loginData = { email, password };
      const response = await login(loginData);

      const { role } = response.data;

      // STRICT ROLE CHECK: Patient Login Portal permits ONLY CUSTOMER role
      if (role !== "CUSTOMER") {
        setFormError("Access Denied: Hospital Admin and Staff accounts cannot log in through the Patient Portal. Please use the Admin Portal.");
        toast.error("Admin/Staff account detected. Please use the Admin Portal.");
        setLoading(false);
        return;
      }

      // Save user session for Customer
      saveSession(response.data);
      toast.success("Welcome Back to MediQueue!");
      navigate("/customer/dashboard");

    } catch (error) {
      console.error("Login Failed:", error);
      const statusCode = error.response?.status;
      const rawData = error.response?.data;

      let errMsg = "";
      if (typeof rawData === "string") {
        errMsg = rawData;
      } else if (rawData?.message) {
        errMsg = rawData.message;
      } else {
        errMsg = error.message || "";
      }

      const isUserNotFound =
        statusCode === 404 ||
        errMsg.toLowerCase().includes("does not exist") ||
        errMsg.toLowerCase().includes("not found") ||
        errMsg.toLowerCase().includes("email id");

      if (isUserNotFound) {
        const notFoundText = "Email ID does not exist. Redirecting to signup page...";
        setFormError(notFoundText);
        setRedirecting(true);

        setTimeout(() => {
          navigate("/register");
        }, 1500);
      } else {
        const credErrorText = "Invalid email or password. Please check your credentials.";
        setFormError(credErrorText);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <Navbar />

      <Container maxWidth="sm" sx={{ pt: 6, pb: 8 }}>
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 4,
            background: "#FFFFFF",
            boxShadow: "0 20px 40px rgba(0,0,0,0.06)"
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "16px",
                background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                mb: 1.5,
                boxShadow: "0 8px 16px rgba(13, 148, 136, 0.25)"
              }}
            >
              <LocalHospital fontSize="large" />
            </Box>
            <Chip label="PATIENT PORTAL" color="success" size="small" sx={{ fontWeight: 800, mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary" }}>
              Patient Sign In
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Sign in to book OPD tokens and track live hospital queues
            </Typography>
          </Box>

          {/* Inline Error Alert placed directly above Email & Password fields */}
          {formError && (
            <Alert
              severity={redirecting ? "warning" : "error"}
              action={
                formError.includes("Admin Portal") ? (
                  <Button
                    color="inherit"
                    size="small"
                    component={Link}
                    to="/admin/login"
                    startIcon={<AdminPanelSettings />}
                    sx={{ fontWeight: 800 }}
                  >
                    Go to Admin Portal
                  </Button>
                ) : redirecting ? (
                  <Button
                    color="inherit"
                    size="small"
                    component={Link}
                    to="/register"
                    startIcon={<PersonAdd />}
                    sx={{ fontWeight: 800 }}
                  >
                    Sign Up
                  </Button>
                ) : null
              }
              sx={{ mb: 3, borderRadius: 3, fontWeight: 700 }}
            >
              {formError}
            </Alert>
          )}


          {/* Form */}
          <form onSubmit={handleLogin}>
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (formError) setFormError("");
              }}
              placeholder="patient@gmail.com"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (formError) setFormError("");
              }}
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
              disabled={loading || redirecting}
              sx={{ mt: 2.5, mb: 2, py: 1.4, fontSize: "1rem", fontWeight: 700 }}
            >
              {loading ? "Signing in..." : redirecting ? "Redirecting..." : "Login to Patient Portal"}
            </Button>
          </form>

          <ForgotPasswordModal
            open={forgotOpen}
            handleClose={() => setForgotOpen(false)}
            initialEmail={email}
          />


          {/* Register & Admin Switch Link */}
          <Box sx={{ textAlign: "center", mt: 3, pt: 2, borderTop: "1px solid #F1F5F9" }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Don't have an account?{" "}
              <Typography
                component={Link}
                to="/register"
                variant="body2"
                sx={{ color: "primary.main", fontWeight: 700, textDecoration: "none" }}
              >
                Register as Patient
              </Typography>
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Hospital Staff or Administrator?{" "}
              <Typography
                component={Link}
                to="/admin/login"
                variant="caption"
                sx={{ color: "#475569", fontWeight: 700, textDecoration: "underline" }}
              >
                Sign in to Admin Portal
              </Typography>
            </Typography>
          </Box>

        </Paper>
      </Container>
    </Box>
  );
}

export default Login;