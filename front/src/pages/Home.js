import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function Home()
{
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate('/'); // Redireciona para o login
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Navbar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          bgcolor: 'background.default', 
          p: 3, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center'
        }}
      >
        <Typography 
          variant="h5" 
          component="p" 
          sx={{ 
            marginBottom: 4, 
            color: 'text.secondary'
          }}
        >
          Bem-vindo ao Conecta! A plataforma que conecta você a sua comunidade.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSignOut}
          sx={{ marginTop: 2 }}
        >
          Voltar para página de login
        </Button>
      </Box>
    </Box>
  );
}