import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

import InfoModal from '../../modals/InfoModal';
import { GetOrdersByStatus } from '../../../services/OrderAdminService';
import OrderDetailsModal from '../order-details/OrderDetailsModal';
import './ordersProgress.scss';

const OrdersProgress = () => {
    const [inProgressOrders, setInProgressOrders] = useState({});
    const [doneOrders, setDoneOrders] = useState({});
    const [showDetails, setShowDetails] = useState(false);
    const [orderToShow, setOrderToShow] = useState({});
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();
  
    useEffect(() => {
      updateOrders();
    }, []);
  
    const onError = (error) => {
      setError(true);
      setShowModal(true);
      setErrorMessage(error.message);
    };
  
    const updateOrders = async () => {
      try {
        const data = await GetOrdersByStatus();
        setDoneOrders(data.Done);
        setInProgressOrders(data.InProgress);
      } catch (error) {
        onError(error); // Handle error
      }
    };

    const onOpenDetails = (order) => {
        setOrderToShow(o => order);
        setShowDetails(true)
    }


    const renderModal = (
        <div>
            {showModal && error && createPortal(
                <InfoModal
                    title={"Error"}
                    subtitle={errorMessage}
                    onClose={() => {
                        setShowModal(false)
                        navigate('/');
                    }} />,
                document.body
            )}
            {showDetails && 
                createPortal(
                    <OrderDetailsModal
                        order={orderToShow}
                        onClose={() => setShowDetails(false)}
                        showActions={false}
                    />, 
                    document.body
                )
            }
        </div>
    );
  return (
    <section className='progress'>
        <div className="progress__block">
            <div className="progress__title">In Progress</div>
            <ul className="progress__products">
                {inProgressOrders.map((order) => {
                    const {id, order_Date, orderItems} = order;
                    const amount = orderItems.length
                    return(
                        <li key={id} className="progress__product">             
                            <div
                                onClick={()=>onOpenDetails(order)} 
                                className="progress__product-name">{new Date(order_Date).toLocaleDateString()}</div>
                            <div className="progress__product-amount">{amount}</div>
                        </li>
                    )
                })}
            </ul>
        </div>
        <div className="progress__block">
            <div className="progress__title">Done</div>
            <ul className="progress__products">
                {doneOrders.map((order) => {
                    const {id, order_Date, orderItems} = order;
                    const amount = orderItems.length
                    return(
                        <li key={id} className="progress__product">             
                            <div
                                onClick={()=>onOpenDetails(order)} 
                                className="progress__product-name">{new Date(order_Date).toLocaleDateString()}</div>
                            <div className="progress__product-amount">{amount}</div>
                        </li>
                    )
                })}
            </ul>
                
            {renderModal}   
        </div>
    </section>
  )
}

export default OrdersProgress