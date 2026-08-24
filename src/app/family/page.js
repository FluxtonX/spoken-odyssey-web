"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import DashboardHeader from "@/components/layout/DashboardHeader";
import WavesBackground from "@/components/layout/WavesBackground";
import { UserPlus, Heart, Lock, Check, TreePine, X, ShieldCheck, Clock, Mic, FileText, Image as ImageIcon, Film, Play, Link2, Unlink } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp, fadeIn } from "@/lib/animations";
import InviteMemberModal from "./components/InviteMemberModal";
import LinkMemoryModal from "./components/LinkMemoryModal";
import VoicePlayer from "@/components/ui/VoicePlayer";
import CardMediaSlider from "@/components/ui/CardMediaSlider";
import { 
  getFamilyMembers, 
  getFamilyInvitations, 
  acceptFamilyInvitation, 
  declineFamilyInvitation,
  getFamilyCircleDetails,
  getFamilyCircleMembers,
  isFamilyAdmin,
  getPendingApprovals,
  approveInvitation,
  declineApproval,
  promoteToAdmin,
  demoteFromAdmin,
  removeFamilyMember,
  getFamilySharedMemories,
  getFamilySpaceTimeline,
  unlinkMemoryFromFamilyCircle,
  createFamilyPrompt,
  getFamilyPrompts,
  respondToFamilyPrompt,
  getGuardianControls,
  updateGuardianConsent,
  getLegacySettings,
  updateLegacySettings
} from "@/services/backend";

const MOCK_MEMBERS = [
  {
    id: "m1",
    name: "Sarah Murphy",
    role: "Partner",
    isAdmin: true,
    sharedCount: 234,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "m2",
    name: "Ciarán Murphy",
    role: "Son",
    isAdmin: false,
    sharedCount: 56,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "m3",
    name: "Aoife Murphy",
    role: "Daughter",
    isAdmin: false,
    sharedCount: 43,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "m4",
    name: "Declan O'Brien",
    role: "Father",
    isAdmin: false,
    sharedCount: 18,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "m5",
    name: "Brigid O'Brien",
    role: "Sister",
    isAdmin: false,
    sharedCount: 67,
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80"
  }
];

const INITIAL_PERMISSIONS = [
  { id: "p1", label: "Members can view shared memories", enabled: true },
  { id: "p2", label: "Members can add comments", enabled: true },
  { id: "p3", label: "Members can download memories", enabled: false },
  { id: "p4", label: "Members can invite others", enabled: false }
];

const LEGACY_SETTINGS_DATA = [
  {
    id: "ls1",
    key: "administrator",
    title: "Legacy administrator",
    description: "Will manage your archive",
    defaultVal: "Sarah Murphy",
    options: ["Sarah Murphy", "Ciarán Murphy", "Aoife Murphy", "Declan O'Brien"]
  },
  {
    id: "ls2",
    key: "releaseCondition",
    title: "Release condition",
    description: "Requires confirmation from admin",
    defaultVal: "After verified passing",
    options: ["After verified passing", "1 Year Inactivity", "6 Months Inactivity", "Immediate Release"]
  },
  {
    id: "ls3",
    key: "familyCircleAccess",
    title: "Family Circle access",
    description: "All members can view",
    defaultVal: "Full archive",
    options: ["Full archive", "Selected albums only", "Audio recordings only", "Restricted access"]
  },
  {
    id: "ls4",
    key: "publicProfile",
    title: "Public profile",
    description: "Stories stay discoverable",
    defaultVal: "Remain public",
    options: ["Remain public", "Make private after release", "Restricted profile"]
  }
];

