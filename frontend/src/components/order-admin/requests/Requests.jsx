import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom';
import { createPortal } from 'react-dom';

import RequestReasonModal from '../../modals/RequestReasonModal';
import OrderDetailsModal from '../order-details/OrderDetailsModal';
import { AcceptOrder } from '../../../services/OrderAdminService';
import { RejectOrder } from '../../../services/OrderAdminService';

import './requests.scss';

    // const orders = [
    //     {
    //       id: 1,
    //       order_Date: "2024-12-01T14:20:00",
    //       total_Price: 1200.50,
    //       orderItems: [
    //         { id: 101, productId: 5, quantity: 2, total_Price: 400.00 },
    //         { id: 102, productId: 7, quantity: 3, total_Price: 800.50 }
    //       ]
    //     },
    //     {
    //       id: 2,
    //       order_Date: "2024-12-02T16:45:00",
    //       total_Price: 3000.00,
    //       orderItems: [
    //         { id: 201, productId: 12, quantity: 1, total_Price: 1500.00 },
    //         { id: 202, productId: 3, quantity: 5, total_Price: 1500.00 }
    //       ]
    //     },
    //     {
    //       id: 3,
    //       order_Date: "2024-12-03T10:15:00",
    //       total_Price: 750.00,
    //       orderItems: [
    //         { id: 301, productId: 6, quantity: 2, total_Price: 500.00 },
    //         { id: 302, productId: 4, quantity: 1, total_Price: 250.00 }
    //       ]
    //     },
    //     {
    //       id: 4,
    //       order_Date: "2024-12-04T09:30:00",
    //       total_Price: 5000.00,
    //       orderItems: [
    //         { id: 401, productId: 8, quantity: 10, total_Price: 5000.00 }
    //       ]
    //     },
    //     {
    //       id: 5,
    //       order_Date: "2024-12-05T18:00:00",
    //       total_Price: 3200.00,
    //       orderItems: [
    //         { id: 501, productId: 9, quantity: 2, total_Price: 1200.00 },
    //         { id: 502, productId: 15, quantity: 4, total_Price: 2000.00 }
    //       ]
    //     }
    //   ];
      
      
const Requests = () => {
    
    const [showReasonModal, setShowReason] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [orderToAction, setOrderToAction] = useState({});
    const [orderToShow, setOrderToShow] = useState({});
    const [orderID, setOrderID] = useState(0);
    const [action, setAction] = useState('')

    const orderRequests = useOutletContext();

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
        } catch (error){
            console.log(error)
        }
    }


    const rejectOrder = async() => {
        try{
            await RejectOrder(orderToAction);
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
                                setOrderToAction({id: orderID, reason});
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
                        onAccept={handleAction}
                        onReject={handleAction}
                    />, 
                    document.body
                )
            }
        </div>
    );

  return (
    <section className='requests'>
        <ul className="requests__products">
                {orderRequests.map((order) => {
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
                })}
            </ul>
        {renderModal}
    </section>
  )
}

export default Requests