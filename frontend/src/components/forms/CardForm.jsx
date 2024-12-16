import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CardForm.scss";
import logoCircle from "../../assets/icons/pleaseLogin.png";
import emptyCart from "../../assets/icons/cart.png";

const CardForm = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(true); // Kullanıcı oturum durumu
    const navigate = useNavigate();

    
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/cart", { credentials: "include" });
                if (response.status === 401) {
                    setIsAuthenticated(false);
                    return;
                }
                if (!response.ok) throw new Error("Failed to fetch cart items");
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
        return cartItems.reduce((acc, item) => acc + item.total_Price, 0);
    };

    const updateQuantity = async (productId, newQuantity) => {
        try {
            const response = await fetch("/api/cart/update-quantity", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ ProductId: productId, Quantity: newQuantity }),
            });

            if (response.ok) {
                setCartItems(cartItems.map(item =>
                    item.productId === productId ? { ...item, quantity: newQuantity, total_Price: item.price * newQuantity } : item
                ));
                setSuccessMessage("Quantity updated successfully.");
                setTimeout(() => setSuccessMessage(""), 2000);
            } else {
                const data = await response.json();
                setError(data.message || "An error occurred");
            }
        } catch (err) {
            setError("Unable to update quantity. Please try again.");
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
            const response = await fetch(`/api/cart/remove-item?productId=${productId}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (response.ok) {
                setCartItems(cartItems.filter(item => item.productId !== productId));
            } else {
                setError("Failed to remove item from cart");
            }
        } catch (err) {
            setError("Unable to remove item. Please try again.");
        }
    };

    const handleCheckout = async () => {
        try {
            const response = await fetch("/api/cart/checkout", {
                method: "POST",
                credentials: "include",
            });
            if (response.ok) {
                alert("Order placed successfully!");
                setCartItems([]);
            } else {
                setError("Failed to complete checkout.");
            }
        } catch (err) {
            setError("An error occurred. Please try again later.");
        }
    };

    const LoginPrompt = () => {
        const navigate = useNavigate();
    
        return (
            <div className="login-prompt">
                <img
                    src={logoCircle}
                    alt="Please Log In"
                    className="login-prompt__image"
                />
                <h2 className="login-prompt__title">Please Log In</h2>
                <p className="login-prompt__subtitle">
                    To access your cart and continue shopping, please log in to your account.
                </p>
                <button
                    className="login-prompt__button"
                    onClick={() => navigate("/login")}
                >
                    Log In
                </button>
            </div>
        );
    };


    if (!isAuthenticated) {
        return (
            <LoginPrompt/>
        );
    }

    if (loading) return <p>Loading your cart...</p>;

    const CartEmpty = () => {
        const navigate = useNavigate();
    
        return (
            <div className="cart-empty">
                <img
                    src={emptyCart} 
                    alt="Empty Cart"
                    className="cart-empty__image"
                />
                <h2 className="cart-empty__title">Your Cart is Empty</h2>
                <p className="cart-empty__subtitle">
                    Looks like you haven’t added anything to your cart yet
                </p>
                <button
                    className="cart-empty__button"
                    onClick={() => navigate("/products")}
                >
                    Go Home
                </button>
            </div>
        );
    };

    
    if (cartItems.length === 0) {
        return (
            <CartEmpty/>
        );
    }

    return (
        <div className="cart-page">
            <h2>Shopping Cart</h2>

            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            <div className="cart-items">
                {cartItems.map((item) => (
                    <div className="cart-item" key={item.productId}>
                        <img src={item.product?.imageUrl || "https://via.placeholder.com/150"} alt={item.product.name} className="cart-item__image" />
                        <div className="cart-item__details">
                            <h3>{item.product.name}</h3>
                            <p>Price: ${item.product.price.toFixed(2)}</p>
                            <div className="quantity-controls">
                                <button onClick={() => handleDecrease(item.productId, item.quantity)} disabled={item.quantity <= 1}>-</button>
                                {item.quantity}
                                <button onClick={() => handleIncrease(item.productId, item.quantity, item.product.stock)}>+</button>
                            </div>
                            <p>Total: ${item.total_Price.toFixed(2)}</p>
                            <button onClick={() => handleRemoveItem(item.productId)}>Remove</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="cart-summary">
                <h3>Summary</h3>
                <p>Subtotal: ${calculateSubtotal().toFixed(2)}</p>
                <button onClick={handleCheckout} className="cart-page__checkout">Checkout</button>
            </div>
        </div>
    );
};

export default CardForm;
