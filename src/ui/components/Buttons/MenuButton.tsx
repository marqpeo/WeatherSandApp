import { memo, useEffect } from'react';
import { IconButton, SxProps, Theme } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import { useDispatch, useSelector } from 'react-redux';
import { onToggleDrawer } from '../../../redux/core';
import { useNavigate } from 'react-router-dom';
import { IAppState } from '../../../models/AppState';

interface IMenuButtonProps{
  onToggleMenu?: () => void;
  sx?: SxProps<Theme> | undefined
}


const MenuButton = ({onToggleMenu, sx}:IMenuButtonProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isDrawerOpen = useSelector<IAppState, boolean>(({core}) => core.drawerIsOpen);


  const handleToggleMenu = () => onToggleMenu
    ? onToggleMenu()
    : dispatch(onToggleDrawer());
    
  useEffect(() => {
    const handleBackButton = () => {
      if (isDrawerOpen) {
        handleToggleMenu();
      } else {
        navigate(-1);
      }
    };
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [navigate, isDrawerOpen])
  
  return (
    <IconButton onClick={handleToggleMenu}
      sx={{ display:{xs:'block', md:'none' }, backgroundColor:'#1976d2',
        height:'60px', width:'60px',
        position: 'absolute', right:'20px', bottom:'20px',
        zIndex:9999,
        ...sx
        }}>
          {
            isDrawerOpen
            ? <KeyboardTabIcon fontSize='large' sx={{color:'white'}}/>
            : <MenuIcon fontSize='large' sx={{color:'white'}} />
          }
    </IconButton>
  )
};

export default memo(MenuButton);