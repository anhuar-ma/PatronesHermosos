import { useState, useEffect } from "react";
import axios from "axios";

export const useEditColaborador = (colaborador) => {
  const [editableData, setEditableData] = useState({});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (colaborador) {
      setEditableData({ ...colaborador }); // Clona para evitar problemas de referencia
    }
  }, [colaborador]);

  const handleChange = (field, value) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };

// useEditParticipante.js
  const handleSave = async (id) => {
    const response = await axios.put(`/api/colaboradores/${id}`, editableData);
    return { ...editableData, ...response.data }; // Combina la data local con la del servidor
  };
  

  return {
    editableData,
    setEditableData,
    handleChange,
    handleSave,
    editMode,
    setEditMode,
  };
};
