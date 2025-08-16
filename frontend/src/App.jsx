import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from './store/auth';

import Home from './pages/Home';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import AllBooks from './pages/AllBooks';
import Signup from './pages/SignUp';
import Login from './pages/LogIn';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import AdminProfile from './pages/AdminProfile';
import ViewBookDetails from './components/ViewBookDetails/ViewBookDetails';
import Favourites from './components/Profile/Favourites';
import UserOrderHistory from './components/Profile/UserOrderHistory';
import Settings from './components/Profile/Settings';
import AddBook from './components/Profile/AddBook';
import User from './components/Profile/User';
import AllOrders from './components/Profile/AllOrders';

const App = () => {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const role = localStorage.getItem('role');

    if (token && id && role) {
      dispatch(authActions.login());
      dispatch(authActions.changeRole(role));
    }

    setLoaded(true);
  }, [dispatch]);

  if (!loaded) return null;

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all-books" element={<AllBooks />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/view-book-details/:id" element={<ViewBookDetails />} />
        <Route path="/update-book/:bookid" element={<AddBook />} />

        <Route path="/Profile" element={<Profile />}>
          <Route index element={<Favourites />} />
          <Route path="OrderHistory" element={<UserOrderHistory />} />
          <Route path="Settings" element={<Settings />} />
        </Route>

        <Route path="/AdminProfile" element={<AdminProfile />}>
          <Route index element={<AllBooks />} />
          <Route path="AddBook" element={<AddBook />} />
          <Route path="User" element={<User />} />
          <Route path="AllOrders" element={<AllOrders />} />
          <Route path="Settings" element={<Settings />} />
          <Route path="Your Orders" element={<UserOrderHistory />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
