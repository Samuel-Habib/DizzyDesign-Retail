import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import AddReview from "./AddReview";
import Header from "../components/Header";
import "../styles/productdetails.css"; // Make sure your path is correct
import { UserContext } from "../UserContext";

const ProductDetails = () => {
  const { id } = useParams(); // Extract the product ID from the URL
  const { user } = useContext(UserContext); // Access user from context
  const userId = user?._id || "64b6f73df1a2c5f8f87c9b4e"; // Use user ID if available
  const userName = user?.name || "guest";

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]); // State for reviews
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productResponse = await fetch(`/api/products/${id}`);
        if (!productResponse.ok) {
          throw new Error("Failed to fetch product details");
        }
        const productData = await productResponse.json();

        // If there's an imageID, fetch the associated image
        if (productData.imageID) {
          try {
            const imageResponse = await fetch(`/api/images/${productData.imageID}`);
            if (!imageResponse.ok) {
              console.error("Failed to fetch image:", imageResponse.statusText);
            } else {
              const imageData = await imageResponse.json();
              productData.imageUrl = imageData.image;
            }
          } catch (error) {
            console.error("Error fetching image:", error);
          }
        }

        setProduct(productData);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Product not found.");
      }
    };

    const fetchReviews = async () => {
      try {
        const reviewsResponse = await fetch(`/api/reviews/product/${id}`);
        if (!reviewsResponse.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Unable to load reviews.");
      }
    };

    fetchProductDetails();
    fetchReviews();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    // a get reqeust to check if this order is already in the cart

    const ordersResponse = await fetch('/api/orders')
    const ordersData = await ordersResponse.json()
    const order = ordersData.find(order => order.productID === product._id && order.status === 'in_cart')

    if (order) {
      try {
        await fetch(`/api/orders/${order._id}/increase-quantity`, {
          method: 'PUT',
          headers: {
        'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity: order.quantity }),
        });
        setCartMessage(`${product.name} has been added to your cart.`);
      } catch (error) {
        console.error("Error increasing product quantity in cart:", error);
        setCartMessage("Failed to update cart. Please try again.");
      }
    }
    else {
      try {
        const response = await fetch(
          "/api/orders/add-product-to-cart",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_name: userName,
              productID: product._id,
              productName: product.name,
              quantity: 1,
              total_price: product.price * 1,
            }),
          }
        );
  
        if (!response.ok) {
          throw new Error("Failed to add product to cart");
        }
  
        // You could manage cart state or simply show a success message
        const newOrder = await response.json();
        console.log("Cart update:", newOrder);
  
        setCartMessage(`${product.name} has been added to your cart.`);
      } catch (error) {
        console.error("Error adding product to cart:", error);
        setCartMessage("Failed to add product to cart. Please try again.");
      }
    }





  };

  return (
    <div className="product-page-header">
      <Header />
      <div className="product-page">
        {error && <p>{error}</p>}

        {product ? (
          <div className="product-details">
            {/* Left side (product image) */}
            <div className="product-image">
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="product-detail-image"
                />
              )}
            </div>

            {/* Right side (product info) */}
            <div className="product-info">
              <h1>{product.name}</h1>
              <p className="description">{product.description}</p>
              <p className="price">Price: ${product.price}</p>
              <p className="stock">Stock: {product.stockQuantity}</p>

              <button onClick={handleAddToCart} className="add-to-cart-button">
                Add to Cart
              </button>
              {cartMessage && <p className="cart-message">{cartMessage}</p>}
            </div>
          </div>
        ) : (
          <p>Loading product details...</p>
        )}

        {/* Add review section */}
        {product && (
          <AddReview
            productId={id}
            userId={userId}
            userName={userName}
            productName={product.name}
          />
        )}

        {/* Reviews */}
        <h2>Customer Reviews</h2>
        <div className="reviews-section">
          {reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="review-card">
                <h3>{review.userName}</h3>
                <p>Rating: {review.rating}/5</p>
                <p>{review.comment}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to review this product!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;