"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, Search, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EpisodeSelector({
  episodes,
  currentEpisodeId,
  onSelectEpisode,
  anime,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [imgErrors, setImgErrors] = useState({});
  const [viewMode, setViewMode] = useState("list");

  if (!episodes || episodes.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Episodes</h3>
        <p className="text-gray-400 text-center py-4">
          No episodes available for this anime.
        </p>
      </div>
    );
  }

  const filteredEpisodes = episodes.filter((episode) => {
    const title =
      episode.attributes.canonicalTitle ||
      `Episode ${episode.attributes.number}`;
    const episodeNumber = episode.attributes.number?.toString() || "";

    return (
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      episodeNumber.includes(searchQuery)
    );
  });

  const handleImageError = (episodeId) => {
    setImgErrors((prev) => ({ ...prev, [episodeId]: true }));
  };

  return (
    <div className="bg-transparent h-full flex flex-col">
      <div className="p-4 border-b border-white/5">
        <h3 className="text-lg font-semibold text-white mb-4">Episodes</h3>

        {/* Search input and view toggle */}
        <div className="flex gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <label htmlFor="episode-search" className="sr-only">Search episodes</label>
            <Input
              id="episode-search"
              name="episode-search"
              className="pl-10 h-10 bg-white/5 border-white/5 rounded-xl focus-visible:ring-purple-500/50"
              placeholder="Search episodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("list")}
              className={`h-8 w-8 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("grid")}
              className={`h-8 w-8 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
        {filteredEpisodes.length === 0 ? (
          <p className="text-gray-400 text-center p-4">
            No episodes match your search.
          </p>
        ) : viewMode === "list" ? (
          <ul className="divide-y divide-white/5">
            {filteredEpisodes.map((episode) => {
              const isCurrentEpisode = episode.id === currentEpisodeId;
              const episodeNumber = episode.attributes.number;
              const title =
                episode.attributes.canonicalTitle || `Episode ${episodeNumber}`;
              const thumbnail =
                episode.attributes.thumbnail?.original ||
                anime.attributes.posterImage?.small;
              const hasImgError = imgErrors[episode.id];

              return (
                <li
                  key={episode.id}
                  className={`p-4 transition-all duration-300 cursor-pointer border-l-2 group ${
                    isCurrentEpisode
                      ? "bg-purple-600/10 border-purple-500"
                      : "border-transparent hover:bg-white/5"
                  }`}
                  onClick={() => onSelectEpisode(episode.attributes.number)}
                >
                  <div className="flex gap-3 md:gap-4">
                    <div className="relative w-24 h-14 md:w-32 md:h-20 rounded-lg md:rounded-xl flex-shrink-0 overflow-hidden border border-white/5">
                      {thumbnail && !hasImgError ? (
                        <Image
                          src={thumbnail}
                          alt={title}
                          fill
                          sizes="(max-width: 768px) 96px, 128px"
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={() => handleImageError(episode.id)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                          <span className="text-[8px] md:text-[10px] text-gray-500 uppercase">No Thumbnail</span>
                        </div>
                      )}

                      {isCurrentEpisode && (
                        <div className="absolute inset-0 bg-purple-600/40 flex items-center justify-center backdrop-blur-[1px]">
                          <Play className="h-4 w-4 md:h-6 md:w-6 text-white fill-white animate-pulse" />
                        </div>
                      )}
                    </div>

                    <div className="flex-grow min-w-0 flex flex-col justify-center gap-0.5">
                      <div className="flex items-center gap-1.5 md:gap-2 mb-0.5">
                        <span className={`text-[8px] md:text-[10px] font-black px-1 md:px-1.5 py-0.5 rounded ${isCurrentEpisode ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-400'}`}>
                          {episodeNumber}
                        </span>
                        <h4 className={`text-xs md:text-sm font-bold truncate ${isCurrentEpisode ? 'text-purple-400' : 'text-gray-300 group-hover:text-white'}`}>
                          {title}
                        </h4>
                      </div>
                      {episode.attributes.airdate && (
                        <p className="text-[8px] md:text-[10px] text-gray-500">
                          {new Date(episode.attributes.airdate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="grid grid-cols-2 gap-4 p-4">
            {filteredEpisodes.map((episode) => {
              const isCurrentEpisode = episode.id === currentEpisodeId;
              const episodeNumber = episode.attributes.number;
              const title =
                episode.attributes.canonicalTitle || `Episode ${episodeNumber}`;
              const thumbnail =
                episode.attributes.thumbnail?.original ||
                anime.attributes.posterImage?.small;
              const hasImgError = imgErrors[episode.id];

              return (
                <div
                  key={episode.id}
                  className={`group relative aspect-video bg-white/5 rounded-2xl overflow-hidden border transition-all cursor-pointer ${
                    isCurrentEpisode ? 'border-purple-500 ring-1 ring-purple-500' : 'border-white/5 hover:border-white/10'
                  }`}
                  onClick={() => onSelectEpisode(episode.attributes.number)}
                >
                  {thumbnail && !hasImgError ? (
                    <Image
                      src={thumbnail}
                      alt={title}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={() => handleImageError(episode.id)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800" />
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex items-center gap-1.5">
                       <span className="text-[10px] font-black bg-purple-600 text-white px-1 py-0.5 rounded">
                        EP {episodeNumber}
                      </span>
                      <h4 className="text-[10px] font-bold text-white truncate drop-shadow-md">
                        {title}
                      </h4>
                    </div>
                  </div>

                  {isCurrentEpisode && (
                    <div className="absolute inset-0 bg-purple-600/20 flex items-center justify-center">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
