import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

const SearchProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounced search function
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setProducts([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/products/search?query=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const productsData = await response.json();

      // Filter products with valid _id
      const validProducts = productsData.filter((product) => product._id);
      const invalidProducts = productsData.filter((product) => !product._id);

      if (invalidProducts.length > 0) {
        console.warn("Invalid products without _id:", invalidProducts);
      }

      // Fetch associated images for valid products
      const productsWithImages = await Promise.all(
        validProducts.map(async (product) => {
          if (product.imageID) {
            try {
              const imageResponse = await fetch(`/api/images/${product.imageID}`);
              if (imageResponse.ok) {
                const imageData = await imageResponse.json();
                product.imageUrl = imageData.image; // Add the image URL to the product object
              } else {
                console.error(
                  `Failed to fetch image for product ${product._id}:`,
                  imageResponse.statusText
                );
              }
            } catch (error) {
              console.error(
                `Error fetching image for product ${product._id}:`,
                error
              );
            }
          }
          return product;
        })
      );

      setProducts(productsWithImages);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Error fetching products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  // Debounce search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch]);

  return (
    <div>
      {/* Header Section */}
      <header>
        <Header />
      </header>
      <header>
        <div id="header-container">
          <h1>Product Search</h1>
        </div>
      </header>

      <section id="search">
        <input
          type="text"
          id="searchBar"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </section>

      <section id="products">
        <h2>Search Results</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : products.length > 0 ? (
          <div className="product-grid">
            {products.map((product) =>
              product._id ? (
                <div key={product._id} className="product">
                  <Link to={`/product-details/${product._id}`}>
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl} // Base64 string or full URL for the image
                        alt={product.name}
                        className="product-image"
                      />
                    )}
                    <h3>{product.name}</h3>
                    <p>${product.price}</p>
                  </Link>
                </div>
              ) : null
            )}
          </div>
        ) : searchQuery ? (
          <p>No products found for "{searchQuery}".</p>
        ) : null}
      </section>

      <footer>
        <p>&copy; 2024 Dizzy Designs. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SearchProducts;