"use client";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const pricingRef = useRef(null);

  const toggleBilling = (mode) => {
    setBillingCycle(mode);
  };

  useEffect(() => {
    const container = pricingRef.current;
    if (!container) return;

    const amounts = container.querySelectorAll(".amt[data-monthly]");
    amounts.forEach((el) => {
      const target = parseFloat(el.getAttribute(`data-${billingCycle}`));
      const currentVal = parseFloat(el.textContent.replace("$", "")) || 0;
      
      const o = { v: currentVal };
      gsap.to(o, {
        v: target,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = "$" + Math.round(o.v);
        },
      });
    });
  }, [billingCycle]);

  return (
    <section className="pricing" id="pricing" ref={pricingRef}>
      <div className="pricing__head">
        <h2 className="h-section" data-reveal="lines">Simple pricing<br />that scales</h2>
        <div className={`toggle ${billingCycle === "annual" ? "is-annual" : ""}`} id="priceToggle" data-reveal="up">
          <button
            className={`toggle__opt ${billingCycle === "monthly" ? "is-on" : ""}`}
            type="button"
            onClick={() => toggleBilling("monthly")}
          >
            Monthly
          </button>
          <button
            className={`toggle__opt ${billingCycle === "annual" ? "is-on" : ""}`}
            type="button"
            onClick={() => toggleBilling("annual")}
          >
            Annual <small>−20%</small>
          </button>
          <span className="toggle__slider"></span>
        </div>
      </div>

      <div className="plans">
        <div className="plan" data-reveal="up">
          <h3>Regular</h3>
          <p className="plan__desc">For small teams getting started.</p>
          <div className="plan__price">
            <span className="amt" data-monthly="10" data-annual="8">$10</span>
            <small>/user/mo</small>
          </div>
          <ul className="plan__feats">
            <li>Online cloud portal</li>
            <li>Dynamic user roles</li>
            <li>Global notice board</li>
            <li>User &amp; admin reports</li>
          </ul>
          <a href="#contact" className="btn btn--ghost btn--block" data-cursor>Get started</a>
        </div>

        <div className="plan plan--featured" data-reveal="up">
          <span className="plan__tag">Most popular</span>
          <h3>Pro</h3>
          <p className="plan__desc">For growing teams that bill by the hour.</p>
          <div className="plan__price">
            <span className="amt" data-monthly="15" data-annual="12">$15</span>
            <small>/user/mo</small>
          </div>
          <ul className="plan__feats">
            <li>Everything in Regular</li>
            <li>Role-based reports</li>
            <li>Team-based reports</li>
            <li>Priority support</li>
          </ul>
          <a href="#contact" className="btn btn--orange btn--block" data-magnetic data-cursor>Get started</a>
        </div>

        <div className="plan" data-reveal="up">
          <h3>Enterprise</h3>
          <p className="plan__desc">For organisations 100+ strong.</p>
          <div className="plan__price">
            <span className="amt">Custom</span>
          </div>
          <ul className="plan__feats">
            <li>Everything in Pro</li>
            <li>Custom integrations</li>
            <li>Dedicated manager</li>
            <li>SSO &amp; advanced security</li>
          </ul>
          <a href="#contact" className="btn btn--ghost btn--block" data-cursor>Contact sales</a>
        </div>
      </div>
    </section>
  );
}
