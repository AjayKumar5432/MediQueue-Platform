import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Tooltip
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

function HospitalTable({
    hospitals,
    onEdit,
    onDelete,
    onToggleStatus
}) {

    return (

        <TableContainer
            component={Paper}
            sx={{ mt: 3 }}
        >

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <b>Hospital</b>
                        </TableCell>

                        <TableCell>
                            <b>City</b>
                        </TableCell>

                        <TableCell>
                            <b>Phone</b>
                        </TableCell>

                        <TableCell>
                            <b>Email</b>
                        </TableCell>

                        <TableCell>
                            <b>Status</b>
                        </TableCell>

                        <TableCell align="center">
                            <b>Actions</b>
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {hospitals.map((hospital) => (

                        <TableRow
                            key={hospital.hospitalId}
                            hover
                        >

                            <TableCell>
                                {hospital.hospitalName}
                            </TableCell>

                            <TableCell>
                                {hospital.city}
                            </TableCell>

                            <TableCell>
                                {hospital.phoneNumber}
                            </TableCell>

                            <TableCell>
                                {hospital.email}
                            </TableCell>

                            <TableCell>

                                <Tooltip title="Click to Toggle Activate / Deactivate">
                                    <Chip
                                        label={hospital.active ? "Active" : "Inactive"}
                                        color={hospital.active ? "success" : "error"}
                                        size="small"
                                        onClick={() => onToggleStatus && onToggleStatus(hospital)}
                                        sx={{ cursor: "pointer", fontWeight: 800 }}
                                    />
                                </Tooltip>

                            </TableCell>

                            <TableCell align="center">

                                <Tooltip title={hospital.active ? "Deactivate Hospital" : "Activate Hospital"}>
                                    <IconButton
                                        color={hospital.active ? "success" : "default"}
                                        onClick={() => onToggleStatus && onToggleStatus(hospital)}
                                    >
                                        <PowerSettingsNewIcon />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Edit Hospital">
                                    <IconButton
                                        color="primary"
                                        onClick={() => onEdit(hospital)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Delete Hospital">
                                    <IconButton
                                        color="error"
                                        onClick={() => onDelete(hospital)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>

                            </TableCell>

                        </TableRow>

                    ))}

                </TableBody>

            </Table>

        </TableContainer>

    );

}

export default HospitalTable;