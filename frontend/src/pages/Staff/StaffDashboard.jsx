import { Box, Container, Typography, Grid, Paper, Button, Card, CardContent, Stack, Avatar } from "@mui/material";
import { PlayArrow, People, LocalHospital, AssignmentTurnedIn, Timer, ConfirmationNumber } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { getFullName, getHospitalDepartmentId, getDepartmentName } from "../../utils/session";

function StaffDashboard() {
  const navigate = useNavigate();
  const doctorName = getFullName() || "Doctor / Staff";
  const deptId = getHospitalDepartmentId();
  const deptName = getDepartmentName();

  const queueUrl = deptId ? `/staff/queue?deptId=${deptId}` : "/staff/queue";
  const walkInUrl = deptId ? `/staff/queue?deptId=${deptId}&action=walkin` : "/staff/queue?action=walkin";

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Welcome Header */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
            color: "#FFFFFF",
            mb: 4,
            boxShadow: "0 10px 25px rgba(13, 148, 136, 0.2)"
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                Welcome, {doctorName}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 600 }}>
                Manage your daily patient queue, consultation calls, and live token flow smoothly from your doctor workstation console.
              </Typography>
              <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  component={Link}
                  to={queueUrl}
                  variant="contained"
                  size="large"
                  startIcon={<PlayArrow />}
                  sx={{
                    bgcolor: "#FFFFFF",
                    color: "#0F766E",
                    fontWeight: 800,
                    "&:hover": { bgcolor: "#F1F5F9" }
                  }}
                >
                  Open Live Queue Console
                </Button>

                <Button
                  component={Link}
                  to={walkInUrl}
                  variant="outlined"
                  size="large"
                  startIcon={<ConfirmationNumber />}

                  sx={{
                    borderColor: "#FFFFFF",
                    color: "#FFFFFF",
                    fontWeight: 800,
                    "&:hover": { borderColor: "#FFFFFF", bgcolor: "rgba(255,255,255,0.1)" }
                  }}
                >
                  + Issue Walk-In Token
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>


        {/* Quick Launch & Features */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", p: 1 }}>
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "20px",
                    bgcolor: "primary.light",
                    color: "primary.main",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2
                  }}
                >
                  <PlayArrow sx={{ fontSize: 36 }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                  Live Queue Control
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Call the next patient in line, view consultation history, and complete tokens with real-time websocket sync.
                </Typography>
                <Button
                  component={Link}
                  to={queueUrl}
                  variant="outlined"
                  fullWidth
                  color="primary"
                >
                  Start Consultation Queue
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", p: 1 }}>
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "20px",
                    bgcolor: "secondary.light",
                    color: "secondary.main",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2
                  }}
                >
                  <AssignmentTurnedIn sx={{ fontSize: 36 }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                  Token Management
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  View today's patient queue list, filter walk-ins versus online appointments, and monitor patient wait times.
                </Typography>
                <Button
                  component={Link}
                  to={queueUrl}
                  variant="outlined"
                  fullWidth
                  color="secondary"
                >
                  View Queue Roster
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", p: 1 }}>
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "20px",
                    bgcolor: "info.light",
                    color: "info.main",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2
                  }}
                >
                  <LocalHospital sx={{ fontSize: 36 }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                  Hospital Department
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {deptName ? `Assigned to ${deptName} Outpatient Department (OPD) queue counter system.` : "Assigned General Outpatient Department (OPD) queue counter system."}
                </Typography>
                <Button variant="text" fullWidth color="info" disabled>
                  {deptName ? `Active: ${deptName}` : (deptId ? `Active Dept #${deptId}` : "OPD Desk")}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default StaffDashboard;