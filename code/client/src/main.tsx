import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { CommunicationProvider } from '@editor/contexts/CommunicationContext';
import { emit, emitChunked, off, on } from '@socket/communication';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CommunicationProvider emit={emit} emitChunked={emitChunked} on={on} off={off}>
      <App />
    </CommunicationProvider>
  </React.StrictMode>
);
