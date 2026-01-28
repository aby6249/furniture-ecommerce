import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { CartContext } from "./CartContext";
import { toast } from "react-toastify";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
 
  );
  const [merged, setMerged] = useState(false);
  const [loading, setLoading] = useState(false);
 console.log(user)
 
  useEffect(() => {
    const handleUserChange = () => {
      const newUser = JSON.parse(localStorage.getItem("user"));
      setUser(newUser);

      if (!newUser) {
        const guestCart =
          JSON.parse(localStorage.getItem("guestCart")) || [];
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
      if (!user?.access) {
        setCart(JSON.parse(localStorage.getItem("guestCart")) || []);
        return;
      }

      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/cart/",
          {
            headers: {
              Authorization: `Bearer ${user.access}`,
            },
          }
        );
        setCart(res.data);
      } catch (err) {
        console.error("Fetch cart error:", err);
      }
    };

    fetchCart();
  }, [user]);

  
  useEffect(() => {
    const mergeGuestCart = async () => {
      if (!user?.access || merged) return;

      const guestCart =
        JSON.parse(localStorage.getItem("guestCart")) || [];
      if (guestCart.length === 0) {
        setMerged(true);
        return;
      }

      try {
        setLoading(true);

        const { data: dbCart } = await axios.get(
          "http://127.0.0.1:8000/api/cart/",
          {
            headers: {
              Authorization: `Bearer ${user.access}`,
            },
          }
        );

        for (const item of guestCart) {
          const existing = dbCart.find(
            (c) => String(c.productId) === String(item.id)
          );

          if (existing) {
            await axios.patch(
              `http://127.0.0.1:8000/api/cart/${existing.id}/`,
              { quantity: existing.quantity + item.quantity },
              {
                headers: {
                  Authorization: `Bearer ${user.access}`,
                },
              }
            );
          } else {
            await axios.post(
              "http://127.0.0.1:8000/api/cart/",
              {
                productId: item.id,
                quantity: item.quantity,
              },
              {
                headers: {
                  Authorization: `Bearer ${user.access}`,
                },
              }
            );
          }
        }

        localStorage.removeItem("guestCart");

        const updated = await axios.get(
          "http://127.0.0.1:8000/api/cart/",
          {
            headers: {
              Authorization: `Bearer ${user.access}`,
            },
          }
        );
        setCart(updated.data);

        toast.success("Guest cart merged successfully!");
      } catch (err) {
        console.error("Merge error:", err);
      } finally {
        setMerged(true);
        setLoading(false);
      }
    };

    mergeGuestCart();
  }, [user, merged]);


  const addToCart = useCallback(
    async (product) => {
      if (!user?.access) {
        let guestCart =
          JSON.parse(localStorage.getItem("guestCart")) || [];

        const existing = guestCart.find((i) => i.id === product.id);

        if (existing) existing.quantity += 1;
        else guestCart.push({ ...product, quantity: 1 });

        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        setCart(guestCart);
        window.dispatchEvent(new Event("cartUpdated"));
        toast.success("Added to cart");
        return;
      }

      try {
        const res = await axios.post(
          "http://127.0.0.1:8000/api/cart/",
          {
            productId: product.id,
            quantity: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${user.access}`,
            },
          }
        );

        setCart((prev) => {
          const exists = prev.find((i) => i.id === res.data.id);
          return exists
            ? prev.map((i) =>
                i.id === res.data.id ? res.data : i
              )
            : [...prev, res.data];
        });

        window.dispatchEvent(new Event("cartUpdated"));
        toast.success("Added to cart");
      } catch (err) {
        console.error("Add cart error:", err);
      }
    },
    [user]
  );

  
  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;

    if (!user?.access) {
      let guestCart =
        JSON.parse(localStorage.getItem("guestCart")) || [];
      guestCart = guestCart.map((i) =>
        i.id === id ? { ...i, quantity } : i
      );
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      setCart(guestCart);
      return;
    }

    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/cart/${id}/`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${user.access}`,
          },
        }
      );

      setCart((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, quantity } : i
        )
      );
    } catch (err) {
      console.error("Update quantity error:", err);
    }
  };

 
  const removeFromCart = async (id) => {
    if (!user?.access) {
      let guestCart =
        JSON.parse(localStorage.getItem("guestCart")) || [];
      guestCart = guestCart.filter((i) => i.id !== id);
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      setCart(guestCart);
      return;
    }

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/cart/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${user.access}`,
          },
        }
      );

      setCart((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Remove cart error:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, loading }}
    >
      {children}
    </CartContext.Provider>
  );
};
