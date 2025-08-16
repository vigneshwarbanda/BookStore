import React, { useEffect, useState } from 'react';
import axios from 'axios';


const Settings = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const headers = {
    Authorization: `Bearer ${token}`,
    userId: userId,
  };

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/v1/get-user-information', { headers });
      
      setUser(response.data);
      setNewAddress(response.data.address || '');
    } catch (err) {
      console.error('Error fetching user info:', err);
      setMessage('Failed to load user information.');
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async () => {
    try {
      if (!newAddress.trim()) {
        setMessage('Address cannot be empty.');
        return;
      }

      setLoading(true);
      await axios.put(
        'http://localhost:3001/api/v1/update-address',
        { address: newAddress },
        { headers }
      );

      setMessage('Address updated successfully!');
      setEditing(false);
      fetchUserInfo();
    } catch (err) {
      console.error('Error updating address:', err);
      setMessage('Failed to update address.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 20 }}>
      <h2>User Settings</h2>

      {user ? (
        <div>
          <img
            src={user.avatar}
            alt="User Avatar"
            style={{ width: 80, height: 80, borderRadius: '50%', marginBottom: 10 }}
          />
          <p><strong>Username:</strong> {user.username || 'N/A'}</p>
          <p><strong>Email:</strong> {user.email || 'N/A'}</p>
          <p><strong>Address:</strong> {user.address || 'Not provided'}</p>

          {!editing ? (
  <button onClick={() => setEditing(true)}>Edit Address</button>
) : (
  <div style={{ marginTop: 10 }}>
    <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
      New Address:
    </label>
    <input
  type="text"
  value={newAddress}
  onChange={(e) => setNewAddress(e.target.value)}
  style={{
    width: '100%',
    padding: '8px 12px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    color: '#333',  // <-- correct property for font color
  }}
  placeholder="Enter new address"
/>

    <div style={{ marginTop: 10 }}>
      <button onClick={updateAddress}>Save</button>
      <button onClick={() => setEditing(false)} style={{ marginLeft: 10 }}>
        Cancel
      </button>
    </div>
  </div>
)}

          {message && <p style={{ marginTop: 10 }}>{message}</p>}
        </div>
      ) : (
        <p>No user data found.</p>
      )}
    </div>
  );
};

export default Settings;
