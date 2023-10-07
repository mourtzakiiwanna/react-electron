import React, { useState, useEffect, useRef } from 'react';
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
import Switch from '@mui/material/Switch';
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
import ToggleButton from '@mui/lab/ToggleButton';
import ToggleButtonGroup from '@mui/lab/ToggleButtonGroup';
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
import Typography from '@mui/material/Typography';

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

  const handleCloseConfirm = () => {
    setOpen(false);
  };

  const dataGridContainerRef = useRef(null);

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
    constraint: '',
    defaultValue: '',
  });
  const [addInheritance, setAddInheritance] = useState(false);
  const [newInheritance, setNewInheritance] = useState('');
  const [fieldToDelete, setFieldToDelete] = useState('');
  const [initialRows, setInitialRows] = useState([]);
  const [showAllInheritedPrototypes, setShowAllInheritedPrototypes] = useState(false);

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
      id: field.id,
      fieldId: field.id,
      attributeType: field.attributeType,
      constraints: field.constraints || '',
    }));
    
    setInitialRows(mappedFields);
    setRows(mappedFields); // Initialize 'rows' with data from 'initialRows'
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
    {
      field: 'attributeType',
      headerName: 'Attribute Type',
      width: 200,
      editable: true,
      type: 'singleSelect',
      headerClassName: 'super-app-theme--header',
      valueOptions: ['STANDALONE_FIELD', 'FIELD'],
    },
    { field: 'constraints', headerName: 'Constraints', width: 200, editable: true, headerClassName: 'super-app-theme--header'},
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 80,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

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
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
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
  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {

    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };



  const handleDeleteClick = (id) => () => {
    setFieldToDelete(id); // Set the fieldToDelete state with the ID of the field to be deleted
    setOpen(true);
  };


  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteConfirm = () => {
    console.log("Field to delete:", fieldToDelete);
    setRows(rows.filter((row) => row.fieldId !== fieldToDelete));
    setOpen(false);
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
    setIsFormVisible(false);
    setAddInheritance(false);
    setNewInheritance('');
    fetchData(); // Fetch data for the new prototype and initialize 'rows'
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
    // Add a click event listener to the document
    const handleClickOutside = (event) => {
      if (
        rowModesModel[selectedFIeldID]?.mode === GridRowModes.Edit &&
        dataGridContainerRef.current &&
        !dataGridContainerRef.current.contains(event.target)
      ) {
        // If the click is outside the DataGrid, cancel the edit mode
        setRowModesModel({
          ...rowModesModel,
          [selectedFIeldID]: { mode: GridRowModes.View, ignoreModifications: true },
        });
      }
    };

    // Attach the event listener
    document.addEventListener('click', handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [selectedFIeldID, rowModesModel]);


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

        {/* <button onClick={() => navigation("/")}  className="back-button">Back</button>  */}
        <div className='sticky-header'>
        <div className='header-and-button'>

          <span className="center-button">
                <Link to="/create" className="create-button">
                  Create new prototype
                </Link>
          </span>
          
            <Link to="/" className='link'>
            <Typography variant="h3" gutterBottom className='pageHeader' 
              sx ={{margin: '70px', marginBottom:'50px', textDecoration:'none', fontWeight: 'bold' ,letterSpacing: '2px', fontFamily:'Arial',
              '&:hover': { color: 'gray', textDecoration:'none'}

              }}>Digital Library</Typography>      
                  
            </Link>
            </div>

          <div className="header-info-container">
            <h2 className="prototype-header">{prototypeInfo.id}</h2>
            
            <div className="info-section">
              {/* <h3 className="subsubheader">Prototype information</h3> */}
              
              {!showAllInheritedPrototypes && (
              <p className="inherited-prototypes">
                <span>Inherited Prototypes:</span> {prototypeInfo.inheritedPrototypes.join(', ')}
              </p>
              )}

              {showAllInheritedPrototypes && (
                <p className="inherited-prototypes">
                  <span>Inherited Prototypes:</span> {prototypeInfo.allInheritedPrototypes.join(', ')}
                </p>
              )}

            {/* <Switch
              checked={showAllInheritedPrototypes}
              onChange={() => setShowAllInheritedPrototypes(!showAllInheritedPrototypes)}
              label="Label"
            > */}

            <FormControlLabel control={<Switch checked={showAllInheritedPrototypes} 
                onChange={() => setShowAllInheritedPrototypes(!showAllInheritedPrototypes)} />} 
                // label= {showAllInheritedPrototypes ? 'Hide All Inherited Prototypes' : 'Show All Inherited Prototypes'} 
                label={
                  <Box component="div" fontSize={13}>
                  {showAllInheritedPrototypes ? 'Hide All Inherited Prototypes' : 'Show All Inherited Prototypes'}</Box>}
                  />
              {/* {showAllInheritedPrototypes ? 'Hide All Inherited Prototypes' : 'Show All Inherited Prototypes'} */}

              <br></br>


              {showDropdown ? (
                <div className = "dropdown-section">
                  <FormControl
                    sx={{width: 400}}>
                  <InputLabel id="inherited-label"  sx = {{fontSize: 15}}>Inherited Prototype</InputLabel>

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

      
        
        <div className='field-section'>
        <div ref={dataGridContainerRef}>

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
                marginTop: '20px',
                height: 350,
                '& .textPrimary': {
                  color: 'text.primary',
                },
                '& .super-app-theme--header': {
                },
                
              }}
            >
              <DataGrid
                rows={rows}
                columns={columns}
                className = "fields-data"   
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                hideFooterPagination={true}
                hideFooter={true}
                slotProps={{
                  toolbar: { setRows, setRowModesModel },
                }}   
                sx={{ '& .MuiDataGrid-row': { marginTop: 1, marginBottom: 1 }, 
                '& .coloured': { textAlign: 'center', color: '#7181AD' },'& .MuiDataGrid-virtualScroller::-webkit-horizontal-scrollbar': {display: 'none' } }}
    
              />

            </Box>
            </div>
            <Dialog
              open={open}
              onClose={handleCloseConfirm}
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
                <Button onClick={handleCloseConfirm}>CANCEL</Button>
                <Button onClick={handleDeleteConfirm} autoFocus>
                DELETE
                </Button>
              </DialogActions>
            </Dialog>


  
      </div>
      </div>
    </div>
    </div>
  );
}

export default Prototype;