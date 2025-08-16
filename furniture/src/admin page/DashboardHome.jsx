import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DashboardHome.css";
import OrderRevenueChart from "./OrderRevenueChart";
import { FaUsers, FaBoxOpen, FaShoppingCart } from "react-icons/fa";

const DashboardHome = () => {
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          axios.get("http://localhost:3000/users"),
          axios.get("http://localhost:3000/products"),
          axios.get("http://localhost:3000/orders"),
        ]);

        setUserCount(usersRes.data.length);
        setProductCount(productsRes.data.length);
        setOrderCount(ordersRes.data.length);

        
        const revenue = ordersRes.data.reduce(
          (sum, order) => sum + (order.total || 0),
          0
        );
        setTotalRevenue(revenue);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const cards = [
    {
      icon: <FaUsers size={32} color="#fff" />,
      label: "Users",
      count: userCount,
      bgColor: "#3b82f6",
    },
    {
      icon: <FaBoxOpen size={32} color="#fff" />,
      label: "Products",
      count: productCount,
      bgColor: "#10b981",
    },
    {
      icon: <FaShoppingCart size={32} color="#fff" />,
      label: "Orders",
      count: orderCount,
      bgColor: "#f59e0b",
    },
    {
      icon: <FaShoppingCart size={32} color="#fff" />,
      label: "Revenue",
      count: `₹${totalRevenue.toLocaleString()}`,
      bgColor: "#ef4444",
    },
  ];

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        {cards.map((card, index) => (
          <div
            className="dashboard-card"
            key={index}
            style={{ backgroundColor: card.bgColor }}
          >
            <div className="icon">{card.icon}</div>
            <div className="info">
              <h2>{card.count}</h2>
              <p>{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <OrderRevenueChart />
    </div>
  );
};

export default DashboardHome;
