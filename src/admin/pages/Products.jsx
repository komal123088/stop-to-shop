import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api.js";
import { PRODUCTS, CATEGORIES, ORDERS, USERS } from "../../api/apiEndpoints.js";
import "../components/AdminShared.css";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (search) params.append("search", search);
      if (catFilter) params.append("category", catFilter);
      const { data } = await api.get(`${PRODUCTS.GET_ALL_ADMIN}?${params}`);
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, catFilter]);
  useEffect(() => {
    api.get(CATEGORIES.GET_ALL_ADMIN).then((r) => setCategories(r.data));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleDelete = async () => {
    try {
      await api.delete(PRODUCTS.DELETE(deleteId));
      setDeleteId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="admin-page__header">
        <span className="admin-page__title">Products ({total})</span>
        <button
          className="btn-gold"
          onClick={() => navigate("/admin/products/add")}
        >
          <i className="bi bi-plus-lg"></i> Add Product
        </button>
      </div>

      <div className="admin-page__filters">
        <form
          onSubmit={handleSearch}
          style={{ display: "flex", gap: "0.8rem" }}
        >
          <input
            className="filter-input"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn-gold" type="submit">
            Search
          </button>
        </form>
        <select
          className="filter-select"
          value={catFilter}
          onChange={(e) => {
            setCatFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div className="table-empty">Loading...</div>
        ) : products.length === 0 ? (
          <div className="table-empty">No products found</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img
                      src={
                        p.images?.[0]
                          ? `${import.meta.env.VITE_API_URL}${p.images[0]}`
                          : "/placeholder.png"
                      }
                      alt={p.name}
                      className="product-thumb"
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>{p.category?.name || "—"}</td>
                  <td>R {p.price?.toLocaleString()}</td>
                  <td>{p.discount ? `${p.discount}%` : "—"}</td>
                  <td style={{ color: p.stock === 0 ? "#ff6b7a" : "#ADADAD" }}>
                    {p.stock}
                  </td>
                  <td>
                    <span
                      className={`badge ${p.isActive ? "active" : "inactive"}`}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="btn-icon"
                        onClick={() =>
                          navigate(`/admin/products/edit/${p._id}`)
                        }
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn-icon danger"
                        onClick={() => setDeleteId(p._id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pages > 1 && (
        <div className="pagination">
          <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
            Prev
          </button>
          {[...Array(pages)].map((_, i) => (
            <button
              key={i}
              className={page === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === pages}
          >
            Next
          </button>
        </div>
      )}

      {deleteId && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <h3>Delete Product?</h3>
            <p>This action cannot be undone.</p>
            <div className="confirm-modal__btns">
              <button className="btn-cancel" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button className="btn-delete" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
