import { useState, useEffect } from "react";
import axios from "axios";

export const useEditParticipante = (participante) => {
  const [editableData, setEditableData] = useState({});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (participante) {
      setEditableData({ ...participante }); // Clona para evitar problemas de referencia
    }
  }, [participante]);

  const handleChange = (field, value) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };

// useEditParticipante.js
  const handleSave = async (id) => {
    const response = await axios.put(`/api/participantes/${id}`, editableData);
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
