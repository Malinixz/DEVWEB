import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const DataForm = new FormData(event.currentTarget);
    if (DataForm.get('password') !== DataForm.get('confpassword')) {
      window.alert('Senhas diferentes');
      return;
    }

    let data = {  // payload
      novo_login: DataForm.get('userName'),
      novo_email: DataForm.get('email'),
      nova_senha: DataForm.get('password'),
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_HTTP_URL}/registrar`,
        data, { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.status === 200) {
        window.alert(response.data.msg);
        navigate('/SignIn'); // Redirect to SignIn page after successful registration
      } else {
        window.alert("Erro ao Registrar o Usuário");
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response) { // Verifica se houve retorno do servidor
        window.alert(`Erro: ${error.response.data.msg}`);
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Cadastro
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="userName"
                  required
                  fullWidth
                  id="userName"
                  label="Nome de Usuário"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Senha"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confpassword"
                  label="Confime Senha"
                  type="password"
                  id="confpassword"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Cadastrar
            </Button>
            <Link href="/" variant="body1">
              Já tem conta? Faça login
            </Link>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}