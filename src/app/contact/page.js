"use client";
import { useEffect, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import Lenis from "lenis";

import CustomCursor from "@/components/CustomCursor";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


export default function ContactPage() {
  const loaderFinished = true; // Preloader skipped for instant load
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [plan, setPlan] = useState("Regular");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [recaptchaReady, setRecaptchaReady] = useState(!recaptchaSiteKey);

  useEffect(() => {
    if (!recaptchaSiteKey) {
      return;
    }

    const existingScript = document.querySelector(`script[data-recaptcha-site-key="${recaptchaSiteKey}"]`);
    if (existingScript) {
      if (window.grecaptcha?.ready) {
        window.grecaptcha.ready(() => setRecaptchaReady(true));
      }
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
    script.async = true;
    script.defer = true;
    script.dataset.recaptchaSiteKey = recaptchaSiteKey;
    script.onload = () => {
      if (window.grecaptcha?.ready) {
        window.grecaptcha.ready(() => setRecaptchaReady(true));
      }
    };
    script.onerror = () => setRecaptchaReady(false);
    document.head.appendChild(script);
  }, [recaptchaSiteKey]);

  const getRecaptchaToken = () => {
    if (!recaptchaSiteKey) {
      return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
      if (!recaptchaReady || !window.grecaptcha?.ready) {
        reject(new Error("reCAPTCHA is still loading. Please try again."));
        return;
      }

      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(recaptchaSiteKey, { action: "contact_form" })
          .then(resolve)
          .catch(reject);
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus("loading");

    try {
      const token = await getRecaptchaToken();

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          industry,
          plan,
          message,
          source: "Contact Page Form",
          ...(recaptchaSiteKey ? { token } : {}),
        }),
      });

      if (response.ok) {
        setStatus("success");

        setName("");
        setEmail("");
        setPhone("");
        setCompany("");
        setIndustry("");
        setPlan("Regular");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
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
    <>
      <CustomCursor />
      <Header />
      <main id="top">
        {/* ============== DISTINCT SPLIT HERO WITH FLOATING CONTACT DETAILS ============== */}
        <section className="hero flex flex-col lg:grid lg:grid-cols-[1.2fr_1fr] items-center gap-10 lg:gap-16 pt-36 pb-16 min-h-svh relative overflow-hidden" id="hero">
          <div className="hero__bg" aria-hidden="true">
            <span className="blob blob--1"></span>
            <span className="blob blob--2"></span>
          </div>

          <div className="flex flex-col gap-6 w-full">
            <div className="flex justify-between font-semibold text-[var(--ink-2)]">
              <span className="hero__tag" data-reveal="up"><span className="dot pulse"></span> Contact us</span>
              <span className="hero__tag hero__tag--r elementor-hidden-mobile" data-reveal="up">We're just an email away</span>
            </div>

            <h1 className="hero__title text-5xl lg:text-7xl font-semibold leading-none tracking-tight" style={{ margin: "0" }}>
              <span className="line"><span className="w">Get in touch</span></span>
              <span className="line"><span className="w">with us</span></span>
              <span className="line"><span className="w">directly</span> <em className="w serif text-[var(--orange)] font-normal">today</em><span className="w">.</span></span>
            </h1>

            <p className="hero__sub text-lg lg:text-xl font-medium text-[var(--ink-2)]" data-reveal="lines">
              Need assistance with your portal setup, custom billing configurations,<br />or team management? Drop us a line below.
            </p>
            <div className="hero__actions" data-reveal="up" style={{ marginTop: "12px" }}>
              <a href="#message" className="btn btn--orange btn--lg" data-magnetic data-cursor>Send a message</a>
              <a href="mailto:info@billnode.com" className="btn btn--ghost btn--lg" data-magnetic data-cursor>Email directly</a>
            </div>
          </div>

          {/* Integrated floating details card on the right */}
          <div data-reveal="fade" className="flex justify-center items-center w-full mt-8 lg:mt-0">
            <div style={{
              width: "100%",
              maxWidth: "460px",
              padding: "40px 30px",
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(10px)",
              borderRadius: "28px",
              border: "1px solid var(--line)",
              boxShadow: "0 40px 90px -30px rgba(28,22,16,0.2)",
            }}
              className="flex flex-col gap-6"
            >
              <div>
                <span style={{ textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.08em", color: "var(--muted)", fontWeight: 600 }}>Email Address</span>
                <a href="mailto:info@billnode.com" className="block text-2xl font-semibold mt-1 text-[var(--orange)] hover:underline" data-magnetic data-cursor>
                  info@billnode.com
                </a>
              </div>
              <div style={{ borderTop: "1px solid var(--line-2)", paddingTop: "20px" }}>
                <span style={{ textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.08em", color: "var(--muted)", fontWeight: 600 }}>Phone Support</span>
                <span className="block text-2xl font-semibold mt-1 text-[var(--ink)]">
                  +1 415-854-8023
                </span>
              </div>
              <div style={{ borderTop: "1px solid var(--line-2)", paddingTop: "20px" }}>
                <span style={{ textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.08em", color: "var(--muted)", fontWeight: 600 }}>Office HQ</span>
                <span className="block text-xl font-medium mt-1 text-[var(--ink)]">
                  Lisbon, Portugal
                </span>
              </div>
              <div style={{ borderTop: "1px solid var(--line-2)", paddingTop: "20px" }}>
                <span style={{ textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.08em", color: "var(--muted)", fontWeight: 600 }}>Active Hours</span>
                <span className="block text-lg font-medium mt-1 text-[var(--ink-2)]">
                  9:00 - 18:00 WET (Mon - Fri)
                </span>
              </div>
            </div>
          </div>

          <div className="hero__scroll" data-reveal="fade"><span>Scroll</span><i></i></div>
        </section>

        {/* ============== OFFICE CARD SHOWCASE ============== */}
        <section className="services" style={{ background: "var(--bg)" }}>
          <div className="services__head" style={{ marginBottom: "50px" }}>
            <h2 className="h-section">Our local workspace</h2>
            <p className="services__lead">We always welcome our clients to our office. Drop in to meet our operations managers.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr" }} className="w-full">
            <article className="wcard" data-cursor="view" style={{ width: "100%" }}>
              <div className="wcard__img" style={{ height: "450px" }}>
                <img src="/assets/img3.png" alt="BillNode Lisbon HQ" decoding="async" />
              </div>
              <div className="wcard__meta">
                <h3>BillNode HQ Portal</h3>
                <span>Av. da Liberdade, Lisbon, PT</span>
              </div>
            </article>
          </div>
        </section>

        {/* ============== TICKER ============== */}
        <section className="ticker" aria-hidden="true" style={{ marginBlock: "40px 0" }}>
          <div className="ticker__track" id="ticker">
            <span>Always connected</span><b>✦</b><span>Active support</span><b>✦</b><span>Drop us a line</span><b>✦</b><span>24h response</span><b>✦</b>
          </div>
        </section>

        {/* ============== MESSAGE FORM ============== */}
        <section className="cta" id="message">
          <p className="cta__kick" data-reveal="up">Submit your query</p>
          <h2 className="cta__title" style={{ marginBottom: "30px" }}>
            <span className="line"><span className="w">Send us a</span></span>
            <span className="line"><span className="w">direct</span> <em className="w serif text-[#14130f] font-normal">message</em><span className="w">.</span></span>
          </h2>

          <div className="max-w-xl mx-auto text-left" style={{ marginInline: "auto", padding: "10px", maxWidth: "600px" }} data-reveal="up">
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontWeight: 600, color: "rgba(255,255,255,0.9)", fontSize: "1.05rem" }}>Enter your name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: "100%",
                      height: "56px",
                      borderRadius: "100px",
                      border: "1px solid rgba(255,255,255,0.3)",
                      background: "rgba(0,0,0,0.2)",
                      paddingInline: "24px",
                      color: "#fff",
                      outline: "none"
                    }}
                    required
                    disabled={status === "loading"}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontWeight: 600, color: "rgba(255,255,255,0.9)", fontSize: "1.05rem" }}>Email address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: "100%",
                      height: "56px",
                      borderRadius: "100px",
                      border: "1px solid rgba(255,255,255,0.3)",
                      background: "rgba(0,0,0,0.2)",
                      paddingInline: "24px",
                      color: "#fff",
                      outline: "none"
                    }}
                    required
                    disabled={status === "loading"}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontWeight: 600, color: "rgba(255,255,255,0.9)", fontSize: "1.05rem" }}>Phone number</label>
                  <input
                    type="tel"
                    placeholder="(123) 456 - 7890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: "100%",
                      height: "56px",
                      borderRadius: "100px",
                      border: "1px solid rgba(255,255,255,0.3)",
                      background: "rgba(0,0,0,0.2)",
                      paddingInline: "24px",
                      color: "#fff",
                      outline: "none"
                    }}
                    required
                    disabled={status === "loading"}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontWeight: 600, color: "rgba(255,255,255,0.9)", fontSize: "1.05rem" }}>Company</label>
                  <input
                    type="text"
                    placeholder="EX Facebook"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    style={{
                      width: "100%",
                      height: "56px",
                      borderRadius: "100px",
                      border: "1px solid rgba(255,255,255,0.3)",
                      background: "rgba(0,0,0,0.2)",
                      paddingInline: "24px",
                      color: "#fff",
                      outline: "none"
                    }}
                    required
                    disabled={status === "loading"}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontWeight: 600, color: "rgba(255,255,255,0.9)", fontSize: "1.05rem" }}>Industry Type</label>
                  <input
                    type="text"
                    placeholder="Retail/Pharma/Legal..."
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    style={{
                      width: "100%",
                      height: "56px",
                      borderRadius: "100px",
                      border: "1px solid rgba(255,255,255,0.3)",
                      background: "rgba(0,0,0,0.2)",
                      paddingInline: "24px",
                      color: "#fff",
                      outline: "none"
                    }}
                    required
                    disabled={status === "loading"}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontWeight: 600, color: "rgba(255,255,255,0.9)", fontSize: "1.05rem" }}>Plan interested</label>
                  <div style={{ position: "relative", width: "100%" }}>
                    <select
                      value={plan}
                      onChange={(e) => setPlan(e.target.value)}
                      style={{
                        width: "100%",
                        height: "56px",
                        borderRadius: "100px",
                        border: "1px solid rgba(255,255,255,0.3)",
                        background: "rgba(0,0,0,0.2)",
                        paddingInline: "24px 40px",
                        color: "#fff",
                        outline: "none",
                        appearance: "none",
                        cursor: "pointer"
                      }}
                      required
                      disabled={status === "loading"}
                    >
                      <option value="Regular" style={{ background: "#14130f" }}>Regular</option>
                      <option value="Pro" style={{ background: "#14130f" }}>Pro</option>
                      <option value="Enterprise" style={{ background: "#14130f" }}>Enterprise</option>
                      <option value="Help Me Decide" style={{ background: "#14130f" }}>Help Me Decide</option>
                    </select>
                    <svg
                      style={{
                        position: "absolute",
                        right: "20px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                        width: "16px",
                        height: "16px",
                        color: "rgba(255,255,255,0.6)"
                      }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontWeight: 600, color: "rgba(255,255,255,0.9)", fontSize: "1.05rem" }}>Message</label>
                <textarea
                  placeholder="Write your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{
                    width: "100%",
                    height: "150px",
                    borderRadius: "20px",
                    border: "1px solid rgba(255,255,255,0.3)",
                    background: "rgba(0,0,0,0.2)",
                    padding: "20px 24px",
                    color: "#fff",
                    outline: "none",
                    resize: "none"
                  }}
                  required
                  disabled={status === "loading"}
                />
              </div>

              <button
                type="submit"
                className="btn btn--dark btn--lg"
                data-magnetic
                data-cursor
                style={{
                  background: "#14130f",
                  color: "#fff",
                  width: "auto",
                  minWidth: "180px",
                  borderRadius: "100px",
                  paddingInline: "32px",
                  alignSelf: "flex-start",
                  marginTop: "10px"
                }}
                disabled={status === "loading"}
              >
                <span>{status === "loading" ? "Sending message..." : "Send your message"}</span>
              </button>
              {status === "success" && <p style={{ color: "#22c55e", fontWeight: 600, marginTop: "10px", textAlign: "left" }}>Message sent successfully!</p>}
              {status === "error" && <p style={{ color: "#ef4444", fontWeight: 600, marginTop: "10px", textAlign: "left" }}>Error sending. Please verify your .env.local configuration.</p>}
            </form>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
