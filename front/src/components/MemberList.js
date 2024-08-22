import React from 'react';
import RemoveOrUpdateDialog from './DeleteMember';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

/*
    Componente exibe lista de membros do grupo.
    Parâmetros
        id: ID do grupo.
        token: token de autorização.
        onMemberRemovedOrUpdated: callback function para fetch da lista de membros.
        members: lista de membros.
*/
function MemberList({ id, token, onMemberRemovedOrUpdated, members }) {
    return (
        <TableContainer component={Paper} sx={{ maxWidth: '100%', margin: '16px auto' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Login</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Data de entrada</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Config</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {members.map((member) =>
                    (
                        <TableRow key={member.id}>
                            <TableCell>{member.login}</TableCell>
                            <TableCell>{member.email}</TableCell>
                            <TableCell>{new Date(member.data_entrada).toLocaleDateString()}</TableCell>
                            <TableCell>{member.is_admin ? 'Administrador' : 'Regular'}</TableCell>
                            <TableCell> <RemoveOrUpdateDialog id={id} token={token} user_id={member.id} onMemberRemovedOrUpdated={onMemberRemovedOrUpdated} is_admin={member.is_admin}></RemoveOrUpdateDialog> </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default MemberList;