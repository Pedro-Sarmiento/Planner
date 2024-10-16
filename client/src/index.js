import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Home from './Home'; // Import the Home component
import Profile from './components/Profile'; // Import the Profile component
import Calendar from './components/TaskCalendar'; // Import the Calendar component
import Notifications from './components/Notifications';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.Fragment>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/calendar" element={<Calendar />}/>
        <Route path="/notifications" element={<Notifications />}/>
      </Routes>
    </BrowserRouter>
  </React.Fragment>
);