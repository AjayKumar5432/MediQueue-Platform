import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Paper,
  Avatar,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  ConfirmationNumber,
  MedicalServices,
  AdminPanelSettings,
  Security,
  CheckCircle,
  ArrowForward,
  FlashOn,
  LocalHospital,
  Search,
  VerifiedUser,
  AccessTime,
  Star,
  Speed,
  Email,
  NotificationsActive,
  TrendingUp
} from "@mui/icons-material";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import LiveQueueCard from "../../components/LiveQueueCard/LiveQueueCard";
import { isLoggedIn, getRole, getHospitalId } from "../../utils/session";

import { getDepartmentsByHospital } from "../../api/hospitalDepartmentApi";


const DB_HOSPITALS = [
  {
    hospitalId: 1,
    hospitalName: "Apollo Hospital",
    city: "Hyderabad",
    state: "Telangana",
    address: "Jubilee Hills, Apollo City",
    phoneNumber: "9876543210",
    email: "apollo@gmail.com"
  },
  {
    hospitalId: 2,
    hospitalName: "AIG Hospitals",
    city: "Hyderabad",
    state: "Telangana",
    address: "Mindspace Road, Gachibowli",
    phoneNumber: "04042444244",
    email: "aighospitals@gmail.com"
  },
  {
    hospitalId: 3,
    hospitalName: "Ankura Hospital For Women&Childern",
    city: "Hyderabad",
    state: "Telangana",
    address: "KPHB Pillar no 787",
    phoneNumber: "7234567890",
    email: "AnkuraHospital@gmail.com"
  },
  {
    hospitalId: 4,
    hospitalName: "Yashoda Hospital",
    city: "Hyderabad",
    state: "Telangana",
    address: "Kothaguda JNTU to Hitech City Main Road",
    phoneNumber: "9012345678",
    email: "Yashoda@gmail.com"
  }
];

