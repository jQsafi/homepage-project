import React, { useState, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';

function ShortcutForm({ onAddShortcut, editingShortcut, onUpdateShortcut, onCancelEdit }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (editingShortcut) {
      setName(editingShortcut.name);
      setUrl(editingShortcut.url);
    } else {
      setName('');
      setUrl('');
    }
  }, [editingShortcut]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url) return; // URL is mandatory

    const finalName = name.trim() === '' ? url : name; // Use URL as name if name is empty

    if (editingShortcut) {
      onUpdateShortcut({ ...editingShortcut, name: finalName, url });
    } else {
      onAddShortcut({ name: finalName, url });
    }
    setName('');
    setUrl('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Google (defaults to URL if empty)"
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="URL"
        variant="outlined"
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="e.g., https://www.google.com"
        required
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained" color="success" sx={{ mr: 1 }}>
        {editingShortcut ? 'Update Shortcut' : 'Add Shortcut'}
      </Button>
      {editingShortcut && (
        <Button type="button" variant="outlined" onClick={onCancelEdit}>
          Cancel
        </Button>
      )}
    </Box>
  );
}

export default ShortcutForm;
