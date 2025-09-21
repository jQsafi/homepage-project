import React, { useState, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';

// Function to detect shortcut type based on input string
const detectShortcutType = (input) => {
  input = input.trim();

  // Email (mailto: or user@domain.com)
  if (/^mailto:|^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,6}$/.test(input)) {
    return 'mail';
  }

  // Call (tel: or common phone number patterns)
  if (/^tel:|^\+?\d[\d\s\-()]{7,}\d$/.test(input)) {
    return 'call';
  }

  // URL (http(s)://, ftp://, www., or domain.tld)
  if (/^(https?:\/\/|ftp:\/\/|www\.|[a-zA-Z0-9-]+\.[a-zA-Z]{2,6})/.test(input)) {
    return 'url';
  }

  // Default to note if no other type matches
  return 'note';
};

function ShortcutForm({ onAddShortcut, editingShortcut, onUpdateShortcut, onCancelEdit }) {
  const [name, setName] = useState('');
  const [mainInput, setMainInput] = useState(''); // Single input for value/content

  useEffect(() => {
    if (editingShortcut) {
      setName(editingShortcut.name);
      // Set mainInput based on type
      if (editingShortcut.type === 'note') {
        setMainInput(editingShortcut.content || '');
      } else {
        setMainInput(editingShortcut.value || '');
      }
    } else {
      setName('');
      setMainInput('');
    }
  }, [editingShortcut]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mainInput.trim()) return; // Main input is mandatory

    const detectedType = detectShortcutType(mainInput);
    let newShortcut = { name };

    if (detectedType === 'note') {
      newShortcut.content = mainInput;
    } else {
      newShortcut.value = mainInput;
    }
    newShortcut.type = detectedType;

    const finalName = name.trim() === '' ? mainInput : name; // Use mainInput as name if name is empty
    newShortcut.name = finalName;

    if (editingShortcut) {
      onUpdateShortcut({ ...editingShortcut, ...newShortcut });
    } else {
      onAddShortcut({ id: Date.now(), ...newShortcut }); // Add id here for new shortcuts
    }
    setName('');
    setMainInput('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Google (defaults to input if empty)"
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Enter URL, Phone, Email, or Note"
        variant="outlined"
        value={mainInput}
        onChange={(e) => setMainInput(e.target.value)}
        placeholder="e.g., https://www.google.com, tel:+1234567890, user@example.com, My important note"
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
