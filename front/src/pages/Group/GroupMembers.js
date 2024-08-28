import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MemberList from '../../components/MemberList';
import AddMember from '../../components/AddMember';
import PageContainerGroup from '../../components/PageContainerGroup';
import { fetchMembers } from '../../services/memberService';
import { Grid, TextField } from '@mui/material';

function GroupMembers()
{
    const { id } = useParams();
    const token = localStorage.getItem('token');
    const [members, setMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

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

    const filteredMembers = members.filter(member =>
        member.login.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <PageContainerGroup group_id={id} title={"Membros do Grupo"}>
            <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                <Grid item xs={12} sm={8}>
                    <TextField sx={{ width: '100%' }} label="Buscar" variant="outlined" fullWidth margin="normal" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                </Grid>
                <Grid item xs={12} sm={4} textAlign="right">
                    <AddMember id={id} token={token} onMemberAdded={loadMembers} />
                </Grid>
            </Grid>
            <MemberList id={id} token={token} onMemberRemovedOrUpdated={loadMembers} members={filteredMembers} />
        </PageContainerGroup>
    );
};

export default GroupMembers;