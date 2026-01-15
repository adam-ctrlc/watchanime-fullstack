"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StreamingLinks({ animeId }) {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/v1/anime/${animeId}/streaming-links`);
        if (!response.ok) throw new Error("Failed to fetch streaming links");
        const data = await response.json();
        
        const included = data.included || [];
        const enriched = (data.data || []).map(link => {
          const streamerId = link.relationships?.streamer?.data?.id;
          const streamer = included.find(inc => inc.id === streamerId);
          return { ...link, streamer };
        });

        setLinks(enriched);
      } catch (err) {
        console.error("Error fetching streaming links:", err);
      } finally {
        setLoading(false);
      }
    };

    if (animeId) fetchLinks();
  }, [animeId]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-4 w-32 bg-gray-800/50 rounded animate-pulse" />
        <div className="flex flex-wrap gap-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-10 w-28 bg-gray-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (links.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
        <Tv className="w-4 h-4" />
        Watch Officially
      </h3>
      <div className="flex flex-wrap gap-3">
        {links.map((link) => {
          const streamerName = link.streamer?.attributes?.siteName || "Official Stream";
          const url = link.attributes?.url;

          if (!url) return null;

          return (
            <Button
              key={link.id}
              asChild
              variant="outline"
              size="sm"
              className="bg-white/5 hover:bg-white/10 border-white/10 text-white rounded-xl flex items-center gap-2 transition-all hover:border-purple-500/50"
            >
              <a href={url} target="_blank" rel="noopener noreferrer">
                <span className="font-bold">{streamerName}</span>
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
