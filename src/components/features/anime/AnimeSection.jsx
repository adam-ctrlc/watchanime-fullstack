"use client";

import Link from "next/link";
import { ChevronRight, Film } from "lucide-react";
import AnimeCard from "./AnimeCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

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
    <section className={`container mx-auto px-4 ${className || ""}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">{title}</h2>
        {viewMoreLink && (
          <Button asChild variant="ghost" className="text-purple-400 hover:text-purple-300 hover:bg-purple-400/10 gap-2 font-bold rounded-xl h-10 px-4">
            <Link href={viewMoreLink}>
              View all
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {showLoadingPlaceholders ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-4">
              <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-3/4 rounded-full" />
                <Skeleton className="h-3 w-1/2 rounded-full" />
              </div>
            </div>
          ))
        ) : animeList && animeList.length > 0 ? (
          animeList.map((anime, index) => (
            <AnimeCard 
              key={anime.id} 
              anime={{ ...anime, priority: index < 6 }} 
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-24 opacity-50">
            <Film className="w-32 h-32 mb-4 text-gray-700" />
            <p className="text-gray-400 text-lg font-bold">
              No anime found in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
