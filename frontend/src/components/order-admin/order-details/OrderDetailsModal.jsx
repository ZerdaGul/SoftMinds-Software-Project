import React, { useState, useEffect } from "react";
import './orderDetailsModal.scss';
import close from '../../../assets/icons/close-dark.svg';
import { LoadSingleProduct } from "../../../services/ProductService";

const OrderDetailsModal = ({ order, onClose, onAccept, onReject, showActions, buttonConfirmText, buttonCloseText }) => {
  

  const { id, order_Date, total_Price, orderItems } = order;

  // State to store the stock for each product
  const [stocks, setStocks] = useState({});

  // Fetch stock for each product
  useEffect(() => {
    const fetchStocks = async () => {
      const newStocks = {};
      for (const item of orderItems) {
        try {
          const stock = await LoadSingleProduct(item.productId);
          newStocks[item.productId] = stock ? stock.stock : "N/A";
        } catch (error) {
          newStocks[item.productId] = "Error"; // Handle error case
        }
      }
      setStocks(newStocks);
    };

    fetchStocks();
  }, [orderItems]); // Re-run the effect if orderItems change
    if (!order) return null; // Return null if no order data is provided
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
                  <th>Stock</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item, index) => {
                  const stock = stocks[item.productId]; // Get stock from state
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.productId}</td>
                      <td>{item.quantity}</td>
                      <td>{stock !== undefined ? stock : "Loading..."}</td>
                      <td>${item.total_Price.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {showActions && (
            <div className="requests__buttons">
              <button
                onClick={(e) => {
                  onReject(e, order, "reject");
                }}
                className="button button__small button__small-white"
              >
                {buttonCloseText}
              </button>
              <button
                onClick={(e) => {
                  onAccept(e, order, "accept");
                }}
                className="button button__small"
              >
                {buttonConfirmText}
              </button>
            </div>
          )}

          <button onClick={onClose} className="modal__close">
            <img src={close} alt="close" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
