import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomAlert from './CustomAlert'; // Import the custom alert component
import './css/AddNamePage.css'; // Import the CSS file
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import MuiAlert  from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CheckIcon from '@mui/icons-material/Check';

function AddNamePage() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState('');
  const [prototypeName, setPrototypeName] = useState('');

  const handleNameChange = (event) => {
    setPrototypeName(event.target.value);
   
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Make the API call to the endpoint
      const response = await fetch(`http://localhost:8080/create?prototypeName=${prototypeName}`);
      if (response.ok) {
        setOpen(true);
        const unformattedName = prototypeName.replace(".xml", "");
        const fullPath = `/prototype/local/${unformattedName}`;
        console.log(fullPath);
        await timeout(2000);
        navigate(fullPath);
      } else {
        // Handle the error condition, e.g., show an error message
        console.error('API call failed:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred while making the API call:', error);
    }
  };

  function timeout(delay) {
    return new Promise( res => setTimeout(res, delay) );
}

  return (
    <div>
      <Box
        sx={{
          height: "100%",
          display:"flex",
          marginTop: "240px",
          alignItems:"center",
          justifyContent:"center",
           // Adjust padding for responsiveness
         
        }}
      >
        <Card sx={{ width: '100%', maxWidth: '600px' }}>
          <CardContent sx={{ margin: '70px'}}>           
          <h3 className='add-prototype-title' >Add Prototype Name</h3>

            <form onSubmit={handleSubmit} >
              <TextField
                required
                id='standard-required'
                label='Prototype Name'
                defaultValue=''
                variant='standard'
                type='text'
                size='small'
                fullWidth // Take up full width
                value={prototypeName}
                onChange={handleNameChange}
              />

              <Box
                component='span'
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                marginTop='40px'
              >
                <Button
                  variant='text'
                  component={Link}
                  to='/'
                  sx={{
                    height: '40px',
                    color: '#9b9b9b',
                    textDecoration: 'underline',
                    '&:hover': {
                      color: '#535353',
                      textDecoration: 'underline',
                      backgroundColor: '#e6e6e6',
                    },
                  }}
                >
                  Cancel
                </Button>

                <Button
                  variant='contained'
                  type='submit'
                  size = 'small'
                  sx={{
                    backgroundColor: '#b3b3b3',
                    height: '40px',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    minWidth: '80px', // Adjust width for responsiveness
                    marginLeft: '20px',
                    '&:hover': {
                      backgroundColor: '#9b9b9b',
                    },
                  }}
                >
                  Save
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>

      <Snackbar open={open} autoHideDuration={10000}>
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success" sx={{ width: '100%' }}>
          Prototype created successfully!
        </Alert>
      </Snackbar>

    </div>
  );
}

export default AddNamePage;
