import React from 'react'

import './ordersProgress.scss';
const orders=[
    {product: 'Eko Cam 1250',
        amount: 3},
        {product: 'Eko Cam 1250',
        amount: 1},
        {product: 'Eko Cam 1250',
        amount: 150},
        {product: 'Eko Cam 1250',
        amount: 16},
        
]
const OrdersProgress = () => {
  return (
    <section className='progress'>
        <div className="progress__block">
            <div className="progress__title">In Progress</div>
            <ul className="progress__products">
                {orders.map(({product, amount}, i) => {
                    return(
                        <li key={i} className="progress__product">             
                            <div className="progress__product-name">{product}</div>
                            <div className="progress__product-amount">{amount}</div>
                        </li>
                    )
                })}
            </ul>
        </div>
        <div className="progress__block">
            <div className="progress__title">Done</div>
            <ul className="progress__products">
                {orders.map(({product, amount}, i) => {
                    return(
                        <li key={i} className="progress__product">             
                            <div className="progress__product-name">{product}</div>
                            <div className="progress__product-amount">{amount}</div>
                        </li>
                    )
                })}
            </ul>
                
            
        </div>
    </section>
  )
}

export default OrdersProgress