// const BASE_URL = "http://127.0.0.1:8000/api/admin";

// export const adminFetch = async (url, options = {}) => {
//   const user = JSON.parse(localStorage.getItem("user"));

//   const res = await fetch(`${BASE_URL}${url}`, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${user?.access}`,
//       ...options.headers,
//     },
//   });

//   if (!res.ok) {
//     const err = await res.json();
//     throw err;
//   }

//   return res.json();
// };





// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import "./ManageProducts.css";

// /* =====================
//    API CONFIG
//    ===================== */
// const BASE_URL = "http://127.0.0.1:8000/api/admin";

// const getAuthHeaders = () => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const token = user?.access || user?.token || "";

//   return {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   };
// };

// const ManageProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [filter, setFilter] = useState("all");
//   const [categoryFilter, setCategoryFilter] = useState("all");
//   const [categories, setCategories] = useState([]);
//   const [sortBy, setSortBy] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const productsPerPage = 10;

//   const [showAddProductForm, setShowAddProductForm] = useState(false);

//   const [newProduct, setNewProduct] = useState({
//     name: "",
//     description: "",
//     image: "",
//     category: "",
//     old_price: "",
//     new_price: "",
//     status: "active",
//   });

//   /* =====================
//      FETCH PRODUCTS
//      ===================== */
//   const fetchProducts = async () => {
//     try {
//       const res = await fetch(`${BASE_URL}/products/`, {
//         headers: getAuthHeaders(),
//       });
//       if (!res.ok) throw new Error();

//       const data = await res.json();
//       setProducts(data);

//       const uniqueCategories = [...new Set(data.map((p) => p.category))];
//       setCategories(uniqueCategories);
//     } catch {
//       toast.error("Failed to load products");
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   /* =====================
//      ADD PRODUCT
//      ===================== */
//   const addProduct = async () => {
//     if (!newProduct.name || !newProduct.new_price || !newProduct.category) {
//       toast.error("Please fill required fields");
//       return;
//     }

//     try {
//       const res = await fetch(`${BASE_URL}/products/`, {
//         method: "POST",
//         headers: getAuthHeaders(),
//         body: JSON.stringify({
//           ...newProduct,
//           old_price: Number(newProduct.old_price) || 0,
//           new_price: Number(newProduct.new_price),
//         }),
//       });

//       if (!res.ok) throw new Error();

//       toast.success("Product added successfully");
//       setShowAddProductForm(false);
//       setNewProduct({
//         name: "",
//         description: "",
//         image: "",
//         category: "",
//         old_price: "",
//         new_price: "",
//         status: "active",
//       });
//       fetchProducts();
//     } catch {
//       toast.error("Failed to add product");
//     }
//   };

//   /* =====================
//      FILTER + SORT
//      ===================== */
//   const filtered = products.filter((p) => {
//     const statusMatch = filter === "all" || p.status === filter;
//     const categoryMatch =
//       categoryFilter === "all" || p.category === categoryFilter;
//     return statusMatch && categoryMatch;
//   });

//   const sorted = [...filtered].sort((a, b) => {
//     if (sortBy === "name") return a.name.localeCompare(b.name);
//     if (sortBy === "priceLow") return a.new_price - b.new_price;
//     if (sortBy === "priceHigh") return b.new_price - a.new_price;
//     return 0;
//   });

//   const start = (currentPage - 1) * productsPerPage;
//   const paginatedProducts = sorted.slice(start, start + productsPerPage);
//   const totalPages = Math.ceil(sorted.length / productsPerPage);

//   /* =====================
//      RENDER
//      ===================== */
//   return (
//     <div className="manage-products">
//       <h2>Manage Products</h2>

//       {/* ADD PRODUCT CARD */}
//       <div
//         className="add-product-card"
//         onClick={() => setShowAddProductForm(true)}
//       >
//         + Add New Product
//       </div>

//       {/* ADD PRODUCT MODAL */}
//       {showAddProductForm && (
//         <div
//           className="modal-overlay"
//           onClick={() => setShowAddProductForm(false)}
//         >
//           <div className="modal" onClick={(e) => e.stopPropagation()}>
//             <h2>Add New Product</h2>

//             <input
//               placeholder="Product Name *"
//               value={newProduct.name}
//               onChange={(e) =>
//                 setNewProduct({ ...newProduct, name: e.target.value })
//               }
//             />

//             <textarea
//               placeholder="Product Detail"
//               value={newProduct.description}
//               onChange={(e) =>
//                 setNewProduct({ ...newProduct, description: e.target.value })
//               }
//             />

//             <input
//               placeholder="Image URL"
//               value={newProduct.image}
//               onChange={(e) =>
//                 setNewProduct({ ...newProduct, image: e.target.value })
//               }
//             />

