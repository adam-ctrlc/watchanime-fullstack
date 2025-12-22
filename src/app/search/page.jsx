"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import queryString from "query-string";
import AnimeCard from "@/components/features/anime/AnimeCard";
import Select from "@/components/ui/Select";
import {
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { SearchX } from "lucide-react";

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q");

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "",
    ageRating: searchParams.get("ageRating") || "",
    season: searchParams.get("season") || "",
    year: searchParams.get("year") || "",
    sortBy: searchParams.get("sortBy") || "relevance",
  });
  const [originalResults, setOriginalResults] = useState([]);

  useEffect(() => {
    if (!query) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const baseUrl = "/api/v1/search";
        const params = {
          q: query,
          "page[limit]": "20",
        };
        const url = queryString.stringifyUrl({ url: baseUrl, query: params });

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Search failed: ${response.statusText}`);
        }

        const data = await response.json();
        setOriginalResults(data.data || []);
        setSearchResults(data.data || []);
      } catch (err) {
        console.error("Error searching anime:", err);
        setError(err.message || "Failed to search anime");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  useEffect(() => {
    if (!originalResults.length) return;

    let filtered = [...originalResults];

    if (filters.status) {
      filtered = filtered.filter(
        (anime) =>
          anime.attributes.status?.toLowerCase() ===
          filters.status.toLowerCase()
      );
    }

    if (filters.ageRating) {
      filtered = filtered.filter(
        (anime) => anime.attributes.ageRating === filters.ageRating
      );
    }

    if (filters.season) {
      filtered = filtered.filter(
        (anime) =>
          anime.attributes.season?.toLowerCase() ===
          filters.season.toLowerCase()
      );
    }

    if (filters.year) {
      filtered = filtered.filter((anime) => {
        const startDate = anime.attributes.startDate;
        if (!startDate) return false;
        const year = new Date(startDate).getFullYear();
        return year.toString() === filters.year;
      });
    }

    if (filters.sortBy === "rating") {
      filtered.sort((a, b) => {
        const ratingA = parseFloat(a.attributes.averageRating) || 0;
        const ratingB = parseFloat(b.attributes.averageRating) || 0;
        return ratingB - ratingA;
      });
    } else if (filters.sortBy === "year") {
      filtered.sort((a, b) => {
        const yearA = a.attributes.startDate
          ? new Date(a.attributes.startDate).getFullYear()
          : 0;
        const yearB = b.attributes.startDate
          ? new Date(b.attributes.startDate).getFullYear()
          : 0;
        return yearB - yearA;
      });
    } else if (filters.sortBy === "popularity") {
      filtered.sort((a, b) => {
        const popA = parseInt(a.attributes.popularityRank) || 999999;
        const popB = parseInt(b.attributes.popularityRank) || 999999;
        return popA - popB;
      });
    }

    setSearchResults(filtered);
  }, [filters, originalResults]);

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value,
    };

    setFilters(newFilters);

    const updatedParams = {
      q: query,
      ...newFilters,
    };

    Object.keys(updatedParams).forEach((key) => {
      if (key !== "q") {
        if (!updatedParams[key] || updatedParams[key] === "") {
          delete updatedParams[key];
        } else if (key === "sortBy" && updatedParams[key] === "relevance") {
          delete updatedParams[key];
        }
      }
    });

    console.log("Filter params:", updatedParams);

    const newUrl = queryString.stringifyUrl({
      url: "/search",
      query: updatedParams,
    });

    console.log("New URL:", newUrl);

    router.replace(newUrl);
  };

  const clearFilters = () => {
    const clearedFilters = {
      status: "",
      ageRating: "",
      season: "",
      year: "",
      sortBy: "relevance",
    };

    setFilters(clearedFilters);

    const newUrl = queryString.stringifyUrl({
      url: "/search",
      query: { q: query },
    });

    router.replace(newUrl);
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value && value !== "relevance"
  );

  const getUniqueYears = () => {
    const years = originalResults
      .map((anime) => {
        const startDate = anime.attributes.startDate;
        return startDate ? new Date(startDate).getFullYear() : null;
      })
      .filter((year) => year !== null)
      .sort((a, b) => b - a);
    return [...new Set(years)];
  };

  return (
    <div className="min-h-screen bg-transparent py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4 sm:mb-0 tracking-tight">
            {query ? (
              <>
                Results for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                  "{query}"
                </span>
              </>
            ) : (
              "Search Anime"
            )}
          </h1>

          {query && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                flex justify-between items-center gap-3 bg-black/20 text-white rounded-xl px-4 py-2.5 text-sm
                border border-white/10
                focus:ring-2 focus:ring-purple-500/50 focus:outline-none
                hover:bg-white/5 transition-all duration-200
                ${
                  showFilters
                    ? "ring-2 ring-purple-500/50 border-purple-500/50"
                    : ""
                }
              `}
            >
              <div className="flex items-center gap-2">
                <FunnelIcon className="h-4 w-4 text-gray-400" />
                <span
                  className={
                    !hasActiveFilters ? "text-gray-400" : "text-gray-100"
                  }
                >
                  Filters
                </span>
                {hasActiveFilters && (
                  <span className="bg-purple-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1">
                    {
                      Object.values(filters).filter(
                        (v) => v && v !== "relevance"
                      ).length
                    }
                  </span>
                )}
              </div>
              <ChevronDownIcon
                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ml-2 ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && query && (
          <div className="relative z-40 bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FunnelIcon className="h-5 w-5 text-purple-500" />
                Filter Options
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors group"
                >
                  <div className="bg-gray-800 p-1 rounded-full group-hover:bg-gray-700 transition-colors">
                    <XMarkIcon className="h-3 w-3" />
                  </div>
                  Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {/* Sort By */}
              {/* Sort By */}
              <Select
                id="sortBy"
                name="sortBy"
                label="Sort by"
                value={filters.sortBy}
                onChange={(value) => handleFilterChange("sortBy", value)}
                options={[
                  { value: "relevance", label: "Relevance" },
                  { value: "rating", label: "Rating" },
                  { value: "year", label: "Year" },
                  { value: "popularity", label: "Popularity" },
                ]}
              />

              {/* Status Filter */}
              <Select
                id="filterStatus"
                name="filterStatus"
                label="Status"
                value={filters.status}
                onChange={(value) => handleFilterChange("status", value)}
                placeholder="All"
                options={[
                  { value: "", label: "All" },
                  { value: "finished", label: "Finished" },
                  { value: "current", label: "Airing" },
                  { value: "upcoming", label: "Upcoming" },
                ]}
              />

              {/* Age Rating Filter */}
              <Select
                id="ageRating"
                name="ageRating"
                label="Age Rating"
                value={filters.ageRating}
                onChange={(value) => handleFilterChange("ageRating", value)}
                placeholder="All"
                options={[
                  { value: "", label: "All" },
                  { value: "G", label: "G - All Ages" },
                  { value: "PG", label: "PG - Children" },
                  { value: "PG13", label: "PG-13 - Teens 13+" },
                  { value: "R17", label: "R - 17+ (Violence)" },
                  { value: "R18", label: "R18+ - Adults Only" },
                ]}
              />

              {/* Season Filter */}
              <Select
                id="season"
                name="season"
                label="Season"
                value={filters.season}
                onChange={(value) => handleFilterChange("season", value)}
                placeholder="All"
                options={[
                  { value: "", label: "All" },
                  { value: "spring", label: "Spring" },
                  { value: "summer", label: "Summer" },
                  { value: "fall", label: "Fall" },
                  { value: "winter", label: "Winter" },
                ]}
              />

              {/* Year Filter */}
              <Select
                id="year"
                name="year"
                label="Year"
                value={filters.year}
                onChange={(value) => handleFilterChange("year", value)}
                placeholder="All"
                options={[
                  { value: "", label: "All" },
                  ...getUniqueYears().map((year) => ({
                    value: year.toString(),
                    label: year.toString(),
                  })),
                ]}
              />
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/5 relative flex flex-col animate-pulse"
              >
                <div className="relative w-full aspect-[2/3] bg-gray-700/50"></div>
                <div className="p-4 flex flex-col flex-grow space-y-3">
                  <div className="bg-gray-700/50 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-700/50 h-3 rounded w-1/2"></div>
                  <div className="flex justify-between mt-auto pt-2">
                    <div className="bg-gray-700/50 h-3 rounded w-16"></div>
                    <div className="bg-gray-700/50 h-3 rounded w-12"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-8 rounded-2xl max-w-lg text-center backdrop-blur-md">
              <h2 className="text-xl font-bold mb-2">Error Searching Anime</h2>
              <p className="opacity-80">{error}</p>
            </div>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-70">
            <SearchX className="w-24 h-24 mb-6 text-gray-700" />
            <p className="text-gray-400 text-xl font-medium mb-4">
              {query
                ? hasActiveFilters
                  ? `No results found for "${query}" with current filters.`
                  : `No results found for "${query}".`
                : "Enter a search term to discover anime."}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors border-b border-purple-400/30 hover:border-purple-300"
              >
                Clear filters to see all results
              </button>
            )}
          </div>
        ) : (
          <div>
            {/* Results count */}
            {query && (
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-400 text-sm font-medium">
                  Found{" "}
                  <span className="text-white font-bold">
                    {searchResults.length}
                  </span>{" "}
                  result
                  {searchResults.length !== 1 ? "s" : ""}
                  {hasActiveFilters &&
                    ` (filtered from ${originalResults.length})`}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {searchResults.map((anime, index) => (
                <AnimeCard
                  key={anime.id}
                  anime={{ ...anime, priority: index < 6 }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-transparent py-24">
          <div className="container mx-auto px-4">
            <div className="h-10 bg-gray-800 rounded-xl mb-8 animate-pulse w-64"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-xl overflow-hidden border border-white/5 relative flex flex-col animate-pulse aspect-[2/3]"
                ></div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
