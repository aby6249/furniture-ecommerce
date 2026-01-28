import React, { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "./CartContext";
import "./AddToCart.css";

const AddToCart = () => {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const user = JSON.parse(localStorage.getItem("user")); 
  const navigate = useNavigate();

  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => {
      const price = item.productPrice || item.new_price;
      return total + price * item.quantity;
    }, 0);
  }, [cart]);

  return (
    <div className="cart-container">
      <h1 className="cart-title"><b>Your Cart</b></h1>

      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={user ? item.id : item.guestId || item.id}
              className="cart-card"
            >
              <img
                src={item.image}
                alt={item.productName || item.name}
                className="cart-thumbnail"
              />
              <div className="cart-details">
                <h3>{item.productName || item.name}</h3>
                <p className="price">₹{item.productPrice || item.new_price}</p>
              </div>

              <div className="quantity-controls">
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(
                      user ? item.id : item.guestId || item.id,
                      item.quantity - 1
                    )
                  }
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(
                      user ? item.id : item.guestId || item.id,
                      item.quantity + 1
                    )
                  }
                >
                  +
                </button>
              </div>

              <div className="item-total">
                ₹{(item.productPrice || item.new_price) * item.quantity}
              </div>

              <button
                type="button"
                className="remove-btn"
                onClick={() =>
                  removeFromCart(user ? item.id : item.guestId || item.id)
                }
              >
                Remove
              </button>
            </div>
          ))}

          <div className="checkout-section">
            <h3>Total: ₹{totalPrice}</h3>
            <button
              type="button"
              className="checkout-btn"
              onClick={() => {
                if (!user) {
                  localStorage.setItem("redirectAfterLogin", "/payment");
                  navigate("/login");
                } else {
                  navigate("/payment");
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
