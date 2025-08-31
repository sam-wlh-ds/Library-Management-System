import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Button, Grid, CircularProgress, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { AuthContext } from '../lib/AuthContext';
import BookCard from '../components/BookCard';
import useApi from '../api/useApi';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';

const BrowseBooksPage = () => {
  const { user, loading, setLoading, setSnackbar } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [searchParams, setSearchParams] = useState({ title: '', author: '', category: '' });
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', author: '', category: '', shelves: '', availability: true, bookFile: '' });
  const api = useApi();

  const fetchBooks = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const endpoint = params.title || params.author || params.category ? `/api/books/search?${query}` : '/api/books/browse';
    const response = await api.get(endpoint);
    if (response) {
      setBooks(response);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = () => {
    fetchBooks(searchParams);
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    let sanitizedBookFile = newBook.bookFile;
    if (sanitizedBookFile && !sanitizedBookFile.startsWith('http://') && !sanitizedBookFile.startsWith('https://')) {
        sanitizedBookFile = `https://${sanitizedBookFile}`;
    }
    const response = await api.post('/api/books/add', { ...newBook, bookFile: sanitizedBookFile });
    if (response) {
      setSnackbar({ open: true, message: 'Book added successfully!', severity: 'success' });
      setIsAddingBook(false);
      setNewBook({ title: '', author: '', category: '', shelves: '', availability: true, bookFile: '' });
      fetchBooks();
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>Browse and Search Books</Typography>
      
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Search by Title"
          value={searchParams.title}
          onChange={(e) => setSearchParams({ ...searchParams, title: e.target.value })}
          sx={{ minWidth: 200 }}
        />
        <TextField
          label="Search by Author"
          value={searchParams.author}
          onChange={(e) => setSearchParams({ ...searchParams, author: e.target.value })}
          sx={{ minWidth: 200 }}
        />
        <TextField
          label="Search by Category"
          value={searchParams.category}
          onChange={(e) => setSearchParams({ ...searchParams, category: e.target.value })}
          sx={{ minWidth: 200 }}
        />
        <Button variant="contained" onClick={handleSearch} startIcon={<SearchIcon />} sx={{ height: '56px' }}>
          Search
        </Button>
        <Button variant="outlined" onClick={() => setIsAddingBook(true)} startIcon={<AddIcon />} sx={{ height: '56px' }}>
          Add Book
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={2}>
          {books.length > 0 ? (
            books.map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book._id}>
                <BookCard book={book} onUpdate={handleSearch} />
              </Grid>
            ))
          ) : (
            <Typography variant="body1" sx={{ p: 2 }}>No books found.</Typography>
          )}
        </Grid>
      )}

      <Dialog open={isAddingBook} onClose={() => setIsAddingBook(false)}>
        <DialogTitle>Add New Book</DialogTitle>
        <Box component="form" onSubmit={handleAddBook}>
        <DialogContent>
          <TextField margin="dense" label="Title" fullWidth value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} />
          <TextField margin="dense" label="Author" fullWidth value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} />
          <TextField margin="dense" label="Category" fullWidth value={newBook.category} onChange={(e) => setNewBook({ ...newBook, category: e.target.value })} />
          <TextField margin="dense" label="Shelves" fullWidth value={newBook.shelves} onChange={(e) => setNewBook({ ...newBook, shelves: e.target.value })} />
          <TextField margin="dense" label="Book File URL" fullWidth value={newBook.bookFile} onChange={(e) => setNewBook({ ...newBook, bookFile: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddingBook(false)}>Cancel</Button>
          <Button type="submit">Add Book</Button>
        </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default BrowseBooksPage;