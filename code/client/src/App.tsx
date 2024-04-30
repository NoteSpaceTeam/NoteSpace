import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import DocumentEditor from '@/ui/pages/editor/DocumentEditor';
import Header from '@/ui/components/header/Header';
import Home from '@/ui/pages/home/Home';
import './App.scss';
import { CommunicationProvider } from '@/domain/communication/context/CommunicationContext';
import { communication } from '@/domain/communication/communication';

function App() {
  return (
    <div className="app">
      <CommunicationProvider communication={communication}>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Navigate to={`/documents`} />} />
            <Route path="/documents" element={<Home />} />
            <Route path="/documents/:id" element={<DocumentEditor />} />
          </Routes>
        </Router>
      </CommunicationProvider>
    </div>
  );
}

export default App;
