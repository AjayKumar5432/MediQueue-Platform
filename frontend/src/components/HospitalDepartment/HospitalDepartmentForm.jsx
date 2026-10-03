import { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid
} from "@mui/material";

function HospitalDepartmentForm({
    open,
    mapping,
    hospitals,
    departments,
    handleClose,
    handleSave
}) {

    const [formData, setFormData] = useState({
        hospitalId: "",
        departmentId: "",
        consultationFee: "",
        dailyTokenLimit: "",
        averageConsultationTime: ""
    });

    useEffect(() => {

        if (mapping) {

            setFormData({
                hospitalId: mapping.hospitalId || "",
                departmentId: mapping.departmentId || "",
                consultationFee: mapping.consultationFee || "",
                dailyTokenLimit: mapping.dailyTokenLimit || "",
                averageConsultationTime:
                    mapping.averageConsultationTime || ""
            });

        } else {

            setFormData({
                hospitalId: "",
                departmentId: "",
                consultationFee: "",
                dailyTokenLimit: "",
                averageConsultationTime: ""
            });

        }

    }, [mapping, open]);

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };

    const handleSubmit = () => {

        const requestData = {
            hospitalId: Number(formData.hospitalId),
            departmentId: Number(formData.departmentId),
            consultationFee: Number(formData.consultationFee),
            dailyTokenLimit: Number(formData.dailyTokenLimit),
            averageConsultationTime:
                Number(formData.averageConsultationTime)
        };

        handleSave(requestData);

    };

    return (

        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
        >

            <DialogTitle>
                {mapping
                    ? "Edit Hospital Department"
                    : "Assign Department to Hospital"}
            </DialogTitle>

            <DialogContent>

                <Grid
                    container
                    spacing={2}
                    sx={{ mt: 1 }}
                >

                    {/* Hospital */}

                    <Grid size={{ xs: 12, md: 6 }}>

                        <FormControl fullWidth>

                            <InputLabel>
                                Hospital
                            </InputLabel>

                            <Select
                                name="hospitalId"
                                value={formData.hospitalId}
                                label="Hospital"
                                onChange={handleChange}
                            >

                                <MenuItem value="">
                                    Select Hospital
                                </MenuItem>

                                {hospitals.map((hospital) => (

                                    <MenuItem
                                        key={hospital.hospitalId}
                                        value={hospital.hospitalId}
                                    >
                                        {hospital.hospitalName}
                                    </MenuItem>

                                ))}

                            </Select>

                        </FormControl>

                    </Grid>

                    {/* Department */}

                    <Grid size={{ xs: 12, md: 6 }}>

                        <FormControl fullWidth>

                            <InputLabel>
                                Department
                            </InputLabel>

                            <Select
                                name="departmentId"
                                value={formData.departmentId}
                                label="Department"
                                onChange={handleChange}
                            >

                                <MenuItem value="">
                                    Select Department
                                </MenuItem>

                                {departments.map((department) => (

                                    <MenuItem
                                        key={department.departmentId}
                                        value={department.departmentId}
                                    >
                                        {department.departmentName}
                                    </MenuItem>

                                ))}

                            </Select>

                        </FormControl>

                    </Grid>

                    {/* Consultation Fee */}

                    <Grid size={{ xs: 12, md: 4 }}>

                        <TextField
                            fullWidth
                            label="Consultation Fee"
                            name="consultationFee"
                            type="number"
                            value={formData.consultationFee}
                            onChange={handleChange}
                        />

                    </Grid>

                    {/* Daily Token Limit */}

                    <Grid size={{ xs: 12, md: 4 }}>

                        <TextField
                            fullWidth
                            label="Daily Token Limit"
                            name="dailyTokenLimit"
                            type="number"
                            value={formData.dailyTokenLimit}
                            onChange={handleChange}
                        />

                    </Grid>

                    {/* Average Consultation Time */}

                    <Grid size={{ xs: 12, md: 4 }}>

                        <TextField
                            fullWidth
                            label="Average Consultation Time"
                            name="averageConsultationTime"
                            type="number"
                            helperText="Time in minutes"
                            value={formData.averageConsultationTime}
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
                    onClick={handleSubmit}
                >
                    {mapping ? "Update" : "Assign"}
                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default HospitalDepartmentForm;