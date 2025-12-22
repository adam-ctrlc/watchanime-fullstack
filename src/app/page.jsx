"use client";

import Hero from "@/components/layout/Hero";
import AnimeSection from "@/components/features/anime/AnimeSection";
import LoadingSpinner from "@/components/status/LoadingSpinner";
import { useAnimeContext } from "@/app/utils/AnimeContext";

export default function Home() {
  const {
    trendingAnime,
    popularAnime,
    topRatedAnime,
    upcomingAnime,
    loading,
    error,
    fetchData,
  } = useAnimeContext();

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-8 rounded-2xl max-w-lg text-center backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-3 text-red-50">
            Error Loading Anime Data
          </h2>
          <p className="mb-6 opacity-80">{error}</p>
          <button
            onClick={fetchData}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const initialLoading =
    loading &&
    !trendingAnime?.length &&
    !popularAnime?.length &&
    !topRatedAnime?.length &&
    !upcomingAnime?.length;

  return (
    <div className="min-h-screen bg-transparent text-gray-100">
      <div id="hero" className="p-4 md:p-6 lg:p-8 pb-0">
        <div className="rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/20 ring-1 ring-white/10">
          <Hero featuredAnime={trendingAnime?.slice(0, 5) || []} />
        </div>
      </div>

      <div className="py-12 space-y-12">
        <div id="trending">
          <AnimeSection
            title="Trending Now"
            animeList={trendingAnime}
            viewMoreLink="/trending"
            loading={loading}
          />
        </div>

        <div id="popular">
          <AnimeSection
            title="Most Popular"
            animeList={popularAnime}
            viewMoreLink="/popular"
            loading={loading}
          />
        </div>

        <div id="top-rated">
          <AnimeSection
            title="Top Rated"
            animeList={topRatedAnime}
            viewMoreLink="/top-rated"
            loading={loading}
          />
        </div>

        <div id="upcoming">
          <AnimeSection
            title="Upcoming Releases"
            animeList={upcomingAnime}
            viewMoreLink="/upcoming"
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
