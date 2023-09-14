import { useState, useMemo } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home'; // Import the Home component
import './css/App.css';
import Prototype from "./Prototype";
import Local from "./LocalPrototypes";
import { ValueContextProvider } from './ValueContext'; // Import your ValueContextProvider
import AddNamePage from './AddNamePage';
import AddInheritancePage from './AddInheritancePage';
import AddFieldsPage from './AddFieldsPage';
import AddSchemePage from './AddSchemePage';
import Typography from '@mui/material/Typography';

// Check if the code is running in Electron
const isElectron = window.require && window.require('@electron/remote');

const fs = isElectron ? window.require('fs') : null;
const pathModule = isElectron ? window.require('path') : null;

const { app } = isElectron ? window.require('@electron/remote') : { app: null };

const formatSize = size => {
  var i = Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i)).toFixed(2) * 1 +
    ' ' +
    ['B', 'kB', 'MB', 'GB', 'TB'][i]
  );
};

function App() {
  const [path, setPath] = useState(isElectron ? app.getAppPath() : '');

  const files = useMemo(
    () =>
      isElectron
        ? fs
            .readdirSync(path)
            .map(file => {
              const stats = fs.statSync(pathModule.join(path, file));
              return {
                name: file,
                size: stats.isFile() ? formatSize(stats.size ?? 0) : null,
                directory: stats.isDirectory()
              };
            })
            .sort((a, b) => {
              if (a.directory === b.directory) {
                return a.name.localeCompare(b.name);
              }
              return a.directory ? -1 : 1;
            })
        : [], // Empty array if not in Electron
    [path]
  );

  const onBack = () => setPath(pathModule.dirname(path));
  const onOpen = folder => setPath(pathModule.join(path, folder));

  const [searchString, setSearchString] = useState('');

  // Filter files only if in Electron
  const filteredFiles = isElectron
    ? files.filter(s => s.name.startsWith(searchString))
    : [];

  return (
    <Router>
      <div>
        <div>
        <Link to="/" className='link'>
        <Typography variant="h3" gutterBottom className='pageHeader' 
          sx ={{margin: '120px', marginBottom:'50px', textDecoration:'none', fontWeight: 'bold' ,letterSpacing: '2px', fontFamily:'Arial',
          '&:hover': { color: '#9b9b9b', textDecoration:'none'}

          }}>Digital Library</Typography>      
              
        </Link>
        </div>
        <ValueContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/local" element ={<Local />} />
          <Route path="/prototype/:groupName/:prototypeName" element ={<Prototype />} />
          <Route path="/create" element={<AddNamePage />} />
          <Route path="/add-inheritance" element={<AddInheritancePage />} />
          <Route path="/add-fields" element={<AddFieldsPage />} />
          <Route path="/add-scheme" element={<AddSchemePage />} />
        </Routes>
      </ValueContextProvider>
      </div>
    </Router>
  );
}

export default App;


