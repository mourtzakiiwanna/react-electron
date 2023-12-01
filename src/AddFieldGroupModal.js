import React from 'react';
import { Modal, TextField} from '@mui/material';
import Box from '@mui/material/Box';
import {FormControl} from '@material-ui/core';

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
  
  function AddFieldGroupModal({
    showFieldGroupModal,
    selectedFieldGroup,
    handleFieldGroupChange,
    handleSaveFieldGroup,
    handleCancelFieldGroup,
  }) {
  
    const saveFieldGroup = async () => {
      try {
        await handleSaveFieldGroup(selectedFieldGroup);
        handleCancelFieldGroup();
      } catch (error) {
        console.error('Error saving field group:', error);
      }
    };
  
    return (
      <Modal
        open={showFieldGroupModal}
        onClose={handleCancelFieldGroup}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
    <Box sx={style}>
      <div className="add-inheritance-form">
        <h3 className="add-new-inheritance">Add Field Group</h3>        
        
        <FormControl sx={{ width: '300px'}}> 
          <TextField
            required
            label="Field Group"
            size="medium"
            value={selectedFieldGroup}
            onChange={handleFieldGroupChange}
            sx={{ width: '300px' }}
          >
          </TextField>
        </FormControl>

        <div className="inheritance-button-container">
          <button className="cancel-inheritance-button" onClick={handleCancelFieldGroup}>
            Cancel
          </button>

          <button className="save-inheritance-button" onClick={saveFieldGroup}>
            Save
          </button>
        </div>
        </div>
      </Box>
    </Modal>
  );
}

export default AddFieldGroupModal;
