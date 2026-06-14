import { useState, useEffect } from "react";
import "./IntroAnimation.css";

const CubeFaces = () => (
  <>
    <div className="cube-face front"></div>
    <div className="cube-face back"></div>
    <div className="cube-face right"></div>
    <div className="cube-face left"></div>
    <div className="cube-face top"></div>
    <div className="cube-face bottom"></div>
  </>
);

const IntroAnimation = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onFinish, 800);
    }, 5200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  const text = "STOP & SHOP";

  return (
    <div className={`intro-screen ${!visible ? "fade-out" : ""}`}>
      <div className="shape-field">
        {/* <div className="shape ring ring-1"></div>
        <div className="shape ring ring-2"></div> */}

        <div className="shape cube cube-1">
          <CubeFaces />
        </div>

        <div className="shape cube cube-2">
          <CubeFaces />
        </div>

        <div className="shape chain">
          <div className="chain-link"></div>
          <div className="chain-link"></div>
          <div className="chain-link"></div>
          <div className="chain-link"></div>
        </div>
      </div>

      <h1 className="intro-title">
        {text.split("").map((char, i) => (
          <span
            key={i}
            className="intro-letter"
            style={{ animationDelay: `${0.08 * i}s` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>
      <div className="intro-underline"></div>
      <p className="intro-tagline">Luxury. Tech. Everything.</p>
    </div>
  );
};

export default IntroAnimation;
