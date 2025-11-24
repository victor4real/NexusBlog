
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  // In some preview environments, index.html might load slightly differently.
  // We throw to ensure we don't try to render to null.
  throw new Error("Could not find root element to mount to. Ensure index.html has <div id='root'></div>");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
