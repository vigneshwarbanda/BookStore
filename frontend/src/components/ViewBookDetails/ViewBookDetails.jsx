import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../../Loader/Loader';
import { FaHeart, FaShoppingCart, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const ViewBookDetails = () => {
  const { id: bookId } = useParams();
  const [Data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/v1/get-book-by-id/${bookId}`);
        const book = response.data?.data;
        if (book && Object.keys(book).length > 0) {
          setData(book);
        } else {
          setError("Book is not available right now.");
        }
      } catch (err) {
        console.error("Error fetching book data:", err);
        setError("Book is not available right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  const handleFavourite = async () => {
    try {
      const headers = {
        bookid: bookId,
        id: localStorage.getItem("userId"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
      };
      await axios.put("http://localhost:3001/api/v1/add-book-to-favourites", {}, { headers });
      alert("Book added to favourites!");
    } catch (error) {
      console.error("Error adding to favourite:", error);
    }
  };

  const handleAddToCart = async () => {
    try {
      const headers = {
        bookid: bookId,
        id: localStorage.getItem("userId"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
      };
      await axios.put("http://localhost:3001/api/v1/add-to-cart", {}, { headers });
      alert("Book added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const headers = {
        id: localStorage.getItem("userId"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
        bookid: bookId,
      };

      await axios.delete("http://localhost:3001/api/v1/delete-book", { headers });

      alert("Book deleted successfully");
      navigate("/all-books");
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete book");
    }
  };

  const handleEdit = () => {
    navigate(`/update-book/${bookId}`);
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900">
        <p className="text-2xl font-semibold text-yellow-400 mb-6">{error}</p>
        <Link
          to="/all-books"
          className="px-6 py-3 bg-blue-500 rounded hover:bg-blue-600 transition text-white font-medium"
        >
          Go Back to All Books
        </Link>
      </div>
    );
  }

  return (
    <div className="px-12 py-8 bg-zinc-900 flex gap-8 flex-wrap lg:flex-nowrap">
      <div className="bg-zinc-800 rounded px-4 py-4 h-auto lg:h-[88vh] w-full lg:w-1/2 flex items-center justify-center">
        <img src={Data.url} alt={Data.title} className="max-h-[70vh] rounded" />
      </div>

      {(isLoggedIn && role === "user") && (
        <div className="flex flex-col mt-4 lg:mt-12 gap-4">
          <button className="bg-white rounded-full text-3xl p-2" onClick={handleFavourite}>
            <FaHeart />
            <span className="ms-4 block lg:hidden">Favourite</span>
          </button>
          <button className="bg-white rounded-full text-3xl p-2" onClick={handleAddToCart}>
            <FaShoppingCart />
            <span className="ms-4 block lg:hidden">Add to Cart</span>
          </button>
        </div>
      )}

      {(isLoggedIn && role === "admin") && (
        <div className="flex flex-col mt-4 lg:mt-12 gap-4">
          <button className="bg-white rounded-full text-3xl p-2" onClick={handleEdit}>
            <FaEdit />
            <span className="ms-4 block lg:hidden">Edit</span>
          </button>
          <button className="bg-white rounded-full text-3xl p-2" onClick={handleDelete}>
            <MdDelete />
            <span className="ms-4 block lg:hidden">Delete Book</span>
          </button>
          <button className="bg-white rounded-full text-3xl p-2" onClick={handleFavourite}>
            <FaHeart />
            <span className="ms-4 block lg:hidden">Favourite</span>
          </button>
          <button className="bg-white rounded-full text-3xl p-2" onClick={handleAddToCart}>
            <FaShoppingCart />
            <span className="ms-4 block lg:hidden">Add to Cart</span>
          </button>
        </div>
        
        
      )}

      <div className="p-4 w-full lg:w-1/2">
        <h2 className="text-2xl font-bold text-white">{Data.title}</h2>
        <p className="text-white mt-2">Author: {Data.author}</p>
        <p className="text-white mt-2">Price: ₹{Data.price}</p>
        <p className="text-white mt-2">Language: {Data.language}</p>
        <p className="text-white mt-4">{Data.desc}</p>
      </div>
    </div>
  );
};

export default ViewBookDetails;
