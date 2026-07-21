"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import WavesBackground from "@/components/layout/WavesBackground";
import { UserPlus, Heart, Lock, Check, TreePine, X, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp, fadeIn } from "@/lib/animations";
import InviteMemberModal from "./components/InviteMemberModal";
import { 
  getFamilyMembers, 
  getFamilyInvitations, 
  acceptFamilyInvitation, 
  declineFamilyInvitation 
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
  const [activeTab, setActiveTab] = useState("Legacy Access");
  const [membersList, setMembersList] = useState(MOCK_MEMBERS);
  const [invitationsList, setInvitationsList] = useState([]);
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

  // Load connected family members & pending invitations from backend
  useEffect(() => {
    async function loadFamilyData() {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const [backendMembers, backendInvites] = await Promise.all([
            getFamilyMembers(token).catch(() => null),
            getFamilyInvitations(token).catch(() => null)
          ]);
          if (Array.isArray(backendMembers) && backendMembers.length > 0) {
            setMembersList(backendMembers);
          }
          if (Array.isArray(backendInvites)) {
            setInvitationsList(backendInvites);
          }
        }
      } catch (err) {
        console.warn("Could not load backend family data, using defaults:", err);
      }
    }
    loadFamilyData();
  }, []);

  const togglePermission = (id) => {
    setPermissions(permissions.map(p => 
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
  };

  const handleOpenEdit = (setting) => {
    setEditingSetting(setting);
    setSelectedOption(legacySettings[setting.key] || setting.defaultVal);
  };

  const handleSaveSetting = () => {
    if (!editingSetting) return;
    setLegacySettings(prev => ({
      ...prev,
      [editingSetting.key]: selectedOption
    }));
    setEditingSetting(null);
    setToastMessage(`${editingSetting.title} updated successfully!`);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleInviteSuccess = (newMember) => {
    setToastMessage(`Invitation sent to ${newMember.name}! Connection invitation delivered.`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleAcceptInvitation = async (invitation) => {
    try {
      const token = localStorage.getItem("token");
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
      const token = localStorage.getItem("token");
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
              <p className="text-stone-500 dark:text-stone-400 font-medium text-[15px] mt-1">{membersList.length} members · Private circle</p>
            </div>
            
            <button 
              onClick={() => setIsInviteModalOpen(true)}
              className="bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white px-5 py-2.5 rounded-[12px] font-bold transition-all shadow-md flex items-center justify-center gap-2 max-w-max cursor-pointer active:scale-95"
            >
              <UserPlus size={18} strokeWidth={2.5} />
              <span className="text-[14px]">Invite member</span>
            </button>
          </motion.div>

          {/* Tab Bar - Exact Figma match with dynamic badge count */}
          <motion.div variants={fadeInUp} className="bg-white/80 dark:bg-slate-900/80 border border-[#C7D2FE]/70 dark:border-slate-800 p-1.5 rounded-[20px] inline-flex items-center gap-1.5 mb-8 overflow-x-auto max-w-full shadow-xs">
            {[
              { id: "Members", label: "Members" },
              { id: "Invitations", label: "Invitations", badge: invitationsList.length },
              { id: "Shared Memories", label: "Shared Memories" },
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
                {membersList.map((member, index) => {
                  const isFirst = index === 0;
                  return (
                    <motion.div 
                      variants={fadeInUp}
                      key={member.id} 
                      className={`figma-card p-6 flex items-center justify-between transition-all duration-300 ${
                        member.isAdmin ? "ring-2 ring-[#4A3AFF]" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img src={member.avatar} alt={member.name} className="w-14 h-14 rounded-full object-cover border border-[#C7D2FE]/50" />
                          {isFirst && (
                            <div className="absolute -bottom-1 -right-1 bg-[#4A3AFF] text-white w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#EAEBFF]">
                              <Check size={10} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-[17px] text-stone-900 dark:text-white leading-tight">{member.name}</h3>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[13px] font-medium text-stone-600 dark:text-stone-400">{member.role}</span>
                            {member.isAdmin && (
                              <span className="bg-white/80 border border-[#C7D2FE] text-[#4A3AFF] text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-[6px]">Admin</span>
                            )}
                          </div>
                          <p className="text-[12px] font-medium text-stone-500 dark:text-stone-400 mt-1">{member.sharedCount || 0} shared memories</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button className="w-9 h-9 rounded-[10px] bg-[#7B61FF] text-white flex items-center justify-center hover:bg-[#6b4fe6] transition-colors shadow-sm cursor-pointer">
                          <Heart size={16} strokeWidth={2.5} />
                        </button>
                        <button className="w-9 h-9 rounded-[10px] bg-[#7B61FF] text-white flex items-center justify-center hover:bg-[#6b4fe6] transition-colors shadow-sm cursor-pointer">
                          <Lock size={16} strokeWidth={2.5} />
                        </button>
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
            </motion.div>
          )}

          {/* Active Tab Content: Invitations (Interactive Invitations Manager) */}
          {activeTab === "Invitations" && (
            <motion.div variants={staggerContainer} initial="hidden" animate="show">
              {invitationsList.length === 0 ? (
                <motion.div variants={fadeInUp} className="figma-card p-12 text-center flex flex-col items-center justify-center max-w-xl mx-auto my-8">
                  <div className="w-16 h-16 rounded-full bg-[#EEF2FF] text-[#4A3AFF] flex items-center justify-center mb-4 shadow-xs">
                    <UserPlus size={28} />
                  </div>
                  <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-2">No Pending Invitations</h2>
                  <p className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-6">
                    You're all caught up! New family circle invitations will appear here when members invite you.
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
                <div className="space-y-4 max-w-4xl mx-auto my-4">
                  <div className="p-2 mb-2">
                    <h2 className="font-bold text-xl text-stone-900 dark:text-white mb-1">Pending Family Invitations ({invitationsList.length})</h2>
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
                          src={inv.sender?.avatar || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80"} 
                          alt={inv.sender?.name} 
                          className="w-14 h-14 rounded-full object-cover border-2 border-[#C7D2FE]" 
                        />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-[17px] text-stone-900 dark:text-white">{inv.sender?.name || "Family Member"}</h3>
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
                <div className="flex flex-col items-center">
                  
                  {/* Root Node (You) */}
                  <div className="flex flex-col items-center z-10">
                    <img src={FAMILY_TREE_DATA.me.avatar} alt="You" className="w-16 h-16 rounded-full object-cover shadow-md mb-2" />
                    <span className="font-bold text-[15px] text-stone-900 dark:text-white">{FAMILY_TREE_DATA.me.name}</span>
                    <span className="text-[12px] font-medium text-stone-500 dark:text-stone-400">{FAMILY_TREE_DATA.me.role}</span>
                  </div>

                  {/* Vertical connecting line */}
                  <div className="w-[1.5px] h-16 bg-stone-300 dark:bg-stone-700 my-4"></div>

                  {/* Children Nodes */}
                  <div className="flex flex-wrap justify-center gap-8 md:gap-12 mt-2">
                    {FAMILY_TREE_DATA.members.map((member, index) => (
                      <div key={index} className="flex flex-col items-center z-10">
                        <img src={member.avatar} alt={member.name} className="w-14 h-14 rounded-full object-cover shadow-sm mb-2" />
                        <span className="font-bold text-[14px] text-stone-900 dark:text-white">{member.name}</span>
                        <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">{member.role}</span>
                      </div>
                    ))}
                  </div>
                  
                </div>

              </div>
            </div>
          )}

          {/* Shared Memories Tab */}
          {activeTab === "Shared Memories" && (
            <motion.div variants={fadeIn} className="figma-card py-20 flex flex-col items-center justify-center border border-dashed border-[#C7D2FE] bg-white/40">
              <h2 className="text-xl font-bold text-stone-800 dark:text-white mb-2">{activeTab}</h2>
              <p className="text-stone-500 dark:text-stone-400">This section is active and ready for shared memories across your circle.</p>
            </motion.div>
          )}

        </div>
      </motion.div>

      {/* Invite Member Modal Component */}
      <InviteMemberModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSuccess={handleInviteSuccess}
      />

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

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-500 text-white p-4 text-xs font-bold shadow-xl animate-fade-in">
          <Check size={16} strokeWidth={3} />
          <span>{toastMessage}</span>
        </div>
      )}
    </WavesBackground>
  );
}
