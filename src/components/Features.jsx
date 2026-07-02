"use client";

export default function Features() {
  return (
    <section className="services" id="features">
      <div className="services__head">
        <h2 className="h-section" data-reveal="lines">Everything your<br />team needs</h2>
        <p className="services__lead" data-reveal="up">
          Structured tools that keep managers and clients on the same page — without asking for an update.
        </p>
      </div>

      <div className="srv-list" id="srvList">
        <div className="srv" data-cursor>
          <span className="srv__no">01</span>
          <h3 className="srv__name">Time management</h3>
          <p className="srv__desc">Organize all employee time data, distinguishing between tasks and projects effortlessly.</p>
          <span className="srv__plus">+</span>
        </div>
        <div className="srv" data-cursor>
          <span className="srv__no">02</span>
          <h3 className="srv__name">Personalized insights</h3>
          <p className="srv__desc">Deep insight into team productivity and project performance, with strategies for improvement.</p>
          <span className="srv__plus">+</span>
        </div>
        <div className="srv" data-cursor>
          <span className="srv__no">03</span>
          <h3 className="srv__name">Transparent tracking</h3>
          <p className="srv__desc">Track progress and timelines in real time for better, faster decision-making.</p>
          <span className="srv__plus">+</span>
        </div>
        <div className="srv" data-cursor>
          <span className="srv__no">04</span>
          <h3 className="srv__name">Billing &amp; reports</h3>
          <p className="srv__desc">Monitor billed hours, revenue goals and exportable reports — no spreadsheets needed.</p>
          <span className="srv__plus">+</span>
        </div>
      </div>
    </section>
  );
}
