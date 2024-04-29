import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import DocumentEditor from '@/ui/pages/editor/DocumentEditor';
import Header from '@/ui/components/header/Header';
import Home from '@/ui/pages/home/Home.tsx';
import './App.scss';
import { CommunicationProvider } from '@/contexts/CommunicationContext.tsx';
import { communication } from '@/domain/communication/communication.ts';

function App() {
  return (
    <div className="app">
      <Header />
      <CommunicationProvider communication={communication}>
        <Router>
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
