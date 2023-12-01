import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/CreatePrototype.css'; // Import your CSS file for styling


function CreatePrototype() {
  const navigate = useNavigate(); // Use the useNavigate hook

  let headers = new Headers();

  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Origin','http://localhost:3000');

  const [prototypeInfo, setPrototypeInfo] = useState({
    // Initialize your state for prototype information fields here
  });

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setPrototypeInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createPrototype(`http://localhost:8080/api/type/${prototypeInfo.name}`);
    navigate('/');
  };

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
    
    return response.json(); 
  }

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
