import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

import InfoModal from '../../modals/InfoModal';
import { GetOrdersByStatus } from '../../../services/OrderAdminService';
import OrderDetailsModal from '../order-details/OrderDetailsModal';
import './ordersProgress.scss';
import { CompleteOrder } from '../../../services/OrderAdminService';

const OrdersProgress = () => {
    const [inProgressOrders, setInProgressOrders] = useState([]);
    const [doneOrders, setDoneOrders] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const [orderToShow, setOrderToShow] = useState({});
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showActions, setShowActions] = useState(true);

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
        setDoneOrders(data.done);
        setInProgressOrders(data.inProgress);
      } catch (error) {
        onError(error); // Handle error
      }
    };

    const onOpenDetails = (order) => {
        setOrderToShow(o => order);
        setShowDetails(true)
        setShowActions(true)
    }
    const onOpenDetailsDone = (order) => {
        setOrderToShow(o => order);
        setShowDetails(true)
        setShowActions(false)
    }

    const onComplete = async(e, order) => {
        e.stopPropagation(); // Prevent triggering other events
        const data = {orderId : order.id, reason: ""}
        try{
            await CompleteOrder(data);
            setShowDetails(false);
        } catch (error){
            console.log(error)
        }
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
                        showActions={showActions}
                        onAccept={onComplete}
                        onReject={() => setShowDetails(false)}
                        buttonCloseText={"Cancel"}
                        buttonConfirmText={"Complete"}
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
            {inProgressOrders?.length > 0 ? (
                inProgressOrders.map((order) => {
                    const { id, order_Date, orderItems } = order;
                    const amount = Array.isArray(orderItems) ? orderItems.length : 0;
                    return (
                    <li key={id} className="progress__product">
                        <div
                        onClick={() => onOpenDetails(order)}
                        className="progress__product-name"
                        >
                        {new Date(order_Date).toLocaleDateString()}
                        </div>
                        <div className="progress__product-amount">{amount}</div>
                    </li>
                    );
                })
                ) : (
                <li className="progress__product">
                    <div className="progress__product-name">No orders in progress</div>
                </li>
                )}
            </ul>
        </div>

        <div className="progress__block">
            <div className="progress__title">Done</div>
            <ul className="progress__products">
                {doneOrders?.length > 0 ? (
                doneOrders.map((order) => {
                    const { id, order_Date, orderItems } = order;
                    const amount = Array.isArray(orderItems) ? orderItems.length : 0;
                    return (
                    <li key={id} className="progress__product">
                        <div
                        onClick={() => onOpenDetailsDone(order)}
                        className="progress__product-name"
                        >
                        {new Date(order_Date).toLocaleDateString()}
                        </div>
                        <div className="progress__product-amount">{amount}</div>
                    </li>
                    );
                })
                ) : (
                <li className="progress__product">
                    <div className="progress__product-name">No completed orders</div>
                </li>
                )}
            </ul>
        </div>

        
        {renderModal}
    </section>
  )
}

export default OrdersProgress