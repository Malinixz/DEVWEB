import React, { useState } from 'react';
import axios from "axios";
import { Button, Dialog, DialogActions } from "@mui/material";

/**
 * Função chama backend para remover membro do grupo.
 * Parâmetros
 *  id: ID do grupo.
 *  token: token de autorização.
 *  user_id: ID do usuário passado pelo componente.
 *  onMemberRemovedOrUpdated: callback function para fetch() da lista de membros.
 *  onClose: callback function para DialogProps.onClose() passado pelo componente.
 */
async function RemoveMember({ id, token, user_id, onMemberRemovedOrUpdated, onClose })
{
    try
    {
        const response = await axios.delete(`${process.env.REACT_APP_HTTP_URL}/groups/${ id }/members`, { headers: {'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'}, data: { user_id }});

        /*Se DELETE foi bem sucedido*/
        if (response.status === 200)
        {
            console.log('Membro removido com sucesso.');
            window.alert('Membro removido com sucesso.');
            onMemberRemovedOrUpdated();  // Callback function para fetchMembers() para atualizar lista
            onClose();                  // Callback function para DialogProps.onClose() para fechar modal de dialogo
        }
    }

    /*Tratamento de erro*/
    catch (error)
    {
        console.error('Error:', error);
        window.alert(`Erro ao remover membro do grupo: ${error.response ? error.response.data.erro : error.message}`);
    }
}

/*
    Função chama backend para atualizar membro para Admin.
*/
async function UpdateToAdmin({id, token, user_id, onMemberRemovedOrUpdated, onClose})
{
    window.alert('Ainda não implementado.');
}

/*
    Componente chama modal de dialogo para remover membro ou atualiza-lo para administrador.
    Parâmetros
        id: ID do grupo
        token: token de autorização
        user_id: ID do usuário selecionado na lista de membros.
        onMemberRemovedOrUpdated: callback function para fetch da lista de membros.
*/
function RemoveOrUpdateDialog({id, token, user_id, onMemberRemovedOrUpdated})
{
    /*Estado de Modal aberto ou fechado*/
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    /*Estado de Loading*/
    const [loading, setLoading] = useState(false);

    const handleRemoveMember = async() =>
    {
        /*Ativa estado de loading para usuario esperar*/
        setLoading(true);

        /*Tenta requisição DELETE*/
        try
        {
            await RemoveMember({id, token, user_id, onMemberRemovedOrUpdated, onClose: handleClose});
        }
        finally
        {
            setLoading(false);
        }

        /*Desativa loading para o usuário prosseguir*/
        setLoading(false);
    }

    const handleUpdateMember = async() =>
    {
        /*Ativa estado de loading para usuario esperar*/
        setLoading(true);

        /*Tenta requisição PUT*/
        try
        {
            await UpdateToAdmin({id, token, user_id, onMemberRemovedOrUpdated, onClose: handleClose});
        }
        finally
        {
            setLoading(false);
        }

        /*Desativa loading para o usuário prosseguir*/
        setLoading(false);
    }

    /*Componente*/
    return(
        <div>
            <Button variant="contained" color="primary" onClick={handleOpen}>...</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogActions>
                    <Button onClick={handleRemoveMember} color="primary" disabled={loading}> {loading ? 'Removendo...' : 'Remover Membro'} </Button>
                    <Button onClick={handleUpdateMember} color="primary" disabled={loading}> {loading ? 'Atualizando...' : 'Tornar Admin'} </Button>
                    <Button onClick={handleClose} color="error"> Cancelar </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default RemoveOrUpdateDialog;