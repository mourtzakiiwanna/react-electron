import { Modal, Stack, TextField, Checkbox, FormControlLabel, Button } from '@mui/material';
import './css/Prototype.css'; // Import your CSS file
import Box from '@mui/material/Box';
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Select, MenuItem, FormControl, InputLabel, ListSubheader, makeStyles} from '@material-ui/core';

let headers = new Headers();

  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Origin','http://localhost:3000');

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
    { name: 'Local Prototypes', url: 'http://localhost:8080/api/type/category/local' },
    { name: 'Core Prototypes', url: 'http://localhost:8080/api/type/category/core' },
    { name: 'Delta Prototypes', url: 'http://localhost:8080/api/type/category/delta' },
  ];

  const useStyles = makeStyles((theme) => ({
    subheader: {
      backgroundColor: 'white',
    },
  }));

  
  function UpdateFieldModal({
    showUpdateFieldModal,
    updatedFieldId,
    selectedUpdateFieldId,
    selectedUpdateFieldType,
    selectedUpdateFieldConstraint,
    handleUpdateFieldIdChange,
    handleUpdateFieldTypeChange,
    handleUpdateFieldConstraintChange,
    handleSaveUpdateField,
    handleCancelUpdateField,
    initialUpdateFieldType,
    initialUpdateFieldConstraint,
  }) {

    const saveField = async () => {
      try {
        // Assuming handleSaveInheritance is an async function that makes the API call
        console.log(updatedFieldId);
        console.log(selectedUpdateFieldType);
        console.log(selectedUpdateFieldConstraint);

        await handleSaveUpdateField(updatedFieldId, selectedUpdateFieldType, selectedUpdateFieldConstraint);
  
        // After successful API call, you can close the modal or perform any other actions
        handleCancelUpdateField();
      } catch (error) {
        console.error('Error saving field:', error);
        // Handle the error, show an alert, or perform other error handling actions
      }
    };
  
    console.log('updated field', updatedFieldId);
    const classes = useStyles();
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
  
  console.log("open",showUpdateFieldModal);
 

  return (
    <Modal open={showUpdateFieldModal} onClose={handleCancelUpdateField} aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description">
    <Box sx={style}>
      <div className="add-field-form">
        <h3 className="add-new-field">Update Field</h3>

        <FormControl sx={{ width: '300px'}}> 

        <Stack spacing={2} sx={{ margin: '10px' }}>
        
        {/* <TextField
                required
                id="outlined-required"
                label="Field Group ID"
                size="small"
                name="fgId"
                value={newFieldInfo.fgId}
                onChange={handleInputChange}
            /> */}

        <TextField
                id="outlined-required"
                label="Field ID"
                size="small"
                name="id"
                disabled                
                defaultValue={updatedFieldId}
                sx={{
                  width: '300px',
                  color: (theme) => (theme.palette.mode === 'light' ? theme.palette.grey[500] : theme.palette.grey[300]),
                }}
            />

            <TextField
            label="Value Type"
            size="small"
            name="valueType"
            select
            value={selectedUpdateFieldType}
            onChange={handleUpdateFieldTypeChange}
          
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


        {/* <TextField
                required
                id="outlined-required"
                label="Default Value"
                size="small"
                name="defaultValue"
                value={newFieldInfo.defaultValue}
                onChange={handleInputChange}
            /> */}
 
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
            id="outlined-required"
            label="Constraint"
            size="small"
            name="constraint"
            value={selectedUpdateFieldConstraint}
            onChange={handleUpdateFieldConstraintChange}
            defaultValue={initialUpdateFieldConstraint}
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
        </FormControl>

        <div className="field-button-container">
         
        <button className="cancel-field-button" onClick={handleCancelUpdateField}>
          Cancel
        </button>

        <button className="save-field-button" onClick={saveField}>
          Save
        </button>

      </div>
      </div>
      </Box>
    </Modal>
  );
};

export default UpdateFieldModal;