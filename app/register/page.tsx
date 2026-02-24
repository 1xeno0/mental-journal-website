"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { registerUser } from "@/lib/api";
import Cloud from "@/components/Cloud";

// Simple Star component for background details
const Star = ({ top, left, delay, opacity = 0.4, scale = 1 }: { top: string; left: string; delay?: number; opacity?: number; scale?: number }) => (
  <div 
    className="absolute bg-white rounded-full animate-pulse"
    style={{ 
      top, 
      left, 
      width: `${3 * scale}px`, 
      height: `${3 * scale}px`, 
      opacity,
      animationDelay: `${delay || 0}s`,
      animationDuration: '4s'
    }}
  />
);

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      await registerUser({ email, password });
      // After register, backend usually sets cookie, so redirect to app
      router.push("/app");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-400 via-sky-200 to-slate-50 flex items-center justify-center p-4">
      <Navbar />
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Stars */}
        <Star top="15%" left="10%" delay={1} opacity={0.6} />
        <Star top="25%" left="85%" delay={2} opacity={0.5} scale={1.2} />
        <Star top="10%" left="60%" delay={0} opacity={0.4} />
        <Star top="45%" left="20%" delay={3} opacity={0.3} scale={0.8} />
        <Star top="35%" left="90%" delay={1.5} opacity={0.5} />
        <Star top="60%" left="15%" delay={2.5} opacity={0.3} />
        <Star top="80%" left="75%" delay={0.5} opacity={0.4} scale={1.1} />

        {/* Clouds - Layer 1 (Back) */}
        <Cloud top="10%" left="5%" scale={0.9} delay={0} duration={45} opacity={0.8} variant={1} />
        <Cloud top="20%" left="75%" scale={1.2} delay={5} duration={50} opacity={0.7} variant={3} />
        
        {/* Clouds - Layer 2 (Mid) */}
        <Cloud top="45%" left="-5%" scale={1.4} delay={2} duration={55} opacity={0.9} variant={2} />
        <Cloud top="35%" left="60%" scale={0.8} delay={8} duration={48} opacity={0.8} variant={1} />
      </div>

      <div className="w-full max-w-md glass-card-solid p-6 md:p-10 animate-float relative z-10">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Create Account</h1>
          <p className="text-sm md:text-base text-slate-600">Start your journey with Serene</p>
        </div>

        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/60 focus:bg-white focus:ring-2 focus:ring-sky-200 outline-none transition-all placeholder:text-slate-400 text-slate-700"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/60 focus:bg-white focus:ring-2 focus:ring-sky-200 outline-none transition-all placeholder:text-slate-400 text-slate-700"
              placeholder="At least 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-2"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="text-slate-900 font-bold hover:text-slate-700 hover:underline transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
