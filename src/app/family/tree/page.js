"use client";

import Link from "next/link";
import { ArrowLeft, Crown, Mail, Plus, ShieldCheck, UserRound } from "lucide-react";

const family = [
  { id: "robert", name: "Robert", relation: "Father", role: "Legacy Custodian", level: 1 },
  { id: "emily", name: "Emily", relation: "Mother", role: "Contributor", level: 1 },
  { id: "alex", name: "Alexander", relation: "You", role: "Owner", level: 2 },
  { id: "sophie", name: "Sophie", relation: "Daughter", role: "Viewer", level: 3 },
  { id: "maya", name: "Maya", relation: "Sister", role: "Contributor", level: 2 },
];

export default function FamilyTreePage() {
  return (
    <div className="mx-auto w-full max-w-5xl pb-24 animation-fade-in">
      <header className="mb-6 flex items-start gap-3">
        <Link
          href="/family"
          className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm"
          aria-label="Back to family"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-black uppercase tracking-wide text-[var(--brand)]">
            <ShieldCheck size={14} />
            Family Map
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[var(--ink)] dark:text-white">Mitchell Family Tree</h1>
          <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-stone-500">
            A frontend preview of family relationships, roles, and legacy responsibility.
          </p>
        </div>
      </header>

      <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
        <div className="grid gap-5">
          {[1, 2, 3].map((level) => (
            <div key={level}>
              <p className="mb-3 text-xs font-black uppercase tracking-wide text-stone-500">
                Generation {level}
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {family
                  .filter((member) => member.level === level)
                  .map((member) => (
                    <article key={member.id} className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--brand)]/10 text-[var(--brand)]">
                          {member.role === "Owner" ? <Crown size={20} /> : <UserRound size={20} />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h2 className="text-sm font-black">{member.name}</h2>
                          <p className="mt-1 text-xs font-bold text-stone-500">{member.relation}</p>
                          <span className="mt-3 inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide">
                            {member.role}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-2">
        <button className="flex h-14 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] text-sm font-black text-white">
          <Plus size={18} />
          Add Member
        </button>
        <button className="flex h-14 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm font-black">
          <Mail size={18} />
          Invite by Email
        </button>
      </section>
    </div>
  );
}
