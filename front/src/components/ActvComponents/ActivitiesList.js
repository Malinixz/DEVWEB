import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ActivityDetailsModal from './ActivityDetails';

function ActivitiesList({ id, token, activities, loadActivities })
{
    return (
        <TableContainer component={Paper} sx={{ maxWidth: '100%', margin: '16px auto' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nome</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Data de Entrega</TableCell>
                        <TableCell>Data de Conclusão</TableCell>
                        <TableCell>Detalhes</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {activities.length > 0 ? (
                        activities.map((activity) =>
                        (
                            <TableRow key={activity.id}>
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
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                Nenhuma atividade disponível
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ActivitiesList;