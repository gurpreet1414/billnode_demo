"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Loader({ onComplete }) {
  const loaderRef = useRef(null);
  const numRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const loader = loaderRef.current;
    const num = numRef.current;
    const bar = barRef.current;

    if (reduce || !loader || !num || !bar) {
      if (loader) loader.style.display = "none";
      onComplete();
      return;
    }

    const o = { v: 0 };
    gsap.to(o, {
      v: 100,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => {
        if (num) num.textContent = Math.round(o.v);
        if (bar) bar.style.width = o.v + "%";
      },
      onComplete: () => {
        gsap.to(".loader__inner, .loader__bar", {
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
        });
        gsap.to(loader, {
          yPercent: -100,
          duration: 1.1,
          ease: "expo.inOut",
          delay: 0.25,
          onComplete: () => {
            loader.style.display = "none";
            onComplete();
          },
        });
      },
    });
  }, [onComplete]);

  return (
    <div className="loader" ref={loaderRef} id="loader">
      <div className="loader__inner">
        <div className="loader__mark">BillNode</div>
        <div className="loader__count">
          <span ref={numRef} id="loaderNum">0</span><i>%</i>
        </div>
      </div>
      <div className="loader__bar">
        <span ref={barRef} id="loaderBar"></span>
      </div>
    </div>
  );
}
