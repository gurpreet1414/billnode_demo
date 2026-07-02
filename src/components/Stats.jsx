"use client";

export default function Stats() {
  return (
    <section className="stats">
      <div className="stat" data-reveal="up">
        <span className="stat__num" data-count="21" data-suffix="×">0</span>
        <span className="stat__lab">Faster first report</span>
      </div>
      <div className="stat" data-reveal="up">
        <span className="stat__num" data-count="40" data-suffix="%">0</span>
        <span className="stat__lab">Less admin time</span>
      </div>
      <div className="stat" data-reveal="up">
        <span className="stat__num" data-count="12" data-suffix="k+">0</span>
        <span className="stat__lab">Hours tracked daily</span>
      </div>
      <div className="stat" data-reveal="up">
        <span className="stat__num" data-count="49" data-divide="10" data-suffix="★">0</span>
        <span className="stat__lab">Average team rating</span>
      </div>
    </section>
  );
}
