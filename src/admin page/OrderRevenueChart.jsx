import React, { useEffect, useState } from "react";
import axios from "axios";

const RecentOrders = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        const res = await axios.get(
          "http://127.0.0.1:8000/api/admin/orders/analytics/",
          {
            headers: {
              Authorization: `Bearer ${user.access}`,
            },
          }
        );

        setRecentOrders(res.data.recent_orders || []);
      } catch (error) {
        console.error("Error fetching recent orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        Loading recent orders...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        📦 Recent Orders
      </h3>

      {recentOrders.length === 0 ? (
        <p className="text-center text-gray-500">
          No recent orders found
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <h4 className="font-bold text-gray-700">{order.name}</h4>
              <p className="text-green-600 font-semibold text-lg">
                ₹{order.total.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Order Date: {order.date}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentOrders;
