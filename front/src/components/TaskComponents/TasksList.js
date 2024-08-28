// ActivityTasksModal.js

import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { fetchTasks } from '../../services/taskServices';
import CreateTaskForm from './CreateTaskForm';
import UpdateTaskForm from './UpdateTaskForm';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

function ActivityTasksModal({ groupId, activityId, token }) {
    const [open, setOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [creatingTask, setCreatingTask] = useState(false);

    const loadTasks = async () => {
        setLoading(true);
        try {
            const fetchedTasks = await fetchTasks({ groupId, activityId, token });
            setTasks(fetchedTasks);
        } catch (error) {
            console.error('Error fetching tasks:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            loadTasks();
        }
    }, [open]);

    const handleOpenCreateTask = () => setCreatingTask(true);
    const handleCloseCreateTask = () => setCreatingTask(false);

    return (
        <>
            <Button variant="outlined" color="primary" onClick={() => setOpen(true)}>
                Ver Tarefas
            </Button>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6">Lista de Tarefas</Typography>
                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Nome</TableCell>
                                            <TableCell>Data de Entrega</TableCell>
                                            <TableCell>Ações</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {tasks.map((task) => (
                                            <TableRow key={task.id}>
                                                <TableCell>{task.nome}</TableCell>
                                                <TableCell>{task.data_entrega}</TableCell>
                                                <TableCell>
                                                    <UpdateTaskForm
                                                        groupId={groupId}
                                                        activityId={activityId}
                                                        taskId={task.id}
                                                        token={token}
                                                        onTaskUpdated={loadTasks}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Button variant="contained" color="primary" onClick={handleOpenCreateTask} sx={{ mt: 2 }}>
                                Adicionar Tarefa
                            </Button>
                        </>
                    )}
                </Box>
            </Modal>
            {creatingTask && (
                <CreateTaskForm
                    groupId={groupId}
                    activityId={activityId}
                    token={token}
                    onTaskCreated={() => {
                        loadTasks();
                        handleCloseCreateTask();
                    }}
                />
            )}
        </>
    );
}

export default ActivityTasksModal;