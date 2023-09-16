import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/SideMenu.css'; // Make sure to link your CSS file correctly
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Box from '@mui/material/Stack';
import { useNavigate } from 'react-router'

function SideMenu() {
  const groups = [
    { name: 'Local Prototypes', url: 'http://localhost:8080/getLocal' },
    { name: 'Core Prototypes', url: 'http://localhost:8080/getCore' },
    { name: 'Delta Prototypes', url: 'http://localhost:8080/getDelta' },
  ];

  const [expandedGroup, setExpandedGroup] = useState(null);
  const [groupData, setGroupData] = useState({});
  const [selectedItems, setSelectedItems] = useState({}); // Track selected items by category
  const navigate = useNavigate()


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


  const handleItemClick = (fullPath) => {
    console.log(fullPath);
    navigate(fullPath);
    // setSelectedItems(prevItems => ({
    //   ...prevItems,
    //   [groupIndex]: itemIndex,
    // }));
  

  };
  
  return (
    <div className="side-menu">      
      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className="category" >
          <div
            className={`category-name ${expandedGroup === groupIndex ? 'expanded' : ''}`}
            onClick={() => handleGroupClick(groupIndex)}
          >
            {group.name}
          </div>
          {expandedGroup === groupIndex && (
            <div className="category-content">
              {groupData[groupIndex] && (
                <div className="content-scroll"> 
                  <div>
                  <Box sx={{ alignItems: 'flex-start', marginTop: '20px', marginBottom:'20px', marginLeft:'10px' }}>
                    <span className="all-local">
                    <Link to={`/${group.name.toLowerCase().replace(/\s+/g, '').replace("prototypes","")}` } className='all-local'>
                        All {group.name.toLowerCase().replace(/\s+/g, '').replace("prototypes","")} prototypes
                      </Link>
                      <NavigateNextIcon />
                    </span>
                  </Box>
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
                            selectedItems[groupIndex] === itemIndex ? 'selected' : ''}`} // Add class for selected item
                          onClick={() => handleItemClick(fullPath)} // Handle item click
                        >
                          <div>{prototype.formattedName}</div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default SideMenu;
