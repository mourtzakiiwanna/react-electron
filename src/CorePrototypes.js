import React, { useEffect, useState } from 'react';
import './css/LocalPrototypes.css'; // Import the CSS file
import { Link } from 'react-router-dom'; // Import the Link component
import SideMenu from './SideMenu';
import { useParams, useNavigate } from 'react-router-dom';


function CorePrototypes() {
  const [coreData, setcoreData] = useState([]);
  const navigation = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('http://localhost:8080/getCore')
      .then((response) => response.json())
      .then((data) => {
        setcoreData(data);
      })
      .catch((error) => {
        console.error('Error fetching core data:', error);
      });
  };

  return (
    <div className="local-page">
      
      <SideMenu/>
      <div className='main-container'>
        <button onClick={() => navigation("/")} className="back-button">Back</button> 

        <h1 className='header'>Core Prototypes</h1>
          {coreData.map((item) => (
            <Link to={`/prototype/core/${item}`} key={item} className="local-card">
              
                {item}
          
            </Link>
          ))}
      </div>
    </div>
  );
}

export default CorePrototypes;
