import React, { useEffect, useState } from 'react'
import ContactForm from '../contact-form/ContactForm';

import './questionsListCustomer.scss'

const sampleAnsweredQuestions = [
    {
      Id: 1,
      Question_Text: "What is the return policy?",
      Created_At: "2024-12-01",
      Answer_Text: "You can return items within 30 days with a valid receipt.",
      Answered_At: "2024-12-02",
    },
    {
      Id: 2,
      Question_Text: "Do you ship internationally?",
      Created_At: "2024-12-03",
      Answer_Text: "Yes, we ship to over 50 countries worldwide.",
      Answered_At: "2024-12-04",
    },
    {
      Id: 3,
      Question_Text: "How can I track my order?",
      Created_At: "2024-12-05",
      Answer_Text: "You can track your order using the tracking link provided in the confirmation email.",
      Answered_At: "2024-12-06",
    },
  ];
  
  const sampleUnansweredQuestions = [
    {
      Id: 4,
      Question_Text: "Are there discounts for bulk orders?",
      Created_At: "2024-12-07",
    },
    {
      Id: 5,
      Question_Text: "What payment methods are accepted?",
      Created_At: "2024-12-08",
    },
    {
      Id: 6,
      Question_Text: "Is there a warranty on electronics?",
      Created_At: "2024-12-09",
    },
  ];
  

const QuestionsListCustomer = () => {
    const [answeredQ, setAnsweredQ] = useState([]);
    const [unansweredQ, setUnansweredQ] = useState([]);

    useEffect(() => {
        // Simulate loading data
        setAnsweredQ(sampleAnsweredQuestions);
        setUnansweredQ(sampleUnansweredQuestions);
      }, []);
  return (
    <div className="container">
        <div className="questions">
            <ContactForm/>
            <div className="questions__block">
                <div className="questions__title">Unanswered</div>
                <ul className="questions__list">
                    {unansweredQ.map(({Id, Question_Text, Created_At}) => {
                        return (
                            <li key={Id} className="questions__item">
                                <div className="questions__item-q">
                                    <div id="date" className="questions__date">{Created_At}</div>
                                    <div className="questions__text">{Question_Text}</div>
                                    
                                </div>
                            </li>
                        )
                    })
                    }                
                </ul>
            </div>
            <div className="questions__block">
                <div className="questions__title">Answered</div>
                <ul className="questions__list">
                    {answeredQ.map(({Id, Question_Text, Created_At, Answer_Text, Answered_At}) => {
                        return (
                            <li key={Id} className="questions__item">
                                <div className="questions__item-q">
                                    <div id="date" className="questions__date">{Created_At}</div>
                                    <div className="questions__text">{Question_Text}</div>
                                    
                                </div>
                                <div className="questions__item-a">
                                    <div id="date" className="questions__date">{Answered_At}</div>
                                    <div className="questions__text">{Answer_Text}</div>
                                    
                                </div>
                            </li>
                        )
                    })
                    } 
                </ul>
            </div>
            
        </div>
    </div>
  )
}

export default QuestionsListCustomer