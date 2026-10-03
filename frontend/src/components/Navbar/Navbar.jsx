import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Container,
  Stack,
  Divider,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { isLoggedIn, getRole, getFullName, logout } from "../../utils/session";
import {
  LocalHospital,
  ExitToApp,
  Dashboard,
  ConfirmationNumber,
  Menu as MenuIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  ContactSupport as ContactIcon,
  ListAlt as ListAltIcon,
  Queue as QueueIcon,
  Person as PersonIcon,
  AppRegistration as RegisterIcon,
  Login as LoginIcon
} from "@mui/icons-material";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = isLoggedIn();
  const role = getRole();
  const fullName = getFullName();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/login");
  };

  const getDashboardPath = () => {
    switch (role) {
      case "SUPER_ADMIN":
        return "/super-admin/dashboard";
      case "HOSPITAL_ADMIN":
        return "/hospital-admin/dashboard";
      case "STAFF":
        return "/staff/dashboard";
      case "CUSTOMER":
        return "/customer/dashboard";
      default:
        return "/";
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case "SUPER_ADMIN":
        return "error";
      case "HOSPITAL_ADMIN":
        return "secondary";
      case "STAFF":
        return "info";
      case "CUSTOMER":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 2px 15px rgba(0, 0, 0, 0.05)",
        borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
        color: "text.primary"
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 70 }}>
          {/* Logo */}
          <Box
            component={Link}
            to={loggedIn ? getDashboardPath() : "/"}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              textDecoration: "none",
              color: "primary.main",
              mr: 4
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "12px",
                bgcolor: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #E2E8F0",
                boxShadow: "0 4px 12px rgba(13, 148, 136, 0.12)"
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="36" height="36">
                <defs>
                  <linearGradient id="navTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0D9488" />
                    <stop offset="100%" stopColor="#0F766E" />
                  </linearGradient>
                  <linearGradient id="navAmberGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#FF7043" />
                  </linearGradient>
                </defs>
                <circle cx="30" cy="30" r="21" fill="none" stroke="url(#navTealGrad)" strokeWidth="4.5" />
                <path d="M41 41 L51 51" stroke="url(#navTealGrad)" strokeWidth="5.5" strokeLinecap="round" />
                <rect x="27" y="16" width="6" height="28" rx="2" fill="url(#navTealGrad)" />
                <rect x="16" y="27" width="28" height="6" rx="2" fill="url(#navTealGrad)" />
                <path d="M 6 30 L 17 30 L 21 21 L 26 39 L 31 15 L 36 35 L 40 30 L 55 30"
                      fill="none"
                      stroke="url(#navAmberGrad)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round" />
                <circle cx="55" cy="30" r="2.8" fill="#FF7043" />
              </svg>
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  fontSize: "1.3rem",
                  background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 1.2
                }}
              >
                MediQueue
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem", fontWeight: 700 }}>
                Smart Healthcare Queue
              </Typography>
            </Box>
          </Box>


          {/* Desktop Navigation Links */}
          <Stack direction="row" spacing={1} sx={{ display: { xs: "none", md: "flex" } }}>
            {loggedIn && (
              <Button
                component={Link}
                to={getDashboardPath()}
                startIcon={<Dashboard />}
                color={location.pathname === getDashboardPath() ? "primary" : "inherit"}
                sx={{ fontWeight: location.pathname === getDashboardPath() ? 800 : 600 }}
              >
                Dashboard
              </Button>
            )}
            <Button
              component={Link}
              to="/"
              color={location.pathname === "/" ? "primary" : "inherit"}
              sx={{ fontWeight: location.pathname === "/" ? 800 : 500 }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/about"
              color={location.pathname === "/about" ? "primary" : "inherit"}
              sx={{ fontWeight: location.pathname === "/about" ? 800 : 500 }}
            >
              About Us
            </Button>
            <Button
              component={Link}
              to="/contact"
              color={location.pathname === "/contact" ? "primary" : "inherit"}
              sx={{ fontWeight: location.pathname === "/contact" ? 800 : 500 }}
            >
              Contact Support
            </Button>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          {/* User Section & 3-Line Hamburger Menu */}
          {loggedIn ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {/* User Name greeting: Hi, Name */}
              <Box
                onClick={handleMenuOpen}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  py: 0.5,
                  px: 1.5,
                  borderRadius: "20px",
                  bgcolor: "#F1F5F9",
                  border: "1px solid #E2E8F0",
                  transition: "all 0.2s",
                  "&:hover": { bgcolor: "#E2E8F0" }
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700, color: "#1E293B" }}>
                  Hi, <Box component="span" sx={{ color: "#0D9488" }}>{fullName || "User"}</Box>
                </Typography>

                {/* 3-Line Hamburger Menu Icon */}
                <IconButton
                  size="small"
                  onClick={handleMenuOpen}
                  sx={{
                    color: "#1E293B",
                    p: 0.5
                  }}
                >
                  <MenuIcon fontSize="medium" />
                </IconButton>
              </Box>

              {/* Dropdown Menu when clicking 3-line icon or name */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                PaperProps={{
                  elevation: 6,
                  sx: {
                    borderRadius: 3,
                    minWidth: 240,
                    mt: 1.5,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                    overflow: "hidden"
                  }
                }}
              >
                {/* Menu Header */}
                <Box sx={{ px: 2.5, py: 2, bgcolor: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: "#0D9488",
                        width: 36,
                        height: 36,
                        fontWeight: 700,
                        fontSize: "0.95rem"
                      }}
                    >
                      {fullName ? fullName.charAt(0).toUpperCase() : "U"}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}>
                        {fullName || "User Account"}
                      </Typography>
                      <Chip
                        label={role?.replace("_", " ")}
                        color={getRoleColor()}
                        size="small"
                        sx={{ fontWeight: 700, fontSize: "0.68rem", height: 20, mt: 0.5 }}
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Role Specific Actions */}
                {role === "CUSTOMER" && (
                  <>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        navigate("/customer/book-token");
                      }}
                      sx={{ py: 1.2 }}
                    >
                      <ListItemIcon><ConfirmationNumber fontSize="small" color="primary" /></ListItemIcon>
                      <ListItemText primary="Book Token / Appointment" primaryTypographyProps={{ fontWeight: 600 }} />
                    </MenuItem>

                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        navigate("/customer/my-tokens");
                      }}
                      sx={{ py: 1.2 }}
                    >
                      <ListItemIcon><ListAltIcon fontSize="small" color="primary" /></ListItemIcon>
                      <ListItemText primary="My Tokens & Appointments" primaryTypographyProps={{ fontWeight: 600 }} />
                    </MenuItem>
                    <Divider sx={{ my: 0.5 }} />
                  </>
                )}

                {(role === "STAFF" || role === "HOSPITAL_ADMIN" || role === "SUPER_ADMIN") && (
                  <>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        navigate("/staff/queue?action=walkin");
                      }}
                      sx={{ py: 1.2 }}
                    >
                      <ListItemIcon><QueueIcon fontSize="small" color="primary" /></ListItemIcon>
                      <ListItemText primary="Live Queue Console & Walk-In" primaryTypographyProps={{ fontWeight: 600 }} />
                    </MenuItem>
                    <Divider sx={{ my: 0.5 }} />

                  </>
                )}



                {/* Common Navigation Items */}
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate("/profile");
                  }}
                  sx={{ py: 1.2 }}
                >
                  <ListItemIcon><PersonIcon fontSize="small" color="primary" /></ListItemIcon>
                  <ListItemText primary="My Profile & Settings" primaryTypographyProps={{ fontWeight: 700 }} />

                </MenuItem>

                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate(getDashboardPath());
                  }}
                  sx={{ py: 1.2 }}
                >
                  <ListItemIcon><Dashboard fontSize="small" color="action" /></ListItemIcon>
                  <ListItemText primary="My Dashboard" primaryTypographyProps={{ fontWeight: 600 }} />
                </MenuItem>


                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate("/");
                  }}
                  sx={{ py: 1.2 }}
                >
                  <ListItemIcon><HomeIcon fontSize="small" color="action" /></ListItemIcon>
                  <ListItemText primary="Home" primaryTypographyProps={{ fontWeight: 500 }} />
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate("/about");
                  }}
                  sx={{ py: 1.2 }}
                >
                  <ListItemIcon><InfoIcon fontSize="small" color="action" /></ListItemIcon>
                  <ListItemText primary="About Us" primaryTypographyProps={{ fontWeight: 500 }} />
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate("/contact");
                  }}
                  sx={{ py: 1.2 }}
                >
                  <ListItemIcon><ContactIcon fontSize="small" color="action" /></ListItemIcon>
                  <ListItemText primary="Contact Support" primaryTypographyProps={{ fontWeight: 500 }} />
                </MenuItem>

                <Divider sx={{ my: 0.5 }} />

                <MenuItem onClick={handleLogout} sx={{ py: 1.2, color: "error.main" }}>
                  <ListItemIcon><ExitToApp fontSize="small" color="error" /></ListItemIcon>
                  <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 700 }} />
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1.5 }}>
                <Button
                  component={Link}
                  to="/login"
                  color="primary"
                  variant="text"
                  sx={{ fontWeight: 700 }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  color="primary"
                  sx={{ fontWeight: 700 }}
                >
                  Register Patient
                </Button>
              </Box>

              {/* 3-Line Hamburger Icon for Guest/Mobile */}
              <IconButton onClick={handleMenuOpen} sx={{ color: "#1E293B" }}>
                <MenuIcon fontSize="medium" />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                PaperProps={{
                  elevation: 6,
                  sx: { borderRadius: 3, minWidth: 220, mt: 1.5 }
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate("/login");
                  }}
                  sx={{ py: 1.2 }}
                >
                  <ListItemIcon><LoginIcon fontSize="small" color="primary" /></ListItemIcon>
                  <ListItemText primary="Login" primaryTypographyProps={{ fontWeight: 700 }} />
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate("/register");
                  }}
                  sx={{ py: 1.2 }}
                >
                  <ListItemIcon><PersonIcon fontSize="small" color="primary" /></ListItemIcon>
                  <ListItemText primary="Register Patient" primaryTypographyProps={{ fontWeight: 700 }} />
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate("/register-hospital");
                  }}
                  sx={{ py: 1.2 }}
                >
                  <ListItemIcon><RegisterIcon fontSize="small" color="secondary" /></ListItemIcon>
                  <ListItemText primary="Register Hospital/Hospital Admin" primaryTypographyProps={{ fontWeight: 700 }} />
                </MenuItem>

                <Divider sx={{ my: 0.5 }} />

                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate("/");
                  }}
                  sx={{ py: 1.2 }}
                >
                  <ListItemIcon><HomeIcon fontSize="small" color="action" /></ListItemIcon>
                  <ListItemText primary="Home" primaryTypographyProps={{ fontWeight: 500 }} />
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate("/about");
                  }}
                  sx={{ py: 1.2 }}
                >
                  <ListItemIcon><InfoIcon fontSize="small" color="action" /></ListItemIcon>
                  <ListItemText primary="About Us" primaryTypographyProps={{ fontWeight: 500 }} />
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate("/contact");
                  }}
                  sx={{ py: 1.2 }}
                >
                  <ListItemIcon><ContactIcon fontSize="small" color="action" /></ListItemIcon>
                  <ListItemText primary="Contact Support" primaryTypographyProps={{ fontWeight: 500 }} />
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;