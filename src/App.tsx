import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Top from './components/top';
import Todos from './components/index';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/todos" element={<Todos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;