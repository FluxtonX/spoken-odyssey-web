"use client";

import { useState } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import WavesBackground from "@/components/layout/WavesBackground";
import { UserPlus, Heart, Lock, Check, TreePine } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp, fadeIn } from "@/lib/animations";

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
    title: "Legacy administrator",
    description: "Will manage your archive",
    value: "Sarah Murphy"
  },
  {
    id: "ls2",
    title: "Release condition",
    description: "Requires confirmation from admin",
    value: "After verified passing"
  },
  {
    id: "ls3",
    title: "Family Circle access",
    description: "All members can view",
    value: "Full archive"
  },
  {
    id: "ls4",
    title: "Public profile",
    description: "Stories stay discoverable",
    value: "Remain public"
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
  const [permissions, setPermissions] = useState(INITIAL_PERMISSIONS);

  const togglePermission = (id) => {
    setPermissions(permissions.map(p => 
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
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
              <h1 className="text-[32px] md:text-[36px] font-bold text-stone-900 tracking-tight leading-tight">Family Circle</h1>
              <p className="text-stone-500 font-medium text-[15px] mt-1">5 members · Private circle</p>
            </div>
            
            <button className="bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white px-5 py-2.5 rounded-[12px] font-bold transition-all shadow-md flex items-center justify-center gap-2 max-w-max">
              <UserPlus size={18} strokeWidth={2.5} />
              <span className="text-[14px]">Invite member</span>
            </button>
          </motion.div>

          {/* Tabs */}
          <motion.div variants={fadeInUp} className="bg-[#D1D6FF] p-1.5 rounded-[16px] inline-flex mb-8 overflow-x-auto max-w-full">
            {["Members", "Shared Memories", "Family Tree", "Legacy Access"].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-[12px] text-[14px] font-bold transition-all whitespace-nowrap ${
                  activeTab === tab 
                  ? "bg-white text-stone-900 shadow-sm" 
                  : "text-[#3F436E] hover:text-stone-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </motion.div>

          {/* Active Tab Content: Members */}
          {activeTab === "Members" && (
            <motion.div variants={staggerContainer} initial="hidden" animate="show">
              {/* Members Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
                {MOCK_MEMBERS.map((member, index) => {
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
                            <h3 className="font-bold text-[17px] text-stone-900 leading-tight">{member.name}</h3>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[13px] font-medium text-stone-600">{member.role}</span>
                            {member.isAdmin && (
                              <span className="bg-white/80 border border-[#C7D2FE] text-[#4A3AFF] text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-[6px]">Admin</span>
                            )}
                          </div>
                          <p className="text-[12px] font-medium text-stone-500 mt-1">{member.sharedCount} shared memories</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button className="w-9 h-9 rounded-[10px] bg-[#7B61FF] text-white flex items-center justify-center hover:bg-[#6b4fe6] transition-colors shadow-sm">
                          <Heart size={16} strokeWidth={2.5} />
                        </button>
                        <button className="w-9 h-9 rounded-[10px] bg-[#7B61FF] text-white flex items-center justify-center hover:bg-[#6b4fe6] transition-colors shadow-sm">
                          <Lock size={16} strokeWidth={2.5} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Invite Card */}
                <motion.button variants={fadeInUp} className="relative w-full rounded-[20px] p-6 bg-[#4A3AFF] hover:bg-[#3b2dd1] transition-all flex flex-col justify-center text-left shadow-md group">
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
                  <h2 className="font-bold text-[18px] text-stone-900">Circle permissions</h2>
                </div>
                <div className="flex flex-col">
                  {permissions.map((perm, index) => (
                    <div key={perm.id} className={`flex items-center justify-between p-6 ${index !== permissions.length - 1 ? "border-b border-stone-100" : ""}`}>
                      <span className="text-[15px] font-medium text-stone-600">{perm.label}</span>
                      
                      {/* Custom Toggle Switch */}
                      <button 
                        onClick={() => togglePermission(perm.id)}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${perm.enabled ? "bg-[#4A3AFF]" : "bg-stone-200"}`}
                      >
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${perm.enabled ? "translate-x-6 shadow-sm" : "translate-x-1"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Active Tab Content: Legacy Access */}
          {activeTab === "Legacy Access" && (
            <motion.div variants={staggerContainer} initial="hidden" animate="show">
              {/* Context Banner */}
              <motion.div variants={fadeInUp} className="figma-card bg-[#EEF2FF] border border-[#C7D2FE] p-6 mb-8 flex items-start gap-4">
                  <h2 className="font-bold text-[22px] text-stone-900 mb-2">Legacy Release Settings</h2>
                  <p className="text-[15px] font-medium text-stone-500">
                    Configure who receives access to your archive, and when. These settings are private and can be updated at any time.
                  </p>
              </motion.div>

              {/* Legacy Settings Grid */}
              <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {LEGACY_SETTINGS_DATA.map((setting) => (
                  <motion.div variants={fadeInUp} key={setting.id} className="figma-card p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-[15px] text-stone-900 mb-0.5">{setting.title}</h3>
                        <p className="text-[14px] font-medium text-stone-400">{setting.description}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="px-4 py-1.5 bg-[#EEF2FF] text-[#4A3AFF] rounded-full text-[13px] font-medium">
                          {setting.value}
                        </span>
                        <button className="px-4 py-1.5 border border-[#C7D2FE] text-[#4A3AFF] rounded-[8px] text-[13px] font-bold hover:bg-[#EEF2FF] transition-colors">
                          Edit
                        </button>
                      </div>
                  </motion.div>
                ))}
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
                  <h2 className="font-bold text-[24px] text-stone-900 mb-2">Family Tree</h2>
                  <p className="text-[15px] font-medium text-stone-600 max-w-sm mx-auto">
                    Build your family tree and connect memories across generations.
                  </p>
                </div>

                {/* Tree Diagram */}
                <div className="flex flex-col items-center">
                  
                  {/* Root Node (You) */}
                  <div className="flex flex-col items-center z-10">
                    <img src={FAMILY_TREE_DATA.me.avatar} alt="You" className="w-16 h-16 rounded-full object-cover shadow-md mb-2" />
                    <span className="font-bold text-[15px] text-stone-900">{FAMILY_TREE_DATA.me.name}</span>
                    <span className="text-[12px] font-medium text-stone-500">{FAMILY_TREE_DATA.me.role}</span>
                  </div>

                  {/* Vertical connecting line */}
                  <div className="w-[1.5px] h-16 bg-stone-800 my-4"></div>

                  {/* Children Nodes */}
                  <div className="flex flex-wrap justify-center gap-8 md:gap-12 mt-2">
                    {FAMILY_TREE_DATA.members.map((member, index) => (
                      <div key={index} className="flex flex-col items-center z-10">
                        <img src={member.avatar} alt={member.name} className="w-14 h-14 rounded-full object-cover shadow-sm mb-2" />
                        <span className="font-bold text-[14px] text-stone-900">{member.name}</span>
                        <span className="text-[11px] font-medium text-stone-500">{member.role}</span>
                      </div>
                    ))}
                  </div>
                  
                </div>

              </div>
            </div>
          )}

          {/* Other Tabs (Placeholders) */}
          {activeTab === "Shared Memories" && (
            <motion.div variants={fadeIn} className="figma-card py-20 flex flex-col items-center justify-center border border-dashed border-[#C7D2FE] bg-white/40">
              <h2 className="text-xl font-bold text-stone-800 mb-2">{activeTab}</h2>
              <p className="text-stone-500">This section is currently under construction.</p>
            </motion.div>
          )}

        </div>
      </motion.div>
    </WavesBackground>
  );
}
