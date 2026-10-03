import { useEffect, useState } from "react";
import { Box, Container, Typography, Button, TextField, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";

import Navbar from "../../components/Navbar/Navbar";
import HospitalTable from "../../components/Hospital/HospitalTable";
import HospitalForm from "../../components/Hospital/HospitalForm";
import { getHospitals, createHospital, updateHospital, deleteHospital, toggleHospitalStatus } from "../../api/hospitalApi";

function HospitalManagement() {
  const [hospitals, setHospitals] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);

  useEffect(() => {
    loadHospitals();
  }, []);

  const loadHospitals = async () => {
    try {
      const response = await getHospitals();
      setHospitals(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load hospitals.");
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedHospital(null);
  };

  const handleEdit = (hospital) => {
    setSelectedHospital(hospital);
    setOpen(true);
  };

  const handleToggleStatus = async (hospital) => {
    try {
      await toggleHospitalStatus(hospital.hospitalId);
      const actionText = hospital.active ? "Deactivated" : "Activated";
      toast.success(`🏥 ${hospital.hospitalName} ${actionText} Successfully!`);
      loadHospitals();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update hospital status.");
    }
  };

  const handleDelete = async (hospital) => {
    if (!window.confirm(`Are you sure you want to delete "${hospital.hospitalName}"?`)) return;

    try {
      await deleteHospital(hospital.hospitalId);
      toast.success("Hospital deleted successfully.");
      loadHospitals();
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete hospital.");
    }
  };


  const handleSave = async (hospital) => {
    try {
      if (selectedHospital) {
        await updateHospital(selectedHospital.hospitalId, hospital);
        toast.success("Hospital updated successfully!");
      } else {
        await createHospital(hospital);
        toast.success("Hospital created successfully!");
      }
      handleClose();
      loadHospitals();
    } catch (error) {
      console.error(error);
      toast.error("Operation failed.");
    }
  };

  const filteredHospitals = hospitals.filter((hospital) =>
    (hospital.hospitalName || "").toLowerCase().includes(search.toLowerCase()) ||
    (hospital.city || "").toLowerCase().includes(search.toLowerCase()) ||
    (hospital.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Hospital Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Onboard and manage partner medical institutions
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="error"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedHospital(null);
              handleOpen();
            }}
          >
            Add New Hospital
          </Button>
        </Box>

        <Paper elevation={1} sx={{ p: 2, borderRadius: 3, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by hospital name, city, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Paper>

        <HospitalTable
          hospitals={filteredHospitals}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />


        <HospitalForm
          open={open}
          hospital={selectedHospital}
          handleClose={handleClose}
          handleSave={handleSave}
        />
      </Container>
    </Box>
  );
}

export default HospitalManagement;