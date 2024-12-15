import React from 'react'

import close from '../../../assets/icons/close-dark.svg';
import ContactForm from '../../contact-form/ContactForm';
import './answerModal.scss'


const AnswerModal = ({onClose, question}) => {

    const {Id, Question_Text, Created_At} = question;
  return (
    <div className="overlay">
        <div className="modal answer-modal">
            <button onClick={onClose} className="modal__close">
                    <img src={close} alt="close" />
            </button>
            <div key={Id} className="questions__item">
                <div className="questions__item-a">
                    <div id="date" className="questions__date">{Created_At}</div>
                    <div className="questions__text">{Question_Text}</div>
                </div>
            </div>
            <ContactForm    
                label='Leave an answer'
                placeholder='Enter your answer'
                buttonText='Reply'
                QuestionId={Id}
                user='admin'/>
        </div>
    </div>
  )
}

export default AnswerModal