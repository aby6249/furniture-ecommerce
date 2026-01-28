// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://127.0.0.1:8000/api",
// });

// api.interceptors.request.use((config) => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   if (user?.access) {
//     config.headers.Authorization = `Bearer ${user.access}`;
//   }
//   return config;
// });

// export default api;


// import React, { useState, useEffect, useCallback } from "react";
// import api from "../api/axios";
// import { CartContext } from "./CartContext";
// import { toast } from "react-toastify";

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const user = JSON.parse(localStorage.getItem("user"));


//   useEffect(() => {
//     const fetchCart = async () => {
//       if (!user?.access) {
//         setCart(JSON.parse(localStorage.getItem("guestCart")) || []);
//         return;
//       }

//       try {
//         setLoading(true);
//         const { data } = await api.get("/cart/");
//         setCart(data);
//       } catch (err) {
//         console.error("Fetch cart error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCart();
//   }, [user?.access]);

//   /* 🔹 Merge guest cart after login */
//   useEffect(() => {
//     const mergeGuestCart = async () => {
//       if (!user?.access) return;

//       const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
//       if (guestCart.length === 0) return;

//       try {
//         setLoading(true);

//         for (const item of guestCart) {
//           await api.post("/cart/", {
//             productId: item.productId,
//             quantity: item.quantity,
//           });
//         }

//         localStorage.removeItem("guestCart");

//         const { data } = await api.get("/cart/");
//         setCart(data);

//         toast.success("Cart merged successfully");
//       } catch (err) {
//         console.error("Merge cart error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     mergeGuestCart();
//   }, [user?.access]);

//   /* 🔹 Add to cart */
//   const addToCart = useCallback(
//     async (product) => {
//       if (!user?.access) {
//         let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

//         const existing = guestCart.find(
//           (item) => item.productId === product.id
//         );

//         if (existing) {
//           existing.quantity += 1;
//         } else {
//           guestCart.push({
//             id: Date.now(),
//             productId: product.id,
//             productName: product.name,
//             productPrice: product.new_price,
//             image: product.image,
//             quantity: 1,
//           });
//         }

//         localStorage.setItem("guestCart", JSON.stringify(guestCart));
//         setCart(guestCart);
//         window.dispatchEvent(new Event("cartUpdated"));
//         toast.success("Added to cart");
//         return;
//       }

//       try {
//         setLoading(true);
//         const { data } = await api.post("/cart/", {
//           productId: product.id,
//           quantity: 1,
//         });

//         setCart((prev) => {
//           const exists = prev.find((i) => i.id === data.id);
//           return exists
//             ? prev.map((i) => (i.id === data.id ? data : i))
//             : [...prev, data];
//         });

//         window.dispatchEvent(new Event("cartUpdated"));
//         toast.success("Added to cart");
//       } catch (err) {
//         console.error("Add to cart error:", err);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [user]
//   );

//   /* 🔹 Update quantity */
//   const updateQuantity = async (id, quantity) => {
//     if (quantity < 1) return;

//     if (!user?.access) {
//       let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
//       guestCart = guestCart.map((item) =>
//         item.id === id ? { ...item, quantity } : item
//       );
//       localStorage.setItem("guestCart", JSON.stringify(guestCart));
//       setCart(guestCart);
//       window.dispatchEvent(new Event("cartUpdated"));
//       return;
//     }

//     try {
//       setLoading(true);
//       const { data } = await api.patch(`/cart/${id}/`, { quantity });
//       setCart((prev) =>
//         prev.map((item) => (item.id === data.id ? data : item))
//       );
//       window.dispatchEvent(new Event("cartUpdated"));
//     } catch (err) {
//       console.error("Update quantity error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* 🔹 Remove from cart */
//   const removeFromCart = async (id) => {
//     if (!user?.access) {
//       let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
//       guestCart = guestCart.filter((item) => item.id !== id);
//       localStorage.setItem("guestCart", JSON.stringify(guestCart));
//       setCart(guestCart);
//       window.dispatchEvent(new Event("cartUpdated"));
//       return;
//     }

//     try {
//       setLoading(true);
//       await api.delete(`/cart/${id}/`);
//       setCart((prev) => prev.filter((item) => item.id !== id));
//       window.dispatchEvent(new Event("cartUpdated"));
//     } catch (err) {
//       console.error("Remove cart error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <CartContext.Provider
//       value={{ cart, addToCart, updateQuantity, removeFromCart, loading }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };
