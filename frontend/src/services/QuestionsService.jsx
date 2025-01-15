import axios from 'axios';

import { api } from './api';

export const GetQuestionsCustomer = async () => {
    try {
      const response = await axios.get(`${api}questions/customer`, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })
      const allQuestions = response.data;

        // Sort questions into answered and unanswered arrays
        const answered = allQuestions.filter(question => question.answer_Text);
        const unanswered = allQuestions.filter(question => !question.answer_Text);

        return { answered, unanswered };
      
    } catch (error) {
      console.log(error)
      if (error.response) {
  
        throw new Error(error.response.data); // Ensure error.response.data exists
      } else {
        throw new Error("An unknown error occurred."); // Catch other errors
      }
    }
  }

  export const SendQuestionsCustomer = async (data) => {
    try {
      const response = await axios.post(`${api}questions/customer`,
      data,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
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




  export const GetQuestionsAdmin = async () => {
    try {
      const response = await axios.get(`${api}questions/admin`, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })
      const allQuestions = response.data;

      // Sort questions into answered and unanswered arrays
      const answered = allQuestions.filter(question => question.answer_Text);
      const unanswered = allQuestions.filter(question => !question.answer_Text);

      return { answered, unanswered };
    } catch (error) {
      console.log(error)
      if (error.response) {
  
        throw new Error(error.response.data); // Ensure error.response.data exists
      } else {
        throw new Error("An unknown error occurred."); // Catch other errors
      }
    }
  }

  export const SendAnswerAdmin = async (data) => {
    try {
      const response = await axios.post(`${api}questions/admin/answer`,
      data,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
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