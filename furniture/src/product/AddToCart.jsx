import React, { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "./CartContext";
import "./AddToCart.css";

const AddToCart = () => {
  const { cart, removeFromCart, updateQuantity, loading } =
    useContext(CartContext);

  const user = JSON.parse(localStorage.getItem("user"));
  console.log("user", user)

  const navigate = useNavigate();

  
  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => {
      const price = item.productPrice || item.new_price;
      return total + price * item.quantity;
    }, 0);
  }, [cart]);

  const handleDecrease = (item) => {
    if (item.quantity <= 1) {
      removeFromCart(item.id);
    } else {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = (item) => {
    updateQuantity(item.id, item.quantity + 1);
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title"><b>Your Cart</b></h1>

      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="cart-card">
              <img
                src={item.image}
                alt={item.productName || item.name}
                className="cart-thumbnail"
              />

              <div className="cart-details">
                <h3>{item.productName || item.name}</h3>
                <p className="price">
                  ₹{item.productPrice || item.new_price}
                </p>
              </div>

              <div className="quantity-controls">
                <button disabled={loading} onClick={() => handleDecrease(item)}>
                  −
                </button>

                <span>{item.quantity}</span>

                <button disabled={loading} onClick={() => handleIncrease(item)}>
                  +
                </button>
              </div>

              <div className="item-total">
                ₹{(item.productPrice || item.new_price) * item.quantity}
              </div>

              <button
                className="remove-btn"
                disabled={loading}
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          ))}

          <div className="checkout-section">
            <h3>Total: ₹{totalPrice}</h3>

            <button
              className="checkout-btn"
              disabled={loading}
              onClick={() => {
                if (user?.access) {
                  navigate("/payment");
                } else {
                  localStorage.setItem("redirectAfterLogin", "/payment");
                  navigate("/login");
                }

              }}
            >
              Proceed to Checkout
            </button>

          </div>
        </>
      )}
    </div>
  );
};

export default AddToCart;
