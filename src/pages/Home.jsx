import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import Header from "../components/Header";

const Home = () => {
  const [products, setProducts] = useState([]);

  // Fetch products and their associated images from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products from the backend
        const response = await fetch("/api/products");
        if (!response.ok) {
          console.error("Failed to fetch products:", response.statusText);
          return;
        }

        const productsData = await response.json();

        // Log any invalid products without _id
        const validProducts = productsData.filter((product) => product._id);
        const invalidProducts = productsData.filter((product) => !product._id);
        if (invalidProducts.length > 0) {
          console.warn("Invalid products without _id:", invalidProducts);
        }

        // Fetch images for valid products
        const productsWithImages = await Promise.all(
          validProducts.map(async (product) => {
            if (product.imageID) {
              try {
                // Fetch the image using imageID
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
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {/* Header Section */}
      <header>
        <Header />
      </header>

      {/* Featured Products Section */}
      <section id="products">
        <h2>Featured Products</h2>
        <div className="product-grid">
          {products.map((product) =>
            product._id ? ( // Ensure _id exists before rendering
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
            ) : null // Skip rendering if _id is missing
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

export default Home;
