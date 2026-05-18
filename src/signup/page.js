"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignUp = (e) => {
    e.preventDefault();
    if (email && name) {
      // Mock Sign Up Flow
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", name);
      // Route them to Profile Setup Gate for perfect onboarding!
      router.push("/profile-setup");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col px-6 py-8 animation-fade-in relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1/2 opacity-30 pointer-events-none">
        <div className="absolute -top-32 -left-16 w-96 h-96 rounded-full bg-gradient-to-tr from-rose-300 to-brand-400 blur-3xl" />
      </div>

      <header className="relative z-10 mb-8">
        <Link href="/" className="inline-flex items-center justify-center w-10 h-10 rounded-full glass hover:bg-[var(--surface-hover)] transition-colors text-[var(--foreground)] opacity-70">
          <ChevronLeft size={24} />
        </Link>
      </header>

      <main className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full relative z-10 pb-12">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-rose-400 shadow-xl shadow-[var(--brand)]/35 flex items-center justify-center mb-4">
            <span className="text-3xl text-white font-bold drop-shadow-sm">S</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Create Account</h1>
          <p className="text-sm text-[var(--foreground)] opacity-60">Begin your legacy journey today.</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignUp} className="space-y-4 w-full mb-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider opacity-50 mb-2 pl-2">Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. Alexander" 
              required
              className="w-full p-4 rounded-2xl glass border border-[var(--border)] focus:border-[var(--brand)] outline-none font-semibold transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider opacity-50 mb-2 pl-2">Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              required
              className="w-full p-4 rounded-2xl glass border border-[var(--border)] focus:border-[var(--brand)] outline-none font-semibold transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider opacity-50 mb-2 pl-2">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required
              className="w-full p-4 rounded-2xl glass border border-[var(--border)] focus:border-[var(--brand)] outline-none font-semibold transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-rose-500 text-white font-bold shadow-lg shadow-[var(--brand)]/20 hover:scale-[1.02] active:scale-95 transition-all text-center block"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center text-sm">
          <span className="opacity-60">Already have an account? </span>
          <Link href="/auth" className="text-[var(--brand)] font-bold hover:underline">Login</Link>
        </div>

      </main>
      
      <footer className="text-center text-xs font-medium opacity-50 relative z-10">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </footer>
    </div>
  );
}
