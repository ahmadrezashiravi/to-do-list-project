// src/components/TodoList.tsx

import { useEffect, useState } from 'react';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  
  useEffect(() => {
    const fetchTodos = async () => {
      const res = await fetch('/api/todos');
      const data = await res.json();
      setTodos(data);
    };
    fetchTodos();
  }, []);

  return (
    <div>
      <h2>My To-Do List</h2>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.title} - {todo.completed ? 'Completed' : 'Not Completed'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
