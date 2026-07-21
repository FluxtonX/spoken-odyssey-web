"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardHeader from "@/components/layout/DashboardHeader";
import WavesBackground from "@/components/layout/WavesBackground";
import { 
  Check, 
  Settings, 
  X, 
  ChevronRight, 
  CheckCircle2 
} from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const NOTIFICATIONS_DATA = [
  {
    id: "n1",
    unread: true,
    category: "Social",
    title: "Eleanor Voss started following you",
    body: "Your public profile now has 1,241 followers.",
    time: "2min ago",
    actionText: "View Profile",
    actionHref: "/profile",
    avatarBg: "bg-[#4A3AFF] text-white",
    initials: "E"
  },
  {
    id: "n2",
    unread: true,
    category: "Social",
    title: "Rosamund Clarke commented on your memory",
    body: '"The Way Mam Made Tea" — "This is so beautifully written. It took me right back to my own mother\'s kitchen."',
    time: "14min ago",
    actionText: "View Memory",
    actionHref: "/memories",
    avatarBg: "bg-emerald-500 text-white",
    initials: "R"
  },
  {
    id: "n3",
    unread: true,
    category: "Family",
    title: "Sarah O'Brien accepted your invitation",
    body: "Sarah has joined your Family Circle as your daughter.",
    time: "1h ago",
    actionText: "View Family",
    actionHref: "/family",
    avatarBg: "bg-amber-500 text-white",
    initials: "S"
  },
  {
    id: "n4",
    unread: true,
    category: "System",
    title: "Your 2024 AI Life Summary is ready",
    body: "We've analysed 247 of your memories and generated your annual insight report.",
    time: "2h ago",
    actionText: "View Insights",
    actionHref: "/insights",
    avatarBg: "bg-purple-600 text-white",
    initials: "AI"
  },
  {
    id: "n5",
    unread: false,
    category: "Social",
    title: "Ciarán O'Brien reacted to your story",
    body: '"First Day in London" — Ciarán left a ❤️ reaction.',
    time: "3h ago",
    actionText: "View Story",
    actionHref: "/memories",
    avatarBg: "bg-teal-500 text-white",
    initials: "C"
  },
  {
    id: "n6",
    unread: false,
    category: "Family",
    title: "Brigid O'Brien shared your memory",
    body: '"Nana\'s Recipe Book" was shared by Brigid to 3 family members.',
    time: "5h ago",
    actionText: "View Memory",
    actionHref: "/memories",
    avatarBg: "bg-pink-500 text-white",
    initials: "B"
  },
  {
    id: "n7",
    unread: false,
    category: "Family",
    title: "Album invitation from Sarah O'Brien",
    body: 'Sarah has invited you to collaborate on the album "O\'Brien Family Reunion 2024".',
    time: "Yesterday",
    actionText: "Accept",
    actionHref: "/albums",
    avatarBg: "bg-amber-500 text-white",
    initials: "S"
  },
  {
    id: "n8",
    unread: false,
    category: "System",
    title: "Storage at 74% capacity",
    body: "You've used 11.1 GB of your 15 GB free plan. Upgrade to keep recording.",
    time: "Yesterday",
    actionText: "Upgrade",
    actionHref: "/subscription",
    avatarBg: "bg-[#4A3AFF] text-white",
    initials: "💾"
  },
  {
    id: "n9",
    unread: false,
    category: "Family",
    title: "Legacy access updated",
    body: "Ciarán O'Brien now has Legacy Executor access to your account.",
    time: "2 days ago",
    actionText: "Manage Legacy",
    actionHref: "/family",
    avatarBg: "bg-cyan-600 text-white",
    initials: "C"
  },
  {
    id: "n10",
    unread: false,
    category: "System",
    title: "Subscription renewal in 7 days",
    body: "Your free plan renews on January 27, 2026. No charge expected.",
    time: "2 days ago",
    actionText: "View Billing",
    actionHref: "/subscription",
    avatarBg: "bg-slate-700 text-white",
    initials: "💳"
  },
  {
    id: "n11",
    unread: false,
    category: "Social",
    title: "Aoife Daly commented on your memory",
    body: '"Our Last Summer in Clare" — "I was there that day! Do you remember the rain?"',
    time: "3 days ago",
    actionText: "Reply",
    actionHref: "/memories",
    avatarBg: "bg-amber-600 text-white",
    initials: "A"
  },
  {
    id: "n12",
    unread: false,
    category: "System",
    title: "New login detected",
    body: "A new login was detected from Dublin, Ireland on MacBook Pro. If this wasn't you, secure your account.",
    time: "3 days ago",
    actionText: "Review",
    actionHref: "/settings/security",
    avatarBg: "bg-red-500 text-white",
    initials: "🔒"
  },
  {
    id: "n13",
    unread: false,
    category: "Family",
    title: "Legacy plan saved successfully",
    body: "Your legacy release conditions have been updated. Documents are secure.",
    time: "4 days ago",
    actionText: "View Legacy",
    actionHref: "/family",
    avatarBg: "bg-indigo-600 text-white",
    initials: "📂"
  },
  {
    id: "n14",
    unread: false,
    category: "Family",
    title: "Brigid O'Brien shared 3 memories",
    body: 'Brigid added "Galway Bay 1978", "The Summer House", and "Dad\'s 60th" to your Family Timeline.',
    time: "5 days ago",
    actionText: "View Timeline",
    actionHref: "/timeline",
    avatarBg: "bg-rose-500 text-white",
    initials: "B"
  },
  {
    id: "n15",
    unread: false,
    category: "System",
    title: "Password changed successfully",
    body: "Your account password was changed from Dublin, Ireland.",
    time: "1 week ago",
    actionText: "",
    actionHref: "",
    avatarBg: "bg-stone-700 text-white",
    initials: "⚙️"
  }
];

