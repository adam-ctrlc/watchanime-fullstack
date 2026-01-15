"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PlayCircleIcon, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero({ featuredAnime }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!featuredAnime || featuredAnime.length === 0) return;
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredAnime.length);
    }, 7000);
    return () => clearTimeout(timer);
  }, [currentSlide, featuredAnime]);

  if (!featuredAnime || featuredAnime.length === 0) {
    return (
      <div className="relative h-[60vh] md:h-[80vh] bg-gray-900 rounded-3xl overflow-hidden border border-white/5">
        <div className="absolute inset-0 bg-gray-800 animate-pulse" />
      </div>
    );
  }

  const anime = featuredAnime[currentSlide];
  if (!anime || !anime.attributes) return null;

  const goToPrevious = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + featuredAnime.length) % featuredAnime.length
    );
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredAnime.length);
  };

  const title =
    anime.attributes.titles?.en ||
    anime.attributes.titles?.en_jp ||
    anime.attributes.canonicalTitle;
  const imageUrl =
    anime.attributes.coverImage?.large ||
    anime.attributes.coverImage?.original ||
    anime.attributes.posterImage?.large ||
    "/placeholder-cover.png";
  const synopsis =
    anime.attributes.synopsis?.substring(0, 180) +
    (anime.attributes.synopsis?.length > 180 ? "..." : "");

  return (
    <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden rounded-3xl border border-white/5 shadow-2xl">
      {/* Background Image with subtle movement */}
      <div className="absolute inset-0 transition-transform duration-1000">
        <Image
          src={imageUrl}
          alt={`Background for ${title}`}
          fill
          priority
          className="object-cover object-center animate-subtle-zoom"
          style={{ opacity: 0.6 }}
          onError={(e) => {
            e.target.src = "/placeholder-cover.png";
          }}
        />
      </div>

      {/* Modern Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
      <div className="absolute inset-0 bg-purple-900/10 mix-blend-overlay" />

      {/* Content Section */}
      <div className="relative z-10 flex flex-col justify-end h-full container mx-auto px-6 md:px-12 pb-12 md:pb-20">
        <div className="flex flex-col gap-6 max-w-3xl">
          <div className="flex flex-col gap-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.9] drop-shadow-2xl">
              {title}
            </h1>
            {synopsis && (
              <p className="text-gray-300 text-base md:text-xl font-medium leading-relaxed line-clamp-3 opacity-90 max-w-2xl drop-shadow-md">
                {synopsis}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <Button
              asChild
              className="h-14 px-10 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-lg font-black shadow-2xl shadow-purple-900/40 group transition-all"
            >
              <Link href={`/watch/${anime.id}/1`} className="flex items-center gap-2">
                <PlayCircleIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                WATCH NOW
              </Link>
            </Button>
            
            <Button
              asChild
              variant="outline"
              className="h-14 px-10 bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white rounded-2xl text-lg font-bold border-white/10 hover:border-white/20 shadow-xl transition-all"
            >
              <Link href={`/detail/${anime.id}`} className="flex items-center gap-2">
                <Info className="w-6 h-6" />
                DETAILS
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Refined Navigation Arrows */}
      {featuredAnime.length > 1 && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 z-20 pointer-events-none">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToPrevious();
            }}
            className="h-14 w-14 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white border border-white/5 pointer-events-auto transition-all"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToNext();
            }}
            className="h-14 w-14 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white border border-white/5 pointer-events-auto transition-all"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
      )}

      {/* Minimal Slide Indicators */}
      {featuredAnime.length > 1 && (
        <div className="absolute bottom-8 right-12 z-20 flex gap-2">
          {featuredAnime.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentSlide(index);
              }}
              className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                index === currentSlide
                  ? "bg-purple-500 w-12"
                  : "bg-white/20 w-4 hover:bg-white/40"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
