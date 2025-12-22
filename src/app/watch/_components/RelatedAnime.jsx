"use client";

import { useEffect, useState } from "react";
import AnimeCard from "@/components/features/anime/AnimeCard";

export default function RelatedAnime({ animeId, categories }) {
  const [relatedAnime, setRelatedAnime] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      setRelatedAnime([]);
      return;
    }

    const fetchRelated = async () => {
      setLoading(true);
      setError(null);
      setRelatedAnime([]);

      try {
        const categoryIds = categories.map((cat) => cat.id).join(",");
        if (!categoryIds) return;

        const url = `/api/v1/anime/${animeId}/related?categories=${categoryIds}`;

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch related anime: ${response.statusText}`
          );
        }

        const data = await response.json();
        setRelatedAnime(data.data || []);
      } catch (err) {
        console.error("Error fetching related anime:", err);
        setError("Could not load related anime.");
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [animeId, categories]);

  let content;
  if (loading) {
    content = (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white/5 rounded-xl overflow-hidden border border-white/5"
          >
            <div className="aspect-[2/3] bg-gray-700/50 animate-pulse"></div>
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-700/50 rounded animate-pulse w-3/4"></div>
              <div className="h-3 bg-gray-700/50 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  } else if (error) {
    content = <p className="text-gray-400 text-center">{error}</p>;
  } else if (relatedAnime.length === 0) {
    content = (
      <p className="text-gray-400 text-center">No related anime found.</p>
    );
  } else {
    content = (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {relatedAnime.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold text-white mb-4">Related Anime</h2>
      {content}
    </div>
  );
}
