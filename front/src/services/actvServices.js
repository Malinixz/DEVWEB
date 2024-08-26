// actvServices.js
import axios from "axios";

export async function fetchActivities(groupId, token)
{
    try
    {
        const response = await axios.get(`${process.env.REACT_APP_HTTP_URL}/groups/${groupId}/activities`, { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }});

        if (response.status === 200)
        {
            return response.data.atividades;
        }
    }
    catch (error)
    {
        console.error('Error:', error);
        throw error;
    }
}

export async function addActivityToGroup({ groupId, token, activityName, activityDesc, activityDate })
{
    try
    {        
        const response = await axios.post(`${process.env.REACT_APP_HTTP_URL}/groups/${groupId}/activities`,
        {nome:activityName, descricao:activityDesc, data_entrega:activityDate},
        {headers:{'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json',}});

        if (response.status === 200)
        {
            console.log('Atividade criada\n', response.data);
            return response.data.atividade;
        }
    }
    catch(error)
    {
        console.log('Error:', error);
        throw error;
    }
}

export async function activityDetails({ groupId, activityId, token })
{
    try
    {
        const response = await axios.get(`${process.env.REACT_APP_HTTP_URL}/groups/${groupId}/activities/${activityId}`,
            { headers:{ 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } });

        if (response.status === 200)
        {
            console.log('Detalhes da atividade\n', response.data);
            return response.data.atividade;
        }
    }
    catch (error)
    {
        console.log('Error:', error);
        throw error;
    }
}

export async function updateActivity({ groupId, activityId, token, activityName, activityDesc, activityDate, activityStatus })
{
    try
    {
        const response = await axios.put(`${process.env.REACT_APP_HTTP_URL}/groups/${groupId}/activities/${activityId}`,
            { nome:activityName, descricao:activityDesc, data_entrega:activityDate, estado:activityStatus },
            { headers:{ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', } });

        if (response.status === 200)
        {
            console.log('Atividade atualizada com sucesso:', response.data);
            return response.data.atividade;
        }
    }
    catch(error)
    {
        console.log('Error:', error);
        throw error;
    }
}

export async function removeActivity({ groupId, activityId, token })
{
    try
    {
        const response = await axios.delete(`${process.env.REACT_APP_HTTP_URL}/groups/${groupId}/activities/${activityId}`, { headers:{ 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }});

        if (response.status === 200)
        {
            console.log(response.data);
            window.alert("Atividade removida com sucesso.")
            return response.data.atividade;
        }
    }
    catch(error)
    {
        console.error('Error:', error);
        throw error;
    }
}

export async function completeActivity({ groupId, activityId, token })
{
    try
    {
        const response = await axios.put(`${process.env.REACT_APP_HTTP_URL}/groups/${groupId}/activities/${activityId}/complete`,
            {},
            { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'}});

        if (response.status === 200)
        {
            console.log('Atividade concluída com sucesso:', response.data);
            return response.data.atividade;
        }
    }
    catch(error)
    {
        console.log('Error:', error);
        throw error;
    }
}

export async function cancelActivity({ groupId, activityId, token })
{
    try
    {
        const response = await axios.put(`${process.env.REACT_APP_HTTP_URL}/groups/${groupId}/activities/${activityId}/cancel`,
            {},
            { headers:{ 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }});

        if (response.status === 200)
        {
            console.log('Atividade cancelada com sucesso:', response.data);
            return response.data.atividade;
        }
    }
    catch(error)
    {
        console.log('Error:', error);
        throw error;
    }
}