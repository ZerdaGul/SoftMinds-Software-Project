import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';

import { LoadSingleProduct } from '../../services/ProductService';
import './productDetailsPage.scss'
import default_img from '../../assets/product-pic-default.jpg';
import { AddToCart } from '../../services/CartService';
import InfoModal from '../modals/InfoModal';
import { Link } from "react-router-dom";


const ProductDetailsPage = () => {
	const { id: productId } = useParams();
	const navigate = useNavigate();
	const location = useLocation();

	const [amount, setAmount] = useState(1);
	const [product, setProduct] = useState({});
	const [comment, setComment] = useState('');
	const [loaded, setLoaded] = useState(false);
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [showModal, setShowModal] = useState(false);

	useEffect(()=> {
		
		loadProduct()
	}, [productId])



    const onError = (error) => {
        setError(true);  
        setShowModal(true);
        setErrorMessage(error.message)      
    }
    const loadProduct = async () => {
		
		setLoading(true);
        try {
            const data = await LoadSingleProduct( productId);
            setProduct(data);
			setLoaded(true);
        } catch (error) {
            onError(error); // Handle error
        }
    };



	const handleBackClick = () => {
		// Navigate back to /products with the previous state
		navigate('/products', { state: location.state });
	};


	const handleAddToCart = async(e )=> {
		e.preventDefault();
		try{
			await AddToCart({productId, quantity: amount})
			navigate('/cart')
		} catch (error) {
            onError(error);
		}
	}

	const handleAddComment = ()=> {
	

		//add comment to DB
	}

	const handleCommentChange = (e) => {
		setComment(e.target.value);
	}

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

	const {name, price, description, comments} = product;
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
							Add to Card
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
								<div className='product__comment'>{comment}</div>
							)
					})}
					<form onSubmit={handleAddComment} className="product__comment-form">
						<textarea
							className="product__comment-field"
							placeholder="Leave your comment..."
							value={comment}
							onChange={handleCommentChange}
							// onKeyDown={handleKeyDown}
						/>
						<button type="submit" className="button button__small">Add Comment</button>
					</form>
				</div>
			</div> 
		</>
			
		: null
	)
}

export default ProductDetailsPage