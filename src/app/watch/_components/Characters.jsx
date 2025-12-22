"use client";

import { useState } from "react";
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
    <div className="bg-[#121212]/40 backdrop-blur-lg border border-white/5 rounded-2xl p-6 mt-8 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Characters</h2>
        <button
          onClick={toggleSortOrder}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          title={`Sort ${sortOrder === "asc" ? "descending" : "ascending"}`}
        >
          {sortOrder === "asc" ? (
            <>
              <ArrowUpAZ className="h-5 w-5" />
              <span className="text-sm">A-Z</span>
            </>
          ) : (
            <>
              <ArrowDownZA className="h-5 w-5" />
              <span className="text-sm">Z-A</span>
            </>
          )}
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
              <div className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-3 h-full flex flex-col transition-all duration-300 hover:scale-[1.02] cursor-default group shadow-sm hover:shadow-purple-900/10">
                <div className="w-16 h-20 mx-auto mb-3 bg-black/40 rounded-lg overflow-hidden shadow-inner">
                  {image ? (
                    <img
                      src={image}
                      alt={name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ display: image ? "none" : "flex" }}
                  >
                    <span className="text-xs text-gray-400">No Image</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p
                    className="text-sm text-white font-medium mb-1 line-clamp-2"
                    title={name}
                  >
                    {name}
                  </p>
                  <p
                    className={`text-xs capitalize font-medium ${getRoleColor(
                      role
                    )}`}
                  >
                    {role}
                  </p>
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
