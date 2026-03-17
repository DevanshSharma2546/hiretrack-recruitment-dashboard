import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initializeDatabase } from './services/database.js'
import { worker } from './services/mockapi.js'

async function bootstrap() {
  await initializeDatabase();
  await worker.start({ onUnhandledRequest: 'bypass' });
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

bootstrap().catch(console.error);
