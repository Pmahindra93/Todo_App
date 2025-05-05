import './App.css'
import React from 'react';
import { Todo } from './types/todo.ts' ;
import { useState, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { TaskSuggestion } from "@/components/TaskSuggestion";
import { TaskMeme } from "@/components/TaskMeme";

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [input, setInput] = useState<string>('');
  const [idCounter, setIdCounter] = useState<number>(() => {
    const savedCounter = localStorage.getItem('idCounter');
    return savedCounter ? JSON.parse(savedCounter) : 0;
  });

  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos));
      localStorage.setItem('idCounter', JSON.stringify(idCounter));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [todos, idCounter]);

  const addTodo = () => {
    if (input.trim() === '') return;
    
    const newTodo: Todo = {
      id: idCounter,
      description: input,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setTodos([...todos, newTodo]);
    setIdCounter(idCounter + 1);
    setInput('');
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">My Todo App</h1>
      
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Add a new task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow"
        />
        <Button onClick={addTodo}>Add</Button>
      </div>
      
      <div className="space-y-3">
        {todos.map(todo => (
          <TaskSuggestion key={todo.id} task={todo.description}>
            <Card className="p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                  className="mt-1"
                />
                <div className="flex-grow">
                  <p className={`${todo.completed ? 'line-through text-gray-500' : ''}`}>
                    {todo.description}
                  </p>
                  <TaskMeme task={todo.description} />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTodo(todo.id)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </TaskSuggestion>
        ))}
        
        {todos.length === 0 && (
          <div className="text-center text-gray-500 p-4">
            No tasks yet. Add one above!
          </div>
        )}
      </div>
    </div>
  );
};

export default App;