import './App.css'
import React from 'react';
import { Todo } from './types/todo.ts' ;
import { useState, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

const App:React.FC = () => {
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
      console.error('Error saving data to localStorage:', error);
    }
  }, [todos, idCounter]);

  const handleSubmit = () => {
    if (input.trim()) {
      const newTodo: Todo = {
        id: idCounter,
        description: input.trim(),
        completed: false
      };
      setTodos(prevTodos => [...prevTodos, newTodo]);
      setIdCounter(prevId => prevId + 1);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleToggleCompletion = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleDelete = (id: number) => {
    setTodos(prevTodos => prevTodos.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-md px-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-8">
          My Todo App
        </h1>
        <div className="flex gap-2 mb-6">
          <Input
            type="text"
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter a todo..."
            className="flex-1"
            aria-label="New todo input"
          />
          <Button onClick={handleSubmit} aria-label="Add todo">
            Add Todo
          </Button>
        </div>
        <div className="space-y-3" role="list">
          {todos.map((item) => (
            <Card key={item.id} className="p-4" role="listitem">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`todo-${item.id}`}
                    checked={item.completed}
                    onCheckedChange={() => handleToggleCompletion(item.id)}
                    aria-label={`Mark ${item.description} as ${item.completed ? 'incomplete' : 'complete'}`}
                  />
                  <label
                    htmlFor={`todo-${item.id}`}
                    className={`${
                      item.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                    } text-sm flex-1 cursor-pointer`}
                  >
                    {item.description}
                  </label>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(item.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  aria-label={`Delete ${item.description}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App
