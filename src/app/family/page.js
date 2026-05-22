"use client";

import {
  Bell,
  Check,
  ChevronRight,
  Clock,
  FolderLock,
  KeyRound,
  Mail,
  Search,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const albumChoices = [
  "Letters & Keepsakes",
  "Family Reunion 2023",
  "Kitchen Stories",
  "Childhood Memories",
  "Legacy Archive",
];

const relationshipChoices = ["Parent", "Child", "Sibling", "Grandparent", "Cousin", "Friend"];

const roleOptions = [
  { id: "viewer", label: "Viewer", tone: "border-[var(--border)] bg-[var(--surface-hover)] text-[var(--foreground)]" },
  { id: "contributor", label: "Contributor", tone: "border-[var(--brand)]/30 bg-[var(--brand)]/10 text-[var(--brand)]" },
  { id: "custodian", label: "Legacy Custodian", tone: "border-[var(--brand)] bg-[var(--brand)] text-white" },
];

const accessOptions = [
  { id: "private", label: "Private Only", tone: "border-[var(--border)] bg-[var(--surface-hover)] text-[var(--foreground)]" },
  { id: "selected", label: "Selected Albums", tone: "border-[var(--brand)]/30 bg-[var(--brand)]/10 text-[var(--brand)]" },
  { id: "full", label: "Full Family Circle", tone: "border-[var(--brand)] bg-[var(--brand)] text-white" },
];

const initialMembers = [
  {
    id: "rm",
    name: "Robert Mitchell",
    email: "robert@mitchell.family",
    relationship: "Father",
    role: "custodian",
    access: "full",
    selectedAlbums: [],
    sharedCount: 14,
    joinedLabel: "Joined January 2024",
    initials: "RM",
    status: "active",
  },
  {
    id: "em",
    name: "Emily Mitchell",
    email: "emily@mitchell.family",
    relationship: "Mother",
    role: "contributor",
    access: "full",
    selectedAlbums: [],
    sharedCount: 42,
    joinedLabel: "Joined January 2024",
    initials: "EM",
    status: "active",
  },
  {
    id: "am",
    name: "Alex Mitchell",
    email: "alex@mitchell.family",
    relationship: "Sibling",
    role: "contributor",
    access: "selected",
    selectedAlbums: ["Family Reunion 2023", "Letters & Keepsakes"],
    sharedCount: 28,
    joinedLabel: "Joined March 2024",
    initials: "AM",
    status: "active",
  },
  {
    id: "sm",
    name: "Sophie Mitchell",
    email: "sophie@mitchell.family",
    relationship: "Daughter",
    role: "viewer",
    access: "private",
    selectedAlbums: [],
    sharedCount: 15,
    joinedLabel: "Invited June 2024",
    initials: "SM",
    status: "pending",
  },
];

const sharedMemories = [
  {
    id: "m1",
    title: "Family Reunion 2023",
    authorName: "Emily Mitchell",
    dateLabel: "July 15, 2023",
    snippet: "Three generations under one roof, every table full of old stories and easy laughter.",
    sharedWith: "Full Family Circle",
  },
  {
    id: "m2",
    title: "Teaching Dad to Use His Phone",
    authorName: "Sarah Mitchell",
    dateLabel: "November 3, 2021",
    snippet: "Patience tested, love strengthened, and technology conquered for one afternoon.",
    sharedWith: "Selected Albums",
  },
  {
    id: "m3",
    title: "Mom's Recipe Book",
    authorName: "Robert Mitchell",
    dateLabel: "December 25, 2023",
    snippet: "Her handwritten notes in the margins made every stain feel like a small family archive.",
    sharedWith: "Full Family Circle",
  },
  {
    id: "m4",
    title: "First School Performance",
    authorName: "Sophie Mitchell",
    dateLabel: "March 8, 2024",
    snippet: "A tiny stage, shaky hands, then sudden confidence before the final note ended.",
    sharedWith: "Selected Albums",
  },
];

const emptyInviteForm = {
  name: "",
  email: "",
  relationship: "Sibling",
  role: "viewer",
  access: "full",
  selectedAlbums: [],
};

const optionLabel = (options, id) => options.find((option) => option.id === id)?.label ?? id;
const optionTone = (options, id) => options.find((option) => option.id === id)?.tone ?? "";

function getInitials(name) {
  const initials = name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "FM";
}

export default function FamilyCircle() {
  const [members, setMembers] = useState(initialMembers);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState(emptyInviteForm);
  const [manageMember, setManageMember] = useState(null);
  const [legacyOpen, setLegacyOpen] = useState(false);
  const [memoryMember, setMemoryMember] = useState(null);
  const [notice, setNotice] = useState("");
  const [legacy, setLegacy] = useState({
    trusteeMemberId: "rm",
    activationLabel: "After death verified",
    notificationsEnabled: true,
  });

  const filteredMembers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return members.filter((member) => {
      const matchesFilter =
        filter === "All" ||
        (filter === "Contributors" && member.role === "contributor") ||
        (filter === "Custodians" && member.role === "custodian") ||
        (filter === "Pending" && member.status === "pending");

      const matchesQuery =
        !normalizedQuery ||
        member.name.toLowerCase().includes(normalizedQuery) ||
        member.email.toLowerCase().includes(normalizedQuery) ||
        member.relationship.toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [filter, members, query]);

  const custodianCount = members.filter((member) => member.role === "custodian").length;
  const contributorCount = members.filter((member) => member.role === "contributor").length;
  const trustedCustodian = members.find((member) => member.id === legacy.trusteeMemberId) ?? members[0];
  const connectedCount = members.filter((member) => member.access !== "private").length;

  function updateInviteForm(key, value) {
    setInviteForm((current) => ({ ...current, [key]: value }));
  }

  function toggleInviteAlbum(album) {
    setInviteForm((current) => ({
      ...current,
      selectedAlbums: current.selectedAlbums.includes(album)
        ? current.selectedAlbums.filter((item) => item !== album)
        : [...current.selectedAlbums, album],
    }));
  }

  function sendInvite(event) {
    event.preventDefault();

    const name = inviteForm.name.trim();
    const email = inviteForm.email.trim();

    if (!name || !email.includes("@") || !email.includes(".")) {
      setNotice("Please add a name and valid email.");
      return;
    }

    const newMember = {
      id: String(Date.now()),
      name,
      email,
      relationship: inviteForm.relationship,
      role: inviteForm.role,
      access: inviteForm.access,
      selectedAlbums: inviteForm.access === "selected" ? inviteForm.selectedAlbums : [],
      sharedCount: 0,
      joinedLabel: "Invited today",
      initials: getInitials(name),
      status: "pending",
    };

    setMembers((current) => [newMember, ...current]);
    setInviteForm(emptyInviteForm);
    setInviteOpen(false);
    setNotice(`Invitation prepared for ${name}.`);
  }

  function saveMember(updatedMember) {
    setMembers((current) => current.map((member) => (member.id === updatedMember.id ? updatedMember : member)));
    setManageMember(null);
    setNotice(`${updatedMember.name}'s access was updated.`);
  }

  return (
    <div className="w-full animation-fade-in pb-24">
      <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-black uppercase tracking-wide text-[var(--brand)]">
            <ShieldCheck size={14} />
            Private Family Space
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[var(--ink)] dark:text-white">Family Circles</h1>
          <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-stone-600 dark:text-stone-300">
            Invite family, manage access, and keep legacy settings clear.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Link
            href="/family/tree"
            className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-black shadow-sm transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
          >
            <Users size={17} />
            Tree
          </Link>
          <button
            onClick={() => setInviteOpen(true)}
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-4 text-sm font-black text-white shadow-sm transition active:scale-[0.98]"
          >
            <UserPlus size={17} />
            Invite
          </button>
        </div>
      </header>

      {notice && (
        <div className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-[var(--brand)]/25 bg-[var(--brand)]/10 px-4 py-3 text-sm font-bold text-[var(--brand)]">
          <span>{notice}</span>
          <button onClick={() => setNotice("")} className="rounded-md p-1 hover:bg-[var(--surface)]" aria-label="Dismiss message">
            <X size={16} />
          </button>
        </div>
      )}

      <section className="mb-5 grid gap-3 sm:grid-cols-3">
        <StatTile label="Members" value={members.length} />
        <StatTile label="Contributors" value={contributorCount} />
        <StatTile label="Shared" value={sharedMemories.length} />
      </section>

      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <main className="min-w-0 space-y-5">
          <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-black tracking-tight">Mitchell Family Circle</h2>
                <p className="mt-1 text-sm font-medium text-stone-500">
                  {members.length} members, {custodianCount} custodians, {connectedCount} connected
                </p>
              </div>
              <button
                onClick={() => setLegacyOpen(true)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-4 text-sm font-black hover:border-[var(--brand)] hover:text-[var(--brand)]"
              >
                <KeyRound size={16} />
                Legacy
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <OverviewPill icon={UserCheck} title="Trusted custodian" value={trustedCustodian?.name ?? "Not selected"} />
              <OverviewPill icon={Clock} title="Activation" value={legacy.activationLabel} />
              <OverviewPill icon={FolderLock} title="Shared albums" value={`${connectedCount} members connected`} />
            </div>
          </section>

          <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <h2 className="text-lg font-black">Connected Family</h2>
                <p className="text-xs font-bold text-stone-500">{filteredMembers.length} shown</p>
              </div>

              <div className="flex min-w-0 flex-col gap-3 lg:max-w-[620px] lg:items-end">
                <div className="relative w-full sm:max-w-xs lg:w-64">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search family"
                    className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pl-9 pr-3 text-sm font-bold outline-none focus:border-[var(--brand)]"
                  />
                </div>

                <div className="flex min-w-0 flex-wrap justify-start gap-2 lg:justify-end">
                  {["All", "Contributors", "Custodians", "Pending"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setFilter(item)}
                      className={`shrink-0 rounded-full border px-3 py-2 text-xs font-black leading-none transition ${
                        filter === item
                          ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                          : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--brand)]"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {filteredMembers.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  onMemories={() => setMemoryMember(member)}
                  onManage={() => setManageMember(member)}
                />
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black">Shared Memories</h2>
                <p className="text-xs font-bold text-stone-500">Family-visible stories</p>
              </div>
              <FolderLock size={18} className="text-[var(--brand)]" />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {sharedMemories.map((memory) => (
                <MemoryCard key={memory.id} memory={memory} />
              ))}
            </div>
          </section>
        </main>

        <aside className="space-y-5">
          <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:p-5 xl:sticky xl:top-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand)]/10 text-[var(--brand)]">
                  <ShieldCheck size={20} />
                </div>
                <h2 className="text-lg font-black">Legacy Access</h2>
                <p className="mt-1 text-sm font-medium leading-6 text-stone-500">Custodian and activation settings.</p>
              </div>
              <span className="rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs font-black">
                {legacy.notificationsEnabled ? "Alerts on" : "Alerts off"}
              </span>
            </div>

            <div className="space-y-3">
              <LegacyRow label="Custodian" value={trustedCustodian?.name ?? "Not selected"} />
              <LegacyRow label="Activation" value={legacy.activationLabel} />
              <LegacyRow label="Shared albums" value={`${connectedCount} members`} />
            </div>

            <button
              onClick={() => setLegacyOpen(true)}
              className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-4 text-sm font-black text-white transition active:scale-[0.98]"
            >
              <KeyRound size={16} />
              Manage Legacy
            </button>
          </section>
        </aside>
      </div>

      <button
        onClick={() => setInviteOpen(true)}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand)] text-white shadow-lg shadow-black/20 transition active:scale-95 sm:hidden"
        aria-label="Invite family member"
      >
        <UserPlus size={24} />
      </button>

      {inviteOpen && (
        <InviteModal
          form={inviteForm}
          onChange={updateInviteForm}
          onToggleAlbum={toggleInviteAlbum}
          onSubmit={sendInvite}
          onClose={() => setInviteOpen(false)}
        />
      )}

      {manageMember && (
        <ManageAccessModal
          member={manageMember}
          onClose={() => setManageMember(null)}
          onSave={saveMember}
        />
      )}

      {legacyOpen && (
        <LegacyModal
          members={members}
          legacy={legacy}
          onClose={() => setLegacyOpen(false)}
          onSave={(nextLegacy) => {
            setLegacy(nextLegacy);
            setLegacyOpen(false);
            setNotice("Legacy access settings updated.");
          }}
        />
      )}

      {memoryMember && (
        <MemoriesModal
          member={memoryMember}
          onClose={() => setMemoryMember(null)}
        />
      )}
    </div>
  );
}

function StatTile({ label, value }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
      <p className="text-2xl font-black text-[var(--ink)] dark:text-white">{value}</p>
      <p className="mt-1 text-[11px] font-black uppercase tracking-wide text-stone-500">{label}</p>
    </div>
  );
}

function OverviewPill({ icon: Icon, title, value }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand)]/10 text-[var(--brand)]">
        <Icon size={18} />
      </div>
      <p className="text-xs font-black uppercase tracking-wide text-stone-500">{title}</p>
      <p className="mt-1 text-sm font-black">{value}</p>
    </div>
  );
}

function InviteModal({ form, onChange, onToggleAlbum, onSubmit, onClose }) {
  return (
    <Modal title="Invite Family Member" subtitle="Set relationship, role, and access before sending." onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Full Name">
          <input
            value={form.name}
            onChange={(event) => onChange("name", event.target.value)}
            placeholder="e.g., Emma Mitchell"
            className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm font-bold outline-none focus:border-[var(--brand)]"
          />
        </Field>

        <Field label="Email Address">
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              value={form.email}
              onChange={(event) => onChange("email", event.target.value)}
              placeholder="their@email.com"
              className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pl-9 pr-3 text-sm font-bold outline-none focus:border-[var(--brand)]"
            />
          </div>
        </Field>

        <Field label="Relationship">
          <ChipGroup
            options={relationshipChoices.map((item) => ({ id: item, label: item }))}
            value={form.relationship}
            onChange={(value) => onChange("relationship", value)}
          />
        </Field>

        <Field label="Role">
          <ChipGroup options={roleOptions} value={form.role} onChange={(value) => onChange("role", value)} />
        </Field>

        <Field label="Access">
          <ChipGroup options={accessOptions} value={form.access} onChange={(value) => onChange("access", value)} />
        </Field>

        {form.access === "selected" && (
          <Field label="Choose Albums">
            <MultiChipGroup options={albumChoices} values={form.selectedAlbums} onToggle={onToggleAlbum} />
          </Field>
        )}

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button type="button" onClick={onClose} className="h-11 rounded-lg border border-[var(--border)] text-sm font-black hover:border-[var(--brand)]">
            Cancel
          </button>
          <button className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-4 text-sm font-black text-white">
            <UserPlus size={16} />
            Send
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-wide text-stone-500">{label}</span>
      {children}
    </label>
  );
}

function ChipGroup({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`rounded-full border px-3 py-2 text-xs font-black transition ${
              selected
                ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--brand)]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function MultiChipGroup({ options, values, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = values.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={`rounded-full border px-3 py-2 text-xs font-black transition ${
              selected
                ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--brand)]"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function MemberCard({ member, onMemories, onManage }) {
  return (
    <article className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
      <div className="flex min-w-0 gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--brand)]/10 text-sm font-black text-[var(--brand)]">
          {member.initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-black">{member.name}</h3>
              <p className="truncate text-xs font-bold text-stone-500">{member.email}</p>
            </div>
            {member.status === "pending" && <Badge tone="border-[var(--border)] bg-[var(--surface)] text-stone-500">Pending</Badge>}
          </div>

          <p className="mt-1 text-xs font-bold text-stone-500">
            {member.relationship} · {member.joinedLabel}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone={optionTone(roleOptions, member.role)}>{optionLabel(roleOptions, member.role)}</Badge>
            <Badge tone={optionTone(accessOptions, member.access)}>{optionLabel(accessOptions, member.access)}</Badge>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <MiniStat label={`${member.sharedCount} shared`} icon={Users} />
        <MiniStat label={member.access === "selected" ? `${member.selectedAlbums.length} albums` : optionLabel(accessOptions, member.access)} icon={FolderLock} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button onClick={onMemories} className="h-10 rounded-lg border border-[var(--border)] text-sm font-black hover:border-[var(--brand)] hover:text-[var(--brand)]">
          Shared
        </button>
        <button onClick={onManage} className="h-10 rounded-lg bg-[var(--brand)] text-sm font-black text-white hover:brightness-95">
          Manage
        </button>
      </div>
    </article>
  );
}

function MemoryCard({ memory }) {
  return (
    <article className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-sm font-black">{memory.title}</h3>
        <Badge tone="border-[var(--brand)]/30 bg-[var(--brand)]/10 text-[var(--brand)]">{memory.sharedWith}</Badge>
      </div>
      <p className="text-xs font-bold text-stone-500">
        {memory.authorName} · {memory.dateLabel}
      </p>
      <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-stone-300">{memory.snippet}</p>
    </article>
  );
}

function Badge({ tone, children }) {
  return <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${tone}`}>{children}</span>;
}

function MiniStat({ label, icon: Icon }) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
      <Icon size={14} className="shrink-0 text-[var(--brand)]" />
      <span className="truncate text-xs font-black">{label}</span>
    </div>
  );
}

function LegacyRow({ label, value }) {
  return (
    <div className="rounded-lg bg-[var(--background)] px-3 py-3">
      <span className="text-[11px] font-black uppercase tracking-wide text-stone-500">{label}</span>
      <p className="mt-1 text-sm font-black">{value}</p>
    </div>
  );
}

function ManageAccessModal({ member, onClose, onSave }) {
  const [draft, setDraft] = useState({ ...member });

  function toggleAlbum(album) {
    setDraft((current) => ({
      ...current,
      selectedAlbums: current.selectedAlbums.includes(album)
        ? current.selectedAlbums.filter((item) => item !== album)
        : [...current.selectedAlbums, album],
    }));
  }

  return (
    <Modal title="Manage Access" subtitle={`Update how ${member.name} participates.`} onClose={onClose}>
      <div className="mb-5 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
        <p className="text-sm font-black">{member.name}</p>
        <p className="mt-1 text-xs font-bold text-stone-500">{member.email}</p>
      </div>

      <div className="space-y-5">
        <Field label="Role">
          <ChipGroup options={roleOptions} value={draft.role} onChange={(value) => setDraft((current) => ({ ...current, role: value }))} />
        </Field>

        <Field label="Access">
          <ChipGroup options={accessOptions} value={draft.access} onChange={(value) => setDraft((current) => ({ ...current, access: value }))} />
        </Field>

        {draft.access === "selected" && (
          <Field label="Album Permissions">
            <MultiChipGroup options={albumChoices} values={draft.selectedAlbums} onToggle={toggleAlbum} />
          </Field>
        )}

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button type="button" onClick={onClose} className="h-11 rounded-lg border border-[var(--border)] text-sm font-black hover:border-[var(--brand)]">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave({ ...draft, status: "active", selectedAlbums: draft.access === "selected" ? draft.selectedAlbums : [] })}
            className="h-11 rounded-lg bg-[var(--brand)] text-sm font-black text-white hover:brightness-95"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}

function LegacyModal({ members, legacy, onClose, onSave }) {
  const [draft, setDraft] = useState(legacy);
  const activationOptions = ["After death verified", "Extended inactivity", "Manual unlock by trustee"];

  return (
    <Modal title="Legacy Access" subtitle="Choose custodian and activation condition." onClose={onClose}>
      <div className="space-y-5">
        <Field label="Trusted Custodian">
          <div className="space-y-2">
            {members.map((member) => {
              const selected = draft.trusteeMemberId === member.id;
              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => setDraft((current) => ({ ...current, trusteeMemberId: member.id }))}
                  className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition ${
                    selected
                      ? "border-[var(--brand)] bg-[var(--brand)]/10"
                      : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--brand)]"
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand)]/10 text-xs font-black text-[var(--brand)]">
                    {member.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black">{member.name}</p>
                    <p className="text-xs font-bold text-stone-500">
                      {member.relationship} · {optionLabel(roleOptions, member.role)}
                    </p>
                  </div>
                  {selected && <Check size={18} className="text-[var(--brand)]" />}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Activation Condition">
          <ChipGroup
            options={activationOptions.map((item) => ({ id: item, label: item }))}
            value={draft.activationLabel}
            onChange={(value) => setDraft((current) => ({ ...current, activationLabel: value }))}
          />
        </Field>

        <button
          type="button"
          onClick={() => setDraft((current) => ({ ...current, notificationsEnabled: !current.notificationsEnabled }))}
          className="flex w-full items-center justify-between gap-4 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 text-left"
        >
          <div className="flex items-start gap-3">
            <Bell size={18} className="mt-0.5 shrink-0 text-[var(--brand)]" />
            <div>
              <p className="text-sm font-black">Inactivity notifications</p>
              <p className="mt-1 text-xs font-bold leading-5 text-stone-500">Alert owner after 30 inactive days.</p>
            </div>
          </div>
          <span className={`relative h-6 w-11 shrink-0 rounded-full transition ${draft.notificationsEnabled ? "bg-[var(--brand)]" : "bg-stone-300"}`}>
            <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${draft.notificationsEnabled ? "left-6" : "left-1"}`} />
          </span>
        </button>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button type="button" onClick={onClose} className="h-11 rounded-lg border border-[var(--border)] text-sm font-black hover:border-[var(--brand)]">
            Cancel
          </button>
          <button type="button" onClick={() => onSave(draft)} className="h-11 rounded-lg bg-[var(--brand)] text-sm font-black text-white hover:brightness-95">
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}

function MemoriesModal({ member, onClose }) {
  const memories =
    member.access === "full"
      ? sharedMemories
      : sharedMemories.filter((memory) => memory.authorName === member.name || memory.sharedWith === "Selected Albums");

  return (
    <Modal title={`Shared With ${member.name}`} subtitle="Memories visible to this family member." onClose={onClose}>
      <div className="space-y-3">
        {memories.length === 0 ? (
          <div className="rounded-lg bg-[var(--background)] p-4 text-sm font-bold text-stone-500">No shared memories yet.</div>
        ) : (
          memories.map((memory) => <MemoryCard key={memory.id} memory={memory} />)
        )}
      </div>
    </Modal>
  );
}

function Modal({ title, subtitle, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl sm:max-w-2xl sm:rounded-lg">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight">{title}</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-stone-500">{subtitle}</p>
          </div>
          <button onClick={onClose} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--background)] hover:bg-[var(--surface-hover)]" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
