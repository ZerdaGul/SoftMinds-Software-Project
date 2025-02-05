import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Router'ı içe aktarın
import './index.css';
import App from './components/App/App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Router>
      <App />
    </Router>
);
