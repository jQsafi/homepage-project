import React from 'react';
import ShortcutItem from './ShortcutItem';
import { Grid, Card, CardContent, Typography, IconButton } from '@mui/material';
import { FaPlus } from 'react-icons/fa';

function ShortcutList({ shortcuts, onEdit, onDelete, onShowAddModal }) {
  return (
    <Grid container spacing={3}>
      {shortcuts.map(shortcut => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={shortcut.id}>
          <ShortcutItem
            shortcut={shortcut}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </Grid>
      ))}
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: '2px dashed grey',
            '&:hover': { borderColor: 'primary.main' },
          }}
          onClick={onShowAddModal}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <IconButton color="primary" size="large">
              <FaPlus size={50} />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ mt: 1 }}>
              Add Shortcut
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default ShortcutList;
