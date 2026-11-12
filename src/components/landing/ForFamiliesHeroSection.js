"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Camera, Users, Shield, Brain, PanelsTopLeft, Heart, Sparkles, Mic, Lightbulb, FileText, ChartNoAxesCombined, ChevronLeft, ChevronRight, LayoutGrid, Paintbrush, Flower } from "lucide-react";
import styles from "./ForFamiliesHeroSection.module.css";

const heroEase = [0.22, 1, 0.36, 1];

const benefits = [
  [Camera, "Capture", <>Photos, videos<br/>and voice.</>],
  [Users, "Connect", <>Family and<br/>friends.</>],
  [Shield, "Secure", <>Private and<br/>encrypted.</>],
  [Brain, "AI Integrated", <>Turn moments<br/>into insights.</>],
  [PanelsTopLeft, "Accessible", <>On any device.</>],
  [Heart, "For Everyone", <>Built for families.</>],
];
const tools = [
  { title: "AI Historian", icon: Sparkles, image: "historian", color: "purple", description: "Turn your photos, videos and voice notes into beautiful stories." },
  { title: "AI Interviewer", icon: Mic, image: "interviewer", color: "blue", description: "Get guided questions to capture memories, values and life lessons." },
  { title: "Smart Suggestions", icon: Lightbulb, image: "suggestions", color: "pink", description: "Receive personalised questions and prompts to uncover new stories." },
  { title: "Auto Transcription", icon: FileText, image: "transcription", color: "blue", description: "Automatically transcribe voice notes and videos into searchable text." },
  { title: "Memory Insights", icon: ChartNoAxesCombined, image: "insights", color: "teal", description: "Discover themes, milestones and trends across your family’s journey." },
];
const featureTiles = [["Recent Moments", "recent-moments"], ["AI Historian", "historian"], ["Family Map", "family-map"], ["Family Q&A", "family-qa"]];
const tabs = ["My Features", "Layout", "Theme"];

