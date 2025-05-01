import React, { useState } from 'react';

// "Todo" 型の定義をコンポーネント外で行います
type Todo = {
  title: string;
  readonly id: number;
  completed_flg: boolean;
  delete_flg: boolean, // <-- 追加
};

type Filter = 'all' | 'completed' | 'unchecked' | 'delete';

// Todo コンポーネントの定義
const Todo: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]); // Todo配列として初期化
  const [text, setText] = useState(''); // テキスト入力用
  const [nextId, setNextId] = useState(1); // 次のTodoのIDを保持するステート
  const [filter, setFilter] = useState<Filter>('all');

  // todos ステートを更新する関数
  const handleSubmit = () => {
    // 何も入力されていなかったらリターン
    if (!text) return;
  
   // 新しい Todo を作成
    const newTodo: Todo = {
      title: text,
      id: nextId,
      // 初期値は false
      completed_flg: false,
      delete_flg: false,
    };


    setTodos((prevTodos) => [newTodo, ...prevTodos]);
    setNextId(nextId + 1); // 次の ID を更新
  
  
    // フォームへの入力をクリアする
    setText('');
  };

  const handleEdit = (id: number, value: string) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          // 新しいオブジェクトを作成して返す
          return { ...todo, title: value };
        }
        return todo;
      });
  
  
      // todos ステートが書き換えられていないかチェック
      console.log('=== Original todos ===');
      todos.map((todo) => {
        console.log(`id: ${todo.id}, title: ${todo.title}`);
      });
  
  
      return newTodos;
    });
  };

  const handleCheck = (id: number, completed_flg: boolean) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed_flg };
        }
        return todo;
      });
  
      return newTodos;
    });
  };

  const handleRemove = (id: number, delete_flg: boolean) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, delete_flg };
        }
        return todo;
      });
   
      return newTodos;
    });
  };

  const handleFilterChange = (filter: Filter) => {
    setFilter(filter);
  };

   // フィルタリングされたタスクリストを取得する関数
 const getFilteredTodos = () => {
  switch (filter) {
    case 'completed':
      // 完了済み **かつ** 削除されていないタスクを返す
      return todos.filter((todo) => todo.completed_flg && !todo.delete_flg);
    case 'unchecked':
      // 未完了 **かつ** 削除されていないタスクを返す
      return todos.filter((todo) => !todo.completed_flg && !todo.delete_flg);
    case 'delete':
      // 削除されたタスクを返す
      return todos.filter((todo) => todo.delete_flg);
    default:
      // 削除されていないすべてのタスクを返す
      return todos.filter((todo) => !todo.delete_flg);
  }
};

const isFormDisabled = filter === 'completed' || filter === 'delete';

// 物理的に削除する関数
const handleEmpty = () => {
  setTodos((todos) => todos.filter((todo) => !todo.delete_flg));
};

  return (
    <div className="todo-container">
      <select
        defaultValue="all"
        onChange={(e) => handleFilterChange(e.target.value as Filter)}
      >
        <option value="all">すべてのタスク</option>
        <option value="completed">完了したタスク</option>
        <option value="unchecked">現在のタスク</option>
        <option value="delete">ごみ箱</option>
      </select>
      {/* フィルターが `delete` のときは「ごみ箱を空にする」ボタンを表示 */}
      {filter === 'delete' ? (
        <button onClick={handleEmpty}>
          ごみ箱を空にする
        </button>
      ) : (
        // フィルターが `completed` でなければ Todo 入力フォームを表示
        filter !== 'completed' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <input
              type="text"
              value={text} // フォームの入力値をステートにバインド
              onChange={(e) => setText(e.target.value)} // 入力値が変わった時にステートを更新
            />
            <button className="insert-btn" type="submit">追加</button>
          </form>
        )
      )}
      <ul>
        {getFilteredTodos().map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed_flg}
              onChange={() => handleCheck(todo.id, !todo.completed_flg)}
            />
            <input
              type="text"
              value={todo.title}
              onChange={(e) => handleEdit(todo.id, e.target.value)}
            />
            <button onClick={() => handleRemove(todo.id, !todo.delete_flg)}>
              {todo.delete_flg ? '復元' : '削除'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

};

export default Todo;
