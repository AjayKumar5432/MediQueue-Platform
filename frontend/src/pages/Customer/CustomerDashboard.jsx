import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Chip,
  CircularProgress,
  Stack
} from "@mui/material";
import {
  ConfirmationNumber,
  LocalHospital,
  LocationOn,
  Phone,
  Search,
  ArrowForward,
  MedicalServices
} from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import { getCustomerHospitals } from "../../api/hospitalApi";
import { getFullName } from "../../utils/session";

function CustomerDashboard() {
  const navigate = useNavigate();
  const patientName = getFullName() || "Patient";
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const response = await getCustomerHospitals();
      setHospitals(response.data || []);
    } catch (err) {
      console.error("Failed to load customer hospitals", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Welcome Hero Banner */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
            color: "#FFFFFF",
            mb: 4,
            boxShadow: "0 12px 30px rgba(13, 148, 136, 0.25)"
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                Hello, {patientName}!
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 600 }}>
                Skip long waiting lines at hospitals! Book digital OPD tokens online, view estimated wait times, and arrive right when your doctor is ready.
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button
                  component={Link}
                  to="/customer/book-token"
                  variant="contained"
                  size="large"
                  startIcon={<ConfirmationNumber />}
                  sx={{
                    bgcolor: "#FFFFFF",
                    color: "#0F766E",
                    fontWeight: 800,
                    "&:hover": { bgcolor: "#F1F5F9" }
                  }}
                >
                  Book OPD Token Now
                </Button>
                <Button
                  component={Link}
                  to="/customer/my-tokens"
                  variant="outlined"
                  size="large"
                  sx={{
                    color: "#FFFFFF",
                    borderColor: "rgba(255,255,255,0.6)",
                    fontWeight: 700,
                    "&:hover": { borderColor: "#FFFFFF", bgcolor: "rgba(255,255,255,0.1)" }
                  }}
                >
                  View My Tokens
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Available Hospitals */}
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: "text.primary" }}>
          Partnered Hospitals & Clinics
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {hospitals.map((hosp) => (
              <Grid item xs={12} sm={6} md={4} key={hosp.hospitalId}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 24px rgba(0,0,0,0.08)"
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: "12px",
                          bgcolor: "primary.light",
                          color: "primary.main",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <LocalHospital />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                          {hosp.hospitalName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {hosp.hospitalCode || `HOSP-${hosp.hospitalId}`}
                        </Typography>
                      </Box>
                    </Box>

                    <Stack spacing={1} sx={{ my: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {hosp.address || "Main Medical Campus City"}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Phone fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {hosp.contactNumber || "+91 9876543210"}
                        </Typography>
                      </Box>
                    </Stack>

                    <Chip
                      label={hosp.active !== false ? "Active OPD Queue" : "Unavailable"}
                      color={hosp.active !== false ? "success" : "default"}
                      size="small"
                      sx={{ fontWeight: 700, mt: 1 }}
                    />
                  </CardContent>

                  <Box sx={{ p: 3, pt: 0 }}>
                    <Button
                      component={Link}
                      to={`/customer/book-token?hospitalId=${hosp.hospitalId}`}
                      variant="contained"
                      fullWidth
                      endIcon={<ArrowForward />}
                      sx={{ fontWeight: 700, borderRadius: "10px" }}
                    >
                      View Departments & Book Token
                    </Button>

                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default CustomerDashboard;