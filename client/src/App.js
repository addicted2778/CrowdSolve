import React, { useState, useEffect } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import AppRoutes from './routes'; 
import { getToken, removeToken } from './api';
import { successMessage, errorMessage } from "./helper/toast";
function App() {
  const [loggedIn, setLoggedIn] = useState(!!getToken());

  useEffect(() => {
    const handleStorageChange = () => setLoggedIn(!!getToken());
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    removeToken();
    setLoggedIn(false);
    errorMessage("Logout Successfully.");
  };

  return (
    <BrowserRouter>
      <div style={{ padding: 20 }}>
        <header style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <Link to="/">Home</Link>
          {loggedIn && <Link to="/create">Create Post</Link>}
          {!loggedIn && <Link to="/login">Login</Link>}
          {!loggedIn && <Link to="/register">Register</Link>}
          {loggedIn && <button onClick={handleLogout}>Logout</button>}
        </header>

        <AppRoutes setLoggedIn={setLoggedIn} />
      </div>
    </BrowserRouter>
  );
}

export default App;
