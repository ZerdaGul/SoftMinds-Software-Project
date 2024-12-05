import React from 'react'
import { useOutletContext } from 'react-router-dom';

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
    const orderRequests = useOutletContext();

    // when click on item,it gets underlined. modal with order details opens
    // when buttons r pressd from modal or list
    // if details modal open -> close
    // show "reason" modal with "Confirm" button
    // then collect data and make an action
  return (
    <section className='requests'>
        <ul className="requests__products">
                {orderRequests.map(({id, order_Date, total_Price, orderItems}) => {
                    const amount = orderItems.length()
                    return(
                        <li key={id} className="requests__product">             
                            <div className="requests__product-name">{new Date(order_Date).toLocaleDateString()}</div>
                            <div className="requests__product-amount">{amount}</div>
                            <div className="requests__product-price">${total_Price}</div>
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