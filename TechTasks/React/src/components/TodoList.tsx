// Task Description:
// Create a React component using TypeScript that implements a simple Todo List.

// The component should have the following functionality:

// Display a list of todos: Each todo item should display its text and a checkbox to mark it as completed.
// Add a new todo: Provide an input field and a button to add a new todo item to the list.
// Toggle todo completion: Clicking the checkbox of a todo item should toggle its completion status.
// Delete a todo: Each todo item should have a "Delete" button to remove it from the list.

// Requirements:

// Use React with TypeScript.
// Maintain the todo list in the component's state.
// Each todo item should have an id (use a simple incrementing number or UUID), text (string), and completed (boolean) properties.
// Ensure the input field clears after adding a todo.
// The solution should be functional within a 15-minute timeframe.

// Instructions:

// Write the code for the TodoList component in a single file.
// Assume you have React and TypeScript already set up (no need for imports or setup code outside the component).

import { useCallback, useState, useRef, type RefObject } from "react";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoItemProps extends TodoItem {
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem = ({
  id,
  text,
  completed,
  onToggle,
  onDelete,
}: TodoItemProps) => {
  return (
    <div>
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(id)}
      />
      <span style={{ textDecoration: completed ? "line-through" : "none" }}>
        {text}
      </span>
      <button onClick={() => onDelete(id)}>Delete</button>
    </div>
  );
};

export const TodoList = () => {
  const inputRef = useRef<RefObject<HTMLInputElement>>(null);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const nextId = useRef(1);

  const handleToggle = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todoItem) => {
        if (todoItem.id === id) {
          return {
            ...todoItem,
            completed: !todoItem.completed,
          };
        }
        return todoItem;
      })
    );
  }, []);

  const handleDelete = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todoItem) => todoItem.id !== id));
  }, []);

  const handleAddTodoItem = () => {
    const text = inputRef.current?.value?.trim();

    if (!text) {
      return;
    }

    setTodos((prev) => [
      ...prev,
      {
        id: `${nextId.current++}`,
        text,
        completed: false,
      },
    ]);

    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <>
      <section>
        <input ref={inputRef} type="text" />
        <button onClick={handleAddTodoItem}>Add</button>
      </section>
      <ul>
        {todos.map((todoItem: TodoItem) => (
          <li key={todoItem.id}>
            <TodoItem
              {...todoItem}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          </li>
        ))}
      </ul>
    </>
  );
};
