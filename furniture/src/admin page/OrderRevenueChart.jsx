import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";




const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { label, value, customer } = payload[0].payload;
    return (
      <div className="bg-white border border-gray-300 p-3 rounded-lg shadow">
        <p className="font-bold">{label}</p>
        <p>👤 {customer}</p>
        <p>💰 ₹{value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const OrderRevenueChart = () => {
  const [chartData, setChartData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchOrdersAndUsers = async () => {
      try {
        const [ordersRes, usersRes] = await Promise.all([
          fetch("http://localhost:3000/orders"),
          fetch("http://localhost:3000/users"),
        ]);

        const [orders, users] = await Promise.all([
          ordersRes.json(),
          usersRes.json(),
        ]);

        

        const formatted = orders.map((order) => {
          const user = users.find((u) => u.id === order.userId);
          const fullName = user
            ? `${user.firstName} ${user.secondName}`
            : "Unknown";

          return {
            label: `#${order.id} (${fullName})`,
            value: order.total,
            customer: fullName,
          };
        });
        setChartData(formatted);

        

        const latestOrders = [...orders]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 6)
          .map((order) => {
            const user = users.find((u) => u.id === order.userId);
            return {
              id: order.id,
              name: user
                ? `${user.firstName} ${user.secondName}`
                : "Unknown",
              total: order.total,
              date: new Date(order.date).toLocaleString(),
            };
          });
        setRecentOrders(latestOrders);
      } catch (error) {
        console.error("Error loading chart data:", error);
      }
    };

    fetchOrdersAndUsers();
  }, []);

  return (
    <div className="w-full p-4 space-y-6">
      


      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-center mb-4 text-lg font-semibold text-gray-700">
          💸 Order Revenue Overview
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              angle={-45}
              textAnchor="end"
              interval={0}
              height={80}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              ticks={[50000, 100000, 250000, 500000, 750000, 1000000]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="value"
              fill="url(#colorGradient)"
              radius={[4, 4, 0, 0]}
              barSize={40}
            >
              <LabelList
                dataKey="value"
                position="top"
                formatter={(v) => `₹${v.toLocaleString()}`}
              />
            </Bar>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00c6ff" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#0072ff" stopOpacity={0.4} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      
      
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
    </div>
  );
};

export default OrderRevenueChart;
