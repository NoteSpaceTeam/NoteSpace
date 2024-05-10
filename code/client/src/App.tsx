import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { CommunicationProvider } from '@/services/communication/context/CommunicationContext';
import { communication } from '@/services/communication/communication';
import Document from '@ui/pages/document/Document';
import Header from '@ui/components/header/Header';
import Workspace from '@ui/pages/workspace/Workspace';
import NotFound from '@ui/pages/notfound/NotFound';
import './App.scss';
import { ErrorProvider } from '@domain/error/ErrorContext';
import Sidebar from '@ui/components/sidebar/Sidebar';
import { WorkspaceProvider } from '@domain/workspace/WorkspaceContext';

function App() {
  return (
    <div className="app">
      <ErrorProvider>
        <CommunicationProvider communication={communication}>
          <Router>
            <Sidebar />
            <div className="content">
              <Header />
              <Routes>
                <WorkspaceProvider>
                  <Route path="/" element={<Navigate to={`/documents`} />} />
                  <Route path="/documents" element={<Workspace />} />
                  <Route path="/documents/:id" element={<Document />} />
                </WorkspaceProvider>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Router>
        </CommunicationProvider>
      </ErrorProvider>
    </div>
  );
}

export default App;
