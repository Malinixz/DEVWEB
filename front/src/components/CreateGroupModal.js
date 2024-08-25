// CreateGroupModal.js
import React, { useState } from 'react';
import { Box, Modal, TextField, Button, Typography } from '@mui/material';
import { createGroup } from '../services/GroupServices';

function CreateGroupModal({ open, handleClose, loadGroups, token })
{
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');

  const modalStyle =
  {
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

  const handleCreateGroup = async () =>
  {
    if (groupName.trim() === '' || groupDescription.trim() === '')
    {
      return; /* Feedback para o usuário */
    }
    
    try
    {
      await createGroup({ groupName, groupDescription, loadGroups, handleClose, token });
      setGroupName(''); // Reset form fields
      setGroupDescription(''); // Reset form fields
    }
    
    catch (error)
    {
      console.error(error.message);
    }
  };

  return (
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateGroup}
            disabled={groupName.trim() === '' || groupDescription.trim() === ''}
          >
            Criar Grupo
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClose}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default CreateGroupModal;