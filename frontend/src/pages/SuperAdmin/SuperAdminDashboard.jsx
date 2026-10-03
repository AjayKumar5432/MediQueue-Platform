import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Avatar,
  LinearProgress
} from "@mui/material";
import {
  LocalHospital,
  MedicalServices,
  AdminPanelSettings,
  Schema,
  ArrowForward,
  Assessment,
  TrendingUp,
  ConfirmationNumber,
  HourglassTop,
  VerifiedUser,
  Public,
  Sync,
  HistoryEdu
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { getFullName } from "../../utils/session";
import { getHospitals } from "../../api/hospitalApi";
import { getHospitalAdmins } from "../../api/hospitalAdminApi";

function SuperAdminDashboard() {
  const adminName = getFullName() || "Super Admin";

  const [hospitalsCount, setHospitalsCount] = useState(4);
  const [adminsCount, setAdminsCount] = useState(4);
  const [pendingCount, setPendingCount] = useState(1);

  useEffect(() => {
    loadSystemStats();
  }, []);

  const loadSystemStats = async () => {
    try {
      const [hospRes, adminRes] = await Promise.all([
        getHospitals(),
        getHospitalAdmins()
      ]);
      if (hospRes.data) setHospitalsCount(hospRes.data.length);
      if (adminRes.data) {
        setAdminsCount(adminRes.data.length);
        const pending = adminRes.data.filter(
          (a) => a.status === "PENDING" || (!a.active && a.status !== "INACTIVE")
        ).length;
        setPendingCount(pending);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const hospitalDistribution = [
    { city: "Hyderabad", count: hospitalsCount > 0 ? hospitalsCount : 4, percentage: 65, color: "#EF4444" },
    { city: "Secunderabad", count: 2, percentage: 20, color: "#0D9488" },
    { city: "Cyberabad", count: 1, percentage: 15, color: "#6366F1" }
  ];

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Banner */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
            color: "#FFFFFF",
            mb: 4,
            boxShadow: "0 12px 30px rgba(15, 23, 42, 0.25)"
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                <Chip
                  label="SUPER ADMIN SYSTEM ANALYTICS"
                  size="small"
                  sx={{ bgcolor: "#EF4444", color: "#FFFFFF", fontWeight: 800 }}
                />
                <Chip
                  icon={<Sync sx={{ color: "#10B981 !important" }} />}
                  label="Platform Live Status"
                  size="small"
                  sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "#FFFFFF", fontWeight: 700 }}
                />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                System Super Admin Console
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 600 }}>
                Welcome back, {adminName}. Onboard hospitals, manage medical departments, review onboarding applications, and monitor network analytics.
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button
                  component={Link}
                  to="/super-admin/hospital-admins"
                  variant="contained"
                  size="large"
                  startIcon={<AdminPanelSettings />}
                  sx={{
                    bgcolor: "#EF4444",
                    color: "#FFFFFF",
                    fontWeight: 800,
                    "&:hover": { bgcolor: "#DC2626" }
                  }}
                >
                  Review Pending Admins ({pendingCount})
                </Button>
                <Button
                  component={Link}
                  to="/super-admin/hospitals"
                  variant="outlined"
                  size="large"
                  startIcon={<LocalHospital />}
                  sx={{
                    borderColor: "rgba(255,255,255,0.4)",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    "&:hover": { borderColor: "#FFFFFF", bgcolor: "rgba(255,255,255,0.1)" }
                  }}
                >
                  Manage Network Hospitals
                </Button>
                <Button
                  component={Link}
                  to="/super-admin/audit-logs"
                  variant="outlined"
                  size="large"
                  startIcon={<HistoryEdu />}
                  sx={{
                    borderColor: "rgba(255,255,255,0.4)",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    "&:hover": { borderColor: "#FFFFFF", bgcolor: "rgba(255,255,255,0.1)" }
                  }}
                >
                  Audit Trail & Logs
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* ================= ANALYTICS KPI SUMMARY ROW ================= */}
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A", mb: 2.5, display: "flex", alignItems: "center", gap: 1 }}>
          <Assessment sx={{ color: "#EF4444" }} /> Platform Network Analytics
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Metric 1: Total Hospitals */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 4, bgcolor: "#FFFFFF", borderTop: "4px solid #EF4444" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: "#64748B", textTransform: "uppercase" }}>
                  Partner Hospitals
                </Typography>
                <Avatar sx={{ bgcolor: "#FEE2E2", color: "#EF4444", width: 38, height: 38 }}>
                  <LocalHospital fontSize="small" />
                </Avatar>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: "#0F172A" }}>
                {hospitalsCount}
              </Typography>

            </Paper>
          </Grid>

          {/* Metric 2: Pending Applications */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 4, bgcolor: "#FFFFFF", borderTop: "4px solid #F59E0B" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: "#64748B", textTransform: "uppercase" }}>
                  Pending Admin Reviews
                </Typography>
                <Avatar sx={{ bgcolor: "#FEF3C7", color: "#D97706", width: 38, height: 38 }}>
                  <HourglassTop fontSize="small" />
                </Avatar>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: "#0F172A" }}>
                {pendingCount}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#D97706", mt: 1, display: "block" }}>
                Requires Super Admin Approval
              </Typography>
            </Paper>
          </Grid>

          {/* Metric 3: Active Administrators */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 4, bgcolor: "#FFFFFF", borderTop: "4px solid #0D9488" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: "#64748B", textTransform: "uppercase" }}>
                  Hospital Administrators
                </Typography>
                <Avatar sx={{ bgcolor: "#E6FFFA", color: "#0D9488", width: 38, height: 38 }}>
                  <VerifiedUser fontSize="small" />
                </Avatar>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: "#0F172A" }}>
                {adminsCount}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#0D9488", mt: 1, display: "block" }}>
                Active System Accounts
              </Typography>
            </Paper>
          </Grid>

          {/* Metric 4: System Network OPD Volume */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 4, bgcolor: "#FFFFFF", borderTop: "4px solid #6366F1" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: "#64748B", textTransform: "uppercase" }}>
                  Platform OPD Tokens Today
                </Typography>
                <Avatar sx={{ bgcolor: "#EEF2FF", color: "#6366F1", width: 38, height: 38 }}>
                  <ConfirmationNumber fontSize="small" />
                </Avatar>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: "#0F172A" }}>
                580+
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}>
                <TrendingUp sx={{ color: "#10B981", fontSize: 18 }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#10B981" }}>
                  +18.5% Network Growth
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* System Geographic Breakdown */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3.5, borderRadius: 4, bgcolor: "#FFFFFF", height: "100%" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A" }}>
                    Hospital Regional Distribution
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Hospital network coverage across metro cities
                  </Typography>
                </Box>
                <Chip icon={<Public />} label="Telangana Region" size="small" sx={{ fontWeight: 700 }} />
              </Box>

              <Stack spacing={2.5}>
                {hospitalDistribution.map((item) => (
                  <Box key={item.city}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "#334155" }}>
                        📍 {item.city}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: item.color }}>
                        {item.count} Hospitals ({item.percentage}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={item.percentage}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: "#F1F5F9",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 5,
                          bgcolor: item.color
                        }
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Quick System Action Alert */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3.5, borderRadius: 4, bgcolor: "#FFFFFF", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", mb: 1 }}>
                  ⚡ Super Admin Immediate Tasks
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Review new onboarding applications submitted by hospital administrators. Approving a request grants the admin immediate access to their dedicated Hospital Portal.
                </Typography>

                <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: "#FFF7ED", border: "1px dashed #FED7AA", mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: "#C2410C" }}>
                    🔔 {pendingCount} Hospital Admin Application(s) Awaiting Review
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                    Automated email notifications will be sent to the administrator upon approval or rejection.
                  </Typography>
                </Box>
              </Box>

              <Button
                component={Link}
                to="/super-admin/hospital-admins"
                variant="contained"
                color="error"
                fullWidth
                size="large"
                endIcon={<ArrowForward />}
                sx={{ borderRadius: "12px", fontWeight: 800 }}
              >
                Go to Admin Approval Console
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* System Administration Cards */}
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A", mb: 2.5 }}>
          System Administration Modules
        </Typography>

        <Grid container spacing={3}>
          {/* Hospitals */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: "100%", p: 1, borderRadius: 4, boxShadow: "0 10px 25px rgba(0,0,0,0.04)" }}>
              <CardContent sx={{ py: 3 }}>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: "14px",
                    bgcolor: "error.light",
                    color: "error.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2
                  }}
                >
                  <LocalHospital sx={{ fontSize: 28 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Hospitals ({hospitalsCount})
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Onboard, update, or soft delete partner hospitals.
                </Typography>
                <Button
                  component={Link}
                  to="/super-admin/hospitals"
                  variant="contained"
                  color="error"
                  fullWidth
                  endIcon={<ArrowForward />}
                  sx={{ borderRadius: "10px", fontWeight: 700 }}
                >
                  Manage Hospitals
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Departments */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: "100%", p: 1, borderRadius: 4, boxShadow: "0 10px 25px rgba(0,0,0,0.04)" }}>
              <CardContent sx={{ py: 3 }}>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: "14px",
                    bgcolor: "primary.light",
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2
                  }}
                >
                  <MedicalServices sx={{ fontSize: 28 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Global Departments
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Define medical specializations catalog (Cardiology, OPD, etc).
                </Typography>
                <Button
                  component={Link}
                  to="/super-admin/departments"
                  variant="contained"
                  color="primary"
                  fullWidth
                  endIcon={<ArrowForward />}
                  sx={{ borderRadius: "10px", fontWeight: 700 }}
                >
                  Manage Departments
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Hospital-Department Mappings */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: "100%", p: 1, borderRadius: 4, boxShadow: "0 10px 25px rgba(0,0,0,0.04)" }}>
              <CardContent sx={{ py: 3 }}>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: "14px",
                    bgcolor: "secondary.light",
                    color: "secondary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2
                  }}
                >
                  <Schema sx={{ fontSize: 28 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Hospital Mappings
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Map departments to hospitals, set token limits & fees.
                </Typography>
                <Button
                  component={Link}
                  to="/super-admin/hospital-departments"
                  variant="contained"
                  color="secondary"
                  fullWidth
                  endIcon={<ArrowForward />}
                  sx={{ borderRadius: "10px", fontWeight: 700 }}
                >
                  Manage Mappings
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Hospital Admins */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: "100%", p: 1, borderRadius: 4, boxShadow: "0 10px 25px rgba(0,0,0,0.04)" }}>
              <CardContent sx={{ py: 3 }}>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: "14px",
                    bgcolor: "info.light",
                    color: "info.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2
                  }}
                >
                  <AdminPanelSettings sx={{ fontSize: 28 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Hospital Admins ({adminsCount})
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Create, review, approve & assign hospital admins.
                </Typography>
                <Button
                  component={Link}
                  to="/super-admin/hospital-admins"
                  variant="contained"
                  color="info"
                  fullWidth
                  endIcon={<ArrowForward />}
                  sx={{ borderRadius: "10px", fontWeight: 700 }}
                >
                  Manage Admins
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Platform Audit Trail & Activity Log */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: "100%", p: 1, borderRadius: 4, boxShadow: "0 10px 25px rgba(0,0,0,0.04)" }}>
              <CardContent sx={{ py: 3 }}>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: "14px",
                    bgcolor: "#F1F5F9",
                    color: "#0F172A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2
                  }}
                >
                  <HistoryEdu sx={{ fontSize: 28 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Audit Trail & Logs
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Tamper-evident logs of triage changes, approvals & security.
                </Typography>
                <Button
                  component={Link}
                  to="/super-admin/audit-logs"
                  variant="contained"
                  sx={{
                    borderRadius: "10px",
                    fontWeight: 700,
                    bgcolor: "#0F172A",
                    color: "#FFFFFF",
                    "&:hover": { bgcolor: "#1E293B" }
                  }}
                  fullWidth
                  endIcon={<ArrowForward />}
                >
                  View Audit Trail
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default SuperAdminDashboard;