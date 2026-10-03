import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { PersonAdd, Delete, Edit, Refresh, Person } from "@mui/icons-material";
import { toast } from "react-toastify";
import PasswordStrengthIndicator, { isPasswordStrong } from "../../components/Common/PasswordStrengthIndicator";

import Navbar from "../../components/Navbar/Navbar";
import { getStaff, createStaff, updateStaff, deleteStaff } from "../../api/staffApi";
import { getDepartmentsByHospital } from "../../api/hospitalDepartmentApi";
import { getHospitalId } from "../../utils/session";

function StaffManagement() {
  const [staffList, setStaffList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [loading, setLoading] = useState(false);

  const [staff, setStaff] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    hospitalDepartmentId: ""
  });

  useEffect(() => {
    loadStaff();
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    const hospitalId = getHospitalId();
    if (hospitalId) {
      try {
        const response = await getDepartmentsByHospital(hospitalId);
        setDepartments(response.data || []);
      } catch (error) {
        console.error("Failed to load departments", error);
      }
    }
  };

  const loadStaff = async () => {
    setLoading(true);
    try {
      const response = await getStaff();
      setStaffList(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load hospital staff.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingStaff(null);
    setStaff({ fullName: "", email: "", phone: "", password: "", hospitalDepartmentId: "" });
    setOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingStaff(item);
    setStaff({
      fullName: item.fullName || "",
      email: item.email || "",
      phone: item.phone || "",
      password: "",
      hospitalDepartmentId: item.hospitalDepartmentId || ""
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingStaff(null);
    setStaff({ fullName: "", email: "", phone: "", password: "", hospitalDepartmentId: "" });
  };

  const handleChange = (e) => {
    setStaff({
      ...staff,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    if (!staff.fullName || !staff.email) {
      toast.warning("Please fill required fields (Full Name and Email Address).");
      return;
    }

    if (!editingStaff && !staff.password) {
      toast.warning("Password is required for onboarding new staff.");
      return;
    }

    if (staff.password && !isPasswordStrong(staff.password)) {
      toast.warning("Password must be at least 8 characters long and meet all 5 security requirements.");
      return;
    }

    try {
      if (editingStaff) {
        await updateStaff(editingStaff.userId || editingStaff.id, staff);
        toast.success("Staff profile updated successfully!");
      } else {
        await createStaff(staff);
        toast.success("Staff account created successfully!");
      }
      handleClose();
      loadStaff();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save staff account.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this staff member?")) return;

    try {
      await deleteStaff(id);
      toast.success("Staff account removed successfully.");
      loadStaff();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete staff member.");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary" }}>
              Hospital Staff Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Onboard doctors, desk staff, update user profiles, and manage consultation credentials
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={handleOpenCreate}
              sx={{ fontWeight: 700 }}
            >
              Add New Staff
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={loadStaff}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        <Paper elevation={2} sx={{ borderRadius: 4, overflow: "hidden" }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: "#F1F5F9" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Staff Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Email Address</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Hospital</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {staffList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6, color: "text.secondary" }}>
                      No staff members onboarded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  staffList.map((item) => (
                    <TableRow key={item.userId || item.id} sx={{ "&:hover": { bgcolor: "#F8FAFC" } }}>
                      <TableCell sx={{ fontWeight: 700 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Person color="action" fontSize="small" />
                          {item.fullName}
                        </Box>
                      </TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.phone || "N/A"}</TableCell>
                      <TableCell>{item.hospitalName || "Assigned Hospital"}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.departmentName || "General OPD"}
                          variant="outlined"
                          color="primary"
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.active !== false ? "Active" : "Inactive"}
                          color={item.active !== false ? "success" : "default"}
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit Staff Profile">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenEdit(item)}
                            sx={{ mr: 1 }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Staff">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(item.userId || item.id)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Add / Edit Staff Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 800 }}>
            {editingStaff ? "Edit Staff Profile" : "Onboard New Staff Member"}
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              fullWidth
              margin="normal"
              label="Full Name"
              name="fullName"
              value={staff.fullName}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email Address"
              type="email"
              name="email"
              value={staff.email}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Phone Number"
              name="phone"
              value={staff.phone}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="hospital-department-label">Assign Department</InputLabel>
              <Select
                labelId="hospital-department-label"
                id="hospitalDepartmentId"
                name="hospitalDepartmentId"
                value={staff.hospitalDepartmentId}
                label="Assign Department"
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>General OPD / Unassigned</em>
                </MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept.hospitalDepartmentId} value={dept.hospitalDepartmentId}>
                    {dept.departmentName || `Department #${dept.hospitalDepartmentId}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              type="password"
              label={editingStaff ? "New Password (leave blank to keep current)" : "Account Password"}
              name="password"
              value={staff.password}
              onChange={handleChange}
              required={!editingStaff}
            />
            {staff.password && (
              <PasswordStrengthIndicator password={staff.password} />
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>
              {editingStaff ? "Update Staff Profile" : "Save & Create Staff"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default StaffManagement;