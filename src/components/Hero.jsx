"use client";
import { useState, useEffect } from "react";

export default function Hero() {
  const [calendlyUrl, setCalendlyUrl] = useState("https://calendly.com/billnode-demo/30min");

  useEffect(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    setCalendlyUrl(`https://calendly.com/billnode-demo/30min?month=${y}-${m}`);
  }, []);

  return (
    <section className="hero" id="hero">
      <div className="hero__bg" aria-hidden="true">
        <span className="blob blob--1"></span>
        <span className="blob blob--2"></span>
      </div>

      <div className="hero__float" aria-hidden="true">
        <div className="hfloat hfloat--b" data-depth="1.6">
          <div className="hfloat__bhead"><b>This week</b><span>42.5h</span></div>
          <div className="hfloat__bars">
            <i style={{ "--h": "40%" }}></i>
            <i style={{ "--h": "70%" }}></i>
            <i style={{ "--h": "55%" }}></i>
            <i style={{ "--h": "95%" }}></i>
            <i style={{ "--h": "62%" }}></i>
            <i style={{ "--h": "80%" }}></i>
          </div>
        </div>
        <div className="hfloat hfloat--c" data-depth="3.2">
          <span className="hfloat__av">AK</span>
          <div><small>Tracked today</small><b>6.5h <em>billable</em></b></div>
        </div>
        <div className="hfloat hfloat--d" data-depth="2.0">
          <span className="hfloat__ok">✓</span> Invoice paid <b>+$1,500</b>
        </div>
      </div>

      <div className="hero__top">
        <span className="hero__tag" data-reveal="up">
          <span className="dot pulse"></span> Live time tracking — early access
        </span>
        <span className="hero__tag hero__tag--r" data-reveal="up">
          For agencies &amp; teams that bill by the hour
        </span>
      </div>

      <h1 className="hero__title">
        <span className="line"><span className="w">Track the</span></span>
        <span className="line"><span className="w">metrics that</span></span>
        <span className="line">
          <span className="w">actually</span> <em className="w serif">matter</em><span className="w">.</span>
        </span>
      </h1>

      <div className="hero__foot">
        <p className="hero__sub" data-reveal="lines">
          A modern time-entry tool that replaces scattered timesheets<br />and guesswork with one clean, structured space.
        </p>
        <div className="hero__actions" data-reveal="up">
          <a href={calendlyUrl} target="_blank" rel="noopener noreferrer" className="btn btn--orange btn--lg" data-magnetic data-cursor>
            <span>Schedule demo</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
          <a href="#inside" className="btn btn--ghost btn--lg" data-magnetic data-cursor>
            See the product
          </a>
        </div>
      </div>

    </section>
  );
}
