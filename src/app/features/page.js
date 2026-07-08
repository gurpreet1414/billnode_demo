"use client";
import { useEffect, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import Lenis from "lenis";

import CustomCursor from "@/components/CustomCursor";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function FeaturesPage() {
  const loaderFinished = true; // Preloader skipped for instant load
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "Features Page" })
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

    function wrapWords(el) {
      const text = el.textContent.replace(/\s+/g, " ").trim();
      el.innerHTML = text.split(" ").map((w) => `<span class="word">${w}</span>`).join(" ");
      return $$(".word", el);
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

      gsap.from(".srv", { y: 44, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.09, scrollTrigger: { trigger: ".srv-list", start: "top 82%" } });

      const showcaseTrack = $("#showcaseTrack");
      const showcaseSection = $(".product-tour");
      if (showcaseTrack && showcaseSection) {
        const images = showcaseTrack.querySelectorAll("img");
        Promise.all(
          [...images].map(
            (img) =>
              img.complete
                ? Promise.resolve()
                : new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve;
                  })
          )
        ).then(() => {
          ScrollTrigger.refresh();
        });

        const dist = () => Math.max(0, showcaseTrack.scrollWidth - window.innerWidth);
        const st = gsap.to(showcaseTrack, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: showcaseSection,
            start: "top top",
            end: () => "+=" + (dist() + window.innerWidth),
            pin: ".product-tour",
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        $$(".feature-slide").forEach((slide) => {
          const visual = slide.querySelector(".feature-slide__visual");
          const copy = slide.querySelector(".feature-split__copy");
          const isReversed = slide.querySelector(".feature-slide__inner")?.classList.contains("feature-split--reverse");

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: slide,
              containerAnimation: st,
              start: "left right",
              end: "right left",
              scrub: 1,
            },
          });

          const enterDist = isReversed ? -150 : 150;
          const exitDist = isReversed ? 150 : -150;

          tl.fromTo(visual, { x: enterDist, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35, ease: "power3.out" }, 0);
          tl.fromTo(copy, { x: -enterDist, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35, ease: "power3.out" }, 0);

          tl.to({}, { duration: 0.3 });

          tl.to(visual, { x: exitDist, opacity: 0, duration: 0.35, ease: "power3.in" }, 0.65);
          tl.to(copy, { x: -exitDist, opacity: 0, duration: 0.35, ease: "power3.in" }, 0.65);
        });
      }

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
    <>
      <CustomCursor />
      <Header />
      <main id="top">
        {/* ============== DISTINCT SPLIT HERO WITH PERSPECTIVE MOCKUP ============== */}
        <section className="hero flex flex-col lg:grid lg:grid-cols-[1.2fr_1fr] items-center gap-10 lg:gap-16 pt-36 pb-16 min-h-svh relative overflow-hidden" id="hero">
          <div className="hero__bg" aria-hidden="true">
            <span className="blob blob--1"></span>
            <span className="blob blob--2"></span>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <div className="hero__mobile-tags flex justify-between font-semibold text-[var(--ink-2)]">
              <span className="hero__tag" data-reveal="up"><span className="dot pulse"></span> Live time entry features</span>
              <span className="hero__tag hero__tag--r elementor-hidden-mobile" data-reveal="up">Productivity multiplied by data</span>
            </div>

            <h1 className="hero__title text-5xl lg:text-7xl font-semibold leading-none tracking-tight" style={{ margin: "0" }}>
              <span className="line"><span className="w">Streamline the</span></span>
              <span className="line"><span className="w ">time entry</span></span>
              <span className="line"><span className="w">process</span> <em className="w serif text-[var(--orange)] font-normal">effortlessly</em><span className="w">.</span></span>
            </h1>

            <p className="hero__sub text-lg lg:text-xl font-medium text-[var(--ink-2)]" data-reveal="lines">
              Boost productivity, eliminate guesswork, and make<br />data-driven decisions with BillNode's structured space.
            </p>

            <div className="hero__actions" data-reveal="up" style={{ marginTop: "12px" }}>
              <a href="#connect" className="btn btn--orange btn--lg" data-magnetic data-cursor>
                <span>Get in touch</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M7 17 17 7M9 7h8v8" /></svg>
              </a>
              <a href="#how-it-works" className="btn btn--ghost btn--lg" data-magnetic data-cursor>Learn the workflow</a>
            </div>
          </div>

          {/* Skewed mockup illustration on the right */}
          <div data-reveal="fade" className="flex justify-center items-center w-full mt-8 lg:mt-0">
            <div style={{
              width: "100%",
              maxWidth: "480px",
              padding: "20px",
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(10px)",
              borderRadius: "24px",
              border: "1px solid var(--line)",
              boxShadow: "0 30px 70px -34px rgba(28,22,16,0.3)",
              transform: "perspective(1000px) rotateY(-10deg) rotateX(6deg)",
              transition: "transform 0.5s var(--ease)"
            }}
              className="hover:scale-[1.03]"
            >
              <img src="/assets/s1111.png" alt="Reports View Mockup" style={{ width: "100%", height: "auto", borderRadius: "12px", border: "1px solid var(--line-2)" }} />
            </div>
          </div>

        </section>

        {/* ============== KEY FEATURES ============== */}
        <section className="services" id="features">
          <div className="services__head">
            <h2 className="h-section" data-reveal="lines">Built for high<br />performing teams</h2>
            <p className="services__lead" data-reveal="up">Keep manager review simple, billable hours transparent, and clients updated without manual email check-ins.</p>
          </div>

          <div className="srv-list">
            <div className="srv" data-cursor>
              <span className="srv__no">01</span>
              <h3 className="srv__name">Time management</h3>
              <p className="srv__desc">Efficiently organize and manage employee hours, separating task items and project lines.</p>
              <span className="srv__plus">+</span>
            </div>
            <div className="srv" data-cursor>
              <span className="srv__no">02</span>
              <h3 className="srv__name">Personalized insights</h3>
              <p className="srv__desc">Deep insight into project performance and workload margins with customized advice.</p>
              <span className="srv__plus">+</span>
            </div>
            <div className="srv" data-cursor>
              <span className="srv__no">03</span>
              <h3 className="srv__name">Performance evaluation</h3>
              <p className="srv__desc">Spot workload blocks, highlight fast reviews, and optimize operational velocity.</p>
              <span className="srv__plus">+</span>
            </div>
            <div className="srv" data-cursor>
              <span className="srv__no">04</span>
              <h3 className="srv__name">Resource allocation</h3>
              <p className="srv__desc">See where hours go instantly, dispatch resources, and ensure key projects are prioritized.</p>
              <span className="srv__plus">+</span>
            </div>
            <div className="srv" data-cursor>
              <span className="srv__no">05</span>
              <h3 className="srv__name">AI-powered tracking</h3>
              <p className="srv__desc">Use smart defaults, automated task tags, and time audits to cut admin hours in half.</p>
              <span className="srv__plus">+</span>
            </div>
          </div>
        </section>

        {/* ============== STACK WORKFLOW ============== */}
        <section className="process" id="how-it-works">
          <div className="process__intro">
            <span className="eyebrow" data-reveal="up"><i></i> The workflow</span>
            <h2 className="h-section" data-reveal="lines">Three simple steps<br />to active tracking</h2>
          </div>
          <div className="stack">
            <article className="scard" style={{ "--i": 0 }}>
              <div className="scard__no">01</div>
              <div className="scard__body">
                <h3>Log in to portal</h3>
                <p>Access your company's dedicated, custom-branded secure dashboard portal from any desktop or mobile device.</p>
              </div>
              <span className="scard__tag">Access · Security</span>
            </article>
            <article className="scard" style={{ "--i": 1 }}>
              <div className="scard__no">02</div>
              <div className="scard__body">
                <h3>Enter task details</h3>
                <p>Input descriptions, select projects, set tag details, and flag the entry as billable with one tap.</p>
              </div>
              <span className="scard__tag">Inputs · Automation</span>
            </article>
            <article className="scard" style={{ "--i": 2 }}>
              <div className="scard__no">03</div>
              <div className="scard__body">
                <h3>Submit &amp; track</h3>
                <p>Submit your timesheet instantly to the admin board for verification, invoicing, and CSV/PDF export.</p>
              </div>
              <span className="scard__tag">Approvals · Billing</span>
            </article>
          </div>
        </section>

        {/* ============== MONITORS SHOWCASE (SPLIT FULL LAYOUT) ============== */}
        <section className="services flex flex-col lg:grid lg:grid-cols-[1fr_1.1fr] items-center gap-10 lg:gap-16" style={{ background: "var(--bg)" }}>
          {/* Left Column: Full Mockup Image */}
          <div data-reveal="fade" className="flex justify-center items-center w-full">
            <div style={{
              width: "100%",
              maxWidth: "540px",
              padding: "20px",
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(10px)",
              borderRadius: "24px",
              border: "1px solid var(--line)",
              boxShadow: "0 30px 70px -34px rgba(28,22,16,0.3)",
            }}
            >
              <img src="/assets/s11.png" alt="Report Ready Mockup" style={{ width: "100%", height: "auto", borderRadius: "12px", border: "1px solid var(--line-2)" }} />
            </div>
          </div>

          {/* Right Column: Copy Details */}
          <div className="flex flex-col gap-6 w-full">
            <span className="eyebrow" data-reveal="up"><i></i> Operations control</span>
            <h2 className="h-section" data-reveal="lines" style={{ margin: "0" }}>Monitor &amp; manage<br />the entire workspace</h2>
            <p className="text-lg text-[var(--ink-2)] font-medium leading-relaxed" data-reveal="up">
              Analyze key metrics and make data-driven decisions using your team's real-time time entry data. Keep manager reviews simple and operations transparent.
            </p>

            <div className="flex flex-col gap-6 mt-4" data-reveal="up">
              <div style={{ borderTop: "1px solid var(--line)", paddingTop: "16px" }}>
                <h4 style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--ink)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="dot"></span> Intuitive Dashboard
                </h4>
                <p style={{ color: "var(--ink-2)", fontSize: "1.05rem", marginTop: "6px" }}>
                  View live employee workload, pending review requests, and invoice statuses at a glance.
                </p>
              </div>
              <div style={{ borderTop: "1px solid var(--line)", paddingTop: "16px" }}>
                <h4 style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--ink)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="dot"></span> Global Notice Board
                </h4>
                <p style={{ color: "var(--ink-2)", fontSize: "1.05rem", marginTop: "6px" }}>
                  Keep everyone aligned with company bulletins, due date notices, and general announcements.
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* ============== PRODUCT TOUR — CINEMATIC SCRAMBLE ============== */}
        <section className="product-tour" id="productTour">
          <div className="services__head">
            <span className="eyebrow" data-reveal="up"><i></i> Product tour</span>
            <h2 className="h-section" data-reveal="lines">Inside BillNode</h2>
            <p className="services__lead" data-reveal="up">From first tracked hour to final invoice — explore every view built for your team.</p>
          </div>

          <div className="product-tour__pin">
            <div className="product-tour__track" id="showcaseTrack">
              <article className="feature-slide">
                <div className="feature-slide__inner">
                  <div className="feature-split__visual">
                    <div className="feature-visual">
                      <span className="feature-visual__idx">01</span>
                      <img src="/assets/s1111.png" alt="BillNode Reports view" decoding="async" />
                    </div>
                  </div>
                  <div className="feature-split__copy">
                    <span className="eyebrow"><i></i> Reporting</span>
                    <h3 className="feature-split__title">Generate detailed reports</h3>
                    <p className="feature-split__desc">Create comprehensive timesheet reports and client invoices in CSV or PDF format. Search, filter, and export data with a single click — no manual spreadsheet work needed.</p>
                    <a href="#how-it-works" className="btn btn--ghost" data-cursor>See workflow <i className="arr">→</i></a>
                  </div>
                </div>
              </article>

              <article className="feature-slide">
                <div className="feature-slide__inner feature-split--reverse">
                  <div className="feature-split__visual">
                    <div className="feature-visual">
                      <span className="feature-visual__idx">02</span>
                      <img src="/assets/new15.png" alt="BillNode Dashboard Stats" decoding="async" />
                    </div>
                  </div>
                  <div className="feature-split__copy">
                    <span className="eyebrow"><i></i> Analytics</span>
                    <h3 className="feature-split__title">Dashboard stats at a glance</h3>
                    <p className="feature-split__desc">Monitor live employee workload, pending review requests, and invoice statuses from a single dashboard. Make informed decisions without jumping between tools.</p>
                    <a href="#how-it-works" className="btn btn--ghost" data-cursor>See workflow <i className="arr">→</i></a>
                  </div>
                </div>
              </article>

              <article className="feature-slide">
                <div className="feature-slide__inner">
                  <div className="feature-split__visual">
                    <div className="feature-visual">
                      <span className="feature-visual__idx">03</span>
                      <img src="/assets/s2.png" alt="BillNode Global Notice Board" decoding="async" />
                    </div>
                  </div>
                  <div className="feature-split__copy">
                    <span className="eyebrow"><i></i> Communication</span>
                    <h3 className="feature-split__title">Global notice board</h3>
                    <p className="feature-split__desc">Keep every team member aligned with company-wide bulletins, due date notices, and general announcements. Centralize communication so nothing slips through.</p>
                    <a href="#how-it-works" className="btn btn--ghost" data-cursor>See workflow <i className="arr">→</i></a>
                  </div>
                </div>
              </article>

              <article className="feature-slide">
                <div className="feature-slide__inner feature-split--reverse">
                  <div className="feature-split__visual">
                    <div className="feature-visual">
                      <span className="feature-visual__idx">04</span>
                      <img src="/assets/subscriptions.png" alt="BillNode Subscriptions management" decoding="async" />
                    </div>
                  </div>
                  <div className="feature-split__copy">
                    <span className="eyebrow"><i></i> Billing</span>
                    <h3 className="feature-split__title">Subscriptions & renewals</h3>
                    <p className="feature-split__desc">Track subscription changes, monitor renewals, and manage payments across all plans from one panel. Stay on top of billing cycles without manual follow-ups.</p>
                    <a href="#how-it-works" className="btn btn--ghost" data-cursor>See workflow <i className="arr">→</i></a>
                  </div>
                </div>
              </article>

              <article className="feature-slide">
                <div className="feature-slide__inner">
                  <div className="feature-split__visual">
                    <div className="feature-visual">
                      <span className="feature-visual__idx">05</span>
                      <img src="/assets/time_entry_listing.png" alt="BillNode Time Entry Listing" decoding="async" />
                    </div>
                  </div>
                  <div className="feature-split__copy">
                    <span className="eyebrow"><i></i> Time tracking</span>
                    <h3 className="feature-split__title">Time entry made simple</h3>
                    <p className="feature-split__desc">Log work hours by project and task, edit descriptions, and flag billable items instantly. Structured entry formats eliminate guesswork and speed up approvals.</p>
                    <a href="#how-it-works" className="btn btn--ghost" data-cursor>See workflow <i className="arr">→</i></a>
                  </div>
                </div>
              </article>

              <article className="feature-slide">
                <div className="feature-slide__inner feature-split--reverse">
                  <div className="feature-split__visual">
                    <div className="feature-visual">
                      <span className="feature-visual__idx">06</span>
                      <img src="/assets/locations_listing.png" alt="BillNode Location Listing" decoding="async" />
                    </div>
                  </div>
                  <div className="feature-split__copy">
                    <span className="eyebrow"><i></i> Operations</span>
                    <h3 className="feature-split__title">Client locations</h3>
                    <p className="feature-split__desc">Organize and manage client locations for accurate billing and reporting across different sites. Ensure every entry is tied to the right project and place.</p>
                    <a href="#how-it-works" className="btn btn--ghost" data-cursor>See workflow <i className="arr">→</i></a>
                  </div>
                </div>
              </article>

              <article className="feature-slide">
                <div className="feature-slide__inner">
                  <div className="feature-split__visual">
                    <div className="feature-visual">
                      <span className="feature-visual__idx">07</span>
                      <img src="/assets/s4.png" alt="BillNode Admin Reports" decoding="async" />
                    </div>
                  </div>
                  <div className="feature-split__copy">
                    <span className="eyebrow"><i></i> Insights</span>
                    <h3 className="feature-split__title">Admin reports</h3>
                    <p className="feature-split__desc">Access role-based and team-based reports that turn raw time data into actionable insights. Identify trends, optimize staffing, and reduce admin overhead.</p>
                    <a href="#how-it-works" className="btn btn--ghost" data-cursor>See workflow <i className="arr">→</i></a>
                  </div>
                </div>
              </article>

              <article className="feature-slide">
                <div className="feature-slide__inner feature-split--reverse">
                  <div className="feature-split__visual">
                    <div className="feature-visual">
                      <span className="feature-visual__idx">08</span>
                      <img src="/assets/s5.png" alt="BillNode monitor at a glance" decoding="async" />
                    </div>
                  </div>
                  <div className="feature-split__copy">
                    <span className="eyebrow"><i></i> Management</span>
                    <h3 className="feature-split__title">Monitor & manage</h3>
                    <p className="feature-split__desc">Review pending entries, billable hours, and priority tasks from one unified view. Keep operations transparent and teams accountable with real-time oversight.</p>
                    <a href="#how-it-works" className="btn btn--ghost" data-cursor>See workflow <i className="arr">→</i></a>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ============== TICKER ============== */}
        <section className="ticker" aria-hidden="true" style={{ marginBlock: "80px 0" }}>
          <div className="ticker__track" id="ticker">
            <span>Time-entry simplified</span><b>✦</b><span>Productivity multiplied</span><b>✦</b><span>Admin minimized</span><b>✦</b><span>Revenue optimized</span><b>✦</b>
          </div>
        </section>

        {/* ============== SIGNUP CTA ============== */}
        <section className="cta" id="connect">
          <p className="cta__kick" data-reveal="up">We always want to connect with our clients.</p>
          <h2 className="cta__title" style={{ marginBottom: "30px" }}>
            <span className="line"><span className="w">Ready to track</span></span>
            <span className="line"><span className="w">with</span> <em className="w serif text-[#14130f] font-normal">clarity</em><span className="w">?</span></span>
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
    </>
  );
}
