import React, { useEffect, useState } from "react";

// Simple Todo component (single-file) using Tailwind CSS
// Usage: place this file in src/components/TodoApp.jsx and import <TodoApp /> into your app.

export default function TodoApp() {
  const [todos, setTodos] = useState(() => {
    try {
      const raw = localStorage.getItem("todos-v1");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    localStorage.setItem("todos-v1", JSON.stringify(todos));
  }, [todos]);

  function addTodo(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    const newTodo = {
      id: Date.now().toString(),
      text: trimmed,
      completed: false,
    };
    setTodos((t) => [newTodo, ...t]);
    setText("");
  }

  function toggle(id) {
    setTodos((t) => t.map((x) => (x.id === id ? { ...x, completed: !x.completed } : x)));
  }

  function remove(id) {
    setTodos((t) => t.filter((x) => x.id !== id));
  }

  function startEdit(todo) {
    setEditingId(todo.id);
    setEditingText(todo.text);
  }

  function saveEdit(e) {
    e.preventDefault();
    const trimmed = editingText.trim();
    if (!trimmed) return;
    setTodos((t) => t.map((x) => (x.id === editingId ? { ...x, text: trimmed } : x)));
    setEditingId(null);
    setEditingText("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingText("");
  }

  function clearCompleted() {
    setTodos((t) => t.filter((x) => !x.completed));
  }

  const visible = todos.filter((t) => {
    if (filter === "all") return true;
    if (filter === "active") return !t.completed;
    return t.completed;
  });

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Todo</h1>

      <form onSubmit={addTodo} className="flex gap-2">
        <input
          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="Add a new task"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-60"
          disabled={!text.trim()}
        >
          Add
        </button>
      </form>

      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-md ${filter === "all" ? "bg-indigo-600 text-white" : "bg-gray-100"}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`px-3 py-1 rounded-md ${filter === "active" ? "bg-indigo-600 text-white" : "bg-gray-100"}`}
            onClick={() => setFilter("active")}
          >
            Active
          </button>
          <button
            className={`px-3 py-1 rounded-md ${filter === "completed" ? "bg-indigo-600 text-white" : "bg-gray-100"}`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>

        <div className="text-sm text-gray-600">{todos.length} total</div>
      </div>

      <ul className="mt-4 space-y-2">
        {visible.length === 0 && (
          <li className="text-sm text-gray-500 italic">No todos — add something!</li>
        )}

        {visible.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 border border-gray-100"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggle(todo.id)}
              className="w-5 h-5 rounded"
              aria-label={`Mark ${todo.text} as ${todo.completed ? "incomplete" : "complete"}`}
            />

            {editingId === todo.id ? (
              <form onSubmit={saveEdit} className="flex-1 flex gap-2 items-center">
                <input
                  className="flex-1 px-3 py-2 rounded-md border border-gray-200"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <div className="flex gap-2">
                  <button type="submit" className="px-3 py-1 rounded-md bg-green-500 text-white">Save</button>
                  <button type="button" onClick={cancelEdit} className="px-3 py-1 rounded-md bg-gray-200">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex-1">
                  <div className={`select-none ${todo.completed ? "line-through text-gray-400" : "text-gray-800"}`}>{todo.text}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(todo)}
                    className="px-2 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(todo.id)}
                    className="px-2 py-1 text-sm rounded-md bg-red-100 hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={clearCompleted}
          className="px-3 py-1 rounded-md bg-red-50 text-red-700 hover:bg-red-100"
        >
          Clear completed
        </button>

        <div className="text-sm text-gray-600">{todos.filter((t) => !t.completed).length} left</div>
      </div>
    </div>
  );
}
