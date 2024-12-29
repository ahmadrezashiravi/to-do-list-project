'use client';

import { useState } from 'react';
import { TextField, Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function CreateTodo() {
  // State to manage the title of the todo
  const [title, setTitle] = useState('');
  
  // State to manage the loading state during the API request
  const [loading, setLoading] = useState(false);

  // Function to handle todo creation on form submit
  const createTodo = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the form from reloading the page

    // Validate if title is provided
    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    // Set loading state to true to show loading spinner
    setLoading(true);
    try {
      // Send POST request to the API to create the todo
      const response = await axios.post('/api/todo/create', {
        title,
      });

      // Check if the request was successful
      if (response.status === 201) {
        toast.success('Todo deleted successfully');
        setTitle(''); // Reset the title input field after success
      }
    } catch (error) {
      // Log the error and show an alert if the request fails
      alert('Failed to Create todo');
    } finally {
      // Set loading state to false after the request is completed
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '16px' }}>
      <h1>Create Todo</h1>
      <form onSubmit={createTodo}>
        {/* Input field for the todo title */}
        <TextField
          label="Todo Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
        />
        {/* Submit button that shows a loading spinner while the request is in progress */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading} // Disable the button if loading
          style={{ marginTop: '16px' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Todo'}
        </Button>
      </form>
    </div>
  );
}
