import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./PaymentPage.css";

const PaymentPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [placing, setPlacing] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  
  useEffect(() => {
    if (!user?.access) {
      navigate("/login");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/cart/", {
        headers: {
          Authorization: `Bearer ${user.access}`,
        },
      })
      .then((res) => setCartItems(res.data))
      .catch((err) => console.error("Cart fetch error:", err));
  }, [user, navigate]);

  
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.productPrice * item.quantity,
    0
  );

  const shippingFee = 100;

  
  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      toast.error("Please enter your shipping address!");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method!");
      return;
    }

    if (placing) return;

    try {
      setPlacing(true);

      await axios.post(
        "http://127.0.0.1:8000/api/orders/",
        {
          address,
          paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${user.access}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Order placed successfully!", {
        autoClose: 1500,
        onClose: () => {
          
          setAddress("");
          setPaymentMethod("");
          setCartItems([]);

         
          window.dispatchEvent(new Event("cartUpdated"));

          navigate("/orders");
        },
      });
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="payment-container">

      <div className="payment-left">
        <h1 className="payment-title">Payment Section</h1>

        <h2><b>Shipping Address</b></h2>
        <textarea
          placeholder="Enter your full address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <h2>Payment Method</h2>
        <div className="payment-options">
          <label>
            <input
              type="radio"
              name="payment"
              value="UPI"
              checked={paymentMethod === "UPI"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            UPI
          </label>

          <label>
            <input
              type="radio"
              name="payment"
              value="Card"
              checked={paymentMethod === "Card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Card
          </label>

          <label>
            <input
              type="radio"
              name="payment"
              value="Cash on Delivery"
              checked={paymentMethod === "Cash on Delivery"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Cash on Delivery
          </label>
        </div>
      </div>

      
      <div className="payment-right">
        <h2><b>Order Summary</b></h2>

        {cartItems.map((item) => (
          <div key={item.id} className="summary-item">
            <img src={item.image} alt={item.productName} />
            <div>
              <p>{item.productName}</p>
              <p>
                ₹{item.productPrice} × {item.quantity}
              </p>
            </div>
          </div>
        ))}

        <hr />
        <p>Subtotal: ₹{totalPrice}</p>
        <p>Shipping Fee: ₹{shippingFee}</p>
        <h3>Total: ₹{totalPrice + shippingFee}</h3>

        <button
          className="place-order-btn"
          onClick={handlePlaceOrder}
          disabled={placing}
        >
          {placing ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
