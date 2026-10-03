import { useEffect, useState } from "react";
import { Box, Container, Typography, Button, TextField, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";

import Navbar from "../../components/Navbar/Navbar";
import DepartmentTable from "../../components/Department/DepartmentTable";
import DepartmentForm from "../../components/Department/DepartmentForm";
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from "../../api/departmentApi";

function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const response = await getDepartments();
      setDepartments(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load departments.");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDepartment(null);
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setOpen(true);
  };

  const handleDelete = async (department) => {
    if (!window.confirm(`Are you sure you want to delete ${department.departmentName}?`)) return;

    try {
      await deleteDepartment(department.departmentId);
      toast.success("Department deleted successfully.");
      loadDepartments();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete department.");
    }
  };

  const handleSave = async (department) => {
    try {
      if (selectedDepartment) {
        await updateDepartment(selectedDepartment.departmentId, department);
        toast.success("Department updated successfully!");
      } else {
        await createDepartment(department);
        toast.success("Department created successfully!");
      }
      handleClose();
      loadDepartments();
    } catch (error) {
      console.error(error);
      toast.error("Operation failed.");
    }
  };

  const filteredDepartments = departments.filter((dept) =>
    (dept.departmentName || "").toLowerCase().includes(search.toLowerCase()) ||
    (dept.departmentCode || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Master Department Catalog
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure system-wide medical specializations and departments
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedDepartment(null);
              setOpen(true);
            }}
          >
            Add New Department
          </Button>
        </Box>

        <Paper elevation={1} sx={{ p: 2, borderRadius: 3, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by department name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Paper>

        <DepartmentTable
          departments={filteredDepartments}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <DepartmentForm
          open={open}
          department={selectedDepartment}
          handleClose={handleClose}
          handleSave={handleSave}
        />
      </Container>
    </Box>
  );
}

export default DepartmentManagement;