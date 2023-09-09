import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './css/Prototype.css'; // Import your CSS file
import SideMenu from './SideMenu';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

function Prototype() {

  const navigation = useNavigate();
  const { groupName, prototypeName } = useParams();
  const [prototypeInfo, setPrototypeInfo] = useState();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newFieldInfo, setNewFieldInfo] = useState({
    id: '',
    fgId: '',
    valueType: '',
    trans: false,
    array: false,
    map: false,
    constraint: '',
    defaultValue: '',
  });

  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Fetch dropdown options from the URL when the component mounts
    fetch("http://localhost:8080/getLocal")
      .then((response) => response.json())
      .then((data) => setDropdownOptions(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleDropdownChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);
  };

  const handleAddInheritanceClick = () => {
    setShowDropdown(true);
  };

  const handleSaveInheritance = () => {
    // Handle saving the selected inheritance here
    // You can use the value in 'selectedOption'
    // For example, send it to your server or update state
    setShowDropdown(false); // Hide the dropdown after saving
  };

  const handleCancel = () => {
    setShowDropdown(false);
  };

  // const [addInheritance, setAddInheritance] = useState(false);
  // const [newInheritance, setNewInheritance] = useState('');
  // const [dropdownOptions, setDropdownOptions] = useState([]);
  // const [showDropdown, setShowDropdown] = useState(false);

  // const [selectedOption, setSelectedOption] = useState("");

  // useEffect(() => {
  //   // Fetch dropdown options from the URL when the component mounts
  //   fetch("http://localhost:8080/getLocal")
  //     .then((response) => response.json())
  //     .then((data) => setDropdownOptions(data))
  //     .catch((error) => console.error("Error fetching data:", error));
  // }, []);

  // const handleDropdownChange = (e) => {
  //   const selectedValue = e.target.value;
  //   setSelectedOption(selectedValue);
  // };


    // const handleInputChange = (e) => {
    //   const value = e.target.value;
    //   setNewInheritance(value);

    //   // Show the dropdown when the input field is not empty
    //   setShowDropdown(value !== "");
    // };


  const fetchData = async () => {
    try {
      var fullPath = "";
      if (groupName == "core") {
        fullPath = "butterfly" + "/" + groupName + "/" + prototypeName;
      } else {
        fullPath = groupName + "/" + prototypeName;
      }
      console.log(fullPath);
      const response = await fetch(`http://localhost:8080/show?prototypePath=/${fullPath}&showSummary=true&showInheritance=true&showFields=true`);
      const data = await response.json();
      setPrototypeInfo(data);
    } catch (error) {
      console.error('Error fetching prototype data:', error);
    }
  };

  const handleToggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  

  const handleAddField = async () => {
    try {

      var fullPath = "";
      if (groupName == "core") {
        fullPath = "butterfly" + "/" + groupName + "/" + prototypeName;
      } else {
        fullPath = groupName + "/" + prototypeName;
      }
      const fieldUrl = `http://localhost:8080/addField?prototypePath=/${fullPath}&id=${newFieldInfo.id}&fgId=${newFieldInfo.fgId}&valueType=${newFieldInfo.valueType}&trans=${newFieldInfo.trans}&array=${newFieldInfo.array}&map=${newFieldInfo.map}&constraint=${newFieldInfo.constraint}&defaultValue=${newFieldInfo.defaultValue}`;

      const response = await fetch(fieldUrl);

      if (!response.ok) {
        console.error('Error adding field');
        return;
      }

      
      fetchData();
    } catch (error) {
      console.error('API call error:', error);
    }
  };




  // const handleAddInheritanceClick = () => {
  //   setAddInheritance(true); // Set addInheritance to true when the button is clicked
  // };

  // const handleSaveInheritance = async () => {
  //   try {
  //     var fullPath = "";
  //     if (groupName == "core") {
  //       fullPath = "butterfly" + "/" + groupName + "/" + prototypeName;
  //     } else {
  //       fullPath = groupName + "/" + prototypeName;
  //     }      
      
  //     const response = await fetch(`http://localhost:8080/updateInheritance?prototypePath=/${fullPath}&inheritedPrototypes=${newInheritance}`);

  //     if (!response.ok) {
  //       console.error('Error updating inheritance');
  //       return;
  //     }
  
  //     let responseData;

  //     const cloneResponse = response.clone(); // Clone the response object

  //     try {
  //       responseData = await cloneResponse.json(); // Attempt to parse JSON data
  //     } catch (error) {
  //       responseData = await response.text(); // Get the plain text response
  //     }

  //     if (responseData == "Updated") {
  //       alert("Prototype updated successfully!")
  //     } else {
  //       alert("This prototype does not exist or they are already inherited.")
  //     }

     

  //     setAddInheritance(false);
  //     setNewInheritance('');
  //     fetchData();
      
  //   } catch (error) {
  //     console.error('API call error:', error);
  //   }
  // };

  useEffect(() => {
    fetchData();
  }, [groupName, prototypeName]);

  if (!prototypeInfo) {
    return <Link to={"/"}></Link>;
  }



  return (
    <div>
      <SideMenu />
      <div className="main-content">
        <div className="prototype-container">
          <button onClick={() => navigation("/")} className="back-button">Back</button> 
          <h2 className="header">{prototypeInfo.id.replace(/([A-Z])/g, ' $1')}</h2>
          <div className="info-section">
            <h3 className="subsubheader">Prototype information</h3>
            <p className="info-prototypes">
              <p><span>ID:</span> {prototypeInfo.id}</p>
              <p><span>Abstract:</span> {prototypeInfo.isAbstract.toString()}</p>
              <p><span>Number of Fields:</span> {prototypeInfo.numOfFields}</p>
            </p>
          </div>
  

          <div className="inheritance-section">
            <h3 className="subsubheader">Inheritance</h3>
            <p className="inherited-prototypes">
              <span>Inherited Prototypes:</span> {prototypeInfo.inheritedPrototypes.join(', ')}
            </p>
            <p className="all-inherited-prototypes">
              <span>All Inherited Prototypes:</span> {prototypeInfo.allInheritedPrototypes.join(', ')}
            </p>
            {showDropdown ? (
              <div className="add-inheritance-input">
                <select
                  id="inheritedPrototype"
                  className="select-dropdown"
                  value={selectedOption}
                  onChange={handleDropdownChange}
                >
              <option value="" disabled >Select an inherited prototype</option>                  
              {dropdownOptions.map((option) => (
                    <option key={option} value={option} className="option">
                      {option}
                    </option>
                  ))}
                </select>
                <button className="save-button" onClick={handleSaveInheritance}>Save</button>
                <button className="cancel-button" onClick={handleCancel}>Cancel</button>

              </div>
            ) : (
              <button className="add-button" onClick={handleAddInheritanceClick}>
                Add Inherited Prototype
              </button>
            )}
        </div>
        
          <div className="subheader">Fields</div>
          <ul className="fields-list">
            {prototypeInfo.fields.map((field, index) => (
              <li key={index} className="field-item">
                <p><span>Field ID:</span> {field.id}</p>
                <p><span>Field Type:</span> {field.attributeType}</p>
                {field.constraints && (
                  <p><span>Constraints:</span> {field.constraints}</p>
                )}
                {field.alias && (
                  <p><span>Alias:</span> {field.alias}</p>
                )}
              </li>
            ))}
          </ul>
          {!isFormVisible && (
            <button className="add-field-button" onClick={handleToggleForm}>
              Add Field
            </button>
          )}
          {isFormVisible && (
            <div className="add-field-form">
              <h3>Add New Field</h3>
              <div className="field-input">
                <label>ID</label>
                <input
                  type="text"
                  value={newFieldInfo.id}
                  onChange={(e) =>
                    setNewFieldInfo({ ...newFieldInfo, id: e.target.value })
                  }
                />
              </div>
              <div className="field-input">
                <label>Field Group ID</label>
                <input
                  type="text"
                  value={newFieldInfo.fgId}
                  onChange={(e) =>
                    setNewFieldInfo({ ...newFieldInfo, fgId: e.target.value })
                  }
                />
              </div>
              <div className="field-input">
                <label>Constraint</label>
                <input
                  type="text"
                  value={newFieldInfo.constraint}
                  onChange={(e) =>
                    setNewFieldInfo({ ...newFieldInfo, constraint: e.target.value })
                  }
                />
              </div>
              <div className="field-input">
                <label>Default Value</label>
                <input
                  type="text"
                  value={newFieldInfo.defaultValue}
                  onChange={(e) =>
                    setNewFieldInfo({ ...newFieldInfo, defaultValue: e.target.value })
                  }
                />
              </div>
              <FormControlLabel control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 15 } }}/>} label="Value Type" />
              <FormControlLabel control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 15 } }}/>} label="Trans" />
              <FormControlLabel control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 15 } }}/>} label="Array" />
              <FormControlLabel control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 15 } }}/>} label="Map" />
              <button className="save-field-button" onClick={handleAddField}>
                Save
              </button>
              <button className="cancel-field-button" onClick={handleToggleForm}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  

}

export default Prototype;