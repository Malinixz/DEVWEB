// Groups.js
import React from 'react';
import { Box, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';

import Navbar from '../components/Navbar';
import GroupsActions from '../components/GroupsActions';
import GroupsList from '../components/GroupsList';
import CreateGroupModal from '../components/CreateGroupModal';

import { fetchGroups } from '../services/GroupServices';

function Groups()
{
  /*Token de Autenticação*/
  const token = localStorage.getItem('token');

  /* Estados */
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [groupsData, setGroupsData] = useState([]);
  const [filterMembro, setFilterMembro] = useState(false);
  const [filterAdministrador, setFilterAdministrador] = useState(false);
  const [open, setOpen] = useState(false);

  /* Arrow functions para mudar estados da página */
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handlePageClick = (_event, pageClicked) => setCurrentPage(pageClicked);

  /* Muda estado dos filtros filtros */
  const handleFilterChange = (filterType) =>
  {
    if (filterType === 'membro')
    {
      setFilterMembro(!filterMembro);
      setFilterAdministrador(false);
    }
    else if (filterType === 'administrador')
    {
      setFilterAdministrador(!filterAdministrador);
      setFilterMembro(false);
    }
  };

  /* Carrega lista de grupos */
  const loadGroups = async () =>
  {
    try
    {
      const response = await fetchGroups({ currentPage, searchQuery, filterMembro, filterAdministrador, token });
      setGroupsData(response.data.grupos);
      setTotalPages(response.data.totalPaginas);
    }
    catch(error)
    {
      console.error(error.message);
    }
  }

  useEffect(() =>
  {
    loadGroups();
    console.log(groupsData); // Check the values here
  }, [currentPage, searchQuery, filterMembro, filterAdministrador, token]);

  /* Componentes */
  return (
    <Box sx={{display:'flex'}}>
      <Navbar />
      <Container component='main' maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
        <GroupsActions searchQuery={searchQuery} setSearchQuery={setSearchQuery} filterMember={filterMembro} filterAdmin={filterAdministrador} handleFilterChange={handleFilterChange} handleOpen={handleOpen} />
        <GroupsList groupsData={groupsData} />
        <Pagination count={totalPages} page={currentPage} onChange={handlePageClick} />
      </Container>
      <CreateGroupModal open={open} handleClose={handleClose} loadGroups={loadGroups} token={token} />
    </Box>
  );
}

export default Groups;