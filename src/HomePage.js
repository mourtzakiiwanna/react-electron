import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './css/Prototype.css'; // Import your CSS file
import SideMenu from './SideMenu';
import Typography from '@mui/material/Typography';

import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from '@mui/x-data-grid-generator';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';


function Prototype(props) {
  
  return (
    
    <div>
      <SideMenu />
      
      <div className="main-content">

      <div className="prototype-container">

        {/* <button onClick={() => navigation("/")}  className="back-button">Back</button>  */}
        <div className='sticky-header'>

          <div className='header-and-button'>

          <span className="center-button">
                <Link to="/create" className="create-button">
                  Create new prototype
                </Link>
          </span>
          
            <Link to="/" className='link'>
            <Typography variant="h3" gutterBottom className='pageHeader' 
              sx ={{margin: '70px', marginBottom:'50px', textDecoration:'none', fontWeight: 'bold' ,letterSpacing: '2px', fontFamily:'Arial',
              '&:hover': { color: 'gray', textDecoration:'none'}

              }}>Prototypes</Typography>      
                  
            </Link>

            </div>

        <div className="alt-text-container">
          <h2 className="alt-text">Please select a prototype from the side menu to explore their properties,
          or create a new one pressing the "Create new prototype" button.</h2> 
        </div>

      </div>
    </div>
    </div>
    </div>
  );
}

export default Prototype;