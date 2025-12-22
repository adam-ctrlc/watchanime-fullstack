"use client";

import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { Film } from "lucide-react";
import AnimeCard from "./AnimeCard";
import LoadingSpinner from "@/components/status/LoadingSpinner";
export default function AnimeSection({
  title,
  animeList,
  viewMoreLink,
  loading,
  className,
}) {
  const showLoadingPlaceholders =
    loading && (!animeList || animeList.length === 0);

  return (
    <section className={`container mx-auto lg:px-4 ${className || ""}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
      </div>

      {/* Grid for Anime Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {showLoadingPlaceholders ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg aspect-[2/3] animate-pulse"
            ></div>
          ))
        ) : animeList && animeList.length > 0 ? (
          animeList.map((anime) => <AnimeCard key={anime.id} anime={anime} />)
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-70">
            <Film className="w-32 h-32 mb-4 text-gray-600" />
            <p className="text-gray-400 text-lg font-medium">
              No anime found in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
