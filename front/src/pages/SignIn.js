import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const DataForm = new FormData(event.currentTarget);
    let data = {  // payload
      email: DataForm.get('email'),
      senha: DataForm.get('password'),
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_HTTP_URL}/login`,
        data,{headers: {'Content-Type': 'application/json'}}
      );
      if (response.status === 200) {
        localStorage.setItem('login', response.data.login);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('token', response.data.token);
        navigate('/Home');  // Redireciona ao Home
      } else {
        window.alert("Erro ao Autenticar o Usuário");
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response) { // Verifica se houve retorno do servidor
        // Exibir a mensagem do servidor, se disponível
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
          <Typography component="h1" variant="h1" gutterBottom
          sx={{ 
            fontWeight: 'bold', 
            color: 'primary.main', 
          }}>
            Conecta
          </Typography>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Link href="/SignUp" variant="body1"> {"Não tem conta? Cadastre-se aqui"} </Link>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}