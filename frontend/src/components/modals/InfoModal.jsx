import React from 'react'
import close from '../../assets/icons/close-dark.svg'
const InfoModal = ({ title, subtitle, onClose }) => {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="modal__close">
          <img src={close} alt="close" />
        </button>
        <div className="modal__info">
          <div className="modal__title">{title}</div>
          <div className="modal__subtitle">{subtitle}</div>
        </div>
      </div>
    </div>
  );
};


export default InfoModal