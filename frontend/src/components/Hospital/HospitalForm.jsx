import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid
} from "@mui/material";

function HospitalForm({
    open,
    hospital,
    handleClose,
    handleSave
}) {

    const [formData, setFormData] = useState({
        hospitalName: "",
        address: "",
        city: "",
        state: "",
        phoneNumber: "",
        email: ""
    });

    useEffect(() => {

        if (hospital) {

            setFormData({
                hospitalName: hospital.hospitalName || "",
                address: hospital.address || "",
                city: hospital.city || "",
                state: hospital.state || "",
                phoneNumber: hospital.phoneNumber || "",
                email: hospital.email || ""
            });

        } else {

            setFormData({
                hospitalName: "",
                address: "",
                city: "",
                state: "",
                phoneNumber: "",
                email: ""
            });

        }

    }, [hospital, open]);

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
            maxWidth="md"
            fullWidth
        >

            <DialogTitle>

                {hospital ? "Edit Hospital" : "Add Hospital"}

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
                            label="Hospital Name"
                            name="hospitalName"
                            value={formData.hospitalName}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField
                            fullWidth
                            label="Phone Number"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <TextField
                            fullWidth
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField
                            fullWidth
                            label="City"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField
                            fullWidth
                            label="State"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                    </Grid>

                </Grid>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={handleClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={onSubmit}
                >
                    {hospital ? "Update" : "Save"}
                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default HospitalForm;