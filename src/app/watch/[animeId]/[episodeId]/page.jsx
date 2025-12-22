"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import EpisodePlayer from "@/app/watch/_components/EpisodePlayer";
import EpisodeInfo from "@/app/watch/_components/EpisodeInfo";
import EpisodeSelector from "@/app/watch/_components/EpisodeSelector";
import ErrorDisplay from "@/components/status/ErrorDisplay";
import RelatedAnime from "@/app/watch/_components/RelatedAnime";
import Characters from "@/app/watch/_components/Characters";

export default function WatchEpisodePage() {
  const params = useParams();
  const router = useRouter();
  const { animeId, episodeId: initialEpisodeId } = params;

  const [anime, setAnime] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [episodeLoading, setEpisodeLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimeAndEpisodes = async () => {
      setLoading(true);
      setError(null);
      setAnime(null);
      setEpisodes([]);
      setCurrentEpisode(null);
      setCategories([]);
      setCharacters([]);

      try {
        const animeResponse = await fetch(
          `/api/v1/anime/${animeId}?include=categories`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!animeResponse.ok) {
          throw new Error(`Failed to fetch anime: ${animeResponse.statusText}`);
        }
        const animeData = await animeResponse.json();
        setAnime(animeData.data);

        const categoriesResponse = await fetch(
          `/api/v1/anime/${animeId}/categories`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!categoriesResponse.ok) {
          console.error(
            `Failed to fetch categories: ${categoriesResponse.statusText}`
          );
        } else {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData.data || []);
        }

        const episodesResponse = await fetch(
          `/api/v1/anime/${animeId}/episodes`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!episodesResponse.ok) {
          throw new Error(
            `Failed to fetch episodes: ${episodesResponse.statusText}`
          );
        }
        const episodesData = await episodesResponse.json();
        const allEpisodes = episodesData.data;
        setEpisodes(allEpisodes);

        const charactersResponse = await fetch(
          `/api/v1/anime/${animeId}/characters`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!charactersResponse.ok) {
          console.error(
            `Failed to fetch characters: ${charactersResponse.statusText}`
          );
        } else {
          const charactersData = await charactersResponse.json();
          const charactersWithData = charactersData.data || [];
          const includedCharacters = charactersData.included || [];

          const enrichedCharacters = charactersWithData.map((charRelation) => {
            const characterId = charRelation.relationships?.character?.data?.id;
            const characterData = includedCharacters.find(
              (inc) => inc.id === characterId
            );
            return {
              ...charRelation,
              characterData,
            };
          });

          setCharacters(enrichedCharacters);
        }

        const initialEpisode = allEpisodes.find(
          (ep) => ep.attributes.number === parseInt(initialEpisodeId)
        );

        if (initialEpisode) {
          setCurrentEpisode(initialEpisode);
        } else {
          if (allEpisodes.length > 0) {
            setCurrentEpisode(allEpisodes[0]);
            const firstEpisodeNumber = allEpisodes[0].attributes.number;
            const correctUrl = `/watch/${animeId}/${firstEpisodeNumber}`;
            router.replace(correctUrl, undefined, { shallow: true });
          } else {
            throw new Error(`Anime has no episodes.`);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (animeId) {
      fetchAnimeAndEpisodes();
    }
  }, [animeId, router, initialEpisodeId]);

  useEffect(() => {
    const handlePopState = () => {
      const urlParts = window.location.pathname.split("/");
      const currentEpisodeId = urlParts[urlParts.length - 1];

      if (episodes.length > 0 && currentEpisodeId) {
        const newEpisode = episodes.find(
          (ep) => ep.attributes.number === parseInt(currentEpisodeId)
        );

        if (newEpisode && newEpisode.id !== currentEpisode?.id) {
          setEpisodeLoading(true);

          setCurrentEpisode(newEpisode);

          setTimeout(() => {
            setEpisodeLoading(false);
          }, 300);
        }
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [episodes, currentEpisode]);

  const handleSelectEpisode = (selectedEpisodeNumber) => {
    const newEpisode = episodes.find(
      (ep) => ep.attributes.number === selectedEpisodeNumber
    );

    if (newEpisode && newEpisode.id !== currentEpisode?.id) {
      setEpisodeLoading(true);

      setCurrentEpisode(newEpisode);

      const newUrl = `/watch/${animeId}/${selectedEpisodeNumber}`;
      window.history.pushState({}, "", newUrl);

      setTimeout(() => {
        setEpisodeLoading(false);
      }, 300);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="h-10 bg-gray-800/50 rounded-xl animate-pulse mb-8 w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl aspect-video animate-pulse border border-white/5"></div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
                <div className="h-6 bg-gray-700/50 rounded animate-pulse mb-4 w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-700/50 rounded animate-pulse w-3/4"></div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
                <div className="h-6 bg-gray-700/50 rounded animate-pulse mb-6 w-1/3"></div>
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-14 bg-gray-700/50 rounded-xl animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        title="Error Loading Episode"
        message={error}
        retryAction={() => router.push("/")}
        retryText="Back to Home"
      />
    );
  }

  if (!anime || !currentEpisode) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-white/70 font-medium text-lg">
        Data missing, but not in loading or error state.
      </div>
    );
  }

  const title =
    anime.attributes.titles?.en ||
    anime.attributes.titles?.en_jp ||
    anime.attributes.canonicalTitle;

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Title Section */}
        <h1 className="text-3xl md:text-4xl font-black text-white mb-8 tracking-tight drop-shadow-lg">
          {title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content: Player & Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/20 ring-1 ring-white/10 bg-black/40 backdrop-blur-sm">
              {episodeLoading ? (
                <div className="bg-gray-800/50 aspect-video animate-pulse flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <EpisodePlayer episode={currentEpisode} anime={anime} />
              )}
            </div>
            <div className="bg-[#121212]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-1 shadow-xl">
              <EpisodeInfo episode={currentEpisode} anime={anime} />
            </div>
          </div>

          {/* Sidebar: Episode Selector */}
          <div className="lg:col-span-1">
            <div className="bg-[#121212]/60 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden shadow-xl h-full max-h-[800px] sticky top-24">
              <EpisodeSelector
                episodes={episodes}
                currentEpisodeId={currentEpisode.id}
                onSelectEpisode={handleSelectEpisode}
                anime={anime}
              />
            </div>
          </div>
        </div>

        {/* Characters Section */}
        <div className="mb-12">
          <Characters characters={characters} />
        </div>

        {/* Related Anime Section */}
        {categories.length > 0 && (
          <div className="mt-12">
            <RelatedAnime animeId={animeId} categories={categories} />
          </div>
        )}
      </div>
    </div>
  );
}
