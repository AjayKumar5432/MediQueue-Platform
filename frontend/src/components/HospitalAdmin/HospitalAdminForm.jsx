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
import { toast } from "react-toastify";
import PasswordStrengthIndicator, { isPasswordStrong } from "../Common/PasswordStrengthIndicator";

function HospitalAdminForm({
    open,
    admin,
    hospitals,
    handleClose,
    handleSave
}) {

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        hospitalId: ""
    });

    useEffect(() => {

        if (admin) {

            setFormData({
                fullName: admin.fullName || "",
                email: admin.email || "",
                phone: admin.phone || "",
                password: "",
                hospitalId: admin.hospitalId || ""
            });

        } else {

            setFormData({
                fullName: "",
                email: "",
                phone: "",
                password: "",
                hospitalId: ""
            });

        }

    }, [admin, open]);

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };

    const handleSubmit = () => {

        if (!admin && !formData.password) {
            toast.warning("Password is required.");
            return;
        }

        if (formData.password && !isPasswordStrong(formData.password)) {
            toast.warning("Password must be at least 8 characters long and meet all 5 security requirements.");
            return;
        }

        const data = {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            hospitalId: Number(formData.hospitalId)
        };

        handleSave(data);
    };

    return (

        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
        >

            <DialogTitle>
                {admin
                    ? "Edit Hospital Admin"
                    : "Create Hospital Admin"}
            </DialogTitle>

            <DialogContent>

                <Grid
                    container
                    spacing={2}
                    sx={{ mt: 1 }}
                >

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField
                            fullWidth
                            label="Full Name"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField
                            fullWidth
                            label={
                                admin
                                    ? "Password (optional)"
                                    : "Password"
                            }
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                        />

                    </Grid>

                    {formData.password && (
                        <Grid size={{ xs: 12 }}>
                            <PasswordStrengthIndicator password={formData.password} />
                        </Grid>
                    )}

                    <Grid size={{ xs: 12 }}>

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
                    {admin ? "Update" : "Create"}
                </Button>

            </DialogActions>

        </Dialog>
    );
}

export default HospitalAdminForm;