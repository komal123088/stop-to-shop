import "./Landing.css";
import boss from "../assets/img/maqsood.jpg";
const categories = [
  {
    name: "Electronics",
    icon: "bi-tv",
    desc: "TVs, speakers, amplifiers, microwaves & cameras",
  },
  {
    name: "Guns",
    icon: "bi-crosshair",
    desc: "Licensed firearms & accessories",
  },
  {
    name: "Cell Phones",
    icon: "bi-phone",
    desc: "Brand new phones, cases, chargers & adaptors",
  },
  {
    name: "Furniture",
    icon: "bi-house-door",
    desc: "Quality furniture for every room",
  },
];

const Landing = () => {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-glow"></div>
        <div className="hero-grid"></div>

        <div className="hero-content">
          {/* <span
            className="hero-eyebrow fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            South Africa's Premium Marketplace
          </span> */}
          <h1 className="fade-up" style={{ animationDelay: "0.25s" }}>
            Everything You Need.
            <br />
            <span className="accent">All In One Place.</span>
          </h1>
          <p className="hero-sub fade-up" style={{ animationDelay: "0.4s" }}>
            Electronics &mdash; Guns &mdash; Cell Phones &mdash; Furniture
          </p>
          <div
            className="hero-buttons fade-up"
            style={{ animationDelay: "0.55s" }}
          >
            <button className="cta-btn">
              Shop Now <i className="bi bi-arrow-right"></i>
            </button>
            <button className="outline-btn">View Catalog</button>
          </div>
        </div>

        <div
          className="hero-scroll-indicator fade-up"
          style={{ animationDelay: "0.8s" }}
        >
          <i className="bi bi-chevron-down"></i>
        </div>
      </section>

      {/* Categories */}
      <section className="categories" id="categories">
        <span className="eyebrow fade-up">What We Offer</span>
        <h2 className="fade-up" style={{ animationDelay: "0.1s" }}>
          Shop By Category
        </h2>
        <p className="section-sub fade-up" style={{ animationDelay: "0.2s" }}>
          Curated collections across every department
        </p>
        <div className="category-grid">
          {categories.map((cat, i) => (
            <div
              className="category-card fade-up"
              style={{ animationDelay: `${0.3 + i * 0.12}s` }}
              key={cat.name}
            >
              <div className="category-icon">
                <i className={`bi ${cat.icon}`}></i>
              </div>
              <h3>{cat.name}</h3>
              <p>{cat.desc}</p>
              <a href="#" className="category-link">
                Explore <i className="bi bi-arrow-right"></i>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="about" id="about">
        <div className="about-bg-shape"></div>
        <div className="about-content">
          <span className="eyebrow fade-up">Our Story</span>
          <h2 className="fade-up" style={{ animationDelay: "0.1s" }}>
            About Stop & Shop
          </h2>
          <p className="fade-up" style={{ animationDelay: "0.2s" }}>
            Stop & Shop is South Africa's trusted destination for premium
            electronics, licensed firearms, the latest mobile devices, and
            quality furniture &mdash; all under one roof. We pride ourselves on
            authenticity, fast delivery, and a shopping experience that feels as
            good as the products we sell.
          </p>
          <div className="about-stats">
            <div className="stat fade-up" style={{ animationDelay: "0.3s" }}>
              <h3>500+</h3>
              <p>Products Listed</p>
            </div>
            <div className="stat fade-up" style={{ animationDelay: "0.42s" }}>
              <h3>10K+</h3>
              <p>Happy Customers</p>
            </div>
            <div className="stat fade-up" style={{ animationDelay: "0.54s" }}>
              <h3>4</h3>
              <p>Major Categories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="founder" id="founder">
        <div className="founder-wrap">
          <div className="founder-photo-wrap fade-up">
            <div className="founder-photo">
              <img src={boss} alt="Founder of Stop and Shop" />
            </div>
            <div className="founder-ring"></div>
            <div className="founder-ring founder-ring-2"></div>
          </div>

          <div
            className="founder-info fade-up"
            style={{ animationDelay: "0.15s" }}
          >
            <span className="eyebrow">Meet The Founder</span>
            <h2>Maqsood Ahmad</h2>
            <p className="founder-role">Founder &amp; CEO, Stop &amp; Shop</p>

            <p className="founder-bio">
              With over a decade of experience in retail and e-commerce, Founder
              Name built Stop & Shop from the ground up &mdash; turning a single
              idea into South Africa's go-to marketplace for electronics, mobile
              devices, furniture, and licensed firearms.
            </p>

            <div className="founder-stats">
              <div className="founder-stat">
                <h3>12+</h3>
                <p>Years Experience</p>
              </div>
              <div className="founder-stat">
                <h3>3</h3>
                <p>Businesses Founded</p>
              </div>
              <div className="founder-stat">
                <h3>10K+</h3>
                <p>Customers Served</p>
              </div>
            </div>

            <div className="founder-socials">
              <a href="#" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" aria-label="Email">
                <i className="bi bi-envelope"></i>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Landing;
