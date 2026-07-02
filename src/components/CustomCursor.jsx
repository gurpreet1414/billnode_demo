"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !finePointer) return;

    const cur = cursorRef.current;
    const dot = dotRef.current;
    if (!cur || !dot) return;

    const cx = gsap.quickTo(cur, "x", { duration: 0.5, ease: "power3" });
    const cy = gsap.quickTo(cur, "y", { duration: 0.5, ease: "power3" });
    const dx = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });

    const handlePointerType = (e) => {
      if (e.pointerType === "touch" || e.pointerType === "pen") {
        document.body.classList.add("cursor-disabled");
      } else if (e.pointerType === "mouse") {
        document.body.classList.remove("cursor-disabled");
      }
    };

    const onPointerMove = (e) => {
      handlePointerType(e);
      if (e.pointerType !== "touch" && e.pointerType !== "pen") {
        cx(e.clientX);
        cy(e.clientY);
        dx(e.clientX);
        dy(e.clientY);
      }
    };

    const onPointerLeave = () => {
      cur.classList.add("is-hidden");
      dot.classList.add("is-hidden");
    };

    const onPointerEnter = () => {
      cur.classList.remove("is-hidden");
      dot.classList.remove("is-hidden");
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", handlePointerType);
    window.addEventListener("pointerover", handlePointerType);
    document.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("pointerenter", onPointerEnter);

    const bindCursorHover = () => {
      const elements = document.querySelectorAll("[data-cursor]");
      elements.forEach((el) => {
        if (el.dataset._cb) return;
        el.dataset._cb = "1";
        const view = el.getAttribute("data-cursor") === "view";
        
        const onEnter = () => {
          document.body.classList.add(view ? "cursor-view" : "cursor-hover");
          if (view) {
            const label = cur.querySelector(".cursor__label");
            if (label) label.textContent = "View";
          }
        };

        const onLeave = () => {
          document.body.classList.remove("cursor-hover", "cursor-view");
        };

        el.addEventListener("pointerenter", onEnter);
        el.addEventListener("pointerleave", onLeave);

        el._onEnter = onEnter;
        el._onLeave = onLeave;
      });
    };

    bindCursorHover();
    window.__bindCursor = bindCursorHover;

    const observer = new MutationObserver(bindCursorHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", handlePointerType);
      window.removeEventListener("pointerover", handlePointerType);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("pointerenter", onPointerEnter);
      observer.disconnect();
      window.__bindCursor = null;
      document.body.classList.remove("cursor-hover", "cursor-view", "cursor-disabled");
      
      const elements = document.querySelectorAll("[data-cursor]");
      elements.forEach((el) => {
        if (el._onEnter) el.removeEventListener("pointerenter", el._onEnter);
        if (el._onLeave) el.removeEventListener("pointerleave", el._onLeave);
        delete el.dataset._cb;
        delete el._onEnter;
        delete el._onLeave;
      });
    };
  }, []);

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div className="cursor" ref={cursorRef} aria-hidden="true">
        <span className="cursor__label" />
      </div>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
    </>
  );
}
