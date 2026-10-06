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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from "@mui/material";
import { Visibility, VisibilityOff, LocalHospital, Person, Email, Phone, Lock, MarkEmailRead, VpnKey } from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "axios";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { register, sendOtp, verifyOtp } from "../../api/authApi";
import PasswordStrengthIndicator, { isPasswordStrong } from "../../components/Common/PasswordStrengthIndicator";

function Register() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // OTP State
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  // Step 1: Validate Form & Send OTP Email
  const handleInitiateRegister = async (e) => {
    if (e) e.preventDefault();

    if (!user.fullName || !user.email || !user.phone || !user.password || !user.confirmPassword) {
      toast.warning("Please fill in all required fields.");
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(user.phone)) {
      toast.warning("Phone number must be a valid 10-digit number starting with 6-9.");
      return;
    }

    if (!isPasswordStrong(user.password)) {
      toast.warning("Password must be at least 8 characters long and meet all 5 security requirements.");
      return;
    }

    if (user.password !== user.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // Send OTP to email via Backend with pre-validation
      await sendOtp({
        email: user.email,
        phone: user.phone
      });
      toast.info(`Verification OTP sent to ${user.email}`);

      // Open OTP Dialog
      setOtpOpen(true);
    } catch (error) {
      console.error("OTP Generation Error:", error);
      const errMsg = error.response?.data?.message || "Failed to send OTP to email. Please check your email address.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Complete Registration
  const handleVerifyAndRegister = async () => {
    if (!otpCode || otpCode.trim().length !== 6) {
      toast.warning("Please enter the complete 6-digit OTP code.");
      return;
    }

    try {
      setOtpLoading(true);

      // Verify OTP via Backend
      const verifyRes = await verifyOtp({
        email: user.email,
        otp: otpCode.trim()
      });

      if (verifyRes.data?.verified) {
        toast.success("Email Verified Successfully!");

        // Register Account in Database
        const registerData = {
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          password: user.password
        };

        await register(registerData);
        toast.success("Account Created Successfully! Redirecting to login...");

        setOtpOpen(false);

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        toast.error(verifyRes.data?.message || "Invalid or expired OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      const errMsg = error.response?.data?.message || "Invalid or expired OTP code.";
      toast.error(errMsg);
    } finally {
      setOtpLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      setOtpLoading(true);
      await sendOtp({
        email: user.email,
        phone: user.phone
      });
      toast.success(`New OTP resent to ${user.email}`);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to resend OTP.";
      toast.error(errMsg);
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F8FAFC", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <Container maxWidth="sm" sx={{ pt: 5, pb: 8, flexGrow: 1 }}>
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 4,
            background: "#FFFFFF",
            boxShadow: "0 20px 40px rgba(0,0,0,0.06)"
          }}
        >
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
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Create Patient Account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Register with OTP email verification to book live OPD tokens
            </Typography>
          </Box>

          <form onSubmit={handleInitiateRegister}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              margin="normal"
              value={user.fullName}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              label="Email Address (OTP will be sent here)"
              type="email"
              name="email"
              margin="normal"
              value={user.email}
              onChange={handleChange}
              placeholder="e.g. patient@gmail.com"
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
              label="Phone Number"
              name="phone"
              margin="normal"
              value={user.phone}
              onChange={handleChange}
              placeholder="e.g. 9876543210"
              helperText="10-digit mobile number starting with 6, 7, 8, or 9"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              margin="normal"
              type={showPassword ? "text" : "password"}
              value={user.password}
              onChange={handleChange}
              helperText="Must meet security requirements below"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            {user.password && (
              <Box sx={{ mb: 1 }}>
                <PasswordStrengthIndicator password={user.password} />
              </Box>
            )}

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              margin="normal"
              type={showPassword ? "text" : "password"}
              value={user.confirmPassword}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
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
              sx={{ mt: 3, mb: 2, py: 1.5, fontSize: "1rem", fontWeight: 800, background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)" }}
            >
              {loading ? "Sending OTP to Email..." : "Send OTP & Verify Email"}
            </Button>
          </form>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Typography
                component={Link}
                to="/login"
                variant="body2"
                sx={{ color: "primary.main", fontWeight: 700, textDecoration: "none" }}
              >
                Sign In Here
              </Typography>
            </Typography>
          </Box>
        </Paper>
      </Container>

      {/* OTP VERIFICATION DIALOG MODAL */}
      <Dialog
        open={otpOpen}
        onClose={() => !otpLoading && setOtpOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4, p: 2 }
        }}
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: 800, color: "#0F766E" }}>
          <MarkEmailRead sx={{ fontSize: 44, color: "#0D9488", mb: 1, display: "block", mx: "auto" }} />
          Verify Your Email Address
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mb: 3 }}>
            We have sent a 6-digit OTP verification code to:
            <br />
            <strong>{user.email}</strong>
          </Typography>

          <TextField
            fullWidth
            autoFocus
            label="Enter 6-Digit OTP"
            placeholder="e.g. 123456"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            inputProps={{ maxLength: 6, style: { textAlign: "center", fontSize: "1.4rem", letterSpacing: "8px", fontWeight: "bold" } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKey color="primary" />
                </InputAdornment>
              )
            }}
          />
        </DialogContent>

        <DialogActions sx={{ flexDirection: "column", gap: 1.5, px: 3, pb: 3 }}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleVerifyAndRegister}
            disabled={otpLoading}
            sx={{ py: 1.4, fontWeight: 800, borderRadius: "10px", background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)" }}
          >
            {otpLoading ? <CircularProgress size={24} color="inherit" /> : "Verify OTP & Complete Registration"}
          </Button>

          <Button
            variant="text"
            color="primary"
            onClick={handleResendOtp}
            disabled={otpLoading}
            sx={{ fontWeight: 700 }}
          >
            Resend OTP Code
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
}

export default Register;