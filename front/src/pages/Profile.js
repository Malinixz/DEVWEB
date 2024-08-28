import * as React from 'react';
import { Box, Container, Typography, TextField, Button, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Navbar from '../components/Navbar';
import { useState } from 'react';
import axios from 'axios';

const theme = createTheme();

function Profile() {
    
    const token = localStorage.getItem('token');
    const [userName, setNewUserName] = useState(localStorage.getItem('login'));
    const [email , setNewEmail] = useState(localStorage.getItem('email'));
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    
    const handleUpdateUserName = async () => {
      if (!userName){
          window.alert("Campo Nome está Vazio!");
          return;
      }
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_HTTP_URL}/edit-name`,
          { novo_login: userName },
          { headers: { 'Authorization': `Bearer' ${token}`, 'Content-Type': 'application/json' } }
        );
        if (response.status === 200) {
          window.alert('Nome de usuário atualizado com sucesso');
          localStorage.setItem('login', userName) // Altera o localStorage para o nome novo
        }
      } catch (error) {
        console.error('Error:', error);
        window.alert(`Erro: ${error.response ? error.response.data.erro : error.message}`);
      }
    };

    const handleUpdateEmail = async () => {
      if (!email){
          window.alert("Campo Email está Vazio!");
          return;
      }
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_HTTP_URL}/edit-email`,
          { novo_email: email },
          { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );
        if (response.status === 200) {
          window.alert('Email atualizado com sucesso');
          localStorage.setItem('email', email)
        }
      } catch (error) {
        console.error('Error:', error);
      window.alert(`Erro: ${error.response ? error.response.data.erro : error.message}`);
      }
    };

    const handleUpdatePassword = async () => {
        try {
          const response = await axios.put(
            `${process.env.REACT_APP_HTTP_URL}/edit-password`,
            { senha_atual: currentPassword, nova_senha: newPassword },
            { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
          );
          if (response.status === 200) {
            window.alert('Senha atualizada com sucesso');
          }
        } catch (error) {
          console.error('Error:', error);
          window.alert(`Erro: ${error.response ? error.response.data.erro : error.message}`);
        }
      };

    return (
      <ThemeProvider theme={theme}>
        <Navbar />
        <Container component="main" maxWidth="sm">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: '#f5f5f5',
              padding: 4,
              borderRadius: 2,
              boxShadow: 3,
              mt: 5,
            }}
          >
            <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
              Seu Perfil
            </Typography>

            <Grid container spacing={2} alignItems="flex-end">
              <Grid item>
                <AccountCircleIcon />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Seu nome"
                  defaultValue={userName}
                  onChange={(event) => setNewUserName(event.target.value)}
                />
              </Grid>
              <Grid item xs={3}>
                <Button variant="contained" color="primary" fullWidth onClick={handleUpdateUserName}>
                  Alterar nome
                </Button>
              </Grid>
            </Grid>
          
            <Grid container spacing={2} alignItems="flex-end" sx={{ mt: 2 }}>
              <Grid item>
                <EmailIcon />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Seu email"
                  defaultValue={email}
                  onChange={(event) => setNewEmail(event.target.value)}
                />
              </Grid>
              <Grid item xs={3}>
                <Button variant="contained" color="primary" fullWidth onClick={handleUpdateEmail}>
                  Alterar email
                </Button>
              </Grid>
            </Grid>
          
            <Grid container spacing={2} alignItems="flex-end" sx={{ mt: 2 }}>
              <Grid item>
                <LockIcon />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Senha atual"
                  type="password"
                  defaultValue={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Nova senha"
                  type="password"
                  defaultValue={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
              </Grid>
              <Grid item xs={3}>
                <Button variant="contained" color="primary" fullWidth onClick={handleUpdatePassword}>
                  Alterar senha
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </ThemeProvider>
    );
}

export default Profile;
