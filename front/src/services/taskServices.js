import axios from "axios";

// Fetch all tasks for a specific activity in a group
export async function fetchTasks({ groupId, activityId, token })
{
    try
    {
        const response = await axios.get(`${process.env.REACT_APP_HTTP_URL}/groups/${groupId}/activities/${activityId}/tasks`,
            { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } });

        if (response.status === 200)
        {
            return response.data.tarefas;
        }

        else
        {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    }

    catch (error)
    {
        console.error('Error fetching tasks:', error.message);
        throw error;
    }
}

// Fetch details of a specific task
export async function taskDetails({ groupId, activityId, taskId, token })
{
    try
    {
        const response = await axios.get(`${process.env.REACT_APP_HTTP_URL}/groups/${groupId}/activities/${activityId}/tasks/${taskId}`,
            { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } });

        if (response.status === 200)
        {
            console.log('Task details:', response.data);
            return response.data.tarefa;
        }

        else
        {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    }

    catch (error)
    {
        console.error('Error fetching task details:', error.message);
        throw error;
    }
}

// Create a new task for a specific activity
export async function createTask({ groupId, activityId, token, taskName, taskDesc, taskDate, responsibleId })
{
    try
    {
        const response = await axios.post(`${process.env.REACT_APP_HTTP_URL}/groups/${groupId}/activities/${activityId}/tasks`,
            { nome: taskName, descricao: taskDesc, data_entrega: taskDate, id_responsavel: responsibleId },
            { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } });

        if (response.status === 201)
        {
            console.log('Task created:', response.data);
            return response.data;
        }

        else
        {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    }
    
    catch (error)
    {
        console.error('Error creating task:', error.message);
        throw error;
    }
}

// Update a specific task
export async function updateTask({ groupId, activityId, taskId, token, updates })
{
    try
    {
        const response = await axios.put(`${process.env.REACT_APP_HTTP_URL}/groups/${groupId}/activities/${activityId}/tasks/${taskId}`,
            updates,
            { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } });

        if (response.status === 200)
        {
            console.log('Task updated:', response.data);
            return response.data;
        }
        else
        {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    }
    catch (error)
    {
        console.error('Error updating task:', error.message);
        throw error;
    }
}


// Remove a specific task
export async function removeTask({ groupId, activityId, taskId, token })
{
    try {
        const response = await axios.delete(`${process.env.REACT_APP_HTTP_URL}/groups/${groupId}/activities/${activityId}/tasks/${taskId}`,
            { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } });

        if (response.status === 200)
        {
            console.log('Task removed:', response.data);
            return response.data;
        }

        else
        {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    }

    catch (error)
    {
        console.error('Error removing task:', error.message);
        throw error;
    }
}


// Mark a specific task as complete
export async function completeTask({ groupId, activityId, taskId, token })
{
    try
    {
        const response = await axios.put(`${process.env.REACT_APP_HTTP_URL}/groups/${groupId}/activities/${activityId}/tasks/${taskId}/complete`,
            {},
            { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } });

        if (response.status === 200)
        {
            console.log('Task completed:', response.data);
            return response.data;
        }

        else
        {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    }

    catch (error)
    {
        console.error('Error completing task:', error.message);
        throw error;
    }
}

// Mark a specific task as canceled
export async function cancelTask({ groupId, activityId, taskId, token })
{
    try
    {
        const response = await axios.put(`${process.env.REACT_APP_HTTP_URL}/groups/${groupId}/activities/${activityId}/tasks/${taskId}/cancel`,
            {},
            { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } });

        if (response.status === 200)
        {
            console.log('Task canceled:', response.data);
            return response.data;
        }

        else
        {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    }
    
    catch (error)
    {
        console.error('Error canceling task:', error.message);
        throw error;
    }
}
