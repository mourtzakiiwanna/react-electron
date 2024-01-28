import {FormControl, ListSubheader, MenuItem, makeStyles} from '@material-ui/core';
import {Modal, Stack, TextField} from '@mui/material';
import Box from '@mui/material/Box';
import * as React from 'react';
import {useEffect, useState} from 'react';
import '../css/Prototype.css';

const baseURL = 'http://localhost:8080/api/type';

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
    {name: 'Local Prototypes', url: `${baseURL}/category/local`},
    {name: 'Core Prototypes', url: `${baseURL}/category/core`},
];

const useStyles = makeStyles((theme) => ({
    subheader: {
        backgroundColor: 'white',
    },
}));


function AddFieldModal({
                           showFieldModal,
                           selectedFieldId,
                           selectedFieldType,
                           selectedFieldConstraint,
                           handleFieldIdChange,
                           handleFieldTypeChange,
                           handleFieldConstraintChange,
                           handleSaveField,
                           handleCancelField,
                           handleAddFieldToBatch
                       }) {


                        
    const saveField = async () => {
        try {
            await handleSaveField(selectedFieldId, selectedFieldType, selectedFieldConstraint);
            handleCancelField();
        } catch (error) {
            console.error('Error saving field:', error);
        }
    };

    const addToBatch = () => {
        handleAddFieldToBatch(selectedFieldId, selectedFieldType, selectedFieldConstraint);
        handleCancelField();
    };


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

        setGroupData(data);
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    return (
        <Modal open={showFieldModal} onClose={handleCancelField} aria-labelledby="modal-modal-title"
               aria-describedby="modal-modal-description">
            <Box sx={style}>
                <div className="add-field-form">
                    <h3 className="add-new-field">Add Field</h3>

                    <FormControl sx={{width: '300px'}}>

                        <Stack spacing={2} sx={{margin: '10px'}}>

                            <TextField
                                required
                                id="outlined-required"
                                label="Field ID"
                                size="small"
                                name="id"
                                value={selectedFieldId}
                                onChange={handleFieldIdChange}
                                sx={{width: '300px'}}

                            />

                            <TextField
                                label="Value Type"
                                size="small"
                                name="valueType"
                                select
                                value={selectedFieldType}
                                onChange={handleFieldTypeChange}
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
                                id="outlined-required"
                                label="Constraint"
                                size="small"
                                name="constraint"
                                value={selectedFieldConstraint}
                                onChange={handleFieldConstraintChange}
                                select
                                multiple
                                renderValue={(selected) => {
                                    if (selected.length === 0) {
                                        return 'Select a constraint';
                                    }
                                    return selected.map((value) => {
                                        const [groupName] = value.split('/');
                                        return `${groupName.replace(" Prototypes", "").toLowerCase().replace(" ", "").replace(/^/, '/')}/${value}`;
                                    }).join(', ');
                                }}
                            >
                                <MenuItem value="">Select a constraint</MenuItem>
                                {Object.entries(groupData).flatMap(([groupName, groupValues], index) => [
                                    <ListSubheader key={groupName} classes={{root: classes.subheader}}
                                                   disabled={index !== 0}>
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

                        <button className="cancel-field-button" onClick={handleCancelField}>
                            Cancel
                        </button>

                        <button className="save-action-button" onClick={saveField}>
                            Save
                        </button>

                        <button className="add-action-batch-button" onClick={addToBatch}>
                            Add to Batch
                        </button>

                    </div>
                </div>
            </Box>
        </Modal>
    );
};

export default AddFieldModal;