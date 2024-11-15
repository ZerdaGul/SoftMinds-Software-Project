import React from 'react'

import './productCard.scss';
import product_pic from '../../assets/product-pic-default.jpg';

const ProductCard = ({ product, onClick, handleAddToCart }) => {
  const handleButtonClick = (e) => {
    e.stopPropagation(); // Prevent the click event from bubbling to the parent
    handleAddToCart(product.id);
  };

  return (
    <div onClick={onClick} className="productCard">
      <img src={product_pic} alt="product-picture" className="productCard__image" />

      <div className="productCard__wrapper">
        <div className="productCard__title">{product.name}</div>
        <div className="productCard__price">${product.price}</div>
        <button
          onClick={handleButtonClick}
          className="button button__small button__small-white"
        >
          Buy
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
