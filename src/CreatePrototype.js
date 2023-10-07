import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/CreatePrototype.css'; // Import your CSS file for styling

function CreatePrototype() {
  const navigate = useNavigate(); // Use the useNavigate hook
  const [prototypeInfo, setPrototypeInfo] = useState({
    // Initialize your state for prototype information fields here
  });

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setPrototypeInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform actions to save prototype info (e.g., API call, etc.)
    // After saving, you can navigate back to the Home page
    navigate('/');
  };

  return (
    <div className='create-prototype-container'>
      <div className="create-page">
        <h2>Create New Prototype</h2>
        <form onSubmit={handleSubmit}>
          {/* Render your input fields for prototype info */}
          <label className="create-label">
            Prototype Name:
            <input
              type="text"
              name="prototypeName"
              value={prototypeInfo.prototypeName || ''}
              onChange={handleFieldChange}
              className="create-input"
            />
          </label>
          {/* Add more input fields as needed */}
          <button type="submit" className="create-button">
            Save Prototype
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePrototype;
