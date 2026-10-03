import { Box, Container, Typography, Grid, Paper, Card, CardContent, Avatar, Stack, Chip, Button } from "@mui/material";
import { LocalHospital, Speed, Shield, People, EmojiObjects, ArrowForward, CheckCircle } from "@mui/icons-material";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

function About() {
  const stats = [
    { label: "Partnered Hospitals", value: "50+" },
    { label: "Patients Served Today", value: "10,000+" },
    { label: "Average Time Saved", value: "2.5 Hours" },
    { label: "Live Queue Accuracy", value: "99.8%" },
  ];

  const coreValues = [
    {
      icon: <Speed sx={{ fontSize: 32 }} />,
      title: "Zero Waiting Time",
      desc: "Empowering patients to arrive at OPD clinics exactly when their consultation token is active."
    },
    {
      icon: <Shield sx={{ fontSize: 32 }} />,
      title: "Secure & Compliant",
      desc: "Built with industry-grade Spring Security JWT authentication and encrypted health token logs."
    },
    {
      icon: <People sx={{ fontSize: 32 }} />,
      title: "Multi-Role Collaboration",
      desc: "Unified ecosystem connecting Super Admins, Hospital Managers, Doctors, and Patients in real time."
    },
    {
      icon: <EmojiObjects sx={{ fontSize: 32 }} />,
      title: "Smart STOMP WebSockets",
      desc: "Live websocket counters push instant queue updates to mobile and doctor screens without manual reloads."
    }
  ];

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <Navbar />

      {/* Hero Banner */}
      <Box
        sx={{
          py: 8,
          background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
          color: "#FFFFFF",
          textAlign: "center"
        }}
      >
        <Container maxWidth="md">
          <Chip
            label="ABOUT MEDIQUEUE"
            sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 800, mb: 2 }}
          />
          <Typography variant="h2" sx={{ fontWeight: 900, mb: 2 }}>
            Transforming Hospital Queues Into Seamless Care
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400, lineHeight: 1.6 }}>
            MediQueue is a multi-hospital OPD queue & appointment management platform designed to end long waiting room delays and streamline clinical workflows for healthcare providers worldwide.
          </Typography>
        </Container>
      </Box>

      {/* Stats Counter Bar */}
      <Container maxWidth="xl" sx={{ mt: -4, mb: 6 }}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 4, bgcolor: "#FFFFFF" }}>
          <Grid container spacing={3}>
            {stats.map((stat, idx) => (
              <Grid item xs={6} md={3} key={idx}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: "primary.main" }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700, mt: 0.5 }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>

      {/* Mission & Vision */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800, letterSpacing: 1.5 }}>
              OUR MISSION
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 3 }}>
              Humanizing Healthcare Access With Real-Time Technology
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 3 }}>
              Crowded OPD hospital waiting rooms cause patient stress, cross-infections, and operational chaos for medical staff. MediQueue bridges the gap by providing digital token passes, real-time consultation tracking, and single-click doctor call consoles.
            </Typography>

            <Stack spacing={2}>
              {[
                "Instant online token booking for outpatient departments",
                "Live STOMP WebSocket push notifications when doctor calls your token",
                "Comprehensive analytics for hospital administrators & doctors",
                "Seamless role-based access control for multi-specialty hospitals"
              ].map((item, idx) => (
                <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <CheckCircle color="success" fontSize="small" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {item}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              {coreValues.map((val, idx) => (
                <Grid item xs={12} sm={6} key={idx}>
                  <Card sx={{ height: "100%", p: 1, borderRadius: 4 }}>
                    <CardContent>
                      <Box sx={{ color: "primary.main", mb: 2 }}>{val.icon}</Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                        {val.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {val.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        {/* CTA */}
        <Paper
          elevation={0}
          sx={{
            p: 6,
            mt: 8,
            borderRadius: 4,
            bgcolor: "#0F172A",
            color: "#FFFFFF",
            textAlign: "center"
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
            Ready to Experience Zero-Wait Healthcare?
          </Typography>
          <Typography variant="body1" sx={{ color: "#94A3B8", maxWidth: 600, mx: "auto", mb: 4 }}>
            Join thousands of patients saving hours every week. Book your digital OPD token pass today.
          </Typography>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{ py: 1.5, px: 4, fontSize: "1rem", fontWeight: 800 }}
          >
            Register as Patient Now
          </Button>
        </Paper>
      </Container>

      <Footer />
    </Box>
  );
}

export default About;
