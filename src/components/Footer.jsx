export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__col">
          <h5>Product</h5>
          <a href="/#inside" data-cursor>Features</a>
          <a href="/#pricing" data-cursor>Pricing</a>
          <a href="/#process" data-cursor>How it Works</a>
        </div>
        <div className="footer__col">
          <h5>Company</h5>
          <a href="/contact" data-cursor>Contact us</a>
          <a href="mailto:info@billnode.com" data-cursor>info@billnode.com</a>
        </div>

        <div className="footer__col footer__col--r">
          <h5>Support</h5>
          <span className="footer__clock">We reply within</span>
          <span className="footer__loc">24 hours</span>
        </div>
      </div>

      <div className="footer__mark" id="footMark">BillNode</div>

      <div className="footer__legal">
        <span>© 2026 BillNode — All rights reserved.</span>
        <span>Time-entry, simplified.</span>
      </div>
    </footer>
  );
}
