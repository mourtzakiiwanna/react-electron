import CheckIcon from '@mui/icons-material/Check';
import WarningIcon from '@mui/icons-material/Error';
import MuiAlert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

function AddPrototypePage() {

    const baseURL = 'http://localhost:8080/api/type';

    const navigate = useNavigate();
    const [alert, setAlert] = useState(false);
    const [alertContent, setAlertContent] = useState('');
    const [prototypeName, setPrototypeName] = useState('');
    const [success, setSuccess] = useState(false);

    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Origin', 'http://localhost:3000');
    const handleNameChange = (event) => {
        setPrototypeName(event.target.value);
    };

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (prototypeName) {
            try {
                const existingPrototypes = await fetchExistingPrototypes(`${baseURL}/category/local`);

                const isPrototypeExists = existingPrototypes.includes(prototypeName);

                if (isPrototypeExists) {
                    setAlertContent('Prototype with the same name already exists. Please choose a different name.');
                } else {
                    await createPrototype(`${baseURL}/${prototypeName}`);
                    setSuccess(true);
                    setAlertContent('The prototype has been successfully created!');
                    setTimeout(() => {
                        navigate(`/prototype/local/${prototypeName}`);
                    }, 2000);
                }
            } catch (error) {
                console.error('Error checking existing prototypes or creating prototype:', error);
                setAlertContent('An error occurred. Please try again.');
            }
        } else {
            setAlertContent('Please enter a valid prototype name.');
        }

        setAlert(true);
        setTimeout(() => {
            setAlert(false);
        }, 2000);
    };

    const handleAddToBatch = async (event) => {
        event.preventDefault();

        if (prototypeName) {
            try {
                const existingPrototypes = await fetchExistingPrototypes(`${baseURL}/category/local`);

                const isPrototypeExists = existingPrototypes.includes(prototypeName);

                if (isPrototypeExists) {
                    setAlertContent('Prototype with the same name already exists. Please choose a different name.');
                } else {
                    const actionObject = {
                        action: 'CreatePrototype',
                        prototypeName: prototypeName,
                    };

                    const existingActions = JSON.parse(localStorage.getItem('batchActions')) || [];
                    existingActions.push(actionObject);
                    localStorage.setItem('batchActions', JSON.stringify(existingActions));


                    setSuccess(true);
                    setAlertContent('This action has been successfully added to batch!');
                    setTimeout(() => {
                        navigate("/prototype/local/AbstractDateRange");
                    }, 2000);
                }
            } catch (error) {
                console.error('Error checking existing prototypes or creating prototype:', error);
                setAlertContent('An error occurred. Please try again.');
            }
        } else {
            setAlertContent('Please enter a valid prototype name.');
        }

        setAlert(true);
        setTimeout(() => {
            setAlert(false);
        }, 2000);


    };


    async function fetchExistingPrototypes(url = "") {
        const response = await fetch(url, {
            method: "GET",
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    }

    async function createPrototype(url = "") {
        const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: headers,
            redirect: "follow",
            referrerPolicy: "no-referrer",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
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
                <Card sx={{width: '100%', maxWidth: '600px'}}>
                    <CardContent sx={{margin: '70px'}}>
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
                                alignItems="center"
                                marginTop="20px"
                            >
                                <Button
                                    variant="text"
                                    component={Link}
                                    to="/"
                                    sx={{
                                        height: '40px',
                                        color: '#9b9b9b',
                                        textDecoration: 'underline',
                                        marginRight: '90px',
                                        '&:hover': {
                                            color: '#535353',
                                            textDecoration: 'underline',
                                            backgroundColor: '#e6e6e6',
                                        },
                                    }}
                                >
                                    Cancel
                                </Button>

                                <button className="save-action-button" type = "submit" onClick={handleAddToBatch}>Save prototype</button>
                                <button className="add-action-batch-button" onClick={handleAddToBatch}>Add to Batch</button>

                            </Box>
                        </form>
                    </CardContent>
                </Card>
            </Box>

            <Snackbar open={alert} autoHideDuration={6000} onClose={() => setAlert(false)}>
                <Alert
                    icon={false}
                    severity={success ? 'success' : 'error'}
                    sx={{width: '100%', fontWeight: '500'}}
                >
                    {alertContent}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default AddPrototypePage;
