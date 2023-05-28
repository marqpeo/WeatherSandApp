import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Container, Drawer, Grid, Icon } from '@mui/material';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';

export default function MainLayout() {

  const [isOpen, setIsOpen] = useState(false);

  const handleOpenMenu = () => {
    setIsOpen(prev => !prev);
  }

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
        
        { isOpen &&
          <Drawer anchor='left' open={isOpen} onClose={handleOpenMenu} >
            <Sidebar/>
          </Drawer>
        }

        <Grid className="item" display={{xs:'none', md:'block'}} md={3}>
          <Sidebar />
        </Grid>
        
        <Grid className="item" xs={12} md={true} sx={{p:2}}>
          <MenuIcon onClick={handleOpenMenu} sx={{display:{xs:'block', md:'none'}}} />
          {/* <div className='container p-10 md:p-16'> */}
          <Outlet />
          {/* </div> */}
        </Grid>
      </Grid>


    </Container>
  );
}
