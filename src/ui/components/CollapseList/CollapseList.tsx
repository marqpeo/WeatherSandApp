import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Box, Collapse, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { memo, useState } from 'react';

interface ICollapseProps {
  label: string,
  openByDefault?: boolean,
  children: JSX.Element,
  icon: JSX.Element,
}

const CollapseList = ({ label, openByDefault = false, icon, children }: ICollapseProps) => {
  const [open, setOpen] = useState(openByDefault);
  const handleClick = () => {setOpen(v => !v)};
  return (
    <Box sx={{margin:'5px 0'}}>
      <ListItem sx={{cursor:'pointer'}} onClick={handleClick}>
          <ListItemIcon> {icon} </ListItemIcon>
          <ListItemText primary={label} />
          {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {open && children}
      </Collapse>
    </Box>
  );
};

export default memo(CollapseList);