//             <select
//               value={newProduct.category}
//               onChange={(e) =>
//                 setNewProduct({ ...newProduct, category: e.target.value })
//               }
//             >
//               <option value="">Select Category *</option>
//               <option value="living room">Living Room</option>
//               <option value="bedroom">Bedroom</option>
//               <option value="dining room">Dining Room</option>
//               <option value="lamps & lighting">Lamps & Lighting</option>
//             </select>

//             <input
//               type="number"
//               placeholder="Old Price"
//               value={newProduct.old_price}
//               onChange={(e) =>
//                 setNewProduct({ ...newProduct, old_price: e.target.value })
//               }
//             />

//             <input
//               type="number"
//               placeholder="New Price *"
//               value={newProduct.new_price}
//               onChange={(e) =>
//                 setNewProduct({ ...newProduct, new_price: e.target.value })
//               }
//             />

//             <div className="modal-actions">
//               <button onClick={addProduct}>Add Product</button>
//               <button onClick={() => setShowAddProductForm(false)}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* FILTERS */}
//       <div className="controls">
//         <div>
//           <label>Filter by status:</label>
//           <select value={filter} onChange={(e) => setFilter(e.target.value)}>
//             <option value="all">All</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//           </select>
//         </div>

//         <div>
//           <label>View products by category:</label>
//           <select
//             value={categoryFilter}
//             onChange={(e) => setCategoryFilter(e.target.value)}
//           >
//             <option value="all">All Categories</option>
//             {categories.map((cat, i) => (
//               <option key={i} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label>Sort by:</label>
//           <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
//             <option value="">None</option>
//             <option value="name">Name</option>
//             <option value="priceLow">Price: Low to High</option>
//             <option value="priceHigh">Price: High to Low</option>
//           </select>
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="table-wrapper">
//         <table className="product-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Image</th>
//               <th>Category</th>
//               <th>Old Price</th>
//               <th>New Price</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedProducts.length ? (
//               paginatedProducts.map((p) => (
//                 <tr key={p.id}>
//                   <td>{p.id}</td>
//                   <td>{p.name}</td>
//                   <td>
//                     {p.image ? (
//                       <img src={p.image} alt="" width="50" />
//                     ) : (
//                       "-"
//                     )}
//                   </td>
//                   <td>{p.category}</td>
//                   <td>₹{p.old_price}</td>
//                   <td>₹{p.new_price}</td>
//                   <td>
//                     <span className={p.status}>{p.status}</span>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="7" className="no-products">
//                   No products found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* PAGINATION */}
//       <div className="pagination">
//         {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
//           <button
//             key={p}
//             onClick={() => setCurrentPage(p)}
//             className={currentPage === p ? "active-page" : ""}
//           >
//             {p}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ManageProducts;














// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import "./ManageProducts.css";

// /* =====================
//    API CONFIG
//    ===================== */
// const BASE_URL = "http://127.0.0.1:8000/api/admin";

// const getAuthHeaders = () => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const token = user?.access || user?.token || "";

//   return {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   };
// };

// const ManageProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [filter, setFilter] = useState("all");
//   const [categoryFilter, setCategoryFilter] = useState("all");
//   const [categories, setCategories] = useState([]);
//   const [sortBy, setSortBy] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const productsPerPage = 10;

//   const [showAddProductForm, setShowAddProductForm] = useState(false);

//   const [newProduct, setNewProduct] = useState({
//     name: "",
//     description: "",
//     image: "",
//     category: "",
//     old_price: "",
//     new_price: "",
//     status: "active",
//   });

//   /* =====================
//      FETCH PRODUCTS
//      ===================== */
//   const fetchProducts = async () => {
//     try {
//       const res = await fetch(`${BASE_URL}/products/`, {
//         headers: getAuthHeaders(),
//       });
//       if (!res.ok) throw new Error();

//       const data = await res.json();
//       setProducts(data);

//       const uniqueCategories = [...new Set(data.map((p) => p.category))];
//       setCategories(uniqueCategories);
//     } catch {
//       toast.error("Failed to load products");
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   /* =====================
//      ADD PRODUCT
//      ===================== */
//   const addProduct = async () => {
//     if (!newProduct.name || !newProduct.new_price || !newProduct.category) {
//       toast.error("Please fill required fields");
//       return;
//     }

//     try {
//       const res = await fetch(`${BASE_URL}/products/`, {
//         method: "POST",
//         headers: getAuthHeaders(),
//         body: JSON.stringify({
//           ...newProduct,
//           old_price: Number(newProduct.old_price) || 0,
//           new_price: Number(newProduct.new_price),
//         }),
//       });

//       if (!res.ok) throw new Error();

//       toast.success("Product added successfully");
//       setShowAddProductForm(false);
//       setNewProduct({
//         name: "",
//         description: "",
//         image: "",
//         category: "",
//         old_price: "",
//         new_price: "",
//         status: "active",
//       });
//       fetchProducts();
//     } catch {
//       toast.error("Failed to add product");
//     }
//   };

