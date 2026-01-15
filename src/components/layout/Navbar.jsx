"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import queryString from "query-string";
import {
  Search,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

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

  return (
    <header className="sticky top-0 z-50 pt-4 md:pt-6 pb-4 mb-8 md:mb-12">
      <div className="container mx-auto px-4">
        <nav className="bg-[#121212]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-black/40 h-16 md:h-20 flex items-center justify-between px-4 md:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent hover:scale-105 transition-transform"
          >
            WatchAnime
          </Link>

          {/* Search - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8 relative group">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
              <label htmlFor="search-input" className="sr-only">Search anime</label>
              <Input
                id="search-input"
                name="q"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search anime..."
                className="w-full bg-black/40 border-white/5 rounded-xl pl-12 h-12 text-white placeholder:text-gray-500 focus-visible:ring-purple-500/50"
              />
            </div>
            <Button type="submit" className="ml-4 h-12 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-900/20">
              Search
            </Button>
          </form>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:bg-white/10 rounded-xl h-10 w-10"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 bg-[#121212]/95 backdrop-blur-2xl rounded-2xl border border-white/10 p-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <form onSubmit={handleSearch} className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <label htmlFor="search-mobile-input" className="sr-only">Search anime</label>
                <Input
                  id="search-mobile-input"
                  name="q"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search anime..."
                  className="w-full bg-black/40 border-white/10 rounded-xl pl-12 h-14 text-lg text-white"
                />
              </div>
              <Button type="submit" className="h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-lg font-black shadow-xl shadow-purple-900/40">
                Search
              </Button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
