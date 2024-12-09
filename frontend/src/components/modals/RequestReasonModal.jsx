import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createPortal } from 'react-dom';

import './modal.scss';
import '../forms/form.scss'
import close from '../../assets/icons/close-dark.svg';
import InfoModal from '../modals/InfoModal';

const RequestReasonModal = ({ onClose, onConfirm }) => {
    

    return (
        <div className="overlay">
            <div className="modal">
                <button onClick={onClose} className="modal__close">
                    <img src={close} alt="close" />
                </button>
                <div className="modal__info">
                    <h2 className="modal__title">State the Reason</h2>
                    <Formik
                        initialValues={{ reason: '' }}
                        validationSchema={Yup.object({
                            reason: Yup.string()
                                .required('Reason in required! ')
                        })}
                        onSubmit={(reason) => onConfirm(reason)}
                    >
                        {() => (
                            <Form className="form__wrapper">
                                <div style={{marginTop: '10px', height:'40px'}}className="input__wrapper">
                                    <Field style={{marginTop: '0px'}} name="reason" type="text" as="textarea" className="form__input" min="1" />
                                    <ErrorMessage name="reason" component="div" className="form__error" />
                                </div>
                                <div className="button__wrapper">
                                    <button type="button" onClick={onClose} className="button button__small button__light">
                                        Go Back
                                    </button>
                                    <button type="submit" className="button button__small" >
                                        Confirm
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
            </div>
    );
};

export default RequestReasonModal;
