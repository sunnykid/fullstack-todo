import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || '/api';

// API 클라이언트 설정
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });

  // 할 일 목록 조회
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
      toast.error('할 일 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 할 일 추가
  const addTodo = async (e) => {
    e.preventDefault();

    if (!newTodo.title.trim()) {
      toast.error('제목을 입력해주세요.');
      return;
    }

    try {
      const response = await api.post('/todos', newTodo);
      setTodos([response.data, ...todos]);
      setNewTodo({ title: '', description: '' });
      toast.success('할 일이 추가되었습니다.');
    } catch (error) {
      console.error('Failed to add todo:', error);
      toast.error('할 일 추가에 실패했습니다.');
    }
  };

  // 할 일 완료 상태 변경
  const toggleTodo = async (id, completed) => {
    try {
      const todo = todos.find(t => t.id === id);
      await api.put(`/todos/${id}`, {
        ...todo,
        completed: !completed
      });

      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, completed: !completed } : todo
      ));

      toast.success(completed ? '할 일을 미완료로 변경했습니다.' : '할 일을 완료했습니다.');
    } catch (error) {
      console.error('Failed to toggle todo:', error);
      toast.error('할 일 상태 변경에 실패했습니다.');
    }
  };

  // 할 일 삭제
  const deleteTodo = async (id) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) {
      return;
    }

    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
      toast.success('할 일이 삭제되었습니다.');
    } catch (error) {
      console.error('Failed to delete todo:', error);
      toast.error('할 일 삭제에 실패했습니다.');
    }
  };

  // 컴포넌트 마운트 시 할 일 목록 조회
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="App">
      <Toaster position="top-right" />

      <header className="App-header">
        <h1>📝 할 일 관리</h1>
        <p>Docker Compose로 구성한 풀스택 애플리케이션</p>
      </header>

      <main className="main-content">
        {/* 할 일 추가 폼 */}
        <section className="add-todo-section">
          <h2>새 할 일 추가</h2>
          <form onSubmit={addTodo} className="add-todo-form">
            <div className="form-group">
              <input
                type="text"
                placeholder="할 일 제목을 입력하세요"
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <textarea
                placeholder="상세 설명 (선택사항)"
                value={newTodo.description}
                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                className="form-textarea"
                rows="3"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              추가하기
            </button>
          </form>
        </section>

        {/* 할 일 목록 */}
        <section className="todos-section">
          <h2>할 일 목록 ({todos.length}개)</h2>

          {loading ? (
            <div className="loading">로딩 중...</div>
          ) : todos.length === 0 ? (
            <div className="empty-state">
              <p>할 일이 없습니다. 새로운 할 일을 추가해보세요!</p>
            </div>
          ) : (
            <div className="todos-grid">
              {todos.map(todo => (
                <div
                  key={todo.id}
                  className={`todo-card ${todo.completed ? 'completed' : ''}`}
                >
                  <div className="todo-content">
                    <h3 className="todo-title">{todo.title}</h3>
                    {todo.description && (
                      <p className="todo-description">{todo.description}</p>
                    )}
                    <div className="todo-meta">
                      <span className="todo-date">
                        생성일: {new Date(todo.created_at).toLocaleDateString('ko-KR')}
                      </span>
                      {todo.updated_at !== todo.created_at && (
                        <span className="todo-date">
                          수정일: {new Date(todo.updated_at).toLocaleDateString('ko-KR')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="todo-actions">
                    <button
                      onClick={() => toggleTodo(todo.id, todo.completed)}
                      className={`btn ${todo.completed ? 'btn-warning' : 'btn-success'}`}
                    >
                      {todo.completed ? '미완료' : '완료'}
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="btn btn-danger"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="App-footer">
        <p>🐳 Docker Compose 풀스택 애플리케이션 예제</p>
        <div className="tech-stack">
          <span>React</span>
          <span>Node.js</span>
          <span>MySQL</span>
          <span>Redis</span>
          <span>Nginx</span>
        </div>
      </footer>
    </div>
  );
}

export default App;