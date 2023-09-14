import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './css/Prototype.css'; // Import your CSS file
import SideMenu from './SideMenu';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import TextField, { textFieldClasses } from '@mui/material/TextField';
import Autocomplete, { autocompleteClasses }  from '@mui/material/Autocomplete'
import { makeStyles } from "@material-ui/core/styles";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

import MailIcon from '@mui/icons-material/Mail';
import DeleteIcon from '@mui/icons-material/Delete';
import Label from '@mui/icons-material/Label';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import InfoIcon from '@mui/icons-material/Info';
import ForumIcon from '@mui/icons-material/Forum';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { styled, useTheme } from '@mui/material/styles';

import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';


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

  const useStyles = makeStyles({
  
    option: {
      backgroundColor: "transparent",
      margin: "3px",
      border: "none",
      borderRadius: "0px"
    }, 
    popupIndicator: {
      margin: "10px"
    },
    clearIndicator: {
      margin: "10px"
    },
    textfield: {
      width: "400px"
    }
  });

  const classes = useStyles();



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





  useEffect(() => {
    fetchData();
  }, [groupName, prototypeName]);

  if (!prototypeInfo) {
    return <Link to={"/"}></Link>;
  }

  console.log(dropdownOptions);

 


  return (
    <div>
      <div className="main-content">

      <SideMenu></SideMenu>

        <div className="prototype-container">
          <button onClick={() => navigation("/")} className="back-button">Back</button> 
          <h2 className="header">{prototypeInfo.id.replace(/([A-Z])/g, ' $1')}</h2>
          <div className="info-section">
            <h3 className="subsubheader">Prototype information</h3>
            <p className="info-prototypes">
              <p><span>ID:</span> {prototypeInfo.id}</p>
                        
              <p><span>Number of Fields:</span> {prototypeInfo.numOfFields}</p>
              <p>
                <span >Abstract:</span> 
                {prototypeInfo.isAbstract ? (
                  < CheckIcon style={{ color: 'gray', marginLeft : "7px", size : "small", fontSize: "20" }} />
                  ) : (
                  < CloseIcon style={{ color: 'gray', marginLeft : "7px", size : "small", fontSize: "20" }} />
                )}
              </p> 
            </p>
          </div>
  

          <div className="inheritance-section">
            <h3 className="subsubheader">Inheritance</h3>
            <p className="inherited-prototypes">
                {prototypeInfo.inheritedPrototypes.length > 0 ? (
                    <div><span>Inherited Prototypes:</span> {prototypeInfo.inheritedPrototypes.join(', ')}</div> 
              ) : ( <p className='alt-text'>This prototype has no inherited prototypes.</p>)}
              
            </p>
            {/* <p className="all-inherited-prototypes">
              <span>All Inherited Prototypes:</span> {prototypeInfo.allInheritedPrototypes.join(', ')}
            </p> */}
            {showDropdown ? (
              <div className="add-inheritance-input">
                {/* <select
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
                </select> */}

                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  size="medium"
                  options={dropdownOptions}
                  classes={{ option: classes.option}}
                  sx={{
                    borderRadius: '8px',
                    margin: '5px',
                    marginLeft: '0px',
                    width: '300px',                                     
                  }}
                renderInput={(params) => <TextField {...params} label="Select prototype"  id="standard-basic" variant="standard" 

        

                />}
                />

       

                <button className="save-button" onClick={handleSaveInheritance}>Save</button>
                <button className="cancel-button" onClick={handleCancel}>Cancel</button>

              </div>
            ) : (
              <button className="add-inheritance-button" onClick={handleAddInheritanceClick}>
                Add Inherited Prototype
              </button>
            )}
        </div>

        
        
          <div className="subheader">Fields</div>
          {prototypeInfo.inheritedPrototypes.length > 0 ? (
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
          ) : ( <p className='alt-text'>This prototype has no fields.</p>)}

         
          {!isFormVisible && (
            <button className="add-field-button" onClick={handleToggleForm}>
              Add Field
            </button>
          )}
          {isFormVisible && (
            <div>
              <Card sx={{ width: '50%', marginTop:"20px" }}>
                <CardContent>
                  <h3 className='subsubheader'>Add New Field</h3>
              
                  <Stack spacing={1.5}>

                    <TextField
                      required
                      id="standard-required"
                      label="ID"
                      defaultValue=""
                      variant="standard"
                      type="text"
                      sx = {{ width : "70%"}}
                      value={newFieldInfo.id}
                      onChange={(e) =>
                        setNewFieldInfo({ ...newFieldInfo, id: e.target.value })
                      }
                    />
                  

                    <TextField
                      required
                      id="standard-required"
                      label="Field Group ID"
                      defaultValue=""
                      variant="standard"
                      type="text"
                      sx = {{ width : "70%"}}
                      value={newFieldInfo.fgId}
                      onChange={(e) =>
                        setNewFieldInfo({ ...newFieldInfo, fgId: e.target.value })
                      }
                    />

                    <TextField
                      required
                      id="standard-required"
                      label="Constraint"
                      defaultValue=""
                      sx = {{ width : "70%"}}
                      variant="standard"
                      type="text"
                      value={newFieldInfo.constraint}
                      onChange={(e) =>
                        setNewFieldInfo({ ...newFieldInfo, constraint: e.target.value })
                      }
                    />

                    <TextField
                      required
                      id="standard-required"
                      label="Default Value"
                      defaultValue=""
                      sx = {{ width : "70%"}}
                      variant="standard"
                      type="text"
                      value={newFieldInfo.defaultValue}
                      onChange={(e) =>
                        setNewFieldInfo({ ...newFieldInfo, defaultValue: e.target.value })
                      }
                    />


                <FormControl sx={{ m: 4}} component="fieldset" variant="standard">
                      <FormGroup sx={{marginTop: "10px"}}>
                        <FormControlLabel
                          control={
                            <Checkbox name="valueType" color="default" size="small" />
                          }
                          label="Value Type"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox  name="trans" color="default" size="small" />
                          }
                          label="Trans"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox name="array" color="default" size="small" />
                          }
                          label="Array"
                        />

                        <FormControlLabel
                          control={
                            <Checkbox name="map" color="default" size="small" />
                          }
                          label="Map"
                        />
                      </FormGroup>
                  </FormControl>
              
                  <span>
                    <button className="save-field-button" onClick={handleAddField} >
                      Save
                    </button>
                    <button className="cancel-field-button" onClick={handleToggleForm}>
                      Cancel
                    </button>
                  </span>
                  </Stack>
                </CardContent>
              </Card>
            </div>

          )}
        </div>
      </div>
    </div>
  );
  

}

export default Prototype;