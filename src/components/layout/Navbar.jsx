"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import queryString from "query-string";
import {
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const url = queryString.stringifyUrl({
        url: "/search",
        query: { q: searchQuery.trim() },
      });
      router.push(url);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const baseLinkClass =
    "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";
  const inactiveLinkClass = "text-gray-300 hover:bg-gray-700 hover:text-white";
  const activeLinkClass = "bg-gray-900 text-white";
  const mobileBaseLinkClass =
    "block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200";

  return (
    <nav className="sticky top-2 md:top-4 z-50 mx-auto max-w-7xl px-2 md:px-4 pb-2 md:pb-4 w-full">
      <div className="bg-[#121212]/80 backdrop-blur-xl rounded-xl md:rounded-2xl border border-white/10 shadow-lg shadow-black/20">
        <div className="flex items-center justify-between h-14 md:h-16 px-4 sm:px-6">
          {/* Logo/Brand Section */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-pink-300 transition-all duration-300 transform hover:scale-105"
            >
              WatchAnime
            </Link>
          </div>

          {/* Navigation removed for cleaner design */}

          {/* Search Form - Desktop */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative w-full">
                <input
                  type="text"
                  name="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search anime..."
                  className="w-full px-5 py-2.5 pl-11 bg-black/20 border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="ml-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
              >
                Search
              </button>
            </form>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-7 w-7" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-7 w-7" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className="md:hidden absolute top-full left-2 right-2 mt-2 bg-[#121212]/95 backdrop-blur-2xl rounded-xl border border-white/10 shadow-2xl overflow-hidden ring-1 ring-white/5"
          id="mobile-menu"
        >
          {/* Mobile navigation links removed */}

          {/* Search in Mobile Menu */}
          <div className="p-4 border-t border-white/5">
            <form onSubmit={handleSearch} className="flex flex-col gap-3">
              <div className="relative w-full">
                <input
                  type="text"
                  name="search-mobile"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search anime..."
                  className="w-full px-4 py-3 pl-10 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-base"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl text-white font-bold shadow-lg shadow-purple-900/30 focus:outline-none focus:ring-2 focus:ring-purple-500 active:scale-[0.98] transition-all"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
