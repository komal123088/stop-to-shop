import { useEffect, useState } from "react";
import api from "../../api/api.js";
import { PRODUCTS, CATEGORIES, ORDERS, USERS } from "../../api/apiEndpoints.js";
import "../components/AdminShared.css";

const STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (filter) params.append("status", filter);
      const { data } = await api.get(`${ORDERS.GET_ALL_ADMIN}?${params}`);
      setOrders(data.orders);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [page, filter]);

  const updateStatus = async (orderId, orderStatus) => {
    await api.put(ORDERS.UPDATE_STATUS(orderId), { orderStatus });
    fetch();
    setSelected(null);
  };

  return (
    <div>
      <div className="admin-page__header">
        <span className="admin-page__title">Orders ({total})</span>
      </div>

      <div className="admin-page__filters">
        <select
          className="filter-select"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s} style={{ textTransform: "capitalize" }}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div className="table-empty">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="table-empty">No orders found</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td style={{ fontFamily: "monospace", fontSize: "0.78rem" }}>
                    #{o._id.slice(-6).toUpperCase()}
                  </td>
                  <td>{o.user?.name || "N/A"}</td>
                  <td>{o.items?.length}</td>
                  <td>R {o.total?.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${o.paymentStatus}`}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${o.orderStatus}`}>
                      {o.orderStatus}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.8rem", color: "#6B6358" }}>
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button className="btn-icon" onClick={() => setSelected(o)}>
                      <i className="bi bi-eye"></i>
                    </button>
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

      {/* Order Detail Modal */}
      {selected && (
        <div
          className="confirm-modal-overlay"
          onClick={() => setSelected(null)}
        >
          <div
            className="confirm-modal"
            style={{ maxWidth: 540, textAlign: "left" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: "1rem" }}>
              Order #{selected._id.slice(-6).toUpperCase()}
            </h3>
            <div
              style={{
                fontSize: "0.85rem",
                color: "#ADADAD",
                marginBottom: "1rem",
              }}
            >
              <p>
                <b style={{ color: "#F8F6F1" }}>Customer:</b>{" "}
                {selected.user?.name}
              </p>
              <p>
                <b style={{ color: "#F8F6F1" }}>Email:</b>{" "}
                {selected.user?.email}
              </p>
              <p>
                <b style={{ color: "#F8F6F1" }}>Total:</b> R{" "}
                {selected.total?.toLocaleString()}
              </p>
              <p>
                <b style={{ color: "#F8F6F1" }}>Payment:</b>{" "}
                {selected.paymentMethod} —{" "}
                <span className={`badge ${selected.paymentStatus}`}>
                  {selected.paymentStatus}
                </span>
              </p>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <p
                style={{
                  fontSize: "0.78rem",
                  color: "#6B6358",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "0.5rem",
                }}
              >
                Items
              </p>
              {selected.items?.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.88rem",
                    padding: "0.4rem 0",
                    borderBottom: "1px solid #1E1E1E",
                    color: "#ADADAD",
                  }}
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>R {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="form-group">
              <label
                style={{
                  fontSize: "0.78rem",
                  color: "#6B6358",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Update Status
              </label>
              <select
                className="filter-select"
                defaultValue={selected.orderStatus}
                onChange={(e) => updateStatus(selected._id, e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ textAlign: "right", marginTop: "1rem" }}>
              <button className="btn-cancel" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
