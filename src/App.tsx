import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Top from './components/top';
import CalendarComponent from './components/CalendarComponent';
import DetailPage from './components/DetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/detail/:date" element={<DetailPage />} />
        <Route path="/calendar" element={<CalendarComponent />} />
       
      </Routes>
    </Router>
  );
}

export default App;