import { FormControl, MenuItem } from '@material-ui/core';
import { Modal, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import React, { useState, useEffect } from 'react';

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

function AddInheritanceModal({
                                 showInheritanceModal,
                                 selectedInheritedPrototype,
                                 handleInheritanceChange,
                                 inheritanceDropdownOptions,
                                 handleSaveInheritance,
                                 handleAddInheritanceToBatch,
                                 handleCancelInheritance,
                             }) {
    const [groupData, setGroupData] = useState({});

    useEffect(() => {
        // Fetch group data when the component mounts
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        const data = {};

        // Fetch group data here and update state using setGroupData
        // Example: use fetch or axios to fetch data and update the state
    };

    const saveInheritance = async () => {
        try {
            await handleSaveInheritance(selectedInheritedPrototype);
            handleCancelInheritance();
        } catch (error) {
            console.error('Error saving inheritance:', error);
        }
    };

    const addToBatch = () => {
       handleAddInheritanceToBatch(selectedInheritedPrototype);
       handleCancelInheritance();
    };

    return (
        <Modal
            open={showInheritanceModal}
            onClose={handleCancelInheritance}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div className="add-inheritance-form">
                    <h3 className="add-new-inheritance">Add Inherited Prototype</h3>

                    <FormControl sx={{ width: '300px' }}>
                        <TextField
                            required
                            label="Inherited Prototype"
                            size="medium"
                            select
                            value={selectedInheritedPrototype}
                            onChange={handleInheritanceChange}
                            SelectProps={{
                                displayEmpty: true,
                                renderValue: (selected) => (selected ? selected : ""),
                            }}
                            sx={{ width: '310px' }}
                        >
                            {inheritanceDropdownOptions.map((option) => (
                                <MenuItem key={option} value={option} sx={{ fontSize: 14 }}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </FormControl>

                    <div className="inheritance-button-container">
                        <button className="cancel-inheritance-button" onClick={handleCancelInheritance}>
                            Cancel
                        </button>

                        <button className="save-action-button" onClick={saveInheritance}>
                            Save
                        </button>

                        {/* Button for "Add to Batch" */}
                        <button className="add-action-batch-button" onClick={addToBatch}>
                            Add to Batch
                        </button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
}

export default AddInheritanceModal;
