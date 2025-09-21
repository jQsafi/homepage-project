import React from 'react';
import ShortcutItem from './ShortcutItem';
import { List } from '@mui/material';

function ShortcutList({ shortcuts, onEdit, onDelete }) {
  return (
    <List>
      {shortcuts.map(shortcut => (
        <ShortcutItem
          key={shortcut.id}
          shortcut={shortcut}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </List>
  );
}

export default ShortcutList;
