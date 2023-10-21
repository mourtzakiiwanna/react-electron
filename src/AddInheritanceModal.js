import React from 'react';
import { Modal, TextField} from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput'; // Import OutlinedInput
import Box from '@mui/material/Box';
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

  
  const useStyles = makeStyles((theme) => ({
    subheader: {
      backgroundColor: 'white',
    },
  }));


function AddInheritanceModal({
  showDropdown,
  selectedOption,
  handleDropdownChange,
  inheritanceDropdownOptions,
  handleSaveInheritance,
  handleCancel,
  handleAddInheritanceClick,
}) {

const classes = useStyles();
const isInputLabelShrunk = !!selectedOption; // Check if a value is selected

  return (
    <Modal open={showDropdown} onClose={handleCancel} aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description">
    <Box sx={style}>
      <div className="add-inheritance-form">
        <h3 className="add-new-inheritance">Add Inherited Prototype</h3>        
        
        <FormControl sx={{ width: '300px'}}> 
          <TextField
            required
            label="Inherited Prototype"
            size="medium"
            select
            value={selectedOption}
            onChange={handleDropdownChange}
            SelectProps={{
                displayEmpty: true,
                renderValue: (selected) => (selected ? selected : ""),
            }}
            sx={{ width: '280px' }}
          >
            {inheritanceDropdownOptions.map((option) => (
              <MenuItem key={option} value={option} sx={{ fontSize: 14 }}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>

        <button className="save-inheritance-button" onClick={handleSaveInheritance}>
          Save
        </button>
        <button className="cancel-inheritance-button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
      </Box>
    </Modal>
  );
}

export default AddInheritanceModal;
