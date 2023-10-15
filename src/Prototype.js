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
import InputAdornment from '@mui/material/InputAdornment';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'; 
import MuiAlert  from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import AddFieldModal from './AddFieldModal';

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

const groups = [
  { name: 'Local Prototypes', url: 'http://localhost:8080/getLocal' },
  { name: 'Core Prototypes', url: 'http://localhost:8080/getCore' },
  { name: 'Delta Prototypes', url: 'http://localhost:8080/getDelta' },
];

function Prototype(props) {
  const navigate = useNavigate()

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

  const [openAlert, setOpenAlert] = React.useState(false);


  const dataGridContainerRef = useRef(null);

  const [editRowId, setEditRowId] = useState(null);

  const navigation = useNavigate();
  const { groupName, prototypeName } = useParams();
  const [prototypeInfo, setPrototypeInfo] = useState();
  const [selectedFIeldID, setSelectedFIeldID] = useState();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newFieldInfo, setNewFieldInfo] = useState({
    id: '',
    fgId: '',
    valueType: '',
    constraint: '',
    defaultValue: '',
    attributeType: '',
  });

  const handleFieldToggleForm = () => {
    console.log("clicked");
    setIsFormVisible(!isFormVisible);
    if (!isFormVisible) {
      setNewFieldInfo({
        id: '',
        fgId: '',
        valueType: '',
        constraint: '',
        defaultValue: '',
        attributeType: '',
      });
    }
  };
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
      fgID: field.fgID ,
      fieldId: field.id,
      valueType: field.valueType,
      defaultValue: field.defaultValue,
      attributeType: field.attributeType,
      constraints: field.constraints || '',
      isMap: field.isMap,
    }));
    
    setInitialRows(mappedFields);
    setRows(mappedFields); 

    // // Map prototypeInfo fields to initialRows
    // const isMap = data.fields.map((field) => ({
    //   id: field.id,
    //   isMap: field.map,
    // }));
    
  };
  

      // Set initialRows

  const handleToggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };


  const theme = useTheme();



  const handleAddField = async () => {
    try {
      // Retrieve the necessary values from the newFieldInfo state
      const { id, fgId, valueType, constraint, defaultValue, attributeType } = newFieldInfo;
  
      var fullPath = '';
      if (groupName === 'core') {
        fullPath = 'butterfly' + '/' + groupName + '/' + prototypeName;
      } else {
        fullPath = groupName + '/' + prototypeName;
      }
      const fieldUrl = `http://localhost:8080/addField?prototypePath=/${fullPath}&id=${id}&fgId=${fgId}&valueType=${valueType}&constraint=${constraint}&defaultValue=${defaultValue}&attributeType=${attributeType}`;
      console.log("fieldUrl", fieldUrl);

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




  const columns = [
    { field: 'fgID', headerName: 'Group', width: 200, editable: true ,headerClassName: 'super-app-theme--header'  },
    { field: 'fieldId', headerName: 'Field ID', width: 220, editable: true ,headerClassName: 'super-app-theme--header'  },
    { field: 'valueType', 
      headerName: 'Value Type', 
      width: 150, 
      editable: true ,
      type: 'singleSelect',
      headerClassName: 'super-app-theme--header',
        valueOptions: ['TEXT',
        'BIGTEXT',
        'RICHTEXT',
        'KEYWORD',
        'MIMETYPE',
        'EMAIL',
        'URL',
        'BOOL',
        'NUMBER',
        'YEAR',
        'DATE',
        'REF',
        'REF_PATH',
        'EMBED',
        'FILE_PATH',
        'FILE',
        'LOCALE',
        'PROTOTYPE',
        'DATASTORE',
        'DATAINDEX',
        'SCHEME',
        'FIELD',
        'FIELD_GROUP',
        'FIELD_DEF',
        'FIELD_GROUP_DEF',
        'GEO_POINT']}, 

    { field: 'defaultValue', headerName: 'Default Value', width: 200, editable: true ,headerClassName: 'super-app-theme--header'  },

    {
      field: 'attributeType',
      headerName: 'Attribute Type',
      width: 200,
      editable: true,
      type: 'singleSelect',
      headerClassName: 'super-app-theme--header',
      valueOptions: ['STANDALONE_FIELD', 'FIELD', 'FIELD_GROUP', 'SCHEME', 'SCHEME_FIELD'],
    },
    { 
      field: 'constraints', 
      headerName: 'Constraints', 
      width: 220, 
      headerClassName: 'super-app-theme--header',
      editable: true, 
      renderEditCell: (params) => (
        <FormControl style={{ width: 200 }}>
          <Select
            label={params.field}
            value={params.value}
            onChange={(e) => {
              const selectedValue = e.target.value;
              const groupName = params.value; // Get the selected groupName
              const formattedValue = `/${groupName}/${selectedValue}`; // Format the value
              console.log(formattedValue); // Log the selected value
              params.api.setEditCellValue({ id: params.id, field: params.field, value: selectedValue });
            }}
            onBlur={(e) => params.api.setEditCellValue({ id: params.id, field: params.field, value: e.target.value })}
            inputProps={{
              name: 'constraints',
              id: 'constraints',
            }}
          >
            {Object.entries(groupData).flatMap(([groupName, groupValues]) => [
              <MenuItem key={groupName} value={groupName} disabled>
                {groupName}
              </MenuItem>,
              ...groupValues.map((value) => (
                <MenuItem key={value} value={value}>
                  {groupName.replace("Prototypes", "").toLowerCase().replace(" ", "").replace(/^/, '/')}/{value}
                </MenuItem>
              )),
            ])}
          </Select>
        </FormControl>
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 50,
      cellClassName: 'actions',
      renderCell: (params) => {
        if (params.row.isMap) {
          const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
    
          if (isInEditMode) {
            return (
              <>
                <GridActionsCellItem
                  icon={<SaveIcon />}
                  label="Save"
                  sx={{
                    color: 'primary.main',
                  }}
                  onClick={handleSaveClick(params.id)}
                />
                <GridActionsCellItem
                  icon={<CancelIcon />}
                  label="Cancel"
                  className="textPrimary"
                  onClick={handleCancelClick(params.id)}
                  color="inherit"
                />
              </>
            );
          }
    
          return (
            <>
              <GridActionsCellItem
                icon={<EditIcon />}
                label="Edit"
                className="textPrimary"
                onClick={handleEditClick(params.id)}
                color="inherit"
              />
              <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                onClick={handleDeleteClick(params.id)}
                color="inherit"
              />
            </>
          );
        }
        return null; // Hide actions for non-map fields
      },
    },
  ];

  const [inheritanceDropdownOptions, setinheritanceDropdownOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState({});

  

  const handleEditClick = (id) => () => {

    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleCellDoubleClick = (params) => {
    if (!params.row.isMap) {
      setOpenAlert(true);
      setTimeout(() => {
        setOpenAlert(false);
      }, 3000);
      return;
    }
    handleEditClick(params.id);
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }

  

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
    setShowAllInheritedPrototypes(false);
    setNewFieldInfo({
      id: '',
      fgId: '',
      valueType: '',
      constraint: '',
      defaultValue: '',
      attributeType: '',
    });
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
      .then((data) => setinheritanceDropdownOptions(data))
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

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handlePrototypeClick = (fullPath) => {
    navigate(fullPath);
  };

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
              
              {!showAllInheritedPrototypes && prototypeInfo.inheritedPrototypes.length > 0 && (
                <p className="inherited-prototypes">
                  <span>Inherited Prototypes:</span>{" "}
                  {prototypeInfo.inheritedPrototypes.map((prototype, index) => {
                    const fullPath = `/prototype${prototype.replace("butterfly/","")}`;
                    return (
                      <Link to={fullPath} key={`${groupName}-${index}`}>
                        <div onClick={() => handlePrototypeClick(fullPath)}>
                          {prototype}
                        </div>
                      </Link>
                    );
                  })}
                </p>
              )}
                            

              {showAllInheritedPrototypes && (
                <p className="inherited-prototypes">
                  <span>Inherited Prototypes:</span> {" "}
                  {prototypeInfo.allInheritedPrototypes.map((prototype, index) => {
        
                    const fullPath = `/prototype${prototype.replace("butterfly/","")}`;
                    return (
                      <Link
                        to={fullPath}
                        key={`${groupName}-${index}`}
                      >
                        <div onClick={() => handlePrototypeClick(fullPath)}>
                          {prototype}
                        </div>
                      </Link>
                    );
                  })}
                </p>
              )}

            {/* <Switch
              checked={showAllInheritedPrototypes}
              onChange={() => setShowAllInheritedPrototypes(!showAllInheritedPrototypes)}
              label="Label"
            > */}

              {prototypeInfo.allInheritedPrototypes.length > 0  && 
              (<FormControlLabel control={<Switch checked={showAllInheritedPrototypes} 
                onChange={() => setShowAllInheritedPrototypes(!showAllInheritedPrototypes)} />} 
                // label= {showAllInheritedPrototypes ? 'Hide All Inherited Prototypes' : 'Show All Inherited Prototypes'} 
                label={
                  <Box component="div" fontSize={13}>
                  {showAllInheritedPrototypes ? 'Hide All Inherited Prototypes' : 'Show All Inherited Prototypes'}</Box>}
                  />)}
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
            
                {inheritanceDropdownOptions.map((option) => (
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

          {/* {!isFormVisible && (
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
          )} */}

            {!isFormVisible && (
              <button className="add-field-button" onClick={handleFieldToggleForm}>
                Add Field
              </button>
            )}    

            {isFormVisible && (
              <AddFieldModal
                isOpen={true}
                handleClose={handleFieldToggleForm}
                prototypeId={prototypeInfo.id}
                handleAddField={handleAddField}
                newFieldInfo={newFieldInfo}
                setNewFieldInfo={setNewFieldInfo}
              />
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
                height: 450,
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
                className="overflow-grid"
                editMode={'row'}
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                isCellEditable={(params) => params.row.isMap}
                disableEdit={(params) => !params.row.isMap}
                onCellDoubleClick={handleCellDoubleClick}
                hideFooterPagination={true}
                hideFooter={true}
                initialState={{
                  sorting: {
                    sortModel: [{ field: 'fgID', sort: 'asc' }]}
                }}
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
    <Snackbar open={openAlert}>
      <Alert icon={false} severity="info"  sx={{ width: '100%' }}>
        This field is not editable in this prototype.
      </Alert>
    </Snackbar>
    </div>
  );
}

export default Prototype;