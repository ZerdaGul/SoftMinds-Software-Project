import axios from 'axios';

const api = "https://api.ekoinv.com/api/"

export const LoadProducts = async (data) => {
  try {
    const response = await axios.get(`${api}products`, {
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
      throw new Error("An unknown error occurred."); // Catch other errors
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
      throw new Error("An unknown error occurred."); // Catch other errors
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
      throw new Error("An unknown error occurred."); // Catch other errors
    }
  }
}

/*Cart actions */

export const AddToCart = async (data) => {
  try {
    const response = await axios.get(`${api}Cart`, {
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


/*Comments */

export const AddComment = async (id, text) => {
  try {
    const response = await axios.post(
      `${api}products/${id}/comments`,
      {
        params: text, //text

        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {

      throw new Error(error.response.data); // Ensure error.response.data exists
    } else {
      throw new Error("An unknown error occurred."); // Catch other errors
    }
  }
}

export const GetProductComments = async (id, data) => {
  try {
    const response = await axios.get(
      `${api}products/${id}/comments`,
      {
        params: data,  //pageNumber, commentsPerPage

        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {

      throw new Error(error.response.data); // Ensure error.response.data exists
    } else {
      throw new Error("An unknown error occurred."); // Catch other errors
    }
  }
}

export const DeleteProductComment = async (productId, commentId) => {
  try {
    const response = await axios.delete(
      `${api}products/${productId}/comments/${commentId}`,
      {
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {

      throw new Error(error.response.data); // Ensure error.response.data exists
    } else {
      throw new Error("An unknown error occurred."); // Catch other errors
    }
  }
}
export const DeleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${api}products/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data); // Ensure error.response.data exists
    } else {
      throw new Error("An unknown error occurred."); // Catch other errors
    }
  }
};
