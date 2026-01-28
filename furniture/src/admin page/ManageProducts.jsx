import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./ManageProducts.css";




const BASE_URL = "http://127.0.0.1:8000/api/admin";

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.access || user?.token || "";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;




  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    image: "",
    category: "",
    old_price: "",
    new_price: "",
    status: "active",
  });

 
  const [editingProduct, setEditingProduct] = useState(null);
  const [editValues, setEditValues] = useState({
    name: "",
    description: "",
    image: "",
    category: "",
    old_price: "",
    new_price: "",
    status: "active",
  });




  const fetchProducts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/products/`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error();

      const data = await res.json();
      setProducts(data);
      setCategories([...new Set(data.map((p) => p.category))]);
    } catch {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);





  const addProduct = async () => {
    if (!newProduct.name || !newProduct.new_price || !newProduct.category) {
      toast.error("Please fill required fields");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/products/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...newProduct,
          old_price: Number(newProduct.old_price) || 0,
          new_price: Number(newProduct.new_price),
        }),
      });
      if (!res.ok) throw new Error();

      toast.success("Product added");
      setShowAddProductForm(false);
      setNewProduct({
        name: "",
        description: "",
        image: "",
        category: "",
        old_price: "",
        new_price: "",
        status: "active",
      });
      fetchProducts();
    } catch {
      toast.error("Failed to add product");
    }
  };



  const patchProduct = async (id, body, msg) => {
    try {
      const res = await fetch(`${BASE_URL}/products/${id}/`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();

      toast.success(msg);
      fetchProducts();
    } catch {
      toast.error("Update failed");
    }
  };




  const handleEditClick = (p) => {
    setEditingProduct(p.id);
    setEditValues({
      name: p.name,
      description: p.description || "",
      image: p.image || "",
      category: p.category,
      old_price: p.old_price || "",
      new_price: p.new_price,
      status: p.status,
    });
  };

  const handleEditChange = (e) => {
    setEditValues({ ...editValues, [e.target.name]: e.target.value });
  };

  const saveEdit = (id) => {
    patchProduct(
      id,
      {
        ...editValues,
        old_price: Number(editValues.old_price) || 0,
        new_price: Number(editValues.new_price),
      },
      "Product updated"
    );
    setEditingProduct(null);
  };




  const softDeleteProduct = (id) => {
    if (!window.confirm("Hide this product?")) return;
    patchProduct(id, { status: "inactive" }, "Product hidden");
  };

  const reactivateProduct = (id) => {
    patchProduct(id, { status: "active" }, "Product reactivated");
  };




  const filtered = products.filter((p) => {
    const s = filter === "all" || p.status === filter;
    const c = categoryFilter === "all" || p.category === categoryFilter;
    return s && c;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "priceLow") return a.new_price - b.new_price;
    if (sortBy === "priceHigh") return b.new_price - a.new_price;
    return 0;
  });

  const start = (currentPage - 1) * productsPerPage;
  const paginatedProducts = sorted.slice(start, start + productsPerPage);
  const totalPages = Math.ceil(sorted.length / productsPerPage);




  return (
    <div className="manage-products">
      <h2>Manage Products</h2>


      <div
        className="add-product-card"
        onClick={() => setShowAddProductForm(true)}
      >
        + Add New Product
      </div>




      <div className="controls">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">None</option>
          <option value="name">Name</option>
          <option value="priceLow">Price Low → High</option>
          <option value="priceHigh">Price High → Low</option>
        </select>
      </div>

      {/* ADD PRODUCT MODAL */}
      {showAddProductForm && (
        <div
          className="modal-overlay"
          onClick={() => setShowAddProductForm(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Product</h2>

            <input
              placeholder="Product Name *"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />

            <textarea
              placeholder="Product Description"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
            />

            <input
              placeholder="Image URL"
              value={newProduct.image}
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.value })
              }
            />

            <select
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
            >
              <option value="">Select Category *</option>
              <option value="living room">Living Room</option>
              <option value="bedroom">Bedroom</option>
              <option value="dining room">Dining Room</option>
              <option value="lamps & lighting">Lamps & Lighting</option>
            </select>

            <input
              type="number"
              placeholder="Old Price"
              value={newProduct.old_price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, old_price: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="New Price *"
              value={newProduct.new_price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, new_price: e.target.value })
              }
            />

            <div className="modal-actions">
              <button onClick={addProduct}>Add Product</button>
              <button onClick={() => setShowAddProductForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

 


      <div className="table-wrapper">
        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Image</th>
              <th>Category</th>
              <th>Old Price</th>
              <th>New Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedProducts.length ? (
              paginatedProducts.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>

                  <td>
                    {editingProduct === p.id ? (
                      <input
                        name="name"
                        value={editValues.name}
                        onChange={handleEditChange}
                      />
                    ) : (
                      p.name
                    )}
                  </td>

                  <td>
                    {editingProduct === p.id ? (
                      <input
                        name="image"
                        value={editValues.image}
                        onChange={handleEditChange}
                      />
                    ) : p.image ? (
                      <img src={p.image} alt="" width="50" />
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>
                    {editingProduct === p.id ? (
                      <input
                        name="category"
                        value={editValues.category}
                        onChange={handleEditChange}
                      />
                    ) : (
                      p.category
                    )}
                  </td>

                  <td>
                    {editingProduct === p.id ? (
                      <input
                        type="number"
                        name="old_price"
                        value={editValues.old_price}
                        onChange={handleEditChange}
                      />
                    ) : (
                      `₹${p.old_price}`
                    )}
                  </td>

                  <td>
                    {editingProduct === p.id ? (
                      <input
                        type="number"
                        name="new_price"
                        value={editValues.new_price}
                        onChange={handleEditChange}
                      />
                    ) : (
                      `₹${p.new_price}`
                    )}
                  </td>

                  <td>
                    {editingProduct === p.id ? (
                      <select
                        name="status"
                        value={editValues.status}
                        onChange={handleEditChange}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    ) : (
                      <span className={p.status}>{p.status}</span>
                    )}
                  </td>

                  <td className="actions">
                    {editingProduct === p.id ? (
                      <>
                        <button
                          className="save-btn"
                          onClick={() => saveEdit(p.id)}
                        >
                          Save
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => setEditingProduct(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="edit-btn"
                          onClick={() => handleEditClick(p)}
                        >
                          Edit
                        </button>

                        {p.status === "active" ? (
                          <button
                            className="delete-btn"
                            onClick={() => softDeleteProduct(p.id)}
                          >
                            Delete
                          </button>
                        ) : (
                          <button
                            className="reactivate-btn"
                            onClick={() => reactivateProduct(p.id)}
                          >
                            Reactivate
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-products">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setCurrentPage(p)}
            className={currentPage === p ? "active-page" : ""}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ManageProducts;
