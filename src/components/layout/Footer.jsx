"use client";

import Link from "next/link";
import {
  HomeIcon,
  FireIcon,
  TvIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-white/5 bg-gradient-to-t from-black to-transparent text-gray-400">
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4 md:col-span-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent inline-block">
              WatchAnime
            </h2>
            <p className="text-sm leading-relaxed max-w-sm text-gray-500">
              Your ultimate destination for streaming anime. Discover the latest
              trending hits, timeless classics, and hidden gems all in one
              place.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wide text-sm uppercase">
              Explore
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/#hero"
                  className="hover:text-purple-400 transition-colors flex items-center gap-2"
                >
                  <HomeIcon className="h-4 w-4" /> Home
                </Link>
              </li>
              <li>
                <Link
                  href="/#trending"
                  className="hover:text-purple-400 transition-colors flex items-center gap-2"
                >
                  <FireIcon className="h-4 w-4" /> Trending
                </Link>
              </li>
              <li>
                <Link
                  href="/#popular"
                  className="hover:text-purple-400 transition-colors flex items-center gap-2"
                >
                  <TvIcon className="h-4 w-4" /> Popular
                </Link>
              </li>
              <li>
                <Link
                  href="/#top-rated"
                  className="hover:text-purple-400 transition-colors flex items-center gap-2"
                >
                  <StarIcon className="h-4 w-4" /> Top Rated
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Social (Placeholder) */}
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wide text-sm uppercase">
              Legal
            </h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>
                <span className="block mb-2">
                  DISCLAIMER: This site does not store any files on its server.
                  All contents are provided by non-affiliated third parties.
                </span>
              </li>
              <li>&copy; {currentYear} WatchAnime.</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
