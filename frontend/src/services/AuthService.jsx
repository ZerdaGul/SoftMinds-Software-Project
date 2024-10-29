import axios from 'axios';

const api = "http://localhost:5115/api/"

export const RegisterUser = async (data) => {
    try {
        const response = await axios.post( api + 'register', data,{
            headers: {
              'Content-Type': 'application/json'
            }
        }); 
    } catch (error) {
        if (error.response) {
          throw new Error(error.response.data)
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
        
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data)
      } 
    }
}

export const GetActiveUser = async () => {
  try {
      const response = await axios.get( `${api}auth/active-session`,{
          headers: {
            'Content-Type': 'application/json'
          }
      })
      const data = await response.data;
      return data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data)
    } 
  }
}