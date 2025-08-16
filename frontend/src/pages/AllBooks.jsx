import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from '../components/BookCard/BookCard';
import Loader from '../Loader/Loader';

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/v1/get-all-books');
        setBooks(response.data.data);
      } catch (error) {
        console.error('Error fetching all books:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="bg-zinc-900 min-h-screen p-6">
      <h4 className="text-3xl text-yellow-100 mb-6">All Books</h4>

      {loading ? (
        <div className="flex items-center justify-center my-12">
          <Loader />
        </div>
      ) : books.length === 0 ? (
        <div className="text-3xl font-medium text-zinc-500 flex items-center justify-center h-[60vh]">
          <h1>No Books Found</h1>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              className="relative group transition-all duration-200 hover:scale-[1.02]"
            >
              <BookCard data={book} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBooks;
