import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button } from '@mui/material';
import RemoveOrUpdateDialog from './RemoveOrUpdateDialog';

function MemberList({ id, token, onMemberRemovedOrUpdated, members }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <TableContainer component={Paper} sx={{ maxWidth: '100%', margin: '16px auto' }}>
            <Table>
                <TableHead sx={{ bgcolor: 'primary.light' }}>
                    <TableRow>
                        <TableCell>Login</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Data de Entrada</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Config</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {members.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((member) => (
                        <TableRow key={member.id} sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}>
                            <TableCell>{member.login}</TableCell>
                            <TableCell>{member.email}</TableCell>
                            <TableCell>{new Date(member.data_entrada).toLocaleDateString()}</TableCell>
                            <TableCell>{member.is_admin ? 'Administrador' : 'Regular'}</TableCell>
                            <TableCell>
                                <RemoveOrUpdateDialog 
                                    id={id} 
                                    token={token} 
                                    user_id={member.id} 
                                    onMemberRemovedOrUpdated={onMemberRemovedOrUpdated} 
                                    is_admin={member.is_admin} 
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                    {members.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                Nenhum membro disponível
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={members.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </TableContainer>
    );
}

export default MemberList;