"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Star, Users, Globe, Rocket, Lightbulb, ChartNoAxesColumnIncreasing, Handshake, CodeXml, Settings, ShieldCheck, ShoppingCart, Gift, ArrowRight, ChevronDown } from "lucide-react";
import styles from "./AboutPageContent.module.css";

const heroEase = [0.22, 1, 0.36, 1];

const people = [
  { name: "Nilton Fernandes", role: "Founder & CEO", photo: "/about/team/nilton.webp", photoPosition: "center 48%", description: <>A passion for people, technology<br/>and authentic storytelling.</>, strengths: [[Rocket, "Vision"], [Users, "Leadership"], [Lightbulb, "Innovation"]] },
  { name: "Kevin King", role: "Strategic Director", photo: "/about/team/kevin.webp", photoPosition: "center 15%", description: <>Strategic insight and global<br/>commercial experience.</>, strengths: [[ChartNoAxesColumnIncreasing, "Strategy"], [Handshake, "Partnerships"], [Globe, "Growth"]] },
  { name: "Nasir Muhammad", role: "Chief Technology Officer", photo: "/about/team/nasir.webp", photoPosition: "center 18%", description: <>Leading our technology vision<br/>and product development.</>, strengths: [[CodeXml, "Technology"], [Settings, "Product"], [ShieldCheck, "Security"]] },
  { name: "Shahzeb Muhammad", role: "Ecommerce Director", photo: "/about/team/shahzeb.webp", photoPosition: "center 15%", description: <>Driving our eCommerce strategy<br/>and product offerings.</>, strengths: [[ShoppingCart, "Ecommerce"], [Gift, "Products"], [Users, "Customer Experience"]] },
];
const footerColumns = [
  ["Product", [["How it works", "/how-it-works"], ["Explore", "/explore"], ["For Families", "/for-families"], ["Store", "/store"], ["Pricing", "/pricing"]]],
  ["Company", [["About Us", "/about"], ["Our Mission", "/about"], ["Blog", "#"], ["Careers", "#"]]],
  ["Support", [["Help Centre", "#"], ["Contact Us", "#"], ["FAQs", "#"], ["System Status", "#"]]],
];

function Brand({ light = false }) {
  return <Link href="/" aria-label="Spoken Odyssey home" className={`${styles.brand} ${light ? styles.lightBrand : ""}`}>
    <svg viewBox="0 0 60 60" fill="none" aria-hidden="true"><circle cx="30" cy="30" r="28" stroke="url(#about-brand-gradient)" strokeWidth="2.5"/><g stroke="url(#about-brand-gradient)" strokeWidth="2.5" strokeLinecap="round"><path d="M11 29v2m5-9v16m5-20v24m5-28v32m5-34v36m5-26v16m5-20v24m5-16v8m5-5v2"/></g></svg>
    <span><small>SPOKEN</small><strong>ODYSSEY</strong></span>
  </Link>;
}

function TeamCard({ person }) {
  return <article className={styles.teamCard}>
    <div className={styles.photoFrame}>
      <img src={person.photo} alt={person.name} className={styles.teamPhoto} style={{ objectPosition: person.photoPosition }}/>
    </div>
    <div className={styles.cardBody}>
      <h3>{person.name}</h3>
      <p className={styles.role}>{person.role}</p>
      <p className={styles.bio}>{person.description}</p>
      <ul className={styles.strengths}>{person.strengths.map(([Icon, label]) => <li key={label}><Icon strokeWidth={1.7}/><span>{label}</span></li>)}</ul>
    </div>
  </article>;
}

export default function AboutPageContent() {
  return <div className={styles.aboutPage}>
    <svg className={styles.gradientDefinitions} aria-hidden="true"><defs><linearGradient id="about-brand-gradient" gradientUnits="userSpaceOnUse" x1="0" y1="60" x2="60" y2="0"><stop stopColor="#0075ff"/><stop offset=".5" stopColor="#204dff"/><stop offset="1" stopColor="#8500ff"/></linearGradient><linearGradient id="about-icon-gradient" gradientUnits="userSpaceOnUse" x1="0" y1="24" x2="24" y2="0"><stop stopColor="#0075ff"/><stop offset=".5" stopColor="#204dff"/><stop offset="1" stopColor="#8500ff"/></linearGradient></defs></svg>


    <section className={styles.hero} aria-labelledby="about-heading">
      <div className={styles.heroPhoto}/>
      <motion.div className={styles.heroCopy} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: heroEase }}><p className={styles.eyebrow}>ABOUT SPOKEN ODYSSEY</p><h1 id="about-heading">Real lives.<br/><span className={styles.gradientText}>Lasting impact.</span></h1><p className={styles.heroDescription}>We're building a world where every story<br/>is captured, understood and never forgotten.</p></motion.div>
    </section>

    <section className={styles.values} aria-labelledby="values-heading">
      <ul className={styles.valueList}>
        <li><span className={styles.privacyIcon}><Lock strokeWidth={1.6}/><Star strokeWidth={1.9}/></span><p>Private by design</p></li>
        <li><Users strokeWidth={1.5}/><p>Share with who<br/>matters</p></li>
        <li><Globe strokeWidth={1.5}/><p>Make your story<br/>discoverable</p></li>
      </ul>
      <div className={styles.valuesCopy}><p className={styles.eyebrow}>MORE THAN SOCIAL MEDIA</p><h2 id="values-heading">This isn't about likes.<br/>It's about what <span className={styles.gradientText}>really matters.</span></h2></div>
    </section>

    <section className={styles.team} aria-labelledby="team-heading">
      <div className={styles.teamHeading}><p className={styles.eyebrow}>OUR TEAM</p><h2 id="team-heading">The people behind <span className={styles.gradientText}>Spoken Odyssey.</span></h2></div>
      <div className={styles.teamGrid}>{people.map(person => <TeamCard key={person.name} person={person}/>)}</div>
    </section>

    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.footerBrand}><Brand light/><p>Every life is an Odyssey.<br/>Start capturing yours.</p></div>
        <div className={styles.footerColumns}>{footerColumns.map(([title, links]) => <div key={title}><h3>{title}</h3><ul>{links.map(([label, href]) => <li key={label}><Link href={href}>{label}</Link></li>)}</ul></div>)}</div>
        <div className={styles.newsletter}><h3>Stay in the <span>journey.</span></h3><p>Get product updates, new features and<br className={styles.desktopBreak}/> inspiring stories straight to your inbox.</p><div className={styles.emailField}><input type="email" aria-label="Your email address" placeholder="Your email address"/><button type="button" className={styles.primaryButton}>Subscribe <ArrowRight/></button></div></div>
      </div>
      <div className={styles.footerBottom}><div className={styles.legal}><p>Â© 2026 Spoken Odyssey. All rights reserved.</p><div>{["Privacy Policy", "Terms of Service", "Cookies", "Legal", "Sitemap"].map(label => <Link href="#" key={label}>{label}</Link>)}</div></div><div className={styles.badges}><img src="/play-store-badge.svg" alt="Get it on Google Play" width="93" height="31"/><img src="/app-store-badge.svg" alt="Download on the App Store" width="90" height="31"/><span className={styles.language}><Globe strokeWidth={1.5}/> English <ChevronDown/></span></div></div>
    </footer>
  </div>;
}
