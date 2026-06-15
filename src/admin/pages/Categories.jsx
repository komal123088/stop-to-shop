import { useEffect, useState } from "react";
import api from "../../api/api.js";
import { PRODUCTS, CATEGORIES, ORDERS, USERS } from "../../api/apiEndpoints.js";
import "../components/AdminShared.css";
import "./AddEditProduct.css";

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const emptyForm = {
  name: "",
  icon: "bi-grid",
  description: "",
  subCategories: [""],
};

const Categories = () => {
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetch = async () => {
    const { data } = await api.get(CATEGORIES.GET_ALL_ADMIN);
    setCats(data);
  };
  useEffect(() => {
    fetch();
  }, []);

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setError("");
    setShowForm(true);
  };
  const openEdit = (cat) => {
    setForm({
      name: cat.name,
      icon: cat.icon || "bi-grid",
      description: cat.description || "",
      subCategories: cat.subCategories?.map((s) => s.name) || [""],
    });
    setEditId(cat._id);
    setError("");
    setShowForm(true);
  };

  const addSubCat = () =>
    setForm((f) => ({ ...f, subCategories: [...f.subCategories, ""] }));
  const removeSubCat = (i) =>
    setForm((f) => ({
      ...f,
      subCategories: f.subCategories.filter((_, idx) => idx !== i),
    }));
  const updateSubCat = (i, val) =>
    setForm((f) => ({
      ...f,
      subCategories: f.subCategories.map((s, idx) => (idx === i ? val : s)),
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        subCategories: form.subCategories.filter((s) => s.trim()),
      };
      if (editId) await api.put(CATEGORIES.UPDATE(editId), payload);
      else await api.post(CATEGORIES.CREATE, payload);
      setShowForm(false);
      fetch();
    } catch (err) {
      setError(err.response?.data?.message || "Error saving category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    await api.delete(CATEGORIES.DELETE(deleteId));
    setDeleteId(null);
    fetch();
  };

  const iconOptions = [
    "bi-tv",
    "bi-crosshair",
    "bi-phone",
    "bi-house-door",
    "bi-grid",
    "bi-bag",
    "bi-laptop",
    "bi-headphones",
  ];

  return (
    <div>
      <div className="admin-page__header">
        <span className="admin-page__title">Categories ({cats.length})</span>
        <button className="btn-gold" onClick={openAdd}>
          <i className="bi bi-plus-lg"></i> Add Category
        </button>
      </div>

      <div className="admin-table-wrap">
        {cats.length === 0 ? (
          <div className="table-empty">No categories yet</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Icon</th>
                <th>Name</th>
                <th>Sub Categories</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cats.map((cat) => (
                <tr key={cat._id}>
                  <td>
                    <i
                      className={`bi ${cat.icon}`}
                      style={{ fontSize: "1.3rem", color: "#D4AF37" }}
                    ></i>
                  </td>
                  <td>{cat.name}</td>
                  <td style={{ color: "#6B6358", fontSize: "0.82rem" }}>
                    {cat.subCategories?.map((s) => s.name).join(", ") || "—"}
                  </td>
                  <td>
                    <span
                      className={`badge ${cat.isActive ? "active" : "inactive"}`}
                    >
                      {cat.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="btn-icon"
                        onClick={() => openEdit(cat)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn-icon danger"
                        onClick={() => setDeleteId(cat._id)}
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

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="confirm-modal-overlay">
          <div
            className="confirm-modal"
            style={{ maxWidth: 520, textAlign: "left" }}
          >
            <h3 style={{ marginBottom: "1.2rem" }}>
              {editId ? "Edit Category" : "Add Category"}
            </h3>
            {error && <div className="form-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category Name *</label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Icon (Bootstrap Icon class)</label>
                <select
                  value={form.icon}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, icon: e.target.value }))
                  }
                >
                  {iconOptions.map((ic) => (
                    <option key={ic} value={ic}>
                      {ic}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label>Sub Categories</label>
                <div className="specs-list">
                  {form.subCategories.map((s, i) => (
                    <div
                      className="spec-row"
                      key={i}
                      style={{ gridTemplateColumns: "1fr auto" }}
                    >
                      <input
                        value={s}
                        onChange={(e) => updateSubCat(i, e.target.value)}
                        placeholder={`Sub category ${i + 1}`}
                      />
                      <button
                        type="button"
                        className="btn-icon danger"
                        onClick={() => removeSubCat(i)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="btn-add-spec"
                  onClick={addSubCat}
                  style={{ marginTop: "0.5rem" }}
                >
                  <i className="bi bi-plus"></i> Add Sub Category
                </button>
              </div>
              <div
                className="confirm-modal__btns"
                style={{ justifyContent: "flex-end", marginTop: "1.2rem" }}
              >
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-gold" disabled={loading}>
                  {loading ? "Saving..." : editId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <h3>Delete Category?</h3>
            <p>All products in this category may be affected.</p>
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

export default Categories;
