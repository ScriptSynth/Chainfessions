
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Make sure styles are loaded before rendering the app
document.addEventListener('DOMContentLoaded', () => {
  createRoot(document.getElementById("root")!).render(<App />);
});
