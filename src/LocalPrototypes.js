import React, { useEffect, useState } from 'react';
import './css/LocalPrototypes.css'; // Import the CSS file
import { Link } from 'react-router-dom'; // Import the Link component
import SideMenu from './SideMenu';
import { useParams, useNavigate } from 'react-router-dom';

function LocalPrototypes() {
  const [localData, setLocalData] = useState([]);
  const navigation = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('http://localhost:8080/getLocal')
      .then((response) => response.json())
      .then((data) => {
        setLocalData(data);
      })
      .catch((error) => {
        console.error('Error fetching local data:', error);
      });
  };

  return (
    <div className="local-page">
      
      <SideMenu/>
      <div className='main-container'>
      <button onClick={() => navigation("/")} className="back-button">Back</button> 

        <h1 className='header'>Local Prototypes</h1>

        {localData.map((item) => (
          <Link to={`/prototype/local/${item}`} key={item} className="local-card">
            
              {item}
        
          </Link>
        ))}
      </div>
    </div>
  );
}

export default LocalPrototypes;
