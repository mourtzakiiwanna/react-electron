import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './css/AddInheritancePage.css'; // Import the CSS file

function AddInheritancePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const prototypeName = new URLSearchParams(location.search).get('prototypeName');
  const [inheritedPrototypes, setInheritedPrototypes] = useState(['']); // Array to store inherited prototypes

  const handleInheritanceChange = (index, value) => {
    const updatedInheritedPrototypes = [...inheritedPrototypes];
    updatedInheritedPrototypes[index] = value;
    setInheritedPrototypes(updatedInheritedPrototypes);
  };

  const handleAddInheritanceField = () => {
    setInheritedPrototypes([...inheritedPrototypes, '']);
  };

  const handleSkipStep = () => {
    navigate(`/add-fields?prototypeName=${prototypeName}`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      for (const inheritedPrototype of inheritedPrototypes) {
        if (inheritedPrototype.trim() === '') {
          continue; // Skip empty inherited prototypes
        }
        
        const response = await fetch(`http://localhost:8080/updateInheritance?prototypePath=/local/${prototypeName}&inheritedPrototypes=${inheritedPrototype}`);

        if (!response.ok) {
          console.error('Error updating inheritance');
          return;
        }
      }

      navigate(`/add-fields?prototypeName=${prototypeName}`);
    } catch (error) {
      console.error('API call error:', error);
    }
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <h2 className="page-title">Add Inherited Prototypes</h2>
        <form onSubmit={handleSubmit}>
          {inheritedPrototypes.map((inheritedPrototype, index) => (
            <div key={index}>
              <label className="input-label">
                Inherited Prototype {index + 1}
                <input
                  type="text"
                  className="input-field"
                  value={inheritedPrototype}
                  onChange={(e) => handleInheritanceChange(index, e.target.value)}
                />
              </label>
            </div>
          ))}
            <span className="form-footer">
            <button
              type="button"
              className="add-button"
              onClick={handleAddInheritanceField}
            >
              Add Inherited Prototype
            </button>
                <button type="submit" className="next-button">Next</button>
            </span>
            <div className = "skip">
                <button
                className="skip-link"
                onClick={handleSkipStep}
                >
                Skip this step
                </button>
            </div>

        </form>
      </div>
    </div>
  );
}

export default AddInheritancePage;
