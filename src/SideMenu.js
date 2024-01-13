import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/SideMenu.css';
import { useNavigate } from 'react-router';

function SideMenu(props) {

  const baseURL = 'http://localhost:8080/api/type';

  const groups = [
    { name: 'Local Prototypes', url: `${baseURL}/category/local` },
    { name: 'Core Prototypes', url: `${baseURL}/category/core` },
  ];

  let headers = new Headers();

  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Origin', 'http://localhost:3000');
 
  const { currentGroup, currentPrototype } = props;
  const [expandedGroup, setExpandedGroup] = useState(0); 
  const [groupData, setGroupData] = useState({});
  const [selectedItems, setSelectedItems] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async (url, index) => {
      try {
        const response = await fetch(url,
          {
            mode: 'cors',
            method: 'GET',
            headers: headers
          });

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
  });

  const handleGroupClick = (index) => {
    if (expandedGroup === index) {
      setExpandedGroup(null); 
    } else {
      setExpandedGroup(index); 
    }
  };

  const handleItemClick = (fullPath, groupIndex) => {
    setExpandedGroup(groupIndex); 
    setSelectedItems((prevItems) => ({
      ...prevItems,
      [groupIndex]: null,
    }));

    navigate(fullPath);

  };

  return (
    <div className='page'>
      <div className="side-menu">
        {groups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <div
              className={`category-name ${expandedGroup === groupIndex ? 'expanded' : ''
                }`}
              onClick={() => handleGroupClick(groupIndex)}
            >
              {group.name === currentGroup ? (
                <strong>{group.name}</strong>
              ) : (
                group.name
              )}
              {group.name === 'Local Prototypes' && expandedGroup === groupIndex && (
                <span className="center-button">
                  <Link to="/create" className="create-button">
                    Create new prototype
                  </Link>
                </span>
              )}
              {group.name === 'Core Prototypes' && expandedGroup === groupIndex && (
                <span className="center-button">
                  <span className="invisible-button">
                    Invisibe button
                  </span>
                </span>
              )}
            </div>
            {expandedGroup === groupIndex && (
              <div className="category-content">
                {groupData[groupIndex] && (
                  <div className="content-scroll">
                    {groupData[groupIndex].map((prototype, itemIndex) => {
                      const formattedGroupName = group.name
                        .toLowerCase()
                        .replace(/\s+/g, '')
                        .replace('prototypes', '');
                      const fullPath = `/prototype/${formattedGroupName}/${prototype.unformattedName}`;
                      return (
                        <Link
                          to={fullPath}
                          key={`${groupIndex}-${itemIndex}`}
                          className={`menu-link ${selectedItems[groupIndex] === itemIndex
                              ? 'selected'
                              : ''
                            }`}
                          sx={{ fontSize: '15pt' }}
                          onClick={() => handleItemClick(fullPath, groupIndex)}
                        >
                          <div>
                            {prototype.unformattedName === currentPrototype ? (
                              <strong>{prototype.unformattedName}</strong>
                            ) : (
                              prototype.unformattedName
                            )}
                          </div>
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
    </div>
  );
}

export default SideMenu;