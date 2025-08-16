import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ data }) => {
  const isAdmin = data.role === "admin";

  return (
    <div className='bg-zinc-800 p-4 rounded flex flex-col items-center justify-between h-[100%] text-center'>

      {/* User Info */}
      <div className='flex flex-col items-center justify-center'>
        <img
          src={data.avatar}
          alt="User Avatar"
          className='h-[12vh] w-[12vh] object-cover rounded-full'
        />
        <p className='mt-3 text-xl text-zinc-100 font-semibold'>
          {data.username}
        </p>
        <p className='mt-1 text-normal text-zinc-300'>
          {data.email}
        </p>

        {/* Divider */}
        <div className='w-full mt-4 h-[1px] bg-zinc-500'></div>
      </div>

      {/* Navigation Links */}
      <div className='w-full flex flex-col items-center justify-center mt-4'>

        {!isAdmin ? (
          <>
            <Link
              to='/Profile'
              className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded transition-all"
            >
              Favourite
            </Link>
            <Link
              to='/Profile/orderHistory'
              className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded transition-all"
            >
              Order History
            </Link>
            <Link
              to='/Profile/settings'
              className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded transition-all"
            >
              Settings
            </Link>
          </>
        ) : (
          <>
            <Link
              to='/AdminProfile/addbook'
              className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded transition-all"
            >
              Add Book
            </Link>
            <Link
              to='/AdminProfile/User'
              className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded transition-all"
            >
              Users
            </Link>
            <Link
              to='/AdminProfile/AllOrders'
              className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded transition-all"
            >
              All Orders
            </Link>
            <Link
              to='/Profile/orderHistory'
              className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded transition-all"
            >
              Your Orders
            </Link>
            <Link
              to='/AdminProfile/settings'
              className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded transition-all"
            >
              Settings
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
