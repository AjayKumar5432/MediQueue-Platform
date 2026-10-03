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
  Alert,
  Chip,
  Divider
} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff, MedicalServices, FlashOn } from "@mui/icons-material";

import { login } from "../../api/authApi";
import { saveSession } from "../../utils/session";
import Navbar from "../../components/Navbar/Navbar";

function StaffLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setFormError("");

    if (!email || !password) {
      setFormError("Please enter staff email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await login({ email, password });
      const userRole = response.data.role;

      if (userRole !== "STAFF" && userRole !== "SUPER_ADMIN") {
        setFormError(`Access Denied: This portal is reserved for Medical Staff & Doctors. Your account role is ${userRole}.`);
        setLoading(false);
        return;
      }

      saveSession(response.data);
      navigate("/staff/dashboard");
    } catch (error) {
      console.error("Staff Login Failed:", error);
      const rawData = error.response?.data;
      let errMsg = typeof rawData === "string" ? rawData : rawData?.message || "Invalid staff credentials.";
      setFormError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail("doctor@cityhospital.com");
    setPassword("Pass@123");
    setFormError("");
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F0FDF4" }}>
      <Navbar />

      <Container maxWidth="sm" sx={{ pt: 6, pb: 8 }}>
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 4,
            background: "#FFFFFF",
            borderTop: "6px solid #0D9488",
            boxShadow: "0 20px 40px rgba(13, 148, 136, 0.08)"
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "18px",
                background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                mb: 1.5,
                boxShadow: "0 8px 18px rgba(13, 148, 136, 0.3)"
              }}
            >
              <MedicalServices fontSize="large" />
            </Box>
            <Box sx={{ mb: 1 }}>
              <Chip label="DOCTOR & STAFF CONSOLE" color="info" size="small" sx={{ fontWeight: 800 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A" }}>
              Medical Staff Login
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Sign in to access live OPD consultation counters and patient queue rosters
            </Typography>
          </Box>

          {/* Form Error Alert */}
          {formError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3, fontWeight: 700 }}>
              {formError}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleLogin}>
            <TextField
              label="Staff Email Address"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (formError) setFormError("");
              }}
              placeholder="e.g. doctor@cityhospital.com"
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
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 800,
                background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)"
              }}
            >
              {loading ? "Authenticating Staff..." : "Login to Live Queue Console"}
            </Button>
          </form>

          {/* Quick Demo Credentials Filler */}
          <Divider sx={{ my: 3 }}>
            <Chip
              icon={<FlashOn fontSize="small" />}
              label="Staff Demo Credentials"
              size="small"
              sx={{ fontWeight: 700, fontSize: "0.75rem" }}
            />
          </Divider>

          <Box sx={{ textAlign: "center" }}>
            <Chip
              label="Fill Staff Demo (doctor@cityhospital.com / Pass@123)"
              color="info"
              variant="outlined"
              onClick={fillDemo}
              sx={{ cursor: "pointer", fontWeight: 700, py: 2, px: 1 }}
            />
          </Box>

          {/* Patient Portal Switch Link */}
          <Box sx={{ textAlign: "center", mt: 3, pt: 2, borderTop: "1px solid #F1F5F9" }}>
            <Typography variant="body2" color="text.secondary">
              Are you a patient?{" "}
              <Typography
                component={Link}
                to="/login"
                variant="body2"
                sx={{ color: "primary.main", fontWeight: 700, textDecoration: "none" }}
              >
                Go to Patient Portal Login
              </Typography>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default StaffLogin;
