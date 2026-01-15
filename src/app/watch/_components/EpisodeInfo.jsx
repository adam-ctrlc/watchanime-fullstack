"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function EpisodeInfo({ episode, anime }) {
  const [imgError, setImgError] = useState(false);

  if (!episode || !anime) return null;

  const { canonicalTitle, synopsis, thumbnail, airdate, length } =
    episode.attributes;

  const episodeNumber = episode.attributes.number;
  const episodeTitle = canonicalTitle || `Episode ${episodeNumber}`;
  const formattedAirdate = airdate
    ? new Date(airdate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : "Unknown";
  const thumbnailUrl =
    thumbnail?.original || anime.attributes.posterImage?.large;

  return (
    <div className="bg-transparent rounded-2xl overflow-hidden p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Episode thumbnail */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
          <div className="relative aspect-video bg-black/40 border border-white/10 rounded-xl md:rounded-2xl overflow-hidden shadow-2xl group">
            {thumbnailUrl && !imgError ? (
              <Image
                src={thumbnailUrl}
                alt={episodeTitle}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-500 text-[10px] md:text-sm font-medium uppercase">No Thumbnail</span>
              </div>
            )}
            <div className="absolute top-2 left-2">
              <Badge className="bg-purple-600 text-white border-none font-black px-1.5 md:px-2 py-0.5 text-[10px] md:text-xs">
                EP {episodeNumber}
              </Badge>
            </div>
          </div>
        </div>

        {/* Episode info */}
        <div className="flex-grow flex flex-col gap-3 md:gap-4">
          <div className="flex flex-col gap-1 md:gap-2">
            <h2 className="text-xl md:text-3xl font-black text-white tracking-tight leading-tight">
              {episodeTitle}
            </h2>
            <div className="flex flex-wrap gap-3 md:gap-4 text-[10px] md:text-xs font-medium text-gray-400">
              {airdate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 md:h-4 md:w-4 text-purple-400" />
                  <span>{formattedAirdate}</span>
                </div>
              )}
              {length && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 md:h-4 md:w-4 text-purple-400" />
                  <span>{length} min</span>
                </div>
              )}
            </div>
          </div>

          <div className="h-px bg-white/5 w-full" />

          {synopsis ? (
            <p className="text-gray-400 text-xs md:text-base leading-relaxed line-clamp-4 md:line-clamp-6">
              {synopsis}
            </p>
          ) : (
            <p className="text-gray-500 italic text-[10px] md:text-sm">
              No description available for this episode.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
