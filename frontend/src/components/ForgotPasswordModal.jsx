import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress
} from "@mui/material";
import {
  LockReset,
  Visibility,
  VisibilityOff,
  Email,
  Key,
  Lock,
  CheckCircle
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { sendForgotPasswordOtp, resetPasswordWithOtp } from "../api/authApi";
import PasswordStrengthIndicator, { isPasswordStrong } from "./Common/PasswordStrengthIndicator";

function ForgotPasswordModal({ open, handleClose, initialEmail = "" }) {
  const [step, setStep] = useState(1); // 1 = Enter Email, 2 = Enter OTP & New Password
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const resetFormState = () => {
    setStep(1);
    setEmail(initialEmail);
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(false);
  };

  const handleModalClose = () => {
    resetFormState();
    handleClose();
  };

  // Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await sendForgotPasswordOtp(email);
      setSuccessMsg(res.data?.message || `6-digit OTP code sent to ${email}`);
      toast.info(`OTP sent to ${email}`);
      setStep(2);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Unable to send OTP. Please verify your email address.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and reset password
  const handleResetPassword = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!otp || otp.trim().length !== 6) {
      setErrorMsg("Please enter the 6-digit OTP code sent to your email.");
      return;
    }

    if (!isPasswordStrong(newPassword)) {
      setErrorMsg("New password must be at least 8 characters long and meet all 5 security requirements.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please try again.");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPasswordWithOtp(email, otp.trim(), newPassword);
      toast.success("Password reset successfully! Please sign in with your new password.");
      handleModalClose();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Failed to reset password. Please check your OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleModalClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
      <DialogTitle sx={{ fontWeight: 800, pb: 1, display: "flex", alignItems: "center", gap: 1.5 }}>
        <LockReset sx={{ color: "#0D9488", fontSize: 32 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}>
            Reset Password
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {step === 1 ? "Step 1 of 2: Verify your Email" : "Step 2 of 2: Enter OTP & New Password"}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 3, fontWeight: 600 }}>
            {errorMsg}
          </Alert>
        )}

        {successMsg && (
          <Alert severity="success" sx={{ mb: 2.5, borderRadius: 3, fontWeight: 600 }}>
            {successMsg}
          </Alert>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Enter your registered email address below. We will send a 6-digit OTP verification code to reset your password.
            </Typography>

            <TextField
              fullWidth
              label="Registered Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@gmail.com"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: "#0D9488" }} />
                  </InputAdornment>
                )
              }}
              sx={{ mb: 2 }}
            />
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Enter the 6-digit OTP code sent to <strong>{email}</strong> along with your new password.
            </Typography>

            <TextField
              fullWidth
              label="6-Digit OTP Code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="e.g. 123456"
              required
              inputProps={{ maxLength: 6, style: { letterSpacing: "4px", fontWeight: "bold" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Key sx={{ color: "#0D9488" }} />
                  </InputAdornment>
                )
              }}
              sx={{ mb: 2.5 }}
            />

            <TextField
              fullWidth
              label="New Password"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "#0D9488" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ mb: newPassword ? 1 : 2.5 }}
            />

            {newPassword && (
              <Box sx={{ mb: 2 }}>
                <PasswordStrengthIndicator password={newPassword} />
              </Box>
            )}

            <TextField
              fullWidth
              label="Confirm New Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "#0D9488" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ mb: 1 }}
            />
          </form>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={handleModalClose} disabled={loading} color="inherit">
          Cancel
        </Button>

        {step === 1 ? (
          <Button
            variant="contained"
            onClick={handleSendOtp}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Email />}
            sx={{
              fontWeight: 800,
              px: 3,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)"
            }}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleResetPassword}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
            sx={{
              fontWeight: 800,
              px: 3,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)"
            }}
          >
            {loading ? "Updating..." : "Reset Password"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default ForgotPasswordModal;
