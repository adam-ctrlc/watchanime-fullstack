"use client";

import { useEffect, useState } from "react";
import AnimeCard from "@/components/features/anime/AnimeCard";
import { Skeleton } from "@/components/ui/skeleton";

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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col gap-4">
            <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-3/4 rounded-full" />
              <Skeleton className="h-3 w-1/2 rounded-full" />
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {relatedAnime.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-8 md:mt-12">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 tracking-tight">Related Anime</h2>
      {content}
    </div>
  );
}
