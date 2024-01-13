import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './HomePage';
import Prototype from "./Prototype";
import './css/App.css';

import AddPrototypePage from './AddPrototypePage';
import { ValueContextProvider } from './ValueContext';

function App() {

  return (
    <Router>
      <div>

        <ValueContextProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/prototype/:groupName/:prototypeName" element={<Prototype />} />
            <Route path="/create" element={<AddPrototypePage />} />
          </Routes>
        </ValueContextProvider>
      </div>
    </Router>
  );
}

export default App;