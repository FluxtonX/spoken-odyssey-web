"use client";

import { Heart, MessageCircle, Share2, MoreHorizontal, Play } from "lucide-react";
import Link from "next/link";
import { resolveGlass3DIcon } from "@/components/ui/Glass3DIcons";

export default function Feed() {
  const publicPosts = [
    {
      id: 1,
      user: { name: "Sarah Jenkins", avatar: "from-amber-400 to-amber-600", time: "2 hours ago" },
      content: {
        type: "Photo",
        title: "Family Reunion at the Lake",
        description: "It was so wonderful to see everyone after 5 years. The kids have grown up so fast!",
        mediaUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80",
      },
      stats: { likes: 42, comments: 8 },
    },
    {
      id: 2,
      user: { name: "David Miller", avatar: "from-purple-400 to-purple-600", time: "5 hours ago" },
      content: {
        type: "Voice",
        title: "Grandpa's WWII Story",
        description: "Recorded grandpa talking about his time stationed in France.",
        duration: "04:12",
      },
      stats: { likes: 128, comments: 24 },
    },
    {
      id: 3,
      user: { name: "Elena Rodriguez", avatar: "from-rose-400 to-rose-600", time: "Yesterday" },
      content: {
        type: "Text",
        title: "Reflections on turning 30",
        description: "I've realized that the most important things aren't things at all. They are the moments we share with the people we love. Looking forward to the next decade of making memories.",
        color: "bg-gradient-to-br from-amber-50 to-stone-50 border border-amber-100/50 text-stone-800",
      },
      stats: { likes: 89, comments: 12 },
    }
  ];

  return (
    <div className="w-full animation-fade-in max-w-2xl mx-auto pb-24 px-4 sm:px-0">
      
      {/* Header */}
      <header className="mb-6 md:mb-8 text-left py-4">
        <h1 className="text-3xl font-black text-stone-900 tracking-tight mb-2">Public Feed</h1>
        <p className="text-sm font-semibold text-stone-500">Discover memories from the community</p>
      </header>

      {/* Create Post Action Box */}
      <div className="bg-white border border-stone-200/80 p-5 rounded-[2.5rem] mb-6 shadow-sm">
        <div className="flex gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-700 shadow-sm shrink-0 flex items-center justify-center text-white font-black text-lg">
            S
          </div>
          <Link href="/record" className="flex-1 bg-stone-50 border border-stone-200/80 rounded-2xl px-4 flex items-center text-xs font-semibold text-stone-500 hover:bg-stone-100 transition-colors cursor-text text-left">
            Share a memory with the community...
          </Link>
        </div>
        
        {/* Clean, premium 3D Glassmorphism Quick Links */}
        <div className="flex items-center justify-between border-t border-stone-100 pt-3 px-2">
          <Link href="/record?mode=Text" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-stone-50 transition-colors">
            <div className="scale-50 -mx-3 -my-3 shrink-0">
              {resolveGlass3DIcon("text")}
            </div> 
            <span className="text-xs font-black text-stone-700">Text</span>
          </Link>
          <Link href="/record?mode=Photo" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-stone-50 transition-colors">
            <div className="scale-50 -mx-3 -my-3 shrink-0">
              {resolveGlass3DIcon("photo")}
            </div> 
            <span className="text-xs font-black text-stone-700">Photo</span>
          </Link>
          <Link href="/record?mode=Voice" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-stone-50 transition-colors">
            <div className="scale-50 -mx-3 -my-3 shrink-0">
              {resolveGlass3DIcon("voice")}
            </div> 
            <span className="text-xs font-black text-stone-700">Voice</span>
          </Link>
        </div>
      </div>

      {/* Feed Stream */}
      <div className="space-y-6">
        {publicPosts.map((post) => (
          <article key={post.id} className="bg-white border border-stone-200/80 rounded-[2.5rem] overflow-hidden shadow-sm">
            
            {/* Post Header */}
            <div className="p-5 flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${post.user.avatar} shadow-inner shrink-0 flex items-center justify-center text-white font-extrabold text-sm`}>
                  {post.user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-stone-850 leading-tight">{post.user.name}</h3>
                  <span className="text-[10px] font-semibold text-stone-400">{post.user.time}</span>
                </div>
              </div>
              <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-stone-50 transition-colors text-stone-400 hover:text-stone-700">
                <MoreHorizontal size={18} />
              </button>
            </div>

            {/* Post Content */}
            <div className="px-5 pb-3 text-left">
              <h4 className="font-extrabold text-base text-stone-900 mb-1">{post.content.title}</h4>
              <p className="text-sm text-stone-500 font-semibold leading-relaxed">{post.content.description}</p>
            </div>

            {/* Post Media Area */}
            {post.content.type === "Photo" && post.content.mediaUrl ? (
              <div className="w-full bg-stone-50 border-y border-stone-100 relative overflow-hidden flex items-center justify-center">
                <img src={post.content.mediaUrl} alt={post.content.title} className="w-full max-h-[420px] object-cover" />
              </div>
            ) : post.content.type === "Photo" && (
              <div className="w-full aspect-[4/3] bg-stone-50 border-y border-stone-100 relative overflow-hidden flex items-center justify-center">
                <span className="text-xs font-bold text-stone-400">Image Attachment</span>
              </div>
            )}

            {post.content.type === "Voice" && (
              <div className="mx-5 mb-5 p-4.5 rounded-2xl bg-amber-500/5 border border-amber-100 flex items-center gap-4 text-left">
                <button className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20 hover:scale-105 transition-transform active:scale-95">
                  <Play fill="currentColor" size={18} className="ml-1" />
                </button>
                <div className="flex-1">
                  <div className="h-6 w-full flex items-center gap-1 opacity-70">
                    {/* Simulated Wav Waves */}
                    {[...Array(24)].map((_, i) => (
                      <div key={i} className="flex-1 bg-amber-500 rounded-full" style={{ height: `${20 + (i % 4) * 25}%` }}></div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-2 text-[10px] font-black text-amber-700">
                    <span>0:00</span>
                    <span>{post.content.duration}</span>
                  </div>
                </div>
              </div>
            )}

            {post.content.type === "Text" && (
              <div className={`mx-5 mb-5 p-6 rounded-2xl ${post.content.color} flex items-center justify-center min-h-[140px] text-center`}>
                <p className="font-extrabold text-base italic text-stone-700 leading-relaxed">"{post.content.description}"</p>
              </div>
            )}

            {/* Post Footer (Stats & Actions) */}
            <div className="px-5 py-3.5 border-t border-stone-100">
              <div className="flex items-center justify-between mb-3 text-[10px] font-bold text-stone-400 px-1">
                <span>{post.stats.likes} likes</span>
                <span>{post.stats.comments} comments</span>
              </div>
              
              <div className="flex items-center justify-between border-t border-stone-100 pt-2 gap-1.5">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl hover:bg-stone-50 transition-colors font-bold text-stone-600 hover:text-amber-600 group">
                  <Heart size={18} className="group-active:scale-90 transition-transform" />
                  <span className="text-xs">Like</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl hover:bg-stone-50 transition-colors font-bold text-stone-600 hover:text-stone-900 group">
                  <MessageCircle size={18} className="group-active:scale-90 transition-transform" />
                  <span className="text-xs">Comment</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl hover:bg-stone-50 transition-colors font-bold text-stone-600 hover:text-stone-900 group">
                  <Share2 size={18} className="group-active:scale-90 transition-transform" />
                  <span className="text-xs">Share</span>
                </button>
              </div>
            </div>

          </article>
        ))}
      </div>
    </div>
  );
}
