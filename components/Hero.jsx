'use client'

import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

const Hero = () => {
  return (
    <section className="container mx-auto flex flex-col md:flex-row items-center justify-evenly gap-10 h-[60svh] w-full">
      {/* Left Content */}
      <div className="flex-1 text-center md:text-left space-y-6 max-w-fit text-white">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
          Welcome to <span className="underline decoration-pink-500/60">NovaTune</span>
        </h1>
        <p className="text-lg max-w-xl mx-auto md:mx-0">
          Your one-stop solution for all your music needs. Find your frequency, explore, and vibe.
        </p>
        <div>
          <Link href="/get-started">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      </div>

      {/* Right Image with Animation */}
      <motion.div
        className="flex-1 max-w-fit"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <img
          src="/characters/girl1.jpg"
          alt="Girl Character"
          className="h-[50svh] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-3xl shadow-xl object-fit"
        />
      </motion.div>
    </section>
  )
}

export default Hero
