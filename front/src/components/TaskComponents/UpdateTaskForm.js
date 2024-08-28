// UpdateTaskForm.js

import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { taskDetails, updateTask, removeTask } from '../../services/taskServices';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

function UpdateTaskForm({ groupId, activityId, taskId, token, onTaskUpdated }) {
    const [open, setOpen] = useState(true);
    const [task, setTask] = useState({});
    const [loading, setLoading] = useState(false);

    const fetchTaskDetails = async () => {
        try {
            const data = await taskDetails({ groupId, activityId, taskId, token });
            setTask(data);
        } catch (error) {
            console.error('Error fetching task details:', error.message);
        }
    };

    useEffect(() => {
        fetchTaskDetails();
    }, []);

    const handleUpdateTask = async () => {
        setLoading(true);
        try {
            await updateTask({
                groupId,
                activityId,
                taskId,
                token,
                updates: {
                    nome: task.nome,
                    descricao: task.descricao,
                    data_entrega: task.data_entrega,
                    estado: task.estado,
                }
            });
            onTaskUpdated();
            setOpen(false);
        } catch (error) {
            console.error('Error updating task:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveTask = async () => {
        if (window.confirm('Tem certeza que deseja deletar esta tarefa?')) {
            setLoading(true);
            try {
                await removeTask({ groupId, activityId, taskId, token });
                onTaskUpdated();
                setOpen(false);
            } catch (error) {
                console.error('Error removing task:', error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <Box sx={modalStyle}>
                <Typography variant="h6">Atualizar Tarefa</Typography>
                <TextField
                    label="Nome"
                    value={task.nome || ''}
                    onChange={(e) => setTask({ ...task, nome: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Descrição"
                    value={task.descricao || ''}
                    onChange={(e) => setTask({ ...task, descricao: e.target.value })}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                />
                <TextField
                    label="Data de Entrega"
                    type="date"
                    value={task.data_entrega || ''}
                    onChange={(e) => setTask({ ...task, data_entrega: e.target.value })}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Estado"
                    value={task.estado || ''}
                    onChange={(e) => setTask({ ...task, estado: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateTask}
                    disabled={loading}
                    sx={{ mt: 2, mr: 1 }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Atualizar'}
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={handleRemoveTask}
                    disabled={loading}
                    sx={{ mt: 2 }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Deletar'}
                </Button>
            </Box>
        </Modal>
    );
}

export default UpdateTaskForm;