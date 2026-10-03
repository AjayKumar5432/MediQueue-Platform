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

function DepartmentTable({
    departments,
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
                            <b>Department</b>
                        </TableCell>

                        <TableCell>
                            <b>Code</b>
                        </TableCell>

                        <TableCell>
                            <b>Description</b>
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

                    {departments.map((department) => (

                        <TableRow
                            key={department.departmentId}
                            hover
                        >

                            <TableCell>
                                {department.departmentName}
                            </TableCell>

                            <TableCell>
                                {department.departmentCode}
                            </TableCell>

                            <TableCell>
                                {department.description}
                            </TableCell>

                            <TableCell>

                                <Chip
                                    label={department.active ? "Active" : "Inactive"}
                                    color={department.active ? "success" : "error"}
                                    size="small"
                                />

                            </TableCell>

                            <TableCell align="center">

                                <IconButton
                                    color="primary"
                                    onClick={() => onEdit(department)}
                                >
                                    <EditIcon />
                                </IconButton>

                                <IconButton
                                    color="error"
                                    onClick={() => onDelete(department)}
                                >
                                    <DeleteIcon />
                                </IconButton>

                            </TableCell>

                        </TableRow>

                    ))}

                </TableBody>

            </Table>

        </TableContainer>

    );

}

export default DepartmentTable;