import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Order.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:3000/orders`)
      .then((res) => {
        

        
        const filteredOrders = res.data.filter(
          (order) => String(order.userId) === String(user.id)
        );
        setOrders(filteredOrders);
      })
      .catch((err) => console.error("Error fetching orders:", err));
  }, [user, navigate]);

  return (
    <div className="orders-container">
      <h1 className="orders-title">My Orders</h1>

      {orders.length === 0 ? (
        <p className="no-orders">You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-user">
              <strong>Placed By:</strong> {order.userName}
            </div>
            <div className="order-address">
              <strong>Shipping Address:</strong> {order.address}
            </div>
            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.id} className="order-summary">
                  <img src={item.image} alt={item.productName} />
                  <div>
                    <p>{item.productName}</p>
                    <p>₹{item.productPrice} × {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <p>Subtotal: ₹{order.total - 100}</p>
              <p>Shipping Fee: ₹100</p>
              <h3>Total: ₹{order.total}</h3>
              <p>Payment Method: {order.paymentMethod}</p>
              <p>Order Date: {order.date}</p>
            </div>
          </div>
        ))
      )}

      <button
        className="continue-shopping-btn"
        onClick={() => navigate("/")}
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default Orders;
