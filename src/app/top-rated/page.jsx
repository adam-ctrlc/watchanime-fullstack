"use client";
import { Suspense } from "react";
import AnimePaginatedList from "@/components/features/anime/AnimePaginatedList";
import LoadingSpinner from "@/components/status/LoadingSpinner";

export default function TopRatedAnimePage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[50vh]">
          <LoadingSpinner size="large" />
        </div>
      }
    >
      <AnimePaginatedList
        title="Top Rated Anime"
        endpoint="/top-rated"
        apiParams={{}}
        itemsPerPage={24}
      />
    </Suspense>
  );
}
