"use client";

import {
  Plus,
  UserPlus,
  Shield,
  Search,
  CheckCircle2,
  X,
  Mail,
  FolderLock,
  Clock,
  KeyRound,
  FileText
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { initialMembers, sharedMemories } from "./data";
import {
  AddMemberModal,
  ConfigureLegacyModal,
  LegacyAccessModal,
  ManageMemberModal,
  SharedMemoriesModal
} from "./components/FamilyModals";

export default function FamilyDashboard() {
  const [members, setMembers] = useState(initialMembers);
  const [toastMessage, setToastMessage] = useState("");
  
  // Modal states
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [legacyAccessOpen, setLegacyAccessOpen] = useState(false);
  const [configureLegacyOpen, setConfigureLegacyOpen] = useState(false);
  const [manageMember, setManageMember] = useState(null);
  const [sharedMember, setSharedMember] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 4000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto pb-24 animation-fade-in relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in flex items-center gap-2 bg-green-700 text-white px-4 py-3 rounded-xl shadow-2xl">
          <CheckCircle2 size={18} />
          <span className="font-bold text-sm">{toastMessage}</span>
          <button onClick={() => setToastMessage("")} className="ml-2 hover:bg-green-800 p-1 rounded-full transition-colors">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-black tracking-tight text-[var(--ink)]">Family Circles</h1>
        <p className="mt-1 text-sm font-medium leading-relaxed text-stone-500">
          Share your stories with those who matter most. Create a legacy that spans generations.
        </p>
      </header>

      {/* Top Action Cards */}
      <section className="space-y-4 mb-8">
        {/* Family Tree Card */}
        <div className="bg-white border border-[var(--border)] rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-[var(--ink)]">Mitchell Family Tree</h2>
            <p className="text-xs font-bold text-stone-500 mt-0.5">4 generations · 9 members</p>
          </div>
          <Link href="/family/tree" className="h-9 px-4 rounded-full bg-indigo-50 text-[var(--brand)] font-bold text-sm flex items-center gap-1 hover:bg-indigo-100 transition-colors">
            <Plus size={16} /> Add
          </Link>
        </div>

        {/* Big Add Member Button */}
        <button onClick={() => setAddMemberOpen(true)} className="w-full bg-[var(--brand)] text-white rounded-2xl p-6 shadow-xl shadow-indigo-200/50 hover:shadow-2xl transition-all hover:scale-[1.01] active:scale-95 group relative overflow-hidden text-center">
          <div className="absolute top-4 left-4 opacity-50"><UserPlus size={24} /></div>
          <h2 className="font-serif text-lg font-bold mb-1 group-hover:scale-105 transition-transform">Add Family Member</h2>
          <p className="text-xs font-medium text-white/80">Invite someone to join your family circle</p>
        </button>

        {/* Legacy Access Settings */}
        <button onClick={() => setLegacyAccessOpen(true)} className="w-full bg-white border border-[var(--border)] rounded-2xl p-5 shadow-sm hover:border-[var(--brand)] transition-all active:scale-95 text-center relative">
          <div className="absolute top-4 left-4 text-[var(--brand)]"><Shield size={20} /></div>
          <h2 className="font-serif text-lg font-bold text-[var(--ink)] mb-1">Legacy Access Settings</h2>
          <p className="text-xs font-medium text-stone-500">Control who can access your memories after you're gone</p>
        </button>
      </section>

      {/* Connected Family */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl font-bold text-[var(--ink)]">Connected Family</h2>
          <span className="text-xs font-bold text-stone-500">{members.length} members</span>
        </div>

        <div className="space-y-4">
          {members.map(member => (
            <div key={member.id} className="bg-white border border-[var(--border)] rounded-2xl p-5 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className="w-14 h-14 rounded-full object-cover border border-stone-200" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[var(--brand)] text-white font-bold flex items-center justify-center text-xl">{member.initials}</div>
                )}
                
                <div>
                  <h3 className="font-serif text-lg font-bold text-[var(--ink)]">{member.name}</h3>
                  <p className="text-xs font-bold text-stone-500 mb-2">{member.relationship}</p>
                  <div className="flex items-center gap-3 text-xs font-bold text-stone-400 mb-2">
                    <span className="flex items-center gap-1"><FolderLock size={12}/> {member.sharedCount} shared</span>
                    <span className="flex items-center gap-1"><Clock size={12}/> {member.dateLabel}</span>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide ${member.accessLevel === 'Legacy Access' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {member.accessLevel}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setSharedMember(member)} className="flex-1 h-9 rounded-lg bg-stone-100 text-[11px] font-black uppercase tracking-wide text-stone-600 hover:bg-stone-200 transition-colors">View Shared</button>
                <button onClick={() => setManageMember(member)} className="flex-1 h-9 rounded-lg bg-stone-100 text-[11px] font-black uppercase tracking-wide text-stone-600 hover:bg-stone-200 transition-colors">Manage Access</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Invite Inline Card */}
      <section className="mb-8 bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-[var(--brand)] text-white flex items-center justify-center"><Mail size={14}/></div>
          <h2 className="font-serif text-lg font-bold text-[var(--ink)]">Invite Family Members</h2>
        </div>
        <p className="text-sm text-stone-600 leading-relaxed mb-4 pl-11">
          Share your legacy with family. They'll receive an invitation to join your circle and access memories you choose to share.
        </p>
        <div className="pl-11 flex gap-2">
          <input type="email" placeholder="Enter email address..." className="flex-1 h-11 px-4 border border-[var(--border)] rounded-xl outline-none focus:border-[var(--brand)] text-sm" />
          <button onClick={() => showToast("Invitation sent successfully")} className="h-11 px-6 rounded-xl bg-[var(--brand)] text-white font-bold text-sm hover:bg-[var(--brand-hover)] transition-colors shadow-md">Send Invite</button>
        </div>
      </section>

      {/* Shared Memories Preview */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl font-bold text-[var(--ink)]">Shared Memories</h2>
          <button className="text-xs font-bold text-[var(--brand)] hover:underline">View all</button>
        </div>
        
        <div className="space-y-4">
          {sharedMemories.map(memory => (
            <div key={memory.id} className="bg-white border border-[var(--border)] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-serif text-base font-bold text-[var(--ink)]">{memory.title}</h3>
                <span className="px-2 py-1 bg-indigo-50 text-[var(--brand)] rounded-md text-[10px] font-black flex items-center gap-1"><FolderLock size={10}/> {memory.sharedWith}</span>
              </div>
              <p className="text-[10px] uppercase font-bold text-stone-400 mb-3">by {memory.authorName} &nbsp;·&nbsp; <Clock size={10} className="inline mb-0.5"/> {memory.dateLabel}</p>
              <p className="text-sm text-stone-600 leading-relaxed">{memory.snippet}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Configure Legacy Settings Dark Card */}
      <section>
        <div className="bg-[#1c1c1c] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-6 left-6 text-stone-400"><KeyRound size={20}/></div>
          <h2 className="font-serif text-xl font-bold mb-2 pl-9">Configure Legacy Settings</h2>
          <p className="text-sm text-stone-400 leading-relaxed mb-6 pl-9">
            Designate trusted custodians, set activation conditions, and ensure your voice lives on exactly as you intend. Your digital legacy, your terms.
          </p>

          <div className="space-y-3 mb-6">
            <div className="bg-white/5 rounded-xl p-4 flex gap-4 border border-white/5">
              <div className="text-stone-400 mt-0.5"><UserPlus size={16}/></div>
              <div>
                <p className="text-[11px] uppercase font-bold text-stone-400 tracking-wide">Trusted Custodian</p>
                <p className="text-sm font-bold text-white">Robert Mitchell</p>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4 flex gap-4 border border-white/5">
              <div className="text-stone-400 mt-0.5"><Clock size={16}/></div>
              <div>
                <p className="text-[11px] uppercase font-bold text-stone-400 tracking-wide">Activation</p>
                <p className="text-sm font-bold text-white">After verification</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 flex gap-4 border border-white/5">
              <div className="text-stone-400 mt-0.5"><FileText size={16}/></div>
              <div>
                <p className="text-[11px] uppercase font-bold text-stone-400 tracking-wide">Legacy Message</p>
                <p className="text-sm font-bold text-stone-400">Not yet written</p>
              </div>
            </div>
          </div>

          <button onClick={() => setConfigureLegacyOpen(true)} className="w-full h-11 bg-white text-[var(--ink)] rounded-xl font-bold text-sm shadow-md hover:bg-stone-100 transition-colors">
            Configure Now
          </button>
        </div>
      </section>

      {/* Modals */}
      <AddMemberModal isOpen={addMemberOpen} onClose={() => setAddMemberOpen(false)} onSave={showToast} />
      <LegacyAccessModal isOpen={legacyAccessOpen} onClose={() => setLegacyAccessOpen(false)} onSave={showToast} />
      <ConfigureLegacyModal isOpen={configureLegacyOpen} onClose={() => setConfigureLegacyOpen(false)} onSave={showToast} />
      <ManageMemberModal isOpen={!!manageMember} member={manageMember} onClose={() => setManageMember(null)} onSave={showToast} />
      <SharedMemoriesModal isOpen={!!sharedMember} member={sharedMember} memories={sharedMemories} onClose={() => setSharedMember(null)} />
    </div>
  );
}
