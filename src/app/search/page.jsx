"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import queryString from "query-string";
import AnimeCard from "@/components/features/anime/AnimeCard";
import Select from "@/components/ui/Select";
import { Button } from "@/components/ui/button";
import { Filter, X, Search as SearchIcon } from "lucide-react";

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

    const newUrl = queryString.stringifyUrl({
      url: "/search",
      query: updatedParams,
    });

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
    <div className="min-h-screen bg-transparent py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
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
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant={showFilters ? "secondary" : "outline"}
              className={`h-12 px-6 rounded-xl border-white/10 gap-2 ${showFilters ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-500/50' : 'bg-black/20 text-gray-300 hover:bg-white/5'}`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="bg-white text-purple-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-2">
                  {Object.values(filters).filter((v) => v && v !== "relevance").length}
                </span>
              )}
            </Button>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && query && (
          <div className="bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8 shadow-2xl animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Filter className="h-5 w-5 text-purple-500" />
                Filter Options
              </h2>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-400 hover:text-white hover:bg-white/5 h-8 rounded-lg"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear all
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <Select
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

              <Select
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

              <Select
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

              <Select
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

              <Select
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-4">
                <div className="aspect-[2/3] bg-white/5 rounded-2xl animate-pulse" />
                <div className="flex flex-col gap-2">
                  <div className="h-4 bg-white/5 rounded-full animate-pulse w-3/4" />
                  <div className="h-3 bg-white/5 rounded-full animate-pulse w-1/2" />
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
          <div className="flex flex-col items-center justify-center py-32 opacity-70">
            <SearchIcon className="w-24 h-24 mb-6 text-gray-700" />
            <p className="text-gray-400 text-xl font-medium mb-4">
              {query
                ? hasActiveFilters
                  ? `No results found for "${query}" with current filters.`
                  : `No results found for "${query}".`
                : "Enter a search term to discover anime."}
            </p>
            {hasActiveFilters && (
              <Button
                variant="link"
                onClick={clearFilters}
                className="text-purple-400 hover:text-purple-300 font-medium h-auto p-0"
              >
                Clear filters to see all results
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {query && (
              <p className="text-gray-400 text-sm font-medium">
                Found{" "}
                <span className="text-white font-bold">{searchResults.length}</span>{" "}
                result{searchResults.length !== 1 ? "s" : ""}
                {hasActiveFilters && ` (filtered from ${originalResults.length})`}
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
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
        <div className="min-h-screen pt-32">
          <div className="container mx-auto px-4">
            <div className="h-12 bg-white/5 rounded-xl mb-8 animate-pulse w-64"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="aspect-[2/3] bg-white/5 rounded-2xl animate-pulse" />
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
