"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Sparkles, UserPlus, Heart, Edit3 } from "lucide-react";
import { getRelationshipGraph } from "@/services/backend";
import SetRelationshipModal from "./SetRelationshipModal";

function TierRow({ title, members, onSelectMember, currentUserId }) {
  if (!members || members.length === 0) return null;

  return (
    <div className="relative w-full flex flex-col items-center my-6">
      {/* Tier Title Label */}
      <div className="mb-4 text-center">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
          <Users size={13} className="text-[#4A3AFF]" />
          {title} ({members.length})
        </span>
      </div>

      {/* Nodes Container */}
      <div className="flex flex-wrap justify-center gap-6 md:gap-10 relative z-10 w-full max-w-4xl px-4">
        {members.map((member) => {
          const isSelf = member.isSelf || member.userId === currentUserId || member.id === currentUserId;
          const name = member.name || member.email?.split("@")[0] || "Family Member";
          const initials = String(name).split(" ").map(n => n ? n[0] : "").join("").toUpperCase().slice(0, 2) || "M";
          const avatar = member.avatar || member.photoURL;
          const label = member.displayLabel || (isSelf ? "You" : "Family Member");
          const isUnassigned = !member.relationshipCode || member.relationshipCode === "MEMBER";

          return (
            <motion.div
              key={member.id || member.userId || member.email}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => !isSelf && onSelectMember(member)}
              className={`relative flex flex-col items-center p-4 transition-all cursor-pointer group min-w-[140px] max-w-[170px] ${
                isSelf
                  ? "bg-gradient-to-br from-[#4A3AFF] to-[#6C5DD3] text-white rounded-3xl shadow-lg shadow-indigo-500/25 scale-105"
                  : "figma-card text-slate-900 dark:text-white"
              }`}
            >
              {/* Avatar / Node Icon */}
              <div className="relative mb-2.5">
                {avatar && typeof avatar === "string" && avatar.startsWith("http") ? (
                  <img
                    src={avatar}
                    alt={name}
                    className={`w-16 h-16 rounded-full object-cover shadow-sm ${
                      isSelf ? "border-2 border-white" : "border-2 border-[#4A3AFF]"
                    }`}
                  />
                ) : (
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${
                      isSelf
                        ? "bg-white/20 text-white border-2 border-white"
                        : "bg-gradient-to-br from-[#4A3AFF] to-[#6C5DD3] text-white border-2 border-white dark:border-slate-800"
                    }`}
                  >
                    {initials}
                  </div>
                )}

                {/* Hover-Only Glassmorphic Edit Badge */}
                {!isSelf && (
                  <div className="absolute inset-0 rounded-full bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200">
                    <div className="w-8 h-8 rounded-full bg-white text-[#4A3AFF] flex items-center justify-center shadow-lg scale-90 group-hover:scale-100 transition-transform">
                      <Edit3 size={14} />
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="text-center w-full truncate">
                <h4 className="font-bold text-[14px] leading-tight truncate">{name}</h4>
                <span
                  className={`inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isSelf
                      ? "bg-white/20 text-white"
                      : isUnassigned
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60"
                      : "bg-indigo-50 text-[#4A3AFF] dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40"
                  }`}
                >
                  {isUnassigned && !isSelf ? "+ Set Relation" : label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function FamilyTreeCanvas({ circleId, userToken, currentUserId, membersList = [] }) {
  const [graphNodes, setGraphNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchGraphData = async () => {
    if (!circleId || !userToken) return;
    setLoading(true);
    try {
      const data = await getRelationshipGraph(userToken, circleId);
      if (data && Array.isArray(data.nodes)) {
        setGraphNodes(data.nodes);
      } else {
        // Fallback to membersList props
        setGraphNodes(membersList);
      }
    } catch (err) {
      console.warn("Could not load relationship graph, using membersList fallback:", err);
      setGraphNodes(membersList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphData();
  }, [circleId, userToken, membersList]);

  // Group nodes by generational tier
  const grandparents = graphNodes.filter(n => n.tier === -2);
  const parents = graphNodes.filter(n => n.tier === -1);
  const myGen = graphNodes.filter(n => n.tier === 0);
  const children = graphNodes.filter(n => n.tier === 1);
  const grandchildren = graphNodes.filter(n => n.tier === 2);
  const otherMembers = graphNodes.filter(n => n.tier === 99 || n.tier === undefined);

  const handleOpenSetModal = (member) => {
    setSelectedMember(member);
    setModalOpen(true);
  };

  return (
    <div className="w-full relative">
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#4A3AFF] border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading Family Tree canvas...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center py-6">
          {/* Tier Rows */}
          <div className="w-full space-y-4">
            <TierRow title="Grandparents" members={grandparents} onSelectMember={handleOpenSetModal} currentUserId={currentUserId} />
            {grandparents.length > 0 && parents.length > 0 && <div className="w-px h-8 bg-slate-300 dark:bg-slate-700 mx-auto" />}

            <TierRow title="Parents & Uncles / Aunts" members={parents} onSelectMember={handleOpenSetModal} currentUserId={currentUserId} />
            {parents.length > 0 && myGen.length > 0 && <div className="w-px h-8 bg-slate-300 dark:bg-slate-700 mx-auto" />}

            <TierRow title="Your Generation (You, Spouse, Siblings & Cousins)" members={myGen} onSelectMember={handleOpenSetModal} currentUserId={currentUserId} />
            {myGen.length > 0 && children.length > 0 && <div className="w-px h-8 bg-slate-300 dark:bg-slate-700 mx-auto" />}

            <TierRow title="Children & Niblings" members={children} onSelectMember={handleOpenSetModal} currentUserId={currentUserId} />
            {children.length > 0 && grandchildren.length > 0 && <div className="w-px h-8 bg-slate-300 dark:bg-slate-700 mx-auto" />}

            <TierRow title="Grandchildren" members={grandchildren} onSelectMember={handleOpenSetModal} currentUserId={currentUserId} />

            {/* Other Connected Members */}
            {otherMembers.length > 0 && (
              <>
                <div className="w-full border-t border-dashed border-slate-200 dark:border-slate-800 my-8" />
                <TierRow title="Other Connected Members" members={otherMembers} onSelectMember={handleOpenSetModal} currentUserId={currentUserId} />
              </>
            )}
          </div>
        </div>
      )}

      {/* Set Relationship Modal */}
      <SetRelationshipModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        targetMember={selectedMember}
        circleId={circleId}
        userToken={userToken}
        onSaved={() => {
          fetchGraphData();
        }}
      />
    </div>
  );
}
