import React, { useState, useEffect } from "react";
import axios from "axios";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        setError("You must be logged in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:3001/api/v1/get-all-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
            id: userId, // userId sent as header for validation
          },
        });
        setOrders(response.data.data);
      } catch (err) {
        console.error("Error fetching orders:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to load orders. Ensure you're an admin.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="text-white p-4">Loading orders...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <div className="p-6 bg-zinc-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-zinc-800 rounded">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Order ID</th>
                <th className="py-2 px-4 border-b">Book Title</th>
                <th className="py-2 px-4 border-b">User</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="even:bg-zinc-700">
                  <td className="py-2 px-4 border-b">{order._id}</td>
                  <td className="py-2 px-4 border-b">{order.book?.title || "Deleted Book"}</td>
                  <td className="py-2 px-4 border-b">{order.user?.username || "Unknown User"}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b">{order.status || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllOrders;
