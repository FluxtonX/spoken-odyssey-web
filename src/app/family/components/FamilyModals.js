"use client";

import { X, KeyRound } from "lucide-react";
import { useState } from "react";

// Modal wrapper
function ModalWrapper({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animation-fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-stone-100">
          <h2 className="text-xl font-black text-[var(--ink)]">{title}</h2>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-800 transition-colors rounded-full hover:bg-stone-100">
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto p-5 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}

// 1. Add Family Member Modal
export function AddMemberModal({ isOpen, onClose, onSave }) {
  const [access, setAccess] = useState("family");

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Add Family Member">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-[var(--ink)] mb-1">Full Name <span className="text-red-500">*</span></label>
          <input type="text" placeholder="e.g., Emma Mitchell" className="w-full h-11 px-4 border border-[var(--border)] rounded-xl outline-none focus:border-[var(--brand)] transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-bold text-[var(--ink)] mb-1">Email Address <span className="text-red-500">*</span></label>
          <input type="email" placeholder="their@email.com" className="w-full h-11 px-4 border border-[var(--border)] rounded-xl outline-none focus:border-[var(--brand)] transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-bold text-[var(--ink)] mb-1">Relationship <span className="text-red-500">*</span></label>
          <select className="w-full h-11 px-4 border border-[var(--border)] rounded-xl outline-none focus:border-[var(--brand)] transition-colors appearance-none bg-white">
            <option>Select Relationship...</option>
            <option>Parent</option>
            <option>Sibling</option>
            <option>Child</option>
            <option>Grandparent</option>
          </select>
        </div>

        <div className="pt-2">
          <label className="block text-sm font-bold text-[var(--ink)] mb-2">Access Level</label>
          <div className="space-y-2">
            <AccessOption
              id="legacy"
              title="Full Legacy Access"
              desc="Can view all memories including private ones after your passing"
              selected={access === "legacy"}
              onClick={() => setAccess("legacy")}
              iconColor="text-emerald-500"
              bg="bg-emerald-50"
            />
            <AccessOption
              id="family"
              title="Family Memories Only"
              desc="Can view family-tagged memories and public posts only"
              selected={access === "family"}
              onClick={() => setAccess("family")}
              iconColor="text-blue-500"
              bg="bg-blue-50"
            />
            <AccessOption
              id="public"
              title="Public Only"
              desc="Can only view memories you've made publicly visible"
              selected={access === "public"}
              onClick={() => setAccess("public")}
              iconColor="text-amber-500"
              bg="bg-amber-50"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button onClick={onClose} className="flex-1 h-11 rounded-xl border border-[var(--border)] font-bold text-stone-600 hover:bg-stone-50 transition-colors">Cancel</button>
          <button onClick={() => { onSave("Invitation sent successfully"); onClose(); }} className="flex-1 h-11 rounded-xl bg-stone-100 font-bold text-stone-600 hover:bg-stone-200 transition-colors">Send Invitation</button>
        </div>
      </div>
    </ModalWrapper>
  );
}

// 2. Configure Legacy Settings
export function ConfigureLegacyModal({ isOpen, onClose, onSave }) {
  const [preserve, setPreserve] = useState("all");

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Configure Legacy Settings">
      <div className="space-y-5">
        <div className="bg-[#1c1c1c] rounded-2xl p-5 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <KeyRound size={18} className="text-stone-400" />
            <h3 className="font-serif text-lg">Your Digital Legacy</h3>
          </div>
          <p className="text-sm text-stone-300 leading-relaxed">
            Define exactly how your archive will be managed, who will have access, and what message you leave behind.
          </p>
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--ink)] mb-1">Trusted Custodian</label>
          <select className="w-full h-11 px-4 border border-[var(--border)] rounded-xl outline-none focus:border-[var(--brand)] transition-colors appearance-none bg-white">
            <option>Robert Mitchell</option>
            <option>Emily Mitchell</option>
          </select>
          <p className="text-xs text-stone-500 mt-1">This person will manage access requests and your archive.</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--ink)] mb-1">Legacy Message (Optional)</label>
          <textarea rows={4} placeholder="Write a personal message to be revealed to your family after your passing..." className="w-full p-4 border border-[var(--border)] rounded-xl outline-none focus:border-[var(--brand)] transition-colors resize-none"></textarea>
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--ink)] mb-2">What to preserve</label>
          <div className="space-y-2">
            <RadioOption id="all" title="All memories (public, family & private)" selected={preserve === "all"} onClick={() => setPreserve("all")} />
            <RadioOption id="family" title="Family and public memories only" selected={preserve === "family"} onClick={() => setPreserve("family")} />
            <RadioOption id="public" title="Public memories only" selected={preserve === "public"} onClick={() => setPreserve("public")} />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 h-11 rounded-xl border border-[var(--border)] font-bold text-stone-600 hover:bg-stone-50 transition-colors">Cancel</button>
          <button onClick={() => { onSave("Legacy configuration saved"); onClose(); }} className="flex-1 h-11 rounded-xl bg-[var(--brand)] font-bold text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-95">Save Settings</button>
        </div>
      </div>
    </ModalWrapper>
  );
}

