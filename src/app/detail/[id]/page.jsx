"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PlayCircleIcon, StarIcon, CalendarIcon, FilmIcon, ClockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorDisplay from "@/components/status/ErrorDisplay";
import RelatedAnime from "@/app/watch/_components/RelatedAnime";
import Characters from "@/app/watch/_components/Characters";
import Franchise from "@/app/watch/_components/Franchise";
import Reviews from "@/app/watch/_components/Reviews";
import StreamingLinks from "@/app/watch/_components/StreamingLinks";
import AnimeQuotes from "@/app/watch/_components/AnimeQuotes";

export default function AnimeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [anime, setAnime] = useState(null);
  const [categories, setCategories] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const animeResponse = await fetch(`/api/v1/anime/${id}?include=categories`);
        if (!animeResponse.ok) throw new Error("Failed to fetch anime details");
        const animeData = await animeResponse.json();
        setAnime(animeData.data);

        const [catRes, charRes, prodRes, extRes] = await Promise.all([
          fetch(`/api/v1/anime/${id}/categories`),
          fetch(`/api/v1/anime/${id}/characters`),
          fetch(`/api/v1/anime/${id}/productions`),
          fetch(`/api/v1/anime/${id}/external-ids`),
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.data || []);
        }

        let kitsuCharacters = [];
        if (charRes.ok) {
          const charData = await charRes.json();
          const charactersWithData = charData.data || [];
          const included = charData.included || [];

          kitsuCharacters = charactersWithData.map((charRelation) => {
            const characterId = charRelation.relationships?.character?.data?.id;
            const characterData = included.find((inc) => 
              inc.id === characterId && 
              (inc.type === "characters" || inc.type === "character")
            );

            // Extract Kitsu voice actors
            const voiceRefs = charRelation.relationships?.voices?.data || [];
            const voiceIds = voiceRefs.map(ref => ref.id);
            const voiceActors = included
              .filter(inc => inc.type === "voices" && voiceIds.includes(inc.id))
              .map(v => {
                const personId = v.relationships?.person?.data?.id;
                const person = included.find(inc => inc.id === personId && inc.type === "people");
                if (person) {
                  return {
                    ...person,
                    attributes: {
                      ...person.attributes,
                      url: `https://kitsu.io/people/${person.id}`
                    }
                  };
                }
                return null;
              })
              .filter(Boolean);

            return { ...charRelation, characterData, voiceActors, source: "kitsu" };
          }).filter(c => c.characterData);
        }

        // Jikan Fallback if Kitsu is empty
        if (kitsuCharacters.length === 0 && extRes.ok) {
          const extData = await extRes.json();
          if (extData.malId) {
            try {
              const jikanRes = await fetch(`https://api.jikan.moe/v4/anime/${extData.malId}/characters`);
              if (jikanRes.ok) {
                const jikanData = await jikanRes.json();
                const jikanChars = (jikanData.data || []).map(jc => ({
                  id: `jikan-${jc.character.mal_id}`,
                  attributes: { role: jc.role },
                  characterData: {
                    attributes: {
                      name: jc.character.name,
                      image: { original: jc.character.images?.jpg?.image_url }
                    }
                  },
                  voiceActors: jc.voice_actors
                    ?.filter(va => va.language === "Japanese")
                    ?.map(va => ({ 
                      attributes: { 
                        name: va.person.name,
                        image: va.person.images?.jpg?.image_url,
                        url: va.person.url
                      } 
                    })),
                  source: "jikan"
                }));
                setCharacters(jikanChars);
              } else {
                setCharacters([]);
              }
            } catch (err) {
              console.error("Jikan fetch error:", err);
              setCharacters([]);
            }
          } else {
            setCharacters([]);
          }
        } else {
          setCharacters(kitsuCharacters);
        }

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          const included = prodData.included || [];
          const enrichedStudios = (prodData.data || [])
            .filter(p => p.attributes?.role === "studio")
            .map(p => {
              const producerId = p.relationships?.producer?.data?.id;
              return included.find(inc => inc.id === producerId);
            })
            .filter(Boolean);
          setStudios(enrichedStudios);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAnimeDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            <Skeleton className="w-full md:w-1/3 lg:w-1/4 aspect-[2/3] rounded-2xl" />
            <div className="flex-1 flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <Skeleton className="h-14 w-3/4 rounded-2xl" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>
              <div className="flex gap-6">
                <Skeleton className="h-4 w-20 rounded-full" />
                <Skeleton className="h-4 w-20 rounded-full" />
                <Skeleton className="h-4 w-20 rounded-full" />
              </div>
              <div className="flex flex-col gap-3">
                <Skeleton className="h-4 w-full rounded-full" />
                <Skeleton className="h-4 w-full rounded-full" />
                <Skeleton className="h-4 w-2/3 rounded-full" />
              </div>
              <Skeleton className="h-14 w-48 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay title="Error" message={error} retryAction={() => router.push("/")} retryText="Back Home" />;
  }

  if (!anime) return null;

  const attr = anime.attributes;
  const title = attr.titles?.en || attr.titles?.en_jp || attr.canonicalTitle;
  const poster = attr.posterImage?.large || attr.posterImage?.small;
  const rating = attr.averageRating ? (parseFloat(attr.averageRating) / 10).toFixed(1) : "N/A";

  return (
    <div className="min-h-screen pb-12 flex flex-col gap-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Poster */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <Image src={poster} alt={title} fill className="object-cover" priority />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/10">
                <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-white">{rating}</span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                {title}
              </h1>
              <div className="flex flex-wrap gap-2 text-sm">
                {attr.showType && <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-500/30">{attr.showType.toUpperCase()}</Badge>}
                {attr.status && <Badge variant="outline" className="border-white/10 text-gray-400">{attr.status.toUpperCase()}</Badge>}
                {attr.episodeCount && <Badge variant="outline" className="border-white/10 text-gray-400">{attr.episodeCount} Episodes</Badge>}
              </div>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                <span>{attr.startDate ? new Date(attr.startDate).getFullYear() : "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4" />
                <span>{attr.episodeLength ? `${attr.episodeLength} min` : "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <FilmIcon className="w-4 h-4" />
                <span>{attr.ageRatingGuide || attr.ageRating}</span>
              </div>
              {attr.popularityRank && (
                <div className="flex items-center gap-2">
                  <div className="px-2 py-0.5 bg-purple-500/10 rounded-lg border border-purple-500/20 flex items-center gap-1.5">
                    <span className="text-purple-400 font-black text-[10px]">RANK</span>
                    <span className="text-white font-bold text-xs">#{attr.popularityRank}</span>
                  </div>
                </div>
              )}
              {attr.ratingRank && (
                <div className="flex items-center gap-2">
                   <div className="px-2 py-0.5 bg-yellow-500/10 rounded-lg border border-yellow-500/20 flex items-center gap-1.5">
                    <span className="text-yellow-400 font-black text-[10px]">TOP</span>
                    <span className="text-white font-bold text-xs">#{attr.ratingRank}</span>
                  </div>
                </div>
              )}
              {studios.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                  <span className="text-purple-400 font-bold tracking-tight">{studios.map(s => s.attributes?.name).join(", ")}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-bold text-white">Synopsis</h3>
              <p className="text-gray-400 leading-relaxed text-lg max-w-3xl">
                {attr.synopsis}
              </p>
            </div>

            <div className="pt-4 flex flex-col gap-8">
              <Button 
                onClick={() => router.push(`/watch/${anime.id}/1`)}
                className="h-14 px-8 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-lg font-bold shadow-lg shadow-purple-900/40 group transition-all flex items-center gap-2 w-fit"
              >
                <PlayCircleIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                Watch Now
              </Button>

              <StreamingLinks animeId={id} />
            </div>
          </div>
        </div>

        {/* Franchise Section */}
        <div className="mt-12">
          <Franchise animeId={id} />
        </div>
      </div>

      {/* Characters */}
      <div className="container mx-auto px-4">
        <Characters characters={characters} />
      </div>

      {/* Quotes Section */}
      <div className="container mx-auto px-4">
        <AnimeQuotes animeId={id} />
      </div>

      {/* Reviews Section */}
      <div className="container mx-auto px-4">
        <Reviews animeId={id} />
      </div>

      {/* Related */}
      {categories.length > 0 && (
        <div className="container mx-auto px-4">
          <RelatedAnime animeId={id} categories={categories} />
        </div>
      )}
    </div>
  );
}
