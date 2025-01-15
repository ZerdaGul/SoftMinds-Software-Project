import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom';


import './questionsList.scss';
import { GetQuestionsAdmin } from '../../../services/QuestionsService';
import AnswerModal from './AnswerModal';
import InfoModal from '../../modals/InfoModal';



const QuestionsList = () => {
    const [answeredQ, setAnsweredQ] = useState([]);
    const [unansweredQ, setUnansweredQ] = useState([]);
    const [showAnswerModal, setShowAnswerModal] = useState(false);
    const [qToAnswer, setQToAnswer] = useState({});
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
          const q = await GetQuestionsAdmin();
          setAnsweredQ(q.answered);
          setUnansweredQ(q.unanswered);
        } catch (error) {
          onError(error);
        }
      }

    const handleAnswer = (id, question_Text, created_At) => {
      setShowAnswerModal(true);
      setQToAnswer({id, question_Text, created_At});
    }

    const modal = <div>
                        {showAnswerModal && createPortal(
                            <AnswerModal 
                            question={qToAnswer}
                            fetchQuestions={loadQuestions}
                            onClose={() => {    
                                setShowAnswerModal(false)
                                }}/>,
                            document.body
                        )}
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
            {unansweredQ.length > 0 && <div className="questions__block">
                <div className="questions__title">Unanswered</div>
                <ul className="questions__list">
                    {unansweredQ.map(({id, question_Text, created_At}) => {
                        return (
                            <li style={{cursor: "pointer"}} onClick={()=>handleAnswer(id, question_Text, created_At)} key={id} className="questions__item">
                                <div className="questions__item-q">
                                    <div id="date" className="questions__date">{created_At}</div>
                                    <div className="questions__text">{question_Text}</div>
                                    
                                </div>
                            </li>
                        )
                    })
                    }                
                </ul>
            </div>}
            {answeredQ.length > 0 && <div className="questions__block">
                <div className="questions__title">Answered</div>
                <ul className="questions__list">
                    {answeredQ.map(({id, question_Text, created_At, answer_Text, answered_At}) => {
                        return (
                            <li key={id} className="questions__item">
                                <div className="questions__item-q">
                                    <div id="date" className="questions__date">{created_At}</div>
                                    <div className="questions__text">{question_Text}</div>
                                    
                                </div>
                                <div className="questions__item-a">
                                    <div id="date" className="questions__date">{answered_At}</div>
                                    <div className="questions__text">{answer_Text}</div>
                                    
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

export default QuestionsList