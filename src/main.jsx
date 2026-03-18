import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initializeDatabase } from './services/database.js'
// import { worker } from './services/mockapi.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// run async stuff AFTER render (non-blocking)
initializeDatabase().catch(console.error);
// worker.start({ onUnhandledRequest: 'bypass' }).catch(console.error);