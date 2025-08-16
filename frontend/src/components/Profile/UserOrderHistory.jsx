import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookCard from '../BookCard/BookCard'; 
import Loader from '../../Loader/Loader';    

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(null); // store orderId being canceled
  const [error, setError] = useState('');

  const headers = {
    id: localStorage.getItem('userId'),
    authorization: `Bearer ${localStorage.getItem('token')}`,
  };

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/api/v1/get-order-history',
          { headers }
        );
        setOrders(response.data.data || []);
      } catch (error) {
        console.error('Error fetching order history:', error);
        setError('Failed to load order history.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      setCancelLoading(orderId);
      setError('');
      await axios.delete(`http://localhost:3001/api/v1/cancel-order/${orderId}`, { headers });
      // Remove canceled order from state
      setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
    } catch (error) {
      console.error('Error canceling order:', error);
      setError('Failed to cancel the order. Please try again.');
    } finally {
      setCancelLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <h1 className="text-3xl font-medium text-yellow-400">No Orders Yet</h1>
      </div>
    );
  }

  return (
    <div className="p-6 bg-zinc-900 min-h-screen">
      <h1 className="text-2xl font-semibold text-white mb-6">Order History</h1>

      {error && <p className="mb-4 text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {orders.map((order) => (
          <div 
            key={order._id} 
            className="relative group transition-all duration-200 hover:scale-[1.02] p-4 bg-zinc-800 rounded"
          >
            {order.book && <BookCard data={order.book} />}
            <p className="mt-2 text-sm text-zinc-300">
              Ordered on: {new Date(order.createdAt).toLocaleDateString()}
            </p>

            <button
              onClick={() => cancelOrder(order._id)}
              disabled={cancelLoading === order._id}
              className={`mt-3 w-full py-1 rounded text-sm font-semibold 
                ${cancelLoading === order._id ? 'bg-red-600 cursor-not-allowed' : 'bg-red-500 hover:bg-red-700'}
                text-white`}
            >
              {cancelLoading === order._id ? 'Cancelling...' : 'Cancel Order'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
