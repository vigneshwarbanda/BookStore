import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Profile/Sidebar';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Loader/Loader';

const Profile = () => {
  const [Profile, setProfile] = useState(null);

  const headers = {
    id: localStorage.getItem("userId"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/v1/get-user-information",
          { headers }
        );
        setProfile(response.data); // Save user data
        
      } catch (error) {
        console.error("Error fetching user information", error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="bg-zinc-900 px-2 md:px-12 flex flex-col md:flex-row  py-8 gap-4 text-white">
      {!Profile && (
        <div className='w-full h-full flex items-center justify-center'>
          <Loader />
        </div>
      )}
      {Profile && (
        <>
          <div className="w-1/6 ">
            <Sidebar data={Profile} /> {/* Pass user info here */}
          </div>
          <div className="w-5/6">
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
