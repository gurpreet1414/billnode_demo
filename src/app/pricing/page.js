"use client";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import Lenis from "lenis";

import CustomCursor from "@/components/CustomCursor";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);

  return (
    <div style={{ borderBottom: "1px solid var(--line)", paddingBlock: "24px" }} className="w-full">
      <button 
        onClick={() => setOpen(!open)}
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          width: "100%", 
          textAlign: "left",
          fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
          fontWeight: 600,
          color: "var(--ink)",
        }}
        data-cursor
      >
        <span>{question}</span>
        <span style={{ fontSize: "1.8rem", transform: open ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.4s var(--ease)", color: "var(--orange)" }}>+</span>
      </button>
      <div 
        ref={contentRef}
        style={{ 
          maxHeight: open ? `${contentRef.current?.scrollHeight}px` : "0px",
          opacity: open ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.4s var(--ease), opacity 0.4s var(--ease)",
          marginTop: open ? "16px" : "0px"
        }}
      >
        <p style={{ color: "var(--ink-2)", fontSize: "1.1rem", lineHeight: 1.6, maxWidth: "70ch" }}>
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const loaderFinished = true; // Preloader skipped for instant load
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: `Pricing Page (${billingCycle} billing)` })
      });
      if (response.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  const pageRef = useRef(null);

  const toggleBilling = (mode) => {
    setBillingCycle(mode);
  };

  useEffect(() => {
    if (!loaderFinished) return;

    const container = pageRef.current;
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
  }, [billingCycle, loaderFinished]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.config({ force3D: true });
    ScrollTrigger.config({ ignoreMobileResize: true });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    const $ = (s, c = document) => (c || document).querySelector(s);
    const $$ = (s, c = document) => Array.from((c || document).querySelectorAll(s));

    function splitLines(el) {
      const parts = el.innerHTML.split(/<br\s*\/?>/i);
      el.innerHTML = parts.map((p) => `<span class="rline"><span class="rline__i">${p}</span></span>`).join("");
      return $$(".rline__i", el);
    }
    
    function splitWords(el) {
      const nodes = Array.from(el.childNodes); 
      el.innerHTML = "";
      nodes.forEach((node) => {
        if (node.nodeType === 3) {
          node.textContent.split(/(\s+)/).forEach((tok) => {
            if (!tok.trim()) { 
              el.appendChild(document.createTextNode(tok)); 
              return; 
            }
            const s = document.createElement("span"); 
            s.className = "rword"; 
            s.textContent = tok; 
            el.appendChild(s);
          });
        } else if (node.nodeType === 1) { 
          node.classList.add("rword"); 
          el.appendChild(node); 
        } else {
          el.appendChild(node);
        }
      });
      return $$(".rword", el);
    }

    let lenis = null;
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
      lenis.on("scroll", () => ScrollTrigger.update());
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    const anchorClicks = [];
    $$('a[href^="#"]').forEach((a) => {
      const onClick = (e) => {
        const id = a.getAttribute("href");
        if (id.length < 2) return;
        const el = $(id);
        if (!el) return;
        e.preventDefault();
        lenis ? lenis.scrollTo(el, { offset: 0 }) : el.scrollIntoView({ behavior: "smooth" });
      };
      a.addEventListener("click", onClick);
      anchorClicks.push({ el: a, handler: onClick });
    });

    const magneticCleanups = [];
    if (finePointer) {
      $$("[data-magnetic]").forEach((el) => {
        const xm = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
        const ym = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
        const onMove = (e) => {
          const r = el.getBoundingClientRect();
          xm((e.clientX - (r.left + r.width / 2)) * 0.4);
          ym((e.clientY - (r.top + r.height / 2)) * 0.4);
        };
        const onLeave = () => {
          xm(0);
          ym(0);
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        magneticCleanups.push({ el, onMove, onLeave });
      });
    }

    function build() {
      const words = $$(".hero__title .w");
      if (words.length) {
        gsap.set(words, { yPercent: 118 });
        gsap.to(words, { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.08, delay: 0.15 });
      }

      $$('[data-reveal="lines"]').forEach((el) => {
        el.style.opacity = 1;
        const lines = splitLines(el);
        gsap.set(lines, { yPercent: 115 });
        gsap.to(lines, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: el, start: "top 88%" } });
      });

      $$('[data-reveal="words"]').forEach((el) => {
        el.style.opacity = 1;
        const ws = splitWords(el);
        gsap.set(ws, { yPercent: 50, opacity: 0 });
        gsap.to(ws, { yPercent: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.022, scrollTrigger: { trigger: el, start: "top 82%" } });
        if (window.__bindCursor) window.__bindCursor();
      });

      $$('[data-reveal="up"]').forEach((el) =>
        gsap.fromTo(el, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" } })
      );

      $$('[data-reveal="fade"]').forEach((el) =>
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 1, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 95%" } })
      );

      const track = $("#ticker");
      if (track) {
        track.innerHTML += track.innerHTML;
        const half = track.scrollWidth / 2;
        const loop = gsap.to(track, { x: -half, duration: 24, ease: "none", repeat: -1 });
        const skewTo = gsap.quickTo(track, "skewX", { duration: 0.5, ease: "power3" });
        gsap.ticker.add(() => {
          const v = lenis ? lenis.velocity || 0 : 0;
          loop.timeScale(1 + Math.min(Math.abs(v) * 0.06, 4));
          skewTo(gsap.utils.clamp(-14, 14, v * 0.5));
        });
      }

      gsap.to(".blob--1", { yPercent: 35, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.5 } });
      gsap.to(".blob--2", { yPercent: -25, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.5 } });

      const nav = $("#nav");
      if (nav) {
        let last = 0;
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const y = self.scroll();
            nav.classList.toggle("is-scrolled", y > 40);
            if (y > last && y > 600) {
              nav.classList.add("is-hidden");
            } else {
              nav.classList.remove("is-hidden");
            }
            last = y;
          },
        });
      }

      // Scroll-bound footer mark color reveal (matching homepage)
      const m = $("#footMark");
      if (m) {
        gsap.to(m, {
          backgroundPosition: "0% 0",
          ease: "none",
          scrollTrigger: { trigger: ".footer", start: "top 92%", end: "bottom bottom", scrub: 0.6 },
        });
      }

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
      setTimeout(() => ScrollTrigger.refresh(), 100);
    }

    if (loaderFinished) {
      build();
    }

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      anchorClicks.forEach(({ el, handler }) => el.removeEventListener("click", handler));
      magneticCleanups.forEach(({ el, onMove, onLeave }) => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      });
      if (lenis) {
        lenis.destroy();
        gsap.ticker.remove(lenis.raf);
      }
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [loaderFinished]);

  return (
    <div ref={pageRef} style={{ minHeight: "100vh" }}>
      <CustomCursor />
      <Header />
      <main id="top">
        {/* ============== HERO ============== */}
        <section className="hero pt-40 pb-16 min-h-[80svh] flex flex-col justify-center items-center text-center relative overflow-hidden" id="hero">
          <div className="hero__bg" aria-hidden="true">
            <span className="blob blob--1" style={{ background: "radial-gradient(circle, rgba(255,90,31,0.10), transparent 70%)" }}></span>
            <span className="blob blob--2" style={{ background: "radial-gradient(circle, rgba(130,90,255,0.08), transparent 70%)" }}></span>
          </div>

          <div className="hero__top">
            <span className="hero__tag" data-reveal="up"><span className="dot pulse"></span> Simple packages</span>
            <span className="hero__tag hero__tag--r elementor-hidden-mobile" data-reveal="up">Pricing that scales with your growth</span>
          </div>

          <h1 className="hero__title text-5xl lg:text-7xl font-semibold leading-none tracking-tight my-6" style={{ margin: "20px 0" }}>
            <span className="line"><span className="w">Find a flexible</span></span>
            <span className="line"><span className="w">plan that fits</span></span>
            <span className="line"><span className="w">your</span> <em className="w serif text-[var(--orange)] font-normal">business</em><span className="w">.</span></span>
          </h1>

          <div className="hero__foot flex flex-col items-center gap-6">
            <p className="hero__sub text-lg lg:text-xl font-medium text-[var(--ink-2)]" data-reveal="lines">
              Choose a plan that scales with your team size, supports your projects,<br />and puts scattered billing workflows in one tidy container.
            </p>
            <div className="hero__actions flex gap-4" data-reveal="up">
              <a href="#plans" className="btn btn--orange btn--lg" data-magnetic data-cursor>See plans grid</a>
               <a href="#faq" className="btn btn--ghost btn--lg border-[var(--line)]" data-magnetic data-cursor>View FAQ queries</a>
            </div>
          </div>
        </section>

        {/* ============== PLANS GRID ============== */}
        <section className="pricing" id="plans" style={{ background: "#ffffff" }}>
          <div className="pricing__head" style={{ marginBottom: "50px" }}>
            <h2 className="h-section">Simple packages</h2>
            <div className={`toggle ${billingCycle === "annual" ? "is-annual" : ""}`} id="priceToggle">
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
            <div className="plan">
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
               <a href="#ask" className="btn btn--ghost btn--block border-[var(--line)]" data-cursor>Get started</a>
            </div>

            {/* Inverted layout: White featured card on black page */}
            <div className="plan plan--featured">
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
              <a href="#ask" className="btn btn--orange btn--block" data-magnetic data-cursor>Get started</a>
            </div>

            <div className="plan">
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
               <a href="#ask" className="btn btn--ghost btn--block border-[var(--line)]" data-cursor>Contact sales</a>
            </div>
          </div>
        </section>

        {/* ============== FAQ ACCORDIONS ============== */}
        <section className="services" id="faq" style={{ background: "#ffffff" }}>
          <div className="services__head" style={{ marginBottom: "50px" }}>
            <h2 className="h-section">Frequently<br />asked queries</h2>
            <p className="services__lead text-[var(--ink-2)]">Clear, simple answers to the most common questions about BillNode timesheets and contracts.</p>
          </div>

          <div style={{ maxWidth: "800px", marginInline: "auto" }}>
            <FAQItem 
              question="Does BillNode have a free plan?"
              answer="Yes, BillNode has a Free tier with basic entries that is ideal for small agencies, freelancers, or teams testing the core capabilities before scaling up."
            />
            <FAQItem 
              question="Can I customize BillNode for my needs?"
              answer="Absolutely! Our Enterprise package features custom integrations with your existing CRM/HR stacks, role-based reporting templates, SSO, and high-priority security support."
            />
            <FAQItem 
              question="What are the benefits of using BillNode?"
              answer="BillNode eliminates scattered excel worksheets and manual timing guesses. By tracking work items and tagging categories live, managers audit entries immediately and clients receive detailed billing reports without delays."
            />
          </div>
        </section>

        {/* ============== TICKER ============== */}
        <section className="ticker" aria-hidden="true" style={{ marginBlock: "40px 0" }}>
          <div className="ticker__track" id="ticker">
            <span>Flexible contracts</span><b>✦</b><span>Cancel anytime</span><b>✦</b><span>No hidden fees</span><b>✦</b><span>Dynamic packages</span><b>✦</b>
          </div>
        </section>

        {/* ============== CONTACT FORM ============== */}
        <section className="cta" id="ask" style={{ background: "var(--orange)" }}>
          <p className="cta__kick" data-reveal="up" style={{ color: "rgba(255,255,255,0.9)" }}>Freely ask us for more information.</p>
          <h2 className="cta__title" style={{ marginBottom: "30px" }}>
            <span className="line"><span className="w">Need custom</span></span>
            <span className="line"><span className="w">billing</span> <em className="w serif text-[#14130f] font-normal">setups</em><span className="w">?</span></span>
          </h2>
          
          <div className="flex justify-center" data-reveal="up" style={{ marginTop: "20px" }}>
            <a href="/contact" className="btn btn--dark btn--xl" data-magnetic data-cursor style={{ background: "#14130f", color: "#fff" }}>
              <span>Contact us</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ width: "20px", height: "20px", marginLeft: "10px" }}>
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </a>
          </div>

        </section>

        <Footer />
      </main>
    </div>
  );
}
