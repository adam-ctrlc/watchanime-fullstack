"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star, MessageSquare, ThumbsUp, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

function ReviewCard({ review }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const user = review.user?.attributes;
  const attr = review.attributes;

  const rawContent = attr.content.replace(/<[^>]*>?/gm, "");
  const isLong = rawContent.length > 300;
  const displayedText = isExpanded ? rawContent : rawContent.slice(0, 300);

  const formatContent = (text) => {
    if (!text) return null;

    // Split by double asterisks for bolding
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        // Remove the asterisks and wrap in strong tag
        return (
          <strong key={i} className="font-black text-white decoration-purple-500/30">
            {part.slice(2, -2)}
          </strong>
        );
      }
      
      // Handle newlines within the text parts
      if (part.includes("\n")) {
        return part.split("\n").map((line, j, arr) => (
          <span key={`${i}-${j}`}>
            {line}
            {j < arr.length - 1 && <br />}
          </span>
        ));
      }

      return part;
    });
  };

  return (
    <div className="group bg-[#121212]/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 flex flex-col gap-4 shadow-xl hover:border-white/10 transition-colors h-fit">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-800 border border-white/10">
            {user?.avatar?.tiny ? (
              <Image
                src={user.avatar.tiny}
                alt={user.name || "User"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-500" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
              {user?.name || "Anonymous User"}
            </span>
            <span className="text-[10px] text-gray-500">
              {new Date(attr.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-lg border border-yellow-400/20">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-black text-yellow-500">
            {attr.rating || "?"}
          </span>
        </div>
      </div>

      <div className="relative flex flex-col gap-3">
        <div className={`text-gray-300 text-sm leading-relaxed ${isExpanded ? "whitespace-pre-line" : ""}`}>
          {formatContent(displayedText)}
          {!isExpanded && isLong && <span className="text-purple-400">...</span>}
        </div>
        {isLong && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-purple-400 hover:text-purple-300 text-xs font-black uppercase tracking-widest w-fit mt-2 py-1 px-3 bg-purple-500/5 rounded-lg border border-purple-500/10 transition-all hover:bg-purple-500/10"
          >
            {isExpanded ? "Show Less" : "Read Full Review"}
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-gray-500 bg-white/5 px-2 py-1 rounded-lg">
          <ThumbsUp className="w-3.5 h-3.5" />
          <span className="text-xs font-bold">{attr.likesCount}</span>
        </div>
        {attr.spoiler && (
          <Badge
            variant="destructive"
            className="text-[10px] uppercase font-black px-1.5 py-0"
          >
            Spoiler
          </Badge>
        )}
      </div>
    </div>
  );
}

export default function Reviews({ animeId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/v1/anime/${animeId}/reviews?limit=6`
        );
        if (!response.ok) throw new Error("Failed to fetch reviews");
        const data = await response.json();

        const included = data.included || [];
        const enriched = (data.data || []).map((review) => {
          const userId = review.relationships?.user?.data?.id;
          const user = included.find(
            (inc) => inc.id === userId && inc.type === "users"
          );
          return { ...review, user };
        });

        setReviews(enriched);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    if (animeId) fetchReviews();
  }, [animeId]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-8 w-48 bg-gray-800/50 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="h-48 bg-gray-800/50 rounded-3xl animate-pulse border border-white/5"
            />
          ))}
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Community Reviews
          </h2>
        </div>
        <div className="bg-[#121212]/40 backdrop-blur-md border border-white/5 rounded-3xl p-12 text-center shadow-xl">
          <MessageSquare className="w-12 h-12 text-gray-700 mx-auto mb-4 opacity-50" />
          <p className="text-gray-400 font-medium">
            There are no community reviews for this anime yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-purple-500" />
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Community Reviews
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
