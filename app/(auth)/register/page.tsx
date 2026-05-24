// app/register/page.tsx
// or app/signup/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  User,
  ShieldCheck,
  MapPinned,
  Moon,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Frontend-only Sprint 1 redirect
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex bg-[#040B12] text-white">
      
      {/* LEFT SIDE */}
      <div className="hidden lg:flex relative w-1/2 overflow-hidden">
        
        {/* Background Image */}
        <Image
          src="/signup.png"
          alt="Mountain Trek"
          fill
          priority
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-20">
          
          <h1 className="text-6xl font-bold leading-tight">
            Join Yeti Trek
          </h1>

          <p className="mt-6 text-3xl text-gray-300 leading-snug max-w-xl">
            Begin your next adventure with Nepal's most trusted
            trekking community.
          </p>

          {/* Features */}
          <div className="mt-20 space-y-8">
            
            <div className="flex items-center gap-4">
              <MapPinned className="text-[#D8952F]" size={24} />
              <span className="text-xl text-gray-200">
                Explore Local Trails
              </span>
            </div>

            <div className="flex items-center gap-4">
              <ShieldCheck className="text-[#D8952F]" size={24} />
              <span className="text-xl text-gray-200">
                Safety Guaranteed
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Moon className="text-[#D8952F]" size={24} />
              <span className="text-xl text-gray-200">
                Unforgettable Experiences
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-10">
        
        <div className="w-full max-w-md rounded-2xl border border-[#1f2b36] bg-[#0C131B]/95 p-10 shadow-2xl backdrop-blur-md">
          
          {/* Heading */}
          <div className="text-center">
            <h2 className="text-5xl font-bold text-[#D8952F]">
              Yeti Trek
            </h2>

            <p className="mt-4 text-gray-400">
              Create your account and start exploring
            </p>
          </div>

          {/* FORM */}
          <form
            className="mt-10 space-y-7"
            onSubmit={handleSubmit}
          >
            
            {/* Full Name */}
            <div>
              <label className="mb-3 block text-sm font-medium tracking-widest text-gray-300">
                FULL NAME
              </label>

              <div className="flex items-center rounded-lg border border-[#2A3642] bg-[#111922] px-4">
                <User className="text-gray-500" size={18} />

                <input
                  type="text"
                  placeholder="Enter your name"
                  required
                  className="w-full bg-transparent px-3 py-4 outline-none placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-3 block text-sm font-medium tracking-widest text-gray-300">
                EMAIL ADDRESS
              </label>

              <div className="flex items-center rounded-lg border border-[#2A3642] bg-[#111922] px-4">
                <Mail className="text-gray-500" size={18} />

                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full bg-transparent px-3 py-4 outline-none placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-3 block text-sm font-medium tracking-widest text-gray-300">
                PASSWORD
              </label>

              <div className="flex items-center rounded-lg border border-[#2A3642] bg-[#111922] px-4">
                <Lock className="text-gray-500" size={18} />

                <input
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="w-full bg-transparent px-3 py-4 outline-none placeholder:text-gray-500"
                />

                <Eye
                  className="cursor-pointer text-gray-500"
                  size={18}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-3 block text-sm font-medium tracking-widest text-gray-300">
                CONFIRM PASSWORD
              </label>

              <div className="flex items-center rounded-lg border border-[#2A3642] bg-[#111922] px-4">
                <Lock className="text-gray-500" size={18} />

                <input
                  type="password"
                  placeholder="Confirm password"
                  required
                  className="w-full bg-transparent px-3 py-4 outline-none placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-4 w-full rounded-lg bg-[#D8952F] py-4 text-lg font-semibold text-black transition hover:bg-[#e4a53f]"
            >
              Sign Up
            </button>
          </form>

          {/* Footer */}
          <p className="mt-10 text-center text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[#D8952F] hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}