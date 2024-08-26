import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { fetchActivities } from '../../services/actvServices';
import PageContainerGroup from '../../components/PageContainerGroup';
import ActivitiesList from '../../components/ActvComponents/ActivitiesList';
import AddActivityModal from '../../components/ActvComponents/AddActivity';

function GroupActivities() {
    const { id } = useParams();
    const token = localStorage.getItem('token');
    const [activities, setActivities] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);

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

    return (
        <PageContainerGroup group_id={id} title="Atividades do Grupo">
            <ActivitiesList 
                id={id} 
                token={token} 
                activities={activities} 
                loadActivities={loadActivities} // Pass loadActivities to ActivitiesList
            />
            <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
                Adicionar Atividade
            </Button>
            <AddActivityModal 
                open={isModalOpen} 
                handleClose={() => setModalOpen(false)} 
                loadActivities={loadActivities} 
                groupId={id} 
                token={token} 
            />
        </PageContainerGroup>
    );
}

export default GroupActivities;