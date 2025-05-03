import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Top from './components/top';
import Todos from './components/Todos';
import CalendarComponent from './components/CalendarComponent';
import DetailPage from './components/DetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/components/todos" element={<Todos />} />
        <Route path="/calendar" element={<CalendarComponent />} />
        <Route path="/detail/:date" element={<DetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;