import React from 'react'

import './productCard.scss';
import product_pic from '../../assets/product-pic-default.jpg'

const ProductCard = ({product}) => {
  return (
    <div className="productCard">
        <img src={product_pic} alt="product picture" className="productCard__image"/>
       
        <div className="productCard__wrapper">
            <div className="productCard__title">{product.name}</div>
            <div className="productCard__price">${product.price}</div>
            <div className="button button__small button__small-white">Buy</div>
        </div>
    </div>
  )
}

export default ProductCard