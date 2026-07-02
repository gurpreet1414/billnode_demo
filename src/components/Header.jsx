"use client";
import { useState, useEffect } from "react";

export default function Header() {
  const [calendlyUrl, setCalendlyUrl] = useState("https://calendly.com/billnode-demo/30min");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    setCalendlyUrl(`https://calendly.com/billnode-demo/30min?month=${y}-${m}`);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`nav ${isMenuOpen ? "is-open" : ""}`} id="nav">
      <a href="/" className="nav__logo" data-magnetic onClick={closeMenu}>
        BillNode<span>®</span>
      </a>
      <nav className="nav__links">
        <a href="/features" data-cursor>Features</a>
        <a href="/#inside" data-cursor>Product</a>
        <a href="/#process" data-cursor>How it Works</a>
        <a href="/pricing" data-cursor>Pricing</a>
        <a href="/contact" data-cursor>Contact</a>
      </nav>

      <div className="nav__actions">
        <a href={calendlyUrl} target="_blank" rel="noopener noreferrer" className="nav__cta btn btn--dark" data-magnetic data-cursor>
          <span>Schedule demo</span><i className="arr">↗</i>
        </a>
        <button
          className={`nav__toggle ${isMenuOpen ? "is-active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle Menu"
          data-cursor
        >
          <span className="nav__toggle-line"></span>
          <span className="nav__toggle-line"></span>
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <div className={`nav__drawer ${isMenuOpen ? "is-open" : ""}`}>
        <nav className="nav__drawer-links">
          <a href="/features" onClick={closeMenu} data-cursor><span className="nav__drawer-num">01</span>Features</a>
          <a href="/#inside" onClick={closeMenu} data-cursor><span className="nav__drawer-num">02</span>Product</a>
          <a href="/#process" onClick={closeMenu} data-cursor><span className="nav__drawer-num">03</span>How it Works</a>
          <a href="/pricing" onClick={closeMenu} data-cursor><span className="nav__drawer-num">04</span>Pricing</a>
          <a href="/contact" onClick={closeMenu} data-cursor><span className="nav__drawer-num">05</span>Contact</a>
        </nav>
        <div className="nav__drawer-footer">
          <div className="nav__drawer-socials">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" data-cursor>Twitter</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" data-cursor>LinkedIn</a>
            <a href="mailto:hello@billnode.com" data-cursor>Email</a>
          </div>
          <p>© {new Date().getFullYear()} BillNode. All rights reserved.</p>
        </div>
      </div>
    </header>
  );
}
