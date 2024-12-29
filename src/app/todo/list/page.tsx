'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, CircularProgress, Grid, IconButton, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function TodoList() {
  const [todos, setTodos] = useState<any[]>([]);  // State to store todos
  const [loading, setLoading] = useState(true);  // State to manage loading state
  const [open, setOpen] = useState(false);  // State to control the edit dialog
  const [currentTodo, setCurrentTodo] = useState<any>(null);  // State to store the current Todo being edited
  const [newTitle, setNewTitle] = useState('');  // State for the new title input

  // Fetch todos on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get('/api/todo/list');
        setTodos(response.data);  // Set the fetched todos in state
      } catch (error) {
        console.error('Error fetching todos:', error);
      } finally {
        setLoading(false);  // Set loading state to false after data is fetched
      }
    };

    fetchTodos();  // Call fetchTodos when the component mounts
  }, []);

  // Handle Todo deletion
  const deleteTodo = async (id: string) => {
    try {
      const response = await axios.delete('/api/todo/delete', {
        data: { id },
      });

      if (response.status === 200) {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
        toast.success('Todo deleted successfully');
      }
    } catch (error) {
        toast.error('Failed to delete todo'); 
    }
  };

  // Handle opening the edit dialog
  const handleEditOpen = (todo: any) => {
    setCurrentTodo(todo);
    setNewTitle(todo.title);
    setOpen(true);
  };

  // Handle closing the edit dialog
  const handleEditClose = () => {
    setOpen(false);
    setCurrentTodo(null);
    setNewTitle('');
  };

  // Handle Todo update
  const updateTodo = async () => {
    if (!newTitle.trim()) {
      alert('Title is required');
      return;
    }

    try {
      const response = await axios.put('/api/todo/update', {
        id: currentTodo.id,
        title: newTitle,
      });

      if (response.status === 200) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === currentTodo.id ? { ...todo, title: newTitle } : todo
          )
        );
        toast.success('Todo deleted successfully');
        handleEditClose();
      }
    } catch (error) {
      console.error('Error updating todo:', error);
      alert('Failed to update todo');
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '16px' }}>
      <h1>Todo List</h1>

      {/* Show loading spinner while fetching todos */}
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {todos.length === 0 ? (
            <Typography variant="h6" color="textSecondary" align="center" fullWidth>
              No todos available
            </Typography>
          ) : (
            todos.map((todo) => (
              <Grid item xs={12} sm={6} md={4} key={todo.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {todo.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Created by: {todo.user?.name || 'Unknown User'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Created at: {new Date(todo.createdAt).toLocaleDateString()}
                    </Typography>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <IconButton color="primary" onClick={() => handleEditOpen(todo)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="secondary" onClick={() => deleteTodo(todo.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* Edit Todo Dialog */}
      <Dialog open={open} onClose={handleEditClose}>
        <DialogTitle>Edit Todo</DialogTitle>
        <DialogContent>
          <TextField
            label="Todo Title"
            variant="outlined"
            fullWidth
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="default">
            Cancel
          </Button>
          <Button onClick={updateTodo} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
