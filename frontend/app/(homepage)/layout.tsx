import Link from "next/link";
import { Mail, MapPin, Mountain, Phone } from "lucide-react";
import HomepageNav from "./HomepageNav";

export default function HomepageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#070b13] text-white">
      <HomepageNav />

      <main className="bg-[#070b13]">{children}</main>

      <footer id="contact" className="scroll-mt-[76px] border-t border-white/10 bg-[#05080d] py-20">
        <div className="mx-auto grid w-[min(1180px,calc(100%_-_120px))] gap-12 md:grid-cols-[1.2fr_0.7fr_0.9fr] max-[1000px]:w-[min(100%-40px,1180px)]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 text-xl font-black text-white">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#D89A2B] text-black">
                <Mountain size={23} />
              </span>
              Yeti Trek
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
              Discover trails, compare mountain stays, and plan unforgettable
              trekking experiences across Nepal with confidence.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Explore
            </h3>
            <div className="mt-5 grid gap-3 text-sm text-slate-400">
              <Link href="#explore" className="hover:text-white">Home</Link>
              <Link href="#destinations" className="hover:text-white">Destinations</Link>
              <Link href="#about" className="hover:text-white">About Us</Link>
              <Link href="#why-us" className="hover:text-white">Why Choose Us</Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Contact
            </h3>
            <div className="mt-5 grid gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-3">
                <Mail size={16} className="text-[#D89A2B]" />
                hello@yetitrek.local
              </span>
              <span className="flex items-center gap-3">
                <Phone size={16} className="text-[#D89A2B]" />
                +977 9800000000
              </span>
              <span className="flex items-center gap-3">
                <MapPin size={16} className="text-[#D89A2B]" />
                Kathmandu, Nepal
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 flex w-[min(1180px,calc(100%_-_120px))] flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between max-[1000px]:w-[min(100%-40px,1180px)]">
          <span>(c) 2026 Yeti Trek. All rights reserved.</span>
          <span>Built for safer, smarter Himalayan travel.</span>
        </div>
      </footer>
    </div>
  );
}
