import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/App.css';

function Home() {
  const groups = [
    { name: 'Local Prototypes', url: 'http://localhost:8080/getLocal' },
    { name: 'Core Prototypes', url: 'http://localhost:8080/getCore' },
    { name: 'Delta Prototypes', url: 'http://localhost:8080/getDelta' },
  ];

  const [expandedGroup, setExpandedGroup] = useState(null);
  const [groupData, setGroupData] = useState({});

  useEffect(() => {
    const fetchData = async (url, index) => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        const formattedData = data.map(name => ({
          formattedName: name.replace(/([A-Z])/g, ' $1'),
          unformattedName: name,
        }));
        setGroupData(prevData => ({ ...prevData, [index]: formattedData }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    groups.forEach((group, index) => {
      if (expandedGroup === index) {
        fetchData(group.url, index);
      }
    });
  }, [expandedGroup]);

  const handleGroupClick = (index) => {
    if (expandedGroup === index) {
      setExpandedGroup(null);
    } else {
      setExpandedGroup(index);
    }
  };

  return (
    <div>
      <div className="center-button">
        <Link to="/create" className="create-button">
          Create new prototype
        </Link>
      </div>
      {groups.map((group, index) => (
        <div key={index} className="group">
          <div
            className={`group-name ${expandedGroup === index ? 'expanded' : ''}`}
            onClick={() => handleGroupClick(index)}
          >
            {group.name}
          </div>
          {expandedGroup === index && (
            <div className="group-content">
              {groupData[index] && (
                <div>
                  <Link to="/local">All local prototypes</Link>

                  {groupData[index].map((prototype, valueIndex) => {
                    const formattedGroupName = group.name
                      .toLowerCase()
                      .replace(/\s+/g, '')
                      .replace('prototypes', '');
                    const fullPath = `/prototype/${formattedGroupName}/${prototype.unformattedName}`;
                    return (
                      <Link
                        to={fullPath}
                        key={`${index}-${valueIndex}`}
                        className="card"
                      >
                        <div className="card-content">{prototype.formattedName}</div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Home;
