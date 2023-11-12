import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/SideMenu.css';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Box from '@mui/material/Stack';
import { useNavigate } from 'react-router';

function SideMenu(props) {
  const groups = [
    { name: 'Local Prototypes', url: 'http://localhost:8080/getLocal' },
    { name: 'Core Prototypes', url: 'http://localhost:8080/getCore' },
    { name: 'Delta Prototypes', url: 'http://localhost:8080/getDelta' },
  ];

  const { currentGroup, currentPrototype } = props;
  const [expandedGroup, setExpandedGroup] = useState(0); // Set the default group to expand
  const [groupData, setGroupData] = useState({});
  const [openForm, setOpenForm] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});

  const navigate = useNavigate();

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
      setExpandedGroup(null); // Collapse the group
      setOpenForm(false);
    } else {
      setExpandedGroup(index); // Expand the group
      setOpenForm(false);
    }
  };

  const handleItemClick = (fullPath, groupIndex) => {
    setExpandedGroup(groupIndex); // Expand the group when an item is clicked
    setOpenForm(false);
    setSelectedItems(prevItems => ({
      ...prevItems,
      [groupIndex]: null,
    }));
    navigate(fullPath);
  };

  return (
    <div className='page'>
    <span className="center-button">
      <Link to="/create" className="create-button">
        Create new prototype
      </Link>
    </span> 
    <div className="side-menu">
      {groups.map((group, groupIndex) => (
        <div key={groupIndex}>
          <div
            className={`category-name ${
              expandedGroup === groupIndex ? 'expanded' : ''
            }`}
            onClick={() => handleGroupClick(groupIndex)}
          >
            {group.name === currentGroup ? (
              <strong>{group.name}</strong>
            ) : (
              group.name
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
                        className={`menu-link ${
                          selectedItems[groupIndex] === itemIndex
                            ? 'selected'
                            : ''
                        }`}
                        sx={{ fontSize: '15pt' }}
                        onClick={() => handleItemClick(fullPath, groupIndex)} // Pass groupIndex
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
