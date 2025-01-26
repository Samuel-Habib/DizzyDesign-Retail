import React, { useState } from 'react';

const EditProduct = () => {
    const [productId, setProductId] = useState('');
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [result, setResult] = useState('');

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: productName,
                    price: productPrice,
                    description: productDescription
                })
            });
            const result = await response.json();
            setResult(`Product updated: ${result.message}`);
        } catch (error) {
            setResult(`Error updating product: ${error.message}`);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            setResult(`Product deleted: ${result.message}`);
        } catch (error) {
            setResult(`Error deleting product: ${error.message}`);
        }
    };

    return (
        <div>
            <h1>Edit Product</h1>
            <form onSubmit={handleUpdate}>
                <label htmlFor="product-id">Product ID:</label>
                <input
                    type="text"
                    id="product-id"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                /><br /><br />
                <label htmlFor="product-name">Product Name:</label>
                <input
                    type="text"
                    id="product-name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                /><br /><br />
                <label htmlFor="product-price">Product Price:</label>
                <input
                    type="number"
                    id="product-price"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                /><br /><br />
                <label htmlFor="product-description">Product Description:</label>
                <textarea
                    id="product-description"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                ></textarea><br /><br />
                <button type="submit">Update Product</button>
                <button type="button" onClick={handleDelete}>Delete Product</button>
            </form>
            <div>{result}</div>
        </div>
    );
};

export default EditProduct;