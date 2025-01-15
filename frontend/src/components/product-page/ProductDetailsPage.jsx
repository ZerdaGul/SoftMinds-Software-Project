import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';

import { LoadSingleProduct, GetProductComments, AddComment, DeleteProductComment } from '../../services/ProductService';
import './productDetailsPage.scss';
import default_img from '../../assets/product-pic-default.jpg';
import { AddToCart } from '../../services/CartService';
import InfoModal from '../modals/InfoModal';
import { GetActiveUser } from '../../services/AuthService'; // Use GetActiveUser from AuthService

const ProductDetailsPage = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [amount, setAmount] = useState(1);
    const [product, setProduct] = useState({});
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        loadProduct();
        loadComments();
        loadCurrentUserId();
    }, [productId]);

    const onError = (error) => {
        setError(true);
        setShowModal(true);
        setErrorMessage(error.message);
    };

    const loadProduct = async () => {
        try {
            const data = await LoadSingleProduct(productId);
            setProduct(data);
            setLoaded(true);
        } catch (error) {
            onError(error); // Handle error
        }
    };

    const loadComments = async () => {
        try {
            const data = await GetProductComments(productId);
            setComments(data.comments);
        } catch (error) {
            onError(error);
        }
    };

    const loadCurrentUserId = async () => {
        try {
            const user = await GetActiveUser();
            setCurrentUserId(user.id);
        } catch (error) {
            onError(error);
        }
    };

    const handleBackClick = () => {
        // Navigate back to /products with the previous state
        navigate('/products', { state: location.state });
    };

    const handleAddToCart = async (e) => {
        e.preventDefault();
        try {
            await AddToCart({ productId, quantity: amount });
            navigate('/cart');
        } catch (error) {
            onError(error);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        try {
            await AddComment(productId, comment);
            setComment('');
            loadComments(); // Reload comments after adding a new one
        } catch (error) {
            onError(error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await DeleteProductComment(productId, commentId);
            loadComments(); // Reload comments after deleting one
        } catch (error) {
            onError(error);
        }
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
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
        </div>
    );

    const { name, price, description } = product;
    return (
        loaded ? 
        <>{showModal && modal}
            <div className="product">
                <button
                    onClick={handleBackClick}
                    className="back">
                    Back
                </button>

                <img src={default_img} alt="product-image" className="product__image"/>
                <div className="product__info">

                    <div className="product__title">{name}</div>
                    <div className="product__price">${price}</div>
                    <div className="product__descr">
                        <div className="form__label">Description</div>
                        <div className="product__descr-text">{description}</div>
                    </div>
                    <form onSubmit={handleAddToCart} className="form__wrapper">
                        <div className="input__wrapper">
                            <label htmlFor="">Amount of product</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                className="form__input"
                            />
                        </div>
                        <button type='submit' className="add-to-cart-button">
                            Add to Cart
                        </button>
                    </form>
                </div>
                <div className="product__comment-wrapper">
                    <div className="product__comment-title">Comments</div>
                    {comments.length === 0 ?  
                        <p style={{marginTop: '10px'}}>No comments yet</p>
                        :
                        comments.map(comment => {
                            return (
                                <div key={comment.id} className='product__comment'>
                                    {comment.text}
                                    {comment.userId === currentUserId && (
                                        <button onClick={() => handleDeleteComment(comment.id)} className="product__comment-button">Delete</button>
                                    )}
                                </div>
                            )
                    })}
                    <form onSubmit={handleAddComment} className="product__comment-form">
                        <textarea
                            className="product__comment-field"
                            placeholder="Leave your comment..."
                            value={comment}
                            onChange={handleCommentChange}
                        />
                        <button type="submit" className="product__comment-button">Comment</button>
                    </form>
                </div>
            </div> 
        </>
            
        : null
    )
}

export default ProductDetailsPage;