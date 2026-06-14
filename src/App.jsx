import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import IntroAnimation from "./components/IntroAnimation";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import useScrollReveal from "./hooks/useScrollReveal";
import "./styles/theme.css";

const AppContent = () => {
  const [showIntro, setShowIntro] = useState(true);
  useScrollReveal();

  if (showIntro) {
    return <IntroAnimation onFinish={() => setShowIntro(false)} />;
  }

  return (
    <div className="app">
      <Navbar />
      <Landing />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
