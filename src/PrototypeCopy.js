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
import Switcher from '@mui/joy/Switch';
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
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import AddFieldModal from './AddFieldModal';
import InheritanceModal from './AddInheritanceModal';


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
  const [openInherited, setOpenInherited] = React.useState(false);

  const handleClickOpen = (id) => {
    setOpen(true);
  };

  const handleCloseConfirm = () => {
    setOpen(false);
  };

  const handleCloseConfirmInherited = () => {
    setOpenInherited(false);
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
      });
    }
  };
  const [addInheritance, setAddInheritance] = useState(false);
  const [newInheritance, setNewInheritance] = useState('');

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const handleSaveInheritance = () => {
    setShowDropdown(false);
  };

  const handleCancel = () => {
    setShowDropdown(false);

  };


  const handleAddInheritanceClick = () => {
    setSelectedOption(null);
    setShowDropdown(true);
  };


  const [inheritanceDropdownOptions, setinheritanceDropdownOptions] = useState([]);


  const [fieldToDelete, setFieldToDelete] = useState('');
  const [inheritedToDelete, setInheritedToDelete] = useState('');

  const [initialRows, setInitialRows] = useState([]);
  const [showAllInheritedPrototypes, setShowAllInheritedPrototypes] = useState(false);
  const [fieldMap, setFieldMap] = useState([]);

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
  
    const mappedFields = data.fields.map((field) => ({
      id: field.id,
      fgID: field.fgID,
      fieldId: field.id,
      valueType: field.valueType,
      defaultValue: field.defaultValue,
      constraints: field.constraints || '',
      isMap: field.map,
    }));
    // Create a mapping with fgID as key and an array of fields as value
    const map = mappedFields.reduce((acc, field) => {
      const key = field.fgID || 'undefined';
  
      if (!acc[key]) {
        acc[key] = [];
      }
  
      acc[key].push({
        id: field.id,
        fieldId: field.fieldId,
        valueType: field.valueType,
        defaultValue: field.defaultValue,
        constraints: field.constraints,
        isMap: field.isMap,
      });
  
      return acc;
    }, {});

    setFieldMap(map);
  
    setRows((existingRows) => removeDuplicates([...existingRows, ...mappedFields]));
  };
  

  const uniqueFgIDs = Object.keys(fieldMap);

  console.log("map fields", fieldMap);
  console.log("fgIds", uniqueFgIDs);

  const handleAddField = async () => {
    try {
      // Retrieve the necessary values from the newFieldInfo state
      const { id, fgId, valueType, constraint, defaultValue } = newFieldInfo;

      var fullPath = '';
      if (groupName === 'core') {
        fullPath = 'butterfly' + '/' + groupName + '/' + prototypeName;
      } else {
        fullPath = groupName + '/' + prototypeName;
      }
      const fieldUrl = `http://localhost:8080/addField?prototypePath=/${fullPath}&id=${id}&fgId=${fgId}&valueType=${valueType}&constraint=${constraint}&defaultValue=${defaultValue}`;
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
    { field: 'fgID', headerName: 'Group', width: 180, editable: true, headerClassName: 'super-app-theme--header', sortable: false },
    { field: 'fieldId', headerName: 'Field ID', width: 220, editable: true, headerClassName: 'super-app-theme--header', sortable: false },
    {
      field: 'valueType',
      headerName: 'Value Type',
      width: 150,
      editable: true,
      type: 'singleSelect',
      sortable: false,
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
        'GEO_POINT']
    },

    { field: 'defaultValue', headerName: 'Default Value', width: 150, editable: true, headerClassName: 'super-app-theme--header', sortable: false },

    // {
    //   field: 'attributeType',
    //   headerName: 'Attribute Type',
    //   width: 200,
    //   editable: true,
    //   type: 'singleSelect',
    //   headerClassName: 'super-app-theme--header',
    //   valueOptions: ['STANDALONE_FIELD', 'FIELD', 'FIELD_GROUP', 'SCHEME', 'SCHEME_FIELD'],
    //   sortable: false,
    // },
    {
      field: 'constraints',
      headerName: 'Constraint',
      width: 220,
      headerClassName: 'super-app-theme--header',
      editable: true,
      sortable: false,
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
      sortable: false,
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
          </>
        );
      },
    },
  ];


  const [rows, setRows] = React.useState([]);

  const removeDuplicates = (array) => {
    const uniqueIds = new Set();
    return array.filter((item) => {
      if (uniqueIds.has(item.id)) {
        return false; // Duplicate found, filter it out
      }
      uniqueIds.add(item.id);
      return true;
    });
  };

  const [rowModesModel, setRowModesModel] = React.useState({});



  const handleEditClick = (id) => () => {

    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleCellDoubleClick = (params) => {
    if (params.field === "defaultValue" || params.field === "constraints") {
      handleEditClick(params.id);
    } else if (!params.row.isMap) {
      setOpenAlert(true);
      setTimeout(() => {
        setOpenAlert(false);
      }, 3000);
    }
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


  const handleDeleteClickInherited = () => {
    console.log('clicked');
    setOpenInherited(true);
  };


  const handleSaveClickInherited = (id) => () => {
  };

  const handleDeleteConfirm = () => {
    console.log("Field to delete:", fieldToDelete);
    setRows(rows.filter((row) => row.fieldId !== fieldToDelete));
    setOpen(false);
  };

  const handleDeleteConfirmInherited = () => {
    setOpenInherited(false);
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
    // Update the rows, remove duplicates based on `field.id`
    setRows((existingRows) => removeDuplicates(existingRows.map((row) => (row.id === newRow.id ? updatedRow : row))));
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
    setRows('');
    setNewFieldInfo({
      id: '',
      fgId: '',
      valueType: '',
      constraint: '',
      defaultValue: '',
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
    fetchData(); // Fetch data when the component mounts
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
              <Link to="/" className='link'>
                <Typography variant="h3" gutterBottom className='pageHeader'
                  sx={{
                    margin: '70px', marginBottom: '50px', textDecoration: 'none', fontWeight: 'bold', letterSpacing: '2px', fontFamily: 'Arial',
                    '&:hover': { color: 'gray', textDecoration: 'none' }

                  }}>Prototypes</Typography>

              </Link>
            </div>

            <div className="header-info-container">
              <h2 className="prototype-header">{prototypeInfo.id}</h2>

              <div className="info-section">
                <div className="inherited-section">
                  <span className='inherited-prototypes-title'>Inherited Prototypes</span>{" "}
                  <span>
                    {prototypeInfo.allInheritedPrototypes.length > 0 && prototypeInfo.allInheritedPrototypes.length != prototypeInfo.inheritedPrototypes.length && (
                      <FormControlLabel
                        control={
                          <div className="switch-container">
                            <Switcher
                              disabled={false}
                              size="sm"
                              variant="soft"
                              sx={{ marginLeft: "10px", marginTop: "5px" }}
                              checked={showAllInheritedPrototypes}
                              onChange={() => setShowAllInheritedPrototypes(!showAllInheritedPrototypes)}
                            />
                            <span className="switch-label">
                              {showAllInheritedPrototypes ? 'Hide all prototypes' : 'Show all prototypes'}
                            </span>

                          </div>
                        }
                      />
                    )}
                  </span>
                </div>

                {!showAllInheritedPrototypes && (
                  <p className="inherited-prototypes">
                    {prototypeInfo.inheritedPrototypes.map((prototype, index) => {
                      const fullPath = `/prototype${prototype.replace("butterfly/", "")}`;
                      return (
                        <React.Fragment key={`${groupName}-${index}`}>
                          {index > 0 && " | "}
                          <span className="inherited-prototypes-list">
                            <Link to={fullPath} onClick={() => handlePrototypeClick(fullPath)} className={`inherited-prototypes-list${index === 0 ? ' with-right-padding' : ' with-padding'}`}>
                              {prototype}
                            </Link>
                            <span onClick={() => handleDeleteClickInherited(prototype)} style={{ cursor: 'pointer', color: 'red' }}>
                              X
                            </span>
                          </span>
                        </React.Fragment>
                      );
                    })}
                  </p>
                )}




                {showAllInheritedPrototypes && (
                  <p className="inherited-prototypes">
                    {prototypeInfo.allInheritedPrototypes.map((prototype, index) => {
                      const fullPath = `/prototype${prototype.replace("butterfly/", "")}`;
                      return (
                        <span>
                          <React.Fragment key={`${groupName}-${index}`}>
                            <span className='inherited-prototypes-list'>
                              {index > 0 && " | "}
                            </span>
                            <Link to={fullPath} onClick={() => handlePrototypeClick(fullPath)} className='inherited-prototypes-list'>
                              {prototype}
                            </Link>
                            <span onClick={() => handleDeleteClickInherited()} style={{ cursor: 'pointer', color: 'red' }}>
                              X
                            </span>
                          </React.Fragment>
                        </span>
                      );
                    })}
                  </p>
                )}

                {prototypeInfo.inheritedPrototypes.length <= 0 && (
                  <p className="inherited-prototypes-alt-text">No inherited prototypes found.</p>
                )}




                {showDropdown ? (
                  <InheritanceModal
                    showDropdown={showDropdown}
                    selectedOption={selectedOption}
                    handleDropdownChange={handleDropdownChange}
                    inheritanceDropdownOptions={inheritanceDropdownOptions}
                    handleSaveInheritance={handleSaveInheritance}
                    handleCancel={handleCancel}
                    handleAddInheritanceClick={handleAddInheritanceClick}
                  />
                ) : (
                  <button className="add-inheritance-button" onClick={handleAddInheritanceClick}>
                    Add Inherited Prototype
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

              <span className="subsubheader">Structure</span>
              <span>
                <button className="add-field-button" onClick={handleFieldToggleForm}>
                  Add new field
                </button>
              </span>
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
                  isCellEditable={(params) => {
                    if (params.field === "defaultValue" || params.field === "constraints") {
                      // Make the "defaultValue" column always editable
                      return true;
                    }
                    return params.row.isMap; // Make other columns editable based on the isMap condition
                  }}
                  disableEdit={(params) => {
                    if (params.field === "defaultValue" || params.field === "constraints") {
                      // Disable editing for the "defaultValue" column
                      return true;
                    }
                    return !params.row.isMap; // Disable other columns based on the isMap condition
                  }}
                  onCellDoubleClick={handleCellDoubleClick}
                  hideFooterPagination={true}
                  hideFooter={true}
                  initialState={{
                    sorting: {
                      sortModel: [{ field: 'fieldId', sort: 'asc' }],
                    },
                  }}
                  slotProps={{
                    toolbar: { setRows, setRowModesModel },
                  }}
                  sx={{
                    '& .MuiDataGrid-row': { marginTop: 1, marginBottom: 1 },
                    fontSize: "10pt",
                    '& .coloured': { textAlign: 'center', color: '#7181AD' },
                    '& .MuiDataGrid-virtualScroller::-webkit-horizontal-scrollbar': { display: 'none' }
                  }}
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

            <Dialog
              open={openInherited}
              onClose={handleCloseConfirmInherited}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Delete Confirmation"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  You are going to delete this inheritance. Are you sure?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseConfirmInherited}>CANCEL</Button>
                <Button onClick={handleDeleteConfirmInherited} autoFocus>
                  DELETE
                </Button>
              </DialogActions>
            </Dialog>


          </div>
        </div>
      </div>
      <Snackbar open={openAlert}>
        <Alert icon={false} severity="warning" sx={{ width: '100%' }}>
          This field is not editable in this prototype.
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Prototype;