import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { enableHorizontalScroll } from './lib/horizontalScroll';
import './index.css';

enableHorizontalScroll();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
