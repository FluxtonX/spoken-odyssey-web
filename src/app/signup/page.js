"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = (e) => {
    e.preventDefault();
    if (email && name) {
      // Mock Sign Up Flow
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", name);
      // Hard redirect to homepage dashboard directly to avoid Next caching delays
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcfa] flex flex-col px-6 py-8 animation-fade-in relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1/2 opacity-30 pointer-events-none">
        <div className="absolute -top-32 -left-16 w-96 h-96 rounded-full bg-gradient-to-tr from-amber-300 to-amber-500 blur-3xl" />
      </div>

      <header className="relative z-10 mb-8 max-w-7xl mx-auto w-full">
        <Link href="/" className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-white border border-stone-200/80 shadow-sm hover:border-amber-400 hover:bg-amber-50 transition-all text-stone-700">
          <ChevronLeft size={20} />
        </Link>
      </header>

      <main className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full relative z-10 pb-12">
        
        {/* Logo & Headline */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 shadow-lg shadow-amber-200 flex items-center justify-center mb-4">
            <span className="text-3xl text-white font-extrabold">S</span>
          </div>
          <h1 className="text-3xl font-black text-[var(--ink)] tracking-tight mb-2">Create Account</h1>
          <p className="text-sm font-semibold text-stone-500">Begin your legacy journey today.</p>
        </div>

        {/* Form Card with visible, elegant borders */}
        <div className="bg-white/80 backdrop-blur-md border border-amber-200/60 shadow-xl shadow-amber-100/50 rounded-[2rem] p-8 w-full mb-6">
          <form onSubmit={handleSignUp} className="space-y-5">
            <div>
              <label className="block text-xs font-black text-stone-500 uppercase tracking-wider mb-2 pl-1">Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Alexander" 
                required
                className="w-full p-4 rounded-2xl bg-white border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25 outline-none font-bold text-stone-850 placeholder-stone-400 transition-all shadow-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-black text-stone-500 uppercase tracking-wider mb-2 pl-1">Email Address</label>
              <input 
                type="email" 
                placeholder="name@example.com" 
                required
                className="w-full p-4 rounded-2xl bg-white border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25 outline-none font-bold text-stone-850 placeholder-stone-400 transition-all shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-black text-stone-500 uppercase tracking-wider mb-2 pl-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                required
                className="w-full p-4 rounded-2xl bg-white border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25 outline-none font-bold text-stone-850 placeholder-stone-400 transition-all shadow-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-700 text-white font-black shadow-lg shadow-amber-200 hover:scale-[1.02] active:scale-95 transition-all text-center block"
            >
              Sign Up
            </button>
          </form>
        </div>

        <div className="text-center text-sm">
          <span className="text-stone-500 font-semibold">Already have an account? </span>
          <Link href="/auth" className="text-amber-600 font-black hover:underline">Login</Link>
        </div>

      </main>
      
      <footer className="text-center text-xs font-bold text-stone-400 relative z-10">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </footer>
    </div>
  );
}
