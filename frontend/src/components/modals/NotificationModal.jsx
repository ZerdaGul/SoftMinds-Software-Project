import React from 'react';
import './NotificationModal.scss';

const NotificationModal = ({ lowStockProducts, onClose }) => {
    return (
        <div className="notification-modal">
            <div className="notification-modal__content">
                <h2>Low Stock Alerts</h2>
                {lowStockProducts?.length > 0 ? (
                    <ul>
                        {lowStockProducts.map((product, index) => (
                            <li key={index}>
                                <span>{product.name}</span> - Only {product.stock} left in stock!
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>All products are sufficiently stocked.</p>
                )}
                <button onClick={onClose} className="notification-modal__close">Close</button>
            </div>
        </div>
    );
};

export default NotificationModal;
