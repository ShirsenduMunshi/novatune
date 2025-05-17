"use client";

import { Github, Twitter, Mail, Music, ShieldCheck, ScrollText, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full mt-10 border-t h-[60svh]"
    >
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/characters/fanely1.jpg"
          alt="Footer Background"
          fill
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Brand Info */}
        <div className="space-y-3 max-w-sm">
          <h2 className="text-xl font-bold">NovaTune</h2>
          <p className="text-sm">
            Your universe of tunes. Explore new sounds, enjoy trending beats, and vibe with the world.
          </p>
          <div className="flex gap-4 mt-3">
            <Link href="https://github.com/shirsendumunshi" target="_blank">
              <Github className="h-5 w-5 hover:scale-110 transition" />
            </Link>
            <Link href="https://x.com/MunshiShirsendu" target="_blank">
              <Twitter className="h-5 w-5 hover:scale-110 transition" />
            </Link>
            <Link href="mailto:shirsendumunshi4@gmail.com">
              <Mail className="h-5 w-5 hover:scale-110 transition" />
            </Link>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <h4 className="font-semibold">Explore</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/" className="flex items-center gap-1">
                  <Home className="h-4 w-4" /> Home
                </Link>
              </li>
              <li>
                <Link href="/SearchPage" className="flex items-center gap-1">
                  <Music className="h-4 w-4" /> Search
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Legal</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/Terms" className="flex items-center gap-1">
                  <ScrollText className="h-4 w-4" /> Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/Policy" className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4" /> Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/Contact" className="flex items-center gap-1">
                  <Mail className="h-4 w-4" /> Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Optional Image Block (from uploaded files) */}
        <div className="hidden md:block">
          <Image
            src="/characters/fanely2.jpg" // use any uploaded image here
            alt="Music vibe"
            width={120}
            height={120}
            className="rounded-xl shadow-md border object-cover"
          />
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t text-xs py-4 text-center">
        © {new Date().getFullYear()} NovaTune. All rights reserved.
      </div>
    </motion.footer>
  );
}
