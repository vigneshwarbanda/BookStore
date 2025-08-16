import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const User = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false); // New state for Add User form

  // Form state for editing user
  const [editForm, setEditForm] = useState({
    name: "", // username for backend
    role: "user",
    password: "",
    email: "",
    address: "",
  });

  // Form state for adding user
  const [addForm, setAddForm] = useState({
    name: "",
    role: "user",
    password: "",
    email: "",
    address: "",
  });

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3001/api/v1/get-all-users", {
        headers,
      });
      setUsers(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset edit form when selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      setEditForm({
        name: selectedUser.username || "",
        role: selectedUser.role || "user",
        password: "",
        email: selectedUser.email || "",
        address: selectedUser.address || "",
      });
      setIsEditing(false);
      setIsAdding(false);
    }
  }, [selectedUser]);

  const handleEditClick = () => {
    if (!selectedUser) {
      alert("Select a user first!");
      return;
    }
    setIsEditing(true);
    setIsAdding(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editForm.name.trim()) {
      alert("Name is required");
      return;
    }
    if (!["user", "admin"].includes(editForm.role)) {
      alert("Invalid role");
      return;
    }

    try {
      const updates = {
        username: editForm.name,
        email: editForm.email,
        address: editForm.address,
        role: editForm.role,
      };

      if (editForm.password.trim() !== "") {
        updates.password = editForm.password;
      }

      const res = await axios.patch(
        `http://localhost:3001/api/v1/update-user/${selectedUser._id}`,
        updates,
        { headers }
      );

      alert("User updated successfully!");
      setUsers((prev) =>
        prev.map((user) => (user._id === selectedUser._id ? res.data.data : user))
      );
      setSelectedUser(res.data.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update user.");
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return alert("Select a user first!");
    if (!window.confirm(`Are you sure you want to delete ${selectedUser.username}?`)) return;

    try {
      await axios.delete(`http://localhost:3001/api/v1/delete-user/${selectedUser._id}`, {
        headers,
      });
      alert("User deleted successfully!");
      setUsers((prev) => prev.filter((user) => user._id !== selectedUser._id));
      setSelectedUser(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete user.");
    }
  };

  // Handlers for Add User form
  const handleAddClick = () => {
    setIsAdding(true);
    setIsEditing(false);
    setSelectedUser(null);
    setAddForm({
      name: "",
      role: "user",
      password: "",
      email: "",
      address: "",
    });
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!addForm.name.trim()) {
      alert("Name is required");
      return;
    }
    if (!addForm.password.trim()) {
      alert("Password is required");
      return;
    }
    if (!["user", "admin"].includes(addForm.role)) {
      alert("Invalid role");
      return;
    }

    try {
      const newUser = {
        username: addForm.name,
        email: addForm.email,
        address: addForm.address,
        role: addForm.role,
        password: addForm.password,
      };

      const res = await axios.post("http://localhost:3001/api/v1/add-user", newUser, {
        headers,
      });

      alert("User added successfully!");
      setUsers((prev) => [...prev, res.data.data]);
      setSelectedUser(res.data.data);
      setIsAdding(false);
    } catch (error) {
      console.error("Add user error:", error);
      alert("Failed to add user.");
    }
  };

  if (loading) return <p className="text-white p-4">Loading users...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <div className="p-6 bg-zinc-900 min-h-screen text-white flex gap-8">
      {/* Users List */}
      <div className="w-1/3 border-r border-zinc-700 pr-4 overflow-y-auto max-h-[80vh]">
        <h2 className="text-2xl mb-4 font-bold flex justify-between items-center">
          Users
          <button
            onClick={handleAddClick}
            className="bg-green-600 px-3 py-1 rounded hover:bg-green-700 text-sm"
          >
            + Add User
          </button>
        </h2>
        <ul>
          {users.map((user) => (
            <li
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`cursor-pointer p-2 rounded ${
                selectedUser?._id === user._id ? "bg-blue-600" : "hover:bg-zinc-700"
              }`}
            >
              {user.username || "Unnamed User"}
            </li>
          ))}
        </ul>
      </div>

      {/* User Details or Add/Edit Form */}
      <div className="flex-1 bg-zinc-800 p-6 rounded shadow max-h-[80vh] overflow-y-auto">
        {/* Add User Form */}
        {isAdding && (
          <form
            onSubmit={handleAddSubmit}
            className="bg-zinc-700 p-4 rounded space-y-4 max-w-md"
          >
            <h3 className="text-xl font-semibold mb-2">Add New User</h3>

            <div>
              <label className="block mb-1 font-medium" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={addForm.name}
                onChange={handleAddChange}
                className="w-full p-2 rounded text-black"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={addForm.email}
                onChange={handleAddChange}
                className="w-full p-2 rounded text-black"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium" htmlFor="address">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={addForm.address}
                onChange={handleAddChange}
                className="w-full p-2 rounded text-black"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium" htmlFor="role">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={addForm.role}
                onChange={handleAddChange}
                className="w-full p-2 rounded text-black"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={addForm.password}
                onChange={handleAddChange}
                className="w-full p-2 rounded text-black"
                required
                autoComplete="new-password"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
              >
                Add User
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Edit User Form */}
        {isEditing && selectedUser && (
          <form
            onSubmit={handleEditSubmit}
            className="mt-6 bg-zinc-700 p-4 rounded space-y-4 max-w-md"
          >
            <h3 className="text-xl font-semibold mb-2">Edit User</h3>

            <div>
              <label className="block mb-1 font-medium" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                className="w-full p-2 rounded text-black"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={editForm.email}
                onChange={handleEditChange}
                className="w-full p-2 rounded text-black"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium" htmlFor="address">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={editForm.address}
                onChange={handleEditChange}
                className="w-full p-2 rounded text-black"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium" htmlFor="role">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={editForm.role}
                onChange={handleEditChange}
                className="w-full p-2 rounded text-black"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium" htmlFor="password">
                Password (leave blank to keep current)
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={editForm.password}
                onChange={handleEditChange}
                className="w-full p-2 rounded text-black"
                autoComplete="new-password"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* User Details */}
        {!isAdding && !isEditing && selectedUser && (
          <>
            {/* Profile Picture */}
            {selectedUser.profilePicture ? (
              <img
                src={selectedUser.profilePicture}
                alt={`${selectedUser.username || "User"}'s Profile`}
                className="w-32 h-32 rounded-full mb-4 object-cover border-2 border-blue-500"
              />
            ) : (
              <div className="w-32 h-32 rounded-full mb-4 bg-zinc-700 flex items-center justify-center text-xl">
                No Image
              </div>
            )}

            <h2 className="text-3xl font-bold mb-4">{selectedUser.username || "User Details"}</h2>
            <p>
              <strong>UserID:</strong> {selectedUser._id || "N/A"}
            </p>
            <p>
              <strong>Username:</strong> {selectedUser.username || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email || "N/A"}
            </p>
            <p>
              <strong>Role:</strong> {selectedUser.role || "N/A"}
            </p>
            <p>
              <strong>Created At:</strong> {new Date(selectedUser.createdAt).toLocaleString()}
            </p>

            <p>
              <strong>Address: </strong>
              {selectedUser.address || "N/A"}
            </p>

            {/* Favourite Books */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Favourite Books</h3>
              {selectedUser.favourites && selectedUser.favourites.length > 0 ? (
                <ul className="list-disc list-inside">
                  {selectedUser.favourites.map((book, index) => {
                    const bookId =
                      typeof book === "string"
                        ? book
                        : book._id || book.id || `book-${index}`;
                    return (
                      <li key={bookId}>
                        <Link
                          to={`/view-book-details/${bookId}`}
                          className="text-blue-400 hover:underline"
                        >
                          {bookId}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>No favourite books.</p>
              )}
            </div>

            {/* Cart Books */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Books in Cart</h3>
              {selectedUser.cart && selectedUser.cart.length > 0 ? (
                <ul className="list-disc list-inside">
                  {selectedUser.cart.map((book, index) => {
                    const bookId =
                      typeof book === "string"
                        ? book
                        : book._id || book.id || `cart-book-${index}`;
                    return (
                      <li key={bookId}>
                        <Link
                          to={`/view-book-details/${bookId}`}
                          className="text-blue-400 hover:underline"
                        >
                          {bookId}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>No books in cart.</p>
              )}
            </div>

            {/* Ordered Books */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Ordered Books</h3>
              {selectedUser.orders && selectedUser.orders.length > 0 ? (
                <ul className="list-disc list-inside">
                  {selectedUser.orders.map((order, index) => {
                    const bookId =
                      typeof order === "string"
                        ? order
                        : order._id || order.id || `order-book-${index}`;
                    return (
                      <li key={bookId}>
                        <Link
                          to={`/view-book-details/${bookId}`}
                          className="text-blue-400 hover:underline"
                        >
                          {bookId}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>No ordered books.</p>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-6 flex gap-4">
              <button
                className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600"
                onClick={handleEditClick}
              >
                Edit
              </button>
              <button
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                onClick={handleDeleteUser}
              >
                Delete
              </button>
            </div>
          </>
        )}

        {/* Show a message if no user selected and not adding or editing */}
        {!selectedUser && !isAdding && !isEditing && (
          <p>Select a user to see details or add a new user.</p>
        )}
      </div>
    </div>
  );
};

export default User;
