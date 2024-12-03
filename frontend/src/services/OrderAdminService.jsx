import axios from "axios";

// const api = "https://api.ekoinv.com/api/"
const api = "http://localhost:5115/api/"

export const AcceptOrder = async (data) => {
    try {
      const response = await axios.post(`${api}accept-order`, data, {
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
        throw new Error("An unknown error occurred."); // Catch other errors
      }
    }
  }

  export const RejectOrder = async (data) => {
    try {
      const response = await axios.post(`${api}reject-order`, data, {
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
        throw new Error("An unknown error occurred."); // Catch other errors
      }
    }
  }

  export const GetOrders = async () => {
    try {
      const response = await axios.get(`${api}get-orders`, {
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
        throw new Error("An unknown error occurred."); // Catch other errors
      }
    }
  }