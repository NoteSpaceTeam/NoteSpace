import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import DocumentEditor from '@pages/editor/DocumentEditor';
import Header from '@components/header/Header';
import Home from '@pages/home/Home.tsx';
import './App.scss';
import {CommunicationProvider} from "@/contexts/CommunicationContext.tsx";
import {communication} from "@communication/communication.ts";

function App() {
  return (
    <div className="app">
      <Header />
        <CommunicationProvider communication = {communication}>
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
