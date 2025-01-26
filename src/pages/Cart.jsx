import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/Home.css"; // Reuse the styles from Home
import '../styles/cart.css';
import Header from "../components/Header";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0); // State to store total price
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        // Fetch all orders with status 'in_cart'
        const response = await fetch("/api/orders?status=in_cart");
        console.log(response, "response")
        if (!response.ok) {
          console.error("Failed to fetch cart items:", response.statusText);
          setError("Failed to load cart items. Please try again.");
          return;
        }

        const cartData = await response.json();

        const filteredCartItems = cartData.filter((item) => item.status === "in_cart");

        // Fetch images for each product in the filtered cart
        const cartItemsWithImages = await Promise.all(
          filteredCartItems.map(async (item) => {
            if (item.productID) {
              try {
                const productResponse = await fetch(`/api/products/${item.productID}`);
                if (productResponse.ok) {
                  const productData = await productResponse.json();
                  if (productData.imageID) {
                    const imageResponse = await fetch(`/api/images/${productData.imageID}`);
                    if (imageResponse.ok) {
                      const imageData = await imageResponse.json();
                      item.imageUrl = imageData.image;
                    }
                  }
                }
              } catch (error) {
                console.error(`Error fetching product or image for item ${item._id}:`, error);
              }
            }
            return item;
          })
        );

        console.log("Cart Items After Processing:", cartItemsWithImages);

        setCartItems(cartItemsWithImages);

        // Calculate total price
        calculateTotalPrice(cartItemsWithImages);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setError("Failed to load cart items. Please try again.");
      }
    };

    fetchCartItems();
  }, []);

  // Function to calculate total price
  const calculateTotalPrice = (items) => {
    const total = items.reduce((sum, item) => sum + (item.total_price || 0), 0);
    setTotalPrice(total);
  };

  // Handle removing an item from the cart
  const handleRemove = (orderID) => {
    fetch(`/api/orders/${orderID}/remove`, { method: "DELETE" })
      .then((response) => response.json())
      .then(() => {
        const updatedCartItems = cartItems.filter((item) => item._id !== orderID);
        setCartItems(updatedCartItems);
        calculateTotalPrice(updatedCartItems); // Recalculate total price
      })
      .catch((error) => {
        console.error("Error removing item:", error);
        setError("Failed to remove item. Please try again.");
      });
  };

  return (
    <div>
      <header>
        <Header />
      </header>

      <div className="cart-container">
        <h2>Your Cart</h2>
        <div className="cart-items">
          {error && <p className="error-message">{error}</p>}
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item._id} className="cart-item-card">
                <img
                  src={item.imageUrl || "https://via.placeholder.com/150"}
                  alt={item.productName || "Product"}
                />
                <div className="cart-item-details">
                  <h3>{item.productName}</h3>
                  <p>Price: ${item.total_price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <button
                    className="remove-button"
                    onClick={() => handleRemove(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Cart is empty.</p>
          )}
        </div>

        {/* Total Price and Checkout Section */}
        {cartItems.length > 0 && (
          <div className="checkout-section">
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
            <button
              onClick={() => navigate("/checkout")} // Navigate to the Checkout page
              className="checkout-button"
            >
              Go to Checkout
            </button>
          </div>
        )}
      </div>

      <footer>
        <p>&copy; 2024 Dizzy Designs. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Cart;
