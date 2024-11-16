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
            <div className="progress__products">
                {orders.map(({product, amount}, i) => {
                    return(
                        <div key={i} className="progress__product">             
                            <div className="progress__product-name">{product}</div>
                            <div className="progress__product-amount">{amount}</div>
                        </div>
                    )
                })}
            </div>
        </div>
        <div className="progress__block">
            <div className="progress__title">Done</div>
            <div className="progress__products">
                {orders.map(({product, amount}, i) => {
                    return(
                        <div key={i} className="progress__product">             
                            <div className="progress__product-name">{product}</div>
                            <div className="progress__product-amount">{amount}</div>
                        </div>
                    )
                })}
            </div>
                
            
        </div>
    </section>
  )
}

export default OrdersProgress