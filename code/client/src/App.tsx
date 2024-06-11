import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Document from '@ui/pages/document/Document';
import Header from '@ui/components/header/Header';
import Workspace from '@ui/pages/workspace/Workspace';
import NotFound from '@ui/pages/notfound/NotFound';
import './App.scss';
import { ErrorProvider } from '@ui/contexts/error/ErrorContext';
import Sidebar from '@ui/components/sidebar/Sidebar';
import { WorkspaceProvider } from '@ui/contexts/workspace/WorkspaceContext';
import Workspaces from '@ui/pages/workspaces/Workspaces';
import { CommunicationProvider } from '@ui/contexts/communication/CommunicationContext';
import Home from '@ui/pages/home/Home';
import Login from '@ui/pages/auth/login/Login';
import Signup from '@ui/pages/auth/signup/Signup';
import AuthProvider from '@ui/contexts/auth/AuthContext';

function App() {
  return (
    <div className="app">
      <ErrorProvider>
        <AuthProvider>
          <CommunicationProvider>
            <Router>
              <Header />
              <div className="content">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <>
                        <Sidebar />
                        <Home />
                      </>
                    }
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
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
            </Router>
          </CommunicationProvider>
        </AuthProvider>
      </ErrorProvider>
    </div>
  );
}

export default App;
