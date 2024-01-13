import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './css/Prototype.css'; // Import your CSS file
import SideMenu from './SideMenu';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import InheritanceModal from './AddInheritanceModal';
import AddFieldModal from './AddFieldModal';
import UpdateFieldModal from './UpdateFieldModal';
import { styled } from '@mui/material/styles';
import Checkbox from '@material-ui/core/Checkbox';

import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import AddFieldGroupModal from './AddFieldGroupModal';
import { ControlPointDuplicateRounded } from '@mui/icons-material';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .super-app-theme--Hide': {
    display: "none"
  }, '& .super-app-theme--Show': {
  },

}));


const groups = [
  { name: 'Local Prototypes', url: 'http://localhost:8080/api/type/category/local' },
  { name: 'Core Prototypes', url: 'http://localhost:8080/api/type/category/core' },
  { name: 'Delta Prototypes', url: 'http://localhost:8080/api/type/category/delta' },
];

function Prototype(props) {

async function postData(url = "", formData = new FormData()) {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: formData,
  });
  
  return response.json(); 
}

async function deleteData(url = "", formData = new FormData()) {
  const response = await fetch(url, {
    method: "DELETE",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: formData,
  });
  
  return response.json(); 
}

async function putData(url = "", formData = new FormData()) {
  const response = await fetch(url, {
    method: "PUT",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: formData,
  });
  
  return response.json(); 
}

  const navigate = useNavigate()
  let headers = new Headers();

  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Origin','http://localhost:3000');

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
  const [openInheritedModal, setOpenInheritedModal] = React.useState(false);
  const [openFieldDeleteModal, setOpenFieldDeleteModal] = React.useState(false);
  const [openFieldGroupDeleteModal, setOpenFieldGroupDeleteModal] = React.useState(false);
  const [openPrototypeDeleteModal, setOpenPrototypeDeleteModal] = React.useState(false);

  const handleCloseConfirm = () => {
    setOpen(false);
  };

  const handleCloseConfirmInherited = () => {
    setOpenInheritedModal(false);
  };

  const handleCloseConfirmField = () => {
    setOpenFieldDeleteModal(false);
  };

  const handleCloseConfirmFieldGroup = () => {
    setOpenFieldGroupDeleteModal(false);
  };

  const handleCloseConfirmPrototype = () => {
    setOpenPrototypeDeleteModal(false);
  };

  const [openAlert, setOpenAlert] = React.useState(false);
  const [openInheritanceAlert, setOpenInheritanceAlert] = React.useState(false);
  const [openFieldGroupAlert, setOpenFieldGroupAlert] = React.useState(false);
  const [openFieldAlert, setOpenFieldAlert] = React.useState(false);
  const [openFieldDeleteAlert, setOpenFieldDeleteAlert] = React.useState(false);
  const [openInheritanceDeleteAlert, setOpenInheritanceDeleteAlert] = React.useState(false);
  const [openFieldGroupDeleteAlert, setOpenFieldGroupDeleteAlert] = React.useState(false);
  const [openFieldUpdateAlert, setOpenFieldUpdateAlert] = React.useState(false);

  const [rows, setRows] = React.useState([]);

  const dataGridContainerRef = useRef(null);

  const [rowModesModel, setRowModesModel] = React.useState({});

  const { groupName, prototypeName } = useParams();
  const [prototypeInfo, setPrototypeInfo] = useState();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isGroupFormVisible, setIsGroupFormVisible] = useState(false);

  const [newFieldInfo, setNewFieldInfo] = useState({
    id: '',
    fgId: '',
    valueType: '',
    constraint: '',
    defaultValue: '',
  });

  const [newFieldGroupInfo, setNewFieldGroupInfo] = useState({
    id: '',
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

  const handleFieldGroupToggleForm = () => {
    console.log("clicked");
    setIsGroupFormVisible(!isGroupFormVisible);
    if (!isGroupFormVisible) {
      setNewFieldGroupInfo({
        id: '',
      });
    }
  };


  const [inheritedToRemove, setInheritedToRemove] = useState('');
  const [fieldToRemove, setFieldToRemove] = useState('');
  const [fieldGroupToRemove, setFieldGroupToRemove] = useState('');
  const [prototypeToRemove, setPrototypeToRemove] = useState('');

  const [showInheritanceModal, setShowInheritanceModal] = useState(false);
  const [showFieldGroupModal, setShowFieldGroupModal] = useState(false);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [showUpdateFieldModal, setShowUpdateFieldModal] = useState(false);

  const [selectedInheritedPrototype, setSelectedInheritedPrototype] = useState('');
  const [selectedFieldGroup, setSelectedFieldGroup] = useState('');
  const [selectedFieldId, setSelectedFieldId] = useState('');
  const [selectedFieldType, setSelectedFieldType] = useState('');
  const [selectedFieldConstraint, setSelectedFieldConstraint] = useState('');
  const [selectedUpdateFieldId, setSelectedUpdateFieldId] = useState('');
  const [selectedUpdateFieldType, setSelectedUpdateFieldType] = useState('');
  const [selectedUpdateFieldConstraint, setSelectedUpdateFieldConstraint] = useState('');
  const [updatedFieldId, setUpdatedFieldId] = useState('');
  const [initialUpdateFieldType, setInitialUpdateFieldType] = useState('');
  const [initialUpdateFieldConstraint, setInitialUpdateFieldConstraint] = useState('');

  const handleSaveInheritance = async (selectedValue) => {
    setShowInheritanceModal(false);
    selectedValue = "/local/" + selectedValue;
    const formData = new FormData();
    formData.append('inherited', selectedValue);
    postData(`http://localhost:8080/api/type/${prototypeName}/inheritance`, formData).then((data) => {
      console.log(data); 
      setOpenInheritanceAlert(true);
      setTimeout(() => {
        setOpenInheritanceAlert(false);
      }, 3000);
    });
  };
  
  const handleSaveFieldGroup = async (groupValue) => {
    setShowFieldGroupModal(false);
    const formData = new FormData();
    formData.append('groupId', groupValue);
    postData(`http://localhost:8080/api/type/${prototypeName}/group`, formData).then((data) => {
      console.log(data); 
      setOpenFieldGroupAlert(true);
      setTimeout(() => {
        setOpenFieldGroupAlert(false);
      }, 3000);
    });
  };
  
  const handleSaveField = async (selectedFieldId, selectedFieldType, selectedFieldConstraint) => {
    setShowFieldModal(false);
    const formData = new FormData();
    console.log(selectedFieldConstraint);
  
    if (selectedFieldType !== null)
      formData.append('type', selectedFieldType);
  
    if (selectedFieldConstraint !== null) {
      let group = null;  
      if (selectedFieldConstraint.includes("Local")) {
        group = "/local/";
      } else {
        group = "/butterfly/core/";
      }
      const prototype = selectedFieldConstraint.substring(selectedFieldConstraint.lastIndexOf('/') + 1);
      const constraint = group + prototype;
      formData.append('constraint', constraint);
    }
  
    formData.append('fieldId', selectedFieldId);
    console.log(selectedFieldId);
  
    postData(`http://localhost:8080/api/type/${prototypeName}/field`, formData).then((data) => {
      console.log(data);
      setOpenFieldAlert(true);
      setTimeout(() => {
        setOpenFieldAlert(false);
      }, 3000);
    });
  };
  

  const handleSaveUpdateField = async (selectedUpdateFieldId, selectedUpdateFieldType, selectedUpdateFieldConstraint) => {
    setShowUpdateFieldModal(false);
    const formData = new FormData();
    console.log("new type", selectedUpdateFieldType);
    if (selectedUpdateFieldType!== null)
      formData.append('type', selectedUpdateFieldType);
    if (selectedUpdateFieldConstraint!== null) {
      const constraint = selectedUpdateFieldConstraint.substring(selectedUpdateFieldConstraint.lastIndexOf('/') + 1);
      formData.append('constraint', constraint);
    }
  
    formData.append('fieldId',selectedUpdateFieldId);
    console.log(selectedUpdateFieldId);
    putData(`http://localhost:8080/api/type/${prototypeName}/field`, formData).then((data) => {
      console.log(data); 
      setOpenFieldUpdateAlert(true);
      setTimeout(() => {
        setOpenFieldUpdateAlert(false);
      }, 3000);
    });
  };
  

  

  const handleCancelInheritance = () => {
    setShowInheritanceModal(false);
  };

  const handleCancelFieldGroup = () => {
    setShowFieldGroupModal(false);
  };

  const handleCancelField = () => {
    setShowFieldModal(false);
  };

  const handleCancelUpdateField = () => {
    setShowUpdateFieldModal(false);
  };

  const handleClickInheritance = () => {
    setSelectedInheritedPrototype(null);
    setShowInheritanceModal(true);
  };

  const handleClickFieldGroup = () => {
    setSelectedFieldGroup(null);
    setShowFieldGroupModal(true);
  };

  const handleClickField = () => {
    setSelectedFieldId(null);
    setSelectedFieldType(null);
    setSelectedFieldConstraint(null);
    setShowFieldModal(true);
  };

  const handleClickUpdateField = (id, type, constraint) => {
    setUpdatedFieldId(id);
    setInitialUpdateFieldType(type);
    setInitialUpdateFieldConstraint(constraint);
    
    setSelectedUpdateFieldId(null);
    setSelectedUpdateFieldType(null);
    setSelectedUpdateFieldConstraint(null);
    setShowUpdateFieldModal(true);
  };

  const [inheritanceDropdownOptions, setinheritanceDropdownOptions] = useState([]);

  const [fieldToDelete, setFieldToDelete] = useState('');
  const [allInheritedPrototypes, setAllInheritedPrototypes] = useState('');

  const [showAllInheritedPrototypes, setShowAllInheritedPrototypes] = useState(false);
  const [fieldMap, setFieldMap] = useState([]);
  const [emptyFieldGroups, setEmptyFieldGroups] = useState([]);
  const fetchDataWithRetry = async () => {
    let retryCount = 0;
    const maxRetries = 3; // Set the maximum number of retries
  
    const fetchWithRetry = async () => {
      try {
        const isCore = groupName === 'core';
        const requestUrl = isCore
          ? `http://localhost:8080/api/type/${prototypeName}?isCore=true`
          : `http://localhost:8080/api/type/${prototypeName}`;
  
        const response = await fetch(requestUrl, {
          mode: 'cors',
          method: 'GET',
          headers: headers,
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        setPrototypeInfo(data);
  
    // Map fields
    const fields = data.fields || [];
    const mappedFields = fields.map((field) => ({
      id: field.id,
      fgID: field.fgID !== undefined ? field.fgID : 'undefined',
      fieldId: field.id,
      valueType: field.type,
      defaultValue: field.defaultValue,
      constraint: field.constraint || '',
      isDefinedInThis: field.isDefinedInThis,
    }));

    console.log(mappedFields);
  
    // Map fieldGroups and their fields
    const fieldGroups = data.fieldGroups || {};
    const newEmptyFieldGroups = Object.keys(fieldGroups).filter(groupName => fieldGroups[groupName].length === 0);
    setEmptyFieldGroups(newEmptyFieldGroups);
    const mappedFieldGroups = Object.keys(fieldGroups).flatMap((groupName) => {
      const group = fieldGroups[groupName] || []; // Ensure group exists, even if it's empty
      return group.map((field) => ({
        id: field.id,
        fgID: groupName, // Use the group name as fgID
        fieldId: field.id,
        valueType: field.type,
        defaultValue: field.defaultValue,
        constraint: field.constraint || '',
        isDefinedInThis: field.isDefinedInThis,
      }));
    });
    console.log(mappedFieldGroups);
    // Combine both mappedFields and mappedFieldGroups
    const allMappedFields = [...mappedFields, ...mappedFieldGroups];
  
    // Create a mapping with fgID as key and an array of fields as value
    const map = allMappedFields.reduce((acc, field) => {
      const key = field.fgID !== undefined ? field.fgID : 'undefined';
  
      if (!acc[key]) {
        acc[key] = [];
      }
  
      acc[key].push({
        id: field.id,
        fieldId: field.fieldId,
        valueType: field.valueType,
        defaultValue: field.defaultValue,
        constraint: field.constraint,
        isMap: field.isMap,
      });
  
      return acc;
    }, {});
  
    setFieldMap(map);
    setRows((existingRows) => removeDuplicates([...existingRows, ...allMappedFields]));
  
  } catch (error) {
    // Handle errors here
    console.error('Error fetching data:', error);

    // Retry logic
    if (retryCount < maxRetries) {
      retryCount++;
      console.log(`Retrying (${retryCount}/${maxRetries})...`);
      window.location.reload();
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
      await fetchWithRetry();
    } else {
      console.error('Max retries reached. Unable to fetch data.');
    }
  }
};

await fetchWithRetry();
};

// Call the fetchDataWithRetry function instead of fetchData
useEffect(() => {
fetchDataWithRetry();
// Fetch data when the component mounts
}, [groupName, prototypeName]);


  const uniqueFgIDs = [...Object.keys(fieldMap), ...emptyFieldGroups];


  console.log(rows);

  const [groupData, setGroupData] = useState({});

  const fetchAllData = async () => {
    const data = {};

    for (const group of groups) {
      try {
        const response = await fetch(group.url, 
          {mode: 'cors',
          method: 'GET',
          headers: headers
        });

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

    { field: 'fieldId', headerName: 'Field ID', width: 250, editable: false, headerClassName: 'super-app-theme--header', sortable: false },
    {
      field: 'valueType',
      headerName: 'Value Type',
      width: 250,
      editable: false,
      type: 'singleSelect',
      sortable: false,
      headerClassName: 'super-app-theme--header',
    },

    { field: 'defaultValue', headerName: 'Default Value', width: 250, editable: false, headerClassName: 'super-app-theme--header', sortable: false },

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
      field: 'constraint',
      headerName: 'Constraint',
      width: 400,
      headerClassName: 'super-app-theme--header',
      editable: false,
      sortable: false,
    },
    {
      field: groupName === 'local' ? 'Actions' : null,
      sortable: false,
      headerName: groupName === 'local' ? 'Actions' : null,
      headerClassName: 'super-app-theme--header',
      width: 100,
      cellClassName: 'actions',
      renderCell: (params) => {
        if (groupName === 'local') {
          console.log(params.id);
          if (params.row.isDefinedInThis) {
    
            return (
              <>
                <GridActionsCellItem
                  icon={<EditIcon />}
                  label="Edit"
                  className="textPrimary"
                  onClick={() => handleClickUpdateField(params.id, params.row.valueType, params.row.constraint)}
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
    
          return (
            <>
              {/* <GridActionsCellItem
                icon={<EditIcon />}
                label="Edit"
                className="textPrimary"
                onClick={() => handleClickUpdateField(params.id, params.row.valueType, params.row.constraint)}
                color="inherit"
              /> */}
            </>
          );
        }
        
        // If groupName is not 'local', return null to render nothing
        return null;
      },
    },
    
  ];

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



  // const handleEditClick = (id) => () => {
  //   console.log("Clicked Edit for ID:", id);
  //   console.log("All Rows:", rows);
  //   console.log("All Fields:", fieldMap);

  //   // Check if the row with the specified ID exists
  //   const selectedRow = rows.find((row) => row.fieldId === id);
    
  //   console.log("Selected Row:", selectedRow);
  //   setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    
  // };


  const handleEditClick = (id) => () => {
    console.log("Clicked Edit for ID:", id);
    console.log("All Rows:", rows);
    console.log("All Fields:", fieldMap);


    // // Check if the row with the specified ID exists
    // const selectedRow = rows.find((row) => row.fieldId === id);
    
    //   console.log("Selected Row:", selectedRow);
    //   setRowModesModel({ ...rowModesModel, [selectedRow.fieldId]: { mode: GridRowModes.Edit } });
  }




  const handleDeleteClick = (id) => () => {
    setFieldToRemove(id); // Set the fieldToDelete state with the ID of the field to be deleted
    setOpenFieldDeleteModal(true);
  };


  const handleDeleteClickInherited = (prototype) => {
    setInheritedToRemove(prototype);
    setOpenInheritedModal(true);
  };

  const handleDeleteClickFieldGroup = (fieldGroup) => {
    console.log(fieldGroup);
    setFieldGroupToRemove(fieldGroup);
    setOpenFieldGroupDeleteModal(true);
  };

  const handleDeleteClickField = (field) => {
    setFieldToRemove(field);
    setOpenFieldDeleteModal(true);
  };

  const handleDeleteClickPrototype = (prototype) => {
    setPrototypeToRemove(prototype);
    setOpenPrototypeDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    console.log("Field to delete:", fieldToDelete);
    setRows(rows.filter((row) => row.fieldId !== fieldToDelete));
    setOpen(false);
  };
  
  const handleDeleteConfirmInherited = () => {

    const removedValue = inheritedToRemove;
    const formData = new FormData();
    console.log(removedValue);
    formData.append('removed', removedValue);
    deleteData(`http://localhost:8080/api/type/${prototypeName}/inheritance`, formData).then((data) => {
      console.log(data); 
    });
    setOpenInheritanceDeleteAlert(true);
      setTimeout(() => {
        setOpenInheritanceDeleteAlert(false);
      }, 3000);
    setOpenInheritedModal(false);
  };

  const handleDeleteConfirmField = () => {

    const removedValue = fieldToRemove;
    const formData = new FormData();
    console.log(removedValue);
    formData.append('fieldId', removedValue);
    deleteData(`http://localhost:8080/api/type/${prototypeName}/field`, formData).then((data) => {
      console.log(data); 
    });
    setOpenFieldDeleteAlert(true);
      setTimeout(() => {
        setOpenFieldDeleteAlert(false);
      }, 3000);
    setOpenFieldDeleteModal(false);
    setRows(rows.filter((row) => row.fieldId !== fieldToRemove));
  };

  const handleDeleteConfirmFieldGroup = () => {

    const removedValue = fieldGroupToRemove;
    const formData = new FormData();
    console.log(removedValue);
    formData.append('groupId', removedValue);
    deleteData(`http://localhost:8080/api/type/${prototypeName}/group`, formData).then((data) => {
      console.log(data); 
    });
    setOpenFieldGroupDeleteAlert(true);
      setTimeout(() => {
        setOpenFieldGroupDeleteAlert(false);
      }, 3000);
    setOpenFieldGroupDeleteModal(false);
  };

  const handleDeleteConfirmPrototype = () => {

    deleteData(`http://localhost:8080/api/type/${prototypeName}`, {}).then((data) => {
      console.log(data); 
    });
    setOpenFieldGroupDeleteAlert(true);
      setTimeout(() => {
        setOpenFieldGroupDeleteAlert(false);
      }, 3000);
    setOpenFieldGroupDeleteModal(false);
  };




  useEffect(() => {
    setShowInheritanceModal(false);
    setIsFormVisible(false);
    // setAddInheritance(false);
    // setNewInheritance('');
    setShowAllInheritedPrototypes(false);
    setShowUpdateFieldModal(false);
    setRows([]);
    setFieldMap([]);
    setNewFieldInfo({
      id: '',
      fgId: '',
      valueType: '',
      constraint: '',
      defaultValue: '',
    });
    fetchDataWithRetry(); // Fetch data for the new prototype and initialize 'rows'
  }, [prototypeName, groupName]);

  useEffect(() => {
    let groupUrl = "";
    if (groupName === "local") {
      groupUrl = "getLocal";
    } else {
      groupUrl = "getCore";
    }

    // Fetch dropdown options from the URL when the component mounts
    fetch(`http://localhost:8080/api/type/category/${groupName}`, 
      {mode: 'cors',
      method: 'GET',
      headers: headers}
    ) // Use backticks for template literals
      .then((response) => response.json())
      .then((data) => setinheritanceDropdownOptions(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [prototypeName, groupName]);

  const handleInheritanceChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedInheritedPrototype(selectedValue);
  };

  const handleFieldGroupChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedFieldGroup(selectedValue);
  };

  const handleFieldIdChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedFieldId(selectedValue);
  };

  const handleFieldTypeChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedFieldType(selectedValue);
  };
  const handleFieldConstraintChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedFieldConstraint(selectedValue);
  };

  const handleUpdateFieldIdChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedUpdateFieldId(selectedValue);
  };

  const handleUpdateFieldTypeChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedUpdateFieldType(selectedValue);
  };
  const handleUpdateFieldConstraintChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedUpdateFieldConstraint(selectedValue);
  };

  // useEffect(() => {
  //   // Add a click event listener to the document
  //   const handleClickOutside = (event) => {
  //     if (
  //       rowModesModel[selectedFIeldID]?.mode === GridRowModes.Edit &&
  //       dataGridContainerRef.current &&
  //       !dataGridContainerRef.current.contains(event.target)
  //     ) {
  //       // If the click is outside the DataGrid, cancel the edit mode
  //       setRowModesModel({
  //         ...rowModesModel,
  //         [selectedFIeldID]: { mode: GridRowModes.View, ignoreModifications: true },
  //       });
  //     }
  //   };

  //   // Attach the event listener
  //   document.addEventListener('click', handleClickOutside);

  //   // Cleanup the event listener on component unmount
  //   return () => {
  //     document.removeEventListener('click', handleClickOutside);
  //   };
  // }, [selectedFIeldID, rowModesModel]);


  // useEffect(() => {
  //   fetchData(); // Fetch data when the component mounts
  // }, [groupName, prototypeName]);

  if (!prototypeInfo) {
    return <Link to={"/"}></Link>;
  }

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handlePrototypeClick = (fullPath) => {
    navigate(fullPath);
  };


  const handleCheckboxChange = (event) => {
    setShowAllInheritedPrototypes(event.target.checked);
  };

  console.log(uniqueFgIDs);
  const BpIcon = styled('span')(({ theme }) => ({
    borderRadius: 3,
    width: 16,
    height: 16,
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 0 0 1px rgb(16 22 26 / 40%)'
        : 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: theme.palette.mode === 'dark' ? '#394b59' : '#f5f8fa',
    backgroundImage:
      theme.palette.mode === 'dark'
        ? 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))'
        : 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: theme.palette.mode === 'dark' ? '#30404d' : '#ebf1f5',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background:
        theme.palette.mode === 'dark' ? 'rgba(57,75,89,.5)' : 'rgba(206,217,224,.5)',
    },
  }));
  
  return (

    <div>
      <SideMenu currentGroup={groupName} currentPrototype={prototypeName} />

      <div className="main-content">

        <div className="prototype-container">

          {/* <button onClick={() => navigation("/")}  className="back-button">Back</button>  */}
          <div className='sticky-header'>
               
                
            <div className="header-info-container">
            
              <h2 className="prototype-header">{prototypeInfo.id}</h2>
              <div className="info-section">
              
              <span className="inherited-section">
                <span className='inherited-prototypes-title'>
                  <span>Inherited Prototypes</span>
                </span>
                
                {prototypeInfo.inheritsTransitively.length > 0 && prototypeInfo.inheritsTransitively.length !== prototypeInfo.inherits.length && (
                  <div className="switch-container">
                    <Checkbox
                      checked={showAllInheritedPrototypes}
                      onChange={handleCheckboxChange}
                      color="default"
                      size="small"
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <span className="switch-label">
                      Show all prototypes
                    </span>
                  </div>
                )}
            </span>


                {!showAllInheritedPrototypes && prototypeInfo.inherits && (
                <p className="inherited-prototypes">
                  {prototypeInfo.inherits.map((prototype, index) => {
                    const fullPath = `/prototype${prototype.replace("butterfly/", "")}`;
                    return (
                      <React.Fragment key={`${groupName}-${index}`}>
                        {index > 0 && " | "}
                        <span className="inherited-prototypes-list">
                          <Link to={fullPath} onClick={() => handlePrototypeClick(fullPath)} className={`inherited-prototypes-list${index === 0 ? ' with-right-padding' : ' with-padding'}`}>
                            {prototype}
                          </Link>
                          {groupName === 'local' && ( 
                            <span onClick={() => handleDeleteClickInherited(prototype)} style={{ cursor: 'pointer', color: 'red' }}>
                              X
                            </span>
                          )}
                        </span>
                      </React.Fragment>
                    );
                  })}
                </p>
              )}
              {
                showAllInheritedPrototypes && prototypeInfo.inheritsTransitively && (
                  <p className="inherited-prototypes">
                    {prototypeInfo.inheritsTransitively.map((prototype, index) => {
                      const fullPath = `/prototype${prototype.replace("butterfly/", "")}`;

                      // Check if the prototype exists in both inheritsTransitively and inherits
                      const isInBothArrays = prototypeInfo.inherits.includes(prototype);

                      return (
                        <span key={`${groupName}-${index}`} className='inherited-prototypes-list'>
                          {index > 0 && " | "}
                          <Link to={fullPath} onClick={() => handlePrototypeClick(fullPath)} className='inherited-prototypes-list'>
                            {prototype}
                          </Link>
                          {groupName === 'local' && isInBothArrays && ( 
                            <span onClick={() => handleDeleteClickInherited(prototype)} style={{ cursor: 'pointer', color: 'red' }}>
                              X
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </p>
                )
              }

                {prototypeInfo.inherits.length <= 0 && (
                  <p className="inherited-prototypes-alt-text">No inherited prototypes found.</p>
                )}

                {
                  showInheritanceModal ? (
                    <InheritanceModal
                      showInheritanceModal={showInheritanceModal}
                      selectedInheritedPrototype={selectedInheritedPrototype}
                      handleInheritanceChange={handleInheritanceChange}
                      inheritanceDropdownOptions={inheritanceDropdownOptions}
                      handleSaveInheritance={() => handleSaveInheritance(selectedInheritedPrototype)} 
                      handleCancelInheritance={handleCancelInheritance}
                    />
                  ) : (
                    groupName === 'local' && (
                    
                    <span className= "inline-buttons">
                      <button
                        className="add-inheritance-button"
                        onClick={handleClickInheritance}
                      >
                        Add Inherited Prototype
                      </button>

                        <button className = "delete-prototype-button"
                        onClick={() => handleDeleteClickPrototype(prototypeName)}>
                          Delete prototype
                        </button>
                     

                    </span>
                    )
                  )
                }


                  </div>
            </div>
          </div>

          <div className='field-section'>
            <div className='fields'>
            <div ref={dataGridContainerRef}>
              <span className="subsubheader">Structure</span>

              {showFieldModal ? (
                      <AddFieldModal
                        showFieldModal={showFieldModal}
                        selectedFieldId={selectedFieldId}
                        selectedFieldType={selectedFieldType}
                        selectedFieldConstraint={selectedFieldConstraint}
                        handleFieldIdChange={handleFieldIdChange}
                        handleFieldTypeChange={handleFieldTypeChange}
                        handleFieldConstraintChange={handleFieldConstraintChange}
                        handleSaveField={() => handleSaveField(selectedFieldId,selectedFieldType,selectedFieldConstraint)} 
                        handleCancelField={handleCancelField}
                      />
                    ) : (
                      groupName === 'local' && (
                      <button className="add-field-button" onClick={handleClickField}>
                        Add new field
                      </button>
                    )
                    )
                  }


              {showFieldGroupModal ? (
                      <AddFieldGroupModal
                        showFieldGroupModal={showFieldGroupModal}
                        selectedFieldGroup={selectedFieldGroup}
                        handleFieldGroupChange={handleFieldGroupChange}
                        handleSaveFieldGroup={() => handleSaveFieldGroup(selectedFieldGroup)} 
                        handleCancelFieldGroup={handleCancelFieldGroup}
                      />
                    ) : (
                      groupName === 'local' && (
                      <button className="add-field-button" onClick={handleClickFieldGroup}>
                        Add new field group
                      </button>
                    )
                    )
                  }
            
           
            {showUpdateFieldModal ? (
                        <UpdateFieldModal
                         showUpdateFieldModal={showUpdateFieldModal}
                         updatedFieldId={updatedFieldId}
                         initialUpdateFieldType={initialUpdateFieldType}
                         initialUpdateFieldConstraint={initialUpdateFieldConstraint}
                         selectedUpdateFieldId={selectedUpdateFieldId}
                         selectedUpdateFieldType={selectedUpdateFieldType}
                         selectedUpdateFieldConstraint={selectedUpdateFieldConstraint}
                         handleUpdateFieldIdChange={handleUpdateFieldIdChange}
                         handleUpdateFieldTypeChange={handleUpdateFieldTypeChange}
                         handleUpdateFieldConstraintChange={handleUpdateFieldConstraintChange}
                         handleSaveUpdateField={() => handleSaveUpdateField(updatedFieldId,selectedUpdateFieldType,selectedUpdateFieldConstraint)} 
                         handleCancelUpdateField={handleCancelUpdateField}
                  
                       />
                    ) : (null)
                }

              <Box
                sx={{
                  width: '100%',
                  height: 'auto',
                  overflowY: 'visible',
                  padding: '10px',
                
                }}
              >

                {uniqueFgIDs.map((fgID) => (

                  
                <div
                  key={fgID}
                  style={{
                    marginBottom: '16px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 'auto'
                  }}
                    className="fgID"
                  >
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                        marginTop: '12px'
                        
                      }}
                    >
                      {fgID !== "undefined" ? fgID : "Standalone fields" }
                  

                      {fgID !== "undefined" && (
                        // Check if at least one field in the group is defined in the current context
                        prototypeInfo.fieldGroups[fgID].some(field => field.isDefinedInThis) && (
                          <span onClick={() => handleDeleteClickFieldGroup(fgID)} style={{ cursor: 'pointer', color: 'red', marginLeft:'10px' }}>
                            X
                          </span>
                        )
                      )}

                    </div>
                    <Box
                      sx={{
                        width: '100%',
                        height: 'auto',
                        overflowY: 'visible', // Set to 'visible' to allow content to overflow without scrollbars
                        padding: '10px',
                      }}
                    >
                      {prototypeInfo.fieldGroups[fgID]?.length > 0 || fgID == "undefined" ? (
                      <DataGrid
                        key={fgID}
                        rows = {rows.filter(row => row.fgID === fgID)}
                        columns={columns}
                        getRowId={(row) => row.id}
                        rowModesModel={rowModesModel}
                        isCellEditable={false}
                        hideFooterPagination={true}
                        hideFooter={true}
                
                      />
                      ) : (
                        <p style={{ color: 'gray', fontStyle: 'italic', fontSize: '13px' }}>This field group has no fields.</p>
                      )}

                    </Box>
                  </div>
                ))}
              </Box>
              </div>
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
              open={openInheritedModal}
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

            <Dialog
              open={openFieldDeleteModal}
              onClose={handleCloseConfirmField}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Delete Confirmation"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  You are going to delete this field. Are you sure?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseConfirmField}>CANCEL</Button>
                <Button onClick={handleDeleteConfirmField} autoFocus>
                  DELETE
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog
              open={openFieldGroupDeleteModal}
              onClose={handleCloseConfirmFieldGroup}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Delete Confirmation"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  You are going to delete this field group. Are you sure?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseConfirmFieldGroup}>CANCEL</Button>
                <Button onClick={handleDeleteConfirmFieldGroup} autoFocus>
                  DELETE
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog
              open={openPrototypeDeleteModal}
              onClose={handleCloseConfirmPrototype}
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
                <Button onClick={handleCloseConfirmPrototype}>CANCEL</Button>
                <Button onClick={handleDeleteConfirmPrototype} autoFocus>
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

      <Snackbar open={openInheritanceAlert}>
        <Alert icon={false} severity="success" sx={{ width: '100%' }}>
          The inheritance added successfully!
        </Alert>
      </Snackbar>

      <Snackbar open={openFieldGroupAlert}>
        <Alert icon={false} severity="success" sx={{ width: '100%' }}>
          The field group added successfully!
        </Alert>
      </Snackbar>

      <Snackbar open={openFieldAlert}>
        <Alert icon={false} severity="success" sx={{ width: '100%' }}>
          The field added successfully!
        </Alert>
      </Snackbar>

      <Snackbar open={openFieldDeleteAlert}>
        <Alert icon={false} severity="success" sx={{ width: '100%' }}>
          The field deleted successfully!
        </Alert>
      </Snackbar>

      <Snackbar open={openInheritanceDeleteAlert}>
        <Alert icon={false} severity="success" sx={{ width: '100%' }}>
          The inheritance deleted successfully!
        </Alert>
      </Snackbar>

      <Snackbar open={openFieldUpdateAlert}>
        <Alert icon={false} severity="success" sx={{ width: '100%' }}>
          The field updated successfully!
        </Alert>
      </Snackbar>

      <Snackbar open={openFieldGroupDeleteAlert}>
        <Alert icon={false} severity="success" sx={{ width: '100%' }}>
          The field group deleted successfully!
        </Alert>
      </Snackbar>

    </div>
  );
}

export default Prototype;