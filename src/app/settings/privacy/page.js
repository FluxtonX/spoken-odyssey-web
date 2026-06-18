"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ShieldCheck,
  Globe,
  Users,
  Lock,
  Eye,
  EyeOff,
  Share2,
  BarChart3,
  Heart,
  UserX,
  Download,
  ChevronRight,
  CheckCircle2,
  Clock,
  Info,
  Save,
  Sparkles,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Reusable primitives
───────────────────────────────────────────── */

const SectionLabel = ({ children }) => (
  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-3 pl-1">
    {children}
  </p>
);

const Divider = () => (
  <div className="border-t border-stone-100 dark:border-stone-800/60 my-6" />
);

const ToggleSwitch = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    aria-pressed={checked}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
      transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2
      focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2
      ${checked ? "bg-[var(--brand)]" : "bg-stone-200 dark:bg-stone-700"}`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md
        ring-0 transition duration-200 ease-in-out
        ${checked ? "translate-x-5" : "translate-x-0"}`}
    />
  </button>
);

/* ─────────────────────────────────────────────
   Privacy Option Card (radio-style selector)
───────────────────────────────────────────── */
const PrivacyOptionCard = ({ option, isSelected, onSelect }) => {
  const Icon = option.icon;
  return (
    <button
      onClick={() => onSelect(option.id)}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left
        transition-all duration-150 cursor-pointer group
        ${
          isSelected
            ? "border-[var(--brand)] bg-[var(--brand-soft)]/30 dark:bg-[var(--brand-soft)]/10"
            : "border-stone-200/70 dark:border-stone-800/70 hover:border-[var(--brand)]/40 bg-stone-50/20 dark:bg-stone-900/10"
        }`}
    >
      {/* icon */}
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors
          ${isSelected ? option.activeBg : option.inactiveBg}`}
      >
        <Icon size={20} className={isSelected ? option.activeColor : option.inactiveColor} />
      </div>

      {/* text */}
      <div className="flex-1 min-w-0">
        <span className="font-extrabold text-sm text-stone-850 dark:text-stone-200 block">
          {option.label}
        </span>
        <span className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 mt-0.5 block leading-snug">
          {option.desc}
        </span>
      </div>

      {/* radio indicator */}
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
          ${
            isSelected
              ? "border-[var(--brand)] bg-[var(--brand)]"
              : "border-stone-300 dark:border-stone-600 group-hover:border-[var(--brand)]/50"
          }`}
      >
        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
    </button>
  );
};

/* ─────────────────────────────────────────────
   Toggle Row
───────────────────────────────────────────── */
const ToggleRow = ({ icon: Icon, iconBg, iconColor, title, desc, checked, onChange }) => (
  <div className="flex items-center justify-between p-4 rounded-2xl border border-stone-150/60 dark:border-stone-800/50 bg-stone-50/10 dark:bg-stone-900/10">
    <div className="flex items-center gap-3 min-w-0">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon size={18} className={iconColor} />
      </div>
      <div className="min-w-0">
        <span className="font-extrabold text-sm text-stone-850 dark:text-stone-200 block">
          {title}
        </span>
        <span className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 mt-0.5 block leading-snug">
          {desc}
        </span>
      </div>
    </div>
    <div className="ml-4 shrink-0">
      <ToggleSwitch checked={checked} onChange={onChange} />
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Action Row (link-style)
───────────────────────────────────────────── */
const ActionRow = ({ icon: Icon, iconBg, iconColor, title, desc, badge, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left
      transition-all cursor-pointer group
      ${
        danger
          ? "border-rose-200/60 dark:border-rose-900/40 hover:bg-rose-50/40 dark:hover:bg-rose-950/20"
          : "border-stone-150/60 dark:border-stone-800/50 hover:bg-stone-50/50 dark:hover:bg-stone-900/30"
      }`}
  >
    <div className="flex items-center gap-3 min-w-0">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon size={18} className={iconColor} />
      </div>
      <div className="min-w-0">
        <span
          className={`font-extrabold text-sm block ${
            danger ? "text-rose-600 dark:text-rose-400" : "text-stone-850 dark:text-stone-200"
          }`}
        >
          {title}
        </span>
        <span className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 mt-0.5 block leading-snug">
          {desc}
        </span>
      </div>
    </div>
    <div className="flex items-center gap-2 ml-3 shrink-0">
      {badge && (
        <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400">
          {badge}
        </span>
      )}
      <ChevronRight
        size={16}
        className={`transition-transform group-hover:translate-x-0.5 ${
          danger ? "text-rose-400" : "text-stone-400"
        }`}
      />
    </div>
  </button>
);

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function PrivacySettings() {
  // Default Entry Privacy
  const [defaultPrivacy, setDefaultPrivacy] = useState("family");

  // Profile Visibility
  const [profileVisibility, setProfileVisibility] = useState("followers");

  // Story Sharing & Embeds
  const [allowSharing, setAllowSharing] = useState(true);
  const [allowReactions, setAllowReactions] = useState(true);

  // Data & Personalization
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [personalizedFeed, setPersonalizedFeed] = useState(true);

  // Legacy Access
  const [legacyAccess, setLegacyAccess] = useState("family");

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  /* ── data ───────────────────────────────── */
  const entryPrivacyOptions = [
    {
      id: "public",
      icon: Globe,
      label: "Public — Community",
      desc: "Visible on the global discover feed. Anyone can find and read this memory.",
      activeBg: "bg-indigo-100 dark:bg-indigo-950/40",
      inactiveBg: "bg-stone-100 dark:bg-stone-800/60",
      activeColor: "text-indigo-600 dark:text-indigo-400",
      inactiveColor: "text-stone-400",
    },
    {
      id: "family",
      icon: Users,
      label: "Family Circle",
      desc: "Only approved family members and their descendants can read this.",
      activeBg: "bg-[var(--brand-soft)] dark:bg-[var(--brand-soft)]/20",
      inactiveBg: "bg-stone-100 dark:bg-stone-800/60",
      activeColor: "text-[var(--brand)]",
      inactiveColor: "text-stone-400",
    },
    {
      id: "private",
      icon: Lock,
      label: "Private — Just Me",
      desc: "Completely personal. Only you can access this entry.",
      activeBg: "bg-rose-100 dark:bg-rose-950/40",
      inactiveBg: "bg-stone-100 dark:bg-stone-800/60",
      activeColor: "text-rose-600 dark:text-rose-400",
      inactiveColor: "text-stone-400",
    },
  ];

  const profileVisibilityOptions = [
    {
      id: "public",
      icon: Eye,
      label: "Public Profile",
      desc: "Your profile appears in search and the community discover page.",
      activeBg: "bg-emerald-100 dark:bg-emerald-950/40",
      inactiveBg: "bg-stone-100 dark:bg-stone-800/60",
      activeColor: "text-emerald-600 dark:text-emerald-400",
      inactiveColor: "text-stone-400",
    },
    {
      id: "followers",
      icon: Users,
      label: "Followers Only",
      desc: "Only people you follow back can see your profile details.",
      activeBg: "bg-[var(--brand-soft)] dark:bg-[var(--brand-soft)]/20",
      inactiveBg: "bg-stone-100 dark:bg-stone-800/60",
      activeColor: "text-[var(--brand)]",
      inactiveColor: "text-stone-400",
    },
    {
      id: "private",
      icon: EyeOff,
      label: "Hidden Profile",
      desc: "Your profile is completely private. No public presence.",
      activeBg: "bg-stone-200 dark:bg-stone-700/60",
      inactiveBg: "bg-stone-100 dark:bg-stone-800/60",
      activeColor: "text-stone-600 dark:text-stone-300",
      inactiveColor: "text-stone-400",
    },
  ];

  const legacyAccessOptions = [
    {
      id: "family",
      icon: Heart,
      label: "Family Circle Access",
      desc: "Designated family members can access your vault as a legacy reader.",
      activeBg: "bg-amber-100 dark:bg-amber-950/40",
      inactiveBg: "bg-stone-100 dark:bg-stone-800/60",
      activeColor: "text-amber-600 dark:text-amber-400",
      inactiveColor: "text-stone-400",
    },
    {
      id: "none",
      icon: Clock,
      label: "Time-Locked — Decide Later",
      desc: "No legacy access granted yet. You can update this at any time.",
      activeBg: "bg-stone-200 dark:bg-stone-700/60",
      inactiveBg: "bg-stone-100 dark:bg-stone-800/60",
      activeColor: "text-stone-600 dark:text-stone-300",
      inactiveColor: "text-stone-400",
    },
  ];

  return (
    <div className="w-full max-w-3xl pb-28">
      {/* ── Header ───────────────────────────── */}
      <header className="flex items-center gap-4 mb-7">
        <Link
          href="/settings"
          className="w-10 h-10 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-750
            hover:bg-stone-50 dark:hover:bg-stone-750 flex items-center justify-center transition-colors shadow-sm shrink-0"
        >
          <ChevronLeft size={20} className="text-stone-600 dark:text-stone-300" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-stone-850 dark:text-white tracking-tight">
            Privacy Settings
          </h1>
          <p className="text-xs font-semibold text-stone-400 dark:text-stone-500 mt-0.5">
            Control who sees your memories, profile, and legacy vault.
          </p>
        </div>
      </header>

      {/* ── Info Banner ─────────────────────── */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--brand-soft)]/60 dark:bg-[var(--brand-soft)]/15 border border-[var(--brand)]/20 mb-6">
        <ShieldCheck size={18} className="text-[var(--brand)] shrink-0 mt-0.5" />
        <p className="text-xs font-semibold text-stone-600 dark:text-stone-400 leading-relaxed">
          Your privacy preferences apply to <strong className="text-[var(--brand)]">all new memories</strong> by
          default. You can always override visibility for any individual entry when creating it.
        </p>
      </div>

      {/* ── Master Card ─────────────────────── */}
      <div className="bg-white/95 dark:bg-[#162033]/90 border border-stone-200/80 dark:border-stone-800 rounded-[2rem] shadow-xl overflow-hidden backdrop-blur-md">
        <div className="p-6 md:p-8 space-y-7">

          {/* ── Section 1: Default Entry Privacy ─ */}
          <section>
            <SectionLabel>Default Entry Privacy</SectionLabel>
            <div className="space-y-3">
              {entryPrivacyOptions.map((opt) => (
                <PrivacyOptionCard
                  key={opt.id}
                  option={opt}
                  isSelected={defaultPrivacy === opt.id}
                  onSelect={setDefaultPrivacy}
                />
              ))}
            </div>
          </section>

          <Divider />

          {/* ── Section 2: Profile Visibility ─── */}
          <section>
            <SectionLabel>Profile Visibility</SectionLabel>
            <div className="space-y-3">
              {profileVisibilityOptions.map((opt) => (
                <PrivacyOptionCard
                  key={opt.id}
                  option={opt}
                  isSelected={profileVisibility === opt.id}
                  onSelect={setProfileVisibility}
                />
              ))}
            </div>
          </section>

          <Divider />

          {/* ── Section 3: Sharing & Interactions */}
          <section>
            <SectionLabel>Sharing & Interactions</SectionLabel>
            <div className="space-y-3">
              <ToggleRow
                icon={Share2}
                iconBg="bg-sky-100 dark:bg-sky-950/40"
                iconColor="text-sky-600 dark:text-sky-400"
                title="Allow Story Sharing"
                desc="Let family members share your public memories within their own circle."
                checked={allowSharing}
                onChange={() => setAllowSharing((v) => !v)}
              />
              <ToggleRow
                icon={Heart}
                iconBg="bg-rose-100 dark:bg-rose-950/40"
                iconColor="text-rose-500 dark:text-rose-400"
                title="Allow Reactions & Comments"
                desc="Family and followers can react and comment on your shared memories."
                checked={allowReactions}
                onChange={() => setAllowReactions((v) => !v)}
              />
            </div>
          </section>

          <Divider />

          {/* ── Section 4: Data & Personalization */}
          <section>
            <SectionLabel>Data & Personalization</SectionLabel>
            <div className="space-y-3">
              <ToggleRow
                icon={BarChart3}
                iconBg="bg-violet-100 dark:bg-violet-950/40"
                iconColor="text-violet-600 dark:text-violet-400"
                title="Usage Analytics"
                desc="Help improve Spoken Odyssey by sharing anonymous usage data."
                checked={analyticsEnabled}
                onChange={() => setAnalyticsEnabled((v) => !v)}
              />
              <ToggleRow
                icon={Sparkles}
                iconBg="bg-amber-100 dark:bg-amber-950/40"
                iconColor="text-amber-600 dark:text-amber-400"
                title="Personalized Discover Feed"
                desc="Surface memories and stories tailored to your recording patterns."
                checked={personalizedFeed}
                onChange={() => setPersonalizedFeed((v) => !v)}
              />
            </div>

            {/* notice */}
            <div className="flex items-start gap-2.5 mt-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800/40">
              <Info size={14} className="text-stone-400 shrink-0 mt-0.5" />
              <p className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 leading-snug">
                We never sell your data. Analytics data is fully anonymized and never linked to your
                identity or stories.
              </p>
            </div>
          </section>

          <Divider />

          {/* ── Section 5: Legacy Access ────────── */}
          <section>
            <SectionLabel>Legacy Vault Access</SectionLabel>
            <div className="space-y-3">
              {legacyAccessOptions.map((opt) => (
                <PrivacyOptionCard
                  key={opt.id}
                  option={opt}
                  isSelected={legacyAccess === opt.id}
                  onSelect={setLegacyAccess}
                />
              ))}
            </div>
          </section>

          <Divider />

          {/* ── Section 6: Account Actions ───────── */}
          <section>
            <SectionLabel>Account Actions</SectionLabel>
            <div className="space-y-3">
              <ActionRow
                icon={UserX}
                iconBg="bg-stone-100 dark:bg-stone-800/60"
                iconColor="text-stone-500 dark:text-stone-400"
                title="Blocked Members"
                desc="Manage people who cannot view or interact with your stories."
                badge="0 blocked"
                onClick={() => {}}
              />
              <ActionRow
                icon={Download}
                iconBg="bg-emerald-100 dark:bg-emerald-950/40"
                iconColor="text-emerald-600 dark:text-emerald-400"
                title="Download My Data"
                desc="Export all your memories, recordings, and metadata as a ZIP archive."
                onClick={() => {}}
              />
            </div>
          </section>

        </div>

        {/* ── Save Footer ──────────────────────── */}
        <div className="px-6 md:px-8 py-5 border-t border-stone-100 dark:border-stone-800/60 bg-stone-50/40 dark:bg-stone-900/20 flex items-center justify-between gap-4">
          <p className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 leading-snug max-w-xs">
            Changes apply to all <strong>new</strong> memories. Existing entries keep their original visibility settings.
          </p>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all shadow-sm cursor-pointer shrink-0
              ${
                saved
                  ? "bg-emerald-500 text-white scale-[0.98]"
                  : "bg-[var(--brand)] text-white hover:opacity-90 active:scale-95"
              }`}
          >
            {saved ? (
              <>
                <CheckCircle2 size={16} />
                Saved
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
