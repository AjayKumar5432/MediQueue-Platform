import { useEffect, useState, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  TextField,
  MenuItem,
  Stack,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from "@mui/material";
import {
  PlayArrow,
  CheckCircle,
  Refresh,
  ConfirmationNumber,
  People,
  MedicalServices,
  Wifi,
  WifiOff,
  Person,
  Close,
  PersonAdd
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs.js";

import Navbar from "../../components/Navbar/Navbar";
import { getTodayQueue, getCurrentServingToken, callNextToken, completeToken, issueWalkInToken, updateTokenPriority } from "../../api/queueApi";
import { recordCashPayment } from "../../api/paymentApi";
import { getDepartmentsByHospital, getHospitalDepartments } from "../../api/hospitalDepartmentApi";
import { getRole, getHospitalId, getHospitalDepartmentId } from "../../utils/session";


function QueueManagement() {
  const [searchParams] = useSearchParams();
  const actionParam = searchParams.get("action");
  const deptParam = searchParams.get("deptId") || searchParams.get("departmentId");

  const userRole = getRole();
  const userHospitalId = getHospitalId();
  const userDeptId = getHospitalDepartmentId();

  const [availableDepartments, setAvailableDepartments] = useState([]);
  const [departmentId, setDepartmentId] = useState(deptParam || userDeptId || "");
  const [queue, setQueue] = useState([]);
  const [currentServing, setCurrentServing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Walk-In Token Booking Modal State for Staff
  const [walkInModalOpen, setWalkInModalOpen] = useState(actionParam === "walkin");

  const [walkInForm, setWalkInForm] = useState({
    patientName: "",
    patientPhone: "",
    patientEmail: "",
    deptId: deptParam || userDeptId || "",
    priority: "REGULAR"
  });

  useEffect(() => {
    loadHospitalDepartments();
  }, [userHospitalId, userRole]);

  const loadHospitalDepartments = async () => {
    try {
      let depts = [];
      if (userRole === "SUPER_ADMIN") {
        const res = await getHospitalDepartments();
        depts = res.data || [];
      } else if (userHospitalId) {
        const res = await getDepartmentsByHospital(userHospitalId);
        depts = res.data || [];
      }

      setAvailableDepartments(depts);

      if (depts.length > 0) {
        const validParam = depts.find(d => String(d.hospitalDepartmentId) === String(deptParam));
        const validUserDept = depts.find(d => String(d.hospitalDepartmentId) === String(userDeptId));

        let initialId = "";
        if (validParam) {
          initialId = String(validParam.hospitalDepartmentId);
        } else if (validUserDept) {
          initialId = String(validUserDept.hospitalDepartmentId);
        } else {
          initialId = String(depts[0].hospitalDepartmentId);
        }

        setDepartmentId(initialId);
        setWalkInForm(prev => ({ ...prev, deptId: initialId }));
      }
    } catch (err) {
      console.error("Failed to load hospital departments:", err);
    }
  };
  const [submittingWalkIn, setSubmittingWalkIn] = useState(false);

  const handlePriorityChange = async (tokenId, newPriority) => {
    try {
      await updateTokenPriority(tokenId, newPriority);
      toast.success(`Priority updated to ${newPriority}`);
      fetchQueueData(departmentId);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update token priority.");
    }
  };

  const handleIssueWalkInSubmit = async (e) => {
    e.preventDefault();
    if (!walkInForm.patientName.trim()) {
      toast.warning("Patient Name is required for walk-in token.");
      return;
    }
    if (!walkInForm.patientPhone.trim()) {
      toast.warning("Patient Phone Number is required.");
      return;
    }
    const targetDeptId = walkInForm.deptId || departmentId || "1";

    setSubmittingWalkIn(true);
    try {
      const res = await recordCashPayment({
        hospitalDepartmentId: Number(targetDeptId),
        bookingSource: "WALK_IN",
        patientName: walkInForm.patientName.trim(),
        patientPhone: walkInForm.patientPhone.trim(),
        patientEmail: walkInForm.patientEmail.trim(),
        priority: walkInForm.priority || "REGULAR"
      });

      const tokenNo = res.data?.tokenNumber || res.data?.tokenDetails?.tokenNumber || "Walk-In";
      toast.success(`🎟️ Walk-In Token #${tokenNo} issued (Cash Fee Received) for ${walkInForm.patientName}!`);
      setWalkInModalOpen(false);
      setWalkInForm({ patientName: "", patientPhone: "", patientEmail: "", deptId: departmentId || "1", priority: "REGULAR" });
      fetchQueueData(targetDeptId);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || "Failed to issue walk-in token.";
      toast.error(msg);
    } finally {
      setSubmittingWalkIn(false);
    }
  };



  const stompClientRef = useRef(null);

  useEffect(() => {
    if (departmentId) {
      fetchQueueData(departmentId);
      connectWebSocket(departmentId);
    }

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [departmentId]);

  // Connect STOMP WebSocket for real-time live queue sync
  const connectWebSocket = (deptId) => {
    try {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }

      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
      const wsUrl = apiBase.endsWith("/api") ? apiBase.replace(/\/api$/, "/ws") : `${apiBase}/ws`;

      const client = new Client({
        webSocketFactory: () => new SockJS(wsUrl),
        reconnectDelay: 5000,
        onConnect: () => {
          setWsConnected(true);
          console.log("WebSocket Connected to MediQueue Live Broker");

          client.subscribe(`/topic/queue/${deptId}`, (message) => {
            console.log("Live WebSocket Event Received:", message.body);
            toast.info("Queue updated live!");
            fetchQueueData(deptId);
          });
        },
        onDisconnect: () => {
          setWsConnected(false);
        },
        onStompError: (frame) => {
          console.error("STOMP error", frame);
          setWsConnected(false);
        }
      });

      client.activate();
      stompClientRef.current = client;
    } catch (err) {
      console.error("WebSocket Connection Error:", err);
    }
  };

  const fetchQueueData = async (deptId) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const [queueRes, currentRes] = await Promise.allSettled([
        getTodayQueue(deptId),
        getCurrentServingToken(deptId)
      ]);

      if (queueRes.status === "fulfilled") {
        setQueue(queueRes.value.data || []);
      } else {
        const err = queueRes.reason?.response?.data?.message || "Failed to load queue.";
        setErrorMsg(err);
        setQueue([]);
      }

      if (currentRes.status === "fulfilled" && currentRes.value.data) {
        setCurrentServing(currentRes.value.data);
      } else {
        setCurrentServing(null);
      }
    } catch (err) {
      console.error("Failed to load queue data", err);
    } finally {
      setLoading(false);
    }
  };

  // Call Next Patient Token
  const handleCallNext = async () => {
    if (!departmentId) {
      toast.warning("Please specify a Department ID.");
      return;
    }

    setActionLoading(true);
    try {
      const response = await callNextToken(departmentId);
      toast.success(`Calling Token No: ${response.data.tokenNumber}`);
      setCurrentServing(response.data);
      fetchQueueData(departmentId);
    } catch (err) {
      const msg = err.response?.data?.message || "No pending tokens in queue for today.";
      toast.info(msg);
    } finally {
      setActionLoading(false);
    }
  };

  // Complete Token Consultation
  const handleComplete = async (tokenId) => {
    if (!tokenId) return;

    setActionLoading(true);
    try {
      await completeToken(tokenId);
      toast.success("Consultation completed!");
      setCurrentServing(null);
      fetchQueueData(departmentId);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete token.");
    } finally {
      setActionLoading(false);
    }
  };

  const pendingTokens = queue.filter(t => t.status === "PENDING" || t.status === "BOOKED" || t.status === "WAITING");
  const completedTokens = queue.filter(t => t.status === "COMPLETED");

  const getStatusChip = (status) => {
    switch (status) {
      case "SERVING":
        return <Chip label="SERVING NOW" color="primary" size="small" sx={{ fontWeight: 800 }} />;
      case "PENDING":
      case "BOOKED":
      case "WAITING":
        return <Chip label="WAITING" color="warning" size="small" sx={{ fontWeight: 700 }} />;
      case "COMPLETED":
        return <Chip label="COMPLETED" color="success" size="small" sx={{ fontWeight: 700 }} />;
      case "CANCELLED":
        return <Chip label="CANCELLED" color="error" size="small" sx={{ fontWeight: 700 }} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary" }}>
              Doctor & Staff Live Queue Console
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage live patient consultation flow and department queues in real-time
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              icon={wsConnected ? <Wifi fontSize="small" /> : <WifiOff fontSize="small" />}
              label={wsConnected ? "WebSocket Live Connected" : "Polling Mode"}
              color={wsConnected ? "success" : "default"}
              variant="outlined"
              sx={{ fontWeight: 700 }}
            />

            <TextField
              select
              size="small"
              label="Select OPD Department"
              value={departmentId || ""}
              onChange={(e) => {
                const newId = e.target.value;
                setDepartmentId(newId);
                setWalkInForm(prev => ({ ...prev, deptId: newId }));
              }}
              sx={{ minWidth: 240, bgcolor: "#fff" }}
              helperText="Assigned Hospital OPD Counter"
            >
              {availableDepartments.length > 0 ? (
                availableDepartments.map((dept) => (
                  <MenuItem key={dept.hospitalDepartmentId} value={String(dept.hospitalDepartmentId)}>
                    {dept.departmentName || dept.department?.departmentName || `OPD Dept #${dept.hospitalDepartmentId}`}
                    {userRole === "SUPER_ADMIN" && dept.hospitalName ? ` (${dept.hospitalName})` : ""}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value={departmentId || "1"}>
                  {departmentId ? `Department #${departmentId}` : "Loading OPD Departments..."}
                </MenuItem>
              )}
            </TextField>

            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => fetchQueueData(departmentId)}
            >
              Refresh
            </Button>

            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => {
                setWalkInForm(prev => ({ ...prev, deptId: departmentId || "1" }));
                setWalkInModalOpen(true);
              }}
              sx={{
                fontWeight: 800,
                bgcolor: "#0D9488",
                color: "#FFFFFF",
                borderRadius: "10px",
                px: 2.5,
                "&:hover": { bgcolor: "#0F766E" }
              }}
            >
              + Issue Walk-In Token
            </Button>
          </Stack>

        </Box>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 3, fontWeight: 700 }}>
            {errorMsg}
          </Alert>
        )}

        {/* Stats Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderLeft: "4px solid #0D9488" }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography color="text.secondary" variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                  Currently Serving
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "primary.main", mt: 0.5 }}>
                  {currentServing ? `#${currentServing.tokenNumber}` : "None"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {currentServing ? currentServing.customerName || "Patient in room" : "Doctor is ready"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderLeft: "4px solid #F59E0B" }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography color="text.secondary" variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                  Patients Waiting
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "warning.main", mt: 0.5 }}>
                  {pendingTokens.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Tokens in queue today
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderLeft: "4px solid #10B981" }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography color="text.secondary" variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                  Completed Today
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "success.main", mt: 0.5 }}>
                  {completedTokens.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Consultations finished
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderLeft: "4px solid #6366F1" }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography color="text.secondary" variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                  Total Issued
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "secondary.main", mt: 0.5 }}>
                  {queue.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  All daily tokens
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          {/* NOW SERVING BIG CARD & ACTIONS */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={4}
              sx={{
                p: 4,
                borderRadius: 4,
                background: currentServing
                  ? "linear-gradient(135deg, #0F766E 0%, #0D9488 100%)"
                  : "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
                color: "#FFFFFF",
                boxShadow: "0 12px 30px rgba(13, 148, 136, 0.25)"
              }}
            >
              <Typography variant="overline" sx={{ letterSpacing: 1.5, opacity: 0.8, fontWeight: 700 }}>
                CONSULTATION COUNTER
              </Typography>

              {currentServing ? (
                <Box sx={{ my: 3, textAlign: "center" }}>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    NOW SERVING
                  </Typography>
                  <Typography variant="h1" sx={{ fontWeight: 900, my: 1, fontSize: "4rem", letterSpacing: "-1px" }}>
                    {currentServing.tokenNumber}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {currentServing.customerName || "Patient"}
                  </Typography>
                  <Chip
                    label={currentServing.bookingSource || "ONLINE"}
                    size="small"
                    sx={{ mt: 1, bgcolor: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 700 }}
                  />
                </Box>
              ) : (
                <Box sx={{ my: 4, textAlign: "center" }}>
                  <MedicalServices sx={{ fontSize: 60, opacity: 0.4, mb: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Counter Available
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7, mt: 0.5 }}>
                    Click "Call Next Token" to begin consultation
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.2)" }} />

              <Stack spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={actionLoading ? <CircularProgress size={20} color="inherit" /> : <PlayArrow />}
                  disabled={actionLoading}
                  onClick={handleCallNext}
                  sx={{
                    bgcolor: "#FFFFFF",
                    color: "#0F766E",
                    py: 1.5,
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    "&:hover": { bgcolor: "#F1F5F9" }
                  }}
                >
                  Call Next Token
                </Button>

                {currentServing && (
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<CheckCircle />}
                    disabled={actionLoading}
                    onClick={() => handleComplete(currentServing.tokenId)}
                    sx={{
                      color: "#FFFFFF",
                      borderColor: "rgba(255,255,255,0.6)",
                      py: 1.4,
                      fontWeight: 700,
                      "&:hover": { borderColor: "#FFFFFF", bgcolor: "rgba(255,255,255,0.1)" }
                    }}
                  >
                    Mark Consultation Completed
                  </Button>
                )}
              </Stack>
            </Paper>
          </Grid>

          {/* LIVE QUEUE TABLE */}
          <Grid item xs={12} md={7}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                Today's Queue Roster
              </Typography>

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                  <CircularProgress />
                </Box>
              ) : queue.length === 0 ? (
                <Alert severity="info" sx={{ my: 2 }}>
                  No tokens registered for this department today.
                </Alert>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Token #</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Patient Name</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Priority</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Source</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {queue.map((row) => (
                        <TableRow
                          key={row.tokenId}
                          sx={{
                            bgcolor: row.status === "SERVING" ? "#F0FDF4" : (row.priority === "EMERGENCY" ? "#FEF2F2" : "inherit"),
                            "&:hover": { bgcolor: "#F8FAFC" }
                          }}
                        >
                          <TableCell sx={{ fontWeight: 800, color: "primary.main" }}>
                            #{row.tokenNumber}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Person fontSize="small" color="action" />
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {row.customerName || `Patient #${row.tokenId}`}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            {row.status === "WAITING" || row.status === "PENDING" || row.status === "BOOKED" ? (
                              <TextField
                                select
                                size="small"
                                value={row.priority || "REGULAR"}
                                onChange={(e) => handlePriorityChange(row.tokenId, e.target.value)}
                                sx={{
                                  minWidth: 145,
                                  "& .MuiSelect-select": {
                                    py: 0.6,
                                    px: 1.2,
                                    fontSize: "0.78rem",
                                    fontWeight: 800,
                                    bgcolor: row.priority === "EMERGENCY" ? "#FEE2E2" : row.priority === "SENIOR_CITIZEN" ? "#FEF3C7" : "#F1F5F9",
                                    color: row.priority === "EMERGENCY" ? "#DC2626" : row.priority === "SENIOR_CITIZEN" ? "#D97706" : "#475569",
                                    borderRadius: "8px"
                                  }
                                }}
                              >
                                <MenuItem value="REGULAR" sx={{ fontSize: "0.8rem", fontWeight: 600 }}>🟢 Regular</MenuItem>
                                <MenuItem value="SENIOR_CITIZEN" sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#D97706" }}>👴 Senior Citizen</MenuItem>
                                <MenuItem value="EMERGENCY" sx={{ fontSize: "0.8rem", fontWeight: 800, color: "#DC2626" }}>🚨 Emergency</MenuItem>
                              </TextField>
                            ) : (
                              <Chip
                                size="small"
                                label={row.priority === "EMERGENCY" ? "🚨 Emergency" : row.priority === "SENIOR_CITIZEN" ? "👴 Senior" : "Regular"}
                                sx={{
                                  fontWeight: 800,
                                  bgcolor: row.priority === "EMERGENCY" ? "#FEE2E2" : row.priority === "SENIOR_CITIZEN" ? "#FEF3C7" : "#F1F5F9",
                                  color: row.priority === "EMERGENCY" ? "#DC2626" : row.priority === "SENIOR_CITIZEN" ? "#D97706" : "#475569"
                                }}
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
                              {row.bookingSource || "ONLINE"}
                            </Typography>
                          </TableCell>
                          <TableCell>{getStatusChip(row.status)}</TableCell>
                          <TableCell align="right">
                            {row.status === "SERVING" && (
                              <Button
                                size="small"
                                color="success"
                                variant="contained"
                                onClick={() => handleComplete(row.tokenId)}
                              >
                                Complete
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* WALK-IN TOKEN BOOKING MODAL FOR STAFF */}
      <Dialog
        open={walkInModalOpen}
        onClose={() => !submittingWalkIn && setWalkInModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4, overflow: "hidden" }
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
            color: "#FFFFFF",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 2.5,
            px: 3
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <ConfirmationNumber sx={{ fontSize: 28 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                Issue Walk-In OPD Token
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Hospital Desk Patient Registration & Live Token Booking
              </Typography>
            </Box>
          </Box>
          <IconButton
            size="small"
            onClick={() => setWalkInModalOpen(false)}
            disabled={submittingWalkIn}
            sx={{ color: "#FFFFFF" }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleIssueWalkInSubmit}>
          <DialogContent sx={{ p: 3.5 }}>
            <Stack spacing={2.5}>
              <Alert severity="info" sx={{ borderRadius: 3, fontWeight: 600 }}>
                This will generate a <strong>WALK_IN</strong> OPD consultation token for desk patients arriving in person.
              </Alert>

              <TextField
                select
                label="Target Hospital Department"
                size="small"
                fullWidth
                required
                value={walkInForm.deptId || ""}
                onChange={(e) => setWalkInForm(prev => ({ ...prev, deptId: e.target.value }))}
                helperText="Select assigned OPD counter department for walk-in token"
              >
                {availableDepartments.map((dept) => (
                  <MenuItem key={dept.hospitalDepartmentId} value={String(dept.hospitalDepartmentId)}>
                    {dept.departmentName || dept.department?.departmentName || `Dept #${dept.hospitalDepartmentId}`}
                    {userRole === "SUPER_ADMIN" && dept.hospitalName ? ` (${dept.hospitalName})` : ""}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Queue Priority (Triage)"
                size="small"
                fullWidth
                value={walkInForm.priority}
                onChange={(e) => setWalkInForm(prev => ({ ...prev, priority: e.target.value }))}
                helperText="Designate emergency or senior citizen priority"
              >
                <MenuItem value="REGULAR">🟢 Regular Patient (Standard Queue)</MenuItem>
                <MenuItem value="SENIOR_CITIZEN">👴 Senior Citizen Priority (60+ yrs)</MenuItem>
                <MenuItem value="EMERGENCY">🚨 Medical Emergency / Critical Priority</MenuItem>
              </TextField>

              <TextField
                label="Patient Full Name"
                placeholder="e.g. Rajesh Kumar / Dr. Ramesh"
                fullWidth
                required
                value={walkInForm.patientName}
                onChange={(e) => setWalkInForm(prev => ({ ...prev, patientName: e.target.value }))}
              />

              <TextField
                label="Patient Phone Number"
                placeholder="e.g. 9876543210"
                fullWidth
                required
                value={walkInForm.patientPhone}
                onChange={(e) => setWalkInForm(prev => ({ ...prev, patientPhone: e.target.value }))}
              />

              <TextField
                label="Patient Email Address (Optional)"
                placeholder="e.g. rajesh@gmail.com"
                type="email"
                fullWidth
                value={walkInForm.patientEmail}
                onChange={(e) => setWalkInForm(prev => ({ ...prev, patientEmail: e.target.value }))}
                helperText="Official PDF receipt will be sent if email is provided."
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 1, bgcolor: "#F8FAFC" }}>
            <Button
              onClick={() => setWalkInModalOpen(false)}
              disabled={submittingWalkIn}
              sx={{ fontWeight: 700 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submittingWalkIn}
              startIcon={submittingWalkIn ? <CircularProgress size={20} color="inherit" /> : <ConfirmationNumber />}
              sx={{
                bgcolor: "#0D9488",
                fontWeight: 800,
                px: 3,
                py: 1.2,
                borderRadius: "10px",
                "&:hover": { bgcolor: "#0F766E" }
              }}
            >
              {submittingWalkIn ? "Issuing Token..." : "Issue Walk-In Token"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>

  );
}

export default QueueManagement;