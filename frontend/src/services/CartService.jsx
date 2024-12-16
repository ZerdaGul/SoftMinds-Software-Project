import axios from 'axios';

import { api } from './api';

/* Cart actions */

// Add to cart
export const AddToCart = async (data) => {
    try {
      const response = await axios.post(`${api}cart`, data, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data); // Ensure error.response.data exists
      } else {
        throw new Error("An unknown error occurred while adding Products to Cart."); // Catch other errors
      }
    }
  }
  
  // Remove item from cart
  export const RemoveItemFromCart = async (productId) => {
    try {
      const response = await axios.delete(`${api}cart/remove-item`, {
        params: { productId },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data);
      } else {
        throw new Error("An unknown error occurred while removing the item from the cart.");
      }
    }
  }
  
  // Clear cart
  export const ClearCart = async () => {
    try {
      const response = await axios.delete(`${api}cart/clear`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data);
      } else {
        throw new Error("An unknown error occurred while clearing the cart.");
      }
    }
  }
  
  // Get cart items
  export const GetCartItems = async () => {
    try {
      const response = await axios.get(`${api}cart`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data);
      } else {
        throw new Error("An unknown error occurred while retrieving cart items.");
      }
    }
  }
  
  // Get cart summary
  export const GetCartSummary = async () => {
    try {
      const response = await axios.get(`${api}cart/summary`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data);
      } else {
        throw new Error("An unknown error occurred while retrieving the cart summary.");
      }
    }
  }
  
  // Update cart item quantity
  export const UpdateCartItemQuantity = async (productId, quantity) => {
    try {
      const response = await axios.put(`${api}cart/update-quantity`, { productId, quantity }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data);
      } else {
        throw new Error("An unknown error occurred while updating the cart item quantity.");
      }
    }
  }
  
  // Checkout
  export const Checkout = async () => {
    try {
      const response = await axios.post(`${api}cart/checkout`, {}, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data);
      } else {
        throw new Error("An unknown error occurred while checking out.");
      }
    }
  }