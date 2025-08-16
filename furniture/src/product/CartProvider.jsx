import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { CartContext } from "./CartContext";
import { toast } from "react-toastify";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [merged, setMerged] = useState(false);
  const [loading, setLoading] = useState(false);

  

  useEffect(() => {
    const handleUserChange = () => {
      const newUser = JSON.parse(localStorage.getItem("user"));
      setUser(newUser);
      if (!newUser) {
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        setCart(guestCart);
        setMerged(false);
      }
    };

    window.addEventListener("storage", handleUserChange);
    window.addEventListener("userUpdated", handleUserChange);

    return () => {
      window.removeEventListener("storage", handleUserChange);
      window.removeEventListener("userUpdated", handleUserChange);
    };
  }, []);

  

  useEffect(() => {
    const fetchCart = async () => {
      if (!user?.id) {
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        setCart(guestCart);
        return;
      }

      try {
        const { data } = await axios.get(`http://localhost:3000/cart?userId=${user.id}`);
        setCart(data);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    fetchCart();
  }, [user]);

  

  useEffect(() => {
    const mergeGuestCart = async () => {
      if (!user || merged) return;

      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      if (guestCart.length === 0) {
        setMerged(true);
        return;
      }

      setLoading(true);
      try {
        const { data: dbCart } = await axios.get(`http://localhost:3000/cart?userId=${user.id}`);

        for (const item of guestCart) {
          const existingItem = dbCart.find((c) => c.productId === item.id);

          if (existingItem) {
            await axios.patch(`http://localhost:3000/cart/${existingItem.id}`, {
              quantity: existingItem.quantity + item.quantity,
            });
          } else {
            await axios.post("http://localhost:3000/cart", {
              userId: user.id,
              productId: item.id,
              productName: item.name,
              productPrice: item.new_price,
              image: item.image,
              quantity: item.quantity,
            });
          }
        }

        localStorage.removeItem("guestCart");

        const updatedCart = await axios.get(`http://localhost:3000/cart?userId=${user.id}`);
        setCart(updatedCart.data);
        toast.success("Your guest cart has been merged successfully!");
      } catch (error) {
        console.error("Error merging guest cart:", error);
      } finally {
        setMerged(true);
        setLoading(false);
      }
    };

    mergeGuestCart();
  }, [user, merged]);



  const addToCart = useCallback(
    async (product) => {
      if (!user) {
        let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        const existingItem = guestCart.find((item) => item.id === product.id);

        if (existingItem) {
          guestCart = guestCart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          guestCart.push({ ...product, quantity: 1, guestId: Date.now() });
        }

        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        setCart(guestCart);
        window.dispatchEvent(new Event("cartUpdated")); 
        toast.success("Added to cart");
        return;
      }

      try {
        const existingItem = cart.find((item) => item.productId === product.id);

        if (existingItem) {
          const { data } = await axios.patch(
            `http://localhost:3000/cart/${existingItem.id}`,
            { quantity: existingItem.quantity + 1 }
          );

          setCart((prev) =>
            prev.map((item) =>
              item.id === data.id ? { ...item, quantity: data.quantity } : item
            )
          );
        } else {
          const { data } = await axios.post("http://localhost:3000/cart", {
            userId: user.id,
            productId: product.id,
            productName: product.name,
            productPrice: product.new_price,
            image: product.image,
            quantity: 1,
          });
          setCart((prev) => [...prev, data]);
        }
        window.dispatchEvent(new Event("cartUpdated"));
        toast.success("Added to cart");
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    },
    [user, cart]
  );

  


  const removeFromCart = async (id) => {
    if (!user) {
      let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      guestCart = guestCart.filter((item) => (item.guestId || item.id) !== id);
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      setCart(guestCart);
      window.dispatchEvent(new Event("cartUpdated"));
      return;
    }

    setCart((prev) => prev.filter((item) => item.id !== id));

    try {
      await axios.delete(`http://localhost:3000/cart/${id}`);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  



  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;

    if (!user) {
      let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      guestCart = guestCart.map((item) =>
        (item.guestId || item.id) === id ? { ...item, quantity } : item
      );
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      setCart(guestCart);
      window.dispatchEvent(new Event("cartUpdated"));
      return;
    }

    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );

    try {
      await axios.patch(`http://localhost:3000/cart/${id}`, { quantity });
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, loading }}
    >
      {children}
    </CartContext.Provider>
  );
};
