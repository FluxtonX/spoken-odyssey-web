"use client";

import Link from "next/link";

export default function AuthLayout({ children, view = "login" }) {
  const isSignIn = view === "login" || view === "reset";

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row w-full text-slate-800 dark:text-slate-100 antialiased overflow-x-hidden">
      
      {/* Left Column - Onboarding & Artwork (Visible only on md+) */}
      <div className="hidden md:flex md:w-1/2 bg-[#3b2dd1] text-white relative flex-col p-12 overflow-hidden border-r border-slate-200/10 min-h-screen">
        
        {/* Brand Header */}
        <div className="absolute top-12 left-12 z-20 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <img src="/odyssey.png" alt="Spoken Odyssey Logo" className="h-8 w-auto object-contain brightness-0 invert" />
          </Link>
        </div>

        {/* Top-Right Circle Image (Smiling woman taking selfie) - Reduced by 30% */}
        <div className="absolute top-[-50px] right-[-50px] w-[260px] h-[260px] lg:w-[320px] lg:h-[320px] rounded-full overflow-hidden z-10">
          <img 
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80" 
            alt="Selfie" 
            className="w-full h-full object-cover object-center scale-[1.01]" 
          />
        </div>

        {/* Slogan and description (Center-Left) - Reduced heading text size */}
        <div className="absolute left-12 top-[44%] -translate-y-1/2 z-20 max-w-sm lg:max-w-md pr-4">
          <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-white mb-3 leading-tight font-sans">
            Your life deserves to be<br />remembered truthfully.
          </h2>
          <p className="text-xs lg:text-[14px] font-medium text-white/75 leading-relaxed max-w-[320px]">
            Join thousands preserving their voice, stories, and memories for the generations who come after them.
          </p>
        </div>

        {/* Bottom-Left Circle Image (Close-up eye with glasses) - Reduced by 30% */}
        <div className="absolute bottom-[-30px] left-[-30px] w-[240px] h-[240px] lg:w-[280px] lg:h-[280px] rounded-full overflow-hidden z-10">
          <img 
            src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=80" 
            alt="One side eye with glasses" 
            className="w-full h-full object-cover object-center scale-[1.01]" 
          />
        </div>

        {/* Bottom Testimonial Card overlaying bottom-left image */}
        <div className="absolute bottom-12 left-12 right-12 z-20 max-w-[380px] bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-xl">
          <p className="text-xs lg:text-[13px] font-medium text-white leading-relaxed mb-4">
            &ldquo;I started recording my life story for my children. Now, two years later, I have 400 memories that will outlast me. This is the greatest gift I've ever given my family.&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs text-white">
              E
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-none">Eleanor Voss</p>
              <p className="text-[10px] text-white/70 mt-1">Retired teacher &middot; 71</p>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column - Children (Login / Sign Up Forms) */}
      <div className="flex-1 flex flex-col justify-start pt-[12%] pb-12 px-6 md:px-12 lg:px-20 relative bg-white dark:bg-[#0f172a] min-h-screen">
        {children}
      </div>

    </div>
  );
}
