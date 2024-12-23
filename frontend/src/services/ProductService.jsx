import axios from 'axios';

import { api } from './api';

export const LoadProducts = async (data) => {
  try {
    const response = await axios.get(`${api}products`, {
      params: data,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data; // Başarılı yanıt
  } catch (error) {
    if (error.response) {
      // Backend bir hata döndürdü
      console.error("API Error:", error.response.data);
      throw new Error(error.response.data.message || "API Error occurred");
    } else if (error.request) {
      // İstek gönderildi ama yanıt alınamadı
      console.error("No response received:", error.request);
      throw new Error("No response from server. Please try again later.");
    } else {
      // İstek hazırlanırken bir hata oluştu
      console.error("Request Error:", error.message);
      throw new Error("Error occurred while making the request.");
    }
  }
}
export const LoadFeaturedProducts = async () => {
  try {
    const response = await axios.get(`${api}homepage/featured-products`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data;
  } catch (error) {
    if (error.response) {

      throw new Error(error.response.data); // Ensure error.response.data exists
    } else {
      throw new Error("An unknown error occurred."); // Catch other errors
    }
  }
}

export const SearchProducts = async (data) => {
  try {
    const response = await axios.get(`${api}products/search`, {
      params: data,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data;
  } catch (error) {
    if (error.response) {

      throw new Error(error.response.data); // Ensure error.response.data exists
    } else {
      throw new Error("An unknown error occurred while searching Products."); // Catch other errors
    }
  }
}

export const LoadSingleProduct = async (id) => {
  try {
    const response = await axios.get(`${api}products/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data;
  } catch (error) {
    if (error.response) {

      throw new Error(error.response.data); // Ensure error.response.data exists
    } else {
      throw new Error("An unknown error occurred while loading the Product Detail."); // Catch other errors
    }
  }
}

export const LoadSectors = async (data) => {
  try {
    const response = await axios.get(`${api}categories`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data;
  } catch (error) {
    if (error.response) {

      throw new Error(error.response.data); // Ensure error.response.data exists
    } else {
      throw new Error("An unknown error occurred while loading Sectors."); // Catch other errors
    }
  }
}




/*Comments */

export const AddComment = async (productId, text) => {
  try {
    const response = await axios.post(
      `${api}products/${productId}/comments`,
      { text },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data); // Ensure error.response.data exists
    } else {
      throw new Error("An unknown error occurred while adding the comment."); // Catch other errors
    }
  }
}

// Get product comments
export const GetProductComments = async (productId, pageNumber = 1, commentsPerPage = 10) => {
  try {
    const response = await axios.get(
      `${api}products/${productId}/comments`,
      {
        params: { pageNumber, commentsPerPage },
        withCredentials: true
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data); // Ensure error.response.data exists
    } else {
      throw new Error("An unknown error occurred while getting product comments."); // Catch other errors
    }
  }
}

// Delete product comment
export const DeleteProductComment = async (productId, commentId) => {
  try {
    const response = await axios.delete(
      `${api}products/${productId}/comments/${commentId}`,
      {
        withCredentials: true
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data); // Ensure error.response.data exists
    } else {
      throw new Error("An unknown error occurred while deleting the comment."); // Catch other errors
    }
  }
}

// Update product comment
export const UpdateProductComment = async (productId, commentId, text) => {
  try {
    const response = await axios.put(
      `${api}products/${productId}/comments/${commentId}`,
      { text },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data); // Ensure error.response.data exists
    } else {
      throw new Error("An unknown error occurred while updating the comment."); // Catch other errors
    }
  }
}


export const GetOrdersHistory = async (userId) => {
  try {
    const response = await axios.get(`${api}order-history/${userId}`, {
      headers: {
        'Content-Type': 'application/json'
      },
    })
    return response.data;
  } catch (error) {
    console.log(error)
    if (error.response) {

      throw new Error(error.response.data); // Ensure error.response.data exists
    } else {
      throw new Error("An unknown error occurred while getting order history."); // Catch other errors
    }
  }
}

