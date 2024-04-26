import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import DocumentEditor from '@src/components/editor/DocumentEditor';
import Header from '@src/components/header/Header';
import Documents from '@src/components/home/Home.tsx';
import './App.scss';

function App() {
  return (
    <div className="app">
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to={`/documents`} />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/documents/:id" element={<DocumentEditor />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
