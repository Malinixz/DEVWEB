// CreateTaskForm.js

import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { createTask } from '../../services/taskServices';

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

function CreateTaskForm({ groupId, activityId, token, onTaskCreated }) {
    const [open, setOpen] = useState(true);
    const [taskName, setTaskName] = useState('');
    const [taskDesc, setTaskDesc] = useState('');
    const [taskDate, setTaskDate] = useState('');
    const [responsibleId, setResponsibleId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreateTask = async () => {
        setLoading(true);
        try {
            await createTask({ groupId, activityId, token, taskName, taskDesc, taskDate, responsibleId });
            onTaskCreated();
        } catch (error) {
            console.error('Error creating task:', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <Box sx={modalStyle}>
                <Typography variant="h6">Criar Nova Tarefa</Typography>
                <TextField
                    label="Nome"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Descrição"
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                />
                <TextField
                    label="Data de Entrega"
                    type="date"
                    value={taskDate}
                    onChange={(e) => setTaskDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Responsável"
                    value={responsibleId}
                    onChange={(e) => setResponsibleId(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateTask}
                    disabled={loading}
                    sx={{ mt: 2 }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Criar Tarefa'}
                </Button>
            </Box>
        </Modal>
    );
}

export default CreateTaskForm;