import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ContactForm from '../contact-form/ContactForm';
import { GetQuestionsCustomer } from '../../services/QuestionsService';
import InfoModal from '../modals/InfoModal';

import './questionsListCustomer.scss'

  

const QuestionsListCustomer = () => {
    const [answeredQ, setAnsweredQ] = useState([]);
    const [unansweredQ, setUnansweredQ] = useState([]);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Simulate loading data
        loadQuestions()
      }, []);

      const onError = (error) => {
        setError(true);  
        setShowModal(true)
        setErrorMessage(error.message)      
    }

      const loadQuestions = async() => {
        try {
          const q = await GetQuestionsCustomer();
          setAnsweredQ(q.answered);
          setUnansweredQ(q.unanswered);
        } catch (error) {
          onError(error);
        }
      }


      const modal = <div>
                        {showModal && error && createPortal(
                            <InfoModal 
                            title={"Error"}
                            subtitle={errorMessage}
                            onClose={() => {    
                                setShowModal(false)
                                }}/>,
                            document.body
                        )}
                    </div>
  return (
    <div className="container">
        <div className="questions">
            <ContactForm/>
            {unansweredQ.length > 0 && <div className="questions__block">
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
            </div>}
            {answeredQ.length > 0 &&<div className="questions__block">
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
            </div>}
            {answeredQ.length === 0 && unansweredQ.length === 0 && 
              <div className="questions__title">No questions yet</div>}
            {modal}
        </div>
    </div>
  )
}

export default QuestionsListCustomer