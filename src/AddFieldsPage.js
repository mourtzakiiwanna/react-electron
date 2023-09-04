import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './css/AddFieldsPage.css'; // Import the CSS file

function AddFieldsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const prototypeName = new URLSearchParams(location.search).get('prototypeName');

  const [fields, setFields] = useState([
    {
      id: '',
      fgId: '',
      valueType: '',
      trans: false,
      array: false,
      map: false,
      constraint: '',
      defaultValue: '',
    },
  ]);

  const handleFieldChange = (index, fieldKey, value) => {
    const updatedFields = [...fields];
    updatedFields[index][fieldKey] = value;
    setFields(updatedFields);
  };

  const handleAddField = () => {
    setFields([
      ...fields,
      {
        id: '',
        fgId: '',
        valueType: '',
        trans: false,
        array: false,
        map: false,
        constraint: '',
        defaultValue: '',
      },
    ]);
  };

  const handleSkipStep = () => {
    navigate(`/add-scheme?prototypeName=${prototypeName}`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      for (const field of fields) {
        if (field.id.trim() === '') {
          continue; // Skip empty fields
        }

        const response = await fetch(`http://localhost:8080/updateField`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prototypePath: `/local/${prototypeName}`,
            id: field.id,
            fgId: field.fgId,
            valueType: field.valueType,
            trans: field.trans,
            array: field.array,
            map: field.map,
            constraint: field.constraint,
            defaultValue: field.defaultValue,
          }),
        });

        if (!response.ok) {
          console.error('Error updating field');
          return;
        }
      }

      navigate(`/add-scheme?prototypeName=${prototypeName}`);
    } catch (error) {
      console.error('API call error:', error);
    }
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <h2 className="page-title">Add Fields</h2>
        <form onSubmit={handleSubmit}>
          {fields.map((field, index) => (
            <div key={index}>
              <label className="input-label">
                Field ID {index + 1}:
                <input
                  type="text"
                  className="input-field"
                  value={field.id}
                  onChange={(e) => handleFieldChange(index, 'id', e.target.value)}
                />
              </label>
              <label className="input-label">
                Field Group ID:
                <input
                  type="text"
                  className="input-field"
                  value={field.fgId}
                  onChange={(e) => handleFieldChange(index, 'fgId', e.target.value)}
                />
              </label>
              {/* ... Additional fields ... */}
              {/* Checkbox for trans, array, map ... */}
            </div>
          ))}
             <span className="form-footer">
            <button
              type="button"
              className="add-button"
              onClick={handleAddField}
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

export default AddFieldsPage;
