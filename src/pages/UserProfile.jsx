import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";
import "../styles/userprofile.css";

const UserProfile = () => {
  const [authenticated, setAuthenticated] = useState(null); // Track auth state
  const [user, setUser] = useState(null); // Store user details
  const [feedback, setFeedback] = useState(""); // Feedback message
  const [adminPassword, setAdminPassword] = useState(""); // Admin password input
  const [userReviews, setUserReviews] = useState([]); // Store user's reviews
  const [editingReview, setEditingReview] = useState(null); // Track the review being edited
  const [updatedComment, setUpdatedComment] = useState(""); // Store the updated comment
  const [updatedRating, setUpdatedRating] = useState(5); // Store the updated rating (default 5)
  const navigate = useNavigate();

  // Authentication function
  const authenticate = async () => {
    try {
      const response = await fetch("/api/users/check-auth", {
        credentials: "include", // Include cookies for session-based authentication
      });
      const data = await response.json();
      console.log(data);

      if (data.success && data.user) {
        setAuthenticated(true);
        setUser(data.user); // Store user details
        fetchUserReviews(data.user._id); // Fetch user reviews using userId
      } else {
        setAuthenticated(false);
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      setAuthenticated(false); // Default to unauthenticated on error
    }
  };

  // Fetch reviews created by the authenticated user
  const fetchUserReviews = async (userId) => {
    try {
      const response = await fetch(`/api/reviews/user/${userId}`); // Adjust API endpoint as needed
      if (!response.ok) {
        throw new Error("Failed to fetch user reviews");
      }
      const reviews = await response.json();
      setUserReviews(reviews);
    } catch (error) {
      console.error("Error fetching user reviews:", error);
    }
  };

  // Handle updating a review
  const handleUpdateReview = async (reviewId) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: updatedComment, rating: updatedRating }),
      });

      if (!response.ok) {
        throw new Error("Failed to update review");
      }

      // Refresh reviews
      fetchUserReviews(user._id);
      setEditingReview(null);
      setUpdatedComment("");
      setUpdatedRating(5);
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  // Handle deleting a review
  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      // Refresh reviews
      fetchUserReviews(user._id);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  useEffect(() => {
    authenticate(); // Check authentication on component mount
  }, []);

  useEffect(() => {
    if (authenticated === false) {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [authenticated, navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        navigate("/login");
      } else {
        setFeedback(data.message || "Failed to log out.");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      setFeedback("An error occurred.");
    }
  };

  const handleMakeAdmin = async () => {
    try {
      const username = user._id;
      console.log(username);

      const response = await fetch("/api/users/is-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: username, // Use the current user's ID
          adminPassword, // Admin password entered by the user
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFeedback("User successfully made an administrator.");
      } else {
        setFeedback(data.message || "Failed to make user admin.");
      }
    } catch (error) {
      console.error("Error making user admin:", error);
      setFeedback("An error occurred.");
    }
  };


  return (
    <div className="profile">
      <header className="header">
        <Header />
      </header>

      <div className="profile-review-container">
        {/* Profile Section */}
        <div className="profile-container">
          <h1 className="profile-title">Profile</h1>
          {feedback && <div className="feedback">{feedback}</div>}
          {user && (
            <div className="user-info">
              <p>Welcome, {user.name || "User"}!</p>
              <p>Email: {user.email}</p>
            </div>
          )}
          <div className="admin-container">
            <label>
              Enter Admin Password:
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
            </label>
          </div>
          {/* buttons */}
          <button onClick={handleMakeAdmin}>Make Admin</button>
          <div className="change-password-container">
            <button
              onClick={() => navigate("/forgot-password")}
              className="change-password-button"
            >
              Change User Password
            </button>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>

        {/* Reviews Section */}
        <div className="reviews-container">
          <h2 className="reviews-title">Your Reviews</h2>
          {userReviews.length > 0 ? (
            userReviews.map((review) => (
              <div key={review._id} className="review">
                <h3 className="product-name">Product: {review.productName}</h3>
                <p className="rating">
                  Rating:{" "}
                  {editingReview === review._id ? (
                    <input
                      type="number"
                      min="1"
                      max="5"
                      className="rating-input"
                      value={updatedRating}
                      onChange={(e) => setUpdatedRating(Number(e.target.value))}
                    />
                  ) : (
                    `${review.rating}/5`
                  )}
                </p>
                {editingReview === review._id ? (
                  <div className="edit-review">
                    <textarea
                      value={updatedComment}
                      onChange={(e) => setUpdatedComment(e.target.value)}
                      placeholder="Update your review"
                      className="comment-input"
                    />
                    <button className="save-button" onClick={() => {}}>
                      Save
                    </button>
                    <button className="cancel-button" onClick={() => {}}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p className="comment">{review.comment}</p>
                )}
                <button
                  className="edit-button"
                  onClick={() => setEditingReview(review._id)}
                >
                  Edit Review
                </button>
                <button
                  className="delete-button"
                  onClick={() => {}}
                >
                  Delete Review
                </button>
              </div>
            ))
          ) : (
            <p className="no-reviews">You haven't reviewed any products yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;