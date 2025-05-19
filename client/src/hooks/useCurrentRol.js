// src/hooks/useCurrentRol.js
import { jwtDecode } from "jwt-decode";

export default function useCurrentRol() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const { rol } = jwtDecode(token);
    return rol;
  } catch {
    return null;
  }
}
