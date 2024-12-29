import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 2, position: 'fixed', bottom: 0, width: '100%' }}>
      <Typography variant="body2" color="textSecondary" align="center">
        © 2024 My App. All Rights Reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
