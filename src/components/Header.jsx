import React, { useEffect, useState } from "react";
import "../styles/Header.css";
import logo from "../assets/DizzyDesign.png"; // Import the logo

const Header = () => {
  const [authenticated, setAuthenticated] = useState(false); // Default to not authenticated
  const [user, setUser] = useState(null); // Store user details

  const loggedIn = async () => {
    try {
      const response = await fetch("/api/users/check-auth", {
        credentials: "include", // Include cookies for session-based auth
      });
      const data = await response.json();
      if (data.success && data.user) {
        setAuthenticated(true);
        setUser(data.user);
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
    }
  };

  useEffect(() => {
    loggedIn();
  }, []);

  return (
    <header>
      <div className="logo">
        <img src={logo} alt="Dizzy Design Logo" />
      </div>
      <div className="subtitle">
        DISCOVER THE BEST PRODUCTS AT UNBEATABLE PRICES.
      </div>
      <nav>
        <ul>
          <li><a href="/">HOME</a></li>
          <li><a href="/cart">CART</a></li>
          <li>
            <a href={authenticated ? "/profile" : "/login"}>
              {authenticated ? "Profile" : "Login"}
            </a>
          </li>
          <li><a href="/search">SEARCH</a></li>
          {authenticated && user?.isAdmin && <li><a href="/orders-history">Order History</a></li>}
          {authenticated && user?.isAdmin && <li><a href="/add-product">Add Inventory</a></li>}
        </ul>
      </nav>
    </header>
  );
};

export default Header;