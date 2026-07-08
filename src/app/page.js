"use client";
import { useEffect, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import Lenis from "lenis";

import CustomCursor from "@/components/CustomCursor";
import Loader from "@/components/Loader";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import Manifesto from "@/components/Manifesto";
import Features from "@/components/Features";
import Inside from "@/components/Inside";
import Stats from "@/components/Stats";
import Process from "@/components/Process";
import Pricing from "@/components/Pricing";
import Quote from "@/components/Quote";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  const [loaderFinished, setLoaderFinished] = useState(false);

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
      lenis.stop();
    }

    const anchorClicks = [];
    $$('a[href^="#"], a[href^="/#"]').forEach((a) => {
      const onClick = (e) => {
        const href = a.getAttribute("href");
        const id = href.startsWith("/#") ? href.slice(1) : href;
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
      if (lenis) {
        lenis.start();
      }

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

      const manifestoEl = $("#manifesto");
      if (manifestoEl) {
        const words = wrapWords(manifestoEl);
        gsap.to(words, {
          color: "#14130f",
          ease: "none",
          stagger: 0.4,
          scrollTrigger: { trigger: manifestoEl, start: "top 78%", end: "bottom 62%", scrub: true },
        });
      }

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
      gsap.to(".hero__float", { yPercent: -16, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.5 } });
      gsap.utils.toArray(".hfloat").forEach((el, i) =>
        gsap.to(el, { yPercent: 18, duration: 2.4 + i * 0.4, repeat: -1, yoyo: true, ease: "sine.inOut" })
      );

      gsap.from(".srv", { y: 44, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.09, scrollTrigger: { trigger: ".srv-list", start: "top 82%" } });

      const workTrack = $("#workTrack");
      const workSection = $(".work");
      if (workTrack && workSection) {

        const images = workTrack.querySelectorAll("img");

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
        const dist = () => Math.max(0, workTrack.scrollWidth - window.innerWidth);
        const st = gsap.to(workTrack, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: workSection,
            start: "top top",
            end: () => "+=" + (dist() + window.innerWidth),
            pin: ".work__pin",
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        $$(".wcard__img").forEach((img) =>
          gsap.fromTo(
            img,
            { scale: 1.12 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: img, containerAnimation: st, start: "left right", end: "center center", scrub: true },
            }
          )
        );
        $$(".wcard__idx").forEach((idx) =>
          gsap.fromTo(
            idx,
            { yPercent: 60, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              ease: "power2.out",
              scrollTrigger: { trigger: idx, containerAnimation: st, start: "left 90%", end: "left 55%", scrub: true },
            }
          )
        );
      }

      $$("[data-count]").forEach((el) => {
        const end = parseFloat(el.getAttribute("data-count"));
        const div = parseFloat(el.getAttribute("data-divide")) || 1;
        const dec = div > 1 ? 1 : 0;
        const o = { v: 0 };
        gsap.to(o, {
          v: end,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
          onUpdate: () => {
            el.textContent = (o.v / div).toFixed(dec);
          },
        });
      });

      const m = $("#footMark");
      if (m) {
        gsap.to(m, {
          backgroundPosition: "0% 0",
          ease: "none",
          scrollTrigger: { trigger: ".footer", start: "top 92%", end: "bottom bottom", scrub: 0.6 },
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
      <Loader onComplete={() => setLoaderFinished(true)} />
      <Header />
      <main id="top">
        <Hero />
        <Ticker />
        <Manifesto />
        <Features />
        <Inside />
        <Stats />
        <Process />
        <Pricing />
        <Quote />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
