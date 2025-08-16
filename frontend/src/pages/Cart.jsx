import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookCard from '../components/BookCard/BookCard';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';

const Cart = () => {
  const [cartBooks, setCartBooks] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false); // For Place Order button
  const [fetching, setFetching] = useState(true); // For initial cart fetch
  const navigate = useNavigate();

  const headers = {
    id: localStorage.getItem('userId'),
    authorization: `Bearer ${localStorage.getItem('token')}`,
  };

  // Fetch cart books
  useEffect(() => {
    const fetchCartBooks = async () => {
      try {
        setFetching(true);
        const response = await axios.get(
          'http://localhost:3001/api/v1/get-user-cart',
          { headers }
        );
        setCartBooks(response.data.data || []);
      } catch (error) {
        console.error('Error fetching cart books:', error);
      } finally {
        setFetching(false);
      }
    };

    fetchCartBooks();
  }, []);

  // Calculate total price
  useEffect(() => {
    const total = cartBooks.reduce((sum, book) => sum + book.price, 0);
    setTotalPrice(total);
  }, [cartBooks]);

  // Remove a book from cart
  const handleRemoveFromCart = async (bookId) => {
    try {
      await axios.put(
        `http://localhost:3001/api/v1/remove-from-cart/${bookId}`,
        {},
        { headers }
      );
      setCartBooks(prev => prev.filter(book => book._id !== bookId));
    } catch (error) {
      console.error('Failed to remove book from cart:', error);
    }
  };

  // Place order
  const handlePlaceOrder = async () => {
    if (cartBooks.length === 0) return;
    setLoading(true);
    try {
      const bookIds = cartBooks.map(book => book._id);
      await axios.post(
        'http://localhost:3001/api/v1/place-order',
        { order: bookIds },
        { headers }
      );
      alert('Order placed successfully!');
      setCartBooks([]);
      setTotalPrice(0);
      navigate('/Profile/orderHistory');
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-6 bg-zinc-900 min-h-screen">
      {cartBooks.length === 0 ? (
        <div className="flex items-center justify-center h-[60vh]">
          <h1 className="text-3xl font-medium text-yellow-400">No Books in Cart</h1>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {cartBooks.map((book) => (
              <div
                key={book._id}
                className="relative group transition-all duration-200 hover:scale-[1.02]"
              >
                <BookCard data={book} />
                <button
                  className="mt-3 w-full text-sm font-medium px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
                  onClick={() => handleRemoveFromCart(book._id)}
                >
                  Remove from Cart
                </button>
              </div>
            ))}
          </div>

          {/* Total Price and Place Order */}
          <div className="mt-6 p-4 bg-zinc-800 rounded text-center">
            <p className="text-xl font-semibold text-yellow-400">
              Total: ₹{totalPrice}
            </p>
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`mt-3 px-6 py-2 text-white rounded transition duration-200 ${
                loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
