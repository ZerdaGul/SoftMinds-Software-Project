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

    const handleAnswer = (Id, Question_Text, Created_At) => {
      setShowAnswerModal(true);
      setQToAnswer({Id, Question_Text, Created_At});
    }

    const modal = <div>
                        {showAnswerModal && createPortal(
                            <AnswerModal 
                            question={qToAnswer}
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
                    {unansweredQ.map(({Id, Question_Text, Created_At}) => {
                        return (
                            <li style={{cursor: "pointer"}} onClick={()=>handleAnswer(Id, Question_Text, Created_At)} key={Id} className="questions__item">
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
            {answeredQ.length > 0 && <div className="questions__block">
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

export default QuestionsList