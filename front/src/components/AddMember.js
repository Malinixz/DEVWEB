import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, CircularProgress } from '@mui/material';
import { addMemberToGroup } from '../services/memberService';
import AddIcon from '@mui/icons-material/Add';

function AddMemberModal({ id, token, open, onClose, onMemberAdded }) {
    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAddMember = async () => {
        if (!userEmail) {
            window.alert('Coloque o email do usuário.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await addMemberToGroup({ groupId: id, userEmail, token });
            window.alert('Membro adicionado com sucesso.');
            setUserEmail('');
            onMemberAdded();  // Callback to update the members list
            onClose();        // Close the modal
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} sx={{ minWidth: 300 }}>
            <DialogTitle>Adicionar Novo Membro</DialogTitle>
            <DialogContent sx={{ paddingBottom: 2 }}>
                {error && <Typography color="error">{error}</Typography>}
                <TextField
                    margin="dense"
                    label="Email"
                    type="email"
                    fullWidth
                    variant="outlined"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    sx={{ marginBottom: 2 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancelar</Button>
                <Button onClick={handleAddMember} color="primary" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Adicionar Usuário'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function AddMember({ id, token, onMemberAdded }) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<AddIcon />}
                onClick={handleOpen}
                sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText' }}
            >
                Adicionar Membro
            </Button>
            <AddMemberModal
                id={id}
                token={token}
                open={open}
                onClose={handleClose}
                onMemberAdded={onMemberAdded}
            />
        </div>
    );
}

export default AddMember;