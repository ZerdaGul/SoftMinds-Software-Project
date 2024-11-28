import React from 'react'

import './requests.scss';
const orders=[
    {product: 'Eko Cam 1250',
        amount: 3,
        price: 500
    },
        {product: 'Eko Cam 1250',
        amount: 1,
        price:1243
    },
        {product: 'Eko Cam 1250',
        amount: 150,
        price: 555
    },
        {product: 'Eko Cam 1250',
        amount: 16,
        price: 8945
    },
        
]
const Requests = () => {
  return (
    <section className='requests'>
        <ul className="requests__products">
                {orders.map(({product, amount, price}, i) => {
                    return(
                        <li key={i} className="requests__product">             
                            <div className="requests__product-name">{product}</div>
                            <div className="requests__product-amount">{amount}</div>
                            <div className="requests__product-price">${price}</div>
                            <div className="requests__buttons">
                                <button className="button button__small button__small-white">Reject</button>
                                <button className="button button__small ">Accept</button>
                            </div>
                        </li>
                    )
                })}
            </ul>
    </section>
  )
}

export default Requests