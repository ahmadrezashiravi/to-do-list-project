import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

interface AppBarProps {
  onMenuClick: () => void;
}

const CustomAppBar: React.FC<AppBarProps> = ({ onMenuClick }) => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={onMenuClick}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">
          My App
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
