import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DashboardHome.css";
import {
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
  FaRupeeSign,
} from "react-icons/fa";


const BASE_URL = "http://127.0.0.1:8000/api/admin";

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return {
    Authorization: `Bearer ${user?.access}`,
  };
};

const DashboardHome = () => {
  const [dashboard, setDashboard] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });

  const [orders, setOrders] = useState([]);


  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/dashboard/`, {
          headers: getAuthHeaders(),
        });
        setDashboard(res.data);
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/orders/`, {
          headers: getAuthHeaders(),
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Orders error:", err);
      }
    };

    fetchDashboard();
    fetchOrders();
  }, []);

  
  const cards = [
    {
      icon: <FaUsers size={30} />,
      label: "Users",
      value: dashboard.users,
      color: "#3b82f6",
    },
    {
      icon: <FaBoxOpen size={30} />,
      label: "Products",
      value: dashboard.products,
      color: "#10b981",
    },
    {
      icon: <FaShoppingCart size={30} />,
      label: "Orders",
      value: dashboard.orders,
      color: "#f59e0b",
    },
    {
      icon: <FaRupeeSign size={30} />,
      label: "Revenue",
      value: `₹${dashboard.revenue.toLocaleString()}`,
      color: "#ef4444",
    },
  ];

  return (
    <div className="dashboard-wrapper">
      
      <div className="dashboard-container">
        {cards.map((card, i) => (
          <div
            key={i}
            className="dashboard-card"
            style={{ backgroundColor: card.color }}
          >
            <div className="icon">{card.icon}</div>
            <div className="info">
              <h2>{card.value}</h2>
              <p>{card.label}</p>
            </div>
          </div>
        ))}
      </div>

     
      <div className="orders-section">
        <h3>All Orders</h3>

        {orders.length === 0 ? (
          <p className="empty-text">No orders found</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Products</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                 
                  <td>{order.id}</td>

                 
                  <td>
                    <strong>{order.user_name}</strong>
                    <br />
                    <small style={{ color: "#666" }}>
                      {order.user_email}
                    </small>
                  </td>

                  
                  <td>
                    {order.products && order.products.length > 0 ? (
                      order.products.map((p) => (
                        <div key={p.id}>
                          {p.name} × {p.qty}
                        </div>
                      ))
                    ) : (
                      "-"
                    )}
                  </td>

                 
                  <td>₹{order.total_amount}</td>

           
                  <td>{order.status}</td>

                  
                  <td>
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
