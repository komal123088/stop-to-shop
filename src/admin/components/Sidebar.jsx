import { NavLink, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext.jsx";
import "./Sidebar.css";

const navItems = [
  { label: "Main", type: "section" },
  { to: "/admin/dashboard", icon: "bi-speedometer2", text: "Dashboard" },
  { label: "Catalog", type: "section" },
  { to: "/admin/products", icon: "bi-box-seam", text: "Products" },
  { to: "/admin/categories", icon: "bi-grid-1x2", text: "Categories" },
  { label: "Sales", type: "section" },
  { to: "/admin/orders", icon: "bi-bag-check", text: "Orders" },
  { label: "People", type: "section" },
  { to: "/admin/users", icon: "bi-people", text: "Users" },
];

const Sidebar = ({ open, onClose }) => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <>
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar__brand">
          <h2>STOP & SHOP</h2>
          <span>Admin Panel</span>
        </div>

        <nav className="sidebar__nav">
          {navItems.map((item, i) =>
            item.type === "section" ? (
              <span className="nav-label" key={i}>
                {item.label}
              </span>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={onClose}
              >
                <i className={`bi ${item.icon}`}></i>
                {item.text}
              </NavLink>
            ),
          )}
        </nav>

        <div className="sidebar__bottom">
          <div
            style={{
              fontSize: "0.8rem",
              color: "#6B6358",
              marginBottom: "0.8rem",
            }}
          >
            <i
              className="bi bi-person-circle"
              style={{ marginRight: "0.5rem", color: "#D4AF37" }}
            ></i>
            {admin?.name}
          </div>
          <button className="sidebar__logout" onClick={handleLogout}>
            <i className="bi bi-box-arrow-left"></i>
            Logout
          </button>
        </div>
      </aside>
      <div
        className={`sidebar-overlay ${open ? "open" : ""}`}
        onClick={onClose}
      ></div>
    </>
  );
};

export default Sidebar;
