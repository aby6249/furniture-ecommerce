import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProductDetail.css";
import { CartContext } from "./CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Fetch error:", err));
  }, [id]);

  if (!product) {
    return <p>Loading product details...</p>;
  }

  const handleAddToCart = () => {
    if (product.status !== "active") {
      toast.error("Sorry, this product is currently unavailable.");
      return;
    }
    addToCart(product);
  };

  return (
    <div className="product-detail-container">
      <img src={product.image} alt={product.name} className="detail-img" />
      <div className="detail-info">
        <h1><b>{product.name}</b></h1>
        <p>{product.description}</p>
        <div className="price-row">
          <span className="new-price">₹{product.new_price}</span>
          <span className="old-price">₹{product.old_price}</span>
        </div>
        <div className="status-row">
          <span
            className={`status ${product.status === "active" ? "available" : "unavailable"}`}
          >
            {product.status === "active" ? "Available" : "Unavailable"}
          </span>
        </div>
        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={product.status !== "active"}
        >
          {product.status === "active" ? "Add to Cart" : "Stock Out"}
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
