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
import { Email, Lock, Visibility, VisibilityOff, Security, FlashOn } from "@mui/icons-material";

import { login } from "../../api/authApi";
import { saveSession } from "../../utils/session";
import Navbar from "../../components/Navbar/Navbar";

function SuperAdminLogin() {
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
      setFormError("Please enter Super Admin credentials.");
      return;
    }

    setLoading(true);

    try {
      const response = await login({ email, password });
      const userRole = response.data.role;

      if (userRole !== "SUPER_ADMIN") {
        setFormError(`Access Denied: This portal is strictly restricted to Super Administrators. Your account role is ${userRole}.`);
        setLoading(false);
        return;
      }

      saveSession(response.data);
      navigate("/super-admin/dashboard");
    } catch (error) {
      console.error("Super Admin Login Failed:", error);
      const rawData = error.response?.data;
      let errMsg = typeof rawData === "string" ? rawData : rawData?.message || "Invalid Super Admin credentials.";
      setFormError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail("superadmin@mediqueue.com");
    setPassword("Admin@123");
    setFormError("");
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#0F172A" }}>
      <Navbar />

      <Container maxWidth="sm" sx={{ pt: 6, pb: 8 }}>
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 4,
            background: "#1E293B",
            color: "#FFFFFF",
            borderTop: "6px solid #EF4444",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4)"
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "18px",
                background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                mb: 1.5,
                boxShadow: "0 8px 18px rgba(239, 68, 68, 0.3)"
              }}
            >
              <Security fontSize="large" />
            </Box>
            <Box sx={{ mb: 1 }}>
              <Chip label="HIGH SECURITY SYSTEM PORTAL" color="error" size="small" sx={{ fontWeight: 800 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#FFFFFF" }}>
              Super Admin Console
            </Typography>
            <Typography variant="body2" sx={{ color: "#94A3B8", mt: 0.5 }}>
              Platform Master Administration & Partner Hospital Management
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
              label="Super Admin Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (formError) setFormError("");
              }}
              placeholder="superadmin@mediqueue.com"
              sx={{
                "& .MuiOutlinedInput-root": { color: "#FFF", bgcolor: "#0F172A" },
                "& .MuiInputLabel-root": { color: "#94A3B8" }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: "#94A3B8" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Master Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (formError) setFormError("");
              }}
              sx={{
                "& .MuiOutlinedInput-root": { color: "#FFF", bgcolor: "#0F172A" },
                "& .MuiInputLabel-root": { color: "#94A3B8" }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "#94A3B8" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: "#94A3B8" }}>
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
                background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"
              }}
            >
              {loading ? "Authenticating Master Key..." : "Login to Master Console"}
            </Button>
          </form>

          {/* Quick Demo Credentials Filler */}
          <Divider sx={{ my: 3, borderColor: "#334155" }}>
            <Chip
              icon={<FlashOn fontSize="small" />}
              label="Super Admin Demo Credentials"
              size="small"
              sx={{ fontWeight: 700, fontSize: "0.75rem", color: "#FFF", bgcolor: "#334155" }}
            />
          </Divider>

          <Box sx={{ textAlign: "center" }}>
            <Chip
              label="Fill Super Admin Demo (superadmin@mediqueue.com / Admin@123)"
              color="error"
              variant="outlined"
              onClick={fillDemo}
              sx={{ cursor: "pointer", fontWeight: 700, py: 2, px: 1 }}
            />
          </Box>

          {/* Patient Portal Switch Link */}
          <Box sx={{ textAlign: "center", mt: 3, pt: 2, borderTop: "1px solid #334155" }}>
            <Typography variant="body2" sx={{ color: "#94A3B8" }}>
              Public user?{" "}
              <Typography
                component={Link}
                to="/login"
                variant="body2"
                sx={{ color: "#38BDF8", fontWeight: 700, textDecoration: "none" }}
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

export default SuperAdminLogin;
