"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Mic, Camera, Pen, Heart, Lock, ChevronRight, Play } from "lucide-react";

const FLOATING_CARDS = [
  { id: 1, image: "/Hiking.jpg", label: "Hiking", position: "top-[-20px] right-[60px]", delay: 0 },
  { id: 2, image: "/friends night sky.jpg", label: "Party", position: "top-[80px] right-[-40px]", delay: 0.2 },
  { id: 3, image: "/mountain.jpg", label: "Sea", position: "bottom-[40px] right-[80px]", delay: 0.4 },
  { id: 4, image: "/family steps.jpg", label: "Education", position: "bottom-[-30px] right-[20px]", delay: 0.6 },
  { id: 5, image: "/concert.jpg", label: "Concert", position: "top-[120px] right-[100px]", delay: 0.1 },
  { id: 6, image: "/skydiving.jpg", label: "Skydiving", position: "bottom-[80px] right-[40px]", delay: 0.3 },
];

const FEATURE_CARDS = [
  { icon: Mic, title: "Record", description: "Voice, video or text." },
  { icon: Camera, title: "Capture", description: "Photos & videos from your journey." },
  { icon: Pen, title: "Reflect", description: "Add thoughts, feelings & lessons." },
  { icon: Heart, title: "Relive", description: "Rediscover moments anytime, anywhere." },
  { icon: Lock, title: "Keep Safe", description: "Private, secure & always yours." },
];

const AVATARS = [
  "https://i.pravatar.cc/100?img=1",
  "https://i.pravatar.cc/100?img=2",
  "https://i.pravatar.cc/100?img=3",
  "https://i.pravatar.cc/100?img=4",
  "https://i.pravatar.cc/100?img=5",
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background - Light theme */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-blue-50 to-white">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-blue-50/30 to-white" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-gray-900 font-bold text-xl">Spoken Odyssey</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          {["Home", "How it works", "Explore", "For Families", "Pricing"].map((item) => (
            <Link key={item} href="#" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              {item}
            </Link>
          ))}
        </div>

        <Link 
          href="/signup" 
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-full font-bold transition-all hover:scale-105"
        >
          Start your Odyssey
        </Link>
      </nav>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-12 md:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-lg md:text-xl text-blue-600 italic font-medium">
              It's your journey
            </p>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Your life. Your story. <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Your Odyssey.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 font-medium">
              Capture the moments. Tell the stories. Relive them forever.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link 
                href="/signup" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 inline-flex items-center gap-2"
              >
                Start your Odyssey <ArrowRight size={20} />
              </Link>
              <Link 
                href="#how-it-works" 
                className="text-gray-700 hover:text-gray-900 px-8 py-4 rounded-full font-bold text-lg transition-all inline-flex items-center gap-2"
              >
                <Play size={16} className="mr-1" /> See how it works
              </Link>
            </div>

            {/* Social Proof */}
            <div className="pt-4">
              <p className="text-gray-600 font-medium mb-4">
                Join thousands of users capturing moments that matter
              </p>
              <div className="flex items-center">
                {AVATARS.map((avatar, index) => (
                  <img
                    key={index}
                    src={avatar}
                    alt={`User ${index + 1}`}
                    className="w-10 h-10 rounded-full border-2 border-white -ml-3 first:ml-0"
                  />
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-r from-blue-500 to-purple-600 -ml-3 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">+2k</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Globe with Floating Cards */}
          <motion.div 
            className="relative h-[500px] hidden lg:block"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Central Globe */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64">
              <img 
                src="/globe.svg" 
                alt="Globe" 
                className="w-full h-full object-contain filter drop-shadow-2xl"
              />
            </div>

            {/* Floating Image Cards */}
            {FLOATING_CARDS.map((card) => (
              <motion.div
                key={card.id}
                className={`absolute ${card.position} w-32 h-32 rounded-2xl overflow-hidden shadow-2xl border-4 border-white`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: card.delay }}
                whileHover={{ scale: 1.1 }}
              >
                <img 
                  src={card.image} 
                  alt={card.label}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Heart size={16} className="text-white fill-white drop-shadow-md" />
                </div>
              </motion.div>
            ))}

            {/* Decorative Elements */}
            <motion.div
              className="absolute top-[20%] left-[10%] text-4xl"
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              🚀
            </motion.div>
            <motion.div
              className="absolute bottom-[30%] left-[20%] text-3xl"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
            >
              🪐
            </motion.div>
            <motion.div
              className="absolute top-[40%] right-[10%] text-2xl"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 1 }}
            >
              ⭐
            </motion.div>
          </motion.div>
        </div>

        {/* Feature Cards Section */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 5 Feature Cards - Horizontal Strip */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {FEATURE_CARDS.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full border-2 border-blue-300 flex items-center justify-center">
                    <feature.icon className="text-blue-500" size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wide">{feature.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI Glasses Card */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg relative overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded">NEW</span>
              <span className="text-sm font-bold text-gray-900">
                <span className="text-purple-600">AI</span> GLASSES
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Capture life as it naturally happens.
            </h3>
            
            <ul className="space-y-3 mb-6">
              {[
                "Hands-free recording of your moments",
                "AI highlights what matters",
                "Privacy first, always in control",
                "Seamless sync across all your devices"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-purple-500 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="relative h-32 mb-6 flex items-center justify-center">
              <img 
                src="/glass.png" 
                alt="AI Glasses" 
                className="h-full object-contain"
              />
            </div>

            <Link 
              href="#" 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-full font-bold transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              Visit the Spoken Odyssey Store <ChevronRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
