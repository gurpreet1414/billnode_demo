"use client";
import { useState, useEffect } from "react";

export default function Footer() {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const tick = () => {
      try {
        setTime(
          new Date().toLocaleTimeString("en-GB", {
            timeZone: "Europe/Lisbon",
            hour12: false,
          })
        );
      } catch (e) {
        setTime(new Date().toLocaleTimeString());
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__col">
          <h5>Product</h5>
          <a href="/features" data-cursor>Features</a>
          <a href="/pricing" data-cursor>Pricing</a>
          <a href="/#process" data-cursor>How it Works</a>
        </div>
        <div className="footer__col">
          <h5>Company</h5>
          <a href="/contact" data-cursor>Contact us</a>
          <a href="#" data-cursor>About</a>
          <a href="#" data-cursor>Careers</a>
          <a href="mailto:info@billnode.com" data-cursor>info@billnode.com</a>
        </div>

        <div className="footer__col footer__col--r">
          <h5>Local time</h5>
          <span className="footer__clock" id="clock">{time}</span>
          <span className="footer__loc">Lisbon, PT</span>
        </div>
      </div>

      <div className="footer__mark" id="footMark">BillNode</div>

      <div className="footer__legal">
        <span>© 2026 BillNode — All rights reserved.</span>
        <span>Time-entry, simplified.</span>
      </div>
    </footer>
  );
}
