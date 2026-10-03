import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
  Paper,
  Grid
} from "@mui/material";
import {
  LocalHospital,
  ConfirmationNumber,
  AccessTime,
  MedicalServices,
  Wifi
} from "@mui/icons-material";

function LiveQueueCard() {
  return (
    <Card
      elevation={8}
      sx={{
        width: "100%",
        maxWidth: 450,
        borderRadius: 5,
        background: "linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 100%)",
        border: "1px solid rgba(226, 232, 240, 0.8)",
        boxShadow: "0 20px 40px rgba(13, 148, 136, 0.12)",
        position: "relative",
        overflow: "visible"
      }}
    >
      <CardContent sx={{ p: 3.5 }}>
        {/* Top Header Row */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFF",
                boxShadow: "0 4px 10px rgba(13, 148, 136, 0.3)"
              }}
            >
              <LocalHospital fontSize="small" />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}>
                Apollo Speciality
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Hitech City, Hyd
              </Typography>
            </Box>
          </Box>

          {/* Animated Pulse Live Badge */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "#F0FDF4",
              color: "#166534",
              px: 1.5,
              py: 0.6,
              borderRadius: "20px",
              border: "1px solid #BBF7D0"
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "#22C55E",
                boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.7)"
              }}
            />
            <Typography variant="caption" sx={{ fontWeight: 800, fontSize: "0.75rem", letterSpacing: 0.5 }}>
              LIVE
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 2, borderColor: "#E2E8F0" }} />

        {/* Department Info */}
        <Box sx={{ mb: 2.5 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
            <MedicalServices fontSize="small" sx={{ color: "primary.main" }} />
            <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.5 }}>
              OPD Department
            </Typography>
          </Stack>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A" }}>
            Cardiology OPD (Counter #3)
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Consultant: Dr. Sarah Jenkins (Senior Cardiologist)
          </Typography>
        </Box>

        {/* Big NOW SERVING Banner */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 4,
            background: "linear-gradient(135deg, #0F766E 0%, #0D9488 100%)",
            color: "#FFFFFF",
            textAlign: "center",
            mb: 2.5,
            boxShadow: "0 10px 20px rgba(13, 148, 136, 0.25)"
          }}
        >
          <Typography variant="overline" sx={{ opacity: 0.85, fontWeight: 800, letterSpacing: 1.5, fontSize: "0.7rem" }}>
            NOW SERVING IN ROOM
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              my: 0.5,
              fontSize: "3rem",
              letterSpacing: "-1px"
            }}
          >
            #14
          </Typography>
          <Chip
            label="Patient: Rajesh M."
            size="small"
            sx={{ bgcolor: "rgba(255, 255, 255, 0.2)", color: "#FFFFFF", fontWeight: 700, fontSize: "0.75rem" }}
          />
        </Paper>

        {/* Next Token & Estimated Wait Time Split Cards */}
        <Grid container spacing={1.5}>
          {/* Next Token */}
          <Grid item xs={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: "#F1F5F9",
                border: "1px solid #E2E8F0",
                height: "100%"
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                <ConfirmationNumber fontSize="small" sx={{ color: "primary.main" }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
                  Next Token
                </Typography>
              </Stack>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A" }}>
                #15
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Waiting outside
              </Typography>
            </Paper>
          </Grid>

          {/* Est Wait Time */}
          <Grid item xs={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: "#FEF3C7",
                border: "1px solid #FDE68A",
                height: "100%"
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                <AccessTime fontSize="small" sx={{ color: "#D97706" }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#B45309" }}>
                  Est. Wait Time
                </Typography>
              </Stack>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#92400E" }}>
                ~ 6 mins
              </Typography>
              <Typography variant="caption" sx={{ color: "#B45309" }}>
                Avg 8m / patient
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Bottom Footer Info */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2.5, px: 0.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B" }}>
            12 Patients in Queue Today
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#10B981" }}>
            <Wifi fontSize="inherit" />
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              Live STOMP
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default LiveQueueCard;