import React, { useState } from "react";
import "../styles/review.css";

const AddReview = ({ productId, userId, userName, productName }) => {
    const [reviewData, setReviewData] = useState({
        rating: "",
        comment: "",
    });
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setReviewData({ ...reviewData, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Ensure all required fields are filled
            if (!reviewData.rating || !reviewData.comment) {
                throw new Error("Please provide a rating and a comment.");
            }

            // Construct the payload
            const reviewPayload = {
                userId, // User ID to associate the review
                userName,
                productId, // Product ID to associate the review
                productName,
                rating: parseInt(reviewData.rating, 10),
                comment: reviewData.comment.trim(),
            };

            console.log("Submitting review payload:", reviewPayload);

            // API call to create the review
            const response = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reviewPayload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to submit review.");
            }

            const result = await response.json();
            console.log("Review creation result:", result);

            setMessage("Review submitted successfully!");
            setReviewData({
                rating: "",
                comment: "",
            });
        } catch (error) {
            console.error("Error submitting review:", error);
            setMessage(`Failed to submit review: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="review-form-container">
            <h2>Submit a Review</h2>
            {message && (
                <div
                    className={`message ${
                        message.includes("Failed") ? "message-error" : "message-success"
                    }`}
                >
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="rating">Rating (1-5)</label>
                    <input
                        type="number"
                        id="rating"
                        min="1"
                        max="5"
                        value={reviewData.rating}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your rating"
                    />
                </div>
                <div>
                    <label htmlFor="comment">Comment</label>
                    <textarea
                        id="comment"
                        value={reviewData.comment}
                        onChange={handleInputChange}
                        required
                        placeholder="Write your comment"
                    ></textarea>
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Submitting..." : "Submit Review"}
                </button>
            </form>
        </div>
    );
};

export default AddReview;
