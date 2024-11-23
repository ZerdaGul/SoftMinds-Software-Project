import React, { useEffect, useState } from 'react';
import './CardForm.scss';

const CardForm = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/cart', { credentials: 'include' });
                if (!response.ok) throw new Error('Failed to fetch cart items');
                const data = await response.json();
                setCartItems(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCartItems();
    }, []);

    const calculateSubtotal = () => {
        return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    };

    const updateQuantity = async (productId, newQuantity) => {
        try {
            setLoading(true);
            const response = await fetch('/api/cart/update-quantity', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ ProductId: productId, Quantity: newQuantity })
            });

            if (response.ok) {
                setCartItems(cartItems.map(item =>
                    item.id === productId ? { ...item, quantity: newQuantity } : item
                ));
                setSuccessMessage("Quantity updated successfully.");
                setTimeout(() => setSuccessMessage(''), 2000);
            } else {
                const data = await response.json();
                setError(data.message || "An error occurred");
            }
        } catch (error) {
            setError("Unable to update quantity. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleIncrease = (productId, quantity, stock) => {
        if (quantity < stock) {
            updateQuantity(productId, quantity + 1);
        } else {
            setError("Insufficient stock available for this product.");
        }
    };

    const handleDecrease = (productId, quantity) => {
        if (quantity > 1) {
            updateQuantity(productId, quantity - 1);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/cart/remove-item?productId=${productId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                setCartItems(cartItems.filter(item => item.id !== productId));
            } else {
                setError("Failed to remove item from cart");
            }
        } catch (error) {
            setError("Unable to remove item. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckout = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/cart/checkout', {
                method: 'POST',
                credentials: 'include'
            });
            if (response.ok) {
                alert("Order placed successfully!");
                setCartItems([]);
            } else {
                setError("Failed to complete checkout.");
            }
        } catch (error) {
            setError("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading your cart...</p>;

    return (
        <div className="cart-page">
            <h2>Shopping Cart</h2>

            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <>
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div className="cart-item" key={item.id}>
                                <img src={item.image} alt={item.name} className="cart-item__image" />
                                <div className="cart-item__details">
                                    <h3>{item.name}</h3>
                                    <p>Price: ${item.price}</p>
                                    <div className="quantity-controls">
                                        <button onClick={() => handleDecrease(item.id, item.quantity)} disabled={item.quantity <= 1}>-</button>
                                        {item.quantity}
                                        <button onClick={() => handleIncrease(item.id, item.quantity, item.stock)}>+</button>
                                    </div>
                                    <p>Total: ${(item.price * item.quantity).toFixed(2)}</p>
                                    <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h3>Summary</h3>
                        <p>Subtotal: ${calculateSubtotal().toFixed(2)}</p>
                        <button onClick={handleCheckout} className="cart-page__checkout">Send Request</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CardForm;
