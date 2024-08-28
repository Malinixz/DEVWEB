import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import ActivityDetailsModal from './ActivityDetails';

function ActivitiesList({ id, token, activities, loadActivities }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (_event, newPage) => {
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
                        <TableCell>Nome</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Data de Entrega</TableCell>
                        <TableCell>Data de Conclusão</TableCell>
                        <TableCell>Detalhes</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {activities.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((activity) => (
                        <TableRow key={activity.id} sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}>
                            <TableCell>{activity.nome}</TableCell>
                            <TableCell>{activity.estado}</TableCell>
                            <TableCell>{new Date(activity.data_entrega).toLocaleDateString()}</TableCell>
                            <TableCell>{activity.data_conclusao ? new Date(activity.data_conclusao).toLocaleDateString() : 'Não Concluída'}</TableCell>
                            <TableCell>
                                <ActivityDetailsModal 
                                    groupId={id} 
                                    activityId={activity.id} 
                                    token={token} 
                                    loadActivities={loadActivities} 
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                    {activities.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                Nenhuma atividade disponível
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={activities.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </TableContainer>
    );
}

export default ActivitiesList;