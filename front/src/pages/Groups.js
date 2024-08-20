import * as React from 'react';
import { TextField, Button, Table, TableHead, TableBody, TableCell, TableRow, Box, Container, IconButton, Modal, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';
import { Link } from 'react-router-dom';

const theme = createTheme();

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function Groups() {
  const token = localStorage.getItem('token');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [groupsData, setGroupsData] = useState([]);
  const [filterMembro, setFilterMembro] = useState(false);
  const [filterAdministrador, setFilterAdministrador] = useState(false);
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handlePageClick = (event, pageClicked) => setCurrentPage(pageClicked);
  const handleFilterChange = (filterType) => {
    if (filterType === 'membro') {
      setFilterMembro(!filterMembro);
      setFilterAdministrador(false);
    } else if (filterType === 'administrador') {
      setFilterAdministrador(!filterAdministrador);
      setFilterMembro(false);
    }
  };
  const handleCreateGroup = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_HTTP_URL}/create-group`,
        { nome: groupName, descricao: groupDescription },
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      if (response.status === 200) {
        handleClose();    // Fechar o Modal
        fetchGroups();    // Recarregar os grupos após a criação
      }
    } catch (error) {
      console.error('Error:', error);
      window.alert(`Erro ao criar Grupo: ${error.response ? error.response.data.erro : error.message}`);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HTTP_URL}/list-groups`, {
        params: { 
          page: currentPage,
          nome: searchQuery,
          membro: filterMembro,
          administrador: filterAdministrador
        },
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (response.status === 200) {
        setGroupsData(response.data.grupos);
        setTotalPages(response.data.totalPaginas);
      }
    } catch (error) {
      console.error('Error:', error);
      window.alert(`Erro ao obter Grupos: ${error.response ? error.response.data.erro : error.message}`);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [currentPage, searchQuery, filterMembro, filterAdministrador, token]);

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
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
            sx={{ width: '40%' }}
          />
          <Box>
            <Button 
              variant={filterMembro ? "contained" : "outlined"} 
              color="primary" 
              sx={{ mr: 2 }}
              onClick={() => handleFilterChange('membro')}
            >
              Membro
            </Button>
            <Button 
              variant={filterAdministrador ? "contained" : "outlined"} 
              color="secondary" 
              sx={{ mr: 2 }}
              onClick={() => handleFilterChange('administrador')}
            >
              Administrador
            </Button>
            <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={handleOpen}>
              + Grupo
            </Button>
          </Box>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Membros</TableCell>
              <TableCell>Atividades</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupsData && groupsData.map((group, index) => (
              <TableRow key={index} component={Link} to={`/GroupMembers/${group.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <TableCell>{group.nome}</TableCell>
                <TableCell>{group.quantidade_membros}</TableCell>
                <TableCell>{group.quantidade_atividades}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageClick}
        />
      </Container>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-title" variant="h6" component="h2">
            Criar Novo Grupo
          </Typography>
          <TextField
            fullWidth
            label="Nome do Grupo"
            margin="normal"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Descrição do Grupo"
            margin="normal"
            multiline
            rows={4}
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleCreateGroup}>
              Criar Grupo
            </Button>
            <Button variant="contained" color="secondary" onClick={handleClose}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
    </ThemeProvider>
  );
}

export default Groups;
