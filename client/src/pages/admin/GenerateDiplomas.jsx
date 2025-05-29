import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/GenerateDiplomas.css';

const GenerateDiplomas = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState(null);

  const handleGenerateDiplomas = async () => {
    setIsGenerating(true);
    setMessage(null);

    try {
      const response = await axios.get('/api/diplomas/generate', {
        responseType: 'blob',
        withCredentials: true,
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'diplomas.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage('¡Diplomas generados exitosamente!');
    } catch (err) {
      console.error('Error:', err);
      setMessage('Error al generar los diplomas');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="generate-diplomas__container">
      <button
        className="generate-diplomas__button"
        onClick={handleGenerateDiplomas}
        disabled={isGenerating}
      >
        {isGenerating ? 'Generando...' : 'Generar diploma'}
      </button>

      {message && (
        <div
          className={`generate-diplomas__message ${
            message.includes('Error')
              ? 'generate-diplomas__message--error'
              : 'generate-diplomas__message--success'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default GenerateDiplomas;