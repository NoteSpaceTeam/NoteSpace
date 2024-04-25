import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import DocumentEditor from '@editor/DocumentEditor';
import Header from '@src/components/header/Header';
import './App.scss';
import { communication } from '@editor/domain/communication';
import { v4 as uuid } from 'uuid';

function App() {
  return (
    <div className="app">
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to={`/documents/${uuid()}`} />} />
          <Route path="/documents/:id" element={<DocumentEditor communication={communication} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
