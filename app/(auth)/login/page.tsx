// app/login/page.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Moon,
  MapPinned,
} from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#050B12] text-white flex flex-col lg:flex-row">
      
      {/* LEFT SECTION */}
      <div className="relative w-full lg:w-[65%] h-[50vh] lg:h-screen overflow-hidden">
        
        <Image
          src="/login.png"
          alt="Mountain Trek"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Welcome Back
          </h1>

          <p className="mt-4 text-lg md:text-2xl text-gray-300 max-w-lg">
            Log in to continue your adventure with Yeti Trek.
          </p>

          <div className="mt-14 space-y-6">
            <div className="flex items-center gap-4 text-gray-300">
              <MapPinned className="text-yellow-500" size={22} />
              <span>Expert Local Guides</span>
            </div>

            <div className="flex items-center gap-4 text-gray-300">
              <ShieldCheck className="text-yellow-500" size={22} />
              <span>Safety Guaranteed</span>
            </div>

            <div className="flex items-center gap-4 text-gray-300">
              <Moon className="text-yellow-500" size={22} />
              <span>Unforgettable Experiences</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full lg:w-[35%] flex items-center justify-center px-6 py-10 bg-[#050B12]">
        
        <div className="w-full max-w-md bg-[#11161D] border border-gray-800 rounded-2xl p-8 shadow-2xl">
          
          <h2 className="text-4xl font-bold text-yellow-500">
            Login
          </h2>

          <p className="text-gray-400 mt-2 mb-8">
            Access your Yeti Trek account.
          </p>

          {/* FORM */}
          <form className="space-y-6">
            
            {/* Email */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                EMAIL ADDRESS
              </label>

              <div className="flex items-center bg-[#1A2028] border border-gray-700 rounded-lg px-4">
                <Mail size={18} className="text-gray-500" />

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-transparent outline-none px-3 py-4 text-white placeholder-gray-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                PASSWORD
              </label>

              <div className="flex items-center bg-[#1A2028] border border-gray-700 rounded-lg px-4">
                <Lock size={18} className="text-gray-500" />

                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full bg-transparent outline-none px-3 py-4 text-white placeholder-gray-500"
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-400 transition-all duration-300 text-black font-semibold py-4 rounded-xl flex items-center justify-center gap-2"
            >
              Login
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-400 mt-8">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-yellow-500 hover:underline font-medium"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}