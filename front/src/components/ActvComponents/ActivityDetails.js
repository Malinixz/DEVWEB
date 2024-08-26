import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem } from '@mui/material';
import { activityDetails, updateActivity, removeActivity } from '../../services/actvServices';

const statusOptions = ['em andamento', 'concluído', 'pendente', 'cancelado', 'em revisão', 'atrasado'];

function ActivityDetailsModal({ groupId, activityId, token, loadActivities }) {
    const [open, setOpen] = useState(false);
    const [updatedActivity, setUpdatedActivity] = useState({});
    const [loading, setLoading] = useState(false);

    const fetchActivityDetails = async () =>
    {
        try
        {
            const data = await activityDetails({ groupId, activityId, token });
            setUpdatedActivity(data);
        }
        catch (error) {
            console.error('Error fetching activity details:', error);
        }
    };

    const handleUpdateActivity = async () =>
    {
        setLoading(true);
        try
        {
            await updateActivity({
                groupId,
                activityId,
                token,
                activityName: updatedActivity.nome,
                activityDesc: updatedActivity.descricao,
                activityDate: updatedActivity.data_entrega,
                activityStatus: updatedActivity.estado,
            });

            loadActivities();
            setOpen(false);
        } 
        catch (error)
        {
            window.alert('Error updating activity:', error);
        }
        finally
        {
            setLoading(false);
        }
    };

    const handleRemoveActivity = async () =>
    {
        if (window.confirm('Tem certeza que deseja deletar esta atividade?'))
        {
            try
            {
                await removeActivity({ groupId, activityId, token });
                loadActivities();
                setOpen(false);
            }
            catch (error)
            {
                window.alert(`Erro ao obter atividades do grupo: ${error.response ? error.response.data.erro : error.message}`);
            }
        }
    };

    useEffect(() => {
        if (open) {
            fetchActivityDetails();
        }
    }, [open]);

    return (
        <>
            <Button variant="outlined" color="primary" onClick={() => setOpen(true)}>
                Ver Detalhes
            </Button>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={{ ...modalStyle }}>
                    <Typography variant="h6">Detalhes da Atividade</Typography>
                    <TextField
                        label="Nome"
                        value={updatedActivity.nome || ''}
                        onChange={(e) => setUpdatedActivity({ ...updatedActivity, nome: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Descrição"
                        value={updatedActivity.descricao || ''}
                        onChange={(e) => setUpdatedActivity({ ...updatedActivity, descricao: e.target.value })}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                    />
                    <TextField
                        label="Data de Entrega"
                        type="date"
                        value={updatedActivity.data_entrega ? updatedActivity.data_entrega.split('T')[0] : ''}
                        onChange={(e) => setUpdatedActivity({ ...updatedActivity, data_entrega: e.target.value })}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        select
                        label="Estado"
                        value={updatedActivity.estado || ''}
                        onChange={(e) => setUpdatedActivity({ ...updatedActivity, estado: e.target.value })}
                        fullWidth
                        margin="normal"
                    >
                        {statusOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button variant="contained" color="primary" onClick={handleUpdateActivity} disabled={loading} sx={{ mt: 2 }}>
                        {loading ? 'Atualizando...' : 'Atualizar'}
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleRemoveActivity} sx={{ mt: 2 }}>
                        Deletar
                    </Button>
                </Box>
            </Modal>
        </>
    );
}

export default ActivityDetailsModal;

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