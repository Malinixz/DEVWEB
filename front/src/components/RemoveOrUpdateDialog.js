import React, { useState } from 'react';
import { Button, Dialog, DialogActions } from "@mui/material";
import { RemoveMember } from '../services/memberService';
import { UpdateMemberStatus } from '../services/memberService';

/*
    Componente chama modal de dialogo para remover membro ou atualiza-lo para administrador.
    Parâmetros
        id: ID do grupo
        token: token de autorização
        user_id: ID do usuário selecionado na lista de membros.
        onMemberRemovedOrUpdated: callback function para fetch da lista de membros.
*/
function RemoveOrUpdateDialog({id, token, user_id, onMemberRemovedOrUpdated, is_admin})
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
            await UpdateMemberStatus({id, token, user_id, onMemberRemovedOrUpdated, onClose: handleClose, is_admin});
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
                    <Button onClick={handleUpdateMember} color="primary" disabled={loading}> {loading ? 'Atualizando...' : is_admin ? 'Remover da Lista de Admins' : 'Tornar Admin'} </Button>
                    <Button onClick={handleClose} color="error"> Cancelar </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default RemoveOrUpdateDialog;