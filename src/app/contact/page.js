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
      <Header className="nav--contact" />
      <main id="top">
        {/* ============== DISTINCT SPLIT HERO WITH FLOATING CONTACT DETAILS ============== */}
        <section className="hero contact-hero-grid items-center pt-36 pb-16 min-h-svh relative overflow-hidden" id="hero" style={{ background: "var(--orange)" }}>
          <div className="hero__bg" aria-hidden="true">
            <span className="blob blob--1"></span>
            <span className="blob blob--2"></span>
          </div>

          {/* Decorative floating dots/circles */}
          <div className="absolute right-[5%] bottom-[12%] w-[80px] h-[80px] rounded-full border border-white/15 hidden lg:block" aria-hidden="true"></div>
          <div className="absolute left-[40%] bottom-[40%] w-6 h-6 rounded-full bg-white/10 blur-[2px] hidden lg:block" aria-hidden="true"></div>
          <div className="absolute right-[45%] top-[25%] w-8 h-8 rounded-full bg-white/10 blur-[3px] hidden lg:block" aria-hidden="true"></div>

          {/* Left Column: Get In Touch */}
          <div className="flex flex-col gap-6 w-full text-left z-10">
            <span className="text-xs lg:text-sm font-bold tracking-wider text-white/80 uppercase" data-reveal="up">
              Get in touch
            </span>

            <h1 className="text-6xl lg:text-8xl font-semibold leading-[1.02] tracking-tight text-white animate-text" style={{ margin: "0" }} data-reveal="up">
              <span className="block">Send us a</span>
              <span className="block">direct <span className="serif text-[#14130f] font-normal italic lowercase">message.</span></span>
            </h1>

            <p className="text-base lg:text-lg font-medium text-white/90 max-w-[48ch]" data-reveal="lines">
              Submit your query
            </p>

            <div className="flex flex-col gap-5 mt-4" data-reveal="fade">
              {/* Email us */}
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-11 h-11 rounded-[16px] bg-white/15 text-white shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"></path>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">Email us</span>
                  <a href="mailto:info@billnode.com" className="white-anchor text-sm lg:text-base font-bold text-white hover:text-[#14130f] transition-colors">
                    info@billnode.com
                  </a>
                </div>
              </div>

              {/* Response time */}
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-11 h-11 rounded-[16px] bg-white/15 text-white shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">Response time</span>
                  <span className="text-sm lg:text-base font-bold text-white">
                    Within 1 business day
                  </span>
                </div>
              </div>

              {/* Studio */}
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-11 h-11 rounded-[16px] bg-white/15 text-white shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"></path>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">Studio</span>
                  <span className="text-sm lg:text-base font-bold text-white">
                    Lisbon, Portugal
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Message Form inside a solid white card */}
          <div data-reveal="fade" className="flex justify-center items-center w-full mt-8 lg:mt-0 z-10">
            <div
              style={{
                width: "100%",
                maxWidth: "520px",
                padding: "44px 40px",
                background: "#ffffff",
                borderRadius: "28px",
                border: "1px solid rgba(20,19,15,0.08)",
                boxShadow: "0 40px 90px -30px rgba(28,22,16,0.15)",
              }}
              className="flex flex-col gap-5 text-left relative z-10"
            >
              <div className="flex flex-col gap-8">

                <div className="w-16 h-16 rounded-3xl bg-orange-50 flex items-center justify-center">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ff5a1f"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16v16H4z" />
                    <path d="m22 6-10 7L2 6" />
                  </svg>
                </div>

                <div className="space-y-3">
                  <p className="text-[12px] font-bold uppercase tracking-[0.25em] text-slate-500">
                    START A CONVERSATION
                  </p>

                  <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
                    Interested in our product?
                  </h2>

                  <p className="text-lg leading-8 text-slate-600">
                    Have questions about features, pricing, or implementation? Send us an email and we'll get back to you within one business day.
                  </p>
                </div>

                <a
                  href="mailto:info@billnode.com"
                  className="btn btn--orange btn--lg w-full justify-center shadow-md"
                >
                  <span>Send us an Email →</span>
                </a>

                <div className="border-t border-slate-200 pt-6">
                  <span className="text-sm font-bold text-slate-800">
                    Helpful details to include
                  </span>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <span className="bg-slate-100 text-slate-600 rounded-full px-5 py-2 text-sm font-medium">
                      Channel link
                    </span>

                    <span className="bg-slate-100 text-slate-600 rounded-full px-5 py-2 text-sm font-medium">
                      Service needed
                    </span>

                    <span className="bg-slate-100 text-slate-600 rounded-full px-5 py-2 text-sm font-medium">
                      Timeline
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ============== OFFICE CARD SHOWCASE ============== */}
        {/* <section className="services" style={{ background: "var(--bg)" }}>
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
        </section> */}

        {/* ============== TICKER ============== */}
        <section className="ticker" aria-hidden="true" style={{ marginBlock: "0px 0" }}>
          <div className="ticker__track" id="ticker">
            <span>Always connected</span><b>✦</b><span>Active support</span><b>✦</b><span>Drop us a line</span><b>✦</b><span>24h response</span><b>✦</b>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
