import React, { useState } from 'react';
import { FaLink, FaPhone, FaEnvelope, FaStickyNote } from 'react-icons/fa';
import { ListItem, ListItemIcon, ListItemText, Box, Typography } from '@mui/material';

function ShortcutItem({ shortcut, setNodeRef, style, attributes, listeners, isDragging }) {
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
            style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid #e0e0e0' }}
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
        maxHeight: 100, // Max height for the tile
        p: 1, // Add internal padding
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': { transform: 'scale(1.05)', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' },
      }}
      onClick={(e) => { if (isDragging) { e.preventDefault(); e.stopPropagation(); return; } if (shortcut.type === 'note') { e.preventDefault(); /* Handle note click */ } }}
    >
      <Box ref={setNodeRef} style={style} {...attributes} {...listeners} sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, cursor: 'grab' }}>
        <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
        {getIcon()}
      </ListItemIcon>
      <ListItemText
        primary={<Typography variant="h6" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{shortcut.name}</Typography>}
        secondary={shortcut.type === 'note' ? (
          <Typography variant="body2" color="text.secondary">
            {shortcut.content}
          </Typography>
        ) : null}
      />
      </Box>
    </ListItem>
  );
}

export default ShortcutItem;
