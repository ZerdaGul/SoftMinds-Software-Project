import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom';
import { createPortal } from 'react-dom';

import RequestReasonModal from '../../modals/RequestReasonModal';
import OrderDetailsModal from '../order-details/OrderDetailsModal';
import { AcceptOrder } from '../../../services/OrderAdminService';
import { RejectOrder } from '../../../services/OrderAdminService';

import './requests.scss';

    
      
const Requests = () => {
    
    const [showReasonModal, setShowReason] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [orderToAction, setOrderToAction] = useState({});
    const [orderToShow, setOrderToShow] = useState({});
    const [orderID, setOrderID] = useState(0);
    const [action, setAction] = useState('')

    const { orderRequests, refreshOrders } = useOutletContext();

    const handleAction = (e, order, actionType) => {
        e.stopPropagation(); // Prevent triggering other events
        setAction(actionType); // Set action as "accept" or "reject"
        setOrderID(order.id); // Set the selected order ID
        setShowDetails(false);
        setShowReason(true); // Show the reason modal
    };

    const onOpenDetails = (order) => {
        setOrderToShow(o => order);
        setShowDetails(true)
    }

    useEffect(() => {
        if(action === 'accept'){
            acceptOrder()
        } else if (action === 'reject') {
            rejectOrder();
        }
    }, [orderToAction])

    const acceptOrder = async() => {
        try{
            await AcceptOrder(orderToAction);
            refreshOrders();
        } catch (error){
            console.log(error)
        }
    }


    const rejectOrder = async() => {
        try{
            await RejectOrder(orderToAction);
            refreshOrders();
        } catch (error){
            console.log(error)
        }
    }

    const renderModal = (
        <div>
            {showReasonModal &&
                createPortal(
                    <RequestReasonModal
                        onClose={() => {
                            setShowReason(false);
                        }}
                        onConfirm={(reason) => {
                                setOrderToAction({orderID , reason});
                                setShowReason(false);}}
                    />,
                    document.body
                )
            }
            {showDetails && 
                createPortal(
                    <OrderDetailsModal
                        order={orderToShow}
                        onClose={() => setShowDetails(false)}
                        showActions={true}
                        onAccept={handleAction}
                        onReject={handleAction}
                        buttonCloseText={'Reject'}
                        buttonConfirmText={"Accept"}
                    />, 
                    document.body
                )
            }
        </div>
    );

  return (
    <section className='requests'>
        <ul className="requests__products">
                {orderRequests?.length> 0 ?
                    orderRequests.map((order) => {
                        const {id, order_Date, total_Price, orderItems} = order;
                        const amount = orderItems.length
                        return(
                            <li key={id} className="requests__product">             
                                <div  
                                    onClick={()=>onOpenDetails(order)} 
                                    className="requests__product-name">
                                        {new Date(order_Date).toLocaleDateString()}
                                </div>
                                <div className="requests__product-amount">{amount}</div>
                                <div className="requests__product-price">${total_Price}</div>
                                <div className="requests__buttons">
                                    <button
                                        onClick={(e) => handleAction(e, order, "reject")}
                                        className="button button__small button__small-white"
                                        >
                                        Reject
                                    </button>
                                    <button
                                        onClick={(e) => handleAction(e, order, "accept")}
                                        className="button button__small"
                                        >
                                        Accept
                                    </button>
                                </div>
                            </li>
                        )
                    }):
                    <div  className="requests__product-name">  No requests yet </div>
                    }
            </ul>
        {renderModal}
    </section>
  )
}

export default Requests