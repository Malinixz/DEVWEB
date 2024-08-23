import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MemberList from '../../components/MemberList';
import AddMember from '../../components/AddMember';
import PageContainerGroup from '../../components/PageContainerGroup';

async function fetchMembers(groupId, token)
{
    try
    {
        const response = await axios.get(`${process.env.REACT_APP_HTTP_URL}/groups/${groupId}/members`, { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }});

        if (response.status === 200)
        {
            return response.data.membros;
        }
    }
    catch (error)
    {
        console.error('Error:', error);
        window.alert(`Erro ao obter membros do grupo: ${error.response ? error.response.data.erro : error.message}`);
        throw error;
    }
};

function GroupMembers()
{
    const { id } = useParams();
    const token = localStorage.getItem('token');
    const [members, setMembers] = useState([]);

    const loadMembers = async () =>    
    {
        try
        {
            const membersData = await fetchMembers(id, token);
            setMembers(membersData);
        }
        catch (error)
        {
            console.error('Falhou ao carregar membros', error);
        }
    };

    useEffect(() => { loadMembers(); }, [id]);

    return (
        <PageContainerGroup group_id={id} title={"Membros do Grupo"}>
            <MemberList id={id} token={token} onMemberRemovedOrUpdated={loadMembers} members={members} />
            <AddMember id={id} token={token} onMemberAdded={loadMembers} />
        </PageContainerGroup>
    );
};

export default GroupMembers;