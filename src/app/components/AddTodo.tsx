// src/components/AddTodo.tsx

import { useState } from 'react';

const AddTodo = () => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const res = await fetch('/api/todos/create', {
      method: 'POST',
      body: JSON.stringify({ title }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      setTitle('');
      // به‌روزرسانی لیست پس از اضافه کردن
    } else {
      alert('Failed to add todo');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New To-Do"
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default AddTodo;
