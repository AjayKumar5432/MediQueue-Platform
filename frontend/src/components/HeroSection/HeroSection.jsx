import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { ConfirmationNumber, LocalHospital } from "@mui/icons-material";
import LiveQueueCard from "../LiveQueueCard/LiveQueueCard";

function HeroSection() {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        background: "radial-gradient(circle at 80% 20%, rgba(13, 148, 136, 0.08) 0%, rgba(248, 250, 252, 0) 50%)"
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: 6
        }}
      >
        {/* Left Side */}
        <Box sx={{ flex: 1, maxWidth: { md: 650 } }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "primary.light",
              color: "primary.dark",
              px: 2,
              py: 0.8,
              borderRadius: "20px",
              fontWeight: 700,
              fontSize: "0.85rem",
              mb: 3
            }}
          >
            <LocalHospital fontSize="small" /> Multi-Hospital Queue Platform
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.2rem", sm: "2.8rem", md: "3.5rem" },
              fontWeight: 900,
              lineHeight: 1.15,
              color: "text.primary",
              mb: 2.5
            }}
          >
            Zero Hospital Wait Time.{" "}
            <Typography
              component="span"
              variant="inherit"
              sx={{
                background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Live Token Queue.
            </Typography>
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              mb: 4,
              lineHeight: 1.7,
              fontSize: "1.1rem",
              fontWeight: 400
            }}
          >
            Book OPD tokens online across top hospitals, view your live queue position from your phone, and walk into the doctor's room right on schedule.
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              size="large"
              startIcon={<ConfirmationNumber />}
              sx={{ py: 1.5, px: 3.5, fontSize: "1rem", fontWeight: 800 }}
            >
              Register & Book Token
            </Button>

            <Button
              component={Link}
              to="/login"
              variant="outlined"
              size="large"
              sx={{ py: 1.5, px: 3.5, fontSize: "1rem", fontWeight: 700 }}
            >
              Sign In to Portal
            </Button>
          </Box>
        </Box>

        {/* Right Side */}
        <Box sx={{ display: "flex", justifyContent: "center", width: { xs: "100%", md: "auto" } }}>
          <LiveQueueCard />
        </Box>
      </Box>
    </Box>
  );
}

export default HeroSection;