import React, { useState } from 'react';
import { FaLink, FaEdit, FaTrashAlt, FaPhone, FaEnvelope, FaStickyNote } from 'react-icons/fa';
import { ListItem, ListItemIcon, ListItemText, IconButton, Box, Typography } from '@mui/material';

function ShortcutItem({ shortcut, onEdit, onDelete }) {
  const [faviconError, setFaviconError] = useState(false);

  const getIcon = () => {
    switch (shortcut.type) {
      case 'call':
        return <FaPhone />;
      case 'mail':
        return <FaEnvelope />;
      case 'note':
        return <FaStickyNote />;
      case 'url':
      default:
        return faviconError ? (
          <FaLink />
        ) : (
          <img
            src={`https://www.google.com/s2/favicons?domain=${shortcut.value}`}
            alt="Favicon"
            style={{ width: '24px', height: '24px' }}
            onError={() => setFaviconError(true)}
          />
        );
    }
  };

  const getHref = () => {
    switch (shortcut.type) {
      case 'call':
        return `tel:${shortcut.value}`;
      case 'mail':
        return `mailto:${shortcut.value}`;
      case 'url':
        return shortcut.value;
      case 'note':
      default:
        return '#'; // Notes are not external links
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation(); // Stop event propagation
    onEdit(shortcut);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Stop event propagation
    onDelete(shortcut.id);
  };

  return (
    <ListItem
      button
      component="a"
      href={getHref()}
      target={shortcut.type === 'url' ? "_blank" : "_self"}
      rel={shortcut.type === 'url' ? "noopener noreferrer" : ""}
      sx={{
        mb: 1,
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        '&:hover': { backgroundColor: '#f5f5f5' },
        position: 'relative',
        pr: '90px', // Space for buttons
      }}
      onClick={(e) => { if (shortcut.type === 'note') { e.preventDefault(); /* Handle note click */ } }}
    >
      <ListItemIcon>
        {getIcon()}
      </ListItemIcon>
      <ListItemText
        primary={<Typography variant="h6">{shortcut.name}</Typography>}
        secondary={shortcut.type === 'note' ? (
          <Typography variant="body2" color="text.secondary">
            {shortcut.content}
          </Typography>
        ) : null}
      />
      <Box sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
        <IconButton size="small" onClick={handleEditClick} sx={{ mr: 0.5 }}>
          <FaEdit fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={handleDeleteClick} color="error">
          <FaTrashAlt fontSize="small" />
        </IconButton>
      </Box>
    </ListItem>
  );
}

export default ShortcutItem;
