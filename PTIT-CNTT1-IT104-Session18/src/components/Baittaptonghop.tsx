import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useRef,
  useMemo,
  useCallback,
  createContext,
} from "react";
import ModalUpdate from "./ModalUpdate";
import ModalDelete from "./ModalDelete";

type Todo = {
  id: number;
  name: string;
  completed: boolean;
};

type Action =
  | { type: "ADD"; payload: string }
  | { type: "DELETE"; payload: number }
  | { type: "TOGGLE"; payload: number }
  | { type: "UPDATE"; payload: { id: number; name: string } };

const todoReducer = (state: Todo[], action: Action): Todo[] => {
  switch (action.type) {
    case "ADD":
      return [
        ...state,
        { id: Date.now(), name: action.payload, completed: false },
      ];
    case "DELETE":
      return state.filter((todo) => todo.id !== action.payload);
    case "TOGGLE":
      return state.map((todo) =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    case "UPDATE":
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, name: action.payload.name }
          : todo
      );
    default:
      return state;
  }
};

const TodoContext = createContext<{
  todos: Todo[];
  dispatch: React.Dispatch<Action>;
} | null>(null);

const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const [todos, dispatch] = useReducer(todoReducer, [], () => {
    const stored = localStorage.getItem("todos");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  return (
    <TodoContext.Provider value={{ todos, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
};

const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) throw new Error("useTodos must be used within TodoProvider");
  return context;
};

const Baittaptonghop = () => {
  return (
    <TodoProvider>
      <TodoApp />
    </TodoProvider>
  );
};

const TodoApp = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const [error, setError] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { todos, dispatch } = useTodos();

  const completedCount = useMemo(
    () => todos.filter((t) => t.completed).length,
    [todos]
  );

  const handleAdd = () => {
    if (!text.trim()) {
      setError(true);
      return;
    }
    dispatch({ type: "ADD", payload: text.trim() });
    setText("");
    setError(false);
  };

  const handleEditClick = (todo: Todo) => {
    setEditTodo(todo);
    setEditModalVisible(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setDeleteModalVisible(true);
  };

  const handleUpdate = (newName: string) => {
    if (editTodo) {
      dispatch({ type: "UPDATE", payload: { id: editTodo.id, name: newName } });
      setEditModalVisible(false);
      setEditTodo(null);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteId !== null) {
      dispatch({ type: "DELETE", payload: deleteId });
      setDeleteModalVisible(false);
      setDeleteId(null);
    }
  };

  const handleToggle = useCallback(
    (id: number) => {
      dispatch({ type: "TOGGLE", payload: id });
    },
    [dispatch]
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, [text]);

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />
      <div
        className="container todo-container mt-5 p-4 border rounded"
        style={{ maxWidth: 600 }}
      >
        <h3 className="text-center mb-3 fw-bold">Danh sách công việc</h3>
        <div className="d-flex mb-1">
          <input
            type="text"
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="form-control me-2"
            placeholder="Nhập công việc..."
          />
          <button className="btn btn-primary" onClick={handleAdd}>
            Thêm
          </button>
        </div>
        {error && <p className="text-danger">Vui lòng nhập tên công việc!</p>}
        <ul className="list-group my-3">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div className="form-check">
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo.id)}
                />
                {todo.completed ? (
                  <s className="task-name">{todo.name}</s>
                ) : (
                  <span className="task-name">{todo.name}</span>
                )}
              </div>
              <div>
                <i
                  className="fas fa-edit text-primary me-3"
                  role="button"
                  onClick={() => handleEditClick(todo)}
                />
                <i
                  className="fas fa-trash text-danger"
                  role="button"
                  onClick={() => handleDeleteClick(todo.id)}
                />
              </div>
            </li>
          ))}
        </ul>
        {todos.length === 0 ? (
          <div className="text-center text-warning fw-medium">
            Chưa có công việc nào
          </div>
        ) : completedCount === todos.length ? (
          <div className="text-center text-success fw-medium">
            Tất cả công việc đã hoàn thành
          </div>
        ) : (
          <div className="text-center text-success fw-medium">
            {completedCount} / {todos.length} công việc đã hoàn thành
          </div>
        )}
      </div>

      <ModalUpdate
        show={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onUpdate={handleUpdate}
        defaultValue={editTodo?.name || ""}
      />

      <ModalDelete
        show={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default Baittaptonghop;
