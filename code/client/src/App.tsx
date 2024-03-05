import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.scss';
import DocumentEditor from './editor/DocumentEditor.tsx';

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
