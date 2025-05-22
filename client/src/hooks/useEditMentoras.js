import { useState, useEffect } from "react";
import axios from "axios";

export const useEditMentora = (mentora) => {
  const [editableData, setEditableData] = useState({});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (mentora) {
      setEditableData({ ...mentora }); // Clona para evitar problemas de referencia
    }
  }, [mentora]);

  const handleChange = (field, value) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };

// useEditMentora.js
  const handleSave = async (id) => {
    const response = await axios.put(`/api/mentoras/${id}`, editableData);
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