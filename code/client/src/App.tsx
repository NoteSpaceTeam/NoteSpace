import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Document from '@ui/pages/document/Document';
import Header from '@ui/components/header/Header';
import Workspace from '@ui/pages/workspace/Workspace';
import NotFound from '@ui/pages/notfound/NotFound';
import { ErrorProvider } from '@/contexts/error/ErrorContext';
import Sidebar from '@ui/components/sidebar/Sidebar';
import { WorkspaceProvider } from '@/contexts/workspace/WorkspaceContext';
import Workspaces from '@ui/pages/workspaces/Workspaces';
import { CommunicationProvider } from '@/contexts/communication/CommunicationContext';
import Home from '@ui/pages/home/Home';
import AuthProvider from '@/contexts/auth/AuthContext';
import Profile from '@ui/pages/profile/Profile';
import Login from '@ui/pages/login/Login';
import Search from '@ui/pages/search/Search';
import CommitHistory from '@ui/pages/document/components/commit-history/CommitHistory';
import Commit from '@ui/pages/document/components/commit/Commit';
import './App.scss';
import Recent from '@ui/pages/recent/Recent';

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
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/"
                    element={
                      <>
                        <Sidebar />
                        <Home />
                      </>
                    }
                  />
                  <Route
                    path="/search"
                    element={
                      <>
                        <Sidebar />
                        <Search />
                      </>
                    }
                  />
                  <Route
                    path="/profile/:id"
                    element={
                      <>
                        <Sidebar />
                        <Profile />
                      </>
                    }
                  />
                  <Route
                    path="/recent"
                    element={
                      <>
                        <Sidebar />
                        <Recent />
                      </>
                    }
                  />
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
                                <Route path="/:id/commits" element={<CommitHistory />} />
                                <Route path="/:id/commits/:commitId" element={<Commit />} />
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
