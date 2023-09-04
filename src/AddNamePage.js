import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomAlert from './CustomAlert'; // Import the custom alert component
import './css/AddNamePage.css'; // Import the CSS file

function AddNamePage() {
  const navigate = useNavigate();

  const [prototypeName, setPrototypeName] = useState('');
  const [showAlert, setShowAlert] = useState(false); // State to control alert display

  const handleNameChange = (event) => {
    setPrototypeName(event.target.value);
    setShowAlert(false); // Hide the alert when input changes
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (prototypeName.trim() === '') {
      setShowAlert(true); // Show the alert
    } else {
      try {
        // Make the API call to the endpoint
        const response = await fetch(`http://localhost:8080/create?prototypeName=${prototypeName}`);
        
        if (response.ok) {
          navigate(`/add-inheritance?prototypeName=${prototypeName}`);
        } else {
          // Handle the error condition, e.g., show an error message
          console.error('API call failed:', response.statusText);
        }
      } catch (error) {
        console.error('An error occurred while making the API call:', error);
      }
    }
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <h2 className="page-title">Add Prototype Name</h2>
        <form onSubmit={handleSubmit}>
          <label className="input-label">
            Prototype Name
            <input
              className="input-field"
              type="text"
              value={prototypeName}
              onChange={handleNameChange}
            />
          </label>
          {showAlert && <CustomAlert message="Please enter a prototype name." />}
          <div className="form-footer">
            <button className="next-button" type="submit">
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddNamePage;
