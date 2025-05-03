import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import localforage from 'localforage';
import dayjs from 'dayjs';
import { Todo } from '../types/todo';


const DetailPage = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const targetDate = dayjs(date);
  const displayDate = targetDate.format('YYYY年MM月DD日');

  // 前の日・次の日の計算
  const goToDate = (offset: number) => {
    const newDate = targetDate.add(offset, 'day').format('YYYY-MM-DD');
    navigate(`/detail/${newDate}`);
  };

  // 読み込み
  useEffect(() => {
    localforage.getItem('todo-20240622').then((items) => {
      if (items) {
        const all = items as Todo[];
        setTodos(all.filter(t => t.start_date === date && !t.delete_flg));
      }
    });
  }, [date]);

  const handleDelete = (id: number) => {
    localforage.getItem('todo-20240622').then((items) => {
      if (items) {
        const all = items as Todo[];
        const updated = all.map(todo =>
          todo.id === id ? { ...todo, delete_flg: true } : todo
        );
        localforage.setItem('todo-20240622', updated);
        setTodos(updated.filter(t => t.start_date === date && !t.delete_flg));
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-center mb-4">{displayDate}</h2>
      <div className="flex justify-center gap-4 mb-4">
        <button onClick={() => goToDate(-1)} className="bg-orange-400 px-3 py-1 rounded text-white">前の日</button>
        <button onClick={() => navigate('/calendar')} className="bg-orange-400 px-3 py-1 rounded text-white">カレンダーに戻る</button>
        <button onClick={() => goToDate(1)} className="bg-orange-400 px-3 py-1 rounded text-white">次の日</button>
      </div>

      {todos.map(todo => (
        <div key={todo.id} className="mb-4 p-4 bg-orange-50 rounded shadow">
          <div className="flex justify-between items-center">
            <span>{todo.title}</span>
            <div className="flex gap-2">
              <button onClick={() => setExpandedId(todo.id)} className="bg-blue-400 text-white px-2 rounded">編集</button>
              <button onClick={() => handleDelete(todo.id)} className="bg-red-400 text-white px-2 rounded">削除</button>
            </div>
          </div>
          {expandedId === todo.id && (
            <div className="mt-2">
              {/* 詳細編集フォームやtextareaなどここに展開 */}
              <textarea defaultValue="## 進捗状況\n## 内容\n## 連絡内容" className="w-full p-2 border rounded" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DetailPage;