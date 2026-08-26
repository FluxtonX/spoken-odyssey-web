"use client";

import { useState } from "react";
import { X, Check, Users, UserCheck } from "lucide-react";
import { upsertRelationshipEdge } from "@/services/backend";

const RELATIONSHIP_OPTIONS = [
  {
    category: "Immediate Family",
    items: [
      { label: "Father", code: "FATHER" },
      { label: "Mother", code: "MOTHER" },
      { label: "Son", code: "SON" },
      { label: "Daughter", code: "DAUGHTER" },
      { label: "Brother", code: "BROTHER" },
      { label: "Sister", code: "SISTER" },
      { label: "Spouse / Partner", code: "SPOUSE" },
    ]
  },
  {
    category: "Uncles & Aunts (Cultural)",
    items: [
      { label: "Paternal Uncle (Chacha)", code: "PATERNAL_UNCLE" },
      { label: "Maternal Uncle (Mamoo)", code: "MATERNAL_UNCLE" },
      { label: "Paternal Aunt (Phuppho)", code: "PATERNAL_AUNT" },
      { label: "Maternal Aunt (Khala)", code: "MATERNAL_AUNT" },
    ]
  },
  {
    category: "Grandparents",
    items: [
      { label: "Paternal Grandmother (Dadi)", code: "PATERNAL_GRANDMOTHER" },
      { label: "Maternal Grandmother (Nani)", code: "MATERNAL_GRANDMOTHER" },
      { label: "Paternal Grandfather (Dada)", code: "PATERNAL_GRANDFATHER" },
      { label: "Maternal Grandfather (Nana)", code: "MATERNAL_GRANDFATHER" },
    ]
  },
  {
    category: "Extended Relatives",
    items: [
      { label: "Cousin", code: "COUSIN" },
      { label: "Nephew", code: "NEPHEW" },
      { label: "Niece", code: "NIECE" },
    ]
  }
];

export default function SetRelationshipModal({
  isOpen,
  onClose,
  targetMember,
  circleId,
  userToken,
  onSaved
}) {
  const [selectedCode, setSelectedCode] = useState(targetMember?.relationshipCode || "");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen || !targetMember) return null;

  const targetName = targetMember.name || targetMember.email?.split("@")[0] || "Family Member";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCode) {
      setErrorMsg("Please select a relationship type.");
      return;
    }
    setLoading(true);
    setErrorMsg("");

    try {
      const targetId = targetMember.userId || targetMember.id;
      const res = await upsertRelationshipEdge(userToken, circleId, {
        toUserId: targetId,
        relationshipCode: selectedCode
      });

      if (onSaved) onSaved(res);
      onClose();
    } catch (err) {
      console.error("Failed to save relationship edge:", err);
      setErrorMsg(err.message || "Failed to update relationship edge.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-[#C7D2FE]/70 dark:border-slate-800 rounded-[28px] shadow-2xl p-6 md:p-8 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EEF2FF] dark:bg-indigo-950 text-[#4A3AFF] dark:text-indigo-300 flex items-center justify-center font-bold shrink-0">
              <Users size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-white leading-tight">
                What is {targetName} to you?
              </h2>
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mt-0.5">
                Set relationship for your family tree view.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 dark:bg-slate-800 text-stone-500 hover:text-stone-900 dark:hover:text-white flex items-center justify-center transition cursor-pointer shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Content Options */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 hide-scrollbar">
            {RELATIONSHIP_OPTIONS.map((cat) => (
              <div key={cat.category}>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2 px-1">
                  {cat.category}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {cat.items.map((item) => {
                    const isSelected = selectedCode === item.code;
                    return (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => setSelectedCode(item.code)}
                        className={`flex items-center justify-between p-3 rounded-2xl border text-left text-xs font-bold transition cursor-pointer ${
                          isSelected
                            ? "bg-[#EEF2FF] dark:bg-indigo-950/80 border-[#4A3AFF] text-[#4A3AFF] dark:text-indigo-300 shadow-xs"
                            : "bg-stone-50/80 dark:bg-slate-800/60 text-stone-700 dark:text-stone-300 border-stone-200/60 dark:border-slate-700/50 hover:border-[#4A3AFF]/40"
                        }`}
                      >
                        <span>{item.label}</span>
                        {isSelected && <Check size={16} className="text-[#4A3AFF] dark:text-indigo-300 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-stone-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedCode}
              className="px-6 py-2.5 rounded-xl bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white text-xs font-bold shadow-md active:scale-95 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <UserCheck size={16} />
              )}
              Save Relationship
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
