import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Container, Drawer, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { IAppState } from '../../models/AppState';
import { toggleDrawer } from '../../redux/core';
import MenuButton from '../components/Buttons/MenuButton';

export default function MainLayout() {
  const dispatch = useDispatch();
  const handleToggleMenu = () => {
    dispatch(toggleDrawer());
  }
  const isDrawerOpen = useSelector<IAppState, boolean>(({core}) => core.drawerIsOpen);
  
  return (
    <Container
      disableGutters={true}
      maxWidth={false}
      sx={{
        display: 'flex', height: '100vh', overflow:'hidden'
      }}
    >
      <Grid container wrap='nowrap'>

        <Drawer anchor='right' open={isDrawerOpen} onClose={handleToggleMenu}>
          <Sidebar/>
        </Drawer>

        <Grid item xs={0} md={3} className="item" display={{xs:'none', md:'block'}}>
          <Sidebar />
        </Grid>
        
        <Grid item xs={12} md={true} className="item" sx={{p:2}}>
          <MenuButton />
          <Outlet />
        </Grid>

      </Grid>
    </Container>
  );
}
