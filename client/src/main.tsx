import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// import "react-notion/src/styles.css";
// import "prismjs/themes/prism-tomorrow.css"; // only needed for code highlighting


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
