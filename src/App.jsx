import React from 'react';
import Home from './components/Home/home';
import Trips from './components/Trips/trips';
import Sidebar from './components/Sidebar/sidebar';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import './App.css'; // Assuming you have some global styles for layout

function App() {
  return (
    <Router>
      <div className="appLayout">
        {/* Sidebar should persist across pages */}
        <Sidebar />

        {/* Main content that changes based on the route */}
        <div className="mainContent">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trips" element={<Trips />} />
            {/* <Route path="/settings" element={<Settings />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
