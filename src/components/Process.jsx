"use client";

export default function Process() {
  return (
    <section className="process" id="process">
      <div className="process__intro">
        <span className="eyebrow" data-reveal="up"><i></i> How it Works</span>
        <h2 className="h-section" data-reveal="lines">Up and running<br />in minutes</h2>
      </div>
      <div className="stack">
        <article className="scard" style={{ "--i": 0 }}>
          <div className="scard__no">01</div>
          <div className="scard__body">
            <h3>Create your workspace</h3>
            <p>Set up your account, brand your portal and invite your team — everything feels lightweight and effortless.</p>
          </div>
          <span className="scard__tag">Setup · Branding</span>
        </article>
        <article className="scard" style={{ "--i": 1 }}>
          <div className="scard__no">02</div>
          <div className="scard__body">
            <h3>Add projects &amp; track</h3>
            <p>Create projects, tag tasks and log hours against the work that actually matters — in one tap.</p>
          </div>
          <span className="scard__tag">Projects · Tracking</span>
        </article>
        <article className="scard" style={{ "--i": 2 }}>
          <div className="scard__no">03</div>
          <div className="scard__body">
            <h3>Review &amp; approve</h3>
            <p>Managers see what's billable, what's done and where every hour went — and approve in seconds.</p>
          </div>
          <span className="scard__tag">Approvals · QA</span>
        </article>
        <article className="scard" style={{ "--i": 3 }}>
          <div className="scard__no">04</div>
          <div className="scard__body">
            <h3>Bill &amp; report</h3>
            <p>Turn tracked hours into clean invoices and shareable reports — then watch the revenue add up.</p>
          </div>
          <span className="scard__tag">Billing · Reports</span>
        </article>
      </div>
    </section>
  );
}
