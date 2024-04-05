import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './useWorker';
import 'uno.css';
import "normalize.css";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
);


setTimeout(() => {
    document.onkeydown = (e) => {
        console.log(e.code);
        if (e.ctrlKey && (e.code === 'KeyS')) {
            e.preventDefault();
            console.log('Ctrl+S has been prevented.');
        }
    };
});
