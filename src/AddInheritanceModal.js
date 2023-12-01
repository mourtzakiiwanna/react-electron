import React from 'react';
import { Modal, TextField} from '@mui/material';
import Box from '@mui/material/Box';
import {  MenuItem, FormControl} from '@material-ui/core';

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
    handleCancelInheritance,
  }) {
  
    const saveInheritance = async () => {
      try {
        // Assuming handleSaveInheritance is an async function that makes the API call
        await handleSaveInheritance(selectedInheritedPrototype);
  
        // After successful API call, you can close the modal or perform any other actions
        handleCancelInheritance();
      } catch (error) {
        console.error('Error saving inheritance:', error);
        // Handle the error, show an alert, or perform other error handling actions
      }
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
        
        <FormControl sx={{ width: '300px'}}> 
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
            sx={{ width: '300px' }}
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

          <button className="save-inheritance-button" onClick={saveInheritance}>
            Save
          </button>
        </div>
        </div>
      </Box>
    </Modal>
  );
}

export default AddInheritanceModal;
