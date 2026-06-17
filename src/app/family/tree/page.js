"use client";

import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { treeData } from "../data";

function Node({ member }) {
  const getColors = () => {
    if (member.type === "you") return "bg-[var(--brand)] text-white shadow-lg shadow-indigo-200/50 border-none scale-110";
    if (member.type === "sibling" || member.type === "child") return "bg-indigo-50 text-[var(--brand)] border-none";
    if (member.type === "parent") return "bg-stone-100 text-stone-800 border-none";
    return "bg-white border border-[var(--border)] text-stone-600";
  };

  return (
    <div className="flex flex-col items-center group cursor-pointer relative z-10">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center font-serif text-xl font-bold transition-transform group-hover:scale-105 ${getColors()}`}>
        {member.initials}
      </div>
      <div className="mt-3 text-center min-w-[100px]">
        <h3 className="font-serif text-[15px] font-bold text-[var(--ink)] leading-tight">{member.name}</h3>
        <p className="text-[9px] uppercase font-bold text-stone-500 mt-1 tracking-wider">{member.role}</p>
        <p className="text-[10px] text-stone-400 mt-0.5">{member.years}</p>
      </div>
    </div>
  );
}

function GenerationRow({ title, count, members }) {
  return (
    <div className="relative w-full max-w-4xl flex flex-col items-center">
      {/* Label - visible on larger screens on the left */}
      <div className="lg:absolute left-0 top-4 text-center lg:text-left mb-6 lg:mb-0">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-stone-400">{title}</h3>
        <p className="text-[10px] font-bold text-stone-300 mt-0.5">{count} {count === 1 ? 'member' : 'members'}</p>
      </div>
      
      <div className="flex justify-center gap-6 md:gap-16 relative w-full">
        {/* Horizontal connecting line behind nodes */}
        {members.length > 1 && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 h-px bg-stone-200 z-0" style={{ width: `calc(100% - ${100 / members.length}%)` }}></div>
        )}
        
        {members.map(member => (
          <div key={member.id} className="relative">
            {/* Vertical stem from horizontal line up (if needed) or just the node */}
            <Node member={member} />
          </div>
        ))}
      </div>
    </div>
  );
}

function VerticalConnector() {
  return <div className="w-px h-12 bg-stone-200 my-4"></div>;
}

export default function FamilyTreePage() {
  return (
    <div className="mx-auto w-full max-w-5xl pb-24 animation-fade-in relative min-h-screen">
      {/* Header */}
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[var(--ink)] font-serif">Family Circles</h1>
          <p className="mt-1 text-sm font-medium leading-relaxed text-stone-500">
            Share your stories with those who matter most. Create a legacy that spans generations.
          </p>
        </div>
        <Link href="/family" className="h-10 w-10 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 transition-colors text-stone-600">
          <ArrowLeft size={20} />
        </Link>
      </header>

      {/* Main Tree Card */}
      <section className="bg-white border border-[var(--border)] rounded-3xl p-8 shadow-sm relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-stone-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="mb-12 relative z-10 text-center border-b border-stone-100 pb-8">
          <h2 className="font-serif text-2xl font-bold text-[var(--ink)]">Mitchell Family Tree</h2>
          <p className="text-sm font-bold text-stone-500 mt-2">4 generations · 9 members</p>
        </div>

        {/* Tree Layout */}
        <div className="flex flex-col items-center pb-8 relative z-10 overflow-x-auto hide-scrollbar">
          <div className="min-w-[800px] w-full flex flex-col items-center">
            
            <GenerationRow title="Grandparents" count={4} members={treeData.grandparents} />
            <VerticalConnector />
            
            <GenerationRow title="Parents" count={2} members={treeData.parents} />
            <VerticalConnector />
            
            <GenerationRow title="Your Generation" count={2} members={treeData.generation} />
            <VerticalConnector />
            
            <GenerationRow title="Children" count={1} members={treeData.children} />
            
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-stone-100 flex justify-center relative z-10">
          <button className="h-11 px-6 rounded-full border-2 border-[var(--brand)] text-[var(--brand)] font-bold text-sm flex items-center gap-2 hover:bg-indigo-50 transition-colors">
            <Plus size={16} /> Add family member
          </button>
        </div>
      </section>

      {/* Floating Action Button */}
      <button className="fixed bottom-24 right-6 md:right-10 w-16 h-16 bg-[var(--brand)] text-white rounded-full flex items-center justify-center shadow-xl shadow-indigo-200/50 hover:scale-105 active:scale-95 transition-all z-40">
        <Plus size={28} />
      </button>
    </div>
  );
}
