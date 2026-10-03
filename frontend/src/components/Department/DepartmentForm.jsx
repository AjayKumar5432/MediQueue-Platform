import { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid
} from "@mui/material";

function DepartmentForm({
    open,
    department,
    handleClose,
    handleSave
}) {

    const [formData, setFormData] = useState({
        departmentName: "",
        departmentCode: "",
        description: ""
    });

    useEffect(() => {

        if (department) {

            setFormData({
                departmentName: department.departmentName || "",
                departmentCode: department.departmentCode || "",
                description: department.description || ""
            });

        } else {

            setFormData({
                departmentName: "",
                departmentCode: "",
                description: ""
            });

        }

    }, [department, open]);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const onSubmit = () => {

        handleSave(formData);

    };

    return (

        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
        >

            <DialogTitle>

                {department ? "Edit Department" : "Add Department"}

            </DialogTitle>

            <DialogContent>

                <Grid
                    container
                    spacing={2}
                    sx={{ mt: 1 }}
                >

                    <Grid size={{ xs: 12 }}>

                        <TextField
                            fullWidth
                            label="Department Name"
                            name="departmentName"
                            value={formData.departmentName}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <TextField
                            fullWidth
                            label="Department Code"
                            name="departmentCode"
                            value={formData.departmentCode}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />

                    </Grid>

                </Grid>

            </DialogContent>

            <DialogActions>

                <Button onClick={handleClose}>
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={onSubmit}
                >
                    {department ? "Update" : "Save"}
                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default DepartmentForm;