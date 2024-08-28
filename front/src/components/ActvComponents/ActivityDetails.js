import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem, CircularProgress } from '@mui/material';
import { activityDetails, updateActivity, removeActivity, completeActivity } from '../../services/actvServices';

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

const statusOptions = ['em andamento', 'pendente', 'cancelado', 'em revisão', 'atrasado'];

function ActivityDetailsModal({ groupId, activityId, token, loadActivities })
{
    const [open, setOpen] = useState(false);
    const [updatedActivity, setUpdatedActivity] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);  // estado para fetch

    const fetchActivityDetails = async () =>
    {
        setFetching(true);  // Começa o fetch
        try
        {
            const data = await activityDetails({ groupId, activityId, token });
            setUpdatedActivity(data);
        }

        catch (error)
        {
            console.error('Error fetching activity details:', error);
        }

        finally
        {
            setFetching(false);  // Termina o fetch
        }
    };

    const handleUpdateActivity = async () =>
    {
        setLoading(true);  // Começa o loading
        try {
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
        } catch (error) {
            window.alert('Error updating activity:', error);
        } finally {
            setLoading(false);  // Termina o loading
        }
    };

    const handleRemoveActivity = async () =>
    {
        if (window.confirm('Tem certeza que deseja deletar esta atividade?'))
        {
            setLoading(true);  // Começa o loading
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

            finally
            {
                setLoading(false);  // Termina o loading
            }
        }
    };

    const handleCompleteActivity = async () =>
    {
        if (window.confirm('Tem certeza que deseja marcar esta atividade como concluída?'))
        {
            setLoading(true);  // Começa o loading
            
            try
            {
                const updatedActivity = await completeActivity({ groupId, activityId, token });
                setUpdatedActivity(updatedActivity);
                loadActivities();
                setOpen(false);
            }

            catch (error)
            {
                window.alert(`Erro ao atualizar atividade: ${error.response ? error.response.data.erro : error.message}`);
            }

            finally
            {
                setLoading(false);  // Termina o loading
            }
        }
    };

    useEffect(() =>
    {
        if (open)
        {
            fetchActivityDetails();
        }
    }, [open]);

    return (
        <>
            <Button variant="outlined" color="primary" onClick={() => setOpen(true)}>
                ...
            </Button>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={{ ...modalStyle }}>
                    <Typography variant="h6">Detalhes da Atividade</Typography>

                    {fetching ? (  // Show loading spinner while fetching
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <TextField
                                label="Nome"
                                value={updatedActivity.nome || ''}
                                onChange={(e) => setUpdatedActivity({ ...updatedActivity, nome: e.target.value })}
                                fullWidth
                                margin="normal"
                                disabled={['concluído', 'cancelado'].includes(updatedActivity.estado) || loading}
                            />
                            <TextField
                                label="Descrição"
                                value={updatedActivity.descricao || ''}
                                onChange={(e) => setUpdatedActivity({ ...updatedActivity, descricao: e.target.value })}
                                fullWidth
                                margin="normal"
                                multiline
                                rows={4}
                                disabled={['concluído', 'cancelado'].includes(updatedActivity.estado) || loading}
                            />
                            <TextField
                                label="Data de Entrega"
                                type="date"
                                value={updatedActivity.data_entrega ? updatedActivity.data_entrega.split('T')[0] : ''}
                                onChange={(e) => setUpdatedActivity({ ...updatedActivity, data_entrega: e.target.value })}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                disabled={['concluído', 'cancelado'].includes(updatedActivity.estado) || loading}
                            />
                            <TextField
                                label="Data de Conclusão"
                                type="date"
                                value={updatedActivity.data_conclusao ? updatedActivity.data_conclusao.split('T')[0] : ''}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                disabled  // This disables the input field
                            />
                            <TextField
                                select
                                label="Estado"
                                value={updatedActivity.estado || ''}
                                onChange={(e) => setUpdatedActivity({ ...updatedActivity, estado: e.target.value })}
                                fullWidth
                                margin="normal"
                                disabled={['concluído', 'cancelado'].includes(updatedActivity.estado) || loading}>
                                {statusOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleUpdateActivity}
                                disabled={loading || ['concluído', 'cancelado'].includes(updatedActivity.estado)}
                                sx={{ mt: 2 }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Atualizar'}
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleRemoveActivity}
                                disabled={loading}
                                sx={{ mt: 2 }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Deletar'}
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleCompleteActivity}
                                disabled={loading || updatedActivity.estado === 'concluído'}
                                sx={{ mt: 2 }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Completar'}
                            </Button>
                        </>
                    )}
                </Box>
            </Modal>
        </>
    );
}

export default ActivityDetailsModal;