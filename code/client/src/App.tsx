import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { CommunicationProvider } from '@/domain/communication/context/CommunicationContext';
import { communication } from '@/domain/communication/communication';
import { ErrorBoundary } from 'react-error-boundary';
import Document from '@/ui/pages/document/Document';
import Header from '@/ui/components/header/Header';
import Workspace from '@/ui/pages/workspace/Workspace';
import Error from '@/ui/components/error/Error';
import './App.scss';
import NotFound from '@/ui/pages/notfound/NotFound';

function App() {
  return (
    <div className="app">
      <CommunicationProvider communication={communication}>
        <Router>
          <Header />
          <ErrorBoundary FallbackComponent={Error}>
            <Routes>
              <Route path="/" element={<Navigate to={`/documents`} />} />
              <Route path="/documents" element={<Workspace />} />
              <Route path="/documents/:id" element={<Document />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </Router>
      </CommunicationProvider>
    </div>
  );
}

export default App;
