import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env';

// Obtener el token del almacenamiento local
const obtenerToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    return token;
  } catch (error) {
    console.error('Error al obtener el token:', error);
    return null;
  }
};

export const obtenerTodosLosBienes = async () => {
  try {
    const token = await obtenerToken(); // Obtener el token dinámicamente
    if (!token) {
      throw new Error('No se encontró un token válido');
    }

    const response = await fetch(`${API_BASE_URL}/bienes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { result } = await response.json();
    return result;
  } catch (error) {
    console.error('Error al obtener bienes:', error);
    throw error;
  }
};