// 3. Legacy Access Settings Modal
export function LegacyAccessModal({ isOpen, onClose, onSave }) {
  const [activation, setActivation] = useState("death");
  const [notify, setNotify] = useState(true);

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Legacy Access Settings">
      <div className="space-y-5">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
          <span className="text-amber-600 font-bold mt-0.5">!</span>
          <p className="text-sm font-medium text-amber-800 leading-relaxed">
            These settings determine who can access your memories after your passing. Review carefully and update regularly.
          </p>
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--ink)] mb-1">Trusted Custodian <span className="text-red-500">*</span></label>
          <select className="w-full h-11 px-4 border border-[var(--border)] rounded-xl outline-none focus:border-[var(--brand)] transition-colors appearance-none bg-white">
            <option>Robert Mitchell</option>
            <option>Emily Mitchell</option>
          </select>
          <p className="text-xs text-stone-500 mt-1">This person will manage access requests and your archive.</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--ink)] mb-2">Activation Condition</label>
          <div className="space-y-2">
            <RadioOption id="death" title="After Death Verified" desc="Access unlocked after official verification of passing" selected={activation === "death"} onClick={() => setActivation("death")} />
            <RadioOption id="inactivity" title="Extended Inactivity" desc="After 365 days of inactivity on the platform" selected={activation === "inactivity"} onClick={() => setActivation("inactivity")} />
            <RadioOption id="manual" title="Manual Unlock by Trustee" desc="The trustee can unlock access at any time" selected={activation === "manual"} onClick={() => setActivation("manual")} />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-stone-100 rounded-xl">
          <div>
            <h4 className="font-bold text-sm text-[var(--ink)]">Inactivity Notifications</h4>
            <p className="text-xs text-stone-500">Notify me if I haven't logged in for 30 days</p>
          </div>
          <button onClick={() => setNotify(!notify)} className={`w-12 h-6 rounded-full transition-colors relative ${notify ? 'bg-[var(--brand)]' : 'bg-stone-300'}`}>
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notify ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 h-11 rounded-xl border border-[var(--border)] font-bold text-stone-600 hover:bg-stone-50 transition-colors">Cancel</button>
          <button onClick={() => { onSave("Access settings updated"); onClose(); }} className="flex-1 h-11 rounded-xl bg-[var(--brand)] font-bold text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-95">Save Settings</button>
        </div>
      </div>
    </ModalWrapper>
  );
}

