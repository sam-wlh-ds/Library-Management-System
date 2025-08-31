import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Button, Grid, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Card, CardContent, CardActions } from '@mui/material';
import { AuthContext } from '../lib/AuthContext';
import BookCard from '../components/BookCard';
import useApi from '../api/useApi';

const DashboardPage = () => {
  const { user, loading, setLoading, setSnackbar } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('loans');
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const api = useApi();

  const fetchUserData = async () => {
    if (!user) return;
    const response = await api.get(`/api/users/${user._id}/dashboard`);
    if (response) {
      setUserData(response);
      localStorage.setItem('user', JSON.stringify(response));
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const handlePasswordChange = async () => {
    const response = await api.patch(`/api/users/${user._id}/password`, {
      email: user.email,
      oldPassword,
      newPassword
    });
    if (response && response.success) {
      setSnackbar({ open: true, message: 'Password updated successfully!', severity: 'success' });
      setPasswordDialogOpen(false);
      setOldPassword('');
      setNewPassword('');
    }
  };

  if (loading || !userData) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>{userData.name}'s Dashboard</Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Box>
          <Button onClick={() => setActiveTab('loans')} variant={activeTab === 'loans' ? 'contained' : 'text'}>
            Borrowed Books
          </Button>
          <Button onClick={() => setActiveTab('reservations')} variant={activeTab === 'reservations' ? 'contained' : 'text'}>
            My Reservations
          </Button>
          <Button onClick={() => setActiveTab('fines')} variant={activeTab === 'fines' ? 'contained' : 'text'}>
            Fines History
          </Button>
        </Box>
        <Button onClick={() => setPasswordDialogOpen(true)} variant="outlined">
          Change Password
        </Button>
      </Box>

      {activeTab === 'loans' && (
        <Grid container spacing={2}>
          {userData.borrowedBooks.length > 0 ? (
            userData.borrowedBooks.map((loan) => (
              <Grid item xs={12} sm={6} md={4} key={loan.book}>
                <BookCard loan={loan} onUpdate={fetchUserData} />
              </Grid>
            ))
          ) : (
            <Typography variant="body1" sx={{ p: 2 }}>You have no borrowed books.</Typography>
          )}
        </Grid>
      )}

      {activeTab === 'reservations' && (
        <Grid container spacing={2}>
          {userData.reservations.length > 0 ? (
            userData.reservations.map((reservation) => (
              <Grid item xs={12} sm={6} md={4} key={reservation.book}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6">Reserved Book</Typography>
                    <Typography color="text.secondary">Book ID: {reservation.book}</Typography>
                    <Typography color="text.secondary">Reservation Date: {new Date(reservation.reservationDate).toLocaleDateString()}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" sx={{ p: 2 }}>You have no reservations.</Typography>
          )}
        </Grid>
      )}

      {activeTab === 'fines' && (
        <Grid container spacing={2}>
          {userData.finesHistory.length > 0 ? (
            userData.finesHistory.map((fine, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6">Fine</Typography>
                    <Typography color="text.secondary">Amount: ${fine.amount}</Typography>
                    <Typography color="text.secondary">Reason: {fine.reason}</Typography>
                    <Typography color="text.secondary">Date: {new Date(fine.datePaid).toLocaleDateString()}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" sx={{ p: 2 }}>You have no fines.</Typography>
          )}
        </Grid>
      )}

      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Old Password"
            type="password"
            fullWidth
            variant="standard"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            variant="standard"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
          <Button onClick={handlePasswordChange}>Change</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;
