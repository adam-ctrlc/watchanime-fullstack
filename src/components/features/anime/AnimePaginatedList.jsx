"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import AnimeCard from "./AnimeCard";
import Pagination from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorDisplay from "@/components/status/ErrorDisplay";

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

  const apiParamsString = JSON.stringify(apiParams);

  const fetchAnimeList = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const apiPath = `/api/v1${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;
      const url = new URL(apiPath, window.location.origin);

      // Add common pagination params
      url.searchParams.append("page[limit]", itemsPerPage.toString());
      url.searchParams.append(
        "page[offset]",
        ((currentPage - 1) * itemsPerPage).toString()
      );

      // Also add 'limit' for APIs that don't use page[limit]
      url.searchParams.append("limit", itemsPerPage.toString());

      const paramsObj = apiParamsString ? JSON.parse(apiParamsString) : {};

      Object.entries(paramsObj).forEach(([key, value]) => {
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
      
      // Robustly handle different response formats
      const list = Array.isArray(data) ? data : (data.data || []);
      setAnimeList(list);

      const total = data.meta?.count || (Array.isArray(data) ? data.length : list.length);
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
  }, [endpoint, apiParamsString, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchAnimeList();
  }, [fetchAnimeList]);

  const showLoadingState = loading && animeList.length === 0;

  return (
    <div className="min-h-screen bg-transparent py-24 md:py-32">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-5xl font-black text-white mb-12 tracking-tight">
          {title}
        </h1>

        {showLoadingState ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-4">
                <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-3/4 rounded-full" />
                  <Skeleton className="h-3 w-1/2 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorDisplay title="Error" message={error} retryAction={fetchAnimeList} />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {animeList.map((anime, index) => (
                <AnimeCard 
                  key={anime.id} 
                  anime={{ ...anime, priority: index < 6 }} 
                />
              ))}
            </div>

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
