import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './css/AddSchemePage.css'; // Import the CSS file

function AddSchemePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const prototypeName = new URLSearchParams(location.search).get('prototypeName');
  const [schemeId, setSchemeId] = useState('');

  const handleSchemeIdChange = (value) => {
    setSchemeId(value);
  };

  const handleSkipStep = () => {
    navigate(`/add-scheme?prototypeName=${prototypeName}`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://localhost:8080/addScheme?prototypePath=/local/${prototypeName}&schemeId=${schemeId}`);

      if (!response.ok) {
        console.error('Error adding scheme');
        return;
      }

      // Navigate to the next page or perform any other action
    } catch (error) {
      console.error('API call error:', error);
    }
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <h2 className="page-title">Add Scheme</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="input-label">
              Scheme ID
              <input
                type="text"
                className="input-field"
                value={schemeId}
                onChange={(e) => handleSchemeIdChange(e.target.value)}
              />
            </label>
          </div>
           <span className="form-footer">
                <button type="submit" className="next-button">Finish</button>
            </span>
            
            <span className = "skip">
                <button
                className="skip-link"
                onClick={handleSkipStep}
                >
                Skip this step
                </button>
            </span>
        </form>
      </div>
    </div>
  );
}

export default AddSchemePage;
