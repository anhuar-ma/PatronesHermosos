import React, { useState } from 'react';
import axios from 'axios';

const GenerateDiplomas = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState(null);

  const handleGenerateDiplomas = async () => {
    setIsGenerating(true);
    setMessage(null);

    try {
      // Call the backend API endpoint
      const response = await axios.get('/api/diplomas/generate', {
        responseType: 'blob',
        withCredentials: true
      });

      // Create a download link for the received file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'diplomas.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage('Diplomas generated successfully!');
      setIsGenerating(false);
    } catch (err) {
      console.error('Error:', err);
      setMessage('Error generating diplomas');
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h3>Diploma Generator</h3>

      <button
        style={{
          padding: '10px 15px',
          backgroundColor: '#4B0082',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isGenerating ? 'not-allowed' : 'pointer'
        }}
        onClick={handleGenerateDiplomas}
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating...' : 'Generate Diplomas'}
      </button>

      {isGenerating && (
        <p style={{ marginTop: '10px' }}>Processing, please wait...</p>
      )}

      {message && (
        <p style={{
          marginTop: '10px',
          padding: '8px',
          backgroundColor: message.includes('Error') ? '#ffdddd' : '#ddffdd',
          borderRadius: '4px'
        }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default GenerateDiplomas;