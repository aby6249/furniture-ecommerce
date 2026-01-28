import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import axios from "axios";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const admin = JSON.parse(localStorage.getItem("admin"));

  const displayName = user
    ? `${user.firstName} ${user.secondName}`
    : admin
    ? `${admin.firstName} ${admin.secondName}`
    : "";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const fetchCartCount = () => {
      if (user) {
        axios
          .get(`http://localhost:3000/cart?userId=${user.id}`)
          .then((res) => setCartCount(res.data.length))
          .catch((err) => console.error("Error fetching cart count:", err));
      } else {
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        setCartCount(guestCart.length);
      }
    };

    fetchCartCount();
    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [user]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      if (location.pathname !== "/products") {
        navigate("/products");
      } else {
        window.dispatchEvent(new CustomEvent("searchCleared"));
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

        {/* <<<<<<<<<<<<Desktop>>>>>>>>>>. */}
        <div className="hidden md:flex flex-1 justify-center space-x-8">
          <Link to="/" className="hover:text-yellow-800 font-semibold">Home</Link>
          <Link to="/products" className="hover:text-yellow-800 font-semibold">Shop</Link>
          <Link to="/orders" className="hover:text-yellow-800 font-semibold">My Orders</Link>
        </div>

      
        <div className="flex-1 flex justify-end items-center gap-4 md:gap-6">
          {/* <<<<<<<<<<<Search>>>>>>>>>> */}
          <div className="hidden md:flex border rounded-lg overflow-hidden w-fit">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="outline-none px-2 pr-4 py-1 w-36 bg-white text-black"
            />
            <button
              onClick={handleSearch}
              className="bg-stone-600 hover:bg-stone-800 text-white px-4 py-1 font-semibold"
            >
              Search
            </button>
          </div>

          {/* <<<<<<<<<<User Info>>>>>>>>> */}
          {user || admin ? (
            <p className="hidden md:block italic text-sm text-gray-700 font-bold">{displayName}</p>
          ) : null}

          {/* <<<<<<<<<Login / Logout>>>>>>>>>> */}
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

          {/* <<<<<<<<Cart>>>>>>>> */}
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

          {/*<<<<<<<<<<<< Mobile Menu Button>>>>>>>>>>> */}
          <button
            className="md:hidden ml-2 text-2xl focus:outline-none"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* <<<<<<<<<<Mobile menu>>>>>> */}

      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 border-t border-gray-200">
          <div className="flex flex-col gap-2">
            <Link to="/" className="hover:text-yellow-800 font-semibold" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/products" className="hover:text-yellow-800 font-semibold" onClick={() => setMobileOpen(false)}>Shop</Link>
            <Link to="/orders" className="hover:text-yellow-800 font-semibold" onClick={() => setMobileOpen(false)}>My Orders</Link>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="outline-none px-2 py-1 flex-1 border rounded"
            />
            <button
              onClick={() => { handleSearch(); setMobileOpen(false); }}
              className="bg-stone-600 hover:bg-stone-800 text-white px-3 py-1 rounded font-semibold"
            >
              Search
            </button>
          </div>

          <div className="flex flex-col mt-2 gap-2">
            {(user || admin) ? (
              <>
                <p className="italic text-sm text-gray-700 font-bold">{displayName}</p>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => { navigate("/login"); setMobileOpen(false); }}
                className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-1 rounded-md"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
