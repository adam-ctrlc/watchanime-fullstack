"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PlayCircleIcon, StarIcon } from "@heroicons/react/24/solid";

export default function AnimeCard({ anime }) {
  const [imgError, setImgError] = useState(false);

  if (!anime || !anime.attributes) {
    return null;
  }

  const title =
    anime.attributes.titles?.en ||
    anime.attributes.titles?.en_jp ||
    anime.attributes.canonicalTitle;
  const imageUrl =
    anime.attributes.posterImage?.small || anime.attributes.posterImage?.tiny;
  const rating = anime.attributes.averageRating
    ? (parseFloat(anime.attributes.averageRating) / 10).toFixed(1)
    : "N/A";
  const episodeCount = anime.attributes.episodeCount;
  const showType = anime.attributes.showType;
  const synopsis =
    anime.attributes.synopsis?.substring(0, 60) +
    (anime.attributes.synopsis?.length > 60 ? "..." : "");

  return (
    <div className="group relative flex flex-col gap-2">
      <Link
        href={`/watch/${anime.id}/1`}
        className="block relative w-full aspect-[2/3] overflow-hidden rounded-xl bg-gray-800"
      >
        {!imgError && imageUrl ? (
          <Image
            src={imageUrl}
            alt={title || "Anime Poster"}
            fill
            priority={anime.priority}
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 15vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => {
              setImgError(true);
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
            Image unavailable
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {!imgError && imageUrl && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100">
            <div className="bg-purple-600/90 text-white rounded-full p-3 backdrop-blur-sm">
              <PlayCircleIcon className="h-8 w-8" />
            </div>
          </div>
        )}

        {rating !== "N/A" && (
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-lg text-xs font-medium flex items-center gap-1">
            <StarIcon className="h-3 w-3 text-yellow-400" />
            <span>{rating}</span>
          </div>
        )}
      </Link>

      <div className="flex flex-col gap-1">
        <Link href={`/watch/${anime.id}/1`}>
          <h3
            className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors line-clamp-1"
            title={title}
          >
            {title || "Untitled Anime"}
          </h3>
        </Link>
        <div className="flex items-center justify-between text-xs text-gray-500">
          {showType && <span>{showType.toUpperCase()}</span>}
          {episodeCount && <span>{episodeCount} EPS</span>}
        </div>
      </div>
    </div>
  );
}
