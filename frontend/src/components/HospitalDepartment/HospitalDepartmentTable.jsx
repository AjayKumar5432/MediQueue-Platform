import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function HospitalDepartmentTable({
    mappings,
    onEdit,
    onDelete
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
                            <b>Department</b>
                        </TableCell>

                        <TableCell>
                            <b>Fee</b>
                        </TableCell>

                        <TableCell>
                            <b>Daily Tokens</b>
                        </TableCell>

                        <TableCell>
                            <b>Avg. Time</b>
                        </TableCell>

                        <TableCell>
                            <b>Available</b>
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

                    {mappings.length === 0 ? (

                        <TableRow>

                            <TableCell
                                colSpan={8}
                                align="center"
                            >
                                No hospital departments found.
                            </TableCell>

                        </TableRow>

                    ) : (

                        mappings.map((mapping) => (

                            <TableRow
                                key={mapping.hospitalDepartmentId}
                                hover
                            >

                                <TableCell>
                                    {mapping.hospitalName}
                                </TableCell>

                                <TableCell>
                                    {mapping.departmentName}
                                </TableCell>

                                <TableCell>
                                    ₹{mapping.consultationFee}
                                </TableCell>

                                <TableCell>
                                    {mapping.dailyTokenLimit}
                                </TableCell>

                                <TableCell>
                                    {mapping.averageConsultationTime} min
                                </TableCell>

                                <TableCell>

                                    <Chip
                                        label={
                                            mapping.availableToday
                                                ? "Available"
                                                : "Unavailable"
                                        }
                                        color={
                                            mapping.availableToday
                                                ? "success"
                                                : "default"
                                        }
                                        size="small"
                                    />

                                </TableCell>

                                <TableCell>

                                    <Chip
                                        label={
                                            mapping.active
                                                ? "Active"
                                                : "Inactive"
                                        }
                                        color={
                                            mapping.active
                                                ? "success"
                                                : "error"
                                        }
                                        size="small"
                                    />

                                </TableCell>

                                <TableCell align="center">

                                    <IconButton
                                        color="primary"
                                        onClick={() =>
                                            onEdit(mapping)
                                        }
                                    >
                                        <EditIcon />
                                    </IconButton>

                                    <IconButton
                                        color="error"
                                        onClick={() =>
                                            onDelete(mapping)
                                        }
                                    >
                                        <DeleteIcon />
                                    </IconButton>

                                </TableCell>

                            </TableRow>

                        ))

                    )}

                </TableBody>

            </Table>

        </TableContainer>

    );

}

export default HospitalDepartmentTable;