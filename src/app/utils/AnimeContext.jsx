"use client";

import React, { createContext, useContext } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/api";

const AnimeContext = createContext({
  trendingAnime: [],
  popularAnime: [],
  topRatedAnime: [],
  upcomingAnime: [],
  loading: true,
  error: null,
  fetchData: () => {},
});

export const AnimeProvider = ({ children }) => {
  // 1. Trending
  const {
    data: trendingAnime,
    error: trendingError,
    mutate: mutateTrending,
  } = useSWR("/anime/trending?limit=10", fetcher);

  // 2. Popular
  const {
    data: popularAnime,
    error: popularError,
    mutate: mutatePopular,
  } = useSWR("/popular?page[limit]=10", fetcher);

  // 3. Top Rated
  const {
    data: topRatedAnime,
    error: topRatedError,
    mutate: mutateTopRated,
  } = useSWR("/top-rated?page[limit]=10", fetcher);

  // 4. Upcoming
  const {
    data: upcomingAnime,
    error: upcomingError,
    mutate: mutateUpcoming,
  } = useSWR("/upcoming?page[limit]=10", fetcher);

  const loading =
    (!trendingAnime && !trendingError) ||
    (!popularAnime && !popularError) ||
    (!topRatedAnime && !topRatedError) ||
    (!upcomingAnime && !upcomingError);

  const error = trendingError || popularError || topRatedError || upcomingError;
  const errorMessage = error
    ? error.message || "An unknown error occurred while fetching data."
    : null;

  const fetchData = () => {
    mutateTrending();
    mutatePopular();
    mutateTopRated();
    mutateUpcoming();
  };

  const value = {
    trendingAnime: trendingAnime || [],
    popularAnime: popularAnime?.data || popularAnime || [],
    topRatedAnime: topRatedAnime?.data || topRatedAnime || [],
    upcomingAnime: upcomingAnime?.data || upcomingAnime || [],
    loading,
    error: errorMessage,
    fetchData,
  };

  return (
    <AnimeContext.Provider value={value}>{children}</AnimeContext.Provider>
  );
};

export const useAnimeContext = () => {
  const context = useContext(AnimeContext);
  if (context === undefined) {
    throw new Error("useAnimeContext must be used within an AnimeProvider");
  }
  return context;
};
