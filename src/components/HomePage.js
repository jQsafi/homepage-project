import React, { useState, useEffect, useCallback } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage';
import ShortcutList from './ShortcutList';
import ShortcutForm from './ShortcutForm';
import NotePanel from './NotePanel'; // Import NotePanel
import { Container, Box, Typography, Card, CardContent, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Grid } from '@mui/material';

function HomePage() {
  const [shortcuts, setShortcuts] = useState([]);
  const [editingShortcut, setEditingShortcut] = useState(null);
  const [defaultPage, setDefaultPage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [shortcutToDelete, setShortcutToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    setShortcuts(loadFromLocalStorage('shortcuts', []));
    setDefaultPage(loadFromLocalStorage('defaultPage', 'https://www.google.com'));
  }, []);

  useEffect(() => {
    saveToLocalStorage('shortcuts', shortcuts);
  }, [shortcuts]);

  useEffect(() => {
    saveToLocalStorage('defaultPage', defaultPage);
  }, [defaultPage]);

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleAddShortcut = (newShortcut) => {
    setShortcuts([...shortcuts, { id: Date.now(), ...newShortcut }]);
    setShowAddModal(false);
    showSnackbar('Shortcut added successfully!', 'success');
  };

  const handleUpdateShortcut = (updatedShortcut) => {
    setShortcuts(shortcuts.map(s => (s.id === updatedShortcut.id ? updatedShortcut : s)));
    setEditingShortcut(null);
    setShowAddModal(false);
    showSnackbar('Shortcut updated successfully!', 'success');
  };

  const handleDeleteShortcut = (id) => {
    setShortcutToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDeleteShortcut = () => {
    setShortcuts(shortcuts.filter(s => s.id !== shortcutToDelete));
    setShowConfirmModal(false);
    setShortcutToDelete(null);
    showSnackbar('Shortcut deleted successfully!', 'success');
  };

  const cancelDeleteShortcut = () => {
    setShowConfirmModal(false);
    setShortcutToDelete(null);
  };

  const handleEditShortcut = (shortcut) => {
    setEditingShortcut(shortcut);
    setShowAddModal(true);
  };

  const handleCancelEdit = () => {
    setEditingShortcut(null);
    setShowAddModal(false);
  };

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setEditingShortcut(null);
  };

  const handleGoToDefault = useCallback(() => {
    if (defaultPage) {
      window.open(defaultPage, '_self');
    } else {
      showSnackbar('Please set a default page URL first.', 'warning');
    }
  }, [defaultPage]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey) { // Ctrl or Cmd key
        switch (event.key) {
          case 'a':
            event.preventDefault();
            handleShowAddModal();
            break;
          case 'd':
            event.preventDefault();
            handleGoToDefault();
            break;
          case '1':
          case '2':
          case '3':
          case '4':
          case '5':
          case '6':
          case '7':
          case '8':
          case '9':
            event.preventDefault();
            const index = parseInt(event.key, 10) - 1;
            // Find the shortcut by its original index in the combined list
            const allShortcuts = [...shortcuts]; // Create a copy to avoid direct state mutation
            if (allShortcuts[index] && allShortcuts[index].value) {
              window.open(allShortcuts[index].value, '_blank');
            }
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts, handleGoToDefault, handleShowAddModal]);

  const urlShortcuts = shortcuts.filter(s => s.type === 'url');
  const callShortcuts = shortcuts.filter(s => s.type === 'call');
  const mailShortcuts = shortcuts.filter(s => s.type === 'mail');
  const noteShortcuts = shortcuts.filter(s => s.type === 'note');

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Your Personalized Homepage
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Default Page
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              label="Set your default page URL"
              variant="outlined"
              value={defaultPage}
              onChange={(e) => setDefaultPage(e.target.value)}
              sx={{ flexGrow: 1 }}
            />
            <Button variant="contained" onClick={handleGoToDefault}>
              Go to Default
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Add Shortcut Button */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Add New Shortcut
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" onClick={handleShowAddModal} sx={{ p: 3, fontSize: '1.2rem' }}>
              Add New Shortcut
            </Button>
          </Box>
        </CardContent>
      </Card>

      {urlShortcuts.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              URLs
            </Typography>
            <ShortcutList
              shortcuts={urlShortcuts}
              onEdit={handleEditShortcut}
              onDelete={handleDeleteShortcut}
            />
          </CardContent>
        </Card>
      )}

      {callShortcuts.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Call Shortcuts
            </Typography>
            <ShortcutList
              shortcuts={callShortcuts}
              onEdit={handleEditShortcut}
              onDelete={handleDeleteShortcut}
            />
          </CardContent>
        </Card>
      )}

      {mailShortcuts.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Mail Shortcuts
            </Typography>
            <ShortcutList
              shortcuts={mailShortcuts}
              onEdit={handleEditShortcut}
              onDelete={handleDeleteShortcut}
            />
          </CardContent>
        </Card>
      )}

      {noteShortcuts.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Notes
            </Typography>
            <NotePanel // Use NotePanel for notes
              notes={noteShortcuts}
              onEdit={handleEditShortcut}
              onDelete={handleDeleteShortcut}
            />
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Shortcut Modal */}
      <Dialog open={showAddModal} onClose={handleCloseAddModal}>
        <DialogTitle>{editingShortcut ? 'Edit Shortcut' : 'Add New Shortcut'}</DialogTitle>
        <DialogContent>
          <ShortcutForm
            onAddShortcut={handleAddShortcut}
            editingShortcut={editingShortcut}
            onUpdateShortcut={handleUpdateShortcut}
            onCancelEdit={handleCancelEdit}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddModal}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Modal for Deletion */}
      <Dialog open={showConfirmModal} onClose={cancelDeleteShortcut}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this shortcut?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteShortcut}>Cancel</Button>
          <Button onClick={confirmDeleteShortcut} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default HomePage;