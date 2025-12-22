"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import AnimeCard from "./AnimeCard";
import LoadingSpinner from "@/components/status/LoadingSpinner";
import Pagination from "@/components/ui/Pagination";

export default function AnimePaginatedList({
  title,
  endpoint,
  apiParams = {},
  itemsPerPage = 20,
}) {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const currentPage = parseInt(pageParam || "1", 10);

  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: currentPage,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const fetchKey = `${endpoint}-${JSON.stringify(apiParams)}-${currentPage}`;

  const fetchAnimeList = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Use local API base path
      const url = new URL(endpoint, window.location.origin + "/api/v1");

      url.searchParams.append("page[limit]", itemsPerPage.toString());
      url.searchParams.append(
        "page[offset]",
        ((currentPage - 1) * itemsPerPage).toString()
      );

      Object.entries(apiParams).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          Object.entries(value).forEach(([nestedKey, nestedValue]) => {
            url.searchParams.append(`filter[${nestedKey}]`, nestedValue);
          });
        } else {
          url.searchParams.append(key, value);
        }
      });

      const response = await fetch(url.toString(), {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch anime: ${response.statusText}`);
      }

      const data = await response.json();
      setAnimeList(data.data || []);

      const total = data.meta?.count || 0;
      const totalPages = Math.ceil(total / itemsPerPage) || 1;

      setPagination({
        currentPage: currentPage,
        totalPages: totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      });
    } catch (err) {
      console.error("Error fetching anime list:", err);
      setError(err.message || "Failed to load anime");
    } finally {
      setLoading(false);
    }
  }, [endpoint, apiParams, currentPage, itemsPerPage, fetchKey]);

  useEffect(() => {
    fetchAnimeList();
  }, [fetchAnimeList]);

  const showLoadingState = loading && animeList.length === 0;

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
          {title}
        </h1>

        {showLoadingState ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <LoadingSpinner size="large" />
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-500 text-white p-6 rounded-lg max-w-lg mx-auto text-center">
            <h2 className="text-xl font-bold mb-3">Error</h2>
            <p>{error}</p>
          </div>
        ) : animeList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No anime found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {animeList.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>

            {loading && !showLoadingState && (
              <div className="flex justify-center my-4">
                <LoadingSpinner size="small" />
              </div>
            )}

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              hasNextPage={pagination.hasNextPage}
              hasPreviousPage={pagination.hasPreviousPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
