import axios from 'axios';

const api = "https://api.ekoinv.com/api/"
// const api = "http://localhost:5115/api/"

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
};


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

/*Cart actions */

export const AddToCart = async (data) => {
  try {
    const response = await axios.get(`${api}cart`, {
      params: data,
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })
    return response.data;
  } catch (error) {
    if (error.response) {

      throw new Error(error.response.data); // Ensure error.response.data exists
    } else {
      throw new Error("An unknown error occurred while adding Products to Cart."); // Catch other errors
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
        },
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {

      throw new Error(error.response.data); // Ensure error.response.data exists
    } else {
      throw new Error("An unknown error occurred while Adding Comments."); // Catch other errors
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
      throw new Error("An unknown error occurred while getting product comments."); // Catch other errors
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
        },
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {

      throw new Error(error.response.data); // Ensure error.response.data exists
    } else {
      throw new Error("An unknown error occurred while deleting product comments."); // Catch other errors
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
      throw new Error("An unknown error occurred while deleting products."); // Catch other errors
    }
  }
};

export const EditProduct = async (id, updatedData) => {
  try {
    const response = await axios.put(`${api}products/${id}`, updatedData, {
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
      throw new Error(error.response.data); // API'den gelen hatayı işleyin
    } else {
      throw new Error("An unknown error occurred while adding product."); // Diğer hatalar için
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