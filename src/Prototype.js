import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './css/Prototype.css'; // Import your CSS file
import SideMenu from './SideMenu';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';


import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from '@mui/x-data-grid-generator';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
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
  const [addInheritance, setAddInheritance] = useState(false);
  const [newInheritance, setNewInheritance] = useState('');
  const [initialRows, setInitialRows] = useState([]);

  const fetchData = async () => {
    
      let fullPath = '';

      if (groupName === 'core') {
        fullPath = 'butterfly' + '/' + groupName + '/' + prototypeName;
      } else {
        fullPath = groupName + '/' + prototypeName;
      }

      const response = await fetch(`http://localhost:8080/show?prototypePath=/${fullPath}&showSummary=true&showInheritance=true&showFields=true`);
      const data = await response.json();
      setPrototypeInfo(data);

      // Map prototypeInfo fields to initialRows
      const mappedFields = data.fields.map((field) => ({
        id: randomId(),
        fieldId: field.id,
        attributeType: field.attributeType,
        constraints: field.constraints || '',
        alias: field.alias || '',

      }));
      setInitialRows(mappedFields);

  };



      // Set initialRows

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


  const columns = [
    { field: 'fieldId', headerName: 'Field ID', width: 250, editable: true ,headerClassName: 'super-app-theme--header'  },
    { field: 'attributeType', headerName: 'Attribute Type', width: 250, editable: true,  headerClassName: 'super-app-theme--header'},
    { field: 'constraints', headerName: 'Constraints', width: 250, editable: true, headerClassName: 'super-app-theme--header'},
    { field: 'alias', headerName: 'Alias', width: 250, editable: true, headerClassName: 'super-app-theme--header'},

  ];

  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    let groupUrl = "";
    if (groupName === "local") {
      groupUrl = "getLocal";
    } else {
      groupUrl = "getCore";
    }
  
    // Fetch dropdown options from the URL when the component mounts
    fetch(`http://localhost:8080/${groupUrl}`) // Use backticks for template literals
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

        <button onClick={() => navigation("/")}  className="back-button">Back</button> 
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
              <button className="add-inheritance-button" onClick={handleAddInheritanceClick}>
                Add Inherited Prototype
              </button>
            )}
        </div>

        
        <div className='field-section'>

        <div className="subsubheader">Fields</div>
        {/* <ul className="fields-list">
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
        </ul> */}

        <Box
              sx={{
                
                width: '100%',
                marginTop: '10px',

                '& .textPrimary': {
                  color: 'text.primary',
                },
                '& .super-app-theme--header': {
                  
                },
                
              }}
            >
              <DataGrid
                rows={initialRows}
                columns={columns}
                editMode="row"
                className = "fields-data"            
              />
            </Box>


        {!isFormVisible && (
          <button className="add-field-button" onClick={handleToggleForm}>
            Add Field
          </button>
        )}
        {isFormVisible && (
          <div className="add-field-form">
            <h3 className = "add-new-field">Add New Field</h3>

        
            <Stack spacing={2} sx = {{'margin':'10px'}}>

                <TextField
                  required
                  id="outlined-required"
                  label="Field ID"
                  size="small"
                />


                <TextField
                  required
                  id="outlined-required"
                  label="Field Group ID"
                  size="small"

                />

                <TextField
                  required
                  id="outlined-required"
                  label="Value Type"
                  size="small"

                />

                <TextField
                  required
                  id="outlined-required"
                  label="Constraint"
                  size="small"

                />
                  
                  <TextField
                  required
                  id="outlined-required"
                  label="Default Value"
                  size="small"
                />




            <FormControlLabel control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 15 } }}/>} label="Trans" />
            <FormControlLabel control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 15 } }}/>} label="Array" />
            <FormControlLabel control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 15 } }}/>} label="Map" />

          </Stack>
 
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
    </div>
  );
}

export default Prototype;