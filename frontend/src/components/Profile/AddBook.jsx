import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";

const AddBook = () => {
  const { bookid } = useParams();

  const [formData, setFormData] = useState({
    url: "",
    title: "",
    author: "",
    price: "",
    desc: "",
    language: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      if (!bookid) return;

      try {
        const response = await axios.get(`http://localhost:3001/api/v1/get-book-by-id/${bookid}`);
        const book = response.data?.data;

        if (book) {
          setFormData({
            url: book.url,
            title: book.title,
            author: book.author,
            price: book.price,
            desc: book.desc,
            language: book.language,
          });
        }
      } catch (err) {
        console.error("Error fetching book details:", err);
      }
    };

    fetchBook();
  }, [bookid]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");
    const id = localStorage.getItem("userId");

    try {
      if (bookid) {
        const response = await axios.put(
          "http://localhost:3001/api/v1/update-book",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              id,
              bookid,
            },
          }
        );
        setMessage(response.data.message || "Book updated successfully!");
        
        
      } else {
        const response = await axios.post(
          "http://localhost:3001/api/v1/add-book",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              id,
            },
          }
        );
        setMessage(response.data.message || "Book added successfully!");
        setFormData({
          url: "",
          title: "",
          author: "",
          price: "",
          desc: "",
          language: "",
        });
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setMessage(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-zinc-900 text-white">
      <div className="w-full max-w-2xl bg-zinc-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {bookid ? "Edit Book" : "Add New Book"}
        </h2>

        {message && <p className="text-center mb-4 text-yellow-400">{message}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <input type="text" name="url" placeholder="Image URL" value={formData.url} onChange={handleChange} className="p-3 rounded bg-zinc-700" required />
          <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="p-3 rounded bg-zinc-700" required />
          <input type="text" name="author" placeholder="Author" value={formData.author} onChange={handleChange} className="p-3 rounded bg-zinc-700" required />
          <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className="p-3 rounded bg-zinc-700" required />
          <textarea name="desc" placeholder="Description" value={formData.desc} onChange={handleChange} rows={4} className="p-3 rounded bg-zinc-700" required />
          <input type="text" name="language" placeholder="Language" value={formData.language} onChange={handleChange} className="p-3 rounded bg-zinc-700" required />

          <button type="submit" className="bg-blue-600 hover:bg-blue-700 py-3 rounded font-semibold" disabled={loading}>
            {loading ? (bookid ? "Updating..." : "Adding...") : (bookid ? "Update Book" : "Add Book")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
