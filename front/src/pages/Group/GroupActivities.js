import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { fetchActivities } from '../../services/actvServices';
import PageContainerGroup from '../../components/PageContainerGroup';
import ActivitiesList from '../../components/ActvComponents/ActivitiesList';
import AddActivityModal from '../../components/ActvComponents/AddActivity';
import AddIcon from '@mui/icons-material/Add';

function GroupActivities() {
    const { id } = useParams();
    const token = localStorage.getItem('token');
    const [activities, setActivities] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const loadActivities = async () => {
        try {
            const activitiesData = await fetchActivities(id, token);
            setActivities(activitiesData);
        } catch (error) {
            window.alert(`Erro ao obter atividades do grupo: ${error.response ? error.response.data.erro : error.message}`);
        }
    };

    useEffect(() => {
        loadActivities();
    }, [id]);

    const filteredActivities = activities.filter(activity =>
        activity.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.estado.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <PageContainerGroup group_id={id} title="Atividades do Grupo">
            <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                <Grid item xs={12} sm={8}>
                    <TextField 
                        sx={{ width: '100%' }} 
                        label="Buscar" 
                        variant="outlined" 
                        margin="normal" 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                    />
                </Grid>
                <Grid item xs={12} sm={4} textAlign="right">
                    <Button 
                        variant="contained" 
                        color="primary" 
                        size="large" 
                        startIcon={<AddIcon />} 
                        onClick={() => setModalOpen(true)} 
                        sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText' }}
                    >
                        ATIVIDADE
                    </Button>
                </Grid>
            </Grid>
            <ActivitiesList id={id} token={token} activities={filteredActivities} loadActivities={loadActivities} />
            <AddActivityModal open={isModalOpen} handleClose={() => setModalOpen(false)} loadActivities={loadActivities} groupId={id} token={token} />
        </PageContainerGroup>
    );
}

export default GroupActivities;