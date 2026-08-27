"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import DashboardHeader from "@/components/layout/DashboardHeader";
import WavesBackground from "@/components/layout/WavesBackground";
import { 
  Sparkles, 
  Send, 
  BookOpen, 
  User, 
  Calendar, 
  AlertCircle, 
  ArrowLeft, 
  ShieldCheck, 
  Plus, 
  MessageSquare, 
  Trash2, 
  Menu, 
  X, 
  Copy, 
  Check,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Sidebar
} from "lucide-react";
import { useAuth } from "@/context/AuthProvider";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function AiFamilyHistorianPage() {
  const { getToken } = useAuth();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  // Chat Sessions & History (ChatGPT / Gemini style)
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const chatBottomRef = useRef(null);

  // Load chat sessions from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("spokenOdysseyHistorianSessions");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
          return;
        }
      }
    } catch (_) {}

    // Create default initial session if none exists
    createNewSession();
  }, []);

  // Save sessions to localStorage whenever they update
  useEffect(() => {
    if (sessions.length > 0) {
      try {
        localStorage.setItem("spokenOdysseyHistorianSessions", JSON.stringify(sessions));
      } catch (_) {}
    }
  }, [sessions]);

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessions, activeSessionId, loading]);

  // Active Session Helper
  const activeSession = sessions.find(s => s.id === activeSessionId) || { id: "default", title: "New Conversation", messages: [] };
  const conversation = activeSession.messages || [];

  // Create New Chat Session
  const createNewSession = () => {
    const newId = `session_${Date.now()}`;
    const newSession = {
      id: newId,
      title: "New Conversation",
      createdAt: new Date().toISOString(),
      messages: []
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
    setSidebarOpen(false);
    setError(null);
  };

  // Delete Chat Session
  const deleteSession = (e, sessionId) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== sessionId);
    setSessions(updated);
    if (activeSessionId === sessionId) {
      if (updated.length > 0) {
        setActiveSessionId(updated[0].id);
      } else {
        createNewSession();
      }
    }
  };

  // Handle Send Message
  const handleSend = async (e) => {
    e?.preventDefault();
    if (!query.trim() || loading) return;

    const userMessage = query.trim();
    setQuery("");
    setError(null);

    // Dynamic Title for first user query in a new session
    const isFirstMessage = conversation.length === 0;
    const sessionTitle = isFirstMessage ? (userMessage.length > 28 ? userMessage.substring(0, 28) + "..." : userMessage) : activeSession.title;

    const updatedMessages = [
      ...conversation,
      { role: "user", text: userMessage, timestamp: new Date().toISOString() }
    ];

    // Update active session messages immediately (Optimistic update)
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          title: sessionTitle,
          messages: updatedMessages
        };
      }
      return s;
    }));

    setLoading(true);

    try {
      let token = null;
      if (getToken) {
        try { token = await getToken(); } catch (_) {}
      }
      if (!token && typeof window !== "undefined") {
        token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
      }

      const res = await fetch(`${API_BASE_URL}/api/ai/family-historian/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMessage, history: conversation })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to retrieve response from AI Family Historian.");
      }

      const assistantMsg = {
        role: "assistant",
        text: data.answer,
        sourcesCount: data.sourcesCount || 0,
        sources: data.sources || [],
        timestamp: new Date().toISOString()
      };

      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...updatedMessages, assistantMsg]
          };
        }
        return s;
      }));
    } catch (err) {
      console.error("AI Family Historian Error:", err);
      setError(err.message || "Could not connect to AI Family Historian backend server. Please verify backend is running on port 5001.");
    } finally {
      setLoading(false);
    }
  };

  // Copy Message Text
  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#F5F6FF] dark:bg-slate-950 flex flex-col font-sans">
      <div className="shrink-0">
        <DashboardHeader />
      </div>

      <WavesBackground>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 pt-3 pb-3 flex-1 flex flex-col w-full h-full min-h-0 overflow-hidden">
          
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between mb-3 shrink-0">
            <div className="flex items-center gap-3">
              {/* Mobile Sidebar Toggle Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-xl bg-white dark:bg-slate-900 border border-[#C7D2FE]/70 text-[#4A3AFF] shadow-xs cursor-pointer"
                aria-label="Toggle Sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>

              <Link
                href="/family"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#4A3AFF] dark:text-indigo-400 hover:underline"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Family Circle
              </Link>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] dark:bg-indigo-950/60 border border-[#C7D2FE]/70 text-[#4A3AFF] dark:text-indigo-300 text-xs font-extrabold shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#4A3AFF]" />
              <span className="hidden sm:inline">Spoken Odyssey</span> Grounded AI RAG
            </div>
          </div>

          {/* Main ChatGPT / Gemini Inspired Workspace Container */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 relative items-stretch h-full min-h-0 overflow-hidden">
            
            {/* =========================================================
                LEFT SIDEBAR: CHAT HISTORY & SUGGESTIONS (CHATGPT/GEMINI STYLE)
                ========================================================= */}
            <div className={`
              fixed lg:relative inset-y-0 left-0 z-40 lg:z-auto w-72 lg:w-auto 
              ${isDesktopSidebarOpen ? "lg:col-span-3 lg:flex" : "lg:hidden"}
              bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-[24px] border border-[#C7D2FE]/70 dark:border-slate-800 
              shadow-xl lg:shadow-sm p-4 flex flex-col justify-between transition-all duration-300 ease-in-out
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}>
              
              <div className="flex flex-col h-full overflow-hidden space-y-4">
                
                {/* Brand Logo & New Chat Button */}
                <div className="space-y-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4A3AFF] to-[#6366F1] flex items-center justify-center p-1.5 shadow-md shadow-[#4A3AFF]/20">
                        <img src="/odyssey.png" alt="Spoken Odyssey Logo" className="w-full h-full object-contain brightness-0 invert" />
                      </div>
                      <div>
                        <h2 className="text-sm font-extrabold text-stone-900 dark:text-white leading-tight">AI Historian</h2>
                        <p className="text-[10px] font-bold text-stone-400">Spoken Odyssey Engine</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Desktop Collapse Button */}
                      <button
                        onClick={() => setIsDesktopSidebarOpen(false)}
                        className="hidden lg:flex p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Hide Sidebar"
                      >
                        <PanelLeftClose className="w-4 h-4" />
                      </button>

                      {/* Mobile Close Button */}
                      <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* + New Chat Button (ChatGPT Style) */}
                  <button
                    onClick={createNewSession}
                    className="w-full py-2.5 px-4 bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Conversation</span>
                  </button>
                </div>

                {/* Recent Chat History List (ChatGPT / Gemini Style) */}
                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                  <div className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400 px-2 mb-1.5">
                    Recent Conversations
                  </div>

                  {sessions.map((s) => {
                    const isActive = s.id === activeSessionId;
                    return (
                      <div
                        key={s.id}
                        onClick={() => {
                          setActiveSessionId(s.id);
                          setSidebarOpen(false);
                        }}
                        className={`
                          group flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all
                          ${isActive
                            ? "bg-[#EEF2FF] text-[#4A3AFF] dark:bg-indigo-950/60 dark:text-indigo-300 font-extrabold border border-[#C7D2FE]/70"
                            : "text-stone-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                          }
                        `}
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-[#4A3AFF]" : "text-stone-400"}`} />
                          <span className="truncate">{s.title || "New Conversation"}</span>
                        </div>

                        <button
                          onClick={(e) => deleteSession(e, s.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-rose-600 transition-opacity"
                          title="Delete Chat"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Suggested Questions Quick Launcher */}
                <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400 px-1">
                    Suggested Prompts
                  </div>
                  {[
                    "What advice did Grandpa share?",
                    "Tell me about our family trips.",
                    "What recipes were passed down?"
                  ].map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(prompt);
                        setSidebarOpen(false);
                      }}
                      className="w-full text-left text-[11px] bg-slate-50 dark:bg-slate-800/60 hover:bg-[#EEF2FF] hover:text-[#4A3AFF] text-stone-600 dark:text-slate-300 p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60 transition-all font-medium truncate cursor-pointer"
                    >
                      "{prompt}"
                    </button>
                  ))}
                </div>

              </div>

              {/* Privacy Footer Badge */}
              <div className="mt-3 p-2.5 rounded-xl bg-[#EEF2FF]/60 dark:bg-indigo-950/40 border border-[#C7D2FE]/60 dark:border-indigo-900/40 text-[10px] text-[#4A3AFF] dark:text-indigo-300 font-semibold leading-tight">
                🔒 Strictly authorized family memories
              </div>
            </div>

            {/* Backdrop Overlay for Mobile Sidebar */}
            {sidebarOpen && (
              <div
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-xs"
              />
            )}

            {/* =========================================================
                RIGHT MAIN WORKSPACE: CONVERSATION STREAM & INPUT (CHATGPT STYLE)
                ========================================================= */}
            <div className={`
              ${isDesktopSidebarOpen ? "lg:col-span-9" : "lg:col-span-12"}
              bg-white/95 dark:bg-slate-900/95 rounded-[24px] border border-[#C7D2FE]/70 dark:border-slate-800 
              shadow-sm flex flex-col overflow-hidden h-full min-h-0 transition-all duration-300
            `}>
              
              {/* Workspace Header */}
              <div className="px-6 py-3.5 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  {/* Desktop Sidebar Toggle / Expand Button */}
                  <button
                    onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
                    className="hidden lg:flex p-2 rounded-xl bg-white dark:bg-slate-800 border border-[#C7D2FE]/60 text-stone-600 dark:text-stone-300 hover:text-[#4A3AFF] transition-colors cursor-pointer shadow-2xs"
                    title={isDesktopSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
                  >
                    {isDesktopSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4 text-[#4A3AFF]" />}
                  </button>

                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4A3AFF] to-[#6366F1] flex items-center justify-center p-1.5 shadow-md shadow-[#4A3AFF]/20">
                    <img src="/odyssey.png" alt="Spoken Odyssey Logo" className="w-full h-full object-contain brightness-0 invert" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
                      {activeSession.title}
                    </h3>
                    <p className="text-[10px] font-bold text-stone-400">
                      Grounded in {conversation.length} message turn{conversation.length === 1 ? '' : 's'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={createNewSession}
                    className="text-xs font-bold text-[#4A3AFF] bg-[#EEF2FF] hover:bg-[#4A3AFF] hover:text-white px-3 py-1.5 rounded-lg border border-[#C7D2FE]/60 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">New Chat</span>
                  </button>
                </div>
              </div>

              {/* Chat Stream Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {conversation.length === 0 ? (
                  <div className="text-center py-16 sm:py-24 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#4A3AFF] to-[#6366F1] flex items-center justify-center p-3 mx-auto shadow-xl shadow-[#4A3AFF]/20">
                      <img src="/odyssey.png" alt="Spoken Odyssey Logo" className="w-full h-full object-contain brightness-0 invert" />
                    </div>
                    <h3 className="text-xl font-extrabold text-stone-900 dark:text-white">
                      Ask your AI Family Historian
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto font-medium leading-relaxed">
                      Discover life advice, stories, voice notes, and heritage preserved across your family space.
                    </p>
                  </div>
                ) : (
                  conversation.map((msg, index) => (
                    <div key={index} className={`flex gap-3 sm:gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      
                      {/* Assistant Brand Avatar (Spoken Odyssey Logo) */}
                      {msg.role === "assistant" && (
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4A3AFF] to-[#6366F1] flex items-center justify-center p-1.5 shrink-0 shadow-md shadow-[#4A3AFF]/20 mt-1">
                          <img src="/odyssey.png" alt="SO Logo" className="w-full h-full object-contain brightness-0 invert" />
                        </div>
                      )}

                      {/* Message Bubble Container */}
                      <div className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-4 text-sm relative group ${
                        msg.role === "user"
                          ? "bg-[#4A3AFF] text-white rounded-br-none shadow-md shadow-[#4A3AFF]/10"
                          : "bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-stone-800 dark:text-slate-100 rounded-bl-none shadow-xs"
                      }`}>
                        
                        {/* Header Role Title */}
                        <div className="flex items-center justify-between gap-2 mb-1.5 text-[11px] font-bold opacity-80">
                          <span>{msg.role === "user" ? "You" : "Spoken Odyssey AI Historian"}</span>
                          {msg.role === "assistant" && (
                            <button
                              onClick={() => handleCopy(msg.text, index)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-stone-400 hover:text-[#4A3AFF] dark:hover:text-indigo-300"
                              title="Copy Answer"
                            >
                              {copiedIndex === index ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </div>

                        {/* Main Text Content */}
                        <div className="whitespace-pre-wrap leading-relaxed font-medium text-xs sm:text-sm">
                          {msg.text}
                        </div>

                        {/* Grounded Source Memory Cards (ChatGPT Citations) */}
                        {msg.role === "assistant" && msg.sources && msg.sources.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#4A3AFF] dark:text-indigo-400 mb-2">
                              <BookOpen className="w-3.5 h-3.5" />
                              Based on {msg.sourcesCount} family {msg.sourcesCount === 1 ? 'memory' : 'memories'}:
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {msg.sources.map((src) => (
                                <button
                                  key={src.memoryId}
                                  onClick={() => window.dispatchEvent(new CustomEvent("openMemoryView", { detail: { id: src.memoryId, memoryId: src.memoryId, title: src.title, ...src } }))}
                                  className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-[#4A3AFF] text-left group/card transition-all cursor-pointer shadow-2xs"
                                >
                                  <div className="space-y-0.5 pr-2 truncate">
                                    <div className="text-xs font-bold text-stone-900 dark:text-white group-hover/card:text-[#4A3AFF] transition-colors truncate">
                                      {src.title}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-stone-500 truncate">
                                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{src.authorName}</span>
                                      {src.occurredAt && (
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(src.occurredAt).toLocaleDateString()}</span>
                                      )}
                                    </div>
                                  </div>
                                  <span className="text-[10px] font-bold text-[#4A3AFF] bg-[#EEF2FF] dark:bg-indigo-950 px-2 py-1 rounded-md shrink-0">
                                    View →
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}

                {loading && (
                  <div className="flex items-center gap-3 text-[#4A3AFF] dark:text-indigo-400 text-xs font-bold bg-[#EEF2FF]/80 dark:bg-indigo-950/40 p-4 rounded-2xl border border-[#C7D2FE]/80 dark:border-indigo-900/40 animate-pulse">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#4A3AFF] to-[#6366F1] p-1 flex items-center justify-center shadow-xs">
                      <img src="/odyssey.png" alt="SO" className="w-full h-full object-contain brightness-0 invert animate-spin" />
                    </div>
                    <span>Retrieving authorized family memories & synthesizing response...</span>
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2 text-rose-600 text-xs bg-rose-50 p-4 rounded-2xl border border-rose-200 font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>

              {/* Fixed Bottom Input Area (ChatGPT Style Floating Bar) */}
              <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 space-y-2 shrink-0">
                <form onSubmit={handleSend} className="flex gap-2.5 items-center">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask your AI Family Historian..."
                    disabled={loading}
                    className="flex-1 px-4 py-3 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A3AFF] dark:text-white placeholder:text-stone-400 font-medium shadow-2xs"
                  />
                  <button
                    type="submit"
                    disabled={!query.trim() || loading}
                    className="px-5 py-3 bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white rounded-xl font-bold text-sm hover:opacity-95 disabled:opacity-50 flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Ask</span>
                  </button>
                </form>

                <p className="text-[10px] text-center text-stone-400 font-medium">
                  AI Family Historian synthesizes responses strictly from authorized family memories.
                </p>
              </div>

            </div>

          </div>

        </div>
      </WavesBackground>
    </div>
  );
}
