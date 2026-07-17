"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import WavesBackground from "@/components/layout/WavesBackground";
import { Search, Loader2, Headphones, Heart } from "lucide-react";
import { getDiscoveryMemories } from "@/services/backend";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp, fadeIn } from "@/lib/animations";
import { useAuth } from "@/context/AuthProvider";

const FILTER_PILLS = [
  "All Stories", "Family", "Immigration", "Heritage", "Love", "Career", "Loss", "Adventure"
];

// Fallback Figma data
const FEATURED_STORY = {
  id: "feat-1",
  author: "Amara Diallo",
  years: "1998 - 2024",
  avatarUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=150&auto=format&fit=crop",
  title: "Leaving Dakar at nineteen",
  description: "I left with my grandmother's recipe book and my father's blessing. Everything else I built from scratch.",
  tags: ["immigration", "resilience", "family"],
  listeners: "12.4k",
  mediaUrl: "https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?q=80&w=1200&auto=format&fit=crop"
};

const GRID_STORIES = [
  {
    id: "story-1",
    author: "Thomas Wren",
    years: "1944 - Present",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
    title: "The farm. The war. The letters.",
    description: "My grandfather never spoke about the war. After he died, we found 400 letters. I'm reading them all.",
    tags: ["war", "heritage"],
    listeners: "34.1k",
    mediaUrl: "https://images.unsplash.com/photo-1449247666642-264389f5f5b1?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "story-2",
    author: "Yuki Tanaka",
    years: "2009 - 2024",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
    title: "From Kyoto to Oslo",
    description: "A graphic novel designer who fell in love with fjords and a Norwegian fisherman.",
    tags: ["love", "travel"],
    listeners: "8.9k",
    mediaUrl: "https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "story-3",
    author: "Samuel Achebe",
    years: "1982 - 2022",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop",
    title: "The classroom that changed everything",
    description: "A teacher in Lagos for forty years. 2,400 students. A few of them changed the world.",
    tags: ["education", "teaching"],
    listeners: "19.2k",
    mediaUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=600&auto=format&fit=crop"
  }
];

