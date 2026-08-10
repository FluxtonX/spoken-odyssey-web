/**
 * Client-Side Real-Time Insights & Analytics Engine
 * Computes memory analytics, legacy score, theme distribution, and emotional trends
 * directly from any array of user memory objects.
 */
export function computeUserInsights(memories = []) {
  const totalMemories = memories.length;

  if (totalMemories === 0) {
    return {
      stats: {
        totalMemories: 0,
        voiceHours: "0.0h",
        wordsWritten: "0k",
        milestones: 0,
        yearsCovered: 0,
      },
      legacyScore: 10,
      lifeSummary: "Start your journey today by recording your first voice memory or written journal entry.",
      lifeThemes: [
        { name: "Family & Love", value: 30, color: "#4A3AFF" },
        { name: "Home & Belonging", value: 25, color: "#10B981" },
        { name: "Career & Craft", value: 20, color: "#F59E0B" },
        { name: "Adventure", value: 15, color: "#06B6D4" },
        { name: "Faith & Purpose", value: 10, color: "#8B5CF6" },
      ],
      emotionalLandscape: {
        joy: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        reflection: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        gratitude: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        melancholy: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      wordCloud: [
        { text: "Family", weight: 32 },
        { text: "Home", weight: 24 },
        { text: "Memory", weight: 20 },
        { text: "Journey", weight: 16 },
      ],
      peopleInArchive: [],
      insights: [
        {
          title: "Archive Started",
          desc: "Your spoken history archive is ready. Record your first voice note to see real-time insights.",
          icon: "TrendingUp",
          iconColor: "text-emerald-500",
        },
      ],
      forgottenMemory: null,
    };
  }

  let totalWords = 0;
  let voiceMemoryCount = 0;
  let voiceMinutes = 0;
  let milestoneCount = 0;
  const years = new Set();
  const tagFrequency = {};
  const peopleMap = {};

  const monthlyMoods = {
    joy: Array(12).fill(0),
    reflection: Array(12).fill(0),
    gratitude: Array(12).fill(0),
    melancholy: Array(12).fill(0),
  };

  memories.forEach((m) => {
    // Words count
    const textContent = m.description || m.content || "";
    if (textContent) {
      const words = textContent.trim().split(/\s+/).filter(Boolean).length;
      totalWords += words;
    }

    // Type checking
    const normType = String(m.type || "").toLowerCase();
    const isVoice = normType === "voice" || normType === "audio" || Boolean(m.audioUrl || m.audio);
    if (isVoice) {
      voiceMemoryCount += 1;
      let durationSec = 180;
      if (typeof m.duration === "string" && m.duration.includes(":")) {
        const parts = m.duration.split(":").map(Number);
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          durationSec = parts[0] * 60 + parts[1];
        }
      }
      voiceMinutes += Math.max(1, Math.round(durationSec / 60));
    }

    // Milestones
    const isMilestone = normType === "milestone" || (Array.isArray(m.tags) && m.tags.some((t) => String(t).toLowerCase() === "milestone"));
    if (isMilestone) {
      milestoneCount += 1;
    }

    // Years & Monthly Moods
    const dateVal = m.date || m.createdAt || m.occurredAt;
    const memDate = dateVal ? new Date(dateVal) : new Date();
    if (!isNaN(memDate.getTime())) {
      years.add(memDate.getFullYear());

      const monthIdx = memDate.getMonth();
      const moodStr = String(m.mood || "").toLowerCase();
      if (moodStr.includes("joy") || moodStr.includes("happy") || moodStr.includes("excit")) {
        monthlyMoods.joy[monthIdx] += 1;
      } else if (moodStr.includes("reflect") || moodStr.includes("calm") || moodStr.includes("thought")) {
        monthlyMoods.reflection[monthIdx] += 1;
      } else if (moodStr.includes("warm") || moodStr.includes("thank") || moodStr.includes("love") || moodStr.includes("grati")) {
        monthlyMoods.gratitude[monthIdx] += 1;
      } else if (moodStr.includes("sad") || moodStr.includes("grief") || moodStr.includes("nostalg")) {
        monthlyMoods.melancholy[monthIdx] += 1;
      } else {
        monthlyMoods.reflection[monthIdx] += 1;
      }
    }

    // Tagged Users & People mapping
    if (Array.isArray(m.taggedUsers)) {
      m.taggedUsers.forEach((tu) => {
        const uName = tu.displayName || tu.name || tu.email?.split("@")[0] || "Family Connection";
        const avatarUrl = tu.avatar || tu.photoURL || tu.photoKey || "";
        if (!peopleMap[uName]) {
          peopleMap[uName] = { count: 0, avatar: avatarUrl, id: tu.id || tu._id || "" };
        }
        if (avatarUrl && !peopleMap[uName].avatar) {
          peopleMap[uName].avatar = avatarUrl;
        }
        peopleMap[uName].count += 1;
      });
    }

    // Tags Frequency & People mapping
    if (Array.isArray(m.tags)) {
      m.tags.forEach((tag) => {
        const cleanTag = String(tag).replace(/^#/, "").trim();
        if (!cleanTag) return;
        tagFrequency[cleanTag] = (tagFrequency[cleanTag] || 0) + 1;

        if (["mum", "dad", "mother", "father", "sarah", "robert", "elena", "grandma", "grandpa", "brother", "sister"].includes(cleanTag.toLowerCase())) {
          const capitalized = cleanTag.charAt(0).toUpperCase() + cleanTag.slice(1);
          if (!peopleMap[capitalized]) {
            peopleMap[capitalized] = { count: 0, avatar: "" };
          }
          peopleMap[capitalized].count += 1;
        }
      });
    }
  });

  const voiceHoursNum = (voiceMinutes / 60).toFixed(1);
  const wordsFormatted = totalWords > 1000 ? `${(totalWords / 1000).toFixed(1)}k` : `${totalWords}`;
  const yearsCoveredCount = years.size > 0 ? (Math.max(...years) - Math.min(...years) + 1) : 1;

  // Legacy Score calculation
  const rawScore = (totalMemories * 1.5) + (parseFloat(voiceHoursNum) * 4) + (milestoneCount * 5) + (yearsCoveredCount * 3) + 20;
  const legacyScore = Math.min(99, Math.max(15, Math.round(rawScore)));

  // Life Themes Distribution
  const sortedTags = Object.entries(tagFrequency).sort((a, b) => b[1] - a[1]);
  const categoryBuckets = {
    "Family & Love": 0,
    "Home & Belonging": 0,
    "Career & Craft": 0,
    "Adventure": 0,
    "Faith & Purpose": 0,
  };

  sortedTags.forEach(([tag, count]) => {
    const t = tag.toLowerCase();
    if (t.includes("fam") || t.includes("love") || t.includes("mum") || t.includes("dad") || t.includes("child")) categoryBuckets["Family & Love"] += count;
    else if (t.includes("home") || t.includes("house") || t.includes("garden") || t.includes("kitchen")) categoryBuckets["Home & Belonging"] += count;
    else if (t.includes("work") || t.includes("career") || t.includes("project") || t.includes("craft")) categoryBuckets["Career & Craft"] += count;
    else if (t.includes("travel") || t.includes("trip") || t.includes("summer") || t.includes("advent")) categoryBuckets["Adventure"] += count;
    else categoryBuckets["Faith & Purpose"] += count;
  });

  const bucketTotal = Object.values(categoryBuckets).reduce((a, b) => a + b, 0) || 1;
  const colors = ["#4A3AFF", "#10B981", "#F59E0B", "#06B6D4", "#8B5CF6"];
  const lifeThemes = Object.entries(categoryBuckets).map(([name, count], i) => ({
    name,
    value: Math.max(5, Math.round((count / bucketTotal) * 100)),
    color: colors[i % colors.length],
  }));

  // Word Cloud Data
  const wordCloud = sortedTags.slice(0, 15).map(([text, weight]) => ({
    text,
    weight: Math.min(32, Math.max(14, weight * 4 + 12)),
  }));

  // People in Archive
  const peopleInArchive = Object.entries(peopleMap)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([name, info], idx) => {
      const bgs = ["bg-red-500", "bg-emerald-500", "bg-cyan-600", "bg-orange-500", "bg-purple-600", "bg-blue-600"];
      return {
        name,
        avatar: info.avatar || "",
        count: `${info.count} ${info.count === 1 ? "memory" : "memories"}`,
        bg: bgs[idx % bgs.length],
      };
    });

  // Select Forgotten Memory
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const olderMemories = memories.filter((m) => {
    const d = new Date(m.date || m.createdAt || m.occurredAt);
    return !isNaN(d.getTime()) && d < ninetyDaysAgo;
  });
  const forgottenMemory = olderMemories.length > 0 ? olderMemories[Math.floor(Math.random() * olderMemories.length)] : null;

  // Life Summary Text
  const topCategory = lifeThemes.sort((a, b) => b.value - a.value)[0]?.name || "Family & Love";
  const lifeSummary = `You have captured ${totalMemories} memories spanning ${yearsCoveredCount} ${yearsCoveredCount === 1 ? "year" : "years"}. The strongest theme in your personal archive is ${topCategory}, representing your commitment to preserving authentic generational heritage.`;

  return {
    stats: {
      totalMemories,
      voiceHours: `${voiceHoursNum}h`,
      wordsWritten: wordsFormatted,
      milestones: milestoneCount,
      yearsCovered: yearsCoveredCount,
    },
    legacyScore,
    lifeSummary,
    lifeThemes,
    emotionalLandscape: monthlyMoods,
    wordCloud,
    peopleInArchive,
    insights: [
      {
        title: "Growth Journey",
        desc: `You have documented ${totalMemories} memories across your life archive. Your consistency in recording family history continues to strengthen your generational vault.`,
        icon: "TrendingUp",
        iconColor: "text-emerald-500",
      },
      forgottenMemory
        ? {
            title: "Rediscovered Memory",
            desc: `A memory from ${new Date(forgottenMemory.date || forgottenMemory.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}: "${forgottenMemory.title}".`,
            icon: "RotateCcw",
            iconColor: "text-blue-500",
          }
        : {
            title: "Consistency Peak",
            desc: `Your active recording period is growing with ${voiceMemoryCount} voice archives created so far.`,
            icon: "Star",
            iconColor: "text-orange-400",
          },
      {
        title: "Milestone Pattern",
        desc: `You have recorded ${milestoneCount} major life milestones across your journey.`,
        icon: "Star",
        iconColor: "text-amber-500",
      },
    ],
    forgottenMemory,
  };
}
