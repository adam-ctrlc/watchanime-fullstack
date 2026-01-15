"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Layers } from "lucide-react";

export default function Franchise({ animeId }) {
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFranchise = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/v1/anime/${animeId}/franchise`);
        if (!response.ok) throw new Error("Failed to fetch franchise");
        const data = await response.json();
        
        // Extract destination data from included
        const included = data.included || [];
        const enriched = (data.data || []).map(rel => {
          const destId = rel.relationships?.destination?.data?.id;
          const destination = included.find(inc => inc.id === destId && inc.type === "anime");
          return { ...rel, destination };
        }).filter(rel => rel.destination); // Only keep anime relationships

        setRelationships(enriched);
      } catch (err) {
        console.error("Error fetching franchise:", err);
      } finally {
        setLoading(false);
      }
    };

    if (animeId) fetchFranchise();
  }, [animeId]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-8 w-48 bg-gray-800/50 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-800/50 rounded-2xl animate-pulse border border-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (relationships.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Layers className="w-6 h-6 text-purple-500" />
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Franchise</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {relationships.map((rel) => {
          const dest = rel.destination;
          const attr = dest.attributes;
          const title = attr.titles?.en || attr.titles?.en_jp || attr.canonicalTitle;
          const poster = attr.posterImage?.tiny || attr.posterImage?.small;
          const role = rel.attributes?.role?.replace(/_/g, " ");

          return (
            <Link 
              key={rel.id} 
              href={`/detail/${dest.id}`}
              className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/50 rounded-2xl p-3 transition-all overflow-hidden"
            >
              <div className="relative w-14 h-20 flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                <Image 
                  src={poster} 
                  alt={title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <Badge variant="outline" className="w-fit text-[10px] uppercase font-black bg-purple-600/10 text-purple-400 border-purple-500/20 px-1.5 py-0">
                  {role}
                </Badge>
                <h3 className="text-sm font-bold text-white truncate group-hover:text-purple-400 transition-colors">
                  {title}
                </h3>
                <p className="text-[10px] text-gray-500 font-medium">
                  {attr.showType?.toUpperCase()} • {attr.startDate ? new Date(attr.startDate).getFullYear() : "N/A"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
