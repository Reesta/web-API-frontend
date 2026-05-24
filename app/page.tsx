import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Shield,
  Mountain,
  Headphones,
} from "lucide-react";

const treks = [
  {
    title: "Everest Base Camp",
    image: "/mount.png",
    altitude: "5,364m",
    duration: "8 Days",
  },
  {
    title: "Annapurna Base Camp",
    image: "/mount.png",
    altitude: "4,130m",
    duration: "5 Days",
  },
  {
    title: "Gokyo Lakes",
    image: "/mount.png",
    altitude: "4,790m",
    duration: "5 Days",
  },
  {
    title: "Langtang Valley",
    image: "/mount.png",
    altitude: "4,790m",
    duration: "5 Days",
  },
];

export default function Home() {
  return (
    <main className="bg-[#020B16] text-white min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#020B16]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-yellow-500">
            Yeti Trek
          </h1>

          <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
            <a href="#" className="hover:text-yellow-500">
              Explore
            </a>
            <a href="#" className="hover:text-yellow-500">
              Travel Blog
            </a>
            <a href="#" className="hover:text-yellow-500">
              About
            </a>
            <a href="#" className="hover:text-yellow-500">
              Contact
            </a>
            <a href="#" className="hover:text-yellow-500">
              Destinations
            </a>
          </div>

          <div className="flex gap-3">
            <Link
              href="/login"
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-full bg-yellow-500 px-4 py-2 text-sm font-medium text-black"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden pt-20">
        <Image
          src="/home.png"
          alt="Himalayan Mountain"
          fill
          priority
          className="object-cover object-center translate-y-10"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 flex h-full items-center">
          <div className="w-full px-6 md:px-12 lg:px-20">
            <div className="max-w-2xl">
              <p className="mb-5 text-sm uppercase tracking-[0.25em] text-yellow-500">
                Your Journey. Our Expertise.
              </p>

              <h1 className="text-5xl font-bold leading-tight md:text-7xl">
                Welcome to
                <span className="block text-yellow-500">
                  Yeti Trek
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg text-gray-300 md:text-2xl">
                Experience the Himalayas through the lens of local
                expertise and cutting-edge safety. Your journey to
                the roof of the world starts here.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <button className="rounded-lg bg-yellow-500 px-8 py-4 font-semibold text-black transition hover:bg-yellow-400">
                  Start Your Journey
                </button>

                <button className="rounded-lg border border-white/30 px-8 py-4 transition hover:bg-white/10">
                  View Expeditions
                </button>
              </div>

              <div className="mt-10">
                <p className="text-sm text-gray-300">
                  Trusted by{" "}
                  <span className="font-semibold text-white">
                    2,500+
                  </span>{" "}
                  Adventurers
                </p>

                <p className="mt-1 text-xs text-yellow-500">
                  ★ 4.9/5 from 300+ reviews
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-20 -mt-12 px-6">
        <div className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-[#07121D]/90 p-8 backdrop-blur-md">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="flex items-center gap-4">
              <Users className="text-yellow-500" />
              <div>
                <h3 className="text-2xl font-bold">
                  12,000+
                </h3>
                <p className="text-gray-400">
                  Happy Trekkers
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Mountain className="text-yellow-500" />
              <div>
                <h3 className="text-2xl font-bold">150+</h3>
                <p className="text-gray-400">
                  Expeditions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Shield className="text-yellow-500" />
              <div>
                <h3 className="text-2xl font-bold">98%</h3>
                <p className="text-gray-400">
                  Summit Success
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Headphones className="text-yellow-500" />
              <div>
                <h3 className="text-2xl font-bold">24/7</h3>
                <p className="text-gray-400">
                  Support
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trek Cards */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">
            Popular Treks
          </h2>

          <button className="text-yellow-500 hover:underline">
            View All
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {treks.map((trek) => (
            <div
              key={trek.title}
              className="overflow-hidden rounded-2xl bg-[#11161D] transition hover:-translate-y-2"
            >
              <div className="relative h-56">
                <Image
                  src={trek.image}
                  alt={trek.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-5">
                <h3 className="text-xl font-semibold">
                  {trek.title}
                </h3>

                <div className="mt-4 flex justify-between text-sm">
                  <div>
                    <p className="text-gray-400">
                      Altitude
                    </p>
                    <p className="text-green-400">
                      {trek.altitude}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400">
                      Duration
                    </p>
                    <p>{trek.duration}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="uppercase tracking-[0.2em] text-yellow-500 text-sm">
              About Yeti Trek
            </p>

            <h2 className="mt-4 text-5xl font-bold leading-tight">
              Journey Through
              <br />
              the Himalayas
            </h2>

            <p className="mt-6 text-lg text-gray-400">
              We are a team of passionate explorers, local
              experts, and certified guides committed to
              delivering safe, authentic, and life-changing
              adventures in the Himalayas.
            </p>

            <button className="mt-8 rounded-lg border border-yellow-500 px-6 py-3 text-yellow-500 transition hover:bg-yellow-500 hover:text-black">
              Learn More About Us
            </button>
          </div>

          <div className="relative h-[450px] overflow-hidden rounded-3xl">
            <Image
              src="/mount.png"
              alt="About Yeti Trek"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>
      {/* Why Choose Us */}
<section className="bg-[#020B16] py-24">
  <div className="mx-auto max-w-7xl px-6">
    <div className="text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-yellow-500">
        Why Choose Us
      </p>

      <h2 className="mt-4 text-5xl font-bold">
        Adventure With Confidence
      </h2>
    </div>

    <div className="mt-16 grid gap-8 md:grid-cols-3">
      <div className="rounded-2xl bg-[#11161D] p-8">
        <h3 className="text-xl font-semibold text-yellow-500">
          Expert Guides
        </h3>

        <p className="mt-4 text-gray-400">
          Our experienced local guides ensure every trek is safe,
          informative, and unforgettable.
        </p>
      </div>

      <div className="rounded-2xl bg-[#11161D] p-8">
        <h3 className="text-xl font-semibold text-yellow-500">
          Safety First
        </h3>

        <p className="mt-4 text-gray-400">
          We prioritize safety with proper planning, certified
          equipment, and emergency support.
        </p>
      </div>

      <div className="rounded-2xl bg-[#11161D] p-8">
        <h3 className="text-xl font-semibold text-yellow-500">
          Authentic Experience
        </h3>

        <p className="mt-4 text-gray-400">
          Experience the Himalayas through local culture, food,
          and breathtaking landscapes.
        </p>
      </div>
    </div>
  </div>
  
  {/* CTA */}
<section className="px-6 pt-16 pb-24">
  <div className="mx-auto max-w-6xl rounded-3xl bg-yellow-500 p-12 text-center text-black">
    <h2 className="text-4xl font-bold">
      Ready For Your Next Adventure?
    </h2>

    <p className="mt-4 text-lg">
      Join thousands of trekkers exploring the Himalayas with
      Yeti Trek.
    </p>

    <div className="mt-8">
      <Link
        href="/register"
        className="rounded-lg bg-black px-8 py-4 text-white"
      >
        Get Started
      </Link>
    </div>
  </div>
</section>
<footer className="border-t border-white/10 bg-[#020B16]">
  <div className="mx-auto max-w-7xl px-6 py-16">
    <div className="grid gap-12 md:grid-cols-4">
      
      <div>
        <h3 className="text-2xl font-bold text-yellow-500">
          Yeti Trek
        </h3>

        <p className="mt-4 text-gray-400">
          Explore the Himalayas with expert guides and
          unforgettable adventures.
        </p>
      </div>

      <div>
        <h4 className="font-semibold mb-4">
          Company
        </h4>

        <ul className="space-y-2 text-gray-400">
          <li>About Us</li>
          <li>Our Team</li>
          <li>Careers</li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-4">
          Treks
        </h4>

        <ul className="space-y-2 text-gray-400">
          <li>Everest Base Camp</li>
          <li>Annapurna Circuit</li>
          <li>Langtang Valley</li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-4">
          Contact
        </h4>

        <ul className="space-y-2 text-gray-400">
          <li>info@yetitrek.com</li>
          <li>+977 9800000000</li>
          <li>Kathmandu, Nepal</li>
        </ul>
      </div>
    </div>

    <div className="mt-12 border-t border-white/10 pt-6 text-center text-gray-500">
      © 2025 Yeti Trek. All rights reserved.
    </div>
  </div>
</footer>
</section>
    </main>
  );
}