const FAMILY_TREE_DATA = {
  me: {
    name: "Seán",
    role: "You",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80"
  },
  members: [
    { name: "Sarah", role: "Partner", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" },
    { name: "Ciarán", role: "Son", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80" },
    { name: "Aoife", role: "Daughter", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" },
    { name: "Declan", role: "Father", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80" }
  ]
};

export default function FamilyCirclePage() {
  const auth = useAuth() || {};
  const currentProfile = auth.profile;
  const [activeTab, setActiveTab] = useState("Members");
  const [membersList, setMembersList] = useState([]); // Start with empty array, no mock data
  const [invitationsList, setInvitationsList] = useState([]);
  const [sharedMemories, setSharedMemories] = useState([]);
  const [loadingMemories, setLoadingMemories] = useState(false);
  const [permissions, setPermissions] = useState(INITIAL_PERMISSIONS);
  const [legacySettings, setLegacySettings] = useState({
    administrator: "Sarah Murphy",
    releaseCondition: "After verified passing",
    familyCircleAccess: "Full archive",
    publicProfile: "Remain public"
  });
  const [editingSetting, setEditingSetting] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [currentCircleId, setCurrentCircleId] = useState(null);
  const [timelineItems, setTimelineItems] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [timelineCursor, setTimelineCursor] = useState(null);
  const [hasMoreTimeline, setHasMoreTimeline] = useState(false);
  const [promptsList, setPromptsList] = useState([]);
  const [promptsLoading, setPromptsLoading] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [promptCategory, setPromptCategory] = useState("Heritage");
  const [activePromptResponseId, setActivePromptResponseId] = useState(null);
  const [replyInputText, setReplyInputText] = useState("");
  const [guardianMinorsList, setGuardianMinorsList] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    async function loadGuardianData() {
      if (currentCircleId && (isAdmin || currentProfile?.role === "ADMIN")) {
        try {
          const token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
          if (token) {
            const data = await getGuardianControls(token, currentCircleId).catch(() => []);
            if (Array.isArray(data)) setGuardianMinorsList(data);
          }
        } catch (err) {
          console.warn("Could not load guardian controls:", err);
        }
      }
    }
    loadGuardianData();
  }, [currentCircleId, isAdmin, currentProfile]);

  const handleToggleConsentPost = async (childUserId, currentVal) => {
    try {
      const token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
      if (token) {
        const updated = await updateGuardianConsent(token, childUserId, { canPostWithoutApproval: !currentVal });
        setGuardianMinorsList(prev => prev.map(m => {
          if (m.user?.id === childUserId) {
            return { ...m, consent: updated };
          }
          return m;
        }));
        setToastMessage("✓ Guardian consent setting updated!");
        setTimeout(() => setToastMessage(""), 3000);
      }
    } catch (err) {
      console.error("Toggle consent error:", err);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const t = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
      if (t) setUserToken(t);
    }
  }, []);

  // Load connected family members & pending invitations from backend
  useEffect(() => {
    async function loadFamilyData() {
      try {
        let token = null;
        if (auth.getToken) {
          try { token = await auth.getToken(); } catch (_) {}
        }
        if (!token) token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");

        if (token) {
          // Load family circle details (ID)
          const circleDetails = await getFamilyCircleDetails(token).catch(() => null);
          if (circleDetails?.id) {
            setCurrentCircleId(circleDetails.id);
          }

          // Load family circle members (new API)
          const circleMembers = await getFamilyCircleMembers(token).catch(() => null);
          if (Array.isArray(circleMembers) && circleMembers.length > 0) {
            setMembersList(circleMembers);
          }

          // Load pending invitations (for current user)
          const backendInvites = await getFamilyInvitations(token).catch(() => null);
          if (Array.isArray(backendInvites)) {
            setInvitationsList(backendInvites);
          }

          // Load shared memories for family circle
          const shared = await getFamilySharedMemories(token).catch(() => []);
          if (Array.isArray(shared)) {
            const uniqueMap = new Map();
            shared.forEach(m => {
              if (!m) return;
              const idKey = m.id || m._id || `mem_${uniqueMap.size}`;
              if (!uniqueMap.has(idKey)) {
                uniqueMap.set(idKey, m);
              }
            });
            setSharedMemories(Array.from(uniqueMap.values()));
          }

          // Check if user is admin
          const adminStatus = await isFamilyAdmin(token).catch(() => ({ isAdmin: false }));
          const userIsAdmin = Boolean(adminStatus?.isAdmin || adminStatus === true);
          setIsAdmin(userIsAdmin);

          // Load pending approvals (if admin)
          if (userIsAdmin) {
            const approvals = await getPendingApprovals(token).catch(() => []);
            if (Array.isArray(approvals)) {
              setPendingApprovals(approvals);
            }
          }

          // Load legacy settings from backend
          const backendLegacy = await getLegacySettings(token).catch(() => null);
          if (backendLegacy) {
            setLegacySettings({
              administrator: backendLegacy.administratorName || "Sarah Murphy",
              administratorId: backendLegacy.administratorId || null,
              releaseCondition: backendLegacy.releaseCondition || "After verified passing",
              familyCircleAccess: backendLegacy.familyCircleAccess || "Full archive",
              publicProfile: backendLegacy.publicProfile || "Remain public"
            });
          }
        }
      } catch (err) {
        console.warn("Could not load backend family data, using defaults:", err);
      }
    }
    loadFamilyData();
  }, [auth.isAuthenticated, auth.firebaseUser]);

  // Load shared memories when Shared Memories tab is active
  useEffect(() => {
    async function loadSharedMemories() {
      if (activeTab === "Shared Memories") {
        setLoadingMemories(true);
        try {
          let token = null;
          if (auth.getToken) {
            try { token = await auth.getToken(); } catch (_) {}
          }
          if (!token) token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");

          if (token) {
            const memories = await getFamilySharedMemories(token).catch(() => []);
            if (Array.isArray(memories)) {
              const uniqueMap = new Map();
              memories.forEach(m => {
                if (!m) return;
                const idKey = m.id || m._id || `mem_${uniqueMap.size}`;
                if (!uniqueMap.has(idKey)) {
                  uniqueMap.set(idKey, m);
                }
              });
              setSharedMemories(Array.from(uniqueMap.values()));
            } else {
              setSharedMemories([]);
            }
          }
        } catch (err) {
          console.warn("Could not load shared memories:", err);
          setSharedMemories([]);
        } finally {
          setLoadingMemories(false);
        }
      }
    }
    loadSharedMemories();
  }, [activeTab, auth.isAuthenticated, auth.firebaseUser]);

  // Load family prompts when Ask Family tab is active
  useEffect(() => {
    async function loadPromptsData() {
      if (activeTab === "Ask Family") {
        setPromptsLoading(true);
        try {
          let token = null;
          if (auth.getToken) {
            try { token = await auth.getToken(); } catch (_) {}
          }
          if (!token) token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");

          let targetCircleId = currentCircleId;
          if (!targetCircleId && token) {
            const circleDetails = await getFamilyCircleDetails(token).catch(() => null);
            targetCircleId = circleDetails?.id || circleDetails?.data?.id || circleDetails?.familyCircleId;
            if (targetCircleId) setCurrentCircleId(targetCircleId);
          }

          if (token && targetCircleId) {
            const data = await getFamilyPrompts(token, targetCircleId).catch(() => []);
            if (Array.isArray(data)) setPromptsList(data);
          }
        } catch (err) {
          console.warn("Could not load family prompts:", err);
        } finally {
          setPromptsLoading(false);
        }
      }
    }
    loadPromptsData();
  }, [activeTab, currentCircleId, auth.isAuthenticated]);

  const handleCreatePrompt = async (e) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    try {
      let token = null;
      if (auth.getToken) {
        try { token = await auth.getToken(); } catch (_) {}
      }
      if (!token) token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");

      let targetCircleId = currentCircleId;
      if (!targetCircleId && token) {
        const circleDetails = await getFamilyCircleDetails(token).catch(() => null);
        targetCircleId = circleDetails?.id || circleDetails?.data?.id || circleDetails?.familyCircleId;
        if (targetCircleId) setCurrentCircleId(targetCircleId);
      }

      if (!targetCircleId) {
        setToastMessage("Error: Could not retrieve Family Space ID.");
        setTimeout(() => setToastMessage(""), 3000);
        return;
      }

      if (token) {
        const created = await createFamilyPrompt(token, targetCircleId, newQuestionText, promptCategory);
        if (created) {
          setPromptsList(prev => [created, ...prev]);
          setNewQuestionText("");
          setToastMessage("✓ Family question posted!");
          setTimeout(() => setToastMessage(""), 3000);
        }
      }
    } catch (err) {
      console.error("Create prompt error:", err);
      setToastMessage(`Failed to post: ${err.message || "Server error"}`);
      setTimeout(() => setToastMessage(""), 3500);
    }
  };

  const handleRespondToPrompt = async (promptId) => {
    if (!replyInputText.trim()) return;
    try {
      const token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
      if (token) {
        const newResp = await respondToFamilyPrompt(token, promptId, { text: replyInputText });
        setPromptsList(prev => prev.map(p => {
          if (p.id === promptId) {
            return { ...p, responses: [...(p.responses || []), newResp] };
          }
          return p;
        }));
        setReplyInputText("");
        setActivePromptResponseId(null);
        setToastMessage("✓ Response shared with family!");
        setTimeout(() => setToastMessage(""), 3000);
      }
    } catch (err) {
      console.error("Respond to prompt error:", err);
    }
  };

  const togglePermission = (id) => {
    setPermissions(permissions.map(p => 
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
  };

  const handleOpenEdit = (setting) => {
    let currentOptions = [...(setting.options || [])];

    // For administrator, dynamically populate options from actual connected family circle members
    if (setting.key === "administrator" && Array.isArray(membersList) && membersList.length > 0) {
      const connectedNames = membersList.map(m => m.name || m.email?.split("@")[0]).filter(Boolean);
      if (connectedNames.length > 0) {
        currentOptions = connectedNames;
      }
    }

    setEditingSetting({ ...setting, options: currentOptions });
    const activeVal = legacySettings[setting.key] || currentOptions[0] || setting.defaultVal;
    setSelectedOption(activeVal);
  };

  const handleSaveSetting = async () => {
    if (!editingSetting) return;

    const newOption = selectedOption;
    setLegacySettings(prev => ({
      ...prev,
      [editingSetting.key]: newOption
    }));

    setEditingSetting(null);
    setToastMessage(`${editingSetting.title} updated successfully!`);
    setTimeout(() => setToastMessage(""), 3000);

    try {
      const token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
      if (token) {
        await updateLegacySettings(token, {
          [editingSetting.key]: newOption
        });
      }
    } catch (err) {
      console.warn("Could not persist legacy setting to backend:", err);
    }
  };

  const handleInviteSuccess = (newMember) => {
    setToastMessage(`Invitation sent to ${newMember.name}! Connection invitation delivered.`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleApproveInvitation = async (invitationId) => {
    try {
      const token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
      if (token) {
        await approveInvitation(token, invitationId);
        setPendingApprovals(prev => prev.filter(i => i.id !== invitationId));
        // Re-fetch updated circle members so newly approved member shows up immediately
        const updatedMembers = await getFamilyCircleMembers(token).catch(() => null);
        if (Array.isArray(updatedMembers) && updatedMembers.length > 0) {
          setMembersList(updatedMembers);
        }
        setToastMessage("✓ Invitation approved! Member added to Family Circle.");
        setTimeout(() => setToastMessage(""), 3500);
      }
    } catch (err) {
      console.error("Approve invitation error:", err);
    }
  };

  const handleDeclineApproval = async (invitationId) => {
    try {
      const token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
      if (token) {
        await declineApproval(token, invitationId);
        setPendingApprovals(prev => prev.filter(i => i.id !== invitationId));
        setToastMessage("Invitation declined.");
        setTimeout(() => setToastMessage(""), 3000);
      }
    } catch (err) {
      console.error("Decline approval error:", err);
    }
  };

  const handlePromoteToAdmin = async (userId) => {
    try {
      const token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
      if (token) {
        await promoteToAdmin(token, userId);
        setMembersList(prev => prev.map(m => 
          m.id === userId ? { ...m, isAdmin: true, role: "ADMIN" } : m
        ));
        setToastMessage("Member promoted to admin!");
        setTimeout(() => setToastMessage(""), 3000);
      }
    } catch (err) {
      console.error("Promote to admin error:", err);
    }
  };

  const handleDemoteFromAdmin = async (userId) => {
    try {
      const token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
      if (token) {
        await demoteFromAdmin(token, userId);
        setMembersList(prev => prev.map(m => 
          m.id === userId ? { ...m, isAdmin: false, role: "MEMBER" } : m
        ));
        setToastMessage("Admin demoted to member.");
        setTimeout(() => setToastMessage(""), 3000);
      }
    } catch (err) {
      console.error("Demote from admin error:", err);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm("Are you sure you want to remove this member from the family circle?")) return;
    
    try {
      const token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
      if (token) {
        await removeFamilyMember(token, userId);
        setMembersList(prev => prev.filter(m => m.id !== userId));
        setToastMessage("Member removed from family circle.");
        setTimeout(() => setToastMessage(""), 3000);
      }
    } catch (err) {
      console.error("Remove member error:", err);
    }
  };

  const handleAcceptInvitation = async (invitation) => {
    try {
      const token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
      if (token && invitation.id && !invitation.id.startsWith("inv-mock")) {
        await acceptFamilyInvitation(token, invitation.id);
      }
    } catch (err) {
      console.warn("Accept invitation backend call error:", err);
    }
    setInvitationsList(prev => prev.filter(i => i.id !== invitation.id));
    if (invitation.sender) {
      setMembersList(prev => [
        {
          id: invitation.sender.id || `member-${Date.now()}`,
          name: invitation.sender.name || invitation.sender.displayName || "Family Member",
          role: invitation.relationship || "Family Member",
          isAdmin: false,
          sharedCount: 12,
          avatar: invitation.sender.avatar || invitation.sender.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
        },
        ...prev
      ]);
    }
    setToastMessage(`✓ Invitation accepted! ${invitation.sender?.name || "Member"} is now connected in your Family Circle.`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleDeclineInvitation = async (invitation) => {
    try {
      const token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
      if (token && invitation.id && !invitation.id.startsWith("inv-mock")) {
        await declineFamilyInvitation(token, invitation.id);
      }
    } catch (err) {
      console.warn("Decline invitation backend call error:", err);
    }
    setInvitationsList(prev => prev.filter(i => i.id !== invitation.id));
    setToastMessage("Invitation declined.");
    setTimeout(() => setToastMessage(""), 3000);
  };

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
          <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-[32px] md:text-[36px] font-bold text-stone-900 dark:text-white tracking-tight leading-tight">Family Circle</h1>
              <p className="text-stone-500 dark:text-stone-400 font-medium text-[15px] mt-1">{membersList.length} members · Private space</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsLinkModalOpen(true)}
                className="bg-white hover:bg-stone-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#4A3AFF] dark:text-indigo-300 border border-[#4A3AFF]/30 dark:border-indigo-500/30 px-4 py-2.5 rounded-[12px] font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-[14px]"
              >
                <Link2 size={18} strokeWidth={2.5} />
                <span>Link Memory</span>
              </button>

              <button 
                onClick={() => setIsInviteModalOpen(true)}
                className="bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white px-5 py-2.5 rounded-[12px] font-bold transition-all shadow-md flex items-center justify-center gap-2 max-w-max cursor-pointer active:scale-95 text-[14px]"
              >
                <UserPlus size={18} strokeWidth={2.5} />
                <span>Invite member</span>
              </button>
            </div>
          </motion.div>

          {/* Tab Bar - Exact Figma match with dynamic badge count */}
          <motion.div variants={fadeInUp} className="bg-white/80 dark:bg-slate-900/80 border border-[#C7D2FE]/70 dark:border-slate-800 p-1.5 rounded-[20px] inline-flex items-center gap-1.5 mb-8 overflow-x-auto max-w-full shadow-xs">
            {[
              { id: "Members", label: "Members" },
              { id: "Invitations", label: "Invitations", badge: invitationsList.length + pendingApprovals.length },
              { id: "Shared Memories", label: "Shared Memories" },
              { id: "Ask Family", label: "Ask Family" },
              { id: "Family Tree", label: "Family Tree" },
              { id: "Legacy Access", label: "Legacy Access" }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-[14px] text-[14px] font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  activeTab === tab.id 
                  ? "bg-[#4A3AFF] text-white shadow-md" 
                  : "text-[#3F436E] dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-[#EEF2FF] dark:hover:bg-slate-800"
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`w-5 h-5 rounded-full text-[11px] font-extrabold flex items-center justify-center ${
                    activeTab === tab.id ? "bg-white text-[#4A3AFF]" : "bg-[#4A3AFF] text-white"
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </motion.div>

          {/* Active Tab Content: Members */}
          {activeTab === "Members" && (
            <motion.div variants={staggerContainer} initial="hidden" animate="show">
              {/* Members Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
                {membersList.map((member) => {
                  const isSelf = member.id === currentProfile?.id || (member.email && member.email === currentProfile?.email);
                  const realPhoto = isSelf ? (currentProfile?.photoURL || member.avatar || member.photoURL) : (member.avatar || member.photoURL);

                  const nameToDisplay = (member.name && member.name !== "Admin") 
                    ? member.name 
                    : (member.email?.split("@")[0] || "Family Member");

                  const relationshipToDisplay = (member.relationship === "Admin" || member.relationship === "ADMIN")
                    ? "Circle Creator"
                    : (member.relationship || member.role || "Family Member");

                  const initials = String(nameToDisplay || "Member").split(" ").map(n => n ? n[0] : "").join("").toUpperCase().slice(0, 2) || "M";
                  const hasRealPhoto = Boolean(realPhoto && typeof realPhoto === "string" && realPhoto.startsWith("http"));

                  return (
                    <motion.div 
                      variants={fadeInUp}
                      key={member.id} 
                      className={`figma-card p-6 flex items-center justify-between transition-all duration-300 ${
                        member.isAdmin ? "ring-2 ring-[#4A3AFF]" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          {hasRealPhoto ? (
                            <img src={realPhoto} alt={nameToDisplay} className="w-14 h-14 rounded-full object-cover border border-[#C7D2FE]/50 shadow-xs" />
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#4A3AFF] to-[#6C5DD3] text-white font-black text-lg flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-xs">
                              {initials}
                            </div>
                          )}
                          {member.isAdmin && (
                            <div className="absolute -bottom-1 -right-1 bg-[#4A3AFF] text-white w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#EAEBFF]">
                              <ShieldCheck size={10} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-[17px] text-stone-900 dark:text-white leading-tight">{nameToDisplay}</h3>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[13px] font-medium text-stone-600 dark:text-stone-400">{relationshipToDisplay}</span>
                            {member.role === "ADMIN" || member.isAdmin ? (
                              <span className="bg-[#4A3AFF] text-white text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-[6px]">Admin</span>
                            ) : member.role === "ADULT_MEMBER" ? (
                              <span className="bg-[#EEF2FF] text-[#4A3AFF] dark:bg-indigo-950 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-[6px]">Adult Member</span>
                            ) : member.role === "CONTRIBUTOR" ? (
                              <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-[6px]">Contributor</span>
                            ) : member.role === "RESTRICTED_MINOR" ? (
                              <span className="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-[6px]">Minor</span>
                            ) : member.role === "GUEST" ? (
                              <span className="bg-stone-100 text-stone-600 dark:bg-slate-800 dark:text-stone-300 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-[6px]">Guest</span>
                            ) : (
                              <span className="bg-[#EEF2FF] text-[#4A3AFF] text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-[6px]">Member</span>
                            )}
                          </div>
                          <p className="text-[12px] font-medium text-stone-500 dark:text-stone-400 mt-1">{member.sharedCount || 0} shared memories</p>
                        </div>
                      </div>
                      
                    </motion.div>
                  );
                })}

                {/* Invite Card */}
                <motion.button 
                  onClick={() => setIsInviteModalOpen(true)}
                  variants={fadeInUp} 
                  className="relative w-full rounded-[20px] p-6 bg-[#4A3AFF] hover:bg-[#3b2dd1] transition-all flex flex-col justify-center text-left shadow-md group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white text-[#4A3AFF] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                      <UserPlus size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[18px] text-white mb-0.5">Invite a family member</h3>
                      <span className="bg-[#EEF2FF] text-[#4A3AFF] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[6px]">Admin only</span>
                    </div>
                  </div>
                </motion.button>
              </div>

              {/* Permissions & Security Section */}
              <motion.div variants={fadeInUp} className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                <div className="p-6 pb-2">
                  <h2 className="font-bold text-[18px] text-stone-900 dark:text-white">Circle permissions</h2>
                </div>
                <div className="flex flex-col flex-1">
                  {permissions.map((perm, index) => (
                    <div key={perm.id} className={`flex items-center justify-between p-6 ${index !== permissions.length - 1 ? "border-b border-stone-100 dark:border-stone-800" : ""}`}>
                      <span className="text-[15px] font-medium text-stone-600 dark:text-stone-300">{perm.label}</span>
                      
                      {/* Custom Toggle Switch */}
                      <button 
                        onClick={() => togglePermission(perm.id)}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${perm.enabled ? "bg-[#4A3AFF]" : "bg-stone-200 dark:bg-slate-700"}`}
                      >
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${perm.enabled ? "translate-x-6 shadow-sm" : "translate-x-1"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Guardian & Minor Safety Controls Section */}
              {(isAdmin || currentProfile?.role === "ADMIN") && guardianMinorsList.length > 0 && (
                <motion.div variants={fadeInUp} className="mt-8 figma-card p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h2 className="font-bold text-[18px] text-stone-900 dark:text-white">Guardian & Minor Safety Controls</h2>
                      <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Manage posting privileges and consent for minor accounts.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {guardianMinorsList.map(({ user, consent }) => (
                      <div key={user?.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-stone-50 dark:bg-slate-800/60 rounded-2xl border border-stone-200/60 dark:border-slate-700/60 gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user?.photoURL || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80"}
                            alt={user?.displayName || "Minor User"}
                            className="w-11 h-11 rounded-full object-cover border border-[#C7D2FE]"
                          />
                          <div>
                            <h4 className="font-bold text-sm text-stone-900 dark:text-white">{user?.displayName || user?.name || "Minor Member"}</h4>
                            <p className="text-xs text-stone-500 dark:text-stone-400">{user?.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <span className="text-xs font-medium text-stone-600 dark:text-stone-300">
                            Allow publishing without approval:
                          </span>
                          <button
                            onClick={() => handleToggleConsentPost(user?.id, consent?.canPostWithoutApproval)}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                              consent?.canPostWithoutApproval ? "bg-emerald-500" : "bg-stone-300 dark:bg-slate-700"
                            }`}
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                                consent?.canPostWithoutApproval ? "translate-x-6 shadow-sm" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Active Tab Content: Invitations (Interactive Invitations Manager) */}
          {activeTab === "Invitations" && (
            <motion.div variants={staggerContainer} initial="hidden" animate="show">
              {invitationsList.length === 0 && pendingApprovals.length === 0 ? (
                <motion.div variants={fadeInUp} className="figma-card p-12 text-center flex flex-col items-center justify-center max-w-xl mx-auto my-8">
                  <div className="w-16 h-16 rounded-full bg-[#EEF2FF] text-[#4A3AFF] flex items-center justify-center mb-4 shadow-xs">
                    <UserPlus size={28} />
                  </div>
                  <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-2">No Pending Invitations</h2>
                  <p className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-6">
                    You're all caught up! New family circle invitations and member join requests will appear here.
                  </p>
                  <button 
                    onClick={() => setIsInviteModalOpen(true)}
                    className="px-6 py-3 bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <UserPlus size={16} />
                    <span>Invite Family Member</span>
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-6 max-w-4xl mx-auto my-4">
                  {/* Section 1: Join Requests Waiting for Admin Approval */}
                  {pendingApprovals.length > 0 && (
                    <div className="space-y-4">
                      <div className="p-2 mb-1 flex items-center justify-between">
                        <div>
                          <h2 className="font-bold text-xl text-stone-900 dark:text-white mb-0.5 flex items-center gap-2">
                            <span>Member Join Requests</span>
                            <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{pendingApprovals.length}</span>
                          </h2>
                          <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">People who accepted your invitation link and are waiting for your approval to join.</p>
                        </div>
                      </div>

                      {pendingApprovals.map((approval) => {
                        const displayName = approval.receiverName || approval.receiver?.displayName || approval.receiver?.name || approval.email || "Family Member";
                        const avatar = approval.receiverAvatar || approval.receiver?.photoURL || approval.receiver?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";

                        return (
                          <motion.div 
                            key={approval.id} 
                            variants={fadeInUp} 
                            className="figma-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-all hover:shadow-lg border-l-4 border-l-amber-500"
                          >
                            <div className="flex items-center gap-4">
                              <img 
                                src={avatar} 
                                alt={displayName} 
                                className="w-14 h-14 rounded-full object-cover border-2 border-[#C7D2FE]" 
                              />
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="font-bold text-[17px] text-stone-900 dark:text-white">{displayName}</h3>
                                  <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 rounded-full text-xs font-bold border border-amber-200/80 dark:border-amber-800/50 flex items-center gap-1.5">
                                    <Clock size={13} className="text-amber-500" />
                                    <span>Wants to join as {approval.relationship || "Family Member"}</span>
                                  </span>
                                </div>
                                <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mt-1">{approval.email || approval.receiver?.email || approval.phoneNumber}</p>
                                <p className="text-[11px] text-stone-400 mt-0.5">Method: {approval.method || "LINK"} • Pending Admin Approval</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <button
                                onClick={() => handleDeclineApproval(approval.id)}
                                className="px-4 py-2.5 border border-stone-200 dark:border-slate-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold transition cursor-pointer"
                              >
                                Decline
                              </button>
                              <button
                                onClick={() => handleApproveInvitation(approval.id)}
                                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer active:scale-95 flex items-center gap-1.5"
                              >
                                <Check size={16} strokeWidth={2.5} />
                                <span>Approve</span>
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  {/* Section 2: Direct Incoming Invitations */}
                  {invitationsList.length > 0 && (
                    <div className="space-y-4 pt-2">
                      <div className="p-2 mb-1">
                        <h2 className="font-bold text-xl text-stone-900 dark:text-white mb-0.5">Incoming Invitations ({invitationsList.length})</h2>
                        <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Review and accept invitations from family members wishing to connect.</p>
                      </div>

                      {invitationsList.map((inv) => (
                        <motion.div 
                          key={inv.id} 
                          variants={fadeInUp} 
                          className="figma-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-all hover:shadow-lg"
                        >
                          <div className="flex items-center gap-4">
                            <img 
                              src={inv.sender?.avatar || inv.sender?.photoURL || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80"} 
                              alt={inv.sender?.name || inv.sender?.displayName} 
                              className="w-14 h-14 rounded-full object-cover border-2 border-[#C7D2FE]" 
                            />
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-bold text-[17px] text-stone-900 dark:text-white">{inv.sender?.displayName || inv.sender?.name || "Family Member"}</h3>
                                <span className="px-3 py-1 bg-[#EEF2FF] dark:bg-indigo-950 text-[#4A3AFF] dark:text-indigo-300 rounded-full text-xs font-bold border border-[#D1D9FF] dark:border-indigo-800/40">
                                  Wants to connect as {inv.relationship || "Family"}
                                </span>
                              </div>
                              <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mt-1">{inv.sender?.email}</p>
                              <p className="text-[11px] text-stone-400 mt-0.5">Received {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : "recently"}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <button
                              onClick={() => handleDeclineInvitation(inv)}
                              className="px-4 py-2.5 border border-stone-200 dark:border-slate-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold transition cursor-pointer"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => handleAcceptInvitation(inv)}
                              className="px-5 py-2.5 bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer active:scale-95 flex items-center gap-1.5"
                            >
                              <Check size={16} strokeWidth={2.5} />
                              <span>Accept & Connect</span>
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Active Tab Content: Ask Family */}
          {activeTab === "Ask Family" && (
            <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-8">
              {/* Question Composer Card */}
              <motion.div variants={fadeInUp} className="figma-card p-6 md:p-8">
                <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-2">Ask the Family</h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mb-4">
                  Ask a question to start a family discussion or preserve multi-generational memories.
                </p>

                <form onSubmit={handleCreatePrompt} className="space-y-4">
                  <div>
                    <textarea
                      rows={3}
                      value={newQuestionText}
                      onChange={(e) => setNewQuestionText(e.target.value)}
                      placeholder="e.g. What was grandpa's favorite memory growing up? Or tell us about our first family holiday!"
                      className="w-full p-4 rounded-2xl border border-[#C7D2FE]/70 dark:border-slate-800 bg-white dark:bg-slate-900 text-stone-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-[#4A3AFF] focus:outline-none transition resize-none"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-500 dark:text-stone-400">Category:</span>
                      {["Heritage", "Childhood", "Traditions", "Fun"].map((cat) => (
                        <button
                          type="button"
                          key={cat}
                          onClick={() => setPromptCategory(cat)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                            promptCategory === cat
                              ? "bg-[#4A3AFF] text-white shadow-xs"
                              : "bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={!newQuestionText.trim()}
                      className="px-6 py-2.5 bg-[#4A3AFF] hover:bg-[#3b2dd1] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer active:scale-95"
                    >
                      Post Question
                    </button>
                  </div>
                </form>
              </motion.div>

              {/* Prompts Stream */}
              <div className="space-y-6">
                {promptsLoading ? (
                  <div className="text-center py-12 text-stone-400 text-sm font-medium">Loading family questions...</div>
                ) : promptsList.length === 0 ? (
                  <div className="figma-card p-12 text-center flex flex-col items-center justify-center">
                    <TreePine size={32} className="text-[#4A3AFF] mb-3" />
                    <h3 className="font-bold text-base text-stone-900 dark:text-white">No family questions yet</h3>
                    <p className="text-xs text-stone-400 max-w-sm mt-1">
                      Be the first to post a question above to ignite family conversations!
                    </p>
                  </div>
                ) : (
                  promptsList.map((prompt) => (
                    <motion.div key={prompt.id} variants={fadeInUp} className="figma-card p-6 md:p-8 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={prompt.createdBy?.photoURL || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80"}
                            alt={prompt.createdBy?.displayName || "Member"}
                            className="w-10 h-10 rounded-full object-cover border border-[#C7D2FE]"
                          />
                          <div>
                            <h4 className="font-bold text-sm text-stone-900 dark:text-white leading-tight">
                              {prompt.createdBy?.displayName || prompt.createdBy?.name || "Family Member"}
                            </h4>
                            <p className="text-[11px] text-stone-400">
                              Asked {new Date(prompt.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <span className="px-3 py-1 bg-[#EEF2FF] text-[#4A3AFF] dark:bg-indigo-950 dark:text-indigo-300 rounded-full text-xs font-bold border border-[#D1D9FF] dark:border-indigo-800/40">
                          {prompt.category || "Heritage"}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-stone-900 dark:text-white leading-snug">
                        "{prompt.question}"
                      </h3>

                      {/* Responses List */}
                      {prompt.responses && prompt.responses.length > 0 && (
                        <div className="pl-4 border-l-2 border-[#4A3AFF]/30 space-y-3 pt-2">
                          {prompt.responses.map((resp) => (
                            <div key={resp.id} className="bg-stone-50/80 dark:bg-slate-800/60 p-3.5 rounded-2xl space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-stone-900 dark:text-white">
                                  {resp.author?.displayName || resp.author?.name || "Family Member"}
                                </span>
                                <span className="text-[10px] text-stone-400">
                                  {new Date(resp.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-xs text-stone-700 dark:text-stone-300 font-medium">
                                {resp.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Action */}
                      {activePromptResponseId === prompt.id ? (
                        <div className="pt-2 flex items-center gap-2">
                          <input
                            type="text"
                            value={replyInputText}
                            onChange={(e) => setReplyInputText(e.target.value)}
                            placeholder="Write your response..."
                            className="flex-1 px-4 py-2 rounded-xl border border-stone-300 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-[#4A3AFF] focus:outline-none"
                          />
                          <button
                            onClick={() => handleRespondToPrompt(prompt.id)}
                            disabled={!replyInputText.trim()}
                            className="px-4 py-2 bg-[#4A3AFF] text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                          >
                            Send
                          </button>
                          <button
                            onClick={() => setActivePromptResponseId(null)}
                            className="px-3 py-2 text-stone-400 hover:text-stone-600 text-xs font-bold"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setActivePromptResponseId(prompt.id);
                            setReplyInputText("");
                          }}
                          className="text-xs font-bold text-[#4A3AFF] hover:underline cursor-pointer pt-1"
                        >
                          + Add your response
                        </button>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Active Tab Content: Legacy Access (Exact Figma match - 3D Card with Inset Shadow) */}
          {activeTab === "Legacy Access" && (
            <motion.div variants={staggerContainer} initial="hidden" animate="show">
              {/* Single Large 3D Card */}
              <motion.div variants={fadeInUp} className="legacy-3d-card p-8 md:p-10 mb-8 relative overflow-hidden">
                
                {/* Card Header */}
                <div className="mb-8">
                  <h2 className="font-bold text-[24px] md:text-[26px] text-stone-900 dark:text-white tracking-tight mb-2">
                    Legacy Release Settings
                  </h2>
                  <p className="text-[14px] md:text-[15px] font-medium text-[#73789E] dark:text-stone-400 leading-relaxed max-w-3xl">
                    Configure who receives access to your archive, and when. These settings are private and can be updated at any time.
                  </p>
                </div>

                {/* Settings Rows with Thin Dividers */}
                <div className="space-y-0 divide-y divide-[#D9E0FF] dark:divide-stone-700/60">
                  {LEGACY_SETTINGS_DATA.map((setting) => {
                    const currentVal = legacySettings[setting.key] || setting.defaultVal;
                    return (
                      <div key={setting.id} className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0">
                        <div>
                          <h3 className="font-bold text-[16px] text-stone-900 dark:text-white mb-0.5">{setting.title}</h3>
                          <p className="text-[13px] font-medium text-stone-400 dark:text-stone-500">{setting.description}</p>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                          <span className="px-4 py-2 bg-[#EEF2FF] dark:bg-indigo-950/60 text-[#4A3AFF] dark:text-indigo-300 rounded-full text-[13px] font-bold border border-[#D1D9FF] dark:border-indigo-800/40 shadow-xs">
                            {currentVal}
                          </span>
                          <button 
                            onClick={() => handleOpenEdit(setting)}
                            className="px-5 py-2 border border-[#4A3AFF] text-[#4A3AFF] dark:text-indigo-300 dark:border-indigo-400 rounded-[10px] text-[13px] font-bold hover:bg-[#4A3AFF] hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
              </motion.div>
            </motion.div>
          )}

          {/* Active Tab Content: Family Tree */}
          {activeTab === "Family Tree" && (
            <div className="animate-fade-in">
              <div className="figma-card mb-12 p-10 min-h-[500px] flex flex-col items-center justify-center">
                
                {/* Header */}
                <div className="text-center mb-16">
                  <div className="mx-auto text-[#4A3AFF] mb-4 flex justify-center">
                    <TreePine size={40} strokeWidth={2.5} />
                  </div>
                  <h2 className="font-bold text-[24px] text-stone-900 dark:text-white mb-2">Family Tree</h2>
                  <p className="text-[15px] font-medium text-stone-600 dark:text-stone-400 max-w-sm mx-auto">
                    Build your family tree and connect memories across generations.
                  </p>
                </div>

                {/* Tree Diagram */}
                {(() => {
                  const myEmail = currentProfile?.email?.toLowerCase();
                  const myName = currentProfile?.displayName || currentProfile?.name || myEmail?.split("@")[0] || "Mu Safi";
                  const myAvatar = currentProfile?.photoURL || currentProfile?.avatar;
                  const myInitials = String(myName).split(" ").map(n => n ? n[0] : "").join("").toUpperCase().slice(0, 2) || "M";

                  const otherMembers = membersList.filter(m => {
                    if (!m) return false;
                    if (myEmail && m.email && m.email.toLowerCase() === myEmail) return false;
                    return true;
                  });

                  return (
                    <div className="flex flex-col items-center">
                      
                      {/* Root Node (You) */}
                      <div className="flex flex-col items-center z-10">
                        {myAvatar && typeof myAvatar === "string" && myAvatar.startsWith("http") ? (
                          <img src={myAvatar} alt={myName} className="w-16 h-16 rounded-full object-cover shadow-md mb-2" />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#4A3AFF] to-[#6C5DD3] text-white font-bold text-base flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-md mb-2">
                            {myInitials}
                          </div>
                        )}
                        <span className="font-bold text-[15px] text-stone-900 dark:text-white">{myName}</span>
                        <span className="text-[12px] font-medium text-stone-500 dark:text-stone-400">You</span>
                      </div>

                      {/* Vertical connecting line */}
                      <div className="w-[1.5px] h-16 bg-stone-300 dark:bg-stone-700 my-4"></div>

                      {/* Children / Connected Member Nodes */}
                      <div className="flex flex-wrap justify-center gap-8 md:gap-12 mt-2">
                        {otherMembers.length > 0 ? (
                          otherMembers.map((member) => {
                            const mName = member.name || member.email?.split("@")[0] || "Family Member";
                            const mInitials = String(mName).split(" ").map(n => n ? n[0] : "").join("").toUpperCase().slice(0, 2) || "M";
                            const mAvatar = member.avatar || member.photoURL;
                            const mRel = member.relationship || (member.isAdmin ? "Admin" : "Family Member");

                            return (
                              <div key={member.id || member.email} className="flex flex-col items-center z-10">
                                {mAvatar && typeof mAvatar === "string" && mAvatar.startsWith("http") ? (
                                  <img src={mAvatar} alt={mName} className="w-14 h-14 rounded-full object-cover shadow-sm mb-2" />
                                ) : (
                                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#4A3AFF] to-[#6C5DD3] text-white font-bold text-sm flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm mb-2">
                                    {mInitials}
                                  </div>
                                )}
                                <span className="font-bold text-[14px] text-stone-900 dark:text-white">{mName}</span>
                                <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">{mRel}</span>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center text-xs font-medium text-stone-500 dark:text-stone-400">
                            No other connected family members yet.
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })()}

              </div>
            </div>
          )}

          {/* Shared Memories Tab */}
          {activeTab === "Shared Memories" && (
            <motion.div variants={staggerContainer} initial="hidden" animate="show" className="w-full">
              {loadingMemories ? (
                <motion.div variants={fadeInUp} className="figma-card py-20 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-[#4A3AFF] border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-stone-500 dark:text-stone-400">Loading shared memories...</p>
                </motion.div>
              ) : sharedMemories.length === 0 ? (
                <motion.div variants={fadeInUp} className="figma-card p-12 flex flex-col items-center justify-center text-center my-6">
                  <div className="w-16 h-16 rounded-full bg-[#EEF2FF] text-[#4A3AFF] flex items-center justify-center mb-4 shadow-sm">
                    <Heart size={32} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-2">No Shared Family Memories Yet</h2>
                  <p className="text-stone-500 dark:text-stone-400 max-w-md text-sm leading-relaxed">
                    When connected family members publish memories with family or public privacy, they will automatically appear here.
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-6 w-full my-4">
                  <div className="flex items-center justify-between p-2 mb-2">
                    <div>
                      <h2 className="font-bold text-xl text-stone-900 dark:text-white mb-0.5 flex items-center gap-2">
                        <span>Shared Family Memories</span>
                        <span className="bg-[#4A3AFF] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">{sharedMemories.length}</span>
                      </h2>
                      <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Stories, voices, and photos shared across your connected family circle.</p>
                    </div>
                  </div>

                  <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 w-full block">
                    {sharedMemories.map((memory) => {
                      const normType = (memory.type || "").toLowerCase();
                      const isVoice = normType === "voice" || normType === "audio" || !!memory.audioUrl || !!memory.audio;
                      
                      const mediaItems = [];
                      if (!isVoice) {
                        const addMedia = (url, type = "image") => {
                          if (!url || typeof url !== "string") return;
                          const cleanUrl = url.split("?")[0].toLowerCase();
                          if (/\.(mp3|wav|m4a|aac|ogg)$/i.test(cleanUrl) || type === "voice" || type === "audio") return;
                          const isVid = (type === "video") || /\.(mp4|mov|avi|m4v)$/i.test(cleanUrl);
                          if (!mediaItems.some(i => i.url === url)) {
                            mediaItems.push({ url, type: isVid ? "video" : "image" });
                          }
                        };

                        if (Array.isArray(memory.mediaList)) {
                          memory.mediaList.forEach(m => addMedia(m?.mediaUrl || m?.url, m?.type));
                        }
                        if (Array.isArray(memory.media)) {
                          memory.media.forEach(m => typeof m === "string" ? addMedia(m) : addMedia(m?.url || m?.mediaUrl, m?.type));
                        }
                        addMedia(memory.videoUrl, "video");
                        addMedia(memory.imageUrl);
                        addMedia(memory.image);
                      }

                      const hasMedia = !isVoice && mediaItems.length > 0;
                      const isVideo = !isVoice && (normType === "video" || mediaItems.some(m => m.type === "video"));
                      
                      const dateVal = memory.date || memory.createdAt || memory.occurredAt;
                      const dateStr = dateVal ? new Date(dateVal).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent";

                      const ownerName = memory.ownerDisplayName || memory.owner?.name || memory.ownerEmail?.split("@")[0] || "Family Member";
                      const ownerAvatar = memory.ownerAvatarUrl || memory.owner?.avatar || memory.owner?.photoURL;
                      const ownerInitials = String(ownerName).split(" ").map(n => n ? n[0] : "").join("").toUpperCase().slice(0, 2) || "M";
                      const ownerRel = memory.ownerRelationship || "Family Member";

                      const openView = () => {
                        window.dispatchEvent(new CustomEvent("openMemoryView", { detail: { ...memory, date: dateStr } }));
                      };

                      return (
                        <motion.div
                          key={memory.id || memory._id}
                          variants={fadeInUp}
                          onClick={openView}
                          className="figma-card overflow-hidden group break-inside-avoid cursor-pointer flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-300 w-full mb-6"
                        >
                          {/* Author Info Header */}
                          <div className="p-4 pb-2 flex items-center justify-between gap-3 border-b border-stone-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                              {ownerAvatar && typeof ownerAvatar === "string" && ownerAvatar.startsWith("http") ? (
                                <img src={ownerAvatar} alt={ownerName} className="w-10 h-10 rounded-full object-cover border border-[#C7D2FE]/60" />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4A3AFF] to-[#6C5DD3] text-white font-bold text-xs flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-xs">
                                  {ownerInitials}
                                </div>
                              )}
                              <div>
                                <h4 className="font-bold text-[14px] text-stone-900 dark:text-white leading-tight">{ownerName}</h4>
                                <span className="text-[11px] font-semibold text-[#4A3AFF] dark:text-indigo-400">{ownerRel}</span>
                              </div>
                            </div>
                            <span className="text-[11px] font-medium text-stone-400">{dateStr}</span>
                          </div>

                          {/* Card Content by Type */}
                          <div className="p-4 pt-3 flex flex-col flex-1">
                            {hasMedia && (
                              <div className="mb-4">
                                <CardMediaSlider mediaItems={mediaItems} title={memory.title} />
                              </div>
                            )}

                            <div className="flex items-center gap-2 mb-2">
                              {isVoice ? (
                                <>
                                  <Mic size={14} strokeWidth={2.5} className="text-[#f59e0b]" />
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#f59e0b]">VOICE MEMORY</span>
                                </>
                              ) : isVideo ? (
                                <>
                                  <Film size={14} strokeWidth={2.5} className="text-[#ec4899]" />
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#ec4899]">VIDEO</span>
                                </>
                              ) : (
                                <>
                                  <FileText size={14} strokeWidth={2.5} className="text-[#10b981]" />
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#10b981]">{hasMedia ? "PHOTO MEMORY" : "WRITTEN STORY"}</span>
                                </>
                              )}
                            </div>

                            <h3 className="text-[18px] font-bold mb-2 text-stone-900 dark:text-white group-hover:text-[#4A3AFF] transition-colors leading-snug">{memory.title}</h3>
                            {memory.description && <p className="text-stone-500 dark:text-stone-400 text-xs line-clamp-3 leading-relaxed mb-4">{memory.description}</p>}

                            {isVoice && (
                              <div className="my-2 w-full" onClick={(e) => e.stopPropagation()}>
                                <VoicePlayer memory={memory} />
                              </div>
                            )}
                          </div>

                          {/* Tags footer */}
                          <div className="p-4 pt-0 mt-auto flex flex-wrap gap-1.5">
                            {(memory.tags && memory.tags.length > 0 ? memory.tags : ['family']).map((tag) => (
                              <span key={tag} className="px-2.5 py-0.5 bg-[#EEF2FF] dark:bg-slate-800 text-[#4A3AFF] dark:text-indigo-300 rounded-full text-[10px] font-bold">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </div>
      </motion.div>

      {/* Edit Setting Modal */}
      {editingSetting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-[28px] w-full max-w-md p-6 shadow-2xl relative">
            <button 
              onClick={() => setEditingSetting(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] dark:bg-indigo-950 text-[#4A3AFF] dark:text-indigo-400 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-stone-900 dark:text-white">{editingSetting.title}</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">{editingSetting.description}</p>
              </div>
            </div>

            <div className="space-y-2 mb-6 mt-4">
              {editingSetting.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSelectedOption(opt)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                    selectedOption === opt
                      ? "border-[#4A3AFF] bg-[#EEF2FF] text-[#4A3AFF] dark:bg-indigo-950/80 dark:text-indigo-300 shadow-xs"
                      : "border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>{opt}</span>
                  {selectedOption === opt && <Check size={16} className="text-[#4A3AFF] dark:text-indigo-400" />}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setEditingSetting(null)}
                className="flex-1 py-3 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-700 dark:text-stone-300 font-extrabold text-xs hover:bg-stone-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSetting}
                className="flex-1 py-3 bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white font-extrabold rounded-xl text-xs shadow-md transition-all cursor-pointer active:scale-95"
              >
                Save Setting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Memory Modal */}
      <LinkMemoryModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        familyCircleId={currentCircleId}
        onLinkSuccess={() => {
          setToastMessage("✓ Memory linked to Family Space!");
          setTimeout(() => setToastMessage(""), 3500);
        }}
      />

      {/* Invite Member Modal */}
      <InviteMemberModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSuccess={handleInviteSuccess}
      />
    </WavesBackground>
  );
}
