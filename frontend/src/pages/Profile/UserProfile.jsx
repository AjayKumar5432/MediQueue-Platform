import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  Stack,
  Divider,
  Tabs,
  Tab,
  CircularProgress,
  Chip,
  InputAdornment,
  IconButton
} from "@mui/material";
import {
  Person,
  Lock,
  Phone,
  Email,
  Save,
  VpnKey,
  Shield,
  Visibility,
  VisibilityOff,
  CheckCircle
} from "@mui/icons-material";
import { toast } from "react-toastify";
import PasswordStrengthIndicator, { isPasswordStrong } from "../../components/Common/PasswordStrengthIndicator";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { getMyProfile, updateMyProfile, changePassword } from "../../api/userApi";
import { updateSessionFullName } from "../../utils/session";

function UserProfile() {

  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [submittingPassword, setSubmittingPassword] = useState(false);

  // Profile Form State
  const [fullName, setFullNameInput] = useState("");
  const [phone, setPhoneInput] = useState("");
  const [email, setEmailInput] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [active, setActive] = useState(true);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await getMyProfile();
      const user = res.data;
      setFullNameInput(user.fullName || "");
      setPhoneInput(user.phone || "");
      setEmailInput(user.email || "");
      setRole(user.role || "CUSTOMER");
      setActive(user.active !== undefined ? user.active : true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load user profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!fullName || !phone) {
      toast.warning("Full Name and Phone Number are required.");
      return;
    }

    setSubmittingProfile(true);
    try {
      const res = await updateMyProfile({ fullName, phone, email });
      updateSessionFullName(res.data.fullName || fullName);
      toast.success("✔ Profile details updated successfully!");

    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to update profile.";
      toast.error(msg);
    } finally {
      setSubmittingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.warning("Please fill all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.warning("New password and Confirm password do not match.");
      return;
    }

    if (!isPasswordStrong(newPassword)) {
      toast.warning("New password must be at least 8 characters long and meet all 5 security requirements.");
      return;
    }

    setSubmittingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword, confirmPassword });
      toast.success("🔒 Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to change password.";
      toast.error(msg);
    } finally {
      setSubmittingPassword(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F8FAFC", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <Container maxWidth="md" sx={{ py: 5, flexGrow: 1 }}>
        {/* Header Profile Card */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
            color: "#FFFFFF",
            mb: 4
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "#0D9488",
                fontSize: "2.2rem",
                fontWeight: 900,
                boxShadow: "0 4px 14px rgba(13, 148, 136, 0.4)"
              }}
            >
              {fullName ? fullName.charAt(0).toUpperCase() : "U"}
            </Avatar>

            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 900 }}>
                {fullName || "User Account"}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                {email || phone}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                <Chip
                  label={role.replace("_", " ")}
                  size="small"
                  sx={{ bgcolor: "#0D9488", color: "#FFFFFF", fontWeight: 800 }}
                />
                <Chip
                  icon={<CheckCircle fontSize="small" sx={{ color: "#FFFFFF !important" }} />}
                  label={active ? "ACTIVE ACCOUNT" : "INACTIVE"}
                  size="small"
                  color={active ? "success" : "default"}
                  sx={{ fontWeight: 800 }}
                />
              </Stack>
            </Box>
          </Box>
        </Paper>

        {/* Tabs Bar */}
        <Paper elevation={1} sx={{ borderRadius: 3, mb: 3 }}>
          <Tabs
            value={tabIndex}
            onChange={(e, val) => setTabIndex(val)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{
              "& .MuiTab-root": { fontWeight: 800, py: 2, fontSize: "0.95rem" }
            }}
          >
            <Tab icon={<Person />} iconPosition="start" label="Personal Details" />
            <Tab icon={<Lock />} iconPosition="start" label="Change Password & Security" />
          </Tabs>
        </Paper>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* TAB 1: Edit Profile Details */}
            {tabIndex === 0 && (
              <Paper elevation={2} sx={{ p: 4, borderRadius: 4, bgcolor: "#FFFFFF" }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", mb: 1 }}>
                  👤 Edit Profile Information
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                  Update your contact phone number, email address, and personal name.
                </Typography>

                <form onSubmit={handleUpdateProfile}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        label="Full Name"
                        fullWidth
                        required
                        value={fullName}
                        onChange={(e) => setFullNameInput(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person color="primary" />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Phone Number"
                        fullWidth
                        required
                        value={phone}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        helperText="Used for SMS & token verification alerts."
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone color="primary" />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Email Address"
                        fullWidth
                        type="email"
                        value={email}
                        onChange={(e) => setEmailInput(e.target.value)}
                        helperText="Used for official receipts & account login."
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email color="primary" />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          disabled={submittingProfile}
                          startIcon={submittingProfile ? <CircularProgress size={20} color="inherit" /> : <Save />}
                          sx={{
                            py: 1.5,
                            px: 4,
                            borderRadius: 3,
                            fontWeight: 800,
                            bgcolor: "#0D9488",
                            "&:hover": { bgcolor: "#0F766E" }
                          }}
                        >
                          {submittingProfile ? "Saving..." : "Save Profile Details"}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            )}

            {/* TAB 2: Change Password */}
            {tabIndex === 1 && (
              <Paper elevation={2} sx={{ p: 4, borderRadius: 4, bgcolor: "#FFFFFF" }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", mb: 1 }}>
                  🔒 Security & Password Change
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                  Ensure your account is secure by using a strong password.
                </Typography>

                <form onSubmit={handleChangePassword}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        label="Current Password"
                        fullWidth
                        required
                        type={showCurrentPw ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <VpnKey color="warning" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowCurrentPw(!showCurrentPw)}>
                                {showCurrentPw ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="New Password"
                        fullWidth
                        required
                        type={showNewPw ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        helperText="Must meet security requirements below"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock color="primary" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowNewPw(!showNewPw)}>
                                {showNewPw ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Confirm New Password"
                        fullWidth
                        required
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Shield color="primary" />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>

                    {newPassword && (
                      <Grid item xs={12}>
                        <PasswordStrengthIndicator password={newPassword} />
                      </Grid>
                    )}

                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          disabled={submittingPassword}
                          startIcon={submittingPassword ? <CircularProgress size={20} color="inherit" /> : <Lock />}
                          sx={{
                            py: 1.5,
                            px: 4,
                            borderRadius: 3,
                            fontWeight: 800,
                            bgcolor: "#6366F1",
                            "&:hover": { bgcolor: "#4F46E5" }
                          }}
                        >
                          {submittingPassword ? "Updating..." : "Update Password"}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            )}
          </>
        )}
      </Container>

      <Footer />
    </Box>
  );
}

export default UserProfile;
