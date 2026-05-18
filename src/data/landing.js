// Landing page static data
export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Albums", href: "#albums" },
  { label: "Privacy", href: "#privacy" },
  { label: "Mobile App", href: "#mobile" },
  { label: "FAQs", href: "#faq" },
];

export const PROBLEM_CARDS = [
  { icon: "🗂️", title: "Memories are scattered", desc: "Photos, voice notes, and stories are stored in different places with no central home." },
  { icon: "🔓", title: "Privacy is confusing", desc: "Not every memory should be public or visible to everyone in your life." },
  { icon: "👨‍👩‍👧", title: "Family sharing is limited", desc: "Important moments are hard to organize and share with only selected people." },
  { icon: "⏳", title: "Old memories get lost", desc: "Without albums and records, meaningful moments disappear over time." },
];

export const SOLUTION_CARDS = [
  { icon: "🖼️", title: "Photo Memories", desc: "Upload and organize your best photos into beautiful, searchable albums." },
  { icon: "🎙️", title: "Voice Records", desc: "Capture audio memories — stories, messages, and moments in your own voice." },
  { icon: "✍️", title: "Text Memories", desc: "Write personal notes, journal entries, and family stories to preserve forever." },
  { icon: "📰", title: "Feed Sharing", desc: "Post memories to a clean social-style feed — publicly or within your circle." },
  { icon: "📚", title: "Albums", desc: "Curate memory collections for events, trips, family moments, or private archives." },
  { icon: "👨‍👩‍👧‍👦", title: "Family Circle", desc: "Build a trusted family group and share special memories with approved members only." },
];

export const FEATURES = [
  { icon: "🔁", title: "Smart Memory Feed", desc: "Post photos, voice notes, text updates, and albums in a clean social-style feed. Your memories feel alive, organized, and easy to revisit." },
  { icon: "📚", title: "Albums for Every Moment", desc: "Create albums for family events, personal milestones, travel, childhood memories, weddings, documents, or private collections." },
  { icon: "🛡️", title: "Privacy Controls", desc: "Choose who can see each memory: public, private, family-only, or selected members only. You stay in full control." },
  { icon: "👪", title: "Family Members Access", desc: "Build your trusted family circle and share important memories only with the people you personally choose and approve." },
  { icon: "🎙️", title: "Voice + Text Records", desc: "Not every memory is a photo. Save voice messages, stories, notes, and personal records with emotional context." },
  { icon: "📱", title: "Web + Mobile Experience", desc: "Use the mobile app for quick uploads and the web platform for browsing, organizing, and managing albums beautifully." },
];

export const PRIVACY_OPTIONS = [
  { id: "private", icon: "🔒", label: "Private", color: "bg-purple-100 text-purple-700 border-purple-200", desc: "Only you can view this memory.", active: false },
  { id: "family", icon: "👨‍👩‍👧‍👦", label: "Family Only", color: "bg-amber-100 text-amber-700 border-amber-200", desc: "Visible only to family members you have added.", active: true },
  { id: "selected", icon: "👥", label: "Selected Members", color: "bg-blue-100 text-blue-700 border-blue-200", desc: "Share with specific people you choose.", active: false },
  { id: "public", icon: "🌍", label: "Public", color: "bg-emerald-100 text-emerald-700 border-emerald-200", desc: "Post memories to your public profile and feed.", active: false },
];

export const HOW_IT_WORKS = [
  { step: "01", title: "Create your account", desc: "Sign up and create your personal memory space in under a minute." },
  { step: "02", title: "Upload memories", desc: "Add photos, voice notes, text records, or complete albums from any device." },
  { step: "03", title: "Choose visibility", desc: "Set each memory as private, public, family-only, or shared with selected members." },
  { step: "04", title: "Relive and share", desc: "Browse your feed, revisit albums, and share meaningful memories safely." },
];

export const USE_CASES = [
  { icon: "👨‍👩‍👧‍👦", title: "For Families", desc: "Create private family albums, preserve old memories, and let selected family members view or contribute." },
  { icon: "🙋", title: "For Personal Life", desc: "Save your own photos, voice notes, important thoughts, and life events in one secure place." },
  { icon: "🎉", title: "For Events", desc: "Create albums for weddings, birthdays, trips, school events, and celebrations." },
  { icon: "🌐", title: "For Public Sharing", desc: "Post selected moments publicly while keeping personal memories completely private." },
  { icon: "📖", title: "For Legacy Memories", desc: "Record family stories, voice messages, and meaningful life events for the future." },
];

export const SECURITY_ITEMS = [
  { icon: "🔐", title: "Secure Authentication", desc: "Your account is protected with secure login and session management." },
  { icon: "👁️", title: "Private Visibility", desc: "Private memories are never visible to anyone except you." },
  { icon: "👪", title: "Role-based Family Access", desc: "Family members only see what you explicitly share with them." },
  { icon: "☁️", title: "Safe Media Storage", desc: "Your photos, voice notes, and files are stored securely." },
  { icon: "⚙️", title: "User-Controlled Sharing", desc: "You decide who sees what — always. No algorithmic surprises." },
  { icon: "🚫", title: "No Ads, No Data Mining", desc: "This platform is not built around ads. Your memories are not the product." },
];

export const FAQS = [
  { q: "Can I keep memories completely private?", a: "Yes. You can save memories privately so only you can view them. No one else will have access." },
  { q: "Can I share albums only with my family?", a: "Yes. You can add family members and create family-only albums that are invisible to everyone else." },
  { q: "Can I post publicly like a social feed?", a: "Yes. You can publish selected memories to your public feed while keeping other memories private or family-only." },
  { q: "What type of records can I save?", a: "You can save photos, voice notes, text records, posts, and full albums — all in one place." },
  { q: "Is this available on mobile and web?", a: "Yes. The mobile app supports quick uploads, and the web platform helps you browse and manage memories beautifully." },
  { q: "Can family members add their own memories?", a: "Family members can contribute to shared albums depending on the album permissions you set." },
];
