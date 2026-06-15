import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/api.js";
import { PRODUCTS, CATEGORIES } from "../api/apiEndpoints.js";
import ProductCard, { SkeletonCard } from "../components/ProductCard.jsx";
import "./Shop.css";

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low–High", value: "price_asc" },
  { label: "Price: High–Low", value: "price_desc" },
  { label: "Name: A–Z", value: "name_asc" },
];

const LIMIT = 9;

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCats, setSubCats] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [priceInput, setPriceInput] = useState({ min: "", max: "" });

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    subCategory: searchParams.get("subCategory") || "",
    search: searchParams.get("search") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "newest",
    page: Number(searchParams.get("page")) || 1,
  });

  // Load categories
  useEffect(() => {
    api.get(CATEGORIES.GET_ALL_PUBLIC).then((r) => setCategories(r.data));
  }, []);

  // Update subcats on category change
  useEffect(() => {
    const cat = categories.find((c) => c._id === filters.category);
    setSubCats(cat?.subCategories || []);
  }, [filters.category, categories]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: filters.page, limit: LIMIT });
      if (filters.category) params.append("category", filters.category);
      if (filters.subCategory)
        params.append("subCategory", filters.subCategory);
      if (filters.search) params.append("search", filters.search);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      if (filters.sort === "price_asc") {
        params.append("sortBy", "price");
        params.append("order", "asc");
      }
      if (filters.sort === "price_desc") {
        params.append("sortBy", "price");
        params.append("order", "desc");
      }
      if (filters.sort === "name_asc") {
        params.append("sortBy", "name");
        params.append("order", "asc");
      }

      const { data } = await api.get(`${PRODUCTS.GET_PUBLIC}?${params}`);
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Sync to URL
  useEffect(() => {
    const p = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v) p[k] = v;
    });
    setSearchParams(p, { replace: true });
  }, [filters]);

  const setFilter = (key, value) =>
    setFilters((f) => ({ ...f, [key]: value, page: 1 }));

  const clearAll = () => {
    setFilters({
      category: "",
      subCategory: "",
      search: "",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
      page: 1,
    });
    setPriceInput({ min: "", max: "" });
  };

  const applyPrice = () =>
    setFilters((f) => ({
      ...f,
      minPrice: priceInput.min,
      maxPrice: priceInput.max,
      page: 1,
    }));

  const activeCatName =
    categories.find((c) => c._id === filters.category)?.name || "All Products";

  return (
    <div className="shop-page">
      {/* Banner */}
      <div className="shop-banner">
        <div>
          <h1>
            <span className="accent">{activeCatName}</span>
            {filters.search && <> — "{filters.search}"</>}
          </h1>
          <p>
            {total} product{total !== 1 ? "s" : ""} available
          </p>
        </div>
      </div>

      <div className="shop-body">
        {/* Sidebar */}
        <aside className={`shop-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-header">
            <h3>
              <i className="bi bi-funnel" style={{ marginRight: "0.4rem" }}></i>
              Filters
            </h3>
            <button className="sidebar-clear" onClick={clearAll}>
              Clear All
            </button>
          </div>

          {/* Category */}
          <div className="filter-block">
            <h4>Category</h4>
            <label
              className={`filter-option ${!filters.category ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="cat"
                checked={!filters.category}
                onChange={() => setFilter("category", "")}
                readOnly
              />
              All Categories
            </label>
            {categories.map((cat) => (
              <label
                key={cat._id}
                className={`filter-option ${filters.category === cat._id ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="cat"
                  checked={filters.category === cat._id}
                  onChange={() => setFilter("category", cat._id)}
                  readOnly
                />
                <i className={`bi ${cat.icon}`}></i>
                {cat.name}
              </label>
            ))}
          </div>

          {/* Subcategory */}
          {subCats.length > 0 && (
            <div className="filter-block">
              <h4>Sub Category</h4>
              <label
                className={`filter-option ${!filters.subCategory ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="sub"
                  checked={!filters.subCategory}
                  onChange={() => setFilter("subCategory", "")}
                  readOnly
                />
                All
              </label>
              {subCats.map((s) => (
                <label
                  key={s.slug}
                  className={`filter-option ${filters.subCategory === s.name ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="sub"
                    checked={filters.subCategory === s.name}
                    onChange={() => setFilter("subCategory", s.name)}
                    readOnly
                  />
                  {s.name}
                </label>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="filter-block">
            <h4>Price Range (ZAR)</h4>
            <div className="price-row">
              <input
                type="number"
                placeholder="Min"
                value={priceInput.min}
                onChange={(e) =>
                  setPriceInput((p) => ({ ...p, min: e.target.value }))
                }
              />
              <input
                type="number"
                placeholder="Max"
                value={priceInput.max}
                onChange={(e) =>
                  setPriceInput((p) => ({ ...p, max: e.target.value }))
                }
              />
            </div>
            <button className="price-apply" onClick={applyPrice}>
              Apply Price
            </button>
          </div>
        </aside>

        {/* Overlay mobile */}
        <div
          className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
          onClick={() => setSidebarOpen(false)}
        ></div>

        {/* Main Content */}
        <div className="shop-content">
          {/* Topbar */}
          <div className="shop-topbar">
            <button
              className="mobile-filter-btn"
              onClick={() => setSidebarOpen(true)}
            >
              <i className="bi bi-funnel"></i> Filters
            </button>

            <div className="shop-search-box">
              <i className="bi bi-search"></i>
              <input
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => setFilter("search", e.target.value)}
              />
            </div>

            <div className="topbar-right">
              <span className="shop-result-count">{total} items</span>
              <select
                className="shop-sort"
                value={filters.sort}
                onChange={(e) => setFilter("sort", e.target.value)}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="shop-grid">
            {loading ? (
              [...Array(LIMIT)].map((_, i) => <SkeletonCard key={i} />)
            ) : products.length === 0 ? (
              <div className="shop-empty">
                <i className="bi bi-search"></i>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search</p>
              </div>
            ) : (
              products.map((p) => <ProductCard key={p._id} product={p} />)
            )}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="shop-pagination">
              <button
                onClick={() => setFilter("page", filters.page - 1)}
                disabled={filters.page === 1}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              {[...Array(pages)].map((_, i) => (
                <button
                  key={i}
                  className={filters.page === i + 1 ? "pg-active" : ""}
                  onClick={() => setFilter("page", i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setFilter("page", filters.page + 1)}
                disabled={filters.page === pages}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
