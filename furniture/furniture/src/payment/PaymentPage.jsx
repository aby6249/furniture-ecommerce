import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "./PaymentPage.css";

const PaymentPage = () => {
  const location = useLocation();
  const [cartItems, setCartItems] = useState(location.state?.mergedCart || []);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();



  const mergeCartItems = (items) => {
    const merged = [];
    items.forEach((item) => {
      const existing = merged.find(
        (i) => (i.productId || i.id) === (item.productId || item.id)
      );
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        merged.push({ ...item });
      }
    });
    return merged;
  };



  useEffect(() => {
    if (user && cartItems.length === 0) {
      axios
        .get(`http://localhost:3000/cart?userId=${user.id}`)
        .then((res) => setCartItems(mergeCartItems(res.data)))
        .catch((err) => console.error("Error fetching cart:", err));
    }
  }, [user, cartItems.length]);

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + (item.productPrice || item.new_price) * item.quantity,
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

    try {
      const fullName = `${user.firstName} ${user.secondName || ""}`.trim();

      const updatedItems = cartItems.map((item) => ({
        ...item,
        userId: user.id,
      }));

      const newOrder = {
        userId: user.id,
        userName: fullName,
        items: updatedItems,
        address,
        paymentMethod,
        total: totalPrice + shippingFee,
        status: "Confirmed",
        date: new Date().toLocaleString(),
      };

      await axios.post(`http://localhost:3000/orders`, newOrder);


      for (let item of cartItems) {
        await axios.delete(`http://localhost:3000/cart/${item.id}`);
      }


      toast.success("Your order has been placed successfully!", {
        autoClose: 2000,
        onClose: () => navigate("/orders", { replace: true }),
      });


      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Failed to place order. Please try again.");
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
        ></textarea>


         
        <h2>Payment Method</h2>
        <div className="payment-options">
        <label>
          <input
            type="radio"
            name="payment"
            value="UPI"
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <img
            src="https://cdn-icons-png.flaticon.com/128/4108/4108042.png"
            alt="UPI"
          />
          UPI
        </label>

        <label>
          <input
            type="radio"
            name="payment"
            value="Card"
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <img
            src="https://cdn-icons-png.flaticon.com/128/1011/1011808.png"
            alt="Card"
          />
          Card
        </label>

        <label>
          <input
            type="radio"
            name="payment"
            value="Cash on Delivery"
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <img
            src="https://cdn-icons-png.flaticon.com/128/7481/7481022.png"
            alt="Cash on Delivery"
          />
          Cash on Delivery
        </label>
        </div>

      </div>



      <div className="payment-right">
        <h2><b>Order Summary</b></h2>
        {cartItems.map((item) => (
          <div key={item.id || item.productId} className="summary-item">
            <img src={item.image} alt={item.productName || item.name} />
            <div>
              <p>{item.productName || item.name}</p>
              <p>
                ₹{item.productPrice || item.new_price} × {item.quantity}
              </p>
            </div>
          </div>
        ))}

        <hr />
        <p>Subtotal: ₹{totalPrice}</p>
        <p>Shipping Fee: ₹{shippingFee}</p>
        <h3>Total: ₹{totalPrice + shippingFee}</h3>

        <button className="place-order-btn" onClick={handlePlaceOrder}>
          Place Order
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
