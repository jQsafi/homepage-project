import React from 'react';
import ShortcutItem from './ShortcutItem';
import { Grid, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDndContext,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function ShortcutList({ shortcuts, onShortcutsReorder, type, onShowAddModal, totalShortcutsCount }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { active } = useDndContext();
  const isDragging = !!active;

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = shortcuts.findIndex(shortcut => shortcut.id === active.id);
      const newIndex = shortcuts.findIndex(shortcut => shortcut.id === over.id);
      const newOrder = arrayMove(shortcuts, oldIndex, newIndex);
      onShortcutsReorder(newOrder, type);
    }
  };

  const numPlaceholders = shortcuts.length < 36 ? 1 : 0;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={shortcuts.map(shortcut => shortcut.id)}
      >
        <Grid container spacing={2}>
          {shortcuts.map(shortcut => (
            <Grid item xs={12} sm={6} md={3} lg={1} key={shortcut.id}>
              <SortableShortcutItem
                shortcut={shortcut}
                isDragging={isDragging}
              />
            </Grid>
          ))}
          {numPlaceholders > 0 && (
            <Grid item xs={12} sm={6} md={3} lg={1} key={`placeholder-0`}>
              <Box
                sx={{
                  maxHeight: 100, // Max height for the placeholder
                  border: '2px dashed #ccc',
                  borderRadius: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ccc',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
                  mb: 1, // Match ShortcutItem margin-bottom
                  p: 0, // Remove default padding
                }}
                onClick={() => onShowAddModal(totalShortcutsCount)}
              >
                <AddIcon sx={{ fontSize: 40 }} />
              </Box>
            </Grid>
          )}
        </Grid>
      </SortableContext>
    </DndContext>
  );
}

function SortableShortcutItem({ shortcut, isDragging }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: shortcut.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <ShortcutItem
      shortcut={shortcut}
      setNodeRef={setNodeRef}
      style={style}
      attributes={attributes}
      listeners={listeners}
      isDragging={isDragging}
    />
  );
}

export default ShortcutList;