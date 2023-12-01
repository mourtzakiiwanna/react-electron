import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './css/Prototype.css'; // Import your CSS file
import SideMenu from './SideMenu';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import Switcher from '@mui/joy/Switch';
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
    
    if (selectedFieldType !== null)
      formData.append('type', selectedFieldType);
    if (selectedFieldConstraint!== null) {
      const constraint = selectedFieldConstraint.substring(selectedFieldConstraint.lastIndexOf('/') + 1);
      formData.append('constraint', constraint);
    }
  
    formData.append('fieldId',selectedFieldId);
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
      setOpenFieldAlert(true);
      setTimeout(() => {
        setOpenFieldAlert(false);
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

  const fetchData = async () => {

    console.log(prototypeName);
    const response = await fetch(`http://localhost:8080/api/type/${prototypeName}`, 
        {
            mode: 'cors',
            method: 'GET',
            headers: headers
        }
    );

    const data = await response.json();
    setPrototypeInfo(data);

    // Extract fields and fieldGroups
    const fields = data.fields || [];
    const fieldGroups = data.fieldGroups || [];

    // Map fields
    const mappedFields = fields.map((field) => ({
        id: field.id,
        fgID: field.fgID !== undefined ? field.fgID : 'undefined',
        fieldId: field.id,
        valueType: field.type,
        defaultValue: field.defaultValue,
        constraint: field.constraint || '',
        isMap: field.map,
    }));

    // Map fieldGroups and their fields
    const mappedFieldGroups = fieldGroups.flatMap((group) => 
        group.fields.map((field) => ({
            id: field.id,
            fgID: group.id, // Use the fieldGroup id as fgID
            fieldId: field.id,
            valueType: field.type,
            defaultValue: field.defaultValue,
            constraint: field.constraint|| '',
            isMap: field.map,
        }))
    );

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
};



  const uniqueFgIDs = Object.keys(fieldMap);

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

    { field: 'fieldId', headerName: 'Field ID', width: 220, editable: false, headerClassName: 'super-app-theme--header', sortable: false },
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

    { field: 'defaultValue', headerName: 'Default Value', width: 150, editable: false, headerClassName: 'super-app-theme--header', sortable: false },

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
              name: 'constraint',
              id: 'constraint',
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
        console.log(params.id);
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
                  onClick={handleCancelInheritanceClick(params.id)}
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
                onClick={handleCancelInheritanceClick(params.id)}
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
              onClick={() => handleClickUpdateField(params.id, params.row.valueType, params.row.constraint)}
              color="inherit"
            />
          </>
        );
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

  
  const handleCellDoubleClick = (params) => {
    if (params.field === "defaultValue" || params.field === "constraint") {
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
    setFieldToRemove(id); // Set the fieldToDelete state with the ID of the field to be deleted
    setOpenFieldDeleteModal(true);
  };


  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    console.log(id);
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


  const handleCancelInheritanceClick = (id) => () => {
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
    console.log("newRow", newRow);
  
    setRows((existingRows) => {
      const updatedRows = existingRows.map((row) =>
        row.fgID === newRow.fgID && row.id === newRow.id ? updatedRow : row
      );
      return removeDuplicates(updatedRows);
    });
  
    const formData = new FormData();
    
    if (newRow.valueType !== null)
      formData.append('type', newRow.valueType);
    if (newRow.constraint !== null) {
      formData.append('constraint', newRow.constraint);
    }
    formData.append('fieldId', newRow.fieldId);
    putData(`http://localhost:8080/api/type/${prototypeName}/field`, formData).then((data) => {
      console.log(data); 
      setOpenFieldUpdateAlert(true);
      setTimeout(() => {
        setOpenFieldUpdateAlert(false);
      }, 3000);
    });
  
    return updatedRow;
  };



  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
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

            {/* <span onClick={() => handleDeleteClickPrototype(prototypeName)}>Delete prototype</span> */}
            <div className="header-info-container">
              <h2 className="prototype-header">{prototypeInfo.id}</h2>
              <div className="info-section">
              <div className="inherited-section">
                <span className='inherited-prototypes-title'>
                  <span>Inherited Prototypes</span>
                </span>
                {" "}
                <span>
                  {allInheritedPrototypes.length > 0 && allInheritedPrototypes.length !== prototypeInfo.inherits.length && (
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


                {!showAllInheritedPrototypes && prototypeInfo && (
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
                          <span onClick={() => handleDeleteClickInherited(prototype)} style={{ cursor: 'pointer', color: 'red' }}>
                            X
                          </span>
                        </span>
                      </React.Fragment>
                    );
                  })}
                </p>
              )}

                {showAllInheritedPrototypes && prototypeInfo && (
                  <p className="inherited-prototypes">
                    {allInheritedPrototypes.map((prototype, index) => {
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
                            <span onClick={() => handleDeleteClickInherited(prototype)} style={{ cursor: 'pointer', color: 'red' }}>
                              X
                            </span>
                          </React.Fragment>
                        </span>
                      );
                    })}
                  </p>
                )}

                {prototypeInfo.inherits.length <= 0 && (
                  <p className="inherited-prototypes-alt-text">No inherited prototypes found.</p>
                )}




              {showInheritanceModal ? (
                      <InheritanceModal
                        showInheritanceModal={showInheritanceModal}
                        selectedInheritedPrototype={selectedInheritedPrototype}
                        handleInheritanceChange={handleInheritanceChange}
                        inheritanceDropdownOptions={inheritanceDropdownOptions}
                        handleSaveInheritance={() => handleSaveInheritance(selectedInheritedPrototype)} 
                        handleCancelInheritance={handleCancelInheritance}
                      />
                    ) : (
                      <button className="add-inheritance-button" onClick={handleClickInheritance}>
                        Add Inherited Prototype
                      </button>
                    )}
                  </div>
            </div>
          </div>

          <div className='field-section'>
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
                      <button className="add-field-button" onClick={handleClickField}>
                        Add new field
                      </button>
                    )}


              {showFieldGroupModal ? (
                      <AddFieldGroupModal
                        showFieldGroupModal={showFieldGroupModal}
                        selectedFieldGroup={selectedFieldGroup}
                        handleFieldGroupChange={handleFieldGroupChange}
                        handleSaveFieldGroup={() => handleSaveFieldGroup(selectedFieldGroup)} 
                        handleCancelFieldGroup={handleCancelFieldGroup}
                      />
                    ) : (
                      <button className="add-field-button" onClick={handleClickFieldGroup}>
                        Add new field group
                      </button>
                    )}
            
           
            {showUpdateFieldModal ? (
                        <UpdateFieldModal
                         showUpdateFieldModal={showUpdateFieldModal}
                         updatedFieldId={updatedFieldId}
                         selectedUpdateFieldId={selectedUpdateFieldId}
                         selectedUpdateFieldType={selectedUpdateFieldType}
                         selectedUpdateFieldConstraint={selectedUpdateFieldConstraint}
                         handleUpdateFieldIdChange={handleUpdateFieldIdChange}
                         handleUpdateFieldTypeChange={handleUpdateFieldTypeChange}
                         handleUpdateFieldConstraintChange={handleUpdateFieldConstraintChange}
                         handleSaveUpdateField={() => handleSaveUpdateField(updatedFieldId,selectedUpdateFieldType,selectedUpdateFieldConstraint)} 
                         handleCancelUpdateField={handleCancelUpdateField}
                         initialUpdateFieldType={initialUpdateFieldType}
                         initialUpdateFieldConstraint={initialUpdateFieldConstraint}
                       />
                    ) : (null)
                }

              <Box
                sx={{
                  width: '100%',
                  marginTop: '20px',
                  height: 450,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '10px',
                  '&::-webkit-scrollbar': {
                    width: '12px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#888',
                    borderRadius: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: 'transparent',
                  },
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
                    height: '400px'
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
                      {fgID !== "undefined" &&
                        <span onClick={() => handleDeleteClickFieldGroup(fgID)} style={{ cursor: 'pointer', color: 'red', marginLeft:'10px' }}>
                            X
                        </span>
                      }
                    </div>
                    <Box
                      sx={{
                        overflowY: 'auto',
                        
                      }}
                    >
                      <StyledDataGrid
                        key={fgID}
                        rows = {rows.filter(row => row.fgID === fgID)}
                        columns={columns}
                        className="overflow-grid"
                        getRowId={(row) => row.id}
                        editMode={'row'}
                        rowModesModel={rowModesModel}
                        onRowModesModelChange={handleRowModesModelChange}
                        onRowEditStop={handleRowEditStop}
                        processRowUpdate={processRowUpdate}
                        isCellEditable={(params) => {
                          if (params.field === 'defaultValue' || params.field === 'constraint') {
                            return true;
                          }
                          return params.row.isMap;
                        }}
                        disableEdit={(params) => {
                          if (params.field === 'defaultValue' || params.field === 'constraint') {
                            return true;
                          }
                          return !params.row.isMap;
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
                          '& .MuiDataGrid-row': { marginTop: 0.5, marginBottom: 0.5 },
                          fontSize: '10pt',
                          '& .coloured': { textAlign: 'center', color: '#7181AD' },
                          '& .MuiDataGrid-virtualScroller::-webkit-horizontal-scrollbar': { display: 'none' },
                        }}
                      />

                    </Box>
                  </div>
                ))}
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