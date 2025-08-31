import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { MenuBook as MenuBookIcon, Login as LoginIcon, Logout as LogoutIcon, Person as PersonIcon, Search as SearchIcon } from '@mui/icons-material';
import { AuthContext } from '../lib/AuthContext';

const Header = ({ onLogout }) => {
  const { user, setCurrentPage } = useContext(AuthContext);

  return (
    <AppBar position="static">
      <Toolbar>
        <MenuBookIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Library Management
        </Typography>
        {user ? (
          <>
            <Button color="inherit" onClick={() => setCurrentPage('browse')}>
              <SearchIcon sx={{ mr: 1 }} />
              Browse
            </Button>
            <Button color="inherit" onClick={() => setCurrentPage('dashboard')}>
              <PersonIcon sx={{ mr: 1 }} />
              Dashboard
            </Button>
            <Button color="inherit" onClick={onLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={() => setCurrentPage('login')}>
              <LoginIcon sx={{ mr: 1 }} />
              Login
            </Button>
            <Button color="inherit" onClick={() => setCurrentPage('register')}>
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
