import React, { useState, useEffect, useCallback } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage';
import ShortcutList from './ShortcutList';
import ShortcutForm from './ShortcutForm';
import NotePanel from './NotePanel'; // Import NotePanel
import { Container, Box, Typography, Card, CardContent, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Grid, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function HomePage() {
  const [shortcuts, setShortcuts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingToPlaceholderIndex, setAddingToPlaceholderIndex] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [searchQuery, setSearchQuery] = useState('');

  const handleGoogleSearch = () => {
    if (searchQuery.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
      setSearchQuery(''); // Clear search query after search
    }
  };

  useEffect(() => {
    const storedShortcuts = loadFromLocalStorage('shortcuts', []);
    if (storedShortcuts.length === 0) {
      const defaultShortcuts = [
        { id: 1, name: 'Google', value: 'https://www.google.com', type: 'url' },
        { id: 2, name: 'YouTube', value: 'https://www.youtube.com', type: 'url' },
        { id: 3, name: 'Facebook', value: 'https://www.facebook.com', type: 'url' },
        { id: 4, name: 'Wikipedia', value: 'https://www.wikipedia.org', type: 'url' },
        { id: 5, name: 'Amazon', value: 'https://www.amazon.com', type: 'url' },
        { id: 6, name: 'X (Twitter)', value: 'https://twitter.com', type: 'url' },
        { id: 7, name: 'Instagram', value: 'https://www.instagram.com', type: 'url' },
        { id: 8, name: 'LinkedIn', value: 'https://www.linkedin.com', type: 'url' },
        { id: 9, name: 'Reddit', value: 'https://www.reddit.com', type: 'url' },
        { id: 10, name: 'Netflix', value: 'https://www.netflix.com', type: 'url' },
        { id: 11, name: 'Microsoft', value: 'https://www.microsoft.com', type: 'url' },
        { id: 12, name: 'Apple', value: 'https://www.apple.com', type: 'url' },
        { id: 13, name: 'Eisenhower Matrix', content: 'Prioritize tasks by urgency and importance.', type: 'note' },
        { id: 14, name: 'Pomodoro Technique', content: 'Work in focused 25-minute intervals with short breaks.', type: 'note' },
        { id: 15, name: 'Minimize Distractions', content: 'Turn off notifications on phone and computer.', type: 'note' },
        { id: 16, name: 'Single-tasking', content: 'Focus on one task at a time instead of multitasking.', type: 'note' },
        { id: 17, name: 'Plan Day in Advance', content: 'Create a to-do list for the next day.', type: 'note' },
      ];
      setShortcuts(defaultShortcuts);
    } else {
      setShortcuts(storedShortcuts);
    }
  }, []);

  useEffect(() => {
    saveToLocalStorage('shortcuts', shortcuts);
  }, [shortcuts]);

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

  const handleAddShortcut = (newShortcut, index = null) => {
    setShortcuts(prevShortcuts => {
      const shortcutWithId = { id: Date.now(), ...newShortcut };
      if (index !== null && index >= 0 && index <= prevShortcuts.length) {
        const newShortcuts = [...prevShortcuts];
        newShortcuts.splice(index, 0, shortcutWithId);
        return newShortcuts;
      } else {
        return [...prevShortcuts, shortcutWithId];
      }
    });
    setShowAddModal(false);
    setAddingToPlaceholderIndex(null);
    showSnackbar('Shortcut added successfully!', 'success');
  };

  const handleShortcutsReorder = (reorderedShortcuts, type) => {
    setShortcuts(prevShortcuts => {
      // Filter out the old shortcuts of this type
      const otherShortcuts = prevShortcuts.filter(s => s.type !== type);
      // Combine with the newly reordered shortcuts of this type
      const newShortcuts = [...otherShortcuts, ...reorderedShortcuts];
      return newShortcuts;
    });
  };

  const handleShowAddModal = (index = null) => {
    setShowAddModal(true);
    setAddingToPlaceholderIndex(index);
  };
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setAddingToPlaceholderIndex(null);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey) { // Ctrl or Cmd key
        switch (event.key) {
          case 'a':
            event.preventDefault();
            handleShowAddModal();
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
  }, [shortcuts, handleShowAddModal]);

  const urlShortcuts = shortcuts.filter(s => s.type === 'url');
  const callShortcuts = shortcuts.filter(s => s.type === 'call');
  const mailShortcuts = shortcuts.filter(s => s.type === 'mail');
  const noteShortcuts = shortcuts.filter(s => s.type === 'note');

  return (
    <Container maxWidth="lg" sx={{ mt: 5, p: 2, position: 'relative' }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Your Personalized Homepage
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          label="Search Google..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleGoogleSearch();
            }
          }}
        />
      </Box>

      

      {urlShortcuts.length > 0 && (
        <Card sx={{ mb: 4, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              URLs
            </Typography>
            <ShortcutList
              shortcuts={urlShortcuts}
              onShortcutsReorder={handleShortcutsReorder}
              type="url"
              onShowAddModal={handleShowAddModal}
              totalShortcutsCount={shortcuts.length}
            />
          </CardContent>
        </Card>
      )}

      {noteShortcuts.length > 0 && (
        <Card sx={{ mb: 4, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Notes
            </Typography>
            <NotePanel // Use NotePanel for notes
              notes={noteShortcuts}
            />
          </CardContent>
        </Card>
      )}

      {callShortcuts.length > 0 && (
        <Card sx={{ mb: 4, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Call Shortcuts
            </Typography>
            <ShortcutList
              shortcuts={callShortcuts}
              onShortcutsReorder={handleShortcutsReorder}
              type="call"
              onShowAddModal={handleShowAddModal}
              totalShortcutsCount={shortcuts.length}
            />
          </CardContent>
        </Card>
      )}

      {mailShortcuts.length > 0 && (
        <Card sx={{ mb: 4, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Mail Shortcuts
            </Typography>
            <ShortcutList
              shortcuts={mailShortcuts}
              onShortcutsReorder={handleShortcutsReorder}
              type="mail"
              onShowAddModal={handleShowAddModal}
              totalShortcutsCount={shortcuts.length}
            />
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Shortcut Modal */}
      <Dialog open={showAddModal} onClose={handleCloseAddModal}>
        <DialogTitle>Add New Shortcut</DialogTitle>
        <DialogContent>
          <ShortcutForm
            onAddShortcut={handleAddShortcut}
            placeholderIndex={addingToPlaceholderIndex}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddModal}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Fab color="primary" aria-label="add" sx={{ position: 'absolute', top: 16, right: 16 }} onClick={handleShowAddModal}>
        <AddIcon />
      </Fab>
    </Container>
  );
}

export default HomePage;