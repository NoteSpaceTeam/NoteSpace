import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SlateEditor from '@editor/slate/SlateEditor';
import Header from '@src/components/header/Header';
import './App.scss';

function App() {
  return (
    <div className="app">
      <Header />
      <Router>
        <Routes>
          <Route path={'/'} element={<SlateEditor />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
