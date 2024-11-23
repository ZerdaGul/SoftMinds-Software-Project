import axios from 'axios';

const api = "http://localhost:5115/api/"

export const RegisterUser = async (data) => {
  try {
      const response = await axios.post(api + 'register', data, {
          headers: {
              'Content-Type': 'application/json'
          }
      });
      return response; // Return response if needed
  } catch (error) {
      if (error.response) {
          throw new Error(error.response.data); // Ensure error.response.data exists
      } else {
          throw new Error("An unknown error occurred."); // Catch other errors
      }
  }
}


export const DeleteUser = async (id) => {
    try {
        const response = await axios.delete( `${api}account/delete/${id}`,{
            headers: {
              'Content-Type': 'application/json'
            }
        }); 
        return response;
    } catch (error) {
      
     
      if (error.errors && error.errors.id) {
        
        throw new Error(error.errors.id[0]); // Ensure error.response.data exists
      } else {
          throw new Error("An unknown error occurred."); // Catch other errors
      }
      
    }
}

export const GetActiveUser = async () => {
  try {
      const response = await axios.get( `${api}auth/active-session`,{
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true // Enable cookies 
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

export const LogIn = async (data) => {
    try {
      const response = await axios.post( `${api}auth/login`, data, {
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
        throw new Error("An unknown error occurred."); // Catch other errors
    }
  }
}
export const LogOut = async () => {
  try {
    const response = await axios.post( `${api}auth/logout`, {
        headers: {
          'Content-Type': 'application/json'
        },
        
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

export const UpdateUser = async (data) => {
  try {
    const response = await axios.post( `${api}update/update`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
    })
    return response.data;
  } catch (error) {
    console.log(error)
    if (error.response) {
      
      throw new Error(error.response.data.title); // Ensure error.response.data exists
    } else {
        throw new Error("An unknown error occurred."); // Catch other errors
    }
  }
}

export const ResetPassword = async (data) => {
  try {
    const response = await axios.post( `${api}update/reset-password`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
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

export const ForgotPasswordSendRequest = async (data) => {
  try {
    const response = await axios.post( `${api}forgotpassword/request`, data, {
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

export const CreatePassword = async (data) => {
  try {
    const response = await axios.post( `${api}forgotpassword/reset`, data, {
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