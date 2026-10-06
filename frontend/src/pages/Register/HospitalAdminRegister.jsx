import { useState, useEffect } from "react";
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
  Grid,
  Divider,
  Autocomplete,
  Chip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LocalHospital,
  Person,
  Email,
  Phone,
  Lock,
  LocationCity,
  Home as HomeIcon,
  Map,
  Search,
  AdminPanelSettings,
  MarkEmailRead,
  VpnKey
} from "@mui/icons-material";
import { toast } from "react-toastify";
import PasswordStrengthIndicator, { isPasswordStrong } from "../../components/Common/PasswordStrengthIndicator";
import axios from "axios";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { registerHospitalAdmin, registerHospital, sendOtp, verifyOtp } from "../../api/authApi";
import axiosClient from "../../api/axiosClient";


function HospitalAdminRegister() {
  const navigate = useNavigate();

  // Tab State: "HOSPITAL" for Hospital Registration, "ADMIN" for Admin Registration
  const [tab, setTab] = useState("HOSPITAL");

  // State for existing registered hospitals from backend
  const [existingHospitals, setExistingHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);

  // Form State for Hospital Registration (Tab 1)
  const [hospitalForm, setHospitalForm] = useState({
    hospitalName: "",
    address: "",
    city: "",
    state: "",
    hospitalEmail: "",
    phoneNumber: ""
  });

  // Form State for Admin Registration (Tab 2)
  const [adminForm, setAdminForm] = useState({
    hospitalName: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // OTP State for Admin Registration (Tab 2)
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const res = await axiosClient.get("/auth/hospitals");
      setExistingHospitals(res.data || []);
    } catch (err) {
      console.error("Could not fetch existing hospitals:", err);
    }
  };

  const handleHospitalFormChange = (e) => {
    setHospitalForm({
      ...hospitalForm,
      [e.target.name]: e.target.value
    });
  };

  const handleAdminFormChange = (e) => {
    setAdminForm({
      ...adminForm,
      [e.target.name]: e.target.value
    });
  };

  const handleHospitalSelectInAdminTab = (event, newValue) => {
    if (typeof newValue === "string") {
      setSelectedHospital(null);
      setAdminForm((prev) => ({ ...prev, hospitalName: newValue }));
    } else if (newValue && newValue.hospitalName) {
      setSelectedHospital(newValue);
      setAdminForm((prev) => ({
        ...prev,
        hospitalName: newValue.hospitalName
      }));
    } else {
      setSelectedHospital(null);
      setAdminForm((prev) => ({ ...prev, hospitalName: "" }));
    }
  };

  // Submit Tab 1: Hospital Registration (NO OTP as requested)
  const handleHospitalSubmit = async (e) => {
    e.preventDefault();

    const { hospitalName, address, city, state, hospitalEmail, phoneNumber } = hospitalForm;

    if (!hospitalName || !address || !city || !state || !hospitalEmail || !phoneNumber) {
      toast.warning("Please fill in all required hospital details.");
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast.warning("Hospital Phone Number must be a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);

      const requestData = {
        hospitalName,
        address,
        city,
        state,
        phoneNumber,
        email: hospitalEmail
      };

      await registerHospital(requestData);
      toast.success("🏥 Hospital Application Submitted! Status: Pending Approval by Super Admin.");


      await fetchHospitals();

      setAdminForm((prev) => ({
        ...prev,
        hospitalName: hospitalName
      }));

      setHospitalForm({
        hospitalName: "",
        address: "",
        city: "",
        state: "",
        hospitalEmail: "",
        phoneNumber: ""
      });

      setTimeout(() => {
        setTab("ADMIN");
        toast.info(`Please enter your Admin details to create an administrator account for ${hospitalName}.`);
      }, 1200);
    } catch (error) {
      console.error("Hospital Registration Error:", error);
      let errMsg = "Hospital Registration failed.";
      if (error.response?.data?.message && typeof error.response.data.message === "string") {
        errMsg = error.response.data.message;
      } else if (typeof error.response?.data === "string") {
        errMsg = error.response.data;
      }
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }

  };

  // Step 1 of Tab 2: Validate Admin Form & Send OTP
  const handleInitiateAdminRegister = async (e) => {
    e.preventDefault();

    const { hospitalName, fullName, email, phone, password, confirmPassword } = adminForm;

    if (!hospitalName || !fullName || !email || !phone || !password || !confirmPassword) {
      toast.warning("Please fill in all required admin registration fields.");
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      toast.warning("Admin Phone Number must be a valid 10-digit mobile number starting with 6-9.");
      return;
    }

    if (!isPasswordStrong(password)) {
      toast.warning("Password must be at least 8 characters long and meet all 5 security requirements.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // Send OTP to Admin Email with pre-validation
      await sendOtp({
        email: adminForm.email,
        phone: adminForm.phone,
        hospitalName: adminForm.hospitalName
      });
      toast.info(`Verification OTP sent to ${adminForm.email}`);

      // Open OTP Modal
      setOtpOpen(true);
    } catch (error) {
      console.error("Admin OTP Error:", error);
      let errMsg = error.response?.data?.message || "Failed to send OTP to email. Please verify work email address.";
      if (typeof errMsg === "string" && errMsg.includes("Query did not return a unique result")) {
        errMsg = "This hospital already has an assigned active administrator, or this email / mobile number is already registered.";
      }
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2 of Tab 2: Verify OTP & Submit Admin Registration
  const handleVerifyOtpAndRegisterAdmin = async () => {
    if (!otpCode || otpCode.trim().length !== 6) {
      toast.warning("Please enter the complete 6-digit OTP code.");
      return;
    }

    try {
      setOtpLoading(true);

      // Verify OTP via Backend
      const verifyRes = await verifyOtp({
        email: adminForm.email,
        otp: otpCode.trim()
      });

      if (verifyRes.data?.verified) {
        toast.success("Admin Email Verified Successfully!");

        const { hospitalName, fullName, email, phone, password } = adminForm;
        const hosp = selectedHospital || existingHospitals.find(h => h.hospitalName?.toLowerCase() === hospitalName.toLowerCase());

        const requestData = {
          hospitalName: hosp?.hospitalName || hospitalName,
          address: hosp?.address || "Registered Hospital Facility",
          city: hosp?.city || "Registered City",
          state: hosp?.state || "Registered State",
          phoneNumber: hosp?.phoneNumber || phone,
          hospitalEmail: hosp?.email || email,
          fullName,
          email,
          phone,
          password
        };

        await registerHospitalAdmin(requestData);
        toast.success("Admin Application Submitted Successfully! Pending Super Admin Review.");

        setOtpOpen(false);

        setTimeout(() => {
          navigate("/admin/login");
        }, 1800);
      } else {
        toast.error(verifyRes.data?.message || "Invalid or expired OTP. Please try again.");
      }
    } catch (error) {
      console.error("Admin Registration Error:", error);
      let errMsg = "Invalid or expired OTP code.";
      if (error.response?.data?.message) {
        errMsg = error.response.data.message;
      }
      toast.error(errMsg);
    } finally {
      setOtpLoading(false);
    }
  };

  // Resend OTP for Admin
  const handleResendAdminOtp = async () => {
    try {
      setOtpLoading(true);
      await sendOtp({
        email: adminForm.email,
        phone: adminForm.phone,
        hospitalName: adminForm.hospitalName
      });
      toast.success(`New OTP code resent to ${adminForm.email}`);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to resend OTP code.";
      toast.error(errMsg);
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F8FAFC", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <Container maxWidth="md" sx={{ pt: 5, pb: 8, flexGrow: 1 }}>
        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            background: "#FFFFFF",
            boxShadow: "0 20px 40px rgba(0,0,0,0.06)"
          }}
        >
          {/* Header Title */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "20px",
                background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                mb: 2,
                boxShadow: "0 10px 20px rgba(13, 148, 136, 0.25)"
              }}
            >
              <LocalHospital fontSize="large" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#0F172A" }}>
              Hospital & Admin Portal Onboarding
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.8, fontSize: "0.95rem" }}>
              Choose your registration type below to onboard a new healthcare facility or create an administrator account
            </Typography>
          </Box>

          {/* 2-Option Tab Switcher */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: "#F1F5F9",
              p: 0.8,
              borderRadius: "14px",
              mb: 4,
              border: "1px solid #E2E8F0"
            }}
          >
            <Tabs
              value={tab}
              onChange={(e, newTab) => setTab(newTab)}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              sx={{
                "& .MuiTabs-indicator": {
                  height: "100%",
                  borderRadius: "10px",
                  bgcolor: "#0D9488",
                  zIndex: 0
                },
                "& .MuiTab-root": {
                  zIndex: 1,
                  fontWeight: 800,
                  fontSize: { xs: "0.85rem", sm: "1rem" },
                  py: 1.5,
                  borderRadius: "10px",
                  transition: "color 0.2s ease",
                  color: "#475569",
                  "&.Mui-selected": {
                    color: "#FFFFFF"
                  }
                }
              }}
            >
              <Tab icon={<LocalHospital fontSize="small" />} iconPosition="start" label="Hospital Registration" value="HOSPITAL" />
              <Tab icon={<AdminPanelSettings fontSize="small" />} iconPosition="start" label="Admin Registration" value="ADMIN" />
            </Tabs>
          </Paper>

          {/* ================= OPTION 1: HOSPITAL REGISTRATION (NO OTP) ================= */}
          {tab === "HOSPITAL" && (
            <form onSubmit={handleHospitalSubmit}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F766E", mb: 0.5 }}>
                  🏥 Register New Hospital Facility
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Enter facility details to register your healthcare hospital on MediQueue. Admin user accounts can be created in Tab 2 after facility registration.
                </Typography>

              </Box>

              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Hospital Name"
                    name="hospitalName"
                    value={hospitalForm.hospitalName}
                    onChange={handleHospitalFormChange}
                    placeholder="e.g. Sunshine Super Speciality Hospital"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocalHospital color="primary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="City"
                    name="city"
                    value={hospitalForm.city}
                    onChange={handleHospitalFormChange}
                    placeholder="e.g. Hyderabad"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationCity color="action" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="State"
                    name="state"
                    value={hospitalForm.state}
                    onChange={handleHospitalFormChange}
                    placeholder="e.g. Telangana"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Map color="action" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Street Address / Location"
                    name="address"
                    value={hospitalForm.address}
                    onChange={handleHospitalFormChange}
                    placeholder="e.g. Road No. 36, Jubilee Hills, Hyderabad"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <HomeIcon color="action" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Hospital Official Email"
                    type="email"
                    name="hospitalEmail"
                    value={hospitalForm.hospitalEmail}
                    onChange={handleHospitalFormChange}
                    placeholder="e.g. contact@sunshinehospital.com"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Hospital Phone Number"
                    name="phoneNumber"
                    value={hospitalForm.phoneNumber}
                    onChange={handleHospitalFormChange}
                    placeholder="e.g. 9876543210"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="action" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  mt: 4,
                  py: 1.8,
                  fontSize: "1.05rem",
                  fontWeight: 800,
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
                  boxShadow: "0 10px 25px rgba(13, 148, 136, 0.3)"
                }}
              >
                {loading ? "Submitting Hospital..." : "Submit Hospital Registration"}
              </Button>
            </form>
          )}

          {/* ================= OPTION 2: ADMIN REGISTRATION (WITH EMAIL OTP) ================= */}
          {tab === "ADMIN" && (
            <form onSubmit={handleInitiateAdminRegister}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F766E", mb: 0.5 }}>
                  👨‍⚕️ Create Hospital Administrator Account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Select a registered hospital from the dropdown or search by name to create your admin user credentials with OTP email verification.
                </Typography>
              </Box>

              <Grid container spacing={2.5}>
                {/* Searchable Hospital Autocomplete */}
                <Grid item xs={12}>
                  <Autocomplete
                    freeSolo
                    openOnFocus
                    options={existingHospitals}
                    value={selectedHospital || (adminForm.hospitalName ? adminForm.hospitalName : null)}
                    inputValue={adminForm.hospitalName}
                    getOptionLabel={(option) => {
                      if (typeof option === "string") return option;
                      return option.hospitalName || "";
                    }}
                    onChange={handleHospitalSelectInAdminTab}
                    onInputChange={(event, newInputValue) => {
                      setAdminForm((prev) => ({ ...prev, hospitalName: newInputValue }));
                      if (selectedHospital && selectedHospital.hospitalName !== newInputValue) {
                        setSelectedHospital(null);
                      }
                    }}
                    renderOption={(props, option) => (
                      <Box component="li" {...props} key={option.hospitalId || option.hospitalName}>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography variant="body1" sx={{ fontWeight: 800, color: "#0F172A" }}>
                            🏥 {option.hospitalName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            📍 {option.city}, {option.state} • {option.email || option.phoneNumber || "Verified Facility"}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        required
                        label="Select Hospital (Search or Type Name)"
                        placeholder="Search hospital e.g. AIG Hospitals, Apollo, Ankura, Yashoda..."
                        helperText={selectedHospital ? `✓ Selected: ${selectedHospital.hospitalName} (${selectedHospital.city})` : "Type or select a registered hospital"}
                        InputProps={{
                          ...(params?.InputProps || {}),
                          startAdornment: (
                            <>
                              <InputAdornment position="start">
                                <Search color="primary" />
                              </InputAdornment>
                              {params?.InputProps?.startAdornment || null}
                            </>
                          )
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Admin Full Name"
                    name="fullName"
                    value={adminForm.fullName}
                    onChange={handleAdminFormChange}
                    placeholder="e.g. Dr. Ramesh Kumar"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Admin Email Address (OTP will be sent here)"
                    type="email"
                    name="email"
                    value={adminForm.email}
                    onChange={handleAdminFormChange}
                    placeholder="e.g. ramesh@hospital.com"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    required
                    label="Admin Mobile Number"
                    name="phone"
                    value={adminForm.phone}
                    onChange={handleAdminFormChange}
                    placeholder="e.g. 9876543210"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="action" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    required
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={adminForm.password}
                    onChange={handleAdminFormChange}
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
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    required
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={adminForm.confirmPassword}
                    onChange={handleAdminFormChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                {adminForm.password && (
                  <Grid item xs={12}>
                    <PasswordStrengthIndicator password={adminForm.password} />
                  </Grid>
                )}
              </Grid>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  mt: 4,
                  py: 1.8,
                  fontSize: "1.05rem",
                  fontWeight: 800,
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
                  boxShadow: "0 10px 25px rgba(13, 148, 136, 0.3)"
                }}
              >
                {loading ? "Sending OTP to Admin Email..." : "Send OTP & Submit Admin Application"}
              </Button>
            </form>
          )}

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Already registered as Hospital Admin?{" "}
              <Typography
                component={Link}
                to="/admin/login"
                variant="body2"
                sx={{ color: "#0D9488", fontWeight: 800, textDecoration: "none" }}
              >
                Sign In to Admin Portal
              </Typography>
            </Typography>
          </Box>
        </Paper>
      </Container>

      {/* ADMIN OTP VERIFICATION DIALOG MODAL */}
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
          Verify Admin Work Email
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mb: 3 }}>
            We have sent a 6-digit OTP verification code to:
            <br />
            <strong>{adminForm.email}</strong>
          </Typography>

          <TextField
            fullWidth
            autoFocus
            label="Enter 6-Digit Admin OTP"
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
            onClick={handleVerifyOtpAndRegisterAdmin}
            disabled={otpLoading}
            sx={{ py: 1.4, fontWeight: 800, borderRadius: "10px", background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)" }}
          >
            {otpLoading ? <CircularProgress size={24} color="inherit" /> : "Verify OTP & Submit Application"}
          </Button>

          <Button
            variant="text"
            color="primary"
            onClick={handleResendAdminOtp}
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

export default HospitalAdminRegister;
