import React from 'react';
import close from '../../assets/icons/close-dark.svg';
import './modal.scss';

const ConfirmModal = ({title, subtitle, buttonText, onClose, onConfirm}) => {
  return (
    <div className="modal">
      <button onClick={onClose} className="modal__close"><img src={close} alt="close" /></button>
      <div className="modal__info">
        <div className="modal__title">{title}</div>
        <div className="modal__subtitle">{subtitle}</div>
      </div>
      <div className="button__wrapper">
              <button onClick={onClose} className="button button__small button__light">Cancel</button>
              <button onClick={onConfirm} className="button button__small">{buttonText}</button>
          </div>
          
    </div>
    
  )
}

export default ConfirmModal