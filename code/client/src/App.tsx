import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DocumentEditor from './features/editor/DocumentEditor.tsx';
import './App.scss';

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path={'/'} element={<DocumentEditor />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
