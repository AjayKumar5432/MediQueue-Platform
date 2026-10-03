import { useEffect, useState } from "react";
import { Box, Container, Typography, Button, TextField, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";

import Navbar from "../../components/Navbar/Navbar";
import HospitalDepartmentTable from "../../components/HospitalDepartment/HospitalDepartmentTable";
import HospitalDepartmentForm from "../../components/HospitalDepartment/HospitalDepartmentForm";
import {
  getHospitalDepartments,
  createHospitalDepartment,
  updateHospitalDepartment,
  deleteHospitalDepartment
} from "../../api/hospitalDepartmentApi";
import { getHospitals } from "../../api/hospitalApi";
import { getDepartments } from "../../api/departmentApi";

function HospitalDepartmentManagement() {
  const [mappings, setMappings] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [mappingRes, hospitalRes, deptRes] = await Promise.all([
        getHospitalDepartments(),
        getHospitals(),
        getDepartments()
      ]);
      setMappings(mappingRes.data || []);
      setHospitals(hospitalRes.data || []);
      setDepartments(deptRes.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load hospital department data.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setSelectedMapping(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMapping(null);
  };

  const handleEdit = (mapping) => {
    setSelectedMapping(mapping);
    setOpen(true);
  };

  const handleDelete = async (mapping) => {
    if (!window.confirm(`Remove ${mapping.departmentName} from ${mapping.hospitalName}?`)) return;

    try {
      await deleteHospitalDepartment(mapping.hospitalDepartmentId);
      toast.success("Department mapping removed.");
      loadData();
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete department mapping.");
    }
  };

  const handleSave = async (data) => {
    try {
      if (selectedMapping) {
        await updateHospitalDepartment(selectedMapping.hospitalDepartmentId, data);
        toast.success("Department mapping updated successfully.");
      } else {
        await createHospitalDepartment(data);
        toast.success("Department assigned to hospital successfully.");
      }
      handleClose();
      loadData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Unable to save department mapping.");
    }
  };

  const filteredMappings = mappings.filter((mapping) => {
    const searchText = search.toLowerCase();
    return (
      (mapping.hospitalName || "").toLowerCase().includes(searchText) ||
      (mapping.departmentName || "").toLowerCase().includes(searchText)
    );
  });

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Hospital Department Mapping
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure daily token limits, consultation fees, and active departments per hospital
            </Typography>
          </Box>

          <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={handleOpen}>
            Assign Department
          </Button>
        </Box>

        <Paper elevation={1} sx={{ p: 2, borderRadius: 3, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by hospital or department..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </Paper>

        <HospitalDepartmentTable
          mappings={filteredMappings}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <HospitalDepartmentForm
          open={open}
          mapping={selectedMapping}
          hospitals={hospitals}
          departments={departments}
          handleClose={handleClose}
          handleSave={handleSave}
        />
      </Container>
    </Box>
  );
}

export default HospitalDepartmentManagement;