export default function DiscoverPage() {
  const { firebaseUser, isAuthenticated, getToken } = useAuth();
  
  const [activeFilter, setActiveFilter] = useState("All Stories");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [memories, setMemories] = useState([]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      if (!isAuthenticated || !firebaseUser) {
        setIsLoading(false);
        return;
      }
      try {
        const token = await getToken();
        // Just fetch public memories, we will use mock data for the UI showcase if empty
        const data = await getDiscoveryMemories(token, "public", "");
        setMemories(data || []);
      } catch (err) {
        console.error("Discover API Error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [isAuthenticated, firebaseUser]);
  
  return (
    <WavesBackground>
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="w-full relative pb-24 min-h-screen"
      >
        <DashboardHeader />

        <div className="w-full mt-2 md:mt-6 px-4 md:px-8 max-w-6xl mx-auto">
          
          {/* Header & Search */}
          <motion.div variants={fadeInUp} className="flex flex-col mb-8">
            <h1 className="text-[32px] md:text-[40px] font-black text-stone-900 tracking-tight leading-tight mb-2">Discover</h1>
            <p className="text-stone-500 font-medium text-[15px] mb-8">
              Explore extraordinary lives, shared publicly
            </p>
            
            {/* Search Input */}
            <div className="relative max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-stone-400" />
              </div>
              <input
                type="text"
                placeholder="Search stories, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#C7D2FE] rounded-full text-[15px] font-medium text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4A3AFF]/20 transition-all shadow-sm"
              />
            </div>
          </motion.div>

          {/* Filter Pills */}
          <motion.div variants={fadeInUp} className="flex overflow-x-auto hide-scrollbar gap-3 mb-10 pb-2">
            {FILTER_PILLS.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 px-5 py-2.5 rounded-full text-[14px] font-bold transition-all ${
                  activeFilter === filter
                    ? "bg-transparent border border-[#4A3AFF] text-[#4A3AFF]"
                    : "bg-white border border-transparent text-stone-500 hover:text-stone-800 shadow-sm"
                }`}
              >
                {filter}
              </button>
            ))}
          </motion.div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={36} className="animate-spin text-[#4A3AFF] mb-4" />
              <p className="text-stone-500 font-bold tracking-wide uppercase text-[12px]">Loading Discover...</p>
            </div>
          ) : (
            <motion.div variants={staggerContainer} className="flex flex-col gap-8">
              
              {/* Featured Banner */}
              <motion.div variants={fadeInUp} className="w-full flex flex-col md:flex-row rounded-[24px] overflow-hidden shadow-lg border border-[#C7D2FE]/30 bg-[#4A3AFF] min-h-[360px]">
                {/* Left Side: Content */}
                <div className="w-full md:w-[55%] p-8 md:p-10 lg:p-12 flex flex-col justify-center text-white relative z-10">
                  <div className="text-[11px] font-bold tracking-widest text-white/80 uppercase mb-8">
                    Featured Story
                  </div>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <img 
                      src={FEATURED_STORY.avatarUrl} 
                      alt={FEATURED_STORY.author} 
                      className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-[14px] leading-tight">{FEATURED_STORY.author}</span>
                      <span className="text-[12px] text-white/70">{FEATURED_STORY.years}</span>
                    </div>
                  </div>

                  <h2 className="text-[28px] md:text-[36px] font-black leading-tight mb-4 text-white">
                    {FEATURED_STORY.title}
                  </h2>
                  <p className="text-[15px] text-white/90 font-medium mb-8 max-w-md leading-relaxed">
                    {FEATURED_STORY.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    {FEATURED_STORY.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/20 rounded-md text-[12px] font-bold tracking-wide">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 flex items-center gap-4">
                    <button className="flex items-center gap-2 bg-white text-[#4A3AFF] px-6 py-2.5 rounded-xl font-bold text-[14px] hover:bg-stone-50 transition-colors shadow-sm">
                      <Headphones size={16} />
                      Listen
                    </button>
                    <span className="text-[13px] font-medium text-white/80">{FEATURED_STORY.listeners} listeners</span>
                  </div>
                </div>

                {/* Right Side: Image */}
                <div className="w-full md:w-[45%] h-[250px] md:h-auto relative">
                  <img 
                    src={FEATURED_STORY.mediaUrl} 
                    alt="Featured" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Gradient Overlay for mobile blending */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#4A3AFF] to-transparent md:hidden" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4A3AFF] via-[#4A3AFF]/20 to-transparent hidden md:block" />
                </div>
              </motion.div>

              {/* Grid Stories */}
              <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {GRID_STORIES.map(story => (
                  <motion.div variants={fadeInUp} key={story.id} className="figma-card flex flex-col overflow-hidden bg-[#F4F5FF] border border-[#C7D2FE] group cursor-pointer h-full">
                    
                    {/* Image Top Half */}
                    <div className="w-full h-[180px] overflow-hidden shrink-0 relative border-b border-[#C7D2FE]/50">
                      <img 
                        src={story.mediaUrl} 
                        alt={story.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Bottom Content */}
                    <div className="p-6 flex flex-col grow bg-[#EAEBFF]/50 backdrop-blur-sm">
                      {/* Author Header */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                          <img 
                            src={story.avatarUrl} 
                            alt={story.author} 
                            className="w-10 h-10 rounded-full object-cover border border-[#C7D2FE]"
                          />
                          <div className="flex flex-col">
                            <span className="font-bold text-[13px] text-stone-900 leading-tight">{story.author}</span>
                            <span className="text-[11px] text-stone-500 font-medium">{story.years}</span>
                          </div>
                        </div>
                        <button className="text-[#C7D2FE] hover:text-[#4A3AFF] transition-colors">
                          <Heart size={18} strokeWidth={2.5} />
                        </button>
                      </div>

                      {/* Title & Desc */}
                      <h3 className="text-[18px] font-black text-stone-900 leading-tight mb-2">
                        {story.title}
                      </h3>
                      <p className="text-[14px] text-stone-600 font-medium leading-relaxed mb-6 line-clamp-3">
                        {story.description}
                      </p>

                      {/* Footer: Tags & Listeners */}
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                          {story.tags.map(tag => (
                            <span key={tag} className="px-2.5 py-1 bg-[#4A3AFF] text-white rounded-md text-[11px] font-bold tracking-wide">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-[12px] font-bold text-stone-500 shrink-0">{story.listeners}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

            </motion.div>
          )}

        </div>
      </motion.div>
    </WavesBackground>
  );
}
