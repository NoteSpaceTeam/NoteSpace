import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SlateEditor from '@editor/slate/SlateEditor';
import './App.scss';

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path={'/'} element={<SlateEditor />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