const INITIAL_PREFERENCES = [
  {
    group: "SOCIAL",
    items: [
      { id: "p1", title: "New followers", description: "When someone follows your public profile", enabled: true },
      { id: "p2", title: "Comments", description: "When someone comments on your memory", enabled: true },
      { id: "p3", title: "Reactions", description: "When someone reacts to your story", enabled: true },
      { id: "p4", title: "Shares", description: "When someone shares your memory", enabled: false }
    ]
  },
  {
    group: "FAMILY",
    items: [
      { id: "p5", title: "Invitations", description: "Family circle invitations accepted or declined", enabled: true },
      { id: "p6", title: "Family shares", description: "When a family member shares memories", enabled: true },
      { id: "p7", title: "Legacy updates", description: "Changes to legacy access and settings", enabled: true }
    ]
  },
  {
    group: "SYSTEM",
    items: [
      { id: "p8", title: "AI Insights", description: "New AI summaries and life reflections", enabled: true },
      { id: "p9", title: "Storage alerts", description: "When storage is nearly full", enabled: true },
      { id: "p10", title: "Billing", description: "Subscription and payment updates", enabled: true },
      { id: "p11", title: "Security alerts", description: "New logins and password changes", enabled: true }
    ]
  }
];

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [notificationsList, setNotificationsList] = useState(NOTIFICATIONS_DATA);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [preferences, setPreferences] = useState(INITIAL_PREFERENCES);
  const [toastMessage, setToastMessage] = useState("");

  const unreadCount = notificationsList.filter(n => n.unread).length;

  const handleMarkAllRead = () => {
    setNotificationsList(notificationsList.map(n => ({ ...n, unread: false })));
    setToastMessage("All notifications marked as read!");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const togglePreference = (groupId, itemId) => {
    setPreferences(preferences.map(cat => {
      if (cat.group !== groupId) return cat;
      return {
        ...cat,
        items: cat.items.map(item => item.id === itemId ? { ...item, enabled: !item.enabled } : item)
      };
    }));
  };

  const handleSavePreferences = () => {
    setIsPreferencesOpen(false);
    setToastMessage("Notification preferences saved successfully!");
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Filter list
  const filteredNotifications = notificationsList.filter(n => {
    if (activeFilter === "All") return true;
    if (activeFilter.startsWith("Unread")) return n.unread;
    return n.category === activeFilter;
  });

  return (
    <WavesBackground>
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="w-full relative pb-24 min-h-screen"
      >
        <DashboardHeader />

        <div className="w-full mt-2 md:mt-6">
          
          {/* Header section */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[32px] md:text-[36px] font-bold text-stone-900 dark:text-white tracking-tight leading-tight">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <span className="w-6 h-6 rounded-full bg-[#4A3AFF] text-white text-xs font-extrabold flex items-center justify-center shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </div>
              <p className="text-stone-500 dark:text-stone-400 font-medium text-[15px] mt-1">
                Updates from your memories, family, and platform
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handleMarkAllRead}
                className="bg-white/80 dark:bg-slate-900/80 border border-[#C7D2FE]/70 dark:border-slate-800 text-stone-800 dark:text-stone-200 px-4 py-2.5 rounded-[14px] font-bold text-xs transition-all shadow-xs hover:bg-[#EEF2FF] flex items-center gap-2 cursor-pointer"
              >
                <Check size={16} strokeWidth={2.5} />
                <span>Mark all read</span>
              </button>

              <button 
                onClick={() => setIsPreferencesOpen(true)}
                className="bg-white/80 dark:bg-slate-900/80 border border-[#C7D2FE]/70 dark:border-slate-800 text-stone-800 dark:text-stone-200 p-2.5 rounded-[14px] transition-all shadow-xs hover:bg-[#EEF2FF] flex items-center justify-center cursor-pointer"
                title="Notification Settings"
              >
                <Settings size={18} />
              </button>
            </div>
          </motion.div>

          {/* Filter Tab Bar */}
          <motion.div variants={fadeInUp} className="bg-white/80 dark:bg-slate-900/80 border border-[#C7D2FE]/70 dark:border-slate-800 p-1.5 rounded-[20px] inline-flex items-center gap-1.5 mb-8 overflow-x-auto max-w-full shadow-xs">
            {[
              { id: "All", label: "All" },
              { id: "Unread", label: "Unread", count: unreadCount },
              { id: "Family", label: "Family" },
              { id: "Social", label: "Social" },
              { id: "System", label: "System" }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-6 py-2.5 rounded-[14px] text-[14px] font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  activeFilter === tab.id 
                  ? "bg-[#4A3AFF] text-white shadow-md" 
                  : "text-[#3F436E] dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-[#EEF2FF] dark:hover:bg-slate-800"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                    activeFilter === tab.id ? "bg-white text-[#4A3AFF]" : "bg-[#4A3AFF] text-white"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </motion.div>

          {/* Notification List */}
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-3 max-w-5xl">
            {filteredNotifications.length === 0 ? (
              <div className="figma-card p-12 text-center text-stone-500 font-medium">
                No notifications in this filter category.
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <motion.div 
                  key={notif.id}
                  variants={fadeInUp}
                  className={`figma-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 hover:shadow-md relative overflow-hidden ${
                    notif.unread ? "ring-1 ring-[#4A3AFF]/30 bg-white/90 dark:bg-slate-900/90" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Unread dot */}
                    <div className="pt-3 shrink-0 w-2">
                      {notif.unread && (
                        <span className="block w-2 h-2 rounded-full bg-red-500 shadow-xs" />
                      )}
                    </div>

                    {/* Avatar Icon */}
                    <div className={`w-11 h-11 rounded-full ${notif.avatarBg} font-bold text-sm flex items-center justify-center shrink-0 shadow-sm border border-white/50`}>
                      {notif.initials}
                    </div>

                    {/* Notification Info */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-[15px] text-stone-900 dark:text-white leading-tight">
                        {notif.title}
                      </h3>
                      {notif.body && (
                        <p className="text-[13px] font-medium text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                          {notif.body}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[11px] font-medium text-stone-400 dark:text-stone-500">
                          {notif.time}
                        </span>
                        {notif.actionText && notif.actionHref && (
                          <Link 
                            href={notif.actionHref}
                            className="text-[12px] font-bold text-[#4A3AFF] dark:text-indigo-400 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>{notif.actionText}</span>
                            <ChevronRight size={12} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>

        </div>
      </motion.div>

      {/* Notification Preferences Settings Modal (Exact Screenshot 3 Match) */}
      {isPreferencesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-[28px] w-full max-w-md p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-slate-800 shrink-0">
              <h3 className="font-bold text-lg text-stone-900 dark:text-white">Notification Preferences</h3>
              <button 
                onClick={() => setIsPreferencesOpen(false)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-white transition-colors cursor-pointer p-1 rounded-full hover:bg-stone-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Categorized Preferences List */}
            <div className="overflow-y-auto py-4 space-y-6 flex-1 pr-1 custom-scrollbar">
              {preferences.map((cat) => (
                <div key={cat.group} className="space-y-3">
                  <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                    {cat.group}
                  </h4>
                  <div className="space-y-3">
                    {cat.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50/60 dark:bg-slate-800/50 border border-stone-100 dark:border-slate-800">
                        <div>
                          <p className="text-xs font-bold text-stone-900 dark:text-white">{item.title}</p>
                          <p className="text-[11px] font-medium text-stone-400 dark:text-stone-500 mt-0.5">{item.description}</p>
                        </div>

                        {/* Custom Toggle Switch */}
                        <button 
                          onClick={() => togglePreference(cat.group, item.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer shrink-0 ${
                            item.enabled ? "bg-[#4A3AFF]" : "bg-stone-200 dark:bg-slate-700"
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            item.enabled ? "translate-x-6 shadow-sm" : "translate-x-1"
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer Button */}
            <div className="pt-4 border-t border-stone-100 dark:border-slate-800 shrink-0">
              <button
                type="button"
                onClick={handleSavePreferences}
                className="w-full py-3.5 bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer text-sm"
              >
                Save Preferences
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-500 text-white p-4 text-xs font-bold shadow-xl animate-fade-in">
          <CheckCircle2 size={16} strokeWidth={3} />
          <span>{toastMessage}</span>
        </div>
      )}
    </WavesBackground>
  );
}
