import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from '../BookCard/BookCard';

const Favourites = () => {
  const [favouriteBooks, setFavouriteBooks] = useState([]);

  const headers = {
    id: localStorage.getItem('userId'),
    authorization: `Bearer ${localStorage.getItem('token')}`,
  };

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/api/v1/get-user-favourites',
          { headers }
        );
        setFavouriteBooks(response.data.data);
      } catch (error) {
        console.error('Failed to fetch favourites:', error);
      }
    };

    fetchFavourites();
  }, []);

  const handleRemoveFromUI = async (bookId) => {
    try {
      await axios.put(
        `http://localhost:3001/api/v1/remove-book-from-favourite/${bookId}`,
        {},
        { headers }
      );

      setFavouriteBooks((prevBooks) =>
        prevBooks.filter((book) => book._id !== bookId)
      );
    } catch (error) {
      console.error('Failed to remove favourite:', error);
    }
  };

  return (
    <div className="p-6 bg-zinc-900 min-h-screen">
      {favouriteBooks.length === 0 ? (
        <div className="flex items-center justify-center h-[60vh]">
          <h1 className="text-3xl font-medium text-yellow-400">No Favourite Books</h1>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {favouriteBooks.map((item) => (
            <div
              key={item._id}
              className="relative group transition-all duration-200 hover:scale-[1.02]"
            >
              <BookCard
                data={item}
                favourite={true}
                onRemoveFromUI={handleRemoveFromUI}
              />

              <button
                className="mt-3 w-full text-sm font-medium px-3 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition duration-200"
                onClick={() => handleRemoveFromUI(item._id)}
              >
                Remove from Favourites
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourites;
