import Drawer from '@mui/material/Drawer';
import { Link, useLocation } from 'react-router-dom';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Box, Typography, Divider } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import EventIcon from '@mui/icons-material/Event';
import ChatIcon from '@mui/icons-material/Chat';
import GroupsIcon from '@mui/icons-material/Groups';

function NavbarGroup({ group_id })
{
    const drawerWidth = 215;
    const sxConfig = { width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } };
    const boxSxConfig = { padding: 3.8, backgroundColor: '#1976d2', color: '#fff' };
    const location = useLocation();

    const getListItemSx = (path) => ({ backgroundColor: location.pathname === path ? '#e0e0e0' : 'inherit', '&:hover': { backgroundColor: '#f0f0f0', }});

    return (
        <Drawer sx={sxConfig} variant="permanent" anchor="left">
            <Box sx={boxSxConfig}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'White',  }}> Conecta </Typography>
            </Box>
            <Divider />
            <List>
                <ListItemButton LinkComponent={Link} to={`/GroupMembers/${group_id}`} sx={getListItemSx(`/GroupMembers/${group_id}`)}>
                    <ListItemIcon><GroupIcon /></ListItemIcon>
                    <ListItemText primary="Membros" />
                </ListItemButton>
                <ListItemButton LinkComponent={Link} to={`/GroupActivities/${group_id}`} sx={getListItemSx(`/GroupActivities/${group_id}`)}>
                    <ListItemIcon><EventIcon /></ListItemIcon>
                    <ListItemText primary="Atividades" />
                </ListItemButton>
                <ListItemButton LinkComponent={Link} to={`/Groups/${group_id}`} sx={getListItemSx('/Conversa')}>
                    <ListItemIcon><ChatIcon /></ListItemIcon>
                    <ListItemText primary="Conversa" />
                </ListItemButton>
                <ListItemButton LinkComponent={Link} to='/Groups' sx={getListItemSx('/Groups')}>
                    <ListItemIcon><GroupsIcon /></ListItemIcon>
                    <ListItemText primary="Grupos" />
                </ListItemButton>
            </List>
        </Drawer>
    );
}

export default NavbarGroup;