export default function ForFamiliesHeroSection() {
  const [slide, setSlide] = useState(0);
  const [tab, setTab] = useState("My Features");
  const [enabled, setEnabled] = useState([true, true, true, true]);
  const [layout, setLayout] = useState("Grid");
  const [theme, setTheme] = useState("Ocean");
  const rotate = (step) => setSlide(current => (current + step + tools.length) % tools.length);
  const visibleTools = [...tools.slice(slide), ...tools.slice(0, slide)];
  const moveTab = (step) => setTab(current => tabs[(tabs.indexOf(current) + step + tabs.length) % tabs.length]);

  return <div className={styles.familyPage}>


    <section className={styles.hero} aria-labelledby="family-heading">
      <div className={styles.heroPhoto}/>
      <motion.div className={styles.heroCopy} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: heroEase }}>
        <p className={styles.eyebrow}>FAMILY SPACE</p>
        <h1 id="family-heading">Because these<br/>moments matter<br/><span className={styles.gradientText}>for a lifetime.</span></h1>
        <p className={styles.heroDescription}>Create a private space to capture, celebrate and keep<br className={styles.desktopBreak}/> your family’s story together — for today and for<br className={styles.desktopBreak}/> generations to come.</p>
        <Link href="/signup" id="families-create-btn" className={`${styles.primaryButton} ${styles.heroButton}`}>Create your Family Space <ArrowRight/></Link>
      </motion.div>
    </section>

    <section className={styles.familySpace} aria-labelledby="family-space-heading">
      <div className={styles.spaceCopy}>
        <p className={styles.eyebrow}>YOUR FAMILY SPACE</p>
        <h2 id="family-space-heading">All your family’s<br/>moments, stories<br/>and people <span className={styles.gradientText}>together.</span></h2>
        <ul className={styles.benefits}>{benefits.map(([Icon, title, description]) => <li key={title}><span className={styles.benefitIcon}><Icon strokeWidth={1.45}/></span><h3>{title}</h3><p>{description}</p></li>)}</ul>
      </div>
      <img className={styles.dashboard} src="/families/dashboard.webp" alt="Family Space displayed on a laptop, with recent moments, family members, a calendar, milestones and a family map" width="587" height="495"/>
    </section>

    <section className={styles.aiSection} aria-labelledby="ai-heading">
      <div className={styles.aiIntro}>
        <p className={styles.eyebrow}>AI BRINGS YOUR FAMILY’S STORY TO LIFE</p>
        <h2 id="ai-heading">Powerful AI tools for deeper connections.</h2>
        <p>Transform everyday moments into lasting stories, gain meaningful insights and spark conversations<br className={styles.desktopBreak}/> with AI — designed to bring your family closer.</p>
      </div>
      <div className={styles.carousel}>
        <button type="button" className={`${styles.carouselArrow} ${styles.previous}`} onClick={() => rotate(-1)} aria-label="Previous AI tools"><ChevronLeft/></button>
        <div className={styles.toolCards}>{visibleTools.map(({ title, icon: Icon, image, color, description }) => <article className={styles.toolCard} key={title}>
          <div className={styles.toolTitle}><span className={`${styles.toolIcon} ${styles[color]}`}><Icon strokeWidth={1.4}/></span><h3>{title}</h3></div>
          <img src={`/families/${image}.webp`} alt={title === "Auto Transcription" ? "An audio recording and transcript on a laptop" : title === "Memory Insights" ? "A family enjoying a mountain lake together" : title === "AI Historian" ? "A grandfather sharing memories with his granddaughter" : title === "AI Interviewer" ? "A mother talking with her son" : "Parents and their daughter discovering stories on a tablet"} width="155" height="101" loading="lazy"/>
          <p>{description}</p>
        </article>)}</div>
        <button type="button" className={`${styles.carouselArrow} ${styles.next}`} onClick={() => rotate(1)} aria-label="Next AI tools"><ChevronRight/></button>
      </div>
      <div className={styles.dots} aria-label="AI tool slides">{tools.map((tool, index) => <button key={tool.title} type="button" aria-label={`Show ${tool.title} first`} aria-pressed={slide === index} className={slide === index ? styles.activeDot : ""} onClick={() => setSlide(index)}/>)}</div>
    </section>

    <section className={styles.customize} aria-labelledby="customize-heading">
      <img className={styles.togetherPhoto} src="/families/together.webp" alt="A mother and daughter wearing headphones and smiling over a laptop" width="344" height="382" loading="lazy"/>
      <div className={styles.customizeContent}>
        <div className={styles.customizeIntro}><p className={styles.eyebrow}>MAKE IT YOUR OWN</p><h2 id="customize-heading">Make your Family Space your own.</h2><p>Choose the features that matter to your family, arrange them your way and create a space that truly feels like home.</p></div>
        <div className={styles.customizeControls}>
          <div className={styles.settingList}>{[[Flower, "My Features", "Add or remove features to show what matters most.", "blue"], [LayoutGrid, "Layout", "Choose a layout that fits your style.", "purple"], [Paintbrush, "Theme", "Pick a look and feel to make it your own.", "teal"]].map(([Icon, title, description, color]) => <button type="button" key={title} onClick={() => setTab(title)} aria-pressed={tab === title}><span className={`${styles.settingIcon} ${styles[color]}`}><Icon strokeWidth={1.3}/></span><span><strong>{title}</strong><small>{description}</small></span><ChevronRight/></button>)}</div>
          <div className={`${styles.previewPanel} ${theme === "Lavender" ? styles.lavender : theme === "Forest" ? styles.forest : ""}`}>
            <div role="tablist" aria-label="Family Space customization" className={styles.tabs}>{tabs.map(name => <button type="button" role="tab" id={`family-tab-${name.replaceAll(' ', '-').toLowerCase()}`} aria-controls="family-customization-panel" aria-selected={tab === name} key={name} onClick={() => setTab(name)}>{name}</button>)}</div>
            <div role="tabpanel" id="family-customization-panel" aria-labelledby={`family-tab-${tab.replaceAll(' ', '-').toLowerCase()}`} className={styles.tabPanel}>
              <h3>{tab === "My Features" ? "Add or remove features" : tab === "Layout" ? "Arrange your Family Space" : "Find your family’s look"}</h3>
              <p>{tab === "My Features" ? "Pick the features that matter most to your family." : tab === "Layout" ? "Choose how you see your favourite moments." : "Choose a colour that feels like home."}</p>
              {tab === "My Features" ? <div className={styles.featureTiles}>{featureTiles.map(([name, image], index) => <div key={name}><img src={`/families/${image}.webp`} alt="" width="73" height="51" loading="lazy"/><h4>{name}</h4><button type="button" role="switch" aria-checked={enabled[index]} aria-label={name} className={styles.toggle} onClick={() => setEnabled(current => current.map((value, i) => i === index ? !value : value))}><span/></button></div>)}</div> : tab === "Layout" ? <div className={styles.layoutChoices}>{["Grid", "Timeline", "Gallery"].map(name => <button type="button" key={name} aria-pressed={layout === name} onClick={() => setLayout(name)}><span className={`${styles.layoutThumbnail} ${styles[name.toLowerCase()]}`}>{Array.from({length:6},(_,i)=><i key={i}/>)}</span>{name}</button>)}</div> : <div className={styles.themeChoices}>{["Ocean", "Lavender", "Forest"].map(name => <button type="button" key={name} aria-pressed={theme === name} onClick={() => setTheme(name)}><span className={styles[name.toLowerCase()]}/>{name}</button>)}</div>}
            </div>
            <button type="button" className={`${styles.carouselArrow} ${styles.panelPrevious}`} aria-label="Previous customization option" onClick={() => moveTab(-1)}><ChevronLeft/></button>
            <button type="button" className={`${styles.carouselArrow} ${styles.panelNext}`} aria-label="Next customization option" onClick={() => moveTab(1)}><ChevronRight/></button>
            <div className={styles.dots}>{Array.from({length:5}, (_,index) => <span key={index} className={index === tabs.indexOf(tab) ? styles.activeDot : ""}/>)}</div>
          </div>
        </div>
      </div>
    </section>
  </div>;
}
