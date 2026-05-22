"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

export default function AuthGateway() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (email) {
      // Mock Login Flow: Set isLoggedIn to true
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email);
      // Use hard redirect to guarantee app state resets cleanly and loads dashboard instantly
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcfa] flex flex-col px-6 py-8 animation-fade-in relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-1/2 opacity-30 pointer-events-none">
        <div className="absolute -top-32 -right-16 w-96 h-96 rounded-full bg-gradient-to-tr from-amber-300 to-amber-500 blur-3xl" />
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
          <h1 className="text-3xl font-black text-[var(--ink)] tracking-tight mb-2">Welcome Back</h1>
          <p className="text-sm font-semibold text-stone-500">Sign in to continue your legacy.</p>
        </div>

        {/* Auth Form Card with visible, elegant borders */}
        <div className="bg-white/80 backdrop-blur-md border border-amber-200/60 shadow-xl shadow-amber-100/50 rounded-[2rem] p-8 w-full mb-6">
          <form onSubmit={handleLogin} className="space-y-5">
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
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200" />
            </div>
            <span className="relative px-3 bg-white text-xs font-bold text-stone-400">OR</span>
          </div>

          {/* Google SSO */}
          <button 
            onClick={() => {
              localStorage.setItem("isLoggedIn", "true");
              localStorage.setItem("userEmail", "google-user@example.com");
              window.location.href = "/";
            }} 
            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-white border border-stone-300 hover:border-amber-300 hover:bg-amber-50 transition-all active:scale-95 group shadow-sm"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-extrabold text-stone-700 text-sm">Continue with Google</span>
          </button>
        </div>

        <div className="text-center text-sm">
          <span className="text-stone-500 font-semibold">Don't have an account? </span>
          <Link href="/signup" className="text-amber-600 font-black hover:underline">Sign Up</Link>
        </div>

      </main>
      
      <footer className="text-center text-xs font-bold text-stone-400 relative z-10">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </footer>
    </div>
  );
}
