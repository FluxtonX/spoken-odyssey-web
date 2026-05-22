"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Bell, CheckCheck, Clock, HeartHandshake, ShieldCheck, Sparkles, Users } from "lucide-react";
import { notifications } from "@/data/mockApp";

const iconMap = {
  family: Users,
  legacy: ShieldCheck,
  community: HeartHandshake,
  prompt: Sparkles,
};

export default function NotificationsPage() {
  const [items, setItems] = useState(notifications);
  const unread = items.filter((item) => item.unread).length;

  function markAllRead() {
    setItems((current) => current.map((item) => ({ ...item, unread: false })));
  }

  return (
    <div className="mx-auto w-full max-w-3xl pb-24 animation-fade-in">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link
            href="/"
            className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm"
            aria-label="Back home"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-black uppercase tracking-wide text-[var(--brand)]">
              <Bell size={14} />
              Activity Center
            </p>
            <h1 className="text-3xl font-black tracking-tight text-[var(--ink)] dark:text-white">Notifications</h1>
            <p className="mt-2 text-sm font-bold text-stone-500">{unread} unread updates</p>
          </div>
        </div>
        <button
          onClick={markAllRead}
          className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-black shadow-sm transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
        >
          <CheckCheck size={15} />
          Mark read
        </button>
      </header>

      <section className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm">
        {items.map((item) => {
          const Icon = iconMap[item.type] ?? Bell;
          return (
            <button
              key={item.id}
              onClick={() =>
                setItems((current) =>
                  current.map((notification) =>
                    notification.id === item.id ? { ...notification, unread: false } : notification
                  )
                )
              }
              className="flex w-full gap-4 border-b border-[var(--border)] p-4 text-left transition last:border-b-0 hover:bg-[var(--background)] sm:p-5"
            >
              <div className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
                item.unread ? "bg-[var(--brand)] text-white" : "bg-[var(--background)] text-stone-500"
              }`}>
                <Icon size={21} />
                {item.unread && <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[var(--surface)] bg-rose-500" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-sm font-black text-[var(--ink)] dark:text-white">{item.title}</h2>
                  <span className="flex shrink-0 items-center gap-1 text-[10px] font-black uppercase tracking-wide text-stone-400">
                    <Clock size={12} />
                    {item.time}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium leading-6 text-stone-600 dark:text-stone-300">{item.body}</p>
              </div>
            </button>
          );
        })}
      </section>

      <section className="mt-5 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
        <h2 className="text-lg font-black">Memory Prompt</h2>
        <p className="mt-2 text-sm font-medium leading-6 text-stone-600 dark:text-stone-300">
          What is one sound from your childhood home that you still remember clearly?
        </p>
        <Link
          href="/record?mode=Voice"
          className="mt-4 inline-flex h-11 items-center justify-center rounded-lg bg-[var(--brand)] px-4 text-sm font-black text-white"
        >
          Record Response
        </Link>
      </section>
    </div>
  );
}
