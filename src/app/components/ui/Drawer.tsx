import React from 'react';
import { Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
}

const CustomDrawer: React.FC<DrawerProps> = ({ open, onClose }) => {
  return (
    <Drawer open={open} onClose={onClose} variant="temporary">
      <List>
        <ListItem button>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Settings" />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default CustomDrawer;
