import React from 'react'

import '.productCard.scss';
import product_pic from '../../assets/product-pic-default.jpg'

const ProductCard = () => {
  return (
    <div className="productCard">
        <img src={product_pic} alt="product picture" className="productCard__image"/>
       
        <div className="productCard__wrapper">
            <div className="productCard__title">Product name</div>
            <div className="productCard__price">${123.50}</div>
            <div className="button button__small button__small-white">Buy</div>
        </div>
    </div>
  )
}

export default ProductCard