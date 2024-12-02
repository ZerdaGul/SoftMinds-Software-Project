import React from 'react';
import './InfoModal.scss';

const InfoModal = ({ title, subtitle, onConfirm, onClose }) => {
    return (
        <div className="info-modal">
            <div className="info-modal__content">
                <h2 className="info-modal__title">{title}</h2>
                <p className="info-modal__subtitle">{subtitle}</p>
                <div className="info-modal__actions">
                    <button className="button button__confirm" onClick={onConfirm}>
                        Yes
                    </button>
                    <button className="button button__cancel" onClick={onClose}>
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InfoModal;
