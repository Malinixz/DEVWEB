import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

/*
    Componente exibe lista de membros do grupo.
*/

function MemberList({ members }) {
    return (
        <TableContainer component={Paper} sx={{ maxWidth: '100%', margin: '16px auto' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Login</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Entry Date</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {members.map((member) => (
                        <TableRow key={member.id}>
                            <TableCell>{member.login}</TableCell>
                            <TableCell>{member.email}</TableCell>
                            <TableCell>{new Date(member.data_entrada).toLocaleDateString()}</TableCell>
                            <TableCell>{member.is_admin ? 'Administrador' : 'Regular'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default MemberList;

/*
function MemberList({ members }) {
    return (
        <TableContainer component={Paper} sx={{ maxWidth: '100%', margin: '16px auto' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Login</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Entry Date</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {members.map((member) => (
                        <TableRow key={member.id}>
                            <TableCell>{member.login}</TableCell>
                            <TableCell>{member.email}</TableCell>
                            <TableCell>{new Date(member.data_entrada).toLocaleDateString()}</TableCell>
                            <TableCell>{member.is_admin ? 'Administrador' : 'Regular'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default MemberList;
*/