import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DocumentEditor from '@editor/DocumentEditor';
import Header from '@src/components/header/Header';
import './App.scss';
import { communication } from '@editor/domain/communication';

function App() {
  return (
    <div className="app">
      <Header />
      <Router>
        <Routes>
          <Route path={'/'} element={<DocumentEditor communication={communication} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
