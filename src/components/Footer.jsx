import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="logo-group">
            {/* <img src="/logo1.png" alt="Stop and Shop Logo" className="logo" /> */}
            <span className="brand">STOP & SHOP</span>
          </div>
          <p>Your one-stop premium shopping destination in South Africa.</p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <a href="#categories">Categories</a>
          <a href="#about">About</a>
          <a href="#founder">Founder</a>
        </div>
        <div className="footer-links">
          <h4>Categories</h4>
          <a href="#">Electronics</a>
          <a href="#">Guns</a>
          <a href="#">Cell Phones</a>
          <a href="#">Furniture</a>
        </div>
        <div className="footer-contact">
          <h4>Contact</h4>
          <p>
            <i className="bi bi-geo-alt"></i> Beaufort west ok foods
          </p>
          <p>
            <i className="bi bi-envelope"></i> info@stopandshop.co.za
          </p>
          <p>
            <i className="bi bi-telephone"></i> +27 60 911 9274
          </p>
          <div className="footer-socials">
            <a href="#" aria-label="Facebook">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#" aria-label="Instagram">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="#" aria-label="WhatsApp">
              <i className="bi bi-whatsapp"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Stop & Shop. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
