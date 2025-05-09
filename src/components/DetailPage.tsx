import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import localforage from 'localforage';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Todo } from '../types/todo';

const DetailPage = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const targetDate = dayjs(date);
  const displayDate = targetDate.format('YYYY年MM月DD日');

  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState('');
  const [nextId, setNextId] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'unchecked' | 'delete'>('all');

  useEffect(() => {
    localforage.getItem('todo-20240622').then((items) => {
      if (items) {
        const all = items as Todo[];
        const todayTodos = all.filter(t => t.start_date === date);
        setTodos(todayTodos);
        const maxId = all.reduce((max, t) => Math.max(max, t.id), 0);
        setNextId(maxId + 1);
      }
    });
  }, [date]);

  useEffect(() => {
    localforage.getItem('todo-20240622').then((items) => {
      const all = (items as Todo[] | null) ?? [];
      const rest = all.filter(t => t.start_date !== date);
      localforage.setItem('todo-20240622', [...rest, ...todos]);
    });
  }, [todos, date]);

  const handleSubmit = () => {
    if (!text) return;
    const newTodo: Todo = {
      id: nextId,
      title: text,
      completed_flg: false,
      delete_flg: false,
      start_date: targetDate.format('YYYY-MM-DD'),
      end_date: targetDate.format('YYYY-MM-DD'),
      progress: 0,
      note: ''
    };
    setTodos([newTodo, ...todos]);
    setNextId(nextId + 1);
    setText('');
  };

  const handleTodo = <K extends keyof Todo, V extends Todo[K]>(id: number, key: K, value: V) => {
    setTodos(prev => prev.map(todo => todo.id === id ? { ...todo, [key]: value } : todo));
  };

  const getFilteredTodos = () => {
    switch (filter) {
      case 'completed':
        return todos.filter(t => t.completed_flg && !t.delete_flg);
      case 'unchecked':
        return todos.filter(t => !t.completed_flg && !t.delete_flg);
      case 'delete':
        return todos.filter(t => t.delete_flg);
      default:
        return todos.filter(t => !t.delete_flg);
    }
  };

  const handleEmpty = () => {
    setTodos(todos.filter((todo) => !todo.delete_flg));
  };

  const goToDate = (offset: number) => {
    const newDate = targetDate.add(offset, 'day').format('YYYY-MM-DD');
    navigate(`/detail/${newDate}`);
  };
  
  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-center mb-4">{displayDate}</h2>

      <div className="flex justify-center gap-4 mb-4">
        <button onClick={() => goToDate(-1)} className="btn-orange">前の日</button>
        <button onClick={() => navigate('/calendar')} className="btn-orange">カレンダーに戻る</button>
        <button onClick={() => goToDate(1)} className="btn-orange">次の日</button>
      </div>
      <div className="mb-4">
        <select
          defaultValue="all"
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="p-2 border rounded"
        >
          <option value="all">すべてのタスク</option>
          <option value="completed">完了したタスク</option>
          <option value="unchecked">現在のタスク</option>
          <option value="delete">ごみ箱</option>
        </select>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="mt-2"
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="p-2 border rounded mr-2"
            placeholder="新しいタスク"
          />
          <button type="submit" className="bg-orange-400 text-white px-3 py-1 rounded">追加</button>
        </form>
      </div>

      <ul>
        {getFilteredTodos().map(todo => (
          <li key={todo.id} className="todo-display-row">
            <div className="todo-form-row">
              <div className="form-group">
                <label className="label">進捗率</label>
                <select
                  value={todo.progress}
                  onChange={(e) => handleTodo(todo.id, 'progress', Number(e.target.value))}
                  className="progress-select"
                >
                  {[...Array(11)].map((_, i) => (
                    <option key={i} value={i * 10}>{i * 10}%</option>
                  ))}
                </select>
              </div>

              <div className="form-group date-group">
                <label className="label">開始日</label>
                <DatePicker
                  selected={dayjs(todo.start_date).toDate()}
                  onChange={(date: Date | null) => {
                    if (date) handleTodo(todo.id, 'start_date', dayjs(date).format('YYYY-MM-DD'));
                  }}
                  className="date-input"
                  dateFormat="yyyy/MM/dd"
                />

                <label className="label mt-1">完了予定日</label>
                <DatePicker
                  selected={dayjs(todo.end_date).toDate()}
                  onChange={(date: Date | null) => {
                    if (date) handleTodo(todo.id, 'end_date', dayjs(date).format('YYYY-MM-DD'));
                  }}
                  className="date-input"
                  dateFormat="yyyy/MM/dd"
                />
              </div>

              <input
                type="text"
                disabled={todo.progress === 100 || todo.delete_flg}
                value={todo.title}
                onChange={(e) => handleTodo(todo.id, 'title', e.target.value)}
                className={`task-title-input ${todo.progress === 100 ? 'disabled-task' : ''}`}
              />

              <button
                onClick={() => setExpandedId(expandedId === todo.id ? null : todo.id)}
                className="btn-edit"
              >編集</button>

              <button
                onClick={() => handleTodo(todo.id, 'delete_flg', !todo.delete_flg)}
                className="btn-delete"
              >{todo.delete_flg ? '復元' : '削除'}</button>
            </div>

            {expandedId === todo.id && (
              <textarea
                value={todo.note ?? ''}
                onChange={(e) => handleTodo(todo.id, 'note', e.target.value)}
                className="todo-note"
                rows={6}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DetailPage;
