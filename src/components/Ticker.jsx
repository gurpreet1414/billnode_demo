"use client";

export default function Ticker() {
  return (
    <section className="ticker" aria-hidden="true">
      <div className="ticker__track" id="ticker">
        <span>Time entry</span><b>✦</b><span>Projects</span><b>✦</b><span>Reports</span><b>✦</b><span>Billing</span><b>✦</b><span>Approvals</span><b>✦</b><span>Invoicing</span><b>✦</b>
      </div>
    </section>
  );
}
