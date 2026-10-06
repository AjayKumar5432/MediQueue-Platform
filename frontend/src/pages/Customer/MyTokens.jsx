import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  Paper,
  Divider,
  Stack,
  Alert
} from "@mui/material";
import {
  ConfirmationNumber,
  Cancel,
  Refresh,
  LocalHospital,
  AccessTime,
  CheckCircle,
  HourglassTop,
  NotificationsActive,
  PeopleAlt,
  Timer,
  FiberManualRecord,
  PriorityHigh
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import { getMyTokens, cancelToken } from "../../api/tokenApi";
import { requestNotificationPermission, sendNativeNotification } from "../../utils/notificationService";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function MyTokens() {

  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    fetchTokens();
  }, []);

  // Auto-refresh live queue position silently every 15 seconds for active tokens
  useEffect(() => {
    const hasActiveTokens = tokens.some(t => t.status === "WAITING" || t.status === "SERVING");
    if (!hasActiveTokens) return;

    const interval = setInterval(() => {
      fetchTokensSilently();
    }, 15000);

    return () => clearInterval(interval);
  }, [tokens]);

  const fetchTokensSilently = async () => {
    try {
      const response = await getMyTokens();
      setTokens(response.data || []);
    } catch (err) {
      console.error("Silent queue refresh:", err);
    }
  };

  const fetchTokens = async () => {
    setLoading(true);
    try {
      const response = await getMyTokens();
      setTokens(response.data || []);
    } catch (err) {
      console.error("Failed to fetch my tokens", err);
      toast.error("Failed to load your tokens.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelToken = async (tokenId) => {
    if (!window.confirm("Are you sure you want to cancel this token booking?")) return;

    setCancelLoading(true);
    try {
      await cancelToken(tokenId);
      toast.success("Token cancelled successfully.");
      fetchTokens();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel token.");
    } finally {
      setCancelLoading(false);
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "SERVING":
        return (
          <Chip
            icon={<NotificationsActive fontSize="small" />}
            label="NOW SERVING - PLEASE GO TO ROOM"
            color="primary"
            sx={{ fontWeight: 800, animation: "pulse 2s infinite" }}
          />
        );
      case "PENDING":
      case "BOOKED":
      case "WAITING":
        return (
          <Chip
            icon={<HourglassTop fontSize="small" />}
            label="WAITING IN QUEUE"
            color="warning"
            sx={{ fontWeight: 700 }}
          />
        );
      case "COMPLETED":
        return (
          <Chip
            icon={<CheckCircle fontSize="small" />}
            label="CONSULTATION COMPLETED"
            color="success"
            sx={{ fontWeight: 700 }}
          />
        );
      case "CANCELLED":
        return <Chip label="CANCELLED" color="error" sx={{ fontWeight: 700 }} />;
      default:
        return <Chip label={status} />;
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary" }}>
              My Medical Tokens
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track your active queue status, digital tickets, and consultation appointments
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              component={Link}
              to="/customer/book-token"
              variant="contained"
              color="primary"
              startIcon={<ConfirmationNumber />}
            >
              Book New Token
            </Button>
            <Button
              variant="outlined"
              color="success"
              startIcon={<NotificationsActive />}
              onClick={async () => {
                const granted = await requestNotificationPermission();
                if (granted) {
                  sendNativeNotification("🔔 MediQueue Alert Enabled!", "You will receive real-time device notifications when your OPD token is called.");
                  toast.success("🔔 Native Mobile Turn Alerts Enabled!");
                } else {
                  toast.info("Notification permission was requested.");
                }
              }}
              sx={{ fontWeight: 800 }}
            >
              🔔 Enable Mobile Push Alerts
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchTokens}
            >
              Refresh
            </Button>
          </Stack>
        </Box>


        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : tokens.length === 0 ? (
          <Paper elevation={0} sx={{ p: 6, textAlign: "center", borderRadius: 4, bgcolor: "#fff" }}>
            <ConfirmationNumber sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              No Active Tokens Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              You haven't booked any hospital tokens yet. Book a token to join the live queue.
            </Typography>
            <Button
              component={Link}
              to="/customer/book-token"
              variant="contained"
              color="primary"
              size="large"
            >
              Book Your First Token
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {tokens.map((token) => (
              <Grid item xs={12} sm={6} md={4} key={token.tokenId}>
                <Paper
                  elevation={3}
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    border: token.status === "SERVING" ? "2px solid #0D9488" : "1px solid #E2E8F0",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "translateY(-2px)" }
                  }}
                >
                  {/* Ticket Header */}
                  <Box
                    sx={{
                      p: 2.5,
                      background: token.status === "SERVING"
                        ? "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)"
                        : "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
                      color: "#FFFFFF",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 1
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0, overflow: "hidden" }}>
                      <LocalHospital sx={{ flexShrink: 0 }} />
                      <Typography variant="h6" noWrap sx={{ fontWeight: 800, fontSize: "1rem" }}>
                        {token.hospitalName || "Hospital"}
                      </Typography>
                    </Box>
                    <Chip
                      label={`TOKEN #${token.tokenNumber}`}
                      sx={{ bgcolor: "#FFFFFF", color: "#0F766E", fontWeight: 900, fontSize: "0.8rem", flexShrink: 0 }}
                    />
                  </Box>


                  {/* Ticket Body */}
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                          Department
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          {token.departmentName || "General OPD"}
                        </Typography>
                      </Box>

                      <Divider />

                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                          Patient Name
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {token.customerName || "You"}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                          Booking Source
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, bgcolor: "#F1F5F9", px: 1.5, py: 0.5, borderRadius: 2 }}>
                          {token.bookingSource || "ONLINE"}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                          Payment Status
                        </Typography>
                        {token.status === "CANCELLED" ? (
                          <Chip
                            label={`💸 REFUND PENDING (₹${token.consultationFee ? Math.round(token.consultationFee) : 500})`}
                            size="small"
                            sx={{ bgcolor: "#FFFBEB", color: "#D97706", fontWeight: 800, border: "1px solid #FCD34D" }}
                          />
                        ) : (
                          <Chip
                            icon={<CheckCircle fontSize="small" sx={{ color: "#FFFFFF !important" }} />}
                            label={`PAID (₹${token.consultationFee ? Math.round(token.consultationFee) : 500})`}
                            size="small"
                            sx={{ bgcolor: "#10B981", color: "#FFFFFF", fontWeight: 800 }}
                          />
                        )}
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                          Current Status
                        </Typography>
                        {getStatusChip(token.status)}
                      </Box>

                      {/* Triage Priority Badge if Emergency or Senior Citizen */}
                      {token.priority && token.priority !== "REGULAR" && (
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="body2" color="text.secondary">
                            Queue Priority
                          </Typography>
                          {token.priority === "EMERGENCY" ? (
                            <Chip
                              icon={<PriorityHigh sx={{ fontSize: 16, color: "#FFFFFF !important" }} />}
                              label="🚨 EMERGENCY PRIORITY"
                              size="small"
                              sx={{ bgcolor: "#DC2626", color: "#FFFFFF", fontWeight: 800 }}
                            />
                          ) : token.priority === "SENIOR_CITIZEN" ? (
                            <Chip
                              label="👴 SENIOR CITIZEN (60+)"
                              size="small"
                              sx={{ bgcolor: "#D97706", color: "#FFFFFF", fontWeight: 800 }}
                            />
                          ) : (
                            <Chip
                              label={token.priority}
                              size="small"
                              sx={{ bgcolor: "#6366F1", color: "#FFFFFF", fontWeight: 700 }}
                            />
                          )}
                        </Box>
                      )}

                      {/* Live Queue Status & Wait Time Card */}
                      {token.status === "SERVING" && (
                        <Box sx={{ p: 2, borderRadius: 3, bgcolor: "#ECFDF5", border: "1.5px solid #10B981" }}>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <FiberManualRecord sx={{ color: "#10B981", fontSize: 16, animation: "pulse 1.5s infinite" }} />
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#065F46" }}>
                                🔔 YOUR TURN NOW!
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#047857", fontWeight: 600 }}>
                                Please proceed inside consultation room. Doctor is ready.
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      )}

                      {(token.status === "WAITING" || token.status === "PENDING" || token.status === "BOOKED") && (
                        <Box sx={{ p: 2, borderRadius: 3, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: "#0F766E", display: "flex", alignItems: "center", gap: 0.5 }}>
                              <FiberManualRecord sx={{ fontSize: 10, color: "#10B981" }} /> LIVE QUEUE TRACKER
                            </Typography>
                            {token.currentServingTokenNumber && (
                              <Chip
                                size="small"
                                label={`Calling: #${token.currentServingTokenNumber}`}
                                sx={{ bgcolor: "#E6FFFA", color: "#0D9488", fontWeight: 800, fontSize: "0.72rem" }}
                              />
                            )}
                          </Box>

                          <Grid container spacing={1.5}>
                            <Grid item xs={6}>
                              <Box sx={{ p: 1.2, bgcolor: "#FFFFFF", borderRadius: 2, textAlign: "center", border: "1px solid #E2E8F0" }}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                                  <PeopleAlt sx={{ fontSize: 14 }} /> Ahead of You
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 900, color: token.patientsAhead === 0 ? "#16A34A" : "#0F172A", mt: 0.2 }}>
                                  {token.patientsAhead !== undefined && token.patientsAhead !== null
                                    ? (token.patientsAhead === 0 ? "You're Next!" : `${token.patientsAhead} patient${token.patientsAhead > 1 ? "s" : ""}`)
                                    : "Calculating..."}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box sx={{ p: 1.2, bgcolor: "#FFFFFF", borderRadius: 2, textAlign: "center", border: "1px solid #E2E8F0" }}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                                  <Timer sx={{ fontSize: 14 }} /> Est. Wait Time
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 900, color: "#0D9488", mt: 0.2 }}>
                                  {token.estimatedWaitMinutes !== undefined && token.estimatedWaitMinutes !== null
                                    ? `~${token.estimatedWaitMinutes} mins`
                                    : "~10 mins"}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      )}


                    </Stack>

                    {/* Actions */}
                    <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        href={`${API_BASE}/customer/payments/${token.tokenId}/pdf`}
                        target="_blank"
                        sx={{ fontWeight: 800, borderRadius: 2 }}
                      >
                        📄 Receipt PDF
                      </Button>


                      {(token.status === "PENDING" || token.status === "BOOKED" || token.status === "WAITING") && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<Cancel />}
                          disabled={cancelLoading}
                          onClick={() => handleCancelToken(token.tokenId)}
                        >
                          Cancel Token
                        </Button>
                      )}
                    </Box>



                  </CardContent>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default MyTokens;