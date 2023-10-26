import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/AddNamePage.css';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CheckIcon from '@mui/icons-material/Check';
import WarningIcon from '@mui/icons-material/Error'; // Import the warning icon

function AddNamePage() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState('');
  const [prototypeName, setPrototypeName] = useState('');

  const handleNameChange = (event) => {
    setPrototypeName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (prototypeName) {
      // If the prototypeName is not empty, display a success message
      setAlertContent('The prototype has been successfully created!');
    } else {
      // If the prototypeName is empty, display "Enter name" message
      setAlertContent('Please enter a valid prototype name.');
    }

    setAlert(true); // Show the Snackbar alert
  };

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  return (
    <div>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          marginTop: '240px',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card sx={{ width: '100%', maxWidth: '600px' }}>
          <CardContent sx={{ margin: '70px' }}>
            <h3 className="add-prototype-title">Create Prototype</h3>

            <form onSubmit={handleSubmit} noValidate={true}>
              <TextField
                required
                id="standard-required"
                label="Prototype Name"
                defaultValue=""
                variant="standard"
                type="text"
                size="small"
                fullWidth
                value={prototypeName}
                onChange={handleNameChange}
              />

              <Box
                component="span"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                marginTop="40px"
              >
                <Button
                  variant="text"
                  component={Link}
                  to="/"
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
                  variant="contained"
                  type="submit"
                  size="small"
                  sx={{
                    backgroundColor: '#b3b3b3',
                    height: '40px',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    minWidth: '80px',
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

      <Snackbar open={alert} autoHideDuration={6000} onClose={() => setAlert(false)}>
        <MuiAlert
          icon={prototypeName ? <CheckIcon /> : <WarningIcon />} // Use CheckIcon for success, WarningIcon for "Enter name"
          severity={prototypeName ? 'success' : 'error'}
          sx={{ width: '100%', fontWeight: '500' }}
        >
          {alertContent}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

export default AddNamePage;
