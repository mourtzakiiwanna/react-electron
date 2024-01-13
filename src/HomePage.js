import React from 'react';
import SideMenu from './SideMenu';
import './css/Prototype.css';

function Prototype(props) {

  return (
    <div>
      <SideMenu />
      <div className="main-content">
        <div className="prototype-container">
          <div className='sticky-header'>
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