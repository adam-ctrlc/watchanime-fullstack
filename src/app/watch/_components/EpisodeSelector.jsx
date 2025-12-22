"use client";

import { useState } from "react";
import Image from "next/image";
import { PlayIcon } from "@heroicons/react/24/solid";
import {
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";

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
        <div className="flex gap-3 mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="episode-search"
              className="bg-white/5 text-white w-full pl-10 pr-4 py-2 rounded-lg border border-white/5 focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 focus:outline-none placeholder-gray-500 transition-all"
              placeholder="Search episodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* View mode toggle */}
          <div className="flex bg-white/5 rounded-lg p-1 border border-white/5">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded transition-all duration-300 ${
                viewMode === "list"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
              aria-label="List view"
            >
              <ListBulletIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded transition-all duration-300 ${
                viewMode === "grid"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
              aria-label="Grid view"
            >
              <Squares2X2Icon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        {filteredEpisodes.length === 0 ? (
          <p className="text-gray-400 text-center p-4">
            No episodes match your search.
          </p>
        ) : viewMode === "list" ? (
          <ul className="divide-y divide-gray-700">
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
                  className={`p-3 transition-all duration-300 cursor-pointer border-l-2 group ${
                    isCurrentEpisode
                      ? "bg-gradient-to-r from-purple-900/40 to-transparent border-purple-500 shadow-[inset_0_0_20px_rgba(168,85,247,0.1)]"
                      : "border-transparent hover:bg-white/5 hover:border-white/10"
                  }`}
                  onClick={() => onSelectEpisode(episode.attributes.number)}
                >
                  <div className="flex gap-3">
                    {/* Episode thumbnail */}
                    <div
                      className={`relative w-28 h-16 rounded-lg flex-shrink-0 overflow-hidden border transition-colors duration-300 ${
                        isCurrentEpisode
                          ? "border-purple-500/50 shadow-lg shadow-purple-900/20"
                          : "bg-gray-800/50 border-white/5 group-hover:border-white/20"
                      }`}
                    >
                      {thumbnail && !hasImgError ? (
                        <Image
                          src={thumbnail}
                          alt={title}
                          fill
                          sizes="96px"
                          className="object-cover"
                          onError={() => handleImageError(episode.id)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xs text-gray-500">
                            No image
                          </span>
                        </div>
                      )}

                      {/* Play overlay for current episode */}
                      {isCurrentEpisode && (
                        <div className="absolute inset-0 bg-purple-900/30 flex items-center justify-center backdrop-blur-[2px]">
                          <div className="bg-purple-600 rounded-full p-1 shadow-lg shadow-purple-500/50 animate-pulse">
                            <PlayIcon className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Episode info */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center">
                        <span
                          className={`text-xs font-bold rounded px-2 py-0.5 mr-2 transition-colors ${
                            isCurrentEpisode
                              ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30"
                              : "bg-white/10 text-gray-400 group-hover:text-gray-200"
                          }`}
                        >
                          {episodeNumber}
                        </span>
                        <h4
                          className={`text-sm font-medium truncate transition-colors ${
                            isCurrentEpisode
                              ? "text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]"
                              : "text-gray-300 group-hover:text-white"
                          }`}
                        >
                          {title}
                        </h4>
                      </div>

                      {episode.attributes.airdate && (
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(
                            episode.attributes.airdate
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-3">
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
                  className={`relative bg-white/5 rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer group ${
                    isCurrentEpisode
                      ? "ring-1 ring-purple-500 border-purple-500/50"
                      : "border-transparent hover:border-white/10 hover:bg-white/10"
                  }`}
                  onClick={() => onSelectEpisode(episode.attributes.number)}
                >
                  {/* Episode thumbnail */}
                  <div className="relative aspect-video bg-gray-800/50">
                    {thumbnail && !hasImgError ? (
                      <Image
                        src={thumbnail}
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={() => handleImageError(episode.id)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs text-gray-500">No image</span>
                      </div>
                    )}

                    {/* Play overlay for current episode */}
                    {isCurrentEpisode && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                        <PlayIcon className="h-8 w-8 text-white drop-shadow-md" />
                      </div>
                    )}

                    {/* Episode number badge */}
                    <div className="absolute top-2 left-2">
                      <span className="text-[10px] font-bold bg-black/60 backdrop-blur-sm rounded-md px-1.5 py-0.5 text-white border border-white/10">
                        EP {episodeNumber}
                      </span>
                    </div>
                  </div>

                  {/* Episode info */}
                  <div className="p-2.5">
                    <h4
                      className={`text-xs font-medium truncate mb-1 ${
                        isCurrentEpisode
                          ? "text-purple-300"
                          : "text-gray-200 group-hover:text-white"
                      }`}
                    >
                      {title}
                    </h4>
                    {episode.attributes.airdate && (
                      <p className="text-[10px] text-gray-500 group-hover:text-gray-400">
                        {new Date(
                          episode.attributes.airdate
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
