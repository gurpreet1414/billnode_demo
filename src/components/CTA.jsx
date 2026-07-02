"use client";
import { useState, useEffect } from "react";

export default function CTA() {
  const [calendlyUrl, setCalendlyUrl] = useState("https://calendly.com/billnode-demo/30min");

  useEffect(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    setCalendlyUrl(`https://calendly.com/billnode-demo/30min?month=${y}-${m}`);
  }, []);

  return (
    <section className="cta" id="contact">
      <p className="cta__kick" data-reveal="up">Ready when you are.</p>
      <h2 className="cta__title">
        <span className="line"><span className="w">Set up your</span></span>
        <span className="line"><span className="w">first</span> <em className="w serif">workspace</em><span className="w">.</span></span>
      </h2>
      <a href={calendlyUrl} target="_blank" rel="noopener noreferrer" className="btn btn--dark btn--xl" data-magnetic data-cursor>
        <span>Schedule a demo</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M7 17 17 7M9 7h8v8" />
        </svg>
      </a>
    </section>
  );
}
