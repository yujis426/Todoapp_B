import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const Top = () => {
  const navigate = useNavigate();

  const goToTodayDetail = () => {
    const today = dayjs().format('YYYY-MM-DD'); // 例: "2025-05-03"
    navigate(`/detail/${today}`);
  };

  return (
    <div>
      <h1>トップページ</h1>
      <button onClick={goToTodayDetail}>
        今日のTodo（詳細）ページへ
      </button>
    </div>
  );
};

export default Top;