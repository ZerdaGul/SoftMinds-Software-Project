import React from "react";
import './orderDetailsModal.scss';
import close from '../../../assets/icons/close-dark.svg';


const OrderDetailsModal = ({ order, onClose, onAccept, onReject }) => {
  if (!order) return null; // Return null if no order data is provided

  const { id, order_Date, total_Price, orderItems } = order;

  return (
    <div className="overlay">
        <div className="order-details-modal">
        <div className="modal__content">
            <h3>Order Details</h3>
            <div className="modal__details">
            <p>
                <strong>Order ID:</strong> {id}
            </p>
            <p>
                <strong>Order Date:</strong> {new Date(order_Date).toLocaleDateString()}
            </p>
            <p>
                <strong>Total Price:</strong> ${total_Price.toFixed(2)}
            </p>
            <p>
                <strong>Items</strong>
            </p>
            <table className="modal__table">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Product ID</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                </tr>
                </thead>
                <tbody>
                {orderItems.map((item, index) => (
                    <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.productId}</td>
                    <td>{item.quantity}</td>
                    <td>${item.total_Price.toFixed(2)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
            <div className="requests__buttons">
            <button
                onClick={(e) => {
                onReject(e, order, "reject");
                }}
                className="button button__small button__small-white"
            >
                Reject
            </button>
            <button
                onClick={(e) => {
                onAccept(e, order, "accept");
                }}
                className="button button__small"
            >
                Accept
            </button>
            </div>
                <button onClick={onClose} className="modal__close">
                    <img src={close} alt="close" />
                </button>
            </div>
        </div>
    </div>
  );
};

export default OrderDetailsModal;
