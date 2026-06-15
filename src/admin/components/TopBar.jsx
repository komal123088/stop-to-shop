import "./TopBar.css";

const TopBar = ({ title, onMenuClick }) => {
  return (
    <header className="topbar">
      <div className="topbar__left">
        <button className="topbar__menu-btn" onClick={onMenuClick}>
          <i className="bi bi-list"></i>
        </button>
        <span className="topbar__title">{title}</span>
      </div>
      <div className="topbar__right">
        <span className="topbar__badge">
          <i
            className="bi bi-shield-check"
            style={{ marginRight: "0.3rem" }}
          ></i>
          Admin
        </span>
      </div>
    </header>
  );
};

export default TopBar;
