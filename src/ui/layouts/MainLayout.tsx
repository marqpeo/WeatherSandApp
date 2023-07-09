import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Container, Drawer, Grid } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { IAppState } from '../../models/AppState';
import { toggleDrawer } from '../../redux/core';

export default function MainLayout() {
  const dispatch = useDispatch();

  const handleOpenMenu = () => {
    dispatch(toggleDrawer());
  }
  
  const drawerIsOpen = useSelector<IAppState, boolean>(({core}) => core.drawerIsOpen);

  return (
    <Container
      disableGutters={true}
      maxWidth={false}
      sx={{
        display: 'flex', height: '100vh', overflow:'hidden'
      }}
    // className='h-screen max-h-screen flex bg-gray-200'
    >
      <Grid container wrap='nowrap'>
        
        { drawerIsOpen &&
          <Drawer anchor='left' open={drawerIsOpen} onClose={handleOpenMenu} >
            <Sidebar/>
          </Drawer>
        }

        <Grid item className="item" display={{xs:'none', md:'block'}} md={3}>
          <Sidebar />
        </Grid>
        
        <Grid item className="item" xs={12} md={true} sx={{p:2}}>
          <MenuIcon onClick={handleOpenMenu} sx={{display:{xs:'block', md:'none'}}} />
          {/* <div className='container p-10 md:p-16'> */}
          <Outlet />
          {/* </div> */}
        </Grid>
      </Grid>


    </Container>
  );
}
