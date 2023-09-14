import React, { useEffect, useState } from 'react';
import './css/LocalPrototypes.css'; // Import the CSS file
import { Link } from 'react-router-dom'; // Import the Link component

function LocalPrototypes() {
  const [localData, setLocalData] = useState([]);

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
      <h1>Local Prototypes</h1>
      {localData.map((item) => (
        <Link to={`/prototype/local/${item}`} key={item} className="local-card">
          
            {item}
      
        </Link>
      ))}
    </div>
  );
}

export default LocalPrototypes;
