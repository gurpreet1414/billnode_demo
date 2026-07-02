"use client";

export default function Quote() {
  return (
    <section className="quote">
      <blockquote className="quote__text" data-reveal="words">
        “Since switching to BillNode, billable hours stopped slipping through the cracks — it basically <em className="serif">pays</em> for itself.”
      </blockquote>
      <div className="quote__by" data-reveal="up">
        <span className="quote__av">WF</span>
        <div><b>William Franky</b><small>Sales Manager, Northwind</small></div>
      </div>
    </section>
  );
}
