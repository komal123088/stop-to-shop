import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api.js";
import { PRODUCTS, CATEGORIES, ORDERS, USERS } from "../../api/apiEndpoints.js";
import "../components/AdminShared.css";
import "./AddEditProduct.css";
// categories
const CATEGORY_SPECS = {
  electronics: [
    "Brand",
    "Model",
    "Wattage",
    "Size",
    "Resolution",
    "Color",
    "Warranty",
  ],
  guns: [
    "Brand",
    "Caliber",
    "Type",
    "Barrel Length",
    "License Required",
    "Color",
  ],
  "cell-phones": [
    "Brand",
    "Model",
    "RAM",
    "ROM",
    "Color",
    "Battery",
    "Camera",
    "Network",
    "Screen Size",
    "OS",
  ],
  furniture: [
    "Material",
    "Color",
    "Dimensions",
    "Weight Capacity",
    "Assembly Required",
  ],
};

const emptySpec = () => ({ key: "", value: "" });

const AddEditProduct = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [subCats, setSubCats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [existingImgs, setExistingImgs] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    stock: "",
    category: "",
    subCategory: "",
    brand: "",
    isFeatured: false,
    isActive: true,
  });
  const [specs, setSpecs] = useState([emptySpec()]);

  // Load categories
  useEffect(() => {
    api.get(CATEGORIES.GET_ALL_ADMIN).then((r) => setCategories(r.data));
  }, []);

  // Load product if editing
  useEffect(() => {
    if (!isEdit) return;
    api.get(PRODUCTS.GET_BY_ID(id)).then(({ data }) => {
      setForm({
        name: data.name,
        description: data.description,
        price: data.price,
        discount: data.discount || "",
        stock: data.stock,
        category: data.category?._id || "",
        subCategory: data.subCategory || "",
        brand: data.brand || "",
        isFeatured: data.isFeatured,
        isActive: data.isActive,
      });
      setSpecs(data.specs?.length ? data.specs : [emptySpec()]);
      setExistingImgs(data.images || []);
      // set subcats
      const cat = categories.find((c) => c._id === data.category?._id);
      if (cat) setSubCats(cat.subCategories || []);
    });
  }, [id, categories.length]);

  // Update subcats on category change
  const handleCategoryChange = (catId) => {
    setForm((f) => ({ ...f, category: catId, subCategory: "" }));
    const cat = categories.find((c) => c._id === catId);
    setSubCats(cat?.subCategories || []);
    // Auto-fill spec keys based on category slug
    const slug = cat?.slug || "";
    const suggested = CATEGORY_SPECS[slug] || [];
    if (suggested.length)
      setSpecs(suggested.map((k) => ({ key: k, value: "" })));
  };

  // Image handlers
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewFiles((prev) => [...prev, ...files]);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...urls]);
  };

  const removeNewImage = (i) => {
    setNewFiles((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const removeExistingImage = (i) => {
    setExistingImgs((prev) => prev.filter((_, idx) => idx !== i));
  };

  // Spec handlers
  const addSpec = () => setSpecs((s) => [...s, emptySpec()]);
  const removeSpec = (i) => setSpecs((s) => s.filter((_, idx) => idx !== i));
  const updateSpec = (i, field, val) =>
    setSpecs((s) =>
      s.map((sp, idx) => (idx === i ? { ...sp, [field]: val } : sp)),
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("specs", JSON.stringify(specs.filter((s) => s.key)));
      newFiles.forEach((f) => fd.append("images", f));
      if (isEdit) fd.append("existingImages", JSON.stringify(existingImgs));

      if (isEdit)
        await api.put(PRODUCTS.UPDATE(id), fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      else
        await api.post(PRODUCTS.CREATE, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });

      setSuccess(isEdit ? "Product updated!" : "Product created!");
      setTimeout(() => navigate("/admin/products"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) =>
    setForm((f) => ({
      ...f,
      [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  return (
    <div className="product-form">
      <div className="admin-page__header">
        <span className="admin-page__title">
          {isEdit ? "Edit Product" : "Add New Product"}
        </span>
        <button
          className="btn-secondary"
          onClick={() => navigate("/admin/products")}
        >
          <i className="bi bi-arrow-left"></i> Back
        </button>
      </div>

      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="product-form__box">
          <h4>Basic Information</h4>
          <div className="form-group">
            <label>Product Name *</label>
            <input
              value={form.name}
              onChange={set("name")}
              required
              placeholder="e.g. Samsung Galaxy S24"
            />
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={form.description}
              onChange={set("description")}
              required
              placeholder="Product description..."
              rows={4}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Brand</label>
              <input
                value={form.brand}
                onChange={set("brand")}
                placeholder="e.g. Samsung"
              />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select
                value={form.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {subCats.length > 0 && (
            <div className="form-group">
              <label>Sub Category</label>
              <select value={form.subCategory} onChange={set("subCategory")}>
                <option value="">Select Sub Category</option>
                {subCats.map((s) => (
                  <option key={s.slug} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Pricing & Stock */}
        <div className="product-form__box">
          <h4>Pricing & Stock</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Price (ZAR) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={set("price")}
                required
                placeholder="0.00"
              />
            </div>
            <div className="form-group">
              <label>Discount (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.discount}
                onChange={set("discount")}
                placeholder="0"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Stock Quantity *</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={set("stock")}
                required
                placeholder="0"
              />
            </div>
            <div
              className="form-group"
              style={{
                justifyContent: "flex-end",
                paddingTop: "1.4rem",
                gap: "0.8rem",
              }}
            >
              <label className="form-check">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={set("isFeatured")}
                />
                Featured Product
              </label>
              <label className="form-check">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={set("isActive")}
                />
                Active (visible on site)
              </label>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="product-form__box">
          <h4>Product Images (max 5)</h4>
          <label className="image-upload-area">
            <i className="bi bi-cloud-upload"></i>
            <p>Click to upload images (JPG, PNG, WEBP — max 5MB each)</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
          <div className="image-previews">
            {existingImgs.map((img, i) => (
              <div className="image-preview-item" key={`ex-${i}`}>
                <img src={`${import.meta.env.VITE_API_URL}${img}`} alt="" />
                <button type="button" onClick={() => removeExistingImage(i)}>
                  ✕
                </button>
              </div>
            ))}
            {previews.map((url, i) => (
              <div className="image-preview-item" key={`new-${i}`}>
                <img src={url} alt="" />
                <button type="button" onClick={() => removeNewImage(i)}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Specs */}
        <div className="product-form__box">
          <h4>Specifications</h4>
          <div className="specs-list">
            {specs.map((sp, i) => (
              <div className="spec-row" key={i}>
                <input
                  placeholder="e.g. RAM"
                  value={sp.key}
                  onChange={(e) => updateSpec(i, "key", e.target.value)}
                />
                <input
                  placeholder="e.g. 8GB"
                  value={sp.value}
                  onChange={(e) => updateSpec(i, "value", e.target.value)}
                />
                <button
                  type="button"
                  className="btn-icon danger"
                  onClick={() => removeSpec(i)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="btn-add-spec" onClick={addSpec}>
            <i className="bi bi-plus"></i> Add Spec
          </button>
        </div>

        <div className="product-form__actions">
          <button className="btn-gold" type="submit" disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/admin/products")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditProduct;
