import React from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import NavbarGroup from './NavbarGroup';

function PageContainerGroup({ group_id, title, children })
{

    const paperSxConfig = { padding: 2.4, backgroundColor: '#f0f0f0'};

    return (
        <Box sx={{display:'flex'}}>
            <NavbarGroup group_id={group_id} />
            <Container>
                <Paper elevation={3} sx={paperSxConfig}> <Typography variant="h4" gutterBottom> {title} </Typography> </Paper>
                <Box  sx={{ width: '100%'}}> {children} </Box>
            </Container>
        </Box>
    );
}

export default PageContainerGroup;