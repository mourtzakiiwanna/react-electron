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
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { makeStyles } from '@mui/styles';
import { SxProps } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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


function Prototype(props) {
  let fID = 0;
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (id) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const navigation = useNavigate();
  const { groupName, prototypeName } = useParams();
  const [prototypeInfo, setPrototypeInfo] = useState();
  const [selectedFIeldID, setSelectedFIeldID] = useState();
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
        id: fID++,
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


  const theme = useTheme();



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
    { field: 'fieldId', headerName: 'Field ID', width: 200, editable: true ,headerClassName: 'super-app-theme--header'  },
    { field: 'attributeType', headerName: 'Attribute Type', width: 200, editable: true,  headerClassName: 'super-app-theme--header'},
    { field: 'constraints', headerName: 'Constraints', width: 200, editable: true, headerClassName: 'super-app-theme--header'},
    { field: 'alias', headerName: 'Alias', width: 200, editable: true, headerClassName: 'super-app-theme--header'},
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 200,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        setSelectedFIeldID(id);

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label=""
            size = 'small'
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
      
        ];
      },
    },
  ];


  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [rows, setRows] = React.useState(initialRows);
  console.log(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDelete = (id) => () => {
    console.log("clicked");
    // setOpen(false);
    console.log(id);
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
 

  useEffect(() => {
    setShowDropdown(false);
    setIsFormVisible(false); // Reset form visibility
    setAddInheritance(false); // Reset add inheritance flag
    setNewInheritance(''); // Reset new inheritance value
    fetchData(); // Fetch data for the new prototype
  }, [prototypeName, groupName]);
  
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
  }, [prototypeName, groupName]);

  const handleDropdownChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);
  };

  const handleAddInheritanceClick = () => {
    setSelectedOption(null);
    setShowDropdown(true);
  };

  const handleSaveInheritance = () => {
    setShowDropdown(false);
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
      <SideMenu currentGroup={groupName} currentPrototype={prototypeName} />
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
              <div className = "dropdown-section">
                <FormControl
                  sx={{width: 400}}>
                <InputLabel id="inherited-label"  sx = {{fontSize: 14}}>Inherited Prototype</InputLabel>

                <Select
                  value={selectedOption}
                  onChange={handleDropdownChange}
                  MenuProps={MenuProps}
                  labelId="inherited-label"
                  id="inherited"
                  sx={{ boxShadow: 'none', fontSize:15 }}
                  input={<OutlinedInput label="Inherited Prototype" 
                  />}

                >
          
              {dropdownOptions.map((option) => (
                  <MenuItem
                  key={option}
                  value={option}
                  sx = {{fontSize: 14}}
                >
                   {option}
                </MenuItem>
                ))}
                   
                </Select>
                </FormControl>
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
                className = "fields-data"   
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slotProps={{
                  toolbar: { setRows, setRowModesModel },
                }}       
              />

            </Box>

            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Delete Confirmation"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  You are going to delete this prototype. Are you sure?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>CANCEL</Button>
                <Button onClick={handleDelete} autoFocus>
                DELETE
                </Button>
              </DialogActions>
            </Dialog>


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