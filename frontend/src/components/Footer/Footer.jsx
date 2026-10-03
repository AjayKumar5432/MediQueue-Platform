import { Box, Container, Typography, Stack, Link as MuiLink, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { LocalHospital, Phone, Email, LocationOn, Shield, Favorite } from "@mui/icons-material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#0F172A",
        color: "#94A3B8",
        pt: 8,
        pb: 4,
        mt: 8,
        borderTop: "1px solid rgba(255, 255, 255, 0.1)"
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 4,
            mb: 6
          }}
        >
          {/* Brand & Info */}
          <Box sx={{ flex: 1.5, minWidth: 280 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  bgcolor: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(255,255,255,0.2)",
                  boxShadow: "0 4px 12px rgba(13, 148, 136, 0.2)"
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="32" height="32">
                  <defs>
                    <linearGradient id="ftTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0D9488" />
                      <stop offset="100%" stopColor="#0F766E" />
                    </linearGradient>
                    <linearGradient id="ftAmberGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#FF7043" />
                    </linearGradient>
                  </defs>
                  <circle cx="30" cy="30" r="21" fill="none" stroke="url(#ftTealGrad)" strokeWidth="4.5" />
                  <path d="M41 41 L51 51" stroke="url(#ftTealGrad)" strokeWidth="5.5" strokeLinecap="round" />
                  <rect x="27" y="16" width="6" height="28" rx="2" fill="url(#ftTealGrad)" />
                  <rect x="16" y="27" width="28" height="6" rx="2" fill="url(#ftTealGrad)" />
                  <path d="M 6 30 L 17 30 L 21 21 L 26 39 L 31 15 L 36 35 L 40 30 L 55 30"
                        fill="none"
                        stroke="url(#ftAmberGrad)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round" />
                  <circle cx="55" cy="30" r="2.8" fill="#FF7043" />
                </svg>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 800, color: "#FFFFFF" }}>
                MediQueue
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ lineHeight: 1.7, mb: 3, maxWidth: 340 }}>
              Multi-Hospital Digital OPD Queue & Appointment Management Platform. Eliminating waiting lines for patients and streamlining OPD workflows for healthcare providers.
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#10B981" }}>
              <Shield fontSize="small" />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                HIPAA & DPDP Standards Compliant
              </Typography>
            </Box>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ flex: 1, minWidth: 180 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#FFFFFF", mb: 2 }}>
              Quick Navigation
            </Typography>
            <Stack spacing={1.5}>
              <MuiLink component={Link} to="/" color="inherit" underline="hover" sx={{ fontSize: "0.9rem" }}>
                Home
              </MuiLink>
              <MuiLink component={Link} to="/about" color="inherit" underline="hover" sx={{ fontSize: "0.9rem" }}>
                About Us
              </MuiLink>
              <MuiLink component={Link} to="/contact" color="inherit" underline="hover" sx={{ fontSize: "0.9rem" }}>
                Contact & Support
              </MuiLink>
              <MuiLink component={Link} to="/login" color="inherit" underline="hover" sx={{ fontSize: "0.9rem" }}>
                Patient Sign In
              </MuiLink>
              <MuiLink component={Link} to="/register" color="inherit" underline="hover" sx={{ fontSize: "0.9rem" }}>
                Patient Registration
              </MuiLink>
            </Stack>
          </Box>

          {/* Dedicated Portals */}
          <Box sx={{ flex: 1, minWidth: 180 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#FFFFFF", mb: 2 }}>
              Healthcare Portals
            </Typography>
            <Stack spacing={1.5}>
              <MuiLink component={Link} to="/login" color="inherit" underline="hover" sx={{ fontSize: "0.9rem" }}>
                Patient OPD Portal
              </MuiLink>
              <MuiLink component={Link} to="/register" color="inherit" underline="hover" sx={{ fontSize: "0.9rem" }}>
                Patient Registration
              </MuiLink>
              <MuiLink component={Link} to="/register-hospital" color="inherit" underline="hover" sx={{ fontSize: "0.9rem" }}>
                Register Hospital
              </MuiLink>
              <MuiLink component={Link} to="/admin/login" color="inherit" underline="hover" sx={{ fontSize: "0.85rem", opacity: 0.75 }}>
                Hospital Staff & Admin Access
              </MuiLink>
            </Stack>
          </Box>


          {/* Contact Details */}
          <Box sx={{ flex: 1.2, minWidth: 240 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#FFFFFF", mb: 2 }}>
              Emergency & Support
            </Typography>
            <Stack spacing={1.8}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Phone fontSize="small" sx={{ color: "#0D9488" }} />
                <Typography variant="body2">+91 1800-MEDIQUEUE (24/7)</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Email fontSize="small" sx={{ color: "#0D9488" }} />
                <Typography variant="body2">support@mediqueue.com</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <LocationOn fontSize="small" sx={{ color: "#0D9488" }} />
                <Typography variant="body2">Healthcare IT Hub, Hitech City, Hyderabad</Typography>
              </Box>
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", mb: 3 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Typography variant="caption">
            © {new Date().getFullYear()} MediQueue Platforms Ltd. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            Built with <Favorite fontSize="inherit" color="error" /> for Modern Healthcare Efficiency
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
