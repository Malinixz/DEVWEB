import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ActivityDetailsModal from './ActivityDetails';

function ActivitiesList({ id, token, activities, loadActivities }) {
    return (
        <TableContainer component={Paper} sx={{ maxWidth: '100%', margin: '16px auto' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>id_criador</TableCell>
                        <TableCell>Nome</TableCell>
                        <TableCell>Data de Entrega</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Detalhes</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {activities.map((activity) => (
                        <TableRow key={activity.id}>
                            <TableCell>{activity.id_criador}</TableCell>
                            <TableCell>{activity.nome}</TableCell>
                            <TableCell>{new Date(activity.data_entrega).toLocaleDateString()}</TableCell>
                            <TableCell>{activity.estado}</TableCell>
                            <TableCell>
                                <ActivityDetailsModal groupId={id} activityId={activity.id} token={token} loadActivities={loadActivities}/>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ActivitiesList;