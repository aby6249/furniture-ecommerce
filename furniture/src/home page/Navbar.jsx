import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import axios from "axios";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const admin = JSON.parse(localStorage.getItem("admin"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const displayName = user
    ? `${user.firstName} ${user.secondName}`
    : admin
      ? `${admin.firstName} ${admin.secondName}`
      : "";

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
    <nav className="bg-[#f5f5f5] text-black w-full shadow">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">




        <div className="flex-1">
          <div className="text-3xl font-extrabold italic bg-gradient-to-r from-[#d62828] via-[#f77f00] to-[#fcbf49] text-transparent bg-clip-text tracking-wide">
            UrbanNest
          </div>
        </div>


        <div className="flex-1 flex justify-center space-x-10">
          <Link to="/">
            <p className="hover:text-yellow-800 font-semibold">Home</p>
          </Link>
          <Link to="/products">
            <p className="hover:text-yellow-800 font-semibold">Shop</p>
          </Link>
          <Link to="/orders">
            <p className="hover:text-yellow-800 font-semibold">My Orders</p>
          </Link>
        </div>



        <div className="flex-1 flex items-center justify-end gap-6">


          <div className="flex border rounded-lg overflow-hidden w-fit">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="outline-none px-2 pr-4 py-1 w-28 md:w-36 bg-white text-black"
            />
            <button
              onClick={handleSearch}
              className="bg-stone-600 hover:bg-stone-800 text-white px-4 py-1 font-semibold"
            >
              Search
            </button>
          </div>



          <div className="flex items-center gap-4">
            {(user || admin) ? (
              <>
                <p className="italic outline-none text-sm text-gray-700 font-bold">{displayName}</p>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-1 rounded-md"
              >
                Login
              </button>
            )}


            <div
              className="relative cursor-pointer"
              onClick={() => {
                if (admin) {
                  alert("Admin cannot access user cart!");
                  return;
                }
                navigate("/cart");
              }}
            >
              <FaShoppingCart className="text-black text-xl hover:text-yellow-800" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
