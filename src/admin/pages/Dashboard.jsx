import { useEffect, useState } from "react";
import api from "../../api/api.js";
import { PRODUCTS, CATEGORIES, ORDERS, USERS } from "../../api/apiEndpoints.js";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({ products: {}, orders: {}, users: {} });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [p, o, u, recentOrders] = await Promise.all([
          api.get(PRODUCTS.GET_STATS),
          api.get(ORDERS.GET_STATS),
          api.get(USERS.GET_STATS),
          api.get(`${ORDERS.GET_ALL_ADMIN}?limit=5`),
        ]);
        setStats({ products: p.data, orders: o.data, users: u.data });
        setOrders(recentOrders.data.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const statCards = [
    {
      icon: "bi-box-seam",
      label: "Total Products",
      value: stats.products.total || 0,
    },
    {
      icon: "bi-bag-check",
      label: "Total Orders",
      value: stats.orders.total || 0,
    },
    { icon: "bi-people", label: "Total Users", value: stats.users.total || 0 },
    {
      icon: "bi-cash-stack",
      label: "Revenue (ZAR)",
      value: `R ${(stats.orders.revenue || 0).toLocaleString()}`,
    },
    {
      icon: "bi-clock-history",
      label: "Pending Orders",
      value: stats.orders.pending || 0,
    },
    {
      icon: "bi-exclamation-triangle",
      label: "Out of Stock",
      value: stats.products.outOfStock || 0,
    },
  ];

  if (loading)
    return <div style={{ color: "#6B6358", padding: "2rem" }}>Loading...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard__stats">
        {statCards.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-card__icon">
              <i className={`bi ${s.icon}`}></i>
            </div>
            <div className="stat-card__info">
              <h3>{s.value}</h3>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard__grid">
        <div className="dash-box">
          <h4>Recent Orders</h4>
          {orders.length === 0 ? (
            <div className="dash-empty">No orders yet</div>
          ) : (
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td>{o.user?.name || "N/A"}</td>
                    <td>R {o.total?.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${o.orderStatus}`}>
                        {o.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="dash-box">
          <h4>Quick Stats</h4>
          <table className="dash-table">
            <tbody>
              <tr>
                <td>Active Products</td>
                <td>{stats.products.active || 0}</td>
              </tr>
              <tr>
                <td>Featured Products</td>
                <td>{stats.products.featured || 0}</td>
              </tr>
              <tr>
                <td>Active Users</td>
                <td>{stats.users.active || 0}</td>
              </tr>
              <tr>
                <td>Admin Users</td>
                <td>{stats.users.admins || 0}</td>
              </tr>
              <tr>
                <td>Delivered Orders</td>
                <td>{stats.orders.delivered || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
