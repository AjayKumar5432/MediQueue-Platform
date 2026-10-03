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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Tooltip } from "@mui/material";

function HospitalAdminTable({
    admins,
    onEdit,
    onDelete,
    onApprove,
    onReject,
    onActivate
}) {

    const getStatusChip = (admin) => {
        const status = admin.status || (admin.active ? "ACTIVE" : "PENDING");
        if (status === "ACTIVE") {
            return <Chip label="ACTIVE" color="success" size="small" sx={{ fontWeight: 700 }} />;
        } else if (status === "PENDING") {
            return <Chip label="PENDING REVIEW" color="warning" size="small" sx={{ fontWeight: 700, bgcolor: "#FFF7ED", color: "#C2410C", border: "1px solid #FFEDD5" }} />;
        } else {
            return <Chip label="INACTIVE" color="error" size="small" sx={{ fontWeight: 700 }} />;
        }
    };

    return (
        <TableContainer
            component={Paper}
            sx={{ mt: 3, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
        >

            <Table>

                <TableHead sx={{ bgcolor: "#F8FAFC" }}>

                    <TableRow>

                        <TableCell>
                            <b>Name</b>
                        </TableCell>

                        <TableCell>
                            <b>Email</b>
                        </TableCell>

                        <TableCell>
                            <b>Phone</b>
                        </TableCell>

                        <TableCell>
                            <b>Hospital</b>
                        </TableCell>

                        <TableCell>
                            <b>Role</b>
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

                    {admins.length === 0 ? (

                        <TableRow>

                            <TableCell
                                colSpan={7}
                                align="center"
                            >
                                No hospital admins found.
                            </TableCell>

                        </TableRow>

                    ) : (

                        admins.map((admin) => {
                            const isPending = admin.status === "PENDING";
                            const isInactive = admin.status === "INACTIVE" || (admin.active === false && !isPending);
                            const isActive = !isInactive && !isPending;

                            return (

                                <TableRow
                                    key={admin.id}
                                    hover
                                    sx={isPending ? { bgcolor: "#FFFBF7" } : isInactive ? { bgcolor: "#FEF2F2" } : {}}
                                >

                                    <TableCell>
                                        <b>{admin.fullName}</b>
                                    </TableCell>

                                    <TableCell>
                                        {admin.email}
                                    </TableCell>

                                    <TableCell>
                                        {admin.phone}
                                    </TableCell>

                                    <TableCell>
                                        {admin.hospitalName}
                                    </TableCell>

                                    <TableCell>
                                        {admin.role}
                                    </TableCell>

                                    <TableCell>
                                        {getStatusChip(admin)}
                                    </TableCell>

                                    <TableCell align="center">

                                        {isInactive && (
                                            <Tooltip title="Activate Hospital Admin">
                                                <IconButton
                                                    color="success"
                                                    onClick={() => (onActivate ? onActivate(admin) : onApprove ? onApprove(admin) : null)}
                                                >
                                                    <CheckCircleIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}

                                        {isPending && onApprove && (
                                            <Tooltip title="Approve Registration Request">
                                                <IconButton
                                                    color="success"
                                                    onClick={() => onApprove(admin)}
                                                >
                                                    <CheckCircleIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}

                                        {isPending && onReject && (
                                            <Tooltip title="Reject Request">
                                                <IconButton
                                                    color="warning"
                                                    onClick={() => onReject(admin)}
                                                >
                                                    <CancelIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}

                                        {isActive && onReject && (
                                            <Tooltip title="Deactivate Admin">
                                                <IconButton
                                                    color="warning"
                                                    onClick={() => onReject(admin)}
                                                >
                                                    <CancelIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}

                                        <Tooltip title="Edit">
                                            <IconButton
                                                color="primary"
                                                onClick={() => onEdit(admin)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Delete">
                                            <IconButton
                                                color="error"
                                                onClick={() => onDelete(admin)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>

                                    </TableCell>

                                </TableRow>

                            );
                        })

                    )}

                </TableBody>

            </Table>

        </TableContainer>
    );
}


export default HospitalAdminTable;