"use client";

export default function Inside() {
  return (
    <section className="work" id="inside">
      <div className="work__pin" id="workPin">
        <div className="work__track" id="workTrack">
          <div className="work__intro">
            <span className="eyebrow"><i></i> Inside BillNode</span>
            <h2 className="work__h">One app,<br />every view</h2>
            <p>From first tracked hour to final invoice — keep scrolling to take the tour.</p>
          </div>

          <article className="wcard" data-cursor="view">
            <div className="wcard__img">
              <span className="wcard__idx">01</span>
              <img src="/assets/s1111.png" alt="BillNode Reports view" decoding="async" />
            </div>
            <div className="wcard__meta"><h3>Reports</h3><span>Searchable &amp; exportable</span></div>
          </article>

          <article className="wcard" data-cursor="view">
            <div className="wcard__img">
              <span className="wcard__idx">02</span>
              <img src="/assets/s15.png" alt="BillNode Dashboard Stats" decoding="async" />
            </div>
            <div className="wcard__meta"><h3>Dashboard stats</h3><span>All stats at your fingertips</span></div>
          </article>

          <article className="wcard" data-cursor="view">
            <div className="wcard__img">
              <span className="wcard__idx">03</span>
              <img src="/assets/s2.png" alt="BillNode Global Notice Board" decoding="async" />
            </div>
            <div className="wcard__meta"><h3>Global notice board</h3><span>Keep everyone aligned</span></div>
          </article>

          <article className="wcard" data-cursor="view">
            <div className="wcard__img">
              <span className="wcard__idx">04</span>
              <img src="/assets/subscriptions.png" alt="BillNode Subscriptions management" decoding="async" />
            </div>
            <div className="wcard__meta"><h3>subscriptions</h3><span>Monitor renewals and payments</span></div>
          </article>

          <article className="wcard" data-cursor="view">
            <div className="wcard__img">
              <span className="wcard__idx">05</span>
              <img src="/assets/time_entry_listing.png" alt="BillNode Time Entry Listing" decoding="async" />
            </div>
            <div className="wcard__meta"><h3>Time Entry</h3><span>Track and manage work hours</span></div>
          </article>

          <article className="wcard" data-cursor="view">
            <div className="wcard__img">
              <span className="wcard__idx">06</span>
              <img src="/assets/locations_listing.png" alt="BillNode Location Listing" decoding="async" />
            </div>
            <div className="wcard__meta"><h3>Client locations</h3><span>Organize and manage client locations</span></div>
          </article>
          

          <article className="wcard" data-cursor="view">
            <div className="wcard__img">
              <span className="wcard__idx">07</span>
              <img src="/assets/s4.png" alt="BillNode Admin Reports" decoding="async" />
            </div>
            <div className="wcard__meta"><h3>Admin reports</h3><span>Data-driven decisions</span></div>
          </article>

          <article className="wcard" data-cursor="view">
            <div className="wcard__img">
              <span className="wcard__idx">08</span>
              <img src="/assets/s5.png" alt="BillNode monitor at a glance" decoding="async" />
            </div>
            <div className="wcard__meta"><h3>Monitor &amp; manage</h3><span>Pending, billable &amp; priority</span></div>
          </article>

          <a href="#contact" className="work__end" data-cursor>
            <span>See it<br />live</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
