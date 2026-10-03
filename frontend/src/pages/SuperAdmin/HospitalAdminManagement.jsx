import { useEffect, useState } from "react";
import { Box, Container, Typography, Button, TextField, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";

import Navbar from "../../components/Navbar/Navbar";
import HospitalAdminTable from "../../components/HospitalAdmin/HospitalAdminTable";
import HospitalAdminForm from "../../components/HospitalAdmin/HospitalAdminForm";
import {
  getHospitalAdmins,
  createHospitalAdmin,
  updateHospitalAdmin,
  deleteHospitalAdmin,
  approveHospitalAdmin,
  rejectHospitalAdmin
} from "../../api/hospitalAdminApi";
import { getHospitals } from "../../api/hospitalApi";

function HospitalAdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [adminRes, hospitalRes] = await Promise.all([
        getHospitalAdmins(),
        getHospitals()
      ]);
      setAdmins(adminRes.data || []);
      setHospitals(hospitalRes.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load hospital admin data.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setSelectedAdmin(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAdmin(null);
  };

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setOpen(true);
  };

  const handleApprove = async (admin) => {
    const isInactive = admin.status === "INACTIVE" || admin.active === false;
    const actionLabel = isInactive ? "Activate" : "Approve";
    if (!window.confirm(`${actionLabel} administrator for ${admin.hospitalName} (${admin.fullName})?`)) return;

    try {
      await approveHospitalAdmin(admin.userId || admin.id);
      toast.success(`${actionLabel}d administrator for ${admin.hospitalName}! Notification email sent to ${admin.email}.`);
      loadData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || `Unable to ${actionLabel.toLowerCase()} hospital admin.`);
    }
  };

  const handleReject = async (admin) => {
    const isActive = admin.status === "ACTIVE" && admin.active !== false;
    const actionLabel = isActive ? "Deactivate" : "Reject";
    if (!window.confirm(`${actionLabel} administrator for ${admin.hospitalName} (${admin.fullName})?`)) return;

    try {
      await rejectHospitalAdmin(admin.userId || admin.id);
      toast.info(`${actionLabel}d administrator for ${admin.hospitalName}. Notification email sent.`);
      loadData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || `Unable to ${actionLabel.toLowerCase()} hospital admin.`);
    }
  };

  const handleDelete = async (admin) => {
    if (!window.confirm(`Are you sure you want to delete ${admin.fullName}?`)) return;

    try {
      await deleteHospitalAdmin(admin.userId || admin.id);
      toast.success("Hospital Admin deleted successfully.");
      loadData();
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete hospital admin.");
    }
  };

  const handleSave = async (data) => {
    try {
      if (selectedAdmin) {
        await updateHospitalAdmin(selectedAdmin.userId || selectedAdmin.id, data);
        toast.success("Hospital Admin updated successfully.");
      } else {
        await createHospitalAdmin(data);
        toast.success("Hospital Admin created successfully.");
      }
      handleClose();
      loadData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Unable to save hospital admin.");
    }
  };

  const filteredAdmins = admins.filter((admin) => {
    const searchText = search.toLowerCase();
    return (
      (admin.fullName || "").toLowerCase().includes(searchText) ||
      (admin.email || "").toLowerCase().includes(searchText) ||
      (admin.hospitalName || "").toLowerCase().includes(searchText) ||
      (admin.phone || "").toLowerCase().includes(searchText)
    );
  });

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Hospital Admin Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review pending hospital onboarding requests, approve administrators, and manage partner facilities
            </Typography>
          </Box>

          <Button variant="contained" color="info" startIcon={<AddIcon />} onClick={handleOpen}>
            Add Hospital Admin
          </Button>
        </Box>

        <Paper elevation={1} sx={{ p: 2, borderRadius: 3, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by name, email, phone or hospital..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </Paper>

        <HospitalAdminTable
          admins={filteredAdmins}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onApprove={handleApprove}
          onReject={handleReject}
          onActivate={handleApprove}
        />


        <HospitalAdminForm
          open={open}
          admin={selectedAdmin}
          hospitals={hospitals}
          handleClose={handleClose}
          handleSave={handleSave}
        />
      </Container>
    </Box>
  );
}

export default HospitalAdminManagement;