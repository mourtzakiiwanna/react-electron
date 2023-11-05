import { Modal, Stack, TextField, Checkbox, FormControlLabel, Button } from '@mui/material';
import './css/Prototype.css'; // Import your CSS file
import Box from '@mui/material/Box';
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Select, MenuItem, FormControl, InputLabel, ListSubheader, makeStyles} from '@material-ui/core';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid white',
    boxShadow: 24,
    p: 4,
  };

  const groups = [
    { name: 'Local Prototypes', url: 'http://localhost:8080/getLocal' },
    { name: 'Core Prototypes', url: 'http://localhost:8080/getCore' },
    { name: 'Delta Prototypes', url: 'http://localhost:8080/getDelta' },
  ];

  const useStyles = makeStyles((theme) => ({
    subheader: {
      backgroundColor: 'white',
    },
  }));

  
  const AddFieldModal = ({ isOpen, handleClose, prototypeId, handleAddField, newFieldInfo, setNewFieldInfo }) => {

    const classes = useStyles();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;
        setNewFieldInfo((prevFieldInfo) => ({
          ...prevFieldInfo,
          [name]: fieldValue,
        }));
      };
    
     const handleSave = () => {                 
        handleAddField();
        handleClose();
    };

    const [groupData, setGroupData] = useState({});

    const fetchAllData = async () => {
      const data = {};
  
      for (const group of groups) {
        try {
          const response = await fetch(group.url);
          const groupData = await response.json();
          data[group.name] = groupData;
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
  
      setGroupData(data); // Set the fetched data to the state
    };
  
    useEffect(() => {
      // Fetch data for all groups when the component mounts
      fetchAllData();
    }, []);
  
  
 

  return (
    <Modal open={isOpen} onClose={handleClose} aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description">
    <Box sx={style}>
      <div className="add-field-form">
        <h3 className="add-new-field">Add New Field</h3>

        <Stack spacing={2} sx={{ margin: '10px' }}>
        
        <TextField
                required
                id="outlined-required"
                label="Field Group ID"
                size="small"
                name="fgId"
                value={newFieldInfo.fgId}
                onChange={handleInputChange}
            />

        <TextField
                required
                id="outlined-required"
                label="Field ID"
                size="small"
                name="id"
                value={newFieldInfo.id}
                onChange={handleInputChange}
            />

            <TextField
            required
            label="Value Type"
            size="small"
            name="valueType"
            select
            value={newFieldInfo.valueType}
            onChange={handleInputChange}
            SelectProps={{
                displayEmpty: true,
                renderValue: (selected) => (selected ? selected : ""),
            }}
            >
                <MenuItem value="TEXT">TEXT</MenuItem>
                <MenuItem value="BIGTEXT">BIGTEXT</MenuItem>
                <MenuItem value="RICHTEXT">RICHTEXT</MenuItem>
                <MenuItem value="KEYWORD">KEYWORD</MenuItem>
                <MenuItem value="MIMETYPE">MIMETYPE</MenuItem>
                <MenuItem value="EMAIL">EMAIL</MenuItem>
                <MenuItem value="URL">URL</MenuItem>
                <MenuItem value="BOOL">BOOL</MenuItem>
                <MenuItem value="NUMBER">NUMBER</MenuItem>
                <MenuItem value="YEAR">YEAR</MenuItem>
                <MenuItem value="DATE">DATE</MenuItem>
                <MenuItem value="REF">REF</MenuItem>
                <MenuItem value="REF_PATH">REF_PATH</MenuItem>
                <MenuItem value="EMBED">EMBED</MenuItem>
                <MenuItem value="FILE_PATH">FILE_PATH</MenuItem>
                <MenuItem value="FILE">FILE</MenuItem>
                <MenuItem value="LOCALE">LOCALE</MenuItem>
                <MenuItem value="PROTOTYPE">PROTOTYPE</MenuItem>
                <MenuItem value="DATASTORE">DATASTORE</MenuItem>
                <MenuItem value="DATAINDEX">DATAINDEX</MenuItem>
                <MenuItem value="SCHEME">SCHEME</MenuItem>
                <MenuItem value="FIELD">FIELD</MenuItem>
                <MenuItem value="FIELD_GROUP">FIELD_GROUP</MenuItem>
                <MenuItem value="FIELD_DEF">FIELD_DEF</MenuItem>
                <MenuItem value="FIELD_GROUP_DEF">FIELD_GROUP_DEF</MenuItem>
                <MenuItem value="GEO_POINT">GEO_POINT</MenuItem>
            </TextField>


        <TextField
                required
                id="outlined-required"
                label="Default Value"
                size="small"
                name="defaultValue"
                value={newFieldInfo.defaultValue}
                onChange={handleInputChange}
            />
 
        {/* <TextField
            required
            label="Attribute Type"
            size="small"
            name="attributeType"
            select
            value={newFieldInfo.attributeType}
            onChange={handleInputChange}
            SelectProps={{
                displayEmpty: true,
                renderValue: (selected) => (selected ? selected : ""),
            }}
            >
                <MenuItem value="STANDALONE_FIELD">STANDALONE_FIELD</MenuItem>
                <MenuItem value="FIELD">FIELD</MenuItem>
                <MenuItem value="FIELD_GROUP">FIELD_GROUP</MenuItem>
                <MenuItem value="SCHEME">SCHEME</MenuItem>
                <MenuItem value="SCHEME_FIELD">SCHEME_FIELD</MenuItem>
        </TextField> */}

        <TextField
            required
            id="outlined-required"
            label="Constraint"
            size="small"
            name="constraint"
            value={newFieldInfo.constraint}
            onChange={handleInputChange}
            select
            multiple
            renderValue={(selected) => {
                if (selected.length === 0) {
                return 'Select a constraint';
                }
                return selected.map((value) => {
                const [groupName, optionValue] = value.split('/');
                return `${groupName.replace(" Prototypes", "").toLowerCase().replace(" ", "").replace(/^/, '/')}/${value}`;
                }).join(', ');
            }}
            >
            <MenuItem value="">Select a constraint</MenuItem>
            {Object.entries(groupData).flatMap(([groupName, groupValues], index) => [
                <ListSubheader key={groupName} classes={{ root: classes.subheader }} disabled={index !== 0}>
                {groupName}
                </ListSubheader>,
                ...groupValues.map((value) => (
                <MenuItem key={value} value={`${groupName}/${value}`}>
                    {`${groupName.replace(" Prototypes", "").toLowerCase().replace(" ", "").replace(/^/, '/')}/${value}`}
                </MenuItem>
                )),
            ])}
            </TextField>
        </Stack>

        <div className="field-button-container">
         
        <button className="cancel-field-button" onClick={handleClose}>
          Cancel
        </button>

        <button className="save-field-button" onClick={handleSave}>
          Save
        </button>

      </div>
      </div>
      </Box>
    </Modal>
  );
};

export default AddFieldModal;