// 4. Manage Access Modal
export function ManageMemberModal({ isOpen, onClose, member, onSave }) {
  const [access, setAccess] = useState(member?.accessLevel === "Public Only" ? "public" : member?.accessLevel === "Family Circle" ? "family" : "legacy");

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={`Manage Access — ${member?.name.split(" ")[0]}`}>
      <div className="space-y-5">
        <div className="bg-stone-100 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[var(--brand)] text-white font-bold flex items-center justify-center text-lg">{member?.initials}</div>
          <div>
            <h3 className="font-black text-[var(--ink)]">{member?.name}</h3>
            <p className="text-xs text-stone-500">{member?.relationship} · {member?.email}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--ink)] mb-2">Access Level</label>
          <div className="space-y-2">
            <AccessOption
              id="legacy"
              title="Full Legacy Access"
              desc="Can view all memories including private ones after your passing"
              selected={access === "legacy"}
              onClick={() => setAccess("legacy")}
              iconColor="text-emerald-500"
              bg="bg-emerald-50"
            />
            <AccessOption
              id="family"
              title="Family Memories Only"
              desc="Can view family-tagged memories and public posts only"
              selected={access === "family"}
              onClick={() => setAccess("family")}
              iconColor="text-blue-500"
              bg="bg-blue-50"
            />
            <AccessOption
              id="public"
              title="Public Only"
              desc="Can only view memories you've made publicly visible"
              selected={access === "public"}
              onClick={() => setAccess("public")}
              iconColor="text-amber-500"
              bg="bg-amber-50"
            />
          </div>
        </div>

        <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
          <h4 className="font-bold text-red-700 text-sm mb-1">Remove from Family Circle</h4>
          <p className="text-xs text-red-600 mb-3">This will revoke all access and remove them from your circle.</p>
          <button className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg text-sm hover:bg-red-700 transition-colors">Remove Member</button>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 h-11 rounded-xl border border-[var(--border)] font-bold text-stone-600 hover:bg-stone-50 transition-colors">Cancel</button>
          <button onClick={() => { onSave("Member access updated"); onClose(); }} className="flex-1 h-11 rounded-xl bg-[var(--brand)] font-bold text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-95">Save Settings</button>
        </div>
      </div>
    </ModalWrapper>
  );
}

// 5. Shared Memories Modal
export function SharedMemoriesModal({ isOpen, onClose, member, memories }) {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={`Shared with ${member?.name}`}>
      <div className="space-y-4">
        <p className="text-sm font-medium text-stone-500">{memories?.length || 0} memories shared with {member?.name}</p>
        <div className="space-y-3">
          {memories?.map(memory => (
            <div key={memory.id} className="bg-stone-100 rounded-xl p-4 hover:bg-stone-200 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-serif font-bold text-[var(--ink)]">{memory.title}</h4>
                <ChevronRightIcon className="text-stone-400 group-hover:text-stone-600 transition-colors" />
              </div>
              <p className="text-[10px] uppercase font-bold text-stone-400 mb-2">by {memory.authorName} &nbsp;·&nbsp; {memory.dateLabel}</p>
              <p className="text-sm text-stone-600 leading-relaxed">{memory.snippet}</p>
            </div>
          ))}
        </div>
      </div>
    </ModalWrapper>
  );
}

// Helper components for Modals
function ChevronRightIcon({ className }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>;
}

function AccessOption({ id, title, desc, selected, onClick, iconColor, bg }) {
  return (
    <div onClick={onClick} className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${selected ? "border-[var(--brand)] bg-indigo-50/50 ring-1 ring-[var(--brand)]" : "border-[var(--border)] bg-white hover:border-stone-300"}`}>
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${bg} ${iconColor}`}>
        {id === "legacy" ? <KeyRound size={16} /> : id === "family" ? <UsersIcon /> : <GlobeIcon />}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-[var(--ink)] text-sm">{title}</h4>
        <p className="text-xs text-stone-500 leading-relaxed mt-0.5">{desc}</p>
      </div>
      {selected && <div className="shrink-0 text-[var(--brand)]"><CheckIcon /></div>}
    </div>
  );
}

function RadioOption({ id, title, desc, selected, onClick }) {
  return (
    <div onClick={onClick} className={`p-4 rounded-xl border transition-all cursor-pointer ${selected ? "border-[var(--brand)] bg-indigo-50/50 ring-1 ring-[var(--brand)]" : "border-[var(--border)] bg-white hover:border-stone-300"}`}>
      <div className="flex items-center gap-3">
        {id === "all" ? <FileIcon /> : id === "family" ? <UsersIcon /> : <GlobeIcon />}
        <h4 className="font-bold text-[var(--ink)] text-sm">{title}</h4>
        {selected && <div className="ml-auto text-[var(--brand)]"><CheckIcon /></div>}
      </div>
      {desc && <p className="text-xs text-stone-500 leading-relaxed mt-2">{desc}</p>}
    </div>
  );
}

function UsersIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function GlobeIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>; }
function CheckIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>; }
function FileIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>; }
