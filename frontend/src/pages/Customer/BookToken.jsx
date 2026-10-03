import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  Typography,
  Alert,
  Grid,
  Chip,
  Container,
  Paper,
  InputAdornment,
  Stack,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from "@mui/material";
import {
  ConfirmationNumber,
  LocalHospital,
  MedicalServices,
  CheckCircle,
  ArrowForward,
  AccessTime,
  AttachMoney,
  SwapHoriz,
  Search,
  Close,
  LocationOn,
  Check
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PaymentModal from "../../components/Payment/PaymentModal";
import { getCustomerHospitals } from "../../api/hospitalApi";
import { getDepartmentsByHospital } from "../../api/hospitalDepartmentApi";
import { bookToken } from "../../api/tokenApi";

function BookToken() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hospitalParam = searchParams.get("hospitalId") || searchParams.get("hospital");

  const [hospitals, setHospitals] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [departmentDetails, setDepartmentDetails] = useState(null);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [hospitalDialogOpen, setHospitalDialogOpen] = useState(false);
  const [hospitalSearch, setHospitalSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");


  useEffect(() => {
    loadHospitalsAndDepartments();
  }, []);

  const fetchDepartments = async (hospId) => {
    setLoadingDepts(true);
    setError("");
    try {
      const response = await getDepartmentsByHospital(hospId);
      const data = response.data || [];
      setDepartments(data);
      if (data.length === 0) {
        setError("No OPD departments currently available for this hospital.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load departments for this hospital.");
    } finally {
      setLoadingDepts(false);
    }
  };

  const loadHospitalsAndDepartments = async () => {
    try {
      const response = await getCustomerHospitals();
      const loadedHospitals = response.data || [];
      setHospitals(loadedHospitals);

      if (hospitalParam) {
        const found = loadedHospitals.find(
          (h) => String(h.hospitalId) === String(hospitalParam)
        );
        const targetId = found ? found.hospitalId : Number(hospitalParam);
        if (targetId) {
          setSelectedHospital(targetId);
          fetchDepartments(targetId);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load hospitals.");
    }
  };

  const handleSelectHospital = (hospital) => {
    if (String(selectedHospital) === String(hospital.hospitalId)) {
      setHospitalDialogOpen(false);
      return;
    }
    setSelectedHospital(hospital.hospitalId);
    setSelectedDepartment("");
    setDepartmentDetails(null);
    setError("");
    setHospitalDialogOpen(false);
    setHospitalSearch("");
    fetchDepartments(hospital.hospitalId);
  };

  const filteredHospitals = hospitals.filter((h) => {
    if (!hospitalSearch.trim()) return true;
    const q = hospitalSearch.toLowerCase();
    const name = (h.hospitalName || "").toLowerCase();
    const city = (h.city || "").toLowerCase();
    const addr = (h.address || "").toLowerCase();
    return name.includes(q) || city.includes(q) || addr.includes(q);
  });

  const handleSelectDepartment = (dept) => {
    setSelectedDepartment(dept.hospitalDepartmentId);
    setDepartmentDetails(dept);
    setError("");
  };

  const handleBookToken = () => {
    if (!selectedDepartment || !departmentDetails) {
      toast.warning("Please select an OPD department to proceed.");
      return;
    }
    setPaymentModalOpen(true);
  };


  const activeHospitalObj = hospitals.find(
    (h) => String(h.hospitalId) === String(selectedHospital)
  );

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F8FAFC", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 5, flexGrow: 1 }}>
        {/* Header Title */}
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
          <Box sx={{ display: "flex", alignItems: "center", justifyBetween: "space-between", gap: 2.5 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                borderRadius: "16px",
                bgcolor: "#0D9488",
                color: "#FFFFFF",
                boxShadow: "0 8px 16px rgba(13, 148, 136, 0.3)"
              }}
            >
              <ConfirmationNumber fontSize="large" />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                Book OPD Consultation Token
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.85 }}>
                Select your target OPD medical department below to reserve your live queue token in seconds.
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Selected Hospital Banner or Selection Prompt */}
        {selectedHospital && activeHospitalObj ? (
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: "#FFFFFF",
              borderLeft: "6px solid #0D9488",
              mb: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "#E6FFFA", color: "#0D9488", width: 46, height: 46 }}>
                <LocalHospital />
              </Avatar>
              <Box>
                <Chip label="SELECTED HOSPITAL" color="primary" size="small" sx={{ fontWeight: 800, mb: 0.5, fontSize: "0.68rem" }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}>
                  {activeHospitalObj.hospitalName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  📍 {activeHospitalObj.address || `${activeHospitalObj.city}, ${activeHospitalObj.state}`}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="outlined"
              size="small"
              startIcon={<SwapHoriz />}
              onClick={() => {
                setHospitalSearch("");
                setHospitalDialogOpen(true);
              }}
              sx={{ fontWeight: 700, borderRadius: "10px", borderColor: "#CBD5E1", color: "#334155" }}
            >
              Switch Hospital
            </Button>
          </Paper>
        ) : (
          <Paper
            elevation={2}
            sx={{
              p: 3.5,
              borderRadius: 4,
              bgcolor: "#FFFFFF",
              mb: 4,
              border: "1.5px dashed #CBD5E1",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "#F1F5F9", color: "#64748B", width: 46, height: 46 }}>
                <LocalHospital />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A" }}>
                  No Hospital Selected
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Choose a healthcare facility from our network to view available OPD departments
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              onClick={() => {
                setHospitalSearch("");
                setHospitalDialogOpen(true);
              }}
              startIcon={<LocalHospital />}
              sx={{
                fontWeight: 700,
                borderRadius: "10px",
                bgcolor: "#0D9488",
                "&:hover": { bgcolor: "#0F766E" },
                px: 3,
                py: 1
              }}
            >
              Select Hospital
            </Button>
          </Paper>
        )}

        {/* Feedback Alerts */}
        {error && (
          <Alert sx={{ mb: 4, borderRadius: 3, fontWeight: 700 }} severity="error">
            {error}
          </Alert>
        )}

        {success && (
          <Alert sx={{ mb: 4, borderRadius: 3, fontWeight: 800 }} severity="success">
            {success}
          </Alert>
        )}

        {/* ================= DIRECT OPD DEPARTMENTS SELECTION GRID ================= */}
        {selectedHospital && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: 1 }}>
                <MedicalServices sx={{ color: "#6366F1" }} /> Select OPD Medical Department
              </Typography>
              {departments.length > 0 && (
                <Chip label={`${departments.length} Specialities Available`} color="secondary" size="small" sx={{ fontWeight: 800 }} />
              )}
            </Box>

            {loadingDepts ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : departments.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: "center", borderRadius: 4, bgcolor: "#F1F5F9" }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#475569" }}>
                  No OPD Departments Listed for this Hospital Yet.
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {departments.map((item) => {
                  const isSelected = selectedDepartment === item.hospitalDepartmentId;

                  return (
                    <Grid item xs={12} sm={6} md={4} key={item.hospitalDepartmentId}>
                      <Card
                        onClick={() => handleSelectDepartment(item)}
                        sx={{
                          height: "100%",
                          cursor: "pointer",
                          borderRadius: 4,
                          border: isSelected ? "3px solid #0D9488" : "1.5px solid #E2E8F0",
                          bgcolor: isSelected ? "#F0FDF4" : "#FFFFFF",
                          boxShadow: isSelected ? "0 10px 25px rgba(13, 148, 136, 0.2)" : "0 6px 18px rgba(0,0,0,0.04)",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 12px 24px rgba(13, 148, 136, 0.15)"
                          }
                        }}
                      >
                        <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                            <Avatar
                              sx={{
                                bgcolor: isSelected ? "#0D9488" : "#EEF2FF",
                                color: isSelected ? "#FFFFFF" : "#6366F1",
                                width: 44,
                                height: 44
                              }}
                            >
                              <MedicalServices />
                            </Avatar>

                            {isSelected && (
                              <Chip
                                icon={<CheckCircle sx={{ color: "#FFFFFF !important" }} />}
                                label="SELECTED"
                                size="small"
                                sx={{ bgcolor: "#0D9488", color: "#FFFFFF", fontWeight: 800, fontSize: "0.7rem" }}
                              />
                            )}
                          </Box>

                          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", mb: 1, lineHeight: 1.2 }}>
                            {item.departmentName}
                          </Typography>

                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, flexGrow: 1 }}>
                            OPD Consultation & Live Queue Management
                          </Typography>

                          <Stack spacing={1} sx={{ mb: 2.5, pt: 1.5, borderTop: "1px dashed #CBD5E1" }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B" }}>
                                Consultation Fee:
                              </Typography>
                              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0D9488" }}>
                                ₹{item.consultationFee || 0}
                              </Typography>
                            </Box>

                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B" }}>
                                Daily Token Capacity:
                              </Typography>
                              <Typography variant="caption" sx={{ fontWeight: 800, color: "#334155" }}>
                                {item.dailyTokenLimit || 50} Tokens Max
                              </Typography>
                            </Box>

                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B" }}>
                                Avg. Wait Time:
                              </Typography>
                              <Typography variant="caption" sx={{ fontWeight: 800, color: "#334155" }}>
                                {item.averageConsultationTime || 10} Mins / Patient
                              </Typography>
                            </Box>
                          </Stack>

                          <Button
                            variant={isSelected ? "contained" : "outlined"}
                            color={isSelected ? "primary" : "inherit"}
                            fullWidth
                            sx={{
                              mt: "auto",
                              fontWeight: 800,
                              borderRadius: "10px",
                              py: 1.2,
                              background: isSelected ? "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)" : undefined
                            }}
                          >
                            {isSelected ? "✔ Selected" : "Select Department"}
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>
        )}

        {/* Selected Department Booking Action Card */}
        {departmentDetails && (
          <Paper
            elevation={3}
            sx={{
              p: 3.5,
              borderRadius: 4,
              bgcolor: "#FFFFFF",
              border: "2px solid #0D9488",
              boxShadow: "0 15px 30px rgba(13, 148, 136, 0.15)"
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A" }}>
                📋 Token Reservation Summary
              </Typography>
              <Chip label={`Fee: ₹${departmentDetails.consultationFee}`} color="success" size="small" sx={{ fontWeight: 800 }} />
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Hospital Facility
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0F172A" }}>
                  {departmentDetails.hospitalName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Target Speciality
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0D9488" }}>
                  {departmentDetails.departmentName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Appointment Slot & Date
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#10B981" }}>
                  Today (Morning 09:00 - 12:00)
                </Typography>
              </Grid>
            </Grid>



            <Button
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              onClick={handleBookToken}
              endIcon={<ArrowForward />}
              sx={{
                py: 1.8,
                fontSize: "1.05rem",
                fontWeight: 800,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
                boxShadow: "0 10px 25px rgba(13, 148, 136, 0.3)"
              }}
            >
              {loading ? "Generating OPD Token..." : `Confirm & Book Token for ${departmentDetails.departmentName}`}
            </Button>
          </Paper>
        )}
      </Container>

      <Footer />

      {/* OPD PAYMENT CHECKOUT MODAL */}
      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        hospitalDepartment={departmentDetails}
        hospitalName={activeHospitalObj?.hospitalName}
        onSuccess={(paymentRes) => {
          const tokenNo = paymentRes.tokenDetails?.tokenNumber || paymentRes.tokenNumber || "Issued";
          setSuccess(`Token #${tokenNo} Booked & Paid Successfully!`);
          setTimeout(() => {
            navigate("/customer/my-tokens");
          }, 1500);
        }}
      />

      {/* SWITCH / SELECT HOSPITAL MODAL DIALOG */}
      <Dialog
        open={hospitalDialogOpen}
        onClose={() => setHospitalDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ bgcolor: "#E6FFFA", color: "#0D9488", width: 40, height: 40 }}>
              <LocalHospital fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}>
                {selectedHospital ? "Switch Hospital Facility" : "Select Hospital Facility"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Choose a hospital from our verified healthcare network
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={() => setHospitalDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 2, pb: 2 }}>
          {/* Search Bar */}
          <TextField
            fullWidth
            size="small"
            placeholder="Search by hospital name, city, or address..."
            value={hospitalSearch}
            onChange={(e) => setHospitalSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#94A3B8" }} />
                </InputAdornment>
              ),
              sx: { borderRadius: 3, bgcolor: "#F8FAFC" }
            }}
            sx={{ mb: 2.5 }}
          />

          {/* Hospital Cards List */}
          <Box
            sx={{
              maxHeight: 420,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              pr: 0.5
            }}
          >
            {filteredHospitals.length === 0 ? (
              <Box sx={{ py: 4, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  No hospitals match your search.
                </Typography>
              </Box>
            ) : (
              filteredHospitals.map((hospital) => {
                const isCurrent = String(selectedHospital) === String(hospital.hospitalId);

                return (
                  <Card
                    key={hospital.hospitalId}
                    variant="outlined"
                    onClick={() => handleSelectHospital(hospital)}
                    sx={{
                      cursor: "pointer",
                      flexShrink: 0,
                      minHeight: 72,
                      p: 2,
                      borderRadius: 3,
                      borderColor: isCurrent ? "#0D9488" : "#E2E8F0",
                      borderWidth: isCurrent ? "2px" : "1px",
                      bgcolor: isCurrent ? "#F0FDF4" : "#FFFFFF",
                      transition: "all 0.15s ease",
                      display: "flex",
                      alignItems: "center",
                      "&:hover": {
                        borderColor: "#0D9488",
                        bgcolor: isCurrent ? "#F0FDF4" : "#F8FAFC",
                        transform: "translateX(2px)"
                      }
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", gap: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1, minWidth: 0 }}>
                        <Avatar
                          sx={{
                            width: 44,
                            height: 44,
                            flexShrink: 0,
                            bgcolor: isCurrent ? "#0D9488" : "#F1F5F9",
                            color: isCurrent ? "#FFFFFF" : "#0D9488",
                            fontWeight: 700,
                            fontSize: "1rem"
                          }}
                        >
                          {hospital.hospitalName ? hospital.hospitalName.charAt(0).toUpperCase() : "H"}
                        </Avatar>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 700,
                              color: "#0F172A",
                              lineHeight: 1.35,
                              fontSize: "1rem",
                              mb: 0.3
                            }}
                          >
                            {hospital.hospitalName}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              fontSize: "0.82rem",
                              lineHeight: 1.2
                            }}
                          >
                            <LocationOn sx={{ fontSize: 15, color: "#64748B", flexShrink: 0 }} />
                            <span>{hospital.address || `${hospital.city || "City"}, ${hospital.state || "State"}`}</span>
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ flexShrink: 0 }}>
                        {isCurrent ? (
                          <Chip
                            icon={<Check sx={{ fontSize: "14px !important" }} />}
                            label="Current"
                            size="small"
                            color="success"
                            sx={{ fontWeight: 700, fontSize: "0.75rem", px: 0.5 }}
                          />
                        ) : (
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: 700,
                              fontSize: "0.8rem",
                              borderColor: "#CBD5E1",
                              color: "#0D9488",
                              py: 0.5,
                              px: 1.8,
                              "&:hover": { borderColor: "#0D9488", bgcolor: "#E6FFFA" }
                            }}
                          >
                            Select
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Card>
                );
              })
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 1.5, justifyContent: "space-between" }}>
          <Typography variant="caption" color="text.secondary">
            {filteredHospitals.length} hospital{filteredHospitals.length === 1 ? "" : "s"} available
          </Typography>
          <Button
            onClick={() => setHospitalDialogOpen(false)}
            variant="text"
            sx={{ fontWeight: 700, color: "#64748B" }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>

  );
}

export default BookToken;