//   /* =====================
//      FILTER + SORT
//      ===================== */
//   const filtered = products.filter((p) => {
//     const statusMatch = filter === "all" || p.status === filter;
//     const categoryMatch =
//       categoryFilter === "all" || p.category === categoryFilter;
//     return statusMatch && categoryMatch;
//   });

//   const sorted = [...filtered].sort((a, b) => {
//     if (sortBy === "name") return a.name.localeCompare(b.name);
//     if (sortBy === "priceLow") return a.new_price - b.new_price;
//     if (sortBy === "priceHigh") return b.new_price - a.new_price;
//     return 0;
//   });

//   const start = (currentPage - 1) * productsPerPage;
//   const paginatedProducts = sorted.slice(start, start + productsPerPage);
//   const totalPages = Math.ceil(sorted.length / productsPerPage);

//   /* =====================
//      RENDER
//      ===================== */
//   return (
//     <div className="manage-products">
//       <h2>Manage Products</h2>

//       {/* ADD PRODUCT CARD */}
//       <div
//         className="add-product-card"
//         onClick={() => setShowAddProductForm(true)}
//       >
//         + Add New Product
//       </div>

//       {/* ADD PRODUCT MODAL */}
//       {showAddProductForm && (
//         <div
//           className="modal-overlay"
//           onClick={() => setShowAddProductForm(false)}
//         >
//           <div className="modal" onClick={(e) => e.stopPropagation()}>
//             <h2>Add New Product</h2>

//             <input
//               placeholder="Product Name *"
//               value={newProduct.name}
//               onChange={(e) =>
//                 setNewProduct({ ...newProduct, name: e.target.value })
//               }
//             />

//             <textarea
//               placeholder="Product Detail"
//               value={newProduct.description}
//               onChange={(e) =>
//                 setNewProduct({ ...newProduct, description: e.target.value })
//               }
//             />

//             <input
//               placeholder="Image URL"
//               value={newProduct.image}
//               onChange={(e) =>
//                 setNewProduct({ ...newProduct, image: e.target.value })
//               }
//             />

//             <select
//               value={newProduct.category}
//               onChange={(e) =>
//                 setNewProduct({ ...newProduct, category: e.target.value })
//               }
//             >
//               <option value="">Select Category *</option>
//               <option value="living room">Living Room</option>
//               <option value="bedroom">Bedroom</option>
//               <option value="dining room">Dining Room</option>
//               <option value="lamps & lighting">Lamps & Lighting</option>
//             </select>

//             <input
//               type="number"
//               placeholder="Old Price"
//               value={newProduct.old_price}
//               onChange={(e) =>
//                 setNewProduct({ ...newProduct, old_price: e.target.value })
//               }
//             />

//             <input
//               type="number"
//               placeholder="New Price *"
//               value={newProduct.new_price}
//               onChange={(e) =>
//                 setNewProduct({ ...newProduct, new_price: e.target.value })
//               }
//             />

//             <div className="modal-actions">
//               <button onClick={addProduct}>Add Product</button>
//               <button onClick={() => setShowAddProductForm(false)}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* FILTERS */}
//       <div className="controls">
//         <div>
//           <label>Filter by status:</label>
//           <select value={filter} onChange={(e) => setFilter(e.target.value)}>
//             <option value="all">All</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//           </select>
//         </div>

//         <div>
//           <label>View products by category:</label>
//           <select
//             value={categoryFilter}
//             onChange={(e) => setCategoryFilter(e.target.value)}
//           >
//             <option value="all">All Categories</option>
//             {categories.map((cat, i) => (
//               <option key={i} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label>Sort by:</label>
//           <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
//             <option value="">None</option>
//             <option value="name">Name</option>
//             <option value="priceLow">Price: Low to High</option>
//             <option value="priceHigh">Price: High to Low</option>
//           </select>
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="table-wrapper">
//         <table className="product-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Image</th>
//               <th>Category</th>
//               <th>Old Price</th>
//               <th>New Price</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedProducts.length ? (
//               paginatedProducts.map((p) => (
//                 <tr key={p.id}>
//                   <td>{p.id}</td>
//                   <td>{p.name}</td>
//                   <td>
//                     {p.image ? (
//                       <img src={p.image} alt="" width="50" />
//                     ) : (
//                       "-"
//                     )}
//                   </td>
//                   <td>{p.category}</td>
//                   <td>₹{p.old_price}</td>
//                   <td>₹{p.new_price}</td>
//                   <td>
//                     <span className={p.status}>{p.status}</span>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="7" className="no-products">
//                   No products found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* PAGINATION */}
//       <div className="pagination">
//         {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
//           <button
//             key={p}
//             onClick={() => setCurrentPage(p)}
//             className={currentPage === p ? "active-page" : ""}
//           >
//             {p}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ManageProducts;
