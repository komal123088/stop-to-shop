import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const salePrice = product.discount
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : null;

  return (
    <div className="product-card">
      {/* Image */}
      <div className="product-card__img-wrap">
        {product.images?.[0] ? (
          <img
            src={`${API_URL}${product.images[0]}`}
            alt={product.name}
            loading="lazy"
          />
        ) : (
          <div className="product-card__no-img">
            <i className="bi bi-image"></i>
          </div>
        )}

        {product.discount > 0 && (
          <span className="product-card__discount">-{product.discount}%</span>
        )}
        {product.stock === 0 && (
          <span className="product-card__out">Out of Stock</span>
        )}

        <div className="product-card__overlay">
          <button
            className="product-card__quick"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            <i className="bi bi-eye"></i> Quick View
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="product-card__info">
        {product.brand && (
          <span className="product-card__brand">{product.brand}</span>
        )}
        <h3 className="product-card__name">{product.name}</h3>
        {product.subCategory && (
          <span className="product-card__sub">{product.subCategory}</span>
        )}
        <div className="product-card__prices">
          <span className="product-card__sale">
            R{" "}
            {salePrice
              ? Number(salePrice).toLocaleString()
              : product.price?.toLocaleString()}
          </span>
          {salePrice && (
            <span className="product-card__original">
              R {product.price?.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Button */}
      <div className="product-card__footer">
        <button
          className="product-card__btn"
          disabled={product.stock === 0}
          onClick={() => navigate(`/product/${product._id}`)}
        >
          <i className="bi bi-cart-plus"></i>
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-img"></div>
    <div className="skeleton skeleton-line long"></div>
    <div className="skeleton skeleton-line short"></div>
    <div className="skeleton skeleton-line long"></div>
    <div className="skeleton skeleton-btn"></div>
  </div>
);

export default ProductCard;
