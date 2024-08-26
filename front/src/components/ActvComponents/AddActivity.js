import React, { useState } from 'react';
import { Box, Modal, TextField, Button, Typography } from '@mui/material';
import { addActivityToGroup } from '../../services/actvServices';

function AddActivityModal({ open, handleClose, loadActivities, groupId, token })
{
    const [activityName, setActivityName] = useState('');
    const [activityDesc, setActivityDesc] = useState('');
    const [activityDate, setActivityDate] = useState('');

    const handleAddActivity = async () =>
    {
        try
        {
            await addActivityToGroup({ groupId, token, activityName, activityDesc, activityDate });
            loadActivities();   // Recarrega lista de atividades pós adição de uma nova
            handleClose();      // Fecha o modal
        }
        catch (error)
        {
            window.alert(`Erro ao adicionar atividade: ${error.response ? error.response.data.erro : error.message}`);
        }
    };

    const modalStyle =
    {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ ...modalStyle }}>
                <Typography variant="h6">Adicionar Nova Atividade</Typography>
                <TextField
                    label="Nome da Atividade"
                    fullWidth
                    margin="normal"
                    value={activityName}
                    onChange={(e) => setActivityName(e.target.value)}
                />
                <TextField
                    label="Descrição"
                    fullWidth
                    margin="normal"
                    value={activityDesc}
                    onChange={(e) => setActivityDesc(e.target.value)}
                />
                <TextField
                    label="Data de Entrega"
                    type="date"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    value={activityDate}
                    onChange={(e) => setActivityDate(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleAddActivity}>
                    Adicionar
                </Button>
            </Box>
        </Modal>
    );
}

export default AddActivityModal;