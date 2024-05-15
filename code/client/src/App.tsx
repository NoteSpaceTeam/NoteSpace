import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CommunicationProvider } from '@ui/contexts/communication/CommunicationContext.tsx';
import Document from '@ui/pages/document/Document';
import Header from '@ui/components/header/Header';
import Workspace from '@ui/pages/workspace/Workspace';
import NotFound from '@ui/pages/notfound/NotFound';
import './App.scss';
import { ErrorProvider } from '@ui/contexts/error/ErrorContext';
import Sidebar from '@ui/components/sidebar/Sidebar';
import { WorkspaceProvider } from '@ui/contexts/workspace/WorkspaceContext';
import Home from '@ui/pages/home/Home.tsx';

function App() {
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
