import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Document from '@ui/pages/document/Document';
import Header from '@ui/components/header/Header';
import Workspace from '@ui/pages/workspace/Workspace';
import NotFound from '@ui/pages/notfound/NotFound';
import './App.scss';
import { ErrorProvider } from '@/contexts/error/ErrorContext';
import Sidebar from '@ui/components/sidebar/Sidebar';
import { WorkspaceProvider } from '@/contexts/workspace/WorkspaceContext';
import Workspaces from '@ui/pages/workspaces/Workspaces';
import { CommunicationProvider } from '@/contexts/communication/CommunicationContext';
import Home from '@ui/pages/home/Home';
import AuthProvider from '@/contexts/auth/AuthContext';
import Profile from '@ui/pages/profile/Profile';
import Landing from '@ui/pages/landing/Landing';

function App() {
  return (
    <div className="app">
      <ErrorProvider>
        <CommunicationProvider>
          <Router>
            <AuthProvider>
              <Header />
              <div className="content">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route
                    path="/home"
                    element={
                      <>
                        <Sidebar />
                        <Home />
                      </>
                    }
                  />
                  <Route path="/profile/:id" element={<Profile />} />
                  <Route
                    path="/workspaces/*"
                    element={
                      <Routes>
                        <Route
                          path="/"
                          element={
                            <>
                              <Sidebar />
                              <Workspaces />
                            </>
                          }
                        />
                        <Route
                          path="/:wid/*"
                          element={
                            <WorkspaceProvider>
                              <Sidebar />
                              <Routes>
                                <Route path="/" element={<Workspace />} />
                                <Route path="/:id" element={<Document />} />
                              </Routes>
                            </WorkspaceProvider>
                          }
                        />
                      </Routes>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </AuthProvider>
          </Router>
        </CommunicationProvider>
      </ErrorProvider>
    </div>
  );
}

export default App;
