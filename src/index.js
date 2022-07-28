import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import WorkRegist from './components/WorkRegist.jsx';
import WorkIndex from './components/WorkIndex.jsx';
import WorkChange from './components/WorkChange.jsx';
import WorkList from './components/WorkList.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

Amplify.configure(awsExports);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route exact path="/regist/:username/:year/:month" element={<WorkRegist />}></Route>
                <Route exact path="/about/:username" element={<WorkIndex />}></Route>
                <Route exact path="/workList/:username" element={<WorkList />}></Route>
                <Route exact path="/change/:username/:year/:month" element={<WorkChange />}></Route>
                <Route exact path="/" element={<App />}>
                </Route>
            </Routes>
        </BrowserRouter>
  </React.StrictMode>
);
reportWebVitals();
