import { useState, useEffect } from "react";
import axios from "axios";

export const useEditSede = (sede) => {
  const [editableData, setEditableData] = useState({});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (sede) {
      setEditableData({ ...sede }); // Clona para evitar problemas de referencia
    }
  }, [sede]);

  const handleChange = (field, value) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };

// useEditParticipante.js
  const handleSave = async (id) => {
    const response = await axios.put(`/api/sedes/${id}`, editableData);
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
