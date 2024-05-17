import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Document from '@ui/pages/document/Document';
import Header from '@ui/components/header/Header';
import Workspace from '@ui/pages/workspace/Workspace';
import NotFound from '@ui/pages/notfound/NotFound';
import './App.scss';
import { ErrorProvider } from '@ui/contexts/error/ErrorContext';
import Sidebar from '@ui/components/sidebar/Sidebar';
import { WorkspaceProvider } from '@ui/contexts/workspace/WorkspaceContext';
import Home from '@ui/pages/home/Home';
import { ClientLogCaller } from '@/utils/logging';
import getLogger from '@notespace/shared/src/utils/logging';
import { CommunicationProvider } from '@ui/contexts/communication/CommunicationContext';
import { useEffect } from 'react';

const logger = getLogger(ClientLogCaller.React);

function App() {
  useEffect(() => {
    logger.logSuccess('App started');
  }, []);

  return (
    <div className="app">
      <ErrorProvider>
        <CommunicationProvider>
          <Router>
            <Header />
            <div className="content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/workspaces/:wid/*"
                  element={
                    <WorkspaceProvider>
                      <Routes>
                        <Route
                          path="/"
                          element={
                            <>
                              <Sidebar />
                              <Workspace />
                            </>
                          }
                        />
                        <Route
                          path="/:id"
                          element={
                            <>
                              <Sidebar />
                              <Document />
                            </>
                          }
                        />
                      </Routes>
                    </WorkspaceProvider>
                  }
                />
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
