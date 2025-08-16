import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";
import "./ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");

  const location = useLocation();
  const categories = ["All", "Living Room", "Bedroom", "Dining Room", "Lamps & Lighting"];




  useEffect(() => {
    axios
      .get("http://localhost:3000/products")
      .then((res) => {
        setProducts(res.data);
        setFilteredProducts(res.data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);



  useEffect(() => {
    if (location.state?.category) {
      setCategory(location.state.category);
    }
  }, [location.state]);




  useEffect(() => {
    const handleSearchUpdate = (e) => {
      setSearchQuery(e.detail);
    };

    window.addEventListener("searchUpdated", handleSearchUpdate);

    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search");
    if (searchParam) {
      setSearchQuery(searchParam);
    }

    return () => {
      window.removeEventListener("searchUpdated", handleSearchUpdate);
    };
  }, [location.search]);

  


  useEffect(() => {
    let result = [...products];

    if (category !== "All") {
      result = result.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (searchQuery.trim() !== "") {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortOption === "low-high") {
      result.sort((a, b) => a.new_price - b.new_price);
    } else if (sortOption === "high-low") {
      result.sort((a, b) => b.new_price - a.new_price);
    }

    setFilteredProducts(result);
  }, [products, category, searchQuery, sortOption]);

  return (
    <div className="product-container">
      <h2 className="section-title">Our Products</h2>

  


      <div className="category-sort-row">
        <div className="category-buttons">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

      



        <div className="sort-wrapper">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="sort-select"
          >
            <option value="">Sort by Price</option>
            <option value="low-high">Low to High</option>
            <option value="high-low">High to Low</option>
          </select>
        </div>
      </div>

      


      <div className="product-grid">
        {filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} className="product-img" />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-desc">{product.description}</p>

              <div className="price-row">
                <span className="new-price">₹{product.new_price}</span>
                <span className="old-price">₹{product.old_price}</span>
              </div>

              <div className="status-row">
                <span
                  className={`status-label ${
                    product.status === "active" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.status === "active" ? "Available" : "Unavailable"}
                </span>
              </div>

              <Link to={`/products/${product.id}`} className="view-details-btn">
                View Details
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;
