import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';

import Badge from '@mui/material/Badge';

import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Logo, SearchUI } from '../../components';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Link from 'next/link';

export default function PrimarySearchAppBar() {
  const [notificationsCounter, setNotificationsCounter] = React.useState<number>(13);

  const handleOpenWallet = () => {
    console.log('open wallet');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <div className='container'>
          <Toolbar>
            <Logo classes='text-white' />
            <SearchUI />
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { md: 'flex' } }}>
              <IconButton size='large' aria-label='show 4 new mails' color='inherit' onClick={handleOpenWallet}>
                <AccountBalanceWalletIcon />
              </IconButton>
              <IconButton size='large' aria-label='show 17 new notifications' color='inherit'>
                <Badge badgeContent={notificationsCounter} color='error'>
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Link href='/123'>
                <IconButton size='large' edge='end' aria-label='account of current user' aria-haspopup='true' color='inherit'>
                  <AccountCircle />
                </IconButton>
              </Link>
            </Box>
          </Toolbar>
        </div>
      </AppBar>
    </Box>
  );
}
