import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import '../styles/ordershistory.css';
import "../styles/Home.css";
import Header from "../components/Header";

const OrdersHistory = () => {
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState(null); // To store user data (e.g., isAdmin)
    const [loading, setLoading] = useState(true); // To handle loading state
    const navigate = useNavigate(); // Initialize useNavigate

    // Fetch completed orders and check if user is an admin
    useEffect(() => {
        const checkUserStatus = async () => {
            try {
                const response = await fetch("/api/users/check-auth", {
                    credentials: "include", // Ensure session info is included
                });
                const data = await response.json();

                if (data.success && data.user) {
                    setUser(data.user);
                    if (data.user.isAdmin === false) {
                        // Redirect to home if not an admin
                        navigate("/");
                    } else {
                        // Fetch orders if the user is an admin
                        fetchOrdersWithImages();
                    }
                } else {
                    // Redirect to home if not authenticated
                    navigate("/");
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
                navigate("/"); // Redirect to home on error
            }
        };

        checkUserStatus(); // Run the function on component mount
    }, [navigate]);

    // Fetch orders and attach images dynamically
    const fetchOrdersWithImages = async () => {
        try {
            const response = await fetch("/api/orders");
            const ordersData = await response.json();
            console.log("Fetched orders:", ordersData);

            const ordersWithImages = await Promise.all(
                ordersData.map(async (order) => {
                    if (order.productID) {
                        try {
                            // Fetch product details
                            const productResponse = await fetch(`/api/products/${order.productID}`);
                            const productData = await productResponse.json();

                            // Fetch image if imageID exists
                            if (productData.imageID) {
                                const imageResponse = await fetch(`/api/images/${productData.imageID}`);
                                if (imageResponse.ok) {
                                    const imageData = await imageResponse.json();
                                    order.imageURL = imageData.image; // Attach image URL dynamically
                                }
                            }
                        } catch (error) {
                            console.error(`Error fetching image for order ${order._id}:`, error);
                        }
                    }
                    return order;
                })
            );
            const completedOrders = ordersWithImages.filter((order) => order.status === "completed");

            setOrders(completedOrders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // Handle cancel order
    async function handleCancel(orderID) {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;

        try {
            const response = await fetch(`/api/orders/${orderID}/cancel`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                console.error("Failed to cancel order:", response.statusText);
                alert("Failed to cancel the order. Please try again.");
                return;
            }

            const data = await response.json();
            console.log(`Order ${orderID} canceled:`, data);

            // Update the orders state to reflect the cancellation
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderID ? { ...order, status: "canceled" } : order
                )
            );

            alert("Order successfully canceled!");
        } catch (error) {
            console.error("Error canceling order:", error);
            alert("An error occurred. Please try again.");
        }
    }

    return (
        <div>
            {/* Header Section */}
            <header>
                <Header />
            </header>

            {/* Orders Section */}
            <section id="orders">
                <h2>Your Completed Orders</h2>
                <div className="order-grid">
                    {loading ? (
                        <p>Loading orders...</p>
                    ) : orders.length > 0 ? (
                        orders.map((order) => (
                            <div key={order._id} className="order-card">
                                <img
                                    src={order.imageURL || "/assets/placeholder.png"}
                                    alt={order.productName}
                                />
                                <div className="order-details">
                                    <h3>{order.productName}</h3>
                                    <p>Price: ${order.total_price}</p>
                                    <p>Quantity: {order.quantity}</p>
                                    <p>Status: {order.status}</p>
                                    <button
                                        className="cancel-button"
                                        onClick={() => {
                                            console.log("Order being canceled:", order); // Log the full order object
                                            handleCancel(order._id);
                                        }}
                                        disabled={order.status === "canceled"}
                                    >
                                        {order.status === "canceled" ? "Canceled" : "Cancel"}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No completed orders found.</p>
                    )}
                </div>
            </section>

            {/* Footer Section */}
            <footer>
                <p>&copy; 2024 Dizzy Designs. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default OrdersHistory;