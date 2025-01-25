const Order = require('../models/orderModel');

// Helper function to handle database interactions
const handleResponse = async (res, operation) => {
    try {
        const result = await operation;
        if (!result) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// View all orders (including canceled orders)
const getAllOrders = (req, res) => {
    handleResponse(res, Order.find());
};

// View only canceled orders
const getCanceledOrders = (req, res) => {
    handleResponse(res, Order.find({ status: 'canceled' }));
};

// Cancel an order
const cancelOrder = (req, res) => {
    handleResponse(res, Order.findByIdAndUpdate(req.params.id, { status: 'canceled' }, { new: true }));
};

// View the name of the user who placed the order
const getUserName = (req, res) => {
    handleResponse(res, Order.findById(req.params.id).select('userName'));
};

// View quantity of items in an order
const getOrderQuantity = (req, res) => {
    handleResponse(res, Order.findById(req.params.id).select('quantity'));
};

// View total price of an order
const getTotalPrice = (req, res) => {
    handleResponse(res, Order.findById(req.params.id).select('totalPrice'));
};

// View status of an order
const getOrderStatus = (req, res) => {
    handleResponse(res, Order.findById(req.params.id).select('status'));
};

const addProductAsOrder = async (req, res) => {
    const { user_name, productID, productName, quantity, total_price } = req.body;

    try {
        const newOrder = new Order({
            user_name,
            productID,
            productName,
            quantity,
            total_price,
            status: 'in_cart',
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const increaseCartQuantity = async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    let newQuantity = quantity + 1;

    try {
        const thisOrder = await Order.findById(id);
        const price = thisOrder.total_price * newQuantity;
        const order = await Order.findOneAndUpdate({ _id: id }, { quantity: newQuantity, total_price: price }, { new: true });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



const deleteOrder = (req, res) => {
    handleResponse(res, Order.findByIdAndDelete(req.params.id));
};

const completeSpecificOrder = async (req, res) => {
    const { id } = req.params; // Extract order ID from the request URL

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            id, // Find the order by ID
            { $set: { status: 'completed' } }, // Update the status to 'completed'
            { new: true } // Return the updated document
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        res.status(200).json({ message: 'Order marked as completed.', order: updatedOrder });
    } catch (error) {
        console.error('Error completing order:', error.message);
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    getAllOrders,
    getCanceledOrders,
    cancelOrder,
    getUserName,
    getOrderQuantity,
    getTotalPrice,
    getOrderStatus,
    addProductAsOrder,
    deleteOrder,
    completeSpecificOrder,
    increaseCartQuantity
};