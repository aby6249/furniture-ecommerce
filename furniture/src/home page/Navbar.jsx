import React, { useContext, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { CartContext } from "../product/CartContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { cart } = useContext(CartContext); 

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const admin = JSON.parse(localStorage.getItem("admin"));

  const displayName = user
    ? user.first_name
    : admin
    ? `${admin.first_name} ${admin.second_name}`
    : "";

 
  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      if (location.pathname !== "/products") {
        navigate("/products");
      }
      return;
    }

    if (location.pathname !== "/products") {
      navigate(`/products?search=${searchQuery}`);
    } else {
      window.dispatchEvent(
        new CustomEvent("searchUpdated", { detail: searchQuery })
      );
    }
  };

  return (
    <nav className="bg-[#f5f5f5] shadow w-full">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

       
        <div className="flex-1">
          <div className="text-2xl md:text-3xl font-extrabold italic bg-gradient-to-r from-[#d62828] via-[#f77f00] to-[#fcbf49] text-transparent bg-clip-text tracking-wide">
            UrbanNest
          </div>
        </div>

      
        <div className="hidden md:flex flex-1 justify-center space-x-8">
          <Link to="/" className="hover:text-yellow-800 font-semibold">Home</Link>
          <Link to="/products" className="hover:text-yellow-800 font-semibold">Shop</Link>
          <Link to="/orders" className="hover:text-yellow-800 font-semibold">My Orders</Link>
        </div>

       
        <div className="flex-1 flex justify-end items-center gap-4 md:gap-6">

        
          <div className="hidden md:flex border rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="outline-none px-2 py-1 bg-white text-black"
            />
            <button
              onClick={handleSearch}
              className="bg-stone-600 hover:bg-stone-800 text-white px-4 py-1 font-semibold"
            >
              Search
            </button>
          </div>

      
          {(user || admin) && (
            <p className="hidden md:block italic text-sm text-gray-700 font-bold">
              {displayName}
            </p>
          )}

          
          {(user || admin) ? (
            <button
              onClick={handleLogout}
              className="hidden md:block bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="hidden md:block bg-amber-700 hover:bg-amber-800 text-white px-4 py-1 rounded-md"
            >
              Login
            </button>
          )}

      
          <div
            className="relative cursor-pointer text-black text-xl"
            onClick={() => {
              if (admin) {
                alert("Admin cannot access user cart!");
                return;
              }
              navigate("/cart");
            }}
          >
            <FaShoppingCart className="hover:text-yellow-800" />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </div>

          
          <button
            className="md:hidden ml-2 text-2xl"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

    
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 border-t">
          <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setMobileOpen(false)}>Shop</Link>
          <Link to="/orders" onClick={() => setMobileOpen(false)}>My Orders</Link>
        </div>
      )}
    </nav>
  );
}
