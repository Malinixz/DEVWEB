import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
        <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Homepage
          </Typography>
          <Typography variant="body1">
            Welcome to the homepage! This is a simple layout with a sidebar navigation using MUI.
          </Typography>
        </Box>
    </Box>
  );
}