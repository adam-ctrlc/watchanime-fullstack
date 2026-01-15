"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpAZ, ArrowDownZA, UserX } from "lucide-react";


export default function Characters({ characters }) {
  const [showMore, setShowMore] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");

  if (!characters || characters.length === 0) {
    return (
      <div className="bg-[#121212]/40 backdrop-blur-lg border border-white/5 rounded-2xl p-6 mt-8 text-center shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4">Characters</h2>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <UserX className="w-16 h-16 mx-auto mb-4 opacity-50" />
          </div>
          <p className="text-gray-300 text-lg mb-2">
            No Character Information Available
          </p>
          <p className="text-gray-500 text-sm">
            Character details for this anime haven't been added to the database
            yet. Check back later or explore other episodes!
          </p>
        </div>
      </div>
    );
  }

  const sortedCharacters = [...characters].sort((a, b) => {
    const nameA = a.characterData?.attributes?.name || "Unknown Character";
    const nameB = b.characterData?.attributes?.name || "Unknown Character";
    return sortOrder === "asc"
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  const displayedCharacters = showMore
    ? sortedCharacters
    : sortedCharacters.slice(0, 6);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="bg-[#121212]/40 backdrop-blur-lg border border-white/5 rounded-2xl p-4 md:p-6 mt-8 shadow-xl">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Characters</h2>
        <button
          onClick={toggleSortOrder}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-white/5 px-2 py-1 rounded-lg"
          title={`Sort ${sortOrder === "asc" ? "descending" : "ascending"}`}
        >
          {sortOrder === "asc" ? (
            <>
              <ArrowUpAZ className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">A-Z</span>
            </>
          ) : (
            <>
              <ArrowDownZA className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Z-A</span>
            </>
          )}
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {displayedCharacters.map((character) => {
          const characterData = character.characterData;
          const role = character.attributes?.role || "Unknown";
          const name = characterData?.attributes?.name || "Unknown Character";
          const image = characterData?.attributes?.image?.original;


          const getRoleColor = (role) => {
            switch (role.toLowerCase()) {
              case "main":
                return "text-blue-400";
              case "supporting":
                return "text-green-400";
              case "recurring":
                return "text-yellow-400";
              case "background":
                return "text-gray-500";
              default:
                return "text-gray-400";
            }
          };

          return (
            <div key={character.id} className="text-center">
              <div className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-2 md:p-3 h-full flex flex-col transition-all duration-300 hover:scale-[1.02] cursor-default group shadow-sm hover:shadow-purple-900/10">
                <div className="w-14 h-18 md:w-16 md:h-20 mx-auto mb-2 md:mb-3 bg-black/40 rounded-lg overflow-hidden shadow-inner relative">
                  {image ? (
                    <Image
                      src={image}
                      alt={name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 56px, 64px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[10px] text-gray-400">?</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col gap-0.5 md:gap-1">
                  <p
                    className="text-xs md:text-sm text-white font-medium line-clamp-1 md:line-clamp-2 leading-tight"
                    title={name}
                  >
                    {name}
                  </p>
                  <p
                    className={`text-[10px] md:text-xs capitalize font-bold ${getRoleColor(
                      role
                    )}`}
                  >
                    {role}
                  </p>
                  {character.voiceActors?.length > 0 && (
                    <div className="mt-2.5 pt-2.5 border-t border-white/5 flex items-center justify-center gap-2">
                      {character.voiceActors[0].attributes?.url ? (
                        <a 
                          href={character.voiceActors[0].attributes.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 group/va min-w-0"
                        >
                          {character.voiceActors[0].attributes?.image && (
                            <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0 border border-white/10 shadow-sm group-hover/va:border-purple-500/50 transition-colors">
                              <Image
                                src={character.voiceActors[0].attributes.image}
                                alt={character.voiceActors[0].attributes.name}
                                fill
                                className="object-cover"
                                sizes="24px"
                              />
                            </div>
                          )}
                          <p className="text-[9px] md:text-[10px] text-gray-400 truncate font-bold leading-tight group-hover/va:text-purple-400 transition-colors max-w-[80px]">
                            {character.voiceActors[0].attributes?.name}
                          </p>
                        </a>
                      ) : (
                        <div className="flex items-center justify-center gap-2 min-w-0">
                          {character.voiceActors[0].attributes?.image && (
                            <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0 border border-white/10 shadow-sm">
                              <Image
                                src={character.voiceActors[0].attributes.image}
                                alt={character.voiceActors[0].attributes.name}
                                fill
                                className="object-cover"
                                sizes="24px"
                              />
                            </div>
                          )}
                          <p className="text-[9px] md:text-[10px] text-gray-400 truncate font-bold leading-tight max-w-[80px]">
                            {character.voiceActors[0].attributes?.name}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {characters.length > 6 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowMore(!showMore)}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            {showMore
              ? "Show Less"
              : `Show All ${characters.length} Characters`}
          </button>
        </div>
      )}
    </div>
  );
}
