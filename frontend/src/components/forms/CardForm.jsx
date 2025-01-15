import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CardForm.scss";
import logoCircle from "../../assets/icons/pleaseLogin.png";
import emptyCart from "../../assets/icons/cart.png";
import { GetCartItems, GetCartSummary,UpdateCartItemQuantity, Checkout, ClearCart, RemoveItemFromCart } from "../../services/CartService";
import ProductImage from '../product-page/ProductImage';
const CardForm = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(true); // Kullanıcı oturum durumu
    const navigate = useNavigate();

    
    useEffect(() => {
        fetchCartItems();
    }, []);
    
    const fetchCartItems = async () => {
            try {
                setLoading(true);
                // const response = await fetch("/api/cart", { credentials: "include" });
                // if (response.status === 401) {
                //     setIsAuthenticated(false);
                //     return;
                // }
                // if (!response.ok) throw new Error("Failed to fetch cart items");
                // const data = await response.json();
                const data = await GetCartItems();
                setCartItems(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

    const calculateSubtotal = () => {
        return cartItems.reduce((acc, item) => acc + item.total_Price, 0);
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            await UpdateCartItemQuantity(productId, quantity);
            fetchCartItems();
        } catch (err) {
            setError("Unable to update quantity. Please try again.");
        }
    };

    const handleIncrease = (productId, quantity) => {
            updateQuantity(productId, quantity + 1);
    };

    const handleDecrease = (productId, quantity) => {
        if (quantity > 1) {
            updateQuantity(productId, quantity - 1);
        } else if(quantity == 0){
            handleRemoveItem(productId);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await RemoveItemFromCart(productId);
            fetchCartItems();
        } catch (err) {
            setError("Unable to remove item. Please try again.");
        }
    };

    const handleCheckout = async () => {
        try {
            await Checkout();
            alert("Order placed successfully!");
            setCartItems([]);
        } catch (err) {
            setError("Failed to complete checkout");
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
                        <div className="cart-item__image">
                            <ProductImage 
                            photoUrl={item.photoUrl}
                            name={item.name}
                        
                        />
                        </div>
                        
                        <div className="cart-item__details">
                            <h3>{item.productName}</h3>
                            <p>Price: ${item.price}</p>
                            <div className="quantity-controls">
                                <button onClick={() => handleDecrease(item.productId, item.quantity)} disabled={item.quantity <= 1}>-</button>
                                {item.quantity}
                                <button onClick={() => handleIncrease(item.productId, item.quantity, item.stock)}>+</button>
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
