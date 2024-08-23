import React from 'react';
import { TextField, Button, Box, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

const GroupSearchTextField = ({searchQuery, setSearchQuery}) =>
{
    return (
        <TextField
            variant="outlined"
            placeholder="Pesquisar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
                startAdornment: (
                <IconButton position="start">
                <SearchIcon />
                </IconButton>
                ),
            }}
            sx={{ width: '40%' }} />
    );
}

function GroupsActions({ searchQuery, setSearchQuery, filterMember, filterAdmin, handleFilterChange, handleOpen })
{
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <GroupSearchTextField searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <Box>
                <Button variant={filterMember ? 'contained' : 'outlined'} color="primary" sx={{ mr: 2 }} onClick={() => handleFilterChange('membro')}>
                    Membro
                </Button>
                <Button variant={filterAdmin ? 'contained' : 'outlined'} color="secondary" sx={{ mr: 2 }} onClick={() => handleFilterChange('administrador')}>
                    Administrador
                </Button>
                <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={handleOpen}>
                    Grupo
                </Button>
            </Box>
        </Box>
    );
}

export default GroupsActions;