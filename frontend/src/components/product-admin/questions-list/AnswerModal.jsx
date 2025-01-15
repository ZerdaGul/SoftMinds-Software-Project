import React from 'react'

import close from '../../../assets/icons/close-dark.svg';
import ContactForm from '../../contact-form/ContactForm';
import './answerModal.scss'


const AnswerModal = ({onClose, question, fetchQuestions}) => {

    const {id, question_Text, created_At} = question;
  return (
    <div className="overlay">
        <div className="modal answer-modal">
            <button onClick={onClose} className="modal__close">
                    <img src={close} alt="close" />
            </button>
            <div key={id} className="questions__item">
                <div className="questions__item-a">
                    <div id="date" className="questions__date">{created_At}</div>
                    <div className="questions__text">{question_Text}</div>
                </div>
            </div>
            <ContactForm    
                fetchQuestions={fetchQuestions}
                label='Leave an answer'
                placeholder='Enter your answer'
                buttonText='Reply'
                QuestionId={id}
                user='admin'/>
        </div>
    </div>
  )
}

export default AnswerModal