import React, { useState } from 'react';
import { FaLink, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';

function ShortcutItem({ shortcut, onEdit, onDelete }) {
  const [faviconError, setFaviconError] = useState(false);

  const faviconUrl = `https://www.google.com/s2/favicons?domain=${shortcut.url}`;

  const handleEditClick = (e) => {
    e.preventDefault(); // Prevent default link behavior
    e.stopPropagation(); // Stop event propagation to parent link
    onEdit(shortcut);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault(); // Prevent default link behavior
    e.stopPropagation(); // Stop event propagation to parent link
    onDelete(shortcut.id);
  };

  return (
    <Card sx={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <a href={shortcut.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
          {faviconError ? (
            <FaLink size={40} style={{ marginBottom: '1rem', color: '#1976d2' }} />
          ) : (
            <img
              src={faviconUrl}
              alt="Favicon"
              style={{ width: '40px', height: '40px', marginBottom: '1rem' }}
              onError={() => setFaviconError(true)}
            />
          )}
          <Typography variant="h6" component="div" sx={{ mb: 1, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
            {shortcut.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
            {shortcut.url}
          </Typography>
        </CardContent>
      </a>
      <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
        <IconButton size="small" onClick={handleEditClick} sx={{ mr: 0.5 }}>
          <FaEdit fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={handleDeleteClick} color="error">
          <FaTrashAlt fontSize="small" />
        </IconButton>
      </Box>
    </Card>
  );
}

export default ShortcutItem;