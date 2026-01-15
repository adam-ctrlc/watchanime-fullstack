"use client";

import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnimeQuotes({ animeId }) {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/v1/anime/${animeId}/quotes`);
        if (!response.ok) {
          // If the API returns an error, just set quotes to empty instead of throwing
          setQuotes([]);
          return;
        }
        const data = await response.json();
        
        const included = data.included || [];
        const enriched = (data.data || []).map(quote => {
          const characterId = quote.relationships?.character?.data?.id;
          const character = included.find(inc => 
            inc.id === characterId && 
            (inc.type === "characters" || inc.type === "character")
          );
          return { ...quote, character };
        });

        setQuotes(enriched);
      } catch (err) {
        console.error("Error fetching quotes:", err);
        setQuotes([]);
      } finally {
        setLoading(false);
      }
    };

    if (animeId) fetchQuotes();
  }, [animeId]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-8 w-48 bg-gray-800/50 rounded-lg animate-pulse" />
        <div className="h-24 bg-gray-800/50 rounded-2xl animate-pulse border border-white/5" />
      </div>
    );
  }

  if (quotes.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Quote className="w-6 h-6 text-purple-500" />
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Memorable Quotes</h2>
      </div>

      <div className="flex flex-col gap-4">
        {quotes.map((quote) => {
          const charName = quote.character?.attributes?.name || "Unknown Character";
          const text = quote.attributes?.content;

          return (
            <div 
              key={quote.id} 
              className="bg-[#121212]/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col gap-2 relative overflow-hidden group"
            >
              <Quote className="absolute -top-2 -right-2 w-20 h-20 text-white/5 group-hover:text-purple-500/10 transition-colors" />
              <p className="text-gray-200 text-lg md:text-xl font-medium leading-relaxed italic z-10">
                "{text}"
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-6 h-0.5 bg-purple-500" />
                <span className="text-sm font-bold text-purple-400 uppercase tracking-widest">
                  {charName}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
