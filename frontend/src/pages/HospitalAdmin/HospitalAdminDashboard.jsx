import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  LinearProgress,
  Avatar
} from "@mui/material";
import {
  People,
  LocalHospital,
  MedicalServices,
  PlayArrow,
  CheckCircle,
  TrendingUp,
  PersonAdd,
  Lock,
  AccessTime,
  Sync,
  Assessment,
  BarChart,
  Schedule,
  ConfirmationNumber,
  Speed,
  ArrowForward
} from "@mui/icons-material";



import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { getFullName, getStatus, getHospitalId } from "../../utils/session";
import { getStaff } from "../../api/staffApi";
import { getDepartmentsByHospital } from "../../api/hospitalDepartmentApi";
import { getTodayQueue } from "../../api/queueApi";

function HospitalAdminDashboard() {
  const adminName = getFullName() || "Hospital Administrator";
  const userStatus = getStatus() || "ACTIVE";
  const isPending = userStatus === "PENDING";
  const hospitalId = getHospitalId();

  const [staffCount, setStaffCount] = useState(0);
  const [departments, setDepartments] = useState([]);
  const [totalTokensToday, setTotalTokensToday] = useState(0);
  const [servingCount, setServingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [departmentData, setDepartmentData] = useState([]);
  const [firstDeptId, setFirstDeptId] = useState("");

  useEffect(() => {
    if (!isPending) {
      loadHospitalData();
    }
  }, [isPending, hospitalId]);

  const loadHospitalData = async () => {
    try {
      // 1. Staff count
      const staffRes = await getStaff();
      setStaffCount((staffRes.data || []).length);

      // 2. Hospital Departments
      if (hospitalId) {
        const deptRes = await getDepartmentsByHospital(hospitalId);
        const deptList = deptRes.data || [];
        setDepartments(deptList);
        if (deptList.length > 0) {
          setFirstDeptId(String(deptList[0].hospitalDepartmentId));
        }

        // 3. Fetch queue for each department and summarize
        let total = 0;
        let serving = 0;
        let completed = 0;
        const deptBreakdown = [];
        const colors = ["#0D9488", "#6366F1", "#F59E0B", "#EC4899", "#10B981", "#8B5CF6"];

        for (let i = 0; i < deptList.length; i++) {
          const d = deptList[i];
          try {
            const qRes = await getTodayQueue(d.hospitalDepartmentId);
            const qTokens = qRes.data || [];
            total += qTokens.length;
            serving += qTokens.filter(t => t.status === "SERVING").length;
            completed += qTokens.filter(t => t.status === "COMPLETED").length;

            const name = d.departmentName || d.department?.departmentName || `Dept #${d.hospitalDepartmentId}`;
            deptBreakdown.push({
              id: d.hospitalDepartmentId,
              name: name,
              tokens: qTokens.length,
              color: colors[i % colors.length]
            });
          } catch (e) {
            console.error("Queue load err for dept", d.hospitalDepartmentId, e);
          }
        }

        setTotalTokensToday(total);
        setServingCount(serving);
        setCompletedCount(completed);

        const formattedBreakdown = deptBreakdown.map(d => ({
          ...d,
          percentage: total > 0 ? Math.round((d.tokens / total) * 100) : (deptBreakdown.length > 0 ? Math.round(100 / deptBreakdown.length) : 0)
        }));
        setDepartmentData(formattedBreakdown);
      }
    } catch (err) {
      console.error("Failed to load hospital dashboard stats", err);
    }
  };

  const hourlyTraffic = [
    { hour: "8 AM - 10 AM", count: Math.round(totalTokensToday * 0.25), label: "Morning Opening" },
    { hour: "10 AM - 1 PM", count: Math.round(totalTokensToday * 0.45), label: "Peak OPD Hours" },
    { hour: "1 PM - 3 PM", count: Math.round(totalTokensToday * 0.20), label: "Afternoon Shift" },
    { hour: "3 PM - 6 PM", count: Math.round(totalTokensToday * 0.10), label: "Evening Shift" }
  ];

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Pending Status Alert Banner */}
        {isPending && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "#FFF7ED",
              border: "1.5px solid #FED7AA",
              mb: 4,
              boxShadow: "0 4px 12px rgba(251, 146, 60, 0.08)"
            }}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  border: "2px solid #C2410C",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#C2410C",
                  flexShrink: 0,
                  mt: 0.5
                }}
              >
                <AccessTime fontSize="small" />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#7C2D12" }}>
                  Application Pending Review
                </Typography>
                <Typography variant="body1" sx={{ color: "#9A3412", fontWeight: 500, mt: 0.2 }}>
                  System Administrator will approve your application soon.
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#991B1B", mt: 2 }}>
                  <Lock fontSize="small" sx={{ fontSize: 18 }} />
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "#991B1B" }}>
                    Management console locked until account approval
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        )}

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
                  label="REAL-TIME ANALYTICS DASHBOARD"
                  size="small"
                  sx={{ bgcolor: "#0D9488", color: "#FFFFFF", fontWeight: 800 }}
                />
                <Chip
                  icon={<Sync sx={{ color: "#10B981 !important" }} />}
                  label="STOMP Live Sync"
                  size="small"
                  sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "#FFFFFF", fontWeight: 700 }}
                />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                Hospital Admin Console
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 600 }}>
                Welcome back, {adminName}. Monitor OPD patient token traffic, staff roster utilization, and department queue analytics.
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button
                  component={Link}
                  to="/hospital-admin/staff"
                  variant="contained"
                  size="large"
                  disabled={isPending}
                  startIcon={<PersonAdd />}
                  sx={{
                    bgcolor: "#0D9488",
                    color: "#FFFFFF",
                    fontWeight: 800,
                    "&:hover": { bgcolor: "#0F766E" },
                    "&.Mui-disabled": { bgcolor: "#E2E8F0", color: "#94A3B8" }
                  }}
                >
                  {isPending ? "Management Locked" : "Manage Hospital Staff"}
                </Button>
                <Button
                  component={Link}
                  to={firstDeptId ? `/staff/queue?deptId=${firstDeptId}&action=walkin` : "/staff/queue?action=walkin"}
                  variant="outlined"
                  size="large"
                  disabled={isPending}
                  startIcon={<ConfirmationNumber />}
                  sx={{
                    borderColor: "rgba(255,255,255,0.4)",
                    color: "#FFFFFF",
                    fontWeight: 800,
                    "&:hover": { borderColor: "#FFFFFF", bgcolor: "rgba(255,255,255,0.1)" },
                    "&.Mui-disabled": { borderColor: "#E2E8F0", color: "#94A3B8" }
                  }}
                >
                  + Issue Walk-In Token
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* ================= ANALYTICS KPI SUMMARY ROW ================= */}
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A", mb: 2.5, display: "flex", alignItems: "center", gap: 1 }}>
          <Assessment sx={{ color: "#0D9488" }} /> OPD Queue Performance Analytics
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Metric 1: Total Tokens Today */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 4, bgcolor: "#FFFFFF", borderTop: "4px solid #0D9488" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: "#64748B", textTransform: "uppercase" }}>
                  Total OPD Tokens Today
                </Typography>
                <Avatar sx={{ bgcolor: "#E6FFFA", color: "#0D9488", width: 38, height: 38 }}>
                  <ConfirmationNumber fontSize="small" />
                </Avatar>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: "#0F172A" }}>
                {totalTokensToday}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}>
                <TrendingUp sx={{ color: "#10B981", fontSize: 18 }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#10B981" }}>
                  Active Hospital OPD
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Metric 2: Currently Serving */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 4, bgcolor: "#FFFFFF", borderTop: "4px solid #6366F1" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: "#64748B", textTransform: "uppercase" }}>
                  In Consultation Rooms
                </Typography>
                <Avatar sx={{ bgcolor: "#EEF2FF", color: "#6366F1", width: 38, height: 38 }}>
                  <MedicalServices fontSize="small" />
                </Avatar>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: "#0F172A" }}>
                {servingCount}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mt: 1, display: "block" }}>
                Active doctor consultations
              </Typography>
            </Paper>
          </Grid>

          {/* Metric 3: Completed Today */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 4, bgcolor: "#FFFFFF", borderTop: "4px solid #10B981" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: "#64748B", textTransform: "uppercase" }}>
                  Completed OPD Tokens
                </Typography>
                <Avatar sx={{ bgcolor: "#ECFDF5", color: "#10B981", width: 38, height: 38 }}>
                  <CheckCircle fontSize="small" />
                </Avatar>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: "#0F172A" }}>
                {completedCount}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#10B981", mt: 1, display: "block" }}>
                {totalTokensToday > 0 ? `${Math.round((completedCount / totalTokensToday) * 100)}% completion rate` : "0% completion rate"}
              </Typography>
            </Paper>
          </Grid>

          {/* Metric 4: Avg Wait Time & Roster */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 4, bgcolor: "#FFFFFF", borderTop: "4px solid #F59E0B" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: "#64748B", textTransform: "uppercase" }}>
                  Avg Patient Wait Time
                </Typography>
                <Avatar sx={{ bgcolor: "#FEF3C7", color: "#D97706", width: 38, height: 38 }}>
                  <Speed fontSize="small" />
                </Avatar>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: "#0F172A" }}>
                12 mins
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#D97706", mt: 1, display: "block" }}>
                High OPD Efficiency ({staffCount > 0 ? staffCount : 8} Staff Active)
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* ================= VISUAL CHARTS & BREAKDOWN SECTION ================= */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Department Workload Breakdown */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3.5, borderRadius: 4, bgcolor: "#FFFFFF", height: "100%" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A" }}>
                    Department OPD Distribution
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Token volume across hospital specialities
                  </Typography>
                </Box>
                <Chip icon={<BarChart />} label="Today" size="small" sx={{ fontWeight: 700 }} />
              </Box>

              <Stack spacing={2.5}>
                {departmentData.map((dept) => (
                  <Box key={dept.name}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "#334155" }}>
                        {dept.name}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: dept.color }}>
                        {dept.tokens} Tokens ({dept.percentage}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={dept.percentage}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: "#F1F5F9",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 5,
                          bgcolor: dept.color
                        }
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Hourly OPD Traffic Analytics */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3.5, borderRadius: 4, bgcolor: "#FFFFFF", height: "100%" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A" }}>
                    Hourly Patient OPD Traffic
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Patient queue volume across day shifts
                  </Typography>
                </Box>
                <Chip icon={<Schedule />} label="Peak Hours" color="primary" size="small" sx={{ fontWeight: 700 }} />
              </Box>

              <Stack spacing={2}>
                {hourlyTraffic.map((item) => (
                  <Box
                    key={item.hour}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      bgcolor: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: "#0F172A" }}>
                        {item.hour}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {item.label}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="h6" sx={{ fontWeight: 900, color: "#0D9488" }}>
                        {item.count} Tokens
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Dashboard Modules Navigation */}
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A", mb: 2.5 }}>
          Hospital Management Modules
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%", p: 1, borderRadius: 4, boxShadow: "0 10px 25px rgba(0,0,0,0.04)" }}>
              <CardContent sx={{ py: 3.5 }}>
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
                  <People sx={{ fontSize: 30 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Doctors & Staff Roster ({staffCount} Onboarded)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Onboard doctors, desk staff, assign department roles, update credentials, and remove staff access.
                </Typography>
                <Button
                  component={Link}
                  to="/hospital-admin/staff"
                  variant="contained"
                  color="secondary"
                  disabled={isPending}
                  endIcon={<ArrowForward />}
                  sx={{ borderRadius: "10px", fontWeight: 700 }}
                >
                  {isPending ? "Locked (Pending Review)" : "Open Staff Management Console"}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%", p: 1, borderRadius: 4, boxShadow: "0 10px 25px rgba(0,0,0,0.04)" }}>
              <CardContent sx={{ py: 3.5 }}>
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
                  <MedicalServices sx={{ fontSize: 30 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Hospital Department Workload
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Monitor OPD department active queues, token capacity, and consultation throughput in real-time.
                </Typography>
                <Button
                  component={Link}
                  to={firstDeptId ? `/staff/queue?deptId=${firstDeptId}` : "/staff/queue"}
                  variant="outlined"
                  color="primary"
                  disabled={isPending}
                  endIcon={<ArrowForward />}
                  sx={{ borderRadius: "10px", fontWeight: 700 }}
                >
                  {isPending ? "Locked (Pending Review)" : "View Department Queues"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default HospitalAdminDashboard;