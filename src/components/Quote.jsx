"use client";

import { useState, useEffect, useCallback } from "react";

const testimonials = [
  {
    text: "Since switching to BillNode, billable hours stopped slipping through the cracks — it basically <em class=\"serif\">pays</em> for itself.",
    initials: "WF",
    name: "William Franky",
    role: "Sales Manager, Northwind",
  },
  {
    text: "BillNode transformed how we track time across remote teams. It's the clarity we didn't know we were missing.",
    initials: "AK",
    name: "Amara Kone",
    role: "Ops Lead, Bridgepoint",
  },
  {
    text: "We cut admin time by 40% in the first month. The reporting alone saves us hours every Friday.",
    initials: "DJ",
    name: "David Jung",
    role: "CTO, Luminant Labs",
  },
  {
    text: "Finally, a time tracker that doesn't get in the way. Onboarding was seamless and the team actually uses it.",
    initials: "SR",
    name: "Sofia Rivas",
    role: "PM, Collective Works",
  },
];

export default function Quote() {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(null);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next]);

  const onTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const onTouchEnd = (e) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
    setTouchStart(null);
  };

  return (
    <section className="quote">
      <div className="quote__carousel" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {testimonials.map((t, i) => (
          <div key={i} className={`quote__slide${i === current ? " is-active" : ""}`}>
            <blockquote
              className="quote__text"
              dangerouslySetInnerHTML={{ __html: `“${t.text}”` }}
            />
            <div className="quote__by">
              <span className="quote__av">{t.initials}</span>
              <div>
                <b>{t.name}</b>
                <small>{t.role}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="quote__dots">
        {testimonials.map((_, i) => (
          <button
            key={i}
            className={`quote__dot${i === current ? " is-active" : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}