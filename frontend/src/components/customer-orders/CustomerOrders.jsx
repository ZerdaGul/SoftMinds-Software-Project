import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { GetOrdersHistory } from '../../services/ProductService';
import InfoModal from '../modals/InfoModal';
import OrderDetailsModal from '../order-admin/order-details/OrderDetailsModal';
import "./customerOrders.scss";
const CustomerOrders = ({userId}) => {
    const [inProgressOrders, setInhistoryOrders] = useState([]);
    const [doneOrders, setDoneOrders] = useState([]);
    const [rejectedOrders, setRejectedOrders] = useState([]);
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
        const data = await GetOrdersHistory(userId);
        setRejectedOrders(data.Rejected)
        setDoneOrders(data.Done);
        setInhistoryOrders(data.Inhistory);
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
    <section className='history'>
        <div className="history__block">
            <div className="history__title">In Progress</div>
            <ul className="history__products">
                {inProgressOrders.map((order) => {
                    const {id, order_Date, orderItems} = order;
                    const amount = orderItems.length
                    return(
                        <li key={id} className="history__product">             
                            <div
                                onClick={()=>onOpenDetails(order)} 
                                className="history__product-name">{new Date(order_Date).toLocaleDateString()}</div>
                            <div className="history__product-amount">{amount}</div>
                        </li>
                    )
                })}
            </ul>
        </div>
        <div className="history__block">
            <div className="history__title">Done</div>
            <ul className="history__products">
                {doneOrders.map((order) => {
                    const {id, order_Date, orderItems} = order;
                    const amount = orderItems.length
                    return(
                        <li key={id} className="history__product">             
                            <div
                                onClick={()=>onOpenDetails(order)} 
                                className="history__product-name">{new Date(order_Date).toLocaleDateString()}</div>
                            <div className="history__product-amount">{amount}</div>
                        </li>
                    )
                })}
            </ul>      
        </div>
        <div className="history__block">
            <div className="history__title">Rejected</div>
            <ul className="history__products">
                {rejectedOrders.map((order) => {
                    const {id, order_Date, orderItems} = order;
                    const amount = orderItems.length
                    return(
                        <li key={id} className="history__product">             
                            <div
                                onClick={()=>onOpenDetails(order)} 
                                className="history__product-name">{new Date(order_Date).toLocaleDateString()}</div>
                            <div className="history__product-amount">{amount}</div>
                        </li>
                    )
                })}
            </ul>      
        </div>
        {renderModal} 
    </section>
  )
}

export default CustomerOrders