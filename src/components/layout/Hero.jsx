"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PlayIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
      <div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] bg-gray-800 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
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
    anime.attributes.synopsis?.substring(0, 150) +
    (anime.attributes.synopsis?.length > 150 ? "..." : "");

  return (
    <div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src={imageUrl}
        alt={`Background for ${title}`}
        fill
        priority
        className="object-cover object-center animate-subtle-zoom"
        style={{ opacity: 0.85 }}
        onError={(e) => {
          e.target.src = "/placeholder-cover.png";
        }}
      />

      {/* Gradient Overlay - Complex layering for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent opacity-60 mix-blend-overlay" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#121212] via-[#121212]/90 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full container mx-auto px-4 md:px-6 pb-12 md:pb-28">
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 md:mb-6 tracking-tight leading-tight md:leading-none max-w-4xl drop-shadow-lg">
          {title || "Featured Anime"}
        </h1>
        {synopsis && (
          <p className="text-gray-200 text-sm sm:text-base md:text-lg max-w-xl md:max-w-2xl mb-6 md:mb-10 leading-relaxed line-clamp-3 md:line-clamp-3 font-medium drop-shadow-md">
            {synopsis}
          </p>
        )}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 w-full sm:w-auto">
          <Link
            href={`/watch/${anime.id}/1`}
            className="group bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 md:py-3.5 px-6 md:px-8 rounded-xl md:rounded-full flex items-center justify-center gap-2 md:gap-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_-5px_rgba(147,51,234,0.5)] active:scale-95"
          >
            <PlayIcon className="h-5 w-5 md:h-6 md:w-6 group-hover:fill-current" />
            <span className="tracking-wide text-sm md:text-base">
              WATCH NOW
            </span>
          </Link>
          <Link
            href={`/search?q=${encodeURIComponent(title)}`}
            className="group bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold py-3 md:py-3.5 px-6 md:px-8 rounded-xl md:rounded-full flex items-center justify-center gap-2 md:gap-3 transition-all duration-300 border border-white/20 hover:border-white/40 active:scale-95"
          >
            <InformationCircleIcon className="h-5 w-5 md:h-6 md:w-6" />
            <span className="tracking-wide text-sm md:text-base">DETAILS</span>
          </Link>
        </div>
      </div>

      {/* Navigation Arrows - only show if more than 1 slide */}
      {featuredAnime.length > 1 && (
        <>
          {/* Left Arrow */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 text-white/50 hover:text-white transition-colors duration-300 p-4"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-10 w-10 md:h-12 md:w-12" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={goToNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 text-white/50 hover:text-white transition-colors duration-300 p-4"
            aria-label="Next slide"
          >
            <ChevronRight className="h-10 w-10 md:h-12 md:w-12" />
          </button>
        </>
      )}

      {/* Optional: Slide Indicators */}
      {featuredAnime.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
          {featuredAnime.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentSlide
                  ? "bg-purple-500"
                  : "bg-gray-500/50 hover:bg-gray-400/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
