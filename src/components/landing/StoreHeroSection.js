"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Camera, Brain, Feather, Truck, ShieldCheck, Gift, Globe, ChevronDown } from "lucide-react";
import styles from "./StoreHeroSection.module.css";

const heroEase = [0.22, 1, 0.36, 1];

const features = [
  [Camera, "Capture naturally", "Photos, video and audio with a single touch."],
  [Brain, "AI turns moments into stories", "Automatically organised in your Odyssey."],
  [Feather, "Lightweight & comfortable", "Designed for everyday use, all-day comfort."],
];
const moments = [
  ["travel", "Travel", "See the places", "that move you.", "A hiker overlooking the Amalfi Coast at sunset"],
  ["family", "Family", "Keep the everyday", "moments that matter.", "A father wearing AI glasses carrying his daughter on his shoulders"],
  ["events", "Life events", "Relive the energy", "and the people.", "A woman wearing AI glasses enjoying a live concert"],
];
const columns = [
  ["Product", [["How it works", "/how-it-works"], ["Explore", "/explore"], ["For Families", "/for-families"], ["Store", "/store"], ["Pricing", "/pricing"]]],
  ["Company", [["About Us", "/about"], ["Our Mission", "/about"], ["Blog", "#"], ["Careers", "#"]]],
  ["Support", [["Help Centre", "#"], ["Contact Us", "#"], ["FAQs", "#"], ["System Status", "#"]]],
];

function Brand({ light = false }) {
  return <Link href="/" className={`${styles.brand} ${light ? styles.lightBrand : ""}`} aria-label="Spoken Odyssey home">
    <svg viewBox="0 0 44 44" fill="none" aria-hidden="true"><defs><linearGradient id={light ? "store-logo-light" : "store-logo"} x1="3" y1="6" x2="40" y2="38" gradientUnits="userSpaceOnUse"><stop stopColor="#0055ff"/><stop offset=".5" stopColor="#2544ff"/><stop offset="1" stopColor="#8500ff"/></linearGradient></defs><ellipse cx="22" cy="22" rx="18.7" ry="20" stroke={`url(#${light ? "store-logo-light" : "store-logo"})`} strokeWidth="3.6" transform="rotate(-25 22 22)"/><ellipse cx="22" cy="22" rx="13.5" ry="14.8" stroke={`url(#${light ? "store-logo-light" : "store-logo"})`} strokeWidth="3.4" transform="rotate(28 22 22)"/></svg>
    <span>SPOKEN<br/><strong>ODYSSEY</strong></span>
  </Link>;
}

export default function StoreHeroSection() {
  return <div className={styles.store}>
    <section className={styles.hero} aria-labelledby="store-heading">
      <div className={styles.heroPhoto}/>

      <motion.div className={styles.heroCopy} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: heroEase }}>
        <p className={styles.eyebrow}>AI GLASSES</p>
        <h1 id="store-heading">See life<br/><span className={styles.gradientText}>differently.</span></h1>
        <p className={styles.heroDescription}>Capture, remember and share<br/>the moments that matter —<br/>hands free.</p>
      </motion.div>
    </section>

    <section className={styles.perspective} aria-labelledby="perspective-heading">
      <img className={styles.perspectivePhoto} src="/store/reference/perspective.webp" alt="A hiker wearing Spoken Odyssey AI glasses beside an alpine lake" width="611" height="363"/>
      <div className={styles.perspectiveCopy}>
        <p className={styles.eyebrow}>BUILT FOR REAL LIFE</p>
        <h2 id="perspective-heading">Your moments<br/>in <span className={styles.gradientText}>your perspective.</span></h2>
        <p className={styles.description}>Spoken Odyssey AI Glasses let you capture photos, video and audio naturally, so you can stay present while your experiences are safely saved to your Odyssey.</p>
        <ul className={styles.features}>{features.map(([Icon, title, description]) => <li key={title}><span className={styles.featureIcon}><Icon strokeWidth={1.7}/></span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ul>
      </div>
    </section>

    <section className={styles.moments} aria-label="Made for your moments">
      {moments.map(([image, label, firstLine, secondLine, alt]) => (
        <figure key={image}>
          <img src={`/store/photos/${image}.webp`} alt={alt} width="1536" height="1024" loading="lazy"/>
          <figcaption className={styles.momentCaption}>
            <p>{label}</p>
            <h3>{firstLine}<br/>{secondLine}</h3>
          </figcaption>
        </figure>
      ))}
    </section>

    <section className={styles.product} aria-labelledby="product-heading">
      <img className={styles.kitPhoto} src="/store/reference/kit.webp" alt="Spoken Odyssey AI glasses with carrying case, cleaning cloth, charging cable and quick start guide" width="625" height="262"/>
      <div className={styles.productCopy}>
        <p className={styles.eyebrow}>SPOKEN ODYSSEY AI GLASSES</p>
        <h2 id="product-heading">One device.<br/>A lifetime of moments.</h2>
        <p className={styles.price}>CHF 299</p>
        <a className={`${styles.gradientButton} ${styles.cartButton}`} href="https://odyssey-store-ten.vercel.app" target="_blank" rel="noopener noreferrer">Add to Cart&nbsp; CHF 299 <ArrowRight/></a>
        <ul className={styles.benefits}>{[[Truck, "Free Shipping", "Switzerland & EU"], [ShieldCheck, "12-Month", "Subscription Included"], [Gift, "Premium", "Gift Box Included"]].map(([Icon,title,description]) => <li key={title}><Icon strokeWidth={1.7}/><div><h3>{title}</h3><p>{description}</p></div></li>)}</ul>
      </div>
    </section>

    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.footerBrand}><Brand light/><p>Every life is an Odyssey.<br/>Start capturing yours.</p></div>
        <div className={styles.footerColumns}>{columns.map(([title, items]) => <div key={title}><h3>{title}</h3><ul>{items.map(([label, href]) => <li key={label}><Link href={href}>{label}</Link></li>)}</ul></div>)}</div>
        <div className={styles.newsletter}><h3>Stay in the journey.</h3><p>Get product updates, new features and inspiring stories straight to your inbox.</p><div className={styles.subscribe}><input type="email" aria-label="Your email address" placeholder="Your email address"/><button type="button" className={styles.gradientButton}>Subscribe <ArrowRight/></button></div></div>
      </div>
      <div className={styles.footerBottom}>
        <div className={styles.legal}><span>© 2026 Spoken Odyssey. All rights reserved.</span>{["Privacy Policy", "Terms of Service", "Cookies", "Legal", "Sitemap"].map(label => <Link href="#" key={label}>{label}</Link>)}</div>
        <div className={styles.badges}><img src="/play-store-badge.svg" alt="Get it on Google Play" width="90" height="29"/><img src="/app-store-badge.svg" alt="Download on the App Store" width="88" height="29"/><span className={styles.language}><Globe/> English <ChevronDown/></span></div>
      </div>
    </footer>
  </div>;
}
