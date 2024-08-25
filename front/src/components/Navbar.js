import Drawer from '@mui/material/Drawer';
import { Link, useLocation } from 'react-router-dom';
import { Box, Typography, Divider } from '@mui/material';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircle from '@mui/icons-material/AccountCircle';
import GroupsIcon from '@mui/icons-material/Groups';

function Navbar()
{
  const drawerWidth = 215;
  const sxConfig = { width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } };
  const boxSxConfig = { padding: 3.8, backgroundColor: '#1976d2', color: '#fff' };
  const location = useLocation();

  const getListItemSx = (path) => ({ backgroundColor: location.pathname === path ? '#e0e0e0' : 'inherit', '&:hover': { backgroundColor: '#f0f0f0', }});

  return (
    <Drawer sx={sxConfig} variant="permanent" anchor="left">
      <Box sx={boxSxConfig}>
        <Typography variant="h5">Super App Z</Typography>
      </Box>
      <Divider />
      <List>
        <ListItemButton LinkComponent={Link} to='/Home' sx={getListItemSx('/Home')}>
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Início" />
        </ListItemButton>
        <ListItemButton LinkComponent={Link} to='/Profile' sx={getListItemSx('/Profile')}>
          <ListItemIcon> <AccountCircle /> </ListItemIcon>
          <ListItemText primary="Perfil" />
        </ListItemButton>
        <ListItemButton LinkComponent={Link} to='/Groups' sx={getListItemSx('/Groups')}>
          <ListItemIcon><GroupsIcon></GroupsIcon></ListItemIcon>
          <ListItemText primary="Grupos" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}

export default Navbar;