function Home() {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState(DB_HOSPITALS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChip, setSelectedChip] = useState("All");

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewHospital, setPreviewHospital] = useState(null);
  const [previewDepartments, setPreviewDepartments] = useState([]);
  const [loadingPreviewDepts, setLoadingPreviewDepts] = useState(false);


  // Plan A: Smart Hospital Action Button Configuration based on User Role
  const getHospitalActionConfig = (hospital) => {
    if (!isLoggedIn()) {
      return {
        label: `Book Token at ${hospital.hospitalName?.split(" ")[0] || "Hospital"}`,
        color: "primary",
        variant: "contained",
        action: () => navigate("/login")
      };
    }

    const role = getRole();
    if (role === "CUSTOMER") {
      return {
        label: `Book Token at ${hospital.hospitalName?.split(" ")[0] || "Hospital"}`,
        color: "primary",
        variant: "contained",
        action: () => navigate(`/customer/book-token?hospitalId=${hospital.hospitalId}`)
      };
    }

    if (role === "SUPER_ADMIN") {
      return {
        label: `Manage ${hospital.hospitalName?.split(" ")[0] || "Hospital"} Facility`,
        color: "error",
        variant: "contained",
        action: () => navigate("/super-admin/hospitals")
      };
    }

    if (role === "HOSPITAL_ADMIN") {
      const myHospitalId = getHospitalId();
      if (myHospitalId && String(myHospitalId) === String(hospital.hospitalId)) {
        return {
          label: "Manage Staff & Queues",
          color: "secondary",
          variant: "contained",
          action: () => navigate("/hospital-admin/staff")
        };
      }
      return {
        label: `View ${hospital.hospitalName?.split(" ")[0] || "Hospital"} Info`,
        color: "info",
        variant: "outlined",
        action: () => handleOpenPreviewModal(hospital)
      };
    }

    if (role === "STAFF") {
      return {
        label: "View Department Queues",
        color: "primary",
        variant: "contained",
        action: () => navigate("/staff/queue")
      };
    }

    return {
      label: `Book Token at ${hospital.hospitalName?.split(" ")[0] || "Hospital"}`,
      color: "primary",
      variant: "contained",
      action: () => navigate("/login")
    };
  };

  const handleOpenPreviewModal = async (hospital) => {
    setPreviewHospital(hospital);
    setPreviewModalOpen(true);
    setLoadingPreviewDepts(true);
    try {
      const res = await getDepartmentsByHospital(hospital.hospitalId);
      setPreviewDepartments(res.data || []);
    } catch (err) {
      console.error(err);
      setPreviewDepartments([]);
    } finally {
      setLoadingPreviewDepts(false);
    }
  };

  const getAdminConsoleLink = () => {
    const role = getRole();
    if (role === "SUPER_ADMIN") return "/super-admin/dashboard";
    if (role === "HOSPITAL_ADMIN") return "/hospital-admin/dashboard";
    if (role === "STAFF") return "/staff/dashboard";
    return "/";
  };

  const getBookingDestination = (hospitalId) => {
    if (!isLoggedIn()) {
      return "/login";
    }
    const role = getRole();
    if (role === "CUSTOMER") {
      return hospitalId ? `/customer/book-token?hospitalId=${hospitalId}` : "/customer/book-token";
    }
    if (role === "SUPER_ADMIN") return "/super-admin/dashboard";
    if (role === "HOSPITAL_ADMIN") return "/hospital-admin/dashboard";
    if (role === "STAFF") return "/staff/dashboard";
    return "/login";
  };






  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const res = await axios.get("http://localhost:8080/auth/hospitals");
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setHospitals(res.data);
      } else {
        setHospitals(DB_HOSPITALS);
      }
    } catch (err) {
      console.error("Error fetching hospitals for home:", err);
      setHospitals(DB_HOSPITALS);
    }
  };


  const handleChipClick = (name) => {
    setSelectedChip(name);
    if (name === "All") {
      setSearchQuery("");
    } else {
      setSearchQuery(name);
    }
  };

  const filteredHospitals = hospitals.filter((h) => {
    if (!searchQuery.trim()) return true;
    const queryTokens = searchQuery.toLowerCase().trim().split(/\s+/);
    const targetString = `${h.hospitalName || ""} ${h.city || ""} ${h.state || ""} ${h.address || ""}`.toLowerCase();
    return queryTokens.every((token) => targetString.includes(token));
  });






  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F8FAFC", overflowX: "hidden" }}>
      <Navbar />

      {/* TOP LIVE SYSTEM ANNOUNCEMENT BANNER */}
      <Box
        sx={{
          bgcolor: "#0F172A",
          color: "#FFFFFF",
          py: 1,
          px: 2,
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
        }}
      >
        <Container maxWidth="xl">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            sx={{ overflow: "hidden" }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Chip
                icon={<FlashOn fontSize="small" sx={{ color: "#F59E0B !important" }} />}
                label="LIVE NETWORK"
                size="small"
                sx={{
                  bgcolor: "rgba(245, 158, 11, 0.15)",
                  color: "#F59E0B",
                  fontWeight: 800,
                  fontSize: "0.7rem",
                  borderRadius: "6px"
                }}
              />
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#94A3B8" }}>
                Real-Time OPD Queue Network Active • Connected Multi-Speciality Hospitals
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2} sx={{ display: { xs: "none", sm: "flex" } }}>
              <Typography variant="caption" sx={{ color: "#10B981", fontWeight: 700 }}>
                ● STOMP WebSocket Live
              </Typography>
              <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                Instant Token Tracking
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* HERO SECTION WITH GLASSMORPHISM & AI ILLUSTRATION */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          pt: { xs: 3, md: 4 },
          pb: { xs: 4, md: 5 },
          background: "linear-gradient(180deg, #E6FFFA 0%, #F8FAFC 100%)"
        }}
      >
        {/* Ambient Glow Orbs */}
        <Box
          sx={{
            position: "absolute",
            top: "-120px",
            left: "-120px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(13, 148, 136, 0.18) 0%, rgba(248, 250, 252, 0) 70%)",
            pointerEvents: "none"
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "-80px",
            right: "-120px",
            width: "550px",
            height: "550px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.14) 0%, rgba(248, 250, 252, 0) 70%)",
            pointerEvents: "none"
          }}
        />

        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "flex-start",
              gap: { xs: 4, md: 5 },
              width: "100%"
            }}
          >
            {/* Left Content Column - 50% Width */}
            <Box sx={{ flex: 1.1, width: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1.5,
                  bgcolor: "#FFFFFF",
                  color: "#0F766E",
                  px: 2.5,
                  py: 1,
                  borderRadius: "30px",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  mb: 2,
                  border: "1px solid rgba(13, 148, 136, 0.25)",
                  boxShadow: "0 4px 12px rgba(13, 148, 136, 0.08)",
                  alignSelf: "flex-start"
                }}
              >
                <LocalHospital fontSize="small" sx={{ color: "#0D9488" }} />
                Multi-Hospital Queue & Appointment Management Platform
              </Box>

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.4rem", sm: "3.2rem", md: "3.5rem" },
                  fontWeight: 900,
                  lineHeight: 1.15,
                  color: "#0F172A",
                  mb: 2,
                  letterSpacing: "-1px"
                }}
              >
                Zero Hospital Wait Times.{" "}
                <Typography
                  component="span"
                  variant="inherit"
                  sx={{
                    background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  Live OPD Tokens.
                </Typography>
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: "#475569",
                  mb: 3,
                  lineHeight: 1.7,
                  fontSize: "1.1rem",
                  fontWeight: 400,
                  maxWidth: 580
                }}
              >
                Book OPD tokens online across top multi-speciality hospitals. Monitor your live token status on your phone in real-time and step straight into the doctor's consultation room.
              </Typography>

              {/* Action Buttons */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3.5 }}>
                <Button
                  component={Link}
                  to={getBookingDestination()}
                  variant="contained"
                  size="large"
                  startIcon={<ConfirmationNumber />}

                  sx={{
                    py: 1.8,
                    px: 4,
                    fontSize: "1.05rem",
                    fontWeight: 800,
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
                    boxShadow: "0 10px 25px rgba(13, 148, 136, 0.3)"
                  }}
                >
                  Book OPD Token Now
                </Button>

                <Button
                  component={Link}
                  to="/register-hospital"
                  variant="outlined"
                  size="large"
                  startIcon={<LocalHospital />}
                  sx={{
                    py: 1.8,
                    px: 3.5,
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    borderRadius: "14px",
                    borderColor: "#CBD5E1",
                    color: "#334155",
                    bgcolor: "#FFFFFF",
                    "&:hover": { borderColor: "#0D9488", bgcolor: "#F0FDF4" }
                  }}
                >
                  Register Hospital/Hospital Admin
                </Button>
              </Stack>

              {/* Feature Checkmarks */}
              <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap sx={{ color: "#475569", mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CheckCircle sx={{ color: "#10B981", fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>Zero Physical Waiting</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CheckCircle sx={{ color: "#10B981", fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>Live WebSocket Sync</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CheckCircle sx={{ color: "#10B981", fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>PDF Receipt & Email Alert</Typography>
                </Box>
              </Stack>

              {/* Smart OPD Workflow Feature Banner Image filling lower space */}
              <Paper
                elevation={4}
                sx={{
                  width: "100%",
                  borderRadius: 4,
                  overflow: "hidden",
                  border: "3px solid #FFFFFF",
                  boxShadow: "0 10px 25px rgba(13, 148, 136, 0.12)",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-3px)" }
                }}
              >
                <Box
                  component="img"
                  src="/images/smart_opd_workflow.jpg"
                  alt="Smart OPD Hospital Application Live Queue & Consultation Status"
                  sx={{
                    width: "100%",
                    height: { xs: 280, sm: 340, md: 380 },
                    objectFit: "cover",
                    display: "block"
                  }}
                />
              </Paper>
            </Box>



            {/* Right Side Illustration & Live Queue Card Showcase */}
            <Box sx={{ flex: 1, width: "100%", display: "flex", flexDirection: "column", gap: 2, justifyContent: "flex-start" }}>
              {/* Hero Showcase Image */}
              <Paper
                elevation={6}
                sx={{
                  width: "100%",
                  borderRadius: 4,
                  overflow: "hidden",
                  border: "3px solid #FFFFFF",
                  boxShadow: "0 12px 30px rgba(13, 148, 136, 0.12)",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-3px)" }
                }}
              >
                <Box
                  component="img"
                  src="/images/hero.jpg"
                  alt="MediQueue Smart OPD Ticket App"
                  sx={{
                    width: "100%",
                    height: { xs: 180, sm: 200, md: 210 },
                    objectFit: "cover",
                    display: "block"
                  }}
                />
              </Paper>

              {/* Live STOMP Queue Status Card */}
              <Box sx={{ width: "100%" }}>
                <LiveQueueCard />
              </Box>

              {/* Verification Pill */}
              <Paper
                elevation={1}
                sx={{
                  p: 1.8,
                  borderRadius: 3,
                  bgcolor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: "#F0FDF4", color: "#10B981", width: 34, height: 34 }}>
                    <VerifiedUser fontSize="small" />
                  </Avatar>
                  <Box sx={{ textAlign: "left" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}>
                      Digital OPD Token Verification
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Scan QR & Walk Straight into Doctor's Consultation Room
                    </Typography>
                  </Box>
                </Box>

                <Chip
                  icon={<AccessTime fontSize="small" />}
                  label="Instant"
                  color="success"
                  size="small"
                  sx={{ fontWeight: 800 }}
                />
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>



      {/* STATS HIGHLIGHT BAR */}
      <Box sx={{ bgcolor: "#0F172A", color: "#FFFFFF", py: 4.5 }}>
        <Container maxWidth="xl">
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={6} md={3} sx={{ textAlign: "center" }}>
              <Typography variant="h3" sx={{ fontWeight: 900, color: "#14B8A6", mb: 0.5 }}>
                50+
              </Typography>
              <Typography variant="body2" sx={{ color: "#94A3B8", fontWeight: 700 }}>
                Partner Hospitals
              </Typography>
            </Grid>
            <Grid item xs={6} md={3} sx={{ textAlign: "center" }}>
              <Typography variant="h3" sx={{ fontWeight: 900, color: "#38BDF8", mb: 0.5 }}>
                1,200+
              </Typography>
              <Typography variant="body2" sx={{ color: "#94A3B8", fontWeight: 700 }}>
                Specialist Doctors
              </Typography>
            </Grid>
            <Grid item xs={6} md={3} sx={{ textAlign: "center" }}>
              <Typography variant="h3" sx={{ fontWeight: 900, color: "#A855F7", mb: 0.5 }}>
                250,000+
              </Typography>
              <Typography variant="body2" sx={{ color: "#94A3B8", fontWeight: 700 }}>
                Wait Hours Saved
              </Typography>
            </Grid>
            <Grid item xs={6} md={3} sx={{ textAlign: "center" }}>
              <Typography variant="h3" sx={{ fontWeight: 900, color: "#F59E0B", mb: 0.5 }}>
                &lt; 5 mins
              </Typography>
              <Typography variant="body2" sx={{ color: "#94A3B8", fontWeight: 700 }}>
                Avg OPD Wait Time
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* LIVE PARTNER HOSPITALS SEARCH & NETWORK */}
      <Container id="hospitals-section" maxWidth="xl" sx={{ py: 10 }}>

        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Chip label="HOSPITAL NETWORK" color="primary" size="small" sx={{ fontWeight: 800, mb: 1.5 }} />
          <Typography variant="h3" sx={{ fontWeight: 900, color: "#0F172A", mb: 1.5 }}>
            Explore Connected Multi-Speciality Hospitals
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 650, mx: "auto", mb: 3 }}>
            Instantly search for partner hospitals by name or location, view OPD departments, and book live queue tokens.
          </Typography>

          {/* Search Box */}
          <Box sx={{ maxWidth: 600, mx: "auto", mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search hospital by name (e.g. AIG, Apollo, Ankura, Yashoda) or location..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedChip("Custom");
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="primary" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "30px",
                  bgcolor: "#FFFFFF",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                  px: 1
                }
              }}
            />
          </Box>

          {/* Quick Filter: Only "All" Button */}
          <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
            <Chip
              label="All"
              clickable
              color={!searchQuery ? "primary" : "default"}
              onClick={() => {
                setSearchQuery("");
                setSelectedChip("All");
              }}
              sx={{ fontWeight: 800, px: 2.5, py: 0.5 }}
            />
          </Stack>


        </Box>

        {/* Hospital Cards Grid */}
        <Grid container spacing={3}>
          {filteredHospitals.length > 0 ? (
            filteredHospitals.map((hospital) => (

              <Grid item xs={12} sm={6} md={4} key={hospital.hospitalId || hospital.hospitalName}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.04)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": { transform: "translateY(-6px)", boxShadow: "0 20px 35px rgba(0,0,0,0.08)" }
                  }}
                >
                  <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyBetween: "space-between", gap: 1.5, mb: 2 }}>
                      <Avatar sx={{ bgcolor: "#E6FFFA", color: "#0D9488", width: 44, height: 44, fontWeight: 800 }}>
                        <LocalHospital />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}>
                          {hospital.hospitalName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          📍 {hospital.city}, {hospital.state}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, flexGrow: 1 }}>
                      {hospital.address || "Premier healthcare facility equipped with live OPD token management system."}
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                      <Chip label="OPD Live Queue" color="success" size="small" sx={{ fontWeight: 700 }} />
                      <Chip label="Multi-Speciality" size="small" sx={{ fontWeight: 600 }} />
                    </Stack>

                    {(() => {
                      const btnConfig = getHospitalActionConfig(hospital);
                      return (
                        <Button
                          onClick={btnConfig.action}
                          variant={btnConfig.variant}
                          color={btnConfig.color}
                          fullWidth
                          endIcon={<ArrowForward />}
                          sx={{ fontWeight: 800, borderRadius: "10px" }}
                        >
                          {btnConfig.label}
                        </Button>
                      );
                    })()}


                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: "center", borderRadius: 4, bgcolor: "#F1F5F9" }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#334155" }}>
                  🏥 Connected Hospitals Available
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                  Hospital admins can easily register their hospital to start managing live OPD queues.
                </Typography>
                <Button component={Link} to="/register-hospital" variant="contained" color="secondary" sx={{ fontWeight: 700 }}>
                  Register New Hospital
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>

      {/* PATIENT OPD FEATURES GRID - SEQUENTIAL 4-STEP WORKFLOW */}
      <Box sx={{ bgcolor: "#FFFFFF", py: 10, borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Chip label="SMART OPD WORKFLOW" color="primary" size="small" sx={{ fontWeight: 800, mb: 1.5 }} />
            <Typography variant="h3" sx={{ fontWeight: 900, color: "#0F172A", mb: 1.5 }}>
              Designed for Speed, Convenience & Patients
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 650, mx: "auto" }}>
              Experience a seamless 4-step digital OPD consultation journey across connected multi-speciality hospitals.
            </Typography>
          </Box>

          <Grid container spacing={3} alignItems="stretch" justifyContent="center">
            {/* Step 1: Hospital & OPD Selection */}
            <Grid item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
              <Card
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 4,
                  borderTop: "5px solid #0D9488",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.04)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": { transform: "translateY(-6px)", boxShadow: "0 20px 30px rgba(0,0,0,0.08)" }
                }}
              >
                <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "14px",
                        bgcolor: "#E6FFFA",
                        color: "#0D9488",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <LocalHospital fontSize="medium" />
                    </Box>
                    <Chip label="STEP 01" size="small" sx={{ bgcolor: "#E6FFFA", color: "#0D9488", fontWeight: 900, fontSize: "0.7rem" }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", mb: 1 }}>
                    1. Choose Hospital & OPD
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1, minHeight: 70, lineHeight: 1.6 }}>
                    Explore top multi-speciality hospitals, view OPD department details, and select target specialities.
                  </Typography>
                  <Button
                    onClick={() => {
                      const el = document.getElementById("hospitals-section");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    variant="outlined"
                    color="primary"
                    fullWidth
                    endIcon={<ArrowForward />}
                    sx={{ fontWeight: 700, borderRadius: "10px", mt: "auto" }}
                  >
                    Explore Hospitals
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Step 2: Online Token Booking */}
            <Grid item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
              <Card
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 4,
                  borderTop: "5px solid #10B981",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.04)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": { transform: "translateY(-6px)", boxShadow: "0 20px 30px rgba(0,0,0,0.08)" }
                }}
              >
                <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "14px",
                        bgcolor: "#ECFDF5",
                        color: "#10B981",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <ConfirmationNumber fontSize="medium" />
                    </Box>
                    <Chip label="STEP 02" size="small" sx={{ bgcolor: "#ECFDF5", color: "#10B981", fontWeight: 900, fontSize: "0.7rem" }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", mb: 1 }}>
                    2. Online OPD Token
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1, minHeight: 70, lineHeight: 1.6 }}>
                    Reserve your live consultation queue token from your smartphone without standing in physical lines.
                  </Typography>
                  <Button
                    component={Link}
                    to={getBookingDestination()}
                    variant="outlined"
                    color="success"
                    fullWidth
                    endIcon={<ArrowForward />}
                    sx={{ fontWeight: 700, borderRadius: "10px", mt: "auto" }}
                  >
                    Book OPD Token
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Step 3: Real-Time STOMP Queue Tracking */}
            <Grid item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
              <Card
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 4,
                  borderTop: "5px solid #6366F1",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.04)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": { transform: "translateY(-6px)", boxShadow: "0 20px 30px rgba(0,0,0,0.08)" }
                }}
              >
                <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "14px",
                        bgcolor: "#EEF2FF",
                        color: "#6366F1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <FlashOn fontSize="medium" />
                    </Box>
                    <Chip label="STEP 03" size="small" sx={{ bgcolor: "#EEF2FF", color: "#6366F1", fontWeight: 900, fontSize: "0.7rem" }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", mb: 1 }}>
                    3. Live STOMP Tracker
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1, minHeight: 70, lineHeight: 1.6 }}>
                    Monitor currently serving tokens live on your screen with instant WebSocket updates.
                  </Typography>
                  <Button
                    component={Link}
                    to={isLoggedIn() && getRole() === "CUSTOMER" ? "/customer/my-tokens" : "/login"}
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    endIcon={<ArrowForward />}
                    sx={{ fontWeight: 700, borderRadius: "10px", mt: "auto" }}
                  >
                    Track Live Queue
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Step 4: Digital PDF & Email Receipts */}
            <Grid item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
              <Card
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 4,
                  borderTop: "5px solid #8B5CF6",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.04)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": { transform: "translateY(-6px)", boxShadow: "0 20px 30px rgba(0,0,0,0.08)" }
                }}
              >
                <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "14px",
                        bgcolor: "#F3E8FF",
                        color: "#8B5CF6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Email fontSize="medium" />
                    </Box>
                    <Chip label="STEP 04" size="small" sx={{ bgcolor: "#F3E8FF", color: "#8B5CF6", fontWeight: 900, fontSize: "0.7rem" }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", mb: 1 }}>
                    4. Email & PDF Receipts
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1, minHeight: 70, lineHeight: 1.6 }}>
                    Receive instant token confirmations in your email inbox along with downloadable official PDF receipts.
                  </Typography>
                  <Button
                    component={Link}
                    to={isLoggedIn() && getRole() === "CUSTOMER" ? "/customer/my-tokens" : "/login"}
                    variant="outlined"
                    sx={{ fontWeight: 700, borderRadius: "10px", borderColor: "#8B5CF6", color: "#8B5CF6", mt: "auto" }}
                    fullWidth
                    endIcon={<ArrowForward />}
                  >
                    View Receipts
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>


      {/* FEATURE SHOWCASE WITH IMAGE */}
      <Container maxWidth="xl" sx={{ py: 10 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/images/features.jpg"
              alt="Smart OPD Technology Features"
              sx={{
                width: "100%",
                borderRadius: 5,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                border: "2px solid #E2E8F0"
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Chip label="CORE PLATFORM ADVANTAGES" color="info" size="small" sx={{ fontWeight: 800, mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 900, color: "#0F172A", mb: 3 }}>
              Engineered for Modern Healthcare Speed & Accuracy
            </Typography>

            <Stack spacing={3}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Avatar sx={{ bgcolor: "#E6FFFA", color: "#0D9488", width: 44, height: 44 }}>
                  <Speed />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0F172A" }}>
                    Real-Time STOMP WebSocket Engine
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Token counters update live on patients' phones instantly without refreshing the browser page.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Avatar sx={{ bgcolor: "#EEF2FF", color: "#6366F1", width: 44, height: 44 }}>
                  <Email />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0F172A" }}>
                    Automated Email & PDF Receipts
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Patients receive instant token confirmation emails with attached PDF receipts generated automatically.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Avatar sx={{ bgcolor: "#ECFDF5", color: "#10B981", width: 44, height: 44 }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0F172A" }}>
                    Dynamic OPD Workload Optimization
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Hospital admins set daily token limits per department to balance patient influx smoothly.
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* CALL TO ACTION BANNER */}
      <Container maxWidth="xl" sx={{ pb: 10 }}>
        <Paper
          elevation={6}
          sx={{
            p: { xs: 5, md: 8 },
            borderRadius: 6,
            background: "linear-gradient(135deg, #0F766E 0%, #0D9488 100%)",
            color: "#FFFFFF",
            textAlign: "center",
            boxShadow: "0 25px 50px rgba(13, 148, 136, 0.25)"
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>
            Experience Zero-Wait Healthcare Today
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 700, mx: "auto", mb: 4, fontWeight: 400 }}>
            Join thousands of patients and leading hospitals transforming outpatient queue management with MediQueue.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
            <Button
              component={Link}
              to="/register"
              variant="contained"
              size="large"
              sx={{
                bgcolor: "#FFFFFF",
                color: "#0F766E",
                py: 1.6,
                px: 4,
                fontWeight: 800,
                fontSize: "1.05rem",
                borderRadius: "12px",
                "&:hover": { bgcolor: "#F1F5F9" }
              }}
            >
              Book OPD Token Now
            </Button>
            <Button
              component={Link}
              to="/register-hospital"
              variant="outlined"
              size="large"
              sx={{
                color: "#FFFFFF",
                borderColor: "rgba(255, 255, 255, 0.7)",
                py: 1.6,
                px: 4,
                fontWeight: 700,
                fontSize: "1.05rem",
                borderRadius: "12px",
                "&:hover": { borderColor: "#FFFFFF", bgcolor: "rgba(255,255,255,0.1)" }
              }}
            >
              Onboard Your Hospital/Hospital Admin
            </Button>
          </Stack>
        </Paper>
      </Container>

      {/* Plan B: Admin Hospital OPD Overview Preview Modal */}
      <Dialog
        open={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4, p: 1 }
        }}
      >
        {previewHospital && (
          <>
            <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyBetween: "space-between", gap: 1.5 }}>
                <Avatar sx={{ bgcolor: "#E6FFFA", color: "#0D9488", width: 46, height: 46 }}>
                  <LocalHospital />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}>
                    {previewHospital.hospitalName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    📍 {previewHospital.address || `${previewHospital.city}, ${previewHospital.state}`}
                  </Typography>
                </Box>
                <Chip
                  label={`Logged in as ${getRole()}`}
                  color="secondary"
                  size="small"
                  sx={{ fontWeight: 800 }}
                />
              </Box>
            </DialogTitle>

            <DialogContent dividers>
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2.5, fontWeight: 600 }}>
                Notice: You are viewing this hospital's OPD structure as an Administrator ({getRole()}). Token booking is designed for Patients. To manage facility queues and staff, open your Admin Console below.
              </Alert>

              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: "#0F172A" }}>
                Hospital Specialities & OPD Departments
              </Typography>

              {loadingPreviewDepts ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress color="primary" />
                </Box>
              ) : previewDepartments.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3, bgcolor: "#F8FAFC" }}>
                  <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Healthcare facility actively operating with live OPD queues.
                  </Typography>
                </Paper>
              ) : (
                <Grid container spacing={2}>
                  {previewDepartments.map((dept) => (
                    <Grid item xs={12} sm={6} key={dept.hospitalDepartmentId}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          borderRadius: 3,
                          bgcolor: "#F8FAFC",
                          border: "1.5px solid #E2E8F0"
                        }}
                      >
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0F172A" }}>
                            {dept.departmentName}
                          </Typography>
                          <Chip
                            label={`Fee: ₹${dept.consultationFee || 0}`}
                            color="primary"
                            size="small"
                            sx={{ fontWeight: 800 }}
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 600 }}>
                          Daily Capacity: {dept.dailyTokenLimit || 50} Max Tokens
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 600 }}>
                          Avg. Wait Time: {dept.averageConsultationTime || 10} Mins / Patient
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </DialogContent>

            <DialogActions sx={{ p: 2.5, justifyContent: "space-between" }}>
              <Button
                onClick={() => setPreviewModalOpen(false)}
                variant="outlined"
                sx={{ fontWeight: 700, borderRadius: "10px", borderColor: "#CBD5E1", color: "#475569" }}
              >
                Close Preview
              </Button>
              <Button
                component={Link}
                to={getAdminConsoleLink()}
                variant="contained"
                color="primary"
                endIcon={<ArrowForward />}
                sx={{ fontWeight: 800, borderRadius: "10px" }}
              >
                Open Admin Console
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Footer />
    </Box>
  );
}

export default Home;