import axios from 'axios';

import { api } from './api';

export const AddProduct = async (data) => {
  try {
    const response = await axios.post(`${api}add-product`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data); // Handle API errors
    } else {
      throw new Error("An unknown error occurred while adding product."); // Handle other errors
    }
  }
};
export const GetProductPhoto = async (id) => {
  try {
      const response = await axios.get(`${api}products/${id}/photo`, {
          responseType: 'blob', // Fotoğraf verisi binary olarak gelir
      });
      return URL.createObjectURL(response.data); // Fotoğrafı bir URL’ye çevirin
  } catch (error) {
      if (error.response) {
          throw new Error(error.response.data || "Fotoğraf yüklenirken hata oluştu.");
      } else {
          throw new Error("Sunucudan yanıt alınamadı.");
      }
  }
};


export const DeleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${api}delete-product/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data); // Ensure error.response.data exists
    } else {
      throw new Error("An unknown error occurred while deleting products."); // Catch other errors
    }
  }
};

export const EditProduct = async (updatedData) => {
  try {
    const response = await axios.post(`${api}update-product`, updatedData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data); // API hatalarını yönet
    } else {
      throw new Error("An unknown error occurred while editing products."); // Diğer hatalar için
    }
  }
};

export const fetchMonthlyRevenue = async () => {
  try {
    const responses = await Promise.all(
      Array.from({ length: 12 }, (_, i) =>
        axios.get(`${api}get-income-by-month?month=${i + 1}&year=2025`)
      )
    );
    return responses.map(response => response.data);
  } catch (error) {
    console.error("Error fetching monthly revenue:", error);
  }
};

export const getStockBySector = async () => {
  try {
    const response = await axios.get(`${api}products/stock-by-sector`);
    return response.data;
  } catch (error) {
    console.error("Error fetching stock by sector:", error);
  }
};