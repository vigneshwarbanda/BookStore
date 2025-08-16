import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../../store/auth';

const Navbar = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    const savedRole = localStorage.getItem("role");

    if (token && id && savedRole) {
      dispatch(authActions.login());
      dispatch(authActions.changeRole(savedRole));
    }

    setLoaded(true);
  }, [dispatch]);

  if (!loaded) return null; // Avoid flicker on refresh

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-900 text-white">
      <Link to="/" className="text-xl font-bold">Bookstore</Link>
      <div className="flex gap-4 items-center">
        <Link to="/">Home</Link>
        <Link to="/all-books">All Books</Link>

        {isLoggedIn ? (
  <div className="flex gap-4 items-center text-white">
    <Link
      to="/Cart"
      className="px-2 py-1  rounded hover:bg-white hover:text-zinc-800 transition-all duration-300"
    >
      Cart
    </Link>

    <Link
      to={role === "admin" ? "/AdminProfile" : "/Profile"}
      className="px-2 py-1  rounded hover:bg-white hover:text-zinc-800 transition-all duration-300"
    >
      {role === "admin" ? "Admin Profile" : "Profile"}
    </Link>

    <button
      onClick={() => {
        localStorage.clear();
        dispatch(authActions.logout());
      }}
      className="px-2 py-1 border border-red-500 rounded hover:bg-red-500 hover:text-white transition-all duration-300"
    >
      Logout
    </button>
  </div>
) : (
  <div className="flex gap-4 text-white">
    <Link
      to="/Login"
      className="px-2 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300"
    >
      Login
    </Link>
    <Link
      to="/SignUp"
      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-white hover:text-zinc-800 transition-all duration-300"
    >
      Signup
    </Link>
  </div>
)}

      </div>
    </nav>
  );
};

export default Navbar;
