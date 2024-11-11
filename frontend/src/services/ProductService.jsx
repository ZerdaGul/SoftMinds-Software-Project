import axios from 'axios';

const api = "http://localhost:5115/api/"

export const LoadProducts = async (data) => {
    try {
      const response = await axios.get( `${api}products`,  {
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
        throw new Error("An unknown error occurred."); // Catch other errors
    }
  }
}

export const SearchProducts = async (data) => {
  try {
    const response = await axios.get( `${api}products/search`,  {
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
      throw new Error("An unknown error occurred."); // Catch other errors
  }
}
}

export const LoadSingleProduct = async (id) => {
  try {
    const response = await axios.get( `${api}products/${id}`,  {
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

export const LoadSectors = async (data) => {
    try {
      const response = await axios.get( `${api}categories`, {
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

export const AddToCart = async (data) => {
    try {
      const response = await axios.get( `${api}Cart`, {
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
        throw new Error("An unknown error occurred."); // Catch other errors
    }
  }
}