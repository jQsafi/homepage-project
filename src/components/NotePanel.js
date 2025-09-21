import React from 'react';
import { Card, CardContent, Typography, IconButton, Box, Grid } from '@mui/material';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

// Predefined palette of light colors for notes
const noteColors = [
  '#fff3e0', // Light Orange
  '#e0f2f7', // Light Blue
  '#e8f5e9', // Light Green
  '#fce4ec', // Light Pink
  '#ede7f6', // Light Purple
  '#fffde7', // Light Yellow
];

function NotePanel({ notes, onEdit, onDelete }) {
  return (
    <Grid container spacing={2}>
      {notes.map((note, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={note.id}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: 3,
              borderRadius: '8px',
              '&:hover': { boxShadow: 6 },
              backgroundColor: noteColors[index % noteColors.length], // Assign color based on index
            }}
          >
            <CardContent sx={{ flexGrow: 1, p: 2 }}>
              <Typography
                variant="subtitle1"
                component="div"
                sx={{
                  fontWeight: 'bold',
                  pb: 1, // Padding bottom for the border
                  mb: 1, // Margin bottom for spacing
                  borderBottom: '1px solid rgba(0, 0, 0, 0.12)', // Thin border
                }}
              >
                {note.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                {note.content}
              </Typography>
            </CardContent>
            <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEdit(note); }} sx={{ mr: 0.5 }}>
                <FaEdit fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDelete(note.id); }} color="error">
                <FaTrashAlt fontSize="small" />
              </IconButton>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default NotePanel;
