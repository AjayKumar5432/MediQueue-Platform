import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Stack,
  CircularProgress,
  Alert,
  MenuItem,
  Avatar
} from "@mui/material";
import {
  Search,
  Refresh,
  HistoryEdu,
  Security,
  LocalHospital,
  Emergency,
  AdminPanelSettings,
  Download,
  FilterList,
  CheckCircle,
  Warning,
  Error
} from "@mui/icons-material";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar/Navbar";
import { getAuditLogs } from "../../api/auditLogApi";

function AuditTrailManagement() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [severityFilter, setSeverityFilter] = useState("ALL");

  useEffect(() => {
    fetchLogs();
  }, [categoryFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await getAuditLogs(categoryFilter);
      setLogs(res.data || []);
    } catch (err) {
      console.error("Failed to load audit logs", err);
      toast.error("Failed to retrieve platform audit logs.");
    } finally {
      setLoading(false);
    }
  };

  // Filter logs locally by search keyword and severity
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      !searchTerm.trim() ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actorEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetResource?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity =
      severityFilter === "ALL" || log.severity?.toUpperCase() === severityFilter;

    return matchesSearch && matchesSeverity;
  });

  const getActionIcon = (action, category) => {
    if (category === "SECURITY") return <Security sx={{ fontSize: 18, color: "#6366F1" }} />;
    if (category === "QUEUE_TRIAGE") return <Emergency sx={{ fontSize: 18, color: "#EF4444" }} />;
    if (category === "HOSPITAL") return <LocalHospital sx={{ fontSize: 18, color: "#0D9488" }} />;
    if (category === "ADMINISTRATION") return <AdminPanelSettings sx={{ fontSize: 18, color: "#F59E0B" }} />;
    return <HistoryEdu sx={{ fontSize: 18, color: "#64748B" }} />;
  };

  const getSeverityChip = (severity) => {
    switch (severity?.toUpperCase()) {
      case "CRITICAL":
        return <Chip icon={<Error fontSize="small" />} label="CRITICAL" size="small" sx={{ bgcolor: "#FEE2E2", color: "#DC2626", fontWeight: 800 }} />;
      case "WARNING":
        return <Chip icon={<Warning fontSize="small" />} label="WARNING" size="small" sx={{ bgcolor: "#FEF3C7", color: "#D97706", fontWeight: 800 }} />;
      default:
        return <Chip icon={<CheckCircle fontSize="small" />} label="INFO" size="small" sx={{ bgcolor: "#E0F2FE", color: "#0284C7", fontWeight: 700 }} />;
    }
  };

  const exportToCSV = () => {
    if (filteredLogs.length === 0) {
      toast.info("No audit logs to export.");
      return;
    }
    const headers = ["Timestamp", "Action", "Category", "Actor Email", "Actor Role", "Target Resource", "Details", "Severity"];
    const rows = filteredLogs.map((l) => [
      `"${l.timestamp || ""}"`,
      `"${l.action || ""}"`,
      `"${l.category || ""}"`,
      `"${l.actorEmail || ""}"`,
      `"${l.actorRole || ""}"`,
      `"${l.targetResource || ""}"`,
      `"${(l.details || "").replace(/"/g, '""')}"`,
      `"${l.severity || ""}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MediQueue_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Audit trail exported successfully!");
  };

  const formatTimestamp = (ts) => {
    if (!ts) return "N/A";
    const d = new Date(ts);
    return isNaN(d.getTime()) ? ts : d.toLocaleString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  // Metric counts
  const totalEvents = logs.length;
  const adminEvents = logs.filter((l) => l.category === "ADMINISTRATION").length;
  const triageEvents = logs.filter((l) => l.category === "QUEUE_TRIAGE").length;
  const securityEvents = logs.filter((l) => l.category === "SECURITY" || l.category === "SYSTEM").length;

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              <Chip
                label="SUPER ADMIN AUDIT ENGINE"
                size="small"
                sx={{ bgcolor: "#0F172A", color: "#FFFFFF", fontWeight: 800 }}
              />
              <Chip
                label="Tamper-Evident System Log"
                size="small"
                sx={{ bgcolor: "#E2E8F0", color: "#334155", fontWeight: 700 }}
              />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary" }}>
              Platform Audit Trail & Activity Log
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track administrative actions, emergency triage changes, hospital status transitions, and security events across the platform
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchLogs}
              sx={{ fontWeight: 700 }}
            >
              Refresh Logs
            </Button>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={exportToCSV}
              sx={{
                bgcolor: "#0D9488",
                fontWeight: 800,
                borderRadius: "10px",
                "&:hover": { bgcolor: "#0F766E" }
              }}
            >
              Export CSV Report
            </Button>
          </Stack>
        </Box>

        {/* Stats Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderLeft: "4px solid #0F172A", borderRadius: 3 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography color="text.secondary" variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                  Total Logged Events
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A", mt: 0.5 }}>
                  {totalEvents}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Across all network activities
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderLeft: "4px solid #F59E0B", borderRadius: 3 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography color="text.secondary" variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                  Admin Reviews & Approvals
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#D97706", mt: 0.5 }}>
                  {adminEvents}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Hospital administrator actions
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderLeft: "4px solid #EF4444", borderRadius: 3 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography color="text.secondary" variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                  Emergency Triage Overrides
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#DC2626", mt: 0.5 }}>
                  {triageEvents}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Priority token escalations
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderLeft: "4px solid #6366F1", borderRadius: 3 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography color="text.secondary" variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                  Security & Config Updates
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#4F46E5", mt: 0.5 }}>
                  {securityEvents}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Policies & system changes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters and Search Toolbar */}
        <Paper elevation={1} sx={{ p: 2.5, mb: 3, borderRadius: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
              <TextField
                placeholder="Search by action, actor email, target resource, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3.5}>
              <TextField
                select
                label="Category Filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                size="small"
                fullWidth
              >
                <MenuItem value="ALL">All Categories ({logs.length})</MenuItem>
                <MenuItem value="ADMINISTRATION">Administration</MenuItem>
                <MenuItem value="QUEUE_TRIAGE">Queue Triage & Priority</MenuItem>
                <MenuItem value="HOSPITAL">Hospital Management</MenuItem>
                <MenuItem value="SECURITY">Security & Auth</MenuItem>
                <MenuItem value="SYSTEM">System Initialization</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={3.5}>
              <TextField
                select
                label="Severity Filter"
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                size="small"
                fullWidth
              >
                <MenuItem value="ALL">All Severities</MenuItem>
                <MenuItem value="INFO">🟢 INFO</MenuItem>
                <MenuItem value="WARNING">🟡 WARNING</MenuItem>
                <MenuItem value="CRITICAL">🔴 CRITICAL</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Paper>

        {/* Audit Log Table */}
        <Paper elevation={2} sx={{ borderRadius: 4, overflow: "hidden" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : filteredLogs.length === 0 ? (
            <Box sx={{ p: 6, textAlign: "center" }}>
              <HistoryEdu sx={{ fontSize: 56, color: "text.disabled", mb: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                No Matching Audit Logs Found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search query or category filters.
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Timestamp</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Action & Category</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Actor</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Target Resource</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Activity Description</TableCell>
                    <TableCell sx={{ fontWeight: 800 }} align="center">Severity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow
                      key={log.id}
                      sx={{
                        "&:hover": { bgcolor: "#F8FAFC" },
                        transition: "background-color 0.15s"
                      }}
                    >
                      <TableCell sx={{ whiteSpace: "nowrap", fontSize: "0.82rem", color: "text.secondary", fontWeight: 600 }}>
                        {formatTimestamp(log.timestamp)}
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          {getActionIcon(log.action, log.category)}
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 800, fontSize: "0.85rem", color: "#0F172A" }}>
                              {log.action}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                              {log.category}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar sx={{ width: 28, height: 28, fontSize: "0.75rem", bgcolor: "#E2E8F0", color: "#334155", fontWeight: 700 }}>
                            {log.actorEmail ? log.actorEmail.charAt(0).toUpperCase() : "S"}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700, fontSize: "0.82rem" }}>
                              {log.actorEmail || "system"}
                            </Typography>
                            <Chip
                              label={log.actorRole || "SYSTEM"}
                              size="small"
                              sx={{ height: 18, fontSize: "0.65rem", fontWeight: 800, bgcolor: "#F1F5F9" }}
                            />
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#334155" }}>
                        {log.targetResource || "—"}
                      </TableCell>

                      <TableCell sx={{ fontSize: "0.85rem", color: "#475569", maxWidth: 400 }}>
                        {log.details || "—"}
                      </TableCell>

                      <TableCell align="center">
                        {getSeverityChip(log.severity)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default AuditTrailManagement;
