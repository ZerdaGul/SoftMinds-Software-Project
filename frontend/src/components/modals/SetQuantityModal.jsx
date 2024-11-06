import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createPortal } from 'react-dom';

import './modal.scss';
import close from '../../assets/icons/close-dark.svg';
import InfoModal from '../modals/InfoModal';

const SetQuantityModal = ({ product_id, onAddToCart, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleAddToCart = async (values) => {
        setLoading(true);
        try {
            await onAddToCart(product_id, values.quantity);
            setLoading(false);
            setShowModal(false);
            onClose();
        } catch (error) {
            setLoading(false);
            setError(true);
            setShowModal(true);
            setErrorMessage("Failed to add product to the cart. Please try again.");
        }
    };

    const modal = (
        <div>
            {error &&
                createPortal(
                    <InfoModal
                        title="Error"
                        subtitle={errorMessage}
                        onClose={() => {
                            setShowModal(false);
                            setError(false);
                        }}
                    />,
                    document.body
                )}
            <div className="overlay"></div>
        </div>
    );

    return (
        <div className="modal">
            {showModal && modal}
            <button onClick={onClose} className="modal__close">
                <img src={close} alt="close" />
            </button>
            <div className="modal__info">
                <h2 className="modal__title">Set Quantity</h2>
                <Formik
                    initialValues={{ quantity: 1 }}
                    validationSchema={Yup.object({
                        quantity: Yup.number()
                            .min(1, 'Minimum quantity is 1')
                            .required('Quantity is required')
                    })}
                    onSubmit={handleAddToCart}
                >
                    {() => (
                        <Form className="modal__form">
                            <div className="modal__field">
                                <label htmlFor="quantity" className="modal__label">Quantity</label>
                                <Field name="quantity" type="number" className="modal__input" min="1" />
                                <ErrorMessage name="quantity" component="div" className="modal__error" />
                            </div>
                            <div className="button__wrapper">
                                <button type="button" onClick={onClose} className="button button__small button__light">
                                    Back to Shopping
                                </button>
                                <button type="submit" className="button button__small" disabled={loading}>
                                    {loading ? 'Adding...' : 'Add to Cart'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default SetQuantityModal;
