import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./ManageProducts.css";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

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

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    image: "",
    category: "",
    old_price: "",
    new_price: "",
    status: "active",
  });

  
  const [showAddProductForm, setShowAddProductForm] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);

      const uniqueCategories = [...new Set(data.map((p) => p.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      toast.error(`Failed to load products: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const patchProduct = async (id, bodyData, successMsg) => {
    try {
      const res = await fetch(`http://localhost:3000/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      if (!res.ok) throw new Error("Failed to update product");
      toast.success(successMsg);
      fetchProducts();
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.new_price || !newProduct.category) {
      toast.error("Please fill required fields: Name, New Price, Category");
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProduct,
          old_price: Number(newProduct.old_price) || 0,
          new_price: Number(newProduct.new_price),
        }),
      });
      if (!res.ok) throw new Error("Failed to add product");
      toast.success("Product added successfully");
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
      setShowAddProductForm(false);  
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const softDeleteProduct = (id) => {
    if (!window.confirm("Hide this product?")) return;
    patchProduct(id, { status: "inactive" }, "Product hidden");
  };

  const reactivateProduct = (id) => {
    if (!window.confirm("Reactivate this product?")) return;
    patchProduct(id, { status: "active" }, "Product reactivated");
  };

  const handleEditClick = (prod) => {
    setEditingProduct(prod.id);
    setEditValues({
      name: prod.name,
      detail: prod.description || "",
      image: prod.image || "",
      category: prod.category,
      old_price: prod.old_price || "",
      new_price: prod.new_price,
      status: prod.status || "active",
    });
  };

  const handleEditChange = (e) => {
    setEditValues({ ...editValues, [e.target.name]: e.target.value });
  };

  const saveEdit = (id) => {
    const bodyData = {
      name: editValues.name,
      detail: editValues.description,
      image: editValues.image,
      category: editValues.category,
      old_price: Number(editValues.old_price) || 0,
      new_price: Number(editValues.new_price),
      status: editValues.status,
    };
    patchProduct(id, bodyData, "Product updated");
    setEditingProduct(null);
  };

  const filtered = products.filter((prod) => {
    const statusMatch = filter === "all" ? true : prod.status === filter;
    const categoryMatch =
      categoryFilter === "all" ? true : prod.category === categoryFilter;
    return statusMatch && categoryMatch;
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

  if (showAddProductForm) {
    return (
      <div className="manage-products">
        <h2>Add New Product</h2>
        <div className="add-product-form">
          <input
            type="text"
            placeholder="Product Name *"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
          <textarea
            placeholder="Product description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newProduct.image}
            onChange={(e) =>
              setNewProduct({ ...newProduct, image: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Category *"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
          />
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
          <select
            value={newProduct.status}
            onChange={(e) =>
              setNewProduct({ ...newProduct, status: e.target.value })
            }
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div style={{ marginTop: "1rem" }}>
            <button onClick={addProduct} style={{ marginRight: "1rem" }}>
              Add Product
            </button>
            <button onClick={() => setShowAddProductForm(false)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="manage-products">
      <h2>Manage Products</h2>


      <div
        className="add-product-card"
        onClick={() => setShowAddProductForm(true)}
        style={{
          border: "2px dashed #E39D2D",
          borderRadius: "12px",
          padding: "2rem",
          marginBottom: "2rem",
          cursor: "pointer",
          textAlign: "center",
          color: "#BD7D1C",
          fontWeight: "600",
          fontSize: "1.2rem",
          userSelect: "none",
        }}
      >
        + Add New Product
      </div>

      
      <div className="controls">
        <div>
          <label>Filter by status:</label>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label>View products by category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Categories</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">None</option>
            <option value="name">Name</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
          </select>
        </div>
      </div>


      <div className="table-wrapper">
        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              {/* <th>Detail</th> */}
              <th>Image</th>
              <th>Category</th>
              <th>Old Price</th>
              <th>New Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((prod) => (
                <tr key={prod.id}>
                  <td>{prod.id}</td>
                  <td>
                    {editingProduct === prod.id ? (
                      <input
                        type="text"
                        name="name"
                        value={editValues.name}
                        onChange={handleEditChange}
                      />
                    ) : (
                      prod.name
                    )}
                  </td>
                  {/* <td>
                    {editingProduct === prod.id ? (
                      <textarea
                        name="detail"
                        value={editValues.detail}
                        onChange={handleEditChange}
                      />
                    ) : (
                      prod.detail
                    )}
                  </td> */}
                  <td>
                    {editingProduct === prod.id ? (
                      <input
                        type="text"
                        name="image"
                        value={editValues.image}
                        onChange={handleEditChange}
                      />
                    ) : prod.image ? (
                      <img
                        src={prod.image}
                        alt={prod.name}
                        style={{ width: "50px" }}
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    {editingProduct === prod.id ? (
                      <input
                        type="text"
                        name="category"
                        value={editValues.category}
                        onChange={handleEditChange}
                      />
                    ) : (
                      prod.category
                    )}
                  </td>
                  <td>
                    {editingProduct === prod.id ? (
                      <input
                        type="number"
                        name="old_price"
                        value={editValues.old_price}
                        onChange={handleEditChange}
                      />
                    ) : (
                      `₹${prod.old_price || 0}`
                    )}
                  </td>
                  <td>
                    {editingProduct === prod.id ? (
                      <input
                        type="number"
                        name="new_price"
                        value={editValues.new_price}
                        onChange={handleEditChange}
                      />
                    ) : (
                      `₹${prod.new_price}`
                    )}
                  </td>
                  <td>
                    {editingProduct === prod.id ? (
                      <select
                        name="status"
                        value={editValues.status}
                        onChange={handleEditChange}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    ) : prod.status === "inactive" ? (
                      <span className="inactive">Inactive</span>
                    ) : (
                      <span className="active">Active</span>
                    )}
                  </td>
                  <td className="actions">
                    {editingProduct === prod.id ? (
                      <>
                        <button
                          className="save-btn"
                          onClick={() => saveEdit(prod.id)}
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
                          onClick={() => handleEditClick(prod)}
                        >
                          Edit
                        </button>
                        {prod.status === "active" ? (
                          <button
                            className="delete-btn"
                            onClick={() => softDeleteProduct(prod.id)}
                          >
                            Delete
                          </button>
                        ) : (
                          <button
                            className="reactivate-btn"
                            onClick={() => reactivateProduct(prod.id)}
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
                <td colSpan="9" className="no-products">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={currentPage === page ? "active-page" : ""}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ManageProducts;
