import { useEffect, useState } from "react";
import api from "../../api/api.js";
import { PRODUCTS, CATEGORIES, ORDERS, USERS } from "../../api/apiEndpoints.js";
import "../components/AdminShared.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`${USERS.GET_ALL}?page=${page}&limit=15`);
      setUsers(data.users);
      setTotal(data.total);
      setPages(Math.ceil(data.total / 15));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [page]);

  const toggleActive = async (user) => {
    await api.put(USERS.UPDATE(user._id), { isActive: !user.isActive });
    fetch();
  };

  const handleDelete = async () => {
    await api.delete(USERS.DELETE(deleteId));
    setDeleteId(null);
    fetch();
  };

  return (
    <div>
      <div className="admin-page__header">
        <span className="admin-page__title">Users ({total})</span>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div className="table-empty">Loading...</div>
        ) : users.length === 0 ? (
          <div className="table-empty">No users found</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td style={{ color: "#6B6358" }}>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role}`}>{u.role}</span>
                  </td>
                  <td>
                    <span
                      className={`badge ${u.isActive ? "active" : "inactive"}`}
                    >
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.8rem", color: "#6B6358" }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="btn-icon"
                        title={u.isActive ? "Deactivate" : "Activate"}
                        onClick={() => toggleActive(u)}
                      >
                        <i
                          className={`bi ${u.isActive ? "bi-toggle-on" : "bi-toggle-off"}`}
                        ></i>
                      </button>
                      <button
                        className="btn-icon danger"
                        onClick={() => setDeleteId(u._id)}
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
            <h3>Delete User?</h3>
            <p>This will permanently remove the user and their data.</p>
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

export default Users;
