"use client";

import { UserPlus, ShieldCheck, Mail, ChevronRight } from "lucide-react";

export default function FamilyCircle() {
  const members = [
    { id: 1, name: "Alexander", role: "Custodian (You)", email: "alex@example.com", avatar: "from-brand-400 to-brand-600" },
    { id: 2, name: "Sarah Jenkins", role: "Contributor", email: "sarah@example.com", avatar: "from-purple-400 to-purple-600" },
    { id: 3, name: "David Miller", role: "Viewer", email: "david@example.com", avatar: "from-blue-400 to-blue-600" },
  ];

  const familyMemories = [
    { id: 1, title: "Thanksgiving 2023", date: "Last week", type: "Photo", color: "bg-emerald-500/10" },
    { id: 2, title: "Grandma's Secret Recipe", date: "2 months ago", type: "Voice", color: "bg-blue-500/10" },
  ];

  return (
    <div className="w-full animation-fade-in max-w-4xl mx-auto pb-24">
      {/* Header with Background Pattern */}
      <header className="relative mb-8 pt-8 px-4 sm:px-0 overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-[var(--surface)] to-[var(--surface-hover)] pb-12 border-b border-[var(--border)]">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[var(--brand)] opacity-10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[var(--brand)] to-brand-400 flex items-center justify-center mb-4 shadow-xl shadow-[var(--brand)]/30">
            <span className="text-3xl filter drop-shadow-md">👨‍👩‍👧‍👦</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Family Circle</h1>
          <p className="text-[var(--foreground)] opacity-60 max-w-md">
            A totally private, ad-free space where your family's memories live securely for generations.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-4 sm:px-0">
        
        {/* Left Column (Members & Invites) */}
        <div className="md:col-span-7 space-y-8">
          
          {/* Invite Section */}
          <section className="glass-card p-6 border-2 border-[var(--brand)]/20 relative overflow-hidden group">
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--brand)]/10 to-transparent"></div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <UserPlus size={20} className="text-[var(--brand)]" />
              Invite Family Member
            </h2>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                <input 
                  type="email" 
                  placeholder="Enter their email..." 
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--border)] outline-none focus:border-[var(--brand)] transition-colors text-sm font-medium"
                />
              </div>
              <button className="px-6 py-3 rounded-xl bg-[var(--brand)] text-white font-bold hover:scale-105 active:scale-95 transition-all shadow-md shadow-[var(--brand)]/20">
                Send
              </button>
            </div>
            <p className="text-xs opacity-50 mt-3 flex items-center gap-1 font-medium">
              <ShieldCheck size={14} className="text-emerald-500" /> End-to-end encrypted invitations.
            </p>
          </section>

          {/* Members List */}
          <section>
            <h2 className="text-lg font-bold mb-4">Active Members</h2>
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="p-4 glass rounded-2xl flex items-center justify-between group hover:border-[var(--brand)]/30 transition-colors border border-[var(--border)]/50">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${member.avatar} flex items-center justify-center text-white font-bold shadow-sm`}>
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">{member.name}</h3>
                      <p className="text-xs opacity-60">{member.email}</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-[var(--surface-hover)] border border-[var(--border)] text-xs font-semibold opacity-80">
                    {member.role}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (Family Exclusive Vault) */}
        <div className="md:col-span-5 space-y-6">
          <section className="bg-gradient-to-br from-slate-900 to-black text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            {/* Glossy Overlay */}
            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent"></div>
            
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <span className="text-2xl filter drop-shadow-md">🔐</span>
              Family Vault
            </h2>
            <p className="text-sm opacity-70 mb-6 font-medium">
              Memories locked specifically for the eyes of your Family Circle.
            </p>

            <div className="space-y-3">
              {familyMemories.map((mem) => (
                <div key={mem.id} className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors border border-white/10 flex items-center gap-3 cursor-pointer group">
                  <div className={`w-10 h-10 rounded-xl ${mem.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <span className="text-xl">{mem.type === "Voice" ? "🎙️" : "🖼️"}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm leading-tight group-hover:text-[var(--brand)] transition-colors">{mem.title}</h4>
                    <span className="text-xs opacity-60">{mem.date}</span>
                  </div>
                  <ChevronRight size={16} className="opacity-50" />
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 font-bold transition-colors text-sm">
              View All Family Memories
            </button>
          </section>
        </div>

      </div>
    </div>
  );
}
