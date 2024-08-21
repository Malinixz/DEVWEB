import React, { useState } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';

/*
    Componente chama Modal para adicionar user por email.
    Parâmetros
        id: ID do grupo
        token: token de autorização
        open: estado de aberto do modal.
        onClose: estado de fechado do modal.
        onMemberAdded: callback function para fetch da lista de mebros.
*/
function AddMemberModal({ id, token, open, onClose, onMemberAdded   })
{
    const [user_email, setUserEmail] = useState('');
    const [user_id] = '';
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAddMember = async() =>
    {
        /*Se nao ha email, avisa o usuario*/
        if (!user_email)
        {
            window.alert('Coloque o email do usuário.');
            return;
        }

        /*Ativa estado de loading para usuario esperar*/
        setLoading(true);
        setError('');

        /*Tenta requisicao POST*/
        try
        {
            const response = await axios.post(
                `${process.env.REACT_APP_HTTP_URL}/groups/${id}/members`,
                {
                    /*Corpo da requisicao*/
                    user_id,
                    user_email
                },
                {
                    /*Cabecalho*/
                    headers: {  
                        'Authorization': `Bearer ${token}`, /*Token de autorizacao*/
                        'Content-Type': 'application/json'  /*Informa que eh um dado json*/
                    }
                }
            );

            /*Se POST foi bem sucedido*/
            if (response.status === 200)
            {
                console.log('Membro adicionado com sucesso.');
                window.alert('Membro adicionado com sucesso.');
                setUserEmail('');
                onMemberAdded();  // Callback function para fetchMembers() para atualizar lista
                onClose();        // Fecha o Modal
            }
        }

        /*Tratamento de erro*/
        catch (error)
        {
            console.error('Error:', error);
            window.alert(`Erro ao adicionar membro no grupo: ${error.response ? error.response.data.erro : error.message}`);
        }

        finally
        {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Adicionar Novo Membro</DialogTitle>
            <DialogContent>
                {error && <Typography color="error">{error}</Typography>}
                <TextField
                    margin="dense"
                    label="Email"
                    type="email"
                    fullWidth
                    variant="outlined"
                    value={user_email}
                    onChange={(e) => setUserEmail(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary"> Cancelar </Button>
                <Button onClick={handleAddMember} color="primary" disabled={loading}> {loading ? 'Adding...' : 'Add User'} </Button>
            </DialogActions>
        </Dialog>
    );
}

function AddMember({id, token, onMemberAdded})
{
    /*Estado de Modal aberto ou fechado*/
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Adicionar usuário
            </Button>
            <AddMemberModal id={id} token={token} open={open} onClose={handleClose} onMemberAdded={onMemberAdded}/*CALLBACK*/   />
        </div>
    );
}

export default AddMember;

/*
<TextField
autoFocus
margin="dense"
label="ID"
type="text"
fullWidth
variant="outlined"
value={user_id}
onChange={(e) => setUserId(e.target.value)}
/>
*/