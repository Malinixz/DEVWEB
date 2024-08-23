import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MemberList from '../../components/MemberList';
import AddMember from '../../components/AddMember';
import PageContainerGroup from '../../components/PageContainerGroup';
import { fetchMembers } from '../../services/memberService';

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