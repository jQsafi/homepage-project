import React, { useState, useEffect } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage';
import ShortcutList from './ShortcutList';
import ShortcutForm from './ShortcutForm';
import { Container, Box, Typography, Card, CardContent, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

function HomePage() {
  const [shortcuts, setShortcuts] = useState([]);
  const [editingShortcut, setEditingShortcut] = useState(null);
  const [defaultPage, setDefaultPage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [shortcutToDelete, setShortcutToDelete] = useState(null);

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

  const handleAddShortcut = (newShortcut) => {
    setShortcuts([...shortcuts, { id: Date.now(), ...newShortcut }]);
    setShowAddModal(false); // Close modal after adding
  };

  const handleUpdateShortcut = (updatedShortcut) => {
    setShortcuts(shortcuts.map(s => (s.id === updatedShortcut.id ? updatedShortcut : s)));
    setEditingShortcut(null);
    setShowAddModal(false); // Close modal after updating
  };

  const handleDeleteShortcut = (id) => {
    setShortcutToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDeleteShortcut = () => {
    setShortcuts(shortcuts.filter(s => s.id !== shortcutToDelete));
    setShowConfirmModal(false);
    setShortcutToDelete(null);
  };

  const cancelDeleteShortcut = () => {
    setShowConfirmModal(false);
    setShortcutToDelete(null);
  };

  const handleEditShortcut = (shortcut) => {
    setEditingShortcut(shortcut);
    setShowAddModal(true); // Open modal for editing
  };

  const handleCancelEdit = () => {
    setEditingShortcut(null);
    setShowAddModal(false); // Close modal on cancel
  };

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setEditingShortcut(null); // Clear editing state when modal closes
  };

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
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Set your default page URL"
              variant="outlined"
              value={defaultPage}
              onChange={(e) => setDefaultPage(e.target.value)}
            />
            <Button variant="contained" onClick={() => window.open(defaultPage, '_self')}>
              Go to Default
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Your Shortcuts
          </Typography>
          {shortcuts.length === 0 ? (
            <Typography align="center" sx={{ mt: 2 }}>No shortcuts yet. Click the '+' to add some!</Typography>
          ) : null}
          <ShortcutList
            shortcuts={shortcuts}
            onEdit={handleEditShortcut}
            onDelete={handleDeleteShortcut}
            onShowAddModal={handleShowAddModal}
          />
        </CardContent>
      </Card>

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
    </Container>
  );
}

export